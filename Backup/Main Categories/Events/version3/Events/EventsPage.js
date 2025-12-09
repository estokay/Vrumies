import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import EventsHeader from './EventsHeader';
import '../../../App.css';
import EventsRightSidePanel from './EventsRightSidePanel';
import PostSidePanel from '../../../Components/PostSidePanel';
import './EventsPage.css';
import EventsPostGrid from './EventsPostGrid';
import FilterPanel from './FilterPanel';
import SearchBar from './SearchBar';

const EventsPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('type', '==', 'event'));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
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
      <EventsHeader />
      <SearchBar />
      <div className="events-main">
        <FilterPanel posts={posts} /> {/* Left panel */}
        {posts.length === 0 ? (
          <p className="no-events">No events yet...</p>
        ) : (
          <>
            <EventsPostGrid posts={posts} />
            {/* <PostSidePanel postType="event" /> */}
            <EventsRightSidePanel posts={posts} /> {/* Right panel */}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
