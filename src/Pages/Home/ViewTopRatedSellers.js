import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import ProfileCardLayout from "../../Components/Profile/ProfileCardLayout";
import "./ViewTopRatedSellers.css";

function ViewTopRatedSellers() {

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchTopRated = async () => {

      try {

        const usersSnapshot = await getDocs(collection(db, "Users"));

        const usersWithRatings = await Promise.all(

          usersSnapshot.docs.map(async (doc) => {

            const userId = doc.id;
            const userData = doc.data();

            const reviewsRef = collection(db, "Users", userId, "Reviews");
            const reviewsSnapshot = await getDocs(reviewsRef);

            if (reviewsSnapshot.empty) {
              return null; // ignore users without ratings
            }

            let total = 0;

            reviewsSnapshot.forEach((reviewDoc) => {
              const data = reviewDoc.data();
              total += Number(data.rating) || 0;
            });

            const average = total / reviewsSnapshot.size;
            const roundedAverage = Math.round(average * 10) / 10;

            const followersCount = Array.isArray(userData.followers) ? userData.followers.length : 0;

            return {
              userid: userId,
              ...userData,
              averageRating: roundedAverage,
              totalRatings: reviewsSnapshot.size,
              followersCount
            };

          })

        );

        const filteredUsers = usersWithRatings
          .filter(user => user !== null)
          .sort((a, b) => {

            // primary sort by rating
            if (b.averageRating !== a.averageRating) {
              return b.averageRating - a.averageRating;
            }

            // secondary sort by number of reviews
            return b.totalRatings - a.totalRatings;

          })
          .slice(0, 20);;

        setSellers(filteredUsers);

      } catch (error) {
        console.error("Error loading sellers:", error);
      } finally {
        setLoading(false);
      }

    };

    fetchTopRated();

  }, []);

  return (

    <div className="top-rated-sellers-panel">

      <div className="top-rated-header">
        <h3>⭐ Top Rated Sellers</h3>
        <span className="top-rated-subtitle">
          Highest rated automotive professionals
        </span>
      </div>

      <div className="top-rated-sellers-scroll">

        {loading && (
          <p className="top-rated-loading">
            Loading sellers...
          </p>
        )}

        {!loading && sellers.length === 0 && (
          <p className="top-rated-empty">
            No sellers with ratings yet.
          </p>
        )}

        {sellers.map((user) => (
          <ProfileCardLayout
            key={user.userid}
            user={user}
          />
        ))}

      </div>

    </div>

  );
}

export default ViewTopRatedSellers;