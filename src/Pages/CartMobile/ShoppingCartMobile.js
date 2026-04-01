import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { db } from "../../Components/firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import sendNotificationOrder from "../../Components/Notifications/sendNotificationOrder";
import PurchaseCompleteOverlay from "../../Components/Overlays/PurchaseCompleteOverlay";
import useCreateSquarePayment from "../../CloudFunctions/useCreateSquarePayment";
import "./ShoppingCartMobile.css";
import SellerRating from "../../Components/Reviews/SellerRating";

export default function ShoppingCartMobile() {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [message, setMessage] = useState("");
  const [card, setCard] = useState(null);

  const {
    processPayment,
    loading: paymentLoading,
    SQUARE_APPLICATION_ID,
    SQUARE_LOCATION_ID,
  } = useCreateSquarePayment();

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

  // Load cart items
  useEffect(() => {
    if (!currentUser) return;

    const cartRef = collection(db, "Users", currentUser.uid, "cart");

    const unsubscribe = onSnapshot(cartRef, async (snapshot) => {
      const items = [];

      for (const d of snapshot.docs) {
        const data = d.data();

        // 1. ACTIVE CLEANUP: Check if postId exists in the cart entry
        if (!data.postId) {
          await deleteDoc(doc(db, "Users", currentUser.uid, "cart", d.id));
          continue;
        }

        // 2. VALIDATION: Check if the actual Post document still exists in Firestore
        const postRef = doc(db, "Posts", data.postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          await deleteDoc(doc(db, "Users", currentUser.uid, "cart", d.id));
          continue;
        }

        const postData = postSnap.data();
        const sellerId = postData.userId;

        // 3. SELLER CONTEXT: Fetch seller name and avatar
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
          sellerId,
          sellerName,
          sellerAvatar,
          postType: postData.type || "offer",
          ...data,
        });
      }

      setCartItems(items);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Copy billing info to shipping if toggle is on
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

  const parsePrice = (price) => Number(price?.toString().replace("$", "")) || 0;
  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0);
  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  // Square card init
  useEffect(() => {
    if (!SQUARE_APPLICATION_ID || !SQUARE_LOCATION_ID || total <= 0) return;
    const cardContainer = document.querySelector("#mobile-card-container");
    if (!cardContainer) return;

    async function initSquare() {
      if (!window.Square) return console.error("Square SDK not loaded");
      const payments = window.Square.payments(SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID);
      const cardInstance = await payments.card();
      await cardInstance.attach("#mobile-card-container");
      setCard(cardInstance);
    }

    initSquare();
  }, [SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID, total]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemove = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, "Users", currentUser.uid, "cart", id));
  };

  const getPostLink = (type, postId) => {
    switch (type) {
      case "market":
        return `/marketpost/${postId}`;
      case "directory":
        return `/directorypost/${postId}`;
      case "offer":
        return `/offerpost/${postId}`;
      case "trucks":
        return `/truckpost/${postId}`;
      default:
        return `/${type}post/${postId}`;
    }
  };

  const submitPayment = async () => {
    if (!currentUser) {
      setMessage("You must be logged in.");
      return;
    }
    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    // FREE ORDER
    if (total <= 0) {
      try {
        setMessage("Processing free order...");
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
              fullName: formData.fullName,
              email: formData.email,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
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
              squarePaymentId: null,
              paymentMethod: "Free",
              lastFour: null,
              payoutTransfer: false,
            },
            price: item.type === "trucks" ? item.price : parsePrice(postData.price),
            affiliateLinkId: item.affiliateLinkId || null,
            affiliatePayoutTransfer: false,
            orderCreated: serverTimestamp(),
            orderStatus: "pending",
          };

          // TYPE-SPECIFIC DATA
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
          if (item.type === "trucks") {
            orderData.trucksSpecific = {
              pickupAddress: item.freightBookingInfo?.pickupAddress || "",
              dropoffAddress: item.freightBookingInfo?.dropoffAddress || "",
              loadWeight: item.freightBookingInfo?.loadWeight || 0,
              loadLength: item.freightBookingInfo?.loadLength || 0,
              additionalInfo: item.freightBookingInfo?.additionalInfo || "",
              rpm: item.freightBookingInfo?.rpm || 0,
              distance: item.freightBookingInfo?.distance || 0,
              images: item.freightBookingInfo?.images || [],
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
        return;
      } catch (err) {
        console.error("Free order error:", err);
        setMessage("Failed to process free order.");
        return;
      }
    }

    // PAID ORDER
    try {
      setMessage("Processing payment...");
      if (!card) {
        setMessage("Card form not ready");
        return;
      }
      const result = await card.tokenize();
      if (result.status !== "OK") {
        setMessage("Card tokenization failed");
        return;
      }
      const payment = await processPayment({
        amount: Math.round(total * 100),
        nonce: result.token,
      });
      if (!payment) {
        setMessage("Payment failed");
        return;
      }
      const lastFour = payment.cardDetails?.card?.last4 || "N/A";

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
            fullName: formData.fullName,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
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
            squarePaymentId: payment.id,
            paymentMethod: "Card",
            lastFour: lastFour,
            payoutTransfer: false,
          },
          price: item.type === "trucks" ? item.price : parsePrice(postData.price),
          affiliateLinkId: item.affiliateLinkId || null,
          affiliatePayoutTransfer: false,
          orderCreated: serverTimestamp(),
          orderStatus: "pending",
        };

        // TYPE-SPECIFIC DATA
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
        if (item.type === "trucks") {
          orderData.trucksSpecific = {
            pickupAddress: item.freightBookingInfo?.pickupAddress || "",
            dropoffAddress: item.freightBookingInfo?.dropoffAddress || "",
            loadWeight: item.freightBookingInfo?.loadWeight || 0,
            loadLength: item.freightBookingInfo?.loadLength || 0,
            additionalInfo: item.freightBookingInfo?.additionalInfo || "",
            rpm: item.freightBookingInfo?.rpm || 0,
            distance: item.freightBookingInfo?.distance || 0,
            images: item.freightBookingInfo?.images || [],
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
    <div className="mobile-cart-page">
      <h2 className="mobile-cart-title">Shopping Cart</h2>

      <div className="mobile-cart-items">
        {cartItems.length === 0 && <p className="mobile-cart-empty">Your cart is empty.</p>}
        {cartItems.map((item) => (
          <div key={item.id} className="mobile-cart-item">
            {/* Remove item */}
            <div className="mobile-cart-remove" onClick={() => handleRemove(item.id)}>
              <FaTimes />
            </div>

            {/* ADDED: Seller Info Header (Matches Desktop Logic) */}
            <div className="mobile-seller-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
              <img
                src={item.sellerAvatar}
                alt={item.sellerName}
                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
              />
              <div className="mobile-seller-details">
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.sellerName}</div>
                <SellerRating userId={item.sellerId} />
              </div>
            </div>

            {/* Product Info */}
            <div className="mobile-cart-content" style={{ display: 'flex', gap: '15px' }}>
              <Link to={getPostLink(item.type, item.postId)}>
                <img src={item.image} alt={item.title} className="mobile-cart-image" />
              </Link>
              <div className="mobile-cart-info">
                <Link to={getPostLink(item.type, item.postId)} className="mobile-cart-item-title">
                  {item.title}
                </Link>
                <span className="mobile-cart-item-price">${parsePrice(item.price).toFixed(2)}</span>
                <span className="mobile-cart-item-type">{item.postType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className="mobile-checkout-form" onSubmit={handleSubmit}>
        <h3 className="mobile-checkout-form-title">Checkout</h3>

        <div className="mobile-form-group">
          <label className="mobile-form-label">Full Name</label>
          <input className="mobile-form-input" name="billingFullName" value={formData.billingFullName} onChange={handleChange} required />
        </div>

        <div className="mobile-form-group">
          <label className="mobile-form-label">Address</label>
          <input className="mobile-form-input" name="billingAddress" value={formData.billingAddress} onChange={handleChange} required />
        </div>

        <div className="mobile-form-group-two">
          <input className="mobile-form-input" name="billingCity" placeholder="City" value={formData.billingCity} onChange={handleChange} required />
          <input className="mobile-form-input" name="billingState" placeholder="State" value={formData.billingState} onChange={handleChange} required />
        </div>

        <div className="mobile-form-group">
          <input className="mobile-form-input" name="billingZip" placeholder="ZIP" value={formData.billingZip} onChange={handleChange} required />
        </div>

        {total > 0 && <div id="mobile-card-container" className="mobile-card-container"></div>}

        <div className="mobile-order-summary">
          <div className="mobile-order-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mobile-order-row">
            <span>Taxes & Fees:</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <div className="mobile-order-row mobile-order-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          className={`mobile-checkout-button ${((total > 0 && !card) || paymentLoading || paymentComplete) ? 'mobile-checkout-button-disabled' : ''}`}
          disabled={(total > 0 && !card) || paymentLoading || paymentComplete}
        >
          {paymentLoading ? "Processing..." : "Pay Now"}
        </button>
        {message && <p className="mobile-order-message">{message}</p>}
      </form>

      {showOverlay && <PurchaseCompleteOverlay onClose={() => setShowOverlay(false)} />}
    </div>
  );
}