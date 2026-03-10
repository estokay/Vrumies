import React from 'react';
import NavbarWithPost from '../../Components/Navbar/NavbarWithPost';
import AdminPanelHeader from './AdminPanelHeader';
import NavigationBar from './NavigationBar';
import '../../App.css';

const AdminPanel = () => {
  return (
    <div className="content-page">
      <AdminPanelHeader />
      <NavigationBar />
    </div>
  );
};

export default AdminPanel;