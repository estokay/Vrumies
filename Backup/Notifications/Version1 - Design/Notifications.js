import React from 'react'; // Removed useRef, useEffect, and forwardRef

// Notifications component: Displays a list of notifications.
// It is now a pure content component, its positioning will be handled by its parent.
function Notifications({ isOpen, onClose }) { // No longer uses forwardRef
  // If the component is not open, render nothing.
  if (!isOpen) {
    return null;
  }

  // Sample notification data to populate the panel
  const notifications = [
    { type: 'New Order', description: '12V USB Charger...', from: 'Samantha43', time: '5h ago', isNew: true },
    { type: 'New Review', description: 'Alex Anderson', from: 'Terrance_Morres', comment: '“I used this product and I like the cool light designs on it.”', time: '9h ago' },
    { type: 'New Comment', description: 'Testing the new Ford...', from: 'mich332', comment: '“I used this product and I like the cool light designs on it.”', time: '15h ago' },
    { type: 'New Comment', description: 'Why I only use manual...', from: 'Vanz Marquez', comment: '“Automatic cards are less likely to have transmission issues..”', time: '2d ago' },
    { type: 'New Comment', description: 'Dodge Charger Hellcat...', from: 'SaraTheDrifter_Official', comment: '“That 0-60 time on the Dodge Charger Hellcat is crazy...”', time: '3d ago' },
    { type: 'New Comment', description: 'My new Vlog at...', from: 'Mikefromike1995', comment: '“Wow very cool car event you went to, glad the cops didn\'t...”', time: '5w ago' },
  ];

  return (
    // This div now simply contains the content of the notifications panel.
    // Its positioning will be handled by a wrapper div in NavbarWithPost.js.
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
                {notification.type}: {notification.description}
              </span>
              <span className="notification-time">{notification.time}</span>
            </div>
            <p className="notification-from">from <span className="notification-sender">{notification.from}</span></p>
            {notification.comment && (
              <p className="notification-comment">"{notification.comment}"</p>
            )}
          </div>
        ))}
      </div>

      {/* Custom CSS styles for the panel content */}
      <style>
        {`
        .notifications-panel-content {
          background-color: #2d3748; /* bg-gray-800 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
          width: 100%;
          max-width: 28rem; /* max-w-md (approx 448px) */
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh; /* Max height for content */
        }

        .notifications-header {
          padding: 1rem; /* p-4 */
          background-color: #1a202c; /* bg-gray-900 */
          color: #ffffff; /* text-white */
          font-size: 1.25rem; /* text-xl */
          font-weight: bold;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }

        .notifications-list {
          flex-grow: 1; /* flex-grow */
          overflow-y: auto; /* overflow-y-auto */
        }

        .notification-item {
          padding: 1rem; /* p-4 */
          border-bottom: 1px solid #4a5568; /* border-b border-gray-700 */
        }
        .notification-item:last-child {
          border-bottom: none; /* last:border-b-0 */
        }

        .notification-new {
          background-color: rgba(76, 209, 55, 0.15); /* bg-green-400/30 */
        }

        .notification-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem; /* mb-1 */
        }

        .notification-title {
          font-weight: 600; /* font-semibold */
        }

        .text-green {
          color: #48bb78; /* text-green-400 */
        }

        .text-light-gray {
          color: #e2e8f0; /* text-gray-200 */
        }

        .notification-time {
          color: #a0aec0; /* text-gray-400 */
          font-size: 0.875rem; /* text-sm */
        }

        .notification-from {
          color: #cbd5e0; /* text-gray-300 */
          font-size: 0.875rem; /* text-sm */
          margin-bottom: 0.25rem; /* mb-1 */
        }

        .notification-sender {
          font-weight: 500; /* font-medium */
          color: #63b3ed; /* text-blue-300 */
        }

        .notification-comment {
          color: #a0aec0; /* text-gray-400 */
          font-size: 0.875rem; /* text-sm */
          font-style: italic;
        }

        /* Custom scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
        `}
        </style>
    </div>
  );
}

export default Notifications;
