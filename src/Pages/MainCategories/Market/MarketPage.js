import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import MarketHeader from './MarketHeader';
import '../../../App.css';
import RightSidePanel from './RightSidePanel';
import MainPostGrid from '../../../Components/MainPostGrid';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import '../../../Components/Css/MainPage.css'; // Updated CSS import

const MarketPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'market'));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching market posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="mainpage">
      <MarketHeader />
      <SearchBar />
      <div className="videos-main"> {/* Use shared layout class */}
        <FilterPanel posts={posts} /> {/* Left panel */}
        {posts.length === 0 ? (
          <p className="no-events">No market posts yet...</p>
        ) : (
          <MainPostGrid posts={posts} /> 
        )}
        <RightSidePanel posts={posts} /> {/* Right panel */}
      </div>
    </div>
  );
};

export default MarketPage;
