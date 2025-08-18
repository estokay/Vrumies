// src/PageRouter.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ContentPage from '../Pages/MainCategories/Videos/ContentPage';
import RequestPage from '../Pages/MainCategories/Requests/RequestPage';
import MarketPage from '../Pages/MainCategories/Market/MarketPage';
import EventsPage from '../Pages/MainCategories/Events/EventsPage';
import DirectoryPage from '../Pages/MainCategories/Directory/DirectoryPage';
import ViewVideoPostPage from '../Pages/ViewPosts/Videos/ViewVideoPostPage';
import AdminPanel from '../Pages/Admin Panel/AdminPanel';
import BlogContentPage from '../Pages/MainCategories/Blogs/BlogContentPage';
import VehiclePage from '../Pages/MainCategories/Vehicles/VehiclePage';
import ForumPage from '../Pages/MainCategories/Forums/ForumPage';
import OrdersPage from '../Pages/Orders/OrdersPage';
import InboxPage from '../Pages/Messages/InboxPage';
import TokenPage from '../Pages/Tokens/TokenPage';
import SignIn from '../Pages/SignIn/SignIn';
import ShoppingCart from '../Pages/Cart/ShoppingCart';
import MarketPost from '../Pages/ViewPosts/Market/MarketPost';
import SettingsPage from '../Pages/Settings/SettingsPage';
import MyProfile from '../Pages/MyProfile/MyProfile';
import ViewProfile from '../Pages/ViewProfile/ViewProfile';
import SellerPage from '../Pages/Seller/SellerPage';

const PageRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContentPage />} />
        <Route path="/blogs" element={<BlogContentPage />} />
        <Route path="/forums" element={<ForumPage />} />
        <Route path="/vehicles" element={<VehiclePage />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/marketpost/:id" element={<MarketPost />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/videopost/:id" element={<ViewVideoPostPage />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/tokens" element={<TokenPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/viewprofile" element={<ViewProfile />} />
        <Route path="/seller" element={<SellerPage />} />
        {/* Add more pages here as needed */}
      </Routes>
    </Router>
  );
};

export default PageRouter;
