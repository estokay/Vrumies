import React, { useState, useEffect } from "react";
import "./CreateAffiliateLinkOverlay.css";
import { useGetUserReferralCode } from "../../Hooks/useGetUserReferralCode";
import { handleCheckAffiliateLink } from "../../AsyncFunctions/handleCheckAffiliateLink";
import { auth, db } from "../../Components/firebase";
import { doc, getDoc } from "firebase/firestore";

const CreateAffiliateLinkOverlay = ({ onClose, postId }) => {
  const { referralCode, loading, error } = useGetUserReferralCode();
  const [affiliateLink, setAffiliateLink] = useState(null);
  const [showConfirmRegenerate, setShowConfirmRegenerate] = useState(false);
  const [category, setCategory] = useState(""); // will fetch from Firestore
  const [fetchingCategory, setFetchingCategory] = useState(true);

  // Fetch type from Posts collection based on postId
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();
          setCategory(postData.type || ""); // assign the category field
        } else {
          console.error("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post category:", err);
      } finally {
        setFetchingCategory(false);
      }
    };

    if (postId) fetchCategory();
  }, [postId]);

  // Fetch existing affiliate link automatically
  useEffect(() => {
    if (!loading && !fetchingCategory && referralCode && postId && category) {
      handleGenerateLink();
    }
  }, [loading, fetchingCategory, referralCode, postId, category]);

  const handleGenerateLink = async (forceNew = false) => {
    try {
      if (!auth.currentUser || !referralCode || !postId) return;

      const link = await handleCheckAffiliateLink(
        auth.currentUser.uid,
        postId,
        category,
        referralCode,
        forceNew
      );

      setAffiliateLink(link);
      setShowConfirmRegenerate(false);
    } catch (err) {
      alert("Failed to generate affiliate link");
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    if (!affiliateLink) return;

    navigator.clipboard.writeText(affiliateLink)
      .then(() => alert("Affiliate link copied to clipboard!"))
      .catch(() => alert("Failed to copy link"));
  };

  return (
    <div className="cal-overlay-backdrop" onClick={onClose}>
      <div className="cal-overlay-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="cal-overlay-title">{affiliateLink ? "Your Affiliate Link" : "Generate Affiliate Link"}</h2>

        {loading && <p>Loading referral code...</p>}
        {error && <p>Error: {error?.message || "Something went wrong"}</p>}

        {!loading && !error && (
          <>
            {affiliateLink === null && (
              <button className="cal-generate-button" onClick={() => handleGenerateLink()}>
                Generate Link
              </button>
            )}

            {affiliateLink && (
              <>
                <div className="cal-affiliate-container">
                  <p className="cal-affiliate-link">{affiliateLink}</p>
                  <button className="cal-copy-button" onClick={handleCopyLink}>
                    Copy
                  </button>
                </div>

                {!showConfirmRegenerate && (
                  <button
                    className="cal-regenerate-button"
                    onClick={() => setShowConfirmRegenerate(true)}
                  >
                    Regenerate Link
                  </button>
                )}
              </>
            )}

            {/* Confirmation UI */}
            {showConfirmRegenerate && (
              <div className="cal-confirm-box">

                <p>
                  Regenerating will replace your current affiliate link.
                  <br />
                  Any previous shared links will no longer earn rewards.
                  <br />
                  Continue?
                </p>

                <div className="cal-confirm-actions">
                  <button
                    className="cal-cancel-button"
                    onClick={() => setShowConfirmRegenerate(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="cal-confirm-button"
                    onClick={() => handleGenerateLink(true)}
                  >
                    Regenerate
                  </button>
                </div>

              </div>
            )}
              
            

            <p className="cal-overlay-description">
              Share this product link and if a user purchases through it, you may earn a reward.
            </p>
          </>
        )}

        <button className="cal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateAffiliateLinkOverlay;