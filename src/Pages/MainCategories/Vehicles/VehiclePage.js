import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


import VehicleHeader from './VehicleHeader';
import '../../../App.css';
import VehicleRightSidePanel from './VehicleRightSidePanel';
import './VehiclePage.css';
import VehiclePostGrid from './VehiclePostGrid';

const VehiclePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Build query: only posts where type == "event"
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'vehicle'));

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching event posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="events-page">
      <VehicleHeader />
      <div className="main-events">
        {posts.length === 0 ? (
          <p className="no-events">No vehicle posts yet...</p>
        ) : (
          <>
            <VehiclePostGrid posts={posts} />
            <VehicleRightSidePanel posts={posts} />
          </>
        )}
      </div>
    </div>
  );
};

export default VehiclePage;
