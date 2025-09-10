import React, { useState, forwardRef, useEffect } from "react";
import "./CheckoutBody.css";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "../../AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Components/firebase";

const CheckoutBody = forwardRef(() => {
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
    useShippingAsBilling: true,
  });

  const [message, setMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const cartRef = collection(db, "Users", currentUser.uid, "cart");
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (formData.useShippingAsBilling) {
      setFormData((prev) => ({
        ...prev,
        billingFullName: prev.fullName,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingState: prev.state,
        billingZip: prev.zip,
      }));
    }
  }, [formData.fullName, formData.address, formData.city, formData.state, formData.zip, formData.useShippingAsBilling]);

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
    <div className="cb-checkout-body">
      <h3 className="cb-checkout-title">Checkout</h3>

      <form className="cb-checkout-form" onSubmit={handleSubmit}>
        {/* Shipping Info */}
        <div className="cb-section">
          <h4 className="cb-section-title">Delivery Information</h4>
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} required />
          <div className="cb-two-col">
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
            <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
          </div>
          <input type="text" name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleChange} required />
        </div>

        {/* Billing Info */}
        <div className="cb-section">
          <h4 className="cb-section-title">Billing Information</h4>

          <label className="cb-toggle-label">
            <span>Use shipping info as billing info</span>
            <div className="cb-toggle">
              <input
                type="checkbox"
                checked={formData.useShippingAsBilling}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, useShippingAsBilling: e.target.checked }))
                }
              />
              <span className="cb-slider"></span>
            </div>
          </label>

          {!formData.useShippingAsBilling && (
            <div className="cb-billing-fields">
              <input type="text" name="billingFullName" placeholder="Billing Full Name" value={formData.billingFullName} onChange={handleChange} />
              <input type="text" name="billingAddress" placeholder="Billing Street Address" value={formData.billingAddress} onChange={handleChange} />
              <div className="cb-two-col">
                <input type="text" name="billingCity" placeholder="Billing City" value={formData.billingCity} onChange={handleChange} />
                <input type="text" name="billingState" placeholder="Billing State" value={formData.billingState} onChange={handleChange} />
              </div>
              <input type="text" name="billingZip" placeholder="Billing ZIP" value={formData.billingZip} onChange={handleChange} />
            </div>
          )}
        </div>

        {/* Payment Info */}
        <div className="cb-section">
          <h4 className="cb-section-title">Payment Information</h4>
          <div className="cb-card-element cb-card-light">
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
      </form>

      {message && (
        <p style={{ marginTop: "15px", color: message.startsWith("Error") ? "#ff6b6b" : "#00AA00" }}>
          {message}
        </p>
      )}
    </div>
  );
});

export default CheckoutBody;

// Stripe CardElement light style
const cardStyleLight = {
  style: {
    base: {
      color: "#000000",             // black text
      iconColor: "#000000",         // black icons
      backgroundColor: "#ffffff",   // white background inside iframe
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      lineHeight: "24px",
      "::placeholder": { color: "#555" }, // dark gray placeholder
      caretColor: "#000000",        // blinking cursor black
      "::selection": { color: "#fff", backgroundColor: "#000" },
      ":-webkit-autofill": { color: "#000000" },
    },
    invalid: {
      color: "#ff0000",
      iconColor: "#ff0000",
    },
  },
};
