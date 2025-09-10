import React, { useEffect, useState } from "react";
import "./CartSidePanel.css";
import { useAuth } from "../../AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Components/firebase";

export default function CartSidePanel() {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const cartRef = collection(db, "Users", currentUser.uid, "cart");
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const parsePrice = (price) => {
    if (!price) return 0;
    return Number(price.toString().replace("$", "")) || 0;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0);
  const taxes = subtotal * 0.15; // Example: 15% tax
  const total = subtotal + taxes;

  return (
    <div className="cart-side-panel">
      <div className="row">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="row">
        <span>Taxes & Fees:</span>
        <span>${taxes.toFixed(2)}</span>
      </div>
      <hr />
      <div className="row total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button className="checkout-btn">Checkout</button>
    </div>
  );
}
