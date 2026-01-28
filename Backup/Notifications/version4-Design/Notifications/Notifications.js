import React, { useState } from 'react';
import './Notifications.css';

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
              <span className="notification-time">{notification.time}</span>
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
              <span className="notification-time">{notification.time}</span>
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
              <span className="notification-time">{notification.time}</span>
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
              <span className="notification-time">{notification.time}</span>
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
              <span className="notification-time">{notification.time}</span>
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
  
  if (!isOpen) return null;

   

  const notifications = [
    { type: 'order', title: '12V USB Charger that I just got brand new from warehouse in china and it is in the box wrapped up', from: 'Samantha43', message: 'New Order Made.', time: '5h ago', read: false },
    { type: 'review', title: '4 stars', from: 'Terrance_Morres', message: 'I used this product and I like the cool light designs on it.', time: '9h ago', read: true },
    { type: 'announcement', title: 'Maintenance in 1 Hour', from: 'Vrumies', message: 'Please avoid doing transaction in 1 hour as we will be conducting maintenance on the website.', time: '15h ago', read: true },
    { type: 'offer', title: 'I need an oil change from mobile mechanic', from: 'Vanz Marquez', message: 'I can do the task you requested.', time: '2d ago', read: true },
    { type: 'comment', title: 'Dodge Charger Hellcat...', from: 'SaraTheDrifter_Official', message: 'Very cool car, what is the title status of the vehicle?', time: '3d ago', read: true },
    { type: 'comment', title: 'My new Vlog at...', from: 'Mikefromike1995', message: 'Wow very cool car event you went to, glad the cops didn\'t...', time: '5w ago', read: true },
  ];

  return (
    <div className="notifications-panel-content">
      <div className="notifications-header">Notifications</div>

      <div className="notifications-list custom-scrollbar">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`notification-item ${!notification.read ? 'notification-new' : ''} ${hoveredIndex === index ? 'notification-hover' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {renderNotificationContent(notification)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
