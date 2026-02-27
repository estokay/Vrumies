import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Notifications.css';
import { useNavigate } from 'react-router-dom';
import TimestampToRelative from '../TimestampToRelative';

const renderNotificationContent = (notification) => {
  switch (notification.type) {
    case 'order':
      return (
        <>
          <div className="notification-top-row">
            <div className={`notification-title ${!notification.read ? 'text-green' : 'text-light-gray'}`}>
              {!notification.read && <span className="notification-dot" />}
              🛒 New Order
            </div>
            <span className="notification-time">
              <TimestampToRelative timestamp={notification.createdAt} />
            </span>
          </div>
          <div className="notification-title-text">{notification.title}</div>
          <p className="notification-from">
            from <span className="notification-sender">{notification.from}</span>
          </p>
          {notification.message && (
            <p className="notification-message">"{notification.message}"</p>
          )}
        </>
      );

    case 'review':
      return (
        <>
          <div className="notification-top-row">
            <div className={`notification-title ${!notification.read ? 'text-green' : 'text-light-gray'}`}>
              {!notification.read && <span className="notification-dot" />}
              ⭐ New Review
            </div>
            <span className="notification-time">
              <TimestampToRelative timestamp={notification.createdAt} />
            </span>
          </div>
          <div className="notification-title-text">{notification.title}</div>
          <p className="notification-from">
            from <span className="notification-sender">{notification.from}</span>
          </p>
          {notification.message && (
            <p className="notification-message">"{notification.message}"</p>
          )}
        </>
      );

    case 'announcement':
      return (
        <>
          <div className="notification-top-row">
            <div className={`notification-title ${!notification.read ? 'text-green' : 'text-light-gray'}`}>
              {!notification.read && <span className="notification-dot" />}
              📢 New Announcement
            </div>
            <span className="notification-time">
              <TimestampToRelative timestamp={notification.createdAt} />
            </span>
          </div>
          <div className="notification-title-text">{notification.title}</div>
          <p className="notification-from">
            from <span className="notification-sender">{notification.from}</span>
          </p>
          {notification.message && (
            <p className="notification-message">"{notification.message}"</p>
          )}
        </>
      );

    case 'offer':
      return (
        <>
          <div className="notification-top-row">
            <div className={`notification-title ${!notification.read ? 'text-green' : 'text-light-gray'}`}>
              {!notification.read && <span className="notification-dot" />}
              🏷️ New Offer
            </div>
            <span className="notification-time">
              <TimestampToRelative timestamp={notification.createdAt} />
            </span>
          </div>
          <div className="notification-title-text">{notification.title}</div>
          <p className="notification-from">
            from <span className="notification-sender">{notification.from}</span>
          </p>
          {notification.message && (
            <p className="notification-message">"{notification.message}"</p>
          )}
        </>
      );

    case 'comment':
      return (
        <>
          <div className="notification-top-row">
            <div className={`notification-title ${!notification.read ? 'text-green' : 'text-light-gray'}`}>
              {!notification.read && <span className="notification-dot" />}
              💬 New Comment
            </div>
            <span className="notification-time">
              <TimestampToRelative timestamp={notification.createdAt} />
            </span>
          </div>
          <div className="notification-title-text">{notification.title}</div>
          <p className="notification-from">
            from <span className="notification-sender">{notification.from}</span>
          </p>
          {notification.message && (
            <p className="notification-message">"{notification.message}"</p>
          )}
        </>
      );

    default:
      return null;
  }
};

function Notifications({ isOpen, onClose }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  const [announcements, setAnnouncements] = useState([]);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState(new Set());

  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  const [announcementsLoaded, setAnnouncementsLoaded] = useState(false);
  const loading = !notificationsLoaded || !announcementsLoaded;

  useEffect(() => {
    let unsubNotifications = null;
    let unsubAnnouncements = null;
    let unsubReads = null;

    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setNotifications([]);
        setAnnouncements([]);
        if (unsubNotifications) unsubNotifications();
        if (unsubAnnouncements) unsubAnnouncements();
        return;
      }

      setUser(currentUser);

      // Announcement read tracking
      const readsRef = collection(db, 'Users', currentUser.uid, 'announcementReads');
      unsubReads = onSnapshot(readsRef, (snapshot) => {
        const ids = new Set(snapshot.docs.map((doc) => doc.id));
        setReadAnnouncementIds(ids);
      });

      // User notifications
      const notificationsRef = collection(db, 'Users', currentUser.uid, 'notifications');
      const qUser = query(notificationsRef, orderBy('createdAt', 'desc'));
      unsubNotifications = onSnapshot(qUser, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotifications(data);
        setNotificationsLoaded(true);
      });

      // Global announcements
      const announcementsRef = collection(db, 'Announcements');
      const qAnnouncements = query(announcementsRef, orderBy('createdAt', 'desc'));
      unsubAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), type: 'announcement' }));
        setAnnouncements(data);
        setAnnouncementsLoaded(true);
      });
    });

    return () => {
      if (unsubNotifications) unsubNotifications();
      if (unsubAnnouncements) unsubAnnouncements();
      if (unsubReads) unsubReads();
      unsubAuth();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="notifications-panel-content">
      <div className="notifications-header">Notifications</div>
      <div className="notifications-list custom-scrollbar">
        {loading ? (
          <div className="notification-item text-light-gray" style={{ textAlign: 'center', padding: '1rem' }}>
            Loading...
          </div>
        ) : [...notifications, ...announcements].length === 0 ? (
          <div className="notification-item text-light-gray" style={{ textAlign: 'center', padding: '1rem' }}>
            No notifications found
          </div>
        ) : (
          <>
            {[...notifications, ...announcements]
              .sort((a, b) => {
                const aTime = a.createdAt?.toMillis?.() || 0;
                const bTime = b.createdAt?.toMillis?.() || 0;
                return bTime - aTime;
              })
              .map((notification, index) => {
                const isAnnouncement = notification.type === 'announcement';
                const isRead = isAnnouncement
                  ? readAnnouncementIds.has(notification.id)
                  : notification.read;

                const finalNotification = { ...notification, read: isRead };

                return (
                  <div
                    key={notification.id}
                    className={`notification-item ${!finalNotification.read ? 'notification-new' : ''} ${hoveredIndex === index ? 'notification-hover' : ''}`}
                    onMouseEnter={async () => {
                      setHoveredIndex(index);
                      if (!finalNotification.read && user) {
                        if (finalNotification.type === 'announcement') {
                          const readRef = doc(db, 'Users', user.uid, 'announcementReads', finalNotification.id);
                          await setDoc(readRef, { read: true, readAt: serverTimestamp() });
                        } else {
                          const notifRef = doc(db, 'Users', user.uid, 'notifications', finalNotification.id);
                          await updateDoc(notifRef, { read: true });
                        }
                      }
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => finalNotification.link && navigate(finalNotification.link)}
                    style={{ cursor: finalNotification.link ? 'pointer' : 'default' }}
                  >
                    {renderNotificationContent(finalNotification)}
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}

export default Notifications;