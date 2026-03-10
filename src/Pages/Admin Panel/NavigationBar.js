import React, { useState } from 'react';
import './NavigationBar.css';
import ViewFirestoreData from './ViewFirestoreData';
import MakeAnnouncement from '../../Components/Notifications/MakeAnnouncement';
import DeleteCollections from './DeleteCollections';
import DeletePost from './DeletePost';
import DeleteOrder from './DeleteOrder';
import Payouts from './Payouts';
import AffiliatePayouts from './AffiliatePayouts';

const NavigationBar = () => {
  const [activeTab, setActiveTab] = useState('viewData');

  const renderContent = () => {
    switch (activeTab) {
      case 'viewData':
        return <ViewFirestoreData />;
      case 'makeAnnouncements':
        return <MakeAnnouncement />;
      case 'deleteSection':
        return (
          <>
            <DeleteCollections />
            <DeletePost />
            <DeleteOrder />
          </>
        );
      case 'orderPayouts':
        return <Payouts />;
      case 'affiliatePayouts':
        return <AffiliatePayouts />;
      default:
        return null;
    }
  };

  return (
    <div className="ap-navigation-container">
      <nav className="ap-navigation-bar">
        <button
          className={activeTab === 'viewData' ? 'ap-active' : ''}
          onClick={() => setActiveTab('viewData')}
        >
          View Data
        </button>
        <button
          className={activeTab === 'makeAnnouncements' ? 'ap-active' : ''}
          onClick={() => setActiveTab('makeAnnouncements')}
        >
          Make Announcements
        </button>
        <button
          className={activeTab === 'deleteSection' ? 'ap-active' : ''}
          onClick={() => setActiveTab('deleteSection')}
        >
          Delete Section
        </button>
        <button
          className={activeTab === 'orderPayouts' ? 'ap-active' : ''}
          onClick={() => setActiveTab('orderPayouts')}
        >
          Order Payouts
        </button>
        <button
          className={activeTab === 'affiliatePayouts' ? 'ap-active' : ''}
          onClick={() => setActiveTab('affiliatePayouts')}
        >
          Affiliate Payouts
        </button>
      </nav>

      <div className="ap-navigation-content">{renderContent()}</div>
    </div>
  );
};

export default NavigationBar;