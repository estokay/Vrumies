import React, { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { doc, getDoc, updateDoc, onSnapshot, deleteField } from 'firebase/firestore';
import './QuotePostLayout.css';
import useUserAverageRating from "../../../Components/Reviews/useUserAverageRating";
import { auth } from '../../../Components/firebase';

function QuotePostLayout({
  images,
  createdAt,
  userId,
  additionalInfo,
  vehicleInfo,
  quotePrice,
  sellerUserId,
  directoryPostId,
  requestedQuoteId,
  onSelectQuote,
  onAddQuoteToCart,
}) {

  const [profilePic, setProfilePic] = useState(
    `${process.env.PUBLIC_URL}/default-profile.png`
  );

  const currentUser = auth.currentUser;
  const currentUserId = currentUser?.uid;

  const [priceInput, setPriceInput] = useState("");
  const [liveQuotePrice, setLiveQuotePrice] = useState(quotePrice);
  const [isResponded, setIsResponded] = useState(false);
  const [username, setUsername] = useState("Unknown");

  const averageRating = useUserAverageRating(userId);

  const formattedDate = createdAt
    ? new Date(createdAt.seconds * 1000).toLocaleDateString()
    : 'Date not available';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setUsername(data.username || "Unknown");

          setProfilePic(
            data.profilepic ||
            `${process.env.PUBLIC_URL}/default-profile.png`
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (!directoryPostId || !requestedQuoteId) return;

    const quoteRef = doc(
      db,
      "Posts",
      directoryPostId,
      "Requested Quotes",
      requestedQuoteId
    );

    const unsubscribe = onSnapshot(quoteRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();

        const price = data.quotePrice || "";

        setLiveQuotePrice(price);

        setIsResponded(price !== undefined && price !== null && price !== "");
      }
    });

    return () => unsubscribe();
  }, [directoryPostId, requestedQuoteId]);

  const vehicleTitle = vehicleInfo
    ? `${vehicleInfo.year || ''} ${vehicleInfo.make || ''} ${vehicleInfo.model || ''} ${vehicleInfo.trim || ''}`
    : 'Vehicle Not Provided';

  const isSeller = currentUserId === sellerUserId;

  const isRequester = currentUserId === userId;

  const handleRespond = async () => {
    if (!priceInput) return;

    try {
      const quoteRef = doc(
        db,
        "Posts",
        directoryPostId,
        "Requested Quotes",
        requestedQuoteId
      );

      await updateDoc(quoteRef, {
        quotePrice: Number(priceInput)
      });

      setPriceInput(""); // reset input after save

    } catch (error) {
      console.error("Error saving quote price:", error);
    }
  };

  const handleCancelQuote = async () => {
    try {
      const quoteRef = doc(
        db,
        "Posts",
        directoryPostId,
        "Requested Quotes",
        requestedQuoteId
      );

      await updateDoc(quoteRef, {
        quotePrice: deleteField()
      });

      // reset local UI state
      setLiveQuotePrice("");
      setIsResponded(false);

    } catch (error) {
      console.error("Error canceling quote:", error);
    }
  };

  return (
    <div className="quote-post-layout">

      {/* Header */}
      <div className="quote-card-header">

        <div className="quote-header-left">
          <img
            src={profilePic}
            alt="Creator"
            className="quote-profile-pic"
          />

          <div className="quote-creator-info">
            <p className="quote-creator-name">
              {username}
            </p>

            <span className="quote-date">
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="quote-header-right">
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1756830937/star_wvusn3.png"
            alt="Star"
            className="quote-star-icon"
          />

          <span className="quote-review-text">
            {averageRating > 0
              ? averageRating.toFixed(1)
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="quote-thumbnail-container">
        <img
          src={
            images && images.length > 0
              ? images[0]
              : `${process.env.PUBLIC_URL}/default-thumbnail.png`
          }
          alt="Requested Quote"
          className="quote-thumbnail"
        />
      </div>

      {/* Vehicle */}
      <h4 className="quote-post-title">
        {vehicleTitle.toUpperCase()}
      </h4>

      {/* Additional info */}
      <p className="quote-requested-quote-description">
        {additionalInfo || "No additional information provided."}
      </p>

      {/* Footer */}
      <div className="quote-card-footer">

        <div className="quote-footer-left">
          <span className="quote-footer-item">
            QUOTED PRICE:&nbsp;

            {isResponded ? (
              <span className="quote-quote-price">
                ${liveQuotePrice}
              </span>
            ) : isSeller ? (
              <input
                type="number"
                className="quote-price-input"
                placeholder="Enter price"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
              />
            ) : (
              <span className="quote-waiting-on-seller">
                Waiting on seller
              </span>
            )}
          </span>
        </div>

        <div className="quote-footer-right">

          {/* Seller buttons */}
          {isSeller && (
            isResponded ? (
              <button
                className="quote-cancel-button"
                onClick={handleCancelQuote}
              >
                Cancel Quote
              </button>
            ) : (
              <button
                className="quote-respond-button"
                onClick={handleRespond}
              >
                Respond
              </button>
            )
          )}

          {/* Requester button */}
          {isRequester && isResponded && (
            <button
              className="quote-add-to-cart-button"
              onClick={() => {
                const selectedQuoteData = {
                  requestedQuoteId,
                  quotePrice: liveQuotePrice,
                  vehicleInfo,
                  additionalInfo,
                  images,
                  requesterUserId: userId,
                };

                onSelectQuote(selectedQuoteData);

                if (onAddQuoteToCart) {
                  onAddQuoteToCart(selectedQuoteData);
                }
              }}
            >
              Add to Cart
            </button>
          )}

        </div>

      </div>

      

    </div>
  );
}

export default QuotePostLayout;