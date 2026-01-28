import React, { useEffect, useState } from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./CartBody.css";
import { db } from "../../Components/firebase";
import { collection, onSnapshot, deleteDoc, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../AuthContext";

export default function CartBody() {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const cartRef = collection(db, "Users", currentUser.uid, "cart");

    const unsubscribe = onSnapshot(cartRef, async (snapshot) => {
    
    const items = [];

    for (const d of snapshot.docs) {
      const data = d.data();

      if (!data.postId) {
        await deleteDoc(doc(db, "Users", currentUser.uid, "cart", d.id));
        continue;
      }

      // Get the post
      const postRef = doc(db, "Posts", data.postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        await deleteDoc(doc(db, "Users", currentUser.uid, "cart", d.id));
        continue;
      }

      const postData = postSnap.data();
      const postType = postData.type || "offer";
      const sellerId = postData.userId; // get sellerId from post

      // Get the seller user document
      let sellerName = "Unknown Seller";
      let sellerAvatar = `${process.env.PUBLIC_URL}/default-profile.png`;

      if (sellerId) {
        const userRef = doc(db, "Users", sellerId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          sellerName = userData.username || sellerName;
          sellerAvatar = userData.profilepic || sellerAvatar;
        }
      }

      items.push({
        id: d.id,
        postType,
        sellerName,
        sellerAvatar,
        ...data,
      });
    }

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

  const getSellerLabel = (type) => {
  switch (type) {
    case "market":
      return "Market";
    case "directory":
      return "Directory";
    case "offer":
    default:
      return "Offer";
  }
};

const getPostLink = (type, postId) => {
  switch (type) {
    case "market":
      return `/marketpost/${postId}`;
    case "directory":
      return `/directorypost/${postId}`;
    case "offer":
    default:
      return `/offerpost/${postId}`;
  }
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
              {/* Remove item */}
              <div className="cart-remove" onClick={() => handleRemove(item.id)}>
                <FaTimes />
              </div>

              {/* Seller info */}
              <div className="cart-top">
                <img
                  src={item.sellerAvatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                  alt={item.sellerName || "Seller"}
                  className="seller-avatar"
                />
                <div className="seller-info">
                  <span className="seller-name">{item.sellerName || "Unknown Seller"}</span>
                  <span className="seller-market">{getSellerLabel(item.postType)}</span>
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

              {/* Product info */}
              <div className="cart-content">
                <Link to={getPostLink(item.postType, item.postId)}>
                  <img src={item.image} alt={item.title} className="product-image" />
                </Link>

                <div className="product-info">
                  <Link
                    to={getPostLink(item.postType, item.postId)}
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
