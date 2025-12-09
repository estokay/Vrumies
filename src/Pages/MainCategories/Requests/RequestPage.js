import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import RequestHeader from './RequestHeader';
import '../../../App.css';
import RightSidePanel from './RightSidePanel';
import RequestPostGrid from './RequestPostGrid';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import '../../../Components/Css/MainPage.css';

const RequestPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'request'));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching request posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="mainpage">
      <RequestHeader />
      <SearchBar />
      <div className="videos-main">
        <FilterPanel posts={posts} />
        {posts.length === 0 ? (
          <p className="no-events">No request posts yet...</p>
        ) : (
          <RequestPostGrid posts={posts} />
        )}
        <RightSidePanel posts={posts} />
      </div>
    </div>
  );
};

export default RequestPage;
