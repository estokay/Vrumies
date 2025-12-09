import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import DirectoryHeader from './DirectoryHeader';
import '../../../App.css';
import RightSidePanel from './RightSidePanel';
import DirectoryPostGrid from './DirectoryPostGrid';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import '../../../Components/Css/MainPage.css';

const DirectoryPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'directory'));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching directory posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="mainpage">
      <DirectoryHeader />
      <SearchBar />
      <div className="videos-main">
        <FilterPanel posts={posts} />
        {posts.length === 0 ? (
          <p className="no-events">No directory posts yet...</p>
        ) : (
          <DirectoryPostGrid posts={posts} />
        )}
        <RightSidePanel posts={posts} />
      </div>
    </div>
  );
};

export default DirectoryPage;
