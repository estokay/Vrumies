import { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import NavbarWithPost from '../../../Components/NavbarWithPost';
import EventsHeader from './EventsHeader';
import '../../../App.css';
import EventsRightSidePanel from './EventsRightSidePanel';
import './EventsPage.css';
import EventsPostGrid from './EventsPostGrid';

const EventsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Build query: only posts where type == "event"
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
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  return (
    <div className="events-page">
      
      <EventsHeader />
      <div className="main-events">
        <EventsPostGrid posts={posts} />
        <EventsRightSidePanel posts={posts} />
      </div>
    </div>
  );
};

export default EventsPage;
