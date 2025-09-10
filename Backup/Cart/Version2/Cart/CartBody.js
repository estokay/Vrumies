import React, { useEffect, useState } from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link
import "./CartBody.css";
import { db } from "../../Components/firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../../AuthContext";

export default function CartBody() {
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

  const handleRemove = async (itemId) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, "Users", currentUser.uid, "cart", itemId));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const parsePrice = (price) => {
    if (!price) return 0;
    return Number(price.toString().replace("$", "")) || 0;
  };

  return (
    <div className="cart-body">
      <h3 className="cart-title">CART ITEMS:</h3>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => {
          const priceNumber = parsePrice(item.price);
          return (
            <div className="cart-item" key={item.id}>
              <div className="cart-remove" onClick={() => handleRemove(item.id)}>
                <FaTimes />
              </div>
              <div className="cart-top">
                <img
                  src={item.sellerAvatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                  alt={item.sellerName || "Seller"}
                  className="seller-avatar"
                />
                <div className="seller-info">
                  <span className="seller-name">{item.sellerName || "Unknown Seller"}</span>
                  <span className="seller-market">Market</span>
                  <div className="stars">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <FaStar key={i} color="#f6c61d" />
                      ))}
                    <span className="review-count">{item.reviews || 0} Reviews</span>
                  </div>
                </div>
              </div>
              <div className="cart-content">
                {/* Image as link */}
                <Link to={`/eventpost/${item.postId}`}>
                  <img src={item.image} alt={item.title} className="product-image" />
                </Link>

                <div className="product-info">
                  {/* Title as link with inline style for white color */}
                  <Link
                    to={`/eventpost/${item.postId}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    {item.title}
                  </Link>
                  <span className="product-price">${priceNumber.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
