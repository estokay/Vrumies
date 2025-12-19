import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import VideosHeader from './VideosHeader';
import '../../../App.css';
import '../../../Components/Css/MainPage.css';
import MainPostGrid from '../../../Components/MainPostGrid';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import RightSidePanel from './RightSidePanel';

const VideosPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Build query: only posts where type == "video"
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'video'));

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching video posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="mainpage">
      <VideosHeader />
      <SearchBar />
      <div className="videos-main">
        <FilterPanel posts={posts} />
        {posts.length === 0 ? (
          <p className="no-events">No videos yet...</p>
        ) : (
          <MainPostGrid posts={posts} />
        )}
        <RightSidePanel posts={posts} />
      </div>
    </div>
  );
};

export default VideosPage;
