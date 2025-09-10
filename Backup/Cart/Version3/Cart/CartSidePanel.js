import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Components/firebase";
import "./CartSidePanel.css";

const stripePromise = loadStripe("pk_test_XXXX"); // Replace with your Stripe key

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();

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

    const cardElement = elements.getElement(CardElement);

    const billing = {
      name: formData.billingFullName,
      email: formData.email,
      address: {
        line1: formData.billingAddress,
        city: formData.billingCity,
        state: formData.billingState,
        postal_code: formData.billingZip,
      },
    };

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: billing,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Success! Payment method created.");
      console.log(paymentMethod);
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

      <button type="submit" className="cb-submit-btn" disabled={!stripe}>
        Pay Now
      </button>

      {message && (
        <p style={{ marginTop: "15px", color: message.startsWith("Error") ? "#ff6b6b" : "#00AA00" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default function CartSidePanel() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
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
