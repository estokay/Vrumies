import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import BlogHeader from './BlogHeader';
import '../../../App.css';
import RightSidePanel from './RightSidePanel';
import MainPostGrid from '../../../Components/MainPostGrid';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import '../../../Components/Css/MainPage.css';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'blog'));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="mainpage">
      <BlogHeader />
      <SearchBar />
      <div className="videos-main">
        <FilterPanel posts={posts} />
        {posts.length === 0 ? (
          <p className="no-events">No blog posts yet...</p>
        ) : (
          <MainPostGrid posts={posts} />
        )}
        <RightSidePanel posts={posts} />
      </div>
    </div>
  );
};

export default BlogPage;
