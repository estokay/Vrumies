import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import EventsHeader from './EventsHeader';
import '../../../App.css';
import EventsPostGrid from './EventsPostGrid';
import FilterPanel from './FilterPanel';
import RightSidePanel from './RightSidePanel';
import SearchBar from './SearchBar';
import '../../../Components/Css/MainPage.css';

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
    <div className="mainpage">
      <EventsHeader />
      <SearchBar />
      <div className="videos-main">
        <FilterPanel posts={posts} /> 
        {posts.length === 0 ? (
          <p className="no-events">No events yet...</p>
        ) : (
          <EventsPostGrid posts={posts} />
        )}
        <RightSidePanel posts={posts} /> 
      </div>
    </div>
  );
};

export default EventsPage;
