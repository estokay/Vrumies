import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";
import ProfileCardLayout from "../../Components/Profile/ProfileCardLayout";
import "./ViewTopRatedSellers.css";

function ViewTopRatedSellers() {
  const [sellers,setSellers] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const fetchTopRated=async()=>{
      try {
        const usersSnapshot = await getDocs(collection(db,"Users"));
        const usersWithRatings = await Promise.all(usersSnapshot.docs.map(async (doc)=>{
          const userId = doc.id;
          const userData = doc.data();
          const reviewsSnapshot = await getDocs(collection(db,"Users",userId,"Reviews"));
          if(reviewsSnapshot.empty) return null;
          let total=0;
          reviewsSnapshot.forEach(r=>{total+=Number(r.data().rating)||0;});
          const avg = Math.round((total/reviewsSnapshot.size)*10)/10;
          const followersCount = Array.isArray(userData.followers)?userData.followers.length:0;
          return {...userData,userid:userId,averageRating:avg,totalRatings:reviewsSnapshot.size,followersCount};
        }));
        const filtered = usersWithRatings.filter(u=>u!==null)
          .sort((a,b)=>{
            if(b.averageRating!==a.averageRating) return b.averageRating-a.averageRating;
            return b.totalRatings-a.totalRatings;
          }).slice(0,20);
        setSellers(filtered);
      }catch(err){ console.error(err);}
      finally{setLoading(false);}
    };
    fetchTopRated();
  },[]);

  return (
    <div className="top-rated-sellers-panel">
      <div className="top-rated-header">
        <h3>⭐ Top Rated Sellers</h3>
        <span className="top-rated-subtitle">Highest rated automotive professionals</span>
      </div>
      <div className="top-rated-sellers-scroll">
        {loading && <p className="top-rated-loading">Loading sellers...</p>}
        {!loading && !sellers.length && <p className="top-rated-empty">No sellers with ratings yet.</p>}
        {sellers.map(user=><ProfileCardLayout key={user.userid} user={user}/>)}
      </div>
    </div>
  );
}

export default ViewTopRatedSellers;