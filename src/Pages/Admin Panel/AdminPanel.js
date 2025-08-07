import React from 'react';
import NavbarWithPost from '../../Components/NavbarWithPost';
import AdminPanelHeader from './AdminPanelHeader';
import '../../App.css';
import AllFirestoreDataViewer from './AllFirestoreDataViewer';
import DeleteCollections from './DeleteCollections';

const AdminPanel = () => {
  return (
    <div className="content-page">
      <NavbarWithPost />
      <AdminPanelHeader />
      <AllFirestoreDataViewer />
      <DeleteCollections />
    </div>
  );
};

export default AdminPanel;