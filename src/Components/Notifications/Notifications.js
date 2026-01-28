import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc
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
              <span className="notification-time"><TimestampToRelative timestamp={notification.createdAt} /></span>
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
              <span className="notification-time"><TimestampToRelative timestamp={notification.createdAt} /></span>
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
              <span className="notification-time"><TimestampToRelative timestamp={notification.createdAt} /></span>
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
              <span className="notification-time"><TimestampToRelative timestamp={notification.createdAt} /></span>
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
              <span className="notification-time"><TimestampToRelative timestamp={notification.createdAt} /></span>
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

  useEffect(() => {
    let unsubNotifications = null;

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setNotifications([]);
        if (unsubNotifications) unsubNotifications();
        return;
      }

      setUser(currentUser);

      const notificationsRef = collection(
        db,
        'Users',
        currentUser.uid,
        'notifications'
      );

      const q = query(notificationsRef, orderBy('createdAt', 'desc'));

      unsubNotifications = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setNotifications(data);
      });
    });

    return () => {
      if (unsubNotifications) unsubNotifications();
      unsubAuth();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="notifications-panel-content">
      <div className="notifications-header">Notifications</div>

      <div className="notifications-list custom-scrollbar">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`notification-item ${!notification.read ? 'notification-new' : ''} ${hoveredIndex === index ? 'notification-hover' : ''}`}
            onMouseEnter={async () => {
              setHoveredIndex(index);

              if (!notification.read && user) {
                const notifRef = doc(
                  db,
                  'Users',
                  user.uid,
                  'notifications',
                  notification.id
                );

                await updateDoc(notifRef, { read: true });
              }
            }}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => notification.link && navigate(notification.link)} // <-- navigation happens here
            style={{ cursor: notification.link ? 'pointer' : 'default' }} // optional
          >
            {renderNotificationContent(notification)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
