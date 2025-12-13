import { useEffect, useState } from 'react';
import { db } from '../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import BookmarksHeader from './BookmarksHeader';
import '../../App.css';
import '../../Components/Css/MainPage.css'; // <-- changed to MainPage.css
import RightSidePanel from './RightSidePanel';
import BookmarksPostGrid from './BookmarksPostGrid';
import FilterPanel from './FilterPanel';
import SearchBar from './SearchBar';

const BookmarksPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch only posts where type == "event"
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'event'));
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
    <div className="mainpage"> {/* updated to match MainPage.css */}
      <BookmarksHeader />
      <SearchBar />
      <div className="videos-main"> {/* updated to match MainPage.css layout */}
        <FilterPanel posts={posts} />
        {posts.length === 0 ? (
          <p className="no-events">No bookmarks yet...</p>
        ) : (
          <>
            <BookmarksPostGrid posts={posts} />
            
          </>
        )}
        <RightSidePanel posts={posts} />
      </div>
    </div>
  );
};

export default BookmarksPage;
