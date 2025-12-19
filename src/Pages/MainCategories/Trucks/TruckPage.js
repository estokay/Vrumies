import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import TruckHeader from './TruckHeader';
import '../../../App.css';
import RightSidePanel from './RightSidePanel';
import MainPostGrid from '../../../Components/MainPostGrid';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import '../../../Components/Css/MainPage.css'; // Updated CSS import

const TruckPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'trucks'));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching truck posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="mainpage">
      <TruckHeader />
      <SearchBar />
      <div className="videos-main"> {/* Use shared layout class */}
        <FilterPanel posts={posts} /> {/* Left panel */}
        {posts.length === 0 ? (
          <p className="no-events">No truck posts yet...</p>
        ) : (
          <MainPostGrid posts={posts} /> 
        )}
        <RightSidePanel posts={posts} /> {/* Right panel */}
      </div>
    </div>
  );
};

export default TruckPage;
