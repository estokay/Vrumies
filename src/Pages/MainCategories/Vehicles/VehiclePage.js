import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import VehicleHeader from './VehicleHeader';
import '../../../App.css';
import RightSidePanel from './RightSidePanel';
import MainPostGrid from '../../../Components/MainPostGrid';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import '../../../Components/Css/MainPage.css';

const VehiclePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'vehicle'));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching vehicle posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="mainpage">
      <VehicleHeader />
      <SearchBar />
      <div className="videos-main">
        <FilterPanel posts={posts} />
        {posts.length === 0 ? (
          <p className="no-events">No vehicle posts yet...</p>
        ) : (
          <MainPostGrid posts={posts} />
        )}
        <RightSidePanel posts={posts} />
      </div>
    </div>
  );
};

export default VehiclePage;
