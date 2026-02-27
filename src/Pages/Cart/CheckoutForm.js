import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../AuthContext";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../Components/firebase";
import "./CheckoutForm.css";
import sendNotificationOrder from "../../Components/Notifications/sendNotificationOrder";
import useCreatePaymentIntent from "../../CloudFunctions/useCreatePaymentIntent";
import PurchaseCompleteOverlay from "../../Components/Overlays/PurchaseCompleteOverlay";

const stripePromise = loadStripe("pk_test_51JN8mDDR30hjV6c2f6WkKbqaLIJ91qsbyfK9Ho1Ge3hCwL2b3aZnWim7Ew9RhfprRoiInPWDRsXC8gqcdW6v4ST700vBUAakpE"); // Replace with your Stripe key

function CheckoutFormInner() {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [showOverlay, setShowOverlay] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const { createPaymentIntent, loading: paymentLoading, error: paymentError } = useCreatePaymentIntent();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    billingFullName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    useBillingAsShipping: false,
  });

  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch cart items
  useEffect(() => {
    if (!currentUser) return;
    const cartRef = collection(db, "Users", currentUser.uid, "cart");
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Copy billing info to shipping if toggle is ON
  useEffect(() => {
    if (formData.useBillingAsShipping) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.billingFullName,
        address: prev.billingAddress,
        city: prev.billingCity,
        state: prev.billingState,
        zip: prev.billingZip,
      }));
    }
  }, [
    formData.billingFullName,
    formData.billingAddress,
    formData.billingCity,
    formData.billingState,
    formData.billingZip,
    formData.useBillingAsShipping,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parsePrice = (price) => Number(price.toString().replace("$", "")) || 0;
  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0);
  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  const submitPayment = async () => {
    if (!stripe || !elements) {
      setMessage("Stripe is not loaded yet.");
      return;
    }

    if (!currentUser) {
      setMessage("You must be logged in.");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    try {
      setMessage("Processing payment...");

      const clientSecret = await createPaymentIntent(Math.round(total * 100), "usd");
      if (!clientSecret) throw new Error(paymentError || "Failed to create PaymentIntent");

      // 2️⃣ Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.billingFullName,
              email: formData.email,
              address: {
                line1: formData.billingAddress,
                city: formData.billingCity,
                state: formData.billingState,
                postal_code: formData.billingZip,
              },
            },
          },
        }
      );

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!paymentIntent || !paymentIntent.id) {
        throw new Error("Payment failed: No PaymentIntent returned.");
      }

      // Fetch last4 from server
      const pmResponse = await fetch("https://getpaymentmethod-k3qu3645ya-uc.a.run.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
      });

      const pmData = await pmResponse.json();
      const lastFour = pmData.last4 || "N/A";

      if (paymentIntent.status !== "succeeded") {
        setMessage("Payment was not successful.");
        return;
      }
      

      // 3️⃣ Create Orders in Firestore
      for (let item of cartItems) {
        if (!item.postId) continue;

        const postRef = doc(db, "Posts", item.postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) continue;

        const postData = postSnap.data();

        const orderRef = doc(collection(db, "Orders"));

        let orderData = {
          type: item.type || "",
          deliveryInfo: {
            fullName: formData.fullName || "",
            email: formData.email || "",
            address: formData.address || "",
            city: formData.city || "",
            state: formData.state || "",
            zip: formData.zip || "",
          },
          sellerInfo: {
            sellerId: postData.userId || "",
            sellerMarkedCompleted: false,
            sellerDispute: false,
          },
          buyerInfo: {
            buyerId: currentUser.uid,
            buyerMarkedCompleted: false,
            buyerDispute: false,
          },
          postData: {
            postId: item.postId,
            title: postData.title || "Untitled",
            description: postData.description || "",
            images: postData.images || [],
          },
          paymentInfo: {
            paymentSuccessful: true,
            stripePaymentIntentId: paymentIntent.id,
            paymentMethod: "Card",
            lastFour: lastFour,
            payoutTransfer: false,
          },
          price: parsePrice(postData.price),
          orderCreated: serverTimestamp(),
          orderStatus: "pending",
        };

        if (item.type === "market") {
          orderData.marketSpecific = {
            condition: postData.condition || "",
            shippingTime: postData.shippingTime || "",
            carrier: "",
            trackingNumber: "",
          };
        }

        if (item.type === "directory") {
          orderData.directorySpecific = {
            serviceLocation: postData.serviceLocation || "",
            businessAddress: postData.businessAddress || "",
          };
        }

        if (item.type === "offer") {
          const originalPostRef = doc(db, "Posts", postData.originalPost);
          const originalPostSnap = await getDoc(originalPostRef);

          orderData.offerSpecific = {
            originalPostId: postData.originalPost || "",
            originalPostObject: originalPostSnap.exists()
              ? { id: originalPostSnap.id, ...originalPostSnap.data() }
              : null,
          };
        }

        await setDoc(orderRef, orderData);

        await sendNotificationOrder({
          sellerId: postData.userId,
          fromId: currentUser.uid,
          postId: item.postId,
        });

        await deleteDoc(doc(db, "Users", currentUser.uid, "cart", item.id));
      }

      setMessage("");
      setPaymentComplete(true);
      setShowOverlay(true);
    } catch (err) {
      console.error("Payment error:", err);
      setMessage(err.message || "Payment failed.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitPayment();
  };

  return (
    <form className="cb-checkout-body" onSubmit={handleSubmit}>
      <h3 className="cb-checkout-title">Checkout</h3>

      {/* Delivery Info */}
      <div className="cb-section">
        <h4 className="cb-section-title">Delivery Information</h4>
        <label className="cb-toggle-label">
          <span>Optional - Use only if seller needs an address.</span>
          <div className="cb-toggle">
            <input
              type="checkbox"
              checked={formData.useBillingAsShipping}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  useBillingAsShipping: e.target.checked,
                  fullName: e.target.checked ? prev.billingFullName : "",
                  email: e.target.checked ? prev.email : "",
                  address: e.target.checked ? prev.billingAddress : "",
                  city: e.target.checked ? prev.billingCity : "",
                  state: e.target.checked ? prev.billingState : "",
                  zip: e.target.checked ? prev.billingZip : "",
                }))
              }
            />
            <span className="cb-slider"></span>
          </div>
        </label>

        {formData.useBillingAsShipping && (
          <div className="cb-fields-with-line">
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} required />
            <div className="cb-two-col">
              <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
              <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
            </div>
            <input type="text" name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleChange} required />
          </div>
        )}
      </div>

      {/* Billing Info */}
      <div className="cb-section">
        <h4 className="cb-section-title">Billing Information</h4>
        <div className="cb-fields-with-line">
          <input type="text" name="billingFullName" placeholder="Billing Full Name" value={formData.billingFullName} onChange={handleChange} required />
          <input type="text" name="billingAddress" placeholder="Billing Street Address" value={formData.billingAddress} onChange={handleChange} required />
          <div className="cb-two-col">
            <input type="text" name="billingCity" placeholder="Billing City" value={formData.billingCity} onChange={handleChange} required />
            <input type="text" name="billingState" placeholder="Billing State" value={formData.billingState} onChange={handleChange} required />
          </div>
          <input type="text" name="billingZip" placeholder="Billing ZIP" value={formData.billingZip} onChange={handleChange} required />
        </div>
      </div>

      {/* Payment Info */}
      <div className="cb-section">
        <h4 className="cb-section-title">Payment Information</h4>
        <div className="cb-card-light">
          <CardElement options={{ style: cardStyleLight }} />
        </div>
      </div>

      {/* Order Summary */}
      <div className="cb-section cb-order-summary">
        <div className="cb-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="cb-row">
          <span>Taxes & Fees:</span>
          <span>${taxes.toFixed(2)}</span>
        </div>
        <hr />
        <div className="cb-row cb-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button type="submit" className="cb-submit-btn" disabled={!stripe || paymentLoading || paymentComplete}>
        {paymentLoading ? "Processing..." : "Pay Now"}
      </button>

      {message && (
        <p style={{ marginTop: "15px", color: message.startsWith("Error") ? "#ff6b6b" : "#00AA00" }}>
          {message}
        </p>
      )}

      {showOverlay && (
        <PurchaseCompleteOverlay onClose={() => setShowOverlay(false)} />
      )}
    </form>
  );
}

export default function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner />
    </Elements>
  );
}

const cardStyleLight = {
  style: {
    base: {
      color: "#000000",
      iconColor: "#000000",
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      lineHeight: "24px",
      "::placeholder": { color: "#555" },
      caretColor: "#000000",
      "::selection": { color: "#fff", backgroundColor: "#000" },
      ":-webkit-autofill": { color: "#000000" },
    },
    invalid: {
      color: "#ff0000",
      iconColor: "#ff0000",
    },
  },
};
