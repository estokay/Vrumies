import React, { useState } from 'react';
import './Notifications.css';
import { useNavigate } from 'react-router-dom';
import TimestampToRelative from '../TimestampToRelative';

const renderNotificationContent = (notification) => {
  switch (notification.type) {
    case 'order':
      return (
        <>
          <div className="notification-top-row">
              <span className={`notification-title ${!notification.read ? 'text-green' : 'text-light-gray'}`}>
                {!notification.read && <span className="notification-dot" />}
                🛒 New Order: {notification.title}
              </span>
              <span className="notification-time"><TimestampToRelative timestamp={notification.createdAt} /></span>
            </div>
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
              <span className={`notification-title ${!notification.read ? 'text-green' : 'text-light-gray'}`}>
                {!notification.read && <span className="notification-dot" />}
                ⭐ New Review: {notification.title}
              </span>
              <span className="notification-time"><TimestampToRelative timestamp={notification.createdAt} /></span>
            </div>
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
              <span className={`notification-title ${!notification.read ? 'text-green' : 'text-light-gray'}`}>
                {!notification.read && <span className="notification-dot" />}
                📢 New Announcement: {notification.title}
              </span>
              <span className="notification-time"><TimestampToRelative timestamp={notification.createdAt} /></span>
            </div>
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
              <span className={`notification-title ${!notification.read ? 'text-green' : 'text-light-gray'}`}>
                {!notification.read && <span className="notification-dot" />}
                🏷️ New Offer: {notification.title}
              </span>
              <span className="notification-time"><TimestampToRelative timestamp={notification.createdAt} /></span>
            </div>
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
              <span className={`notification-title ${!notification.read ? 'text-green' : 'text-light-gray'}`}>
                {!notification.read && <span className="notification-dot" />}
                💬 New Comment: {notification.title}
              </span>
              <span className="notification-time"><TimestampToRelative timestamp={notification.createdAt} /></span>
            </div>
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

  const [notifications, setNotifications] = useState([
    { type: 'order', title: '12V USB Charger that I just got brand new from warehouse in china and it is in the box wrapped up', from: 'Samantha43', message: 'New Order Made.', link: '/seller', createdAt: 'January 14, 2026 at 9:44:29 AM UTC-6', read: false },
    { type: 'review', title: '4 stars', from: 'Terrance_Morres', message: 'I used this product and I like the cool light designs on it.', link: '/myreviews', createdAt: 'January 14, 2026 at 12:30:43 PM UTC-6', read: false },
    { type: 'announcement', title: 'Maintenance in 1 Hour', from: 'Vrumies', message: 'Please avoid doing transaction in 1 hour as we will be conducting maintenance on the website.', link: '', createdAt: 'January 14, 2026 at 12:30:43 PM UTC-6', read: false },
    { type: 'offer', title: 'I need an oil change...', from: 'Vanz Marquez', message: 'I can do...', link: '/offerpost/VdleziEYdcLFlXr24pc1', createdAt: 'January 14, 2026 at 12:38:29 PM UTC-6', read: true },
    { type: 'comment', title: 'Dodge Charger Hellcat...', from: 'SaraTheDrifter_Official', message: 'Very cool car, what is the title status of the vehicle?', link: '/marketpost/p6rZRJf885E0J9jWJsxD', createdAt: 'January 14, 2026 at 12:30:43 PM UTC-6', read: true },
    { type: 'comment', title: 'My new Vlog at...', from: 'Mikefromike1995', message: 'Wow very cool car event you went to, glad the cops didn\'t...', link: '/videopost/OutWvBSij0qVddCRIplX', createdAt: 'January 14, 2026 at 9:26:22 AM UTC-6', read: true },
  ]);

  if (!isOpen) return null;

  return (
    <div className="notifications-panel-content">
      <div className="notifications-header">Notifications</div>

      <div className="notifications-list custom-scrollbar">
        {notifications.map((notification, index) => (
          <div
            key={index}
            to={notification.link || '#'}
            className={`notification-item ${!notification.read ? 'notification-new' : ''} ${hoveredIndex === index ? 'notification-hover' : ''}`}
            onMouseEnter={() => {
              setHoveredIndex(index);

              // mark as read if unread
              if (!notification.read) {
                setNotifications(prev =>
                  prev.map((n, i) =>
                    i === index ? { ...n, read: true } : n
                  )
                );
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
