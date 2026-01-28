import React from 'react';
import './Notifications.css'; // import the CSS file

// Notifications component: Displays a list of notifications.
// It is now a pure content component, its positioning will be handled by its parent.
function Notifications({ isOpen, onClose }) {
  // If the component is not open, render nothing.
  if (!isOpen) {
    return null;
  }

  // Sample notification data to populate the panel
  const notifications = [
    { type: 'New Order', title: '12V USB Charger...', from: 'Samantha43', message: '“New Order Made.”', time: '5h ago', isNew: true },
    { type: 'New Review', title: 'Alex Anderson', from: 'Terrance_Morres', message: '“I used this product and I like the cool light designs on it.”', time: '9h ago' },
    { type: 'New Announcement', title: 'Testing the new Ford...', from: 'mich332', message: '“I used this product and I like the cool light designs on it.”', time: '15h ago' },
    { type: 'New Offer', title: 'Why I only use manual...', from: 'Vanz Marquez', message: '“Automatic cards are less likely to have transmission issues..”', time: '2d ago' },
    { type: 'New Comment', title: 'Dodge Charger Hellcat...', from: 'SaraTheDrifter_Official', message: '“That 0-60 time on the Dodge Charger Hellcat is crazy...”', time: '3d ago' },
    { type: 'New Comment', title: 'My new Vlog at...', from: 'Mikefromike1995', message: '“Wow very cool car event you went to, glad the cops didn\'t...”', time: '5w ago' },
  ];

  return (
    <div className="notifications-panel-content">
      {/* Panel Header */}
      <div className="notifications-header">
        Notifications
      </div>

      {/* Notifications List */}
      <div className="notifications-list custom-scrollbar">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`notification-item ${notification.isNew ? 'notification-new' : ''}`}
          >
            <div className="notification-top-row">
              <span className={`notification-title ${notification.isNew ? 'text-green' : 'text-light-gray'}`}>
                {notification.type}: {notification.title}
              </span>
              <span className="notification-time">{notification.time}</span>
            </div>
            <p className="notification-from">from <span className="notification-sender">{notification.from}</span></p>
            {notification.message && (
              <p className="notification-message">"{notification.message}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
