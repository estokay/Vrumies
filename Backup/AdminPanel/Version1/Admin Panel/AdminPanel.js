import React from 'react';
import NavbarWithPost from '../../Components/NavbarWithPost';
import AdminPanelHeader from './AdminPanelHeader';
import '../../App.css';
import DeleteCollections from './DeleteCollections';
import ViewFirestoreData from './ViewFirestoreData';

const AdminPanel = () => {
  return (
    <div className="content-page">
      
      <AdminPanelHeader />
      <ViewFirestoreData />
      <DeleteCollections />
    </div>
  );
};

export default AdminPanel;