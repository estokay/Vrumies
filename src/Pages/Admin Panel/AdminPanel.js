import React from 'react';
import NavbarWithPost from '../../Components/Navbar/NavbarWithPost';
import AdminPanelHeader from './AdminPanelHeader';
import '../../App.css';
import DeleteCollections from './DeleteCollections';
import ViewFirestoreData from './ViewFirestoreData';
import DeletePost from './DeletePost';
import DeleteOrder from './DeleteOrder';
import MakeAnnouncement from '../../Components/Notifications/MakeAnnouncement';
import Payouts from './Payouts';

const AdminPanel = () => {
  return (
    <div className="content-page">
      
      <AdminPanelHeader />
      <ViewFirestoreData />
      <MakeAnnouncement />
      <DeleteCollections />
      <DeletePost />
      <DeleteOrder />
      <Payouts />
    </div>
  );
};

export default AdminPanel;