import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavbarWithPost from './Navbar/NavbarWithPost';
import ProtectedRoute from "./ProtectedRoute";

// import your pages
import HomePage from '../Pages/Home/HomePage';
import VideosPage from '../Pages/MainCategories/Videos/VideosPage';
import RequestPage from '../Pages/MainCategories/Requests/RequestPage';
import MarketPage from '../Pages/MainCategories/Market/MarketPage';
import EventsPage from '../Pages/MainCategories/Events/EventsPage';
import DirectoryPage from '../Pages/MainCategories/Directory/DirectoryPage';
import TruckPage from '../Pages/MainCategories/Trucks/TruckPage';
import LoadPage from '../Pages/MainCategories/Loads/LoadPage';
import VideoPost from '../Pages/ViewPosts/Videos/VideoPost';
import AdminPanel from '../Pages/Admin Panel/AdminPanel';
import BlogPage from '../Pages/MainCategories/Blogs/BlogPage';
import VehiclePage from '../Pages/MainCategories/Vehicles/VehiclePage';
import OrdersPage from '../Pages/Orders/OrdersPage';
import InboxPage from '../Pages/Messages/InboxPage';
import TokenPage from '../Pages/Tokens/TokenPage';
import SignIn from '../Pages/SignIn/SignIn';
import ShoppingCart from '../Pages/Cart/ShoppingCart';
import MarketPost from '../Pages/ViewPosts/Market/MarketPost';
import SettingsPage from '../Pages/Settings/SettingsPage';
import MyProfile from '../Pages/MyProfile/MyProfile';
import MyPhotos from '../Pages/MyProfilePhotos/MyPhotos';
import MyReviews from '../Pages/MyProfileReviews/MyReviews';
import ViewProfile from '../Pages/ViewProfile/ViewProfile';
import ViewPhotos from '../Pages/ViewProfilePhotos/ViewPhotos';
import ViewReviews from '../Pages/ViewProfileReviews/ViewReviews';
import SellerPage from '../Pages/Seller/SellerPage';
import EventPost from '../Pages/ViewPosts/Events/EventPost';
import DirectoryPost from '../Pages/ViewPosts/Directory/DirectoryPost';
import OfferPost from '../Pages/ViewPosts/CustomOffers/OfferPost';
import BlogPost from '../Pages/ViewPosts/Blogs/BlogPost';
import RequestPost from '../Pages/ViewPosts/Requests/RequestPost';
import VehiclePost from '../Pages/ViewPosts/Vehicles/VehiclePost';
import TruckPost from '../Pages/ViewPosts/Trucks/TruckPost';
import LoadPost from '../Pages/ViewPosts/Loads/LoadPost';
import BookmarksPage from '../Pages/Bookmarks/BookmarksPage';
import TestPage from '../Test/TestPage';

// Layout for pages with Navbar
const PageWithNavbar = ({ children }) => (
  <>
    <NavbarWithPost />
    {children}
  </>
);

const PageRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/home" replace />} />

    {/* Pages without Navbar */}
    <Route path="/signin" element={<SignIn />} />

    {/* Pages with Navbar */}
    <Route path="/home" element={<PageWithNavbar><HomePage /></PageWithNavbar>} />
    <Route path="/videos" element={<ProtectedRoute><PageWithNavbar><VideosPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/blogs" element={<ProtectedRoute><PageWithNavbar><BlogPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/vehicles" element={<ProtectedRoute><PageWithNavbar><VehiclePage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/request" element={<ProtectedRoute><PageWithNavbar><RequestPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/market" element={<ProtectedRoute><PageWithNavbar><MarketPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/marketpost/:id" element={<ProtectedRoute><PageWithNavbar><MarketPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/events" element={<ProtectedRoute><PageWithNavbar><EventsPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/eventpost/:id" element={<ProtectedRoute><PageWithNavbar><EventPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/directorypost/:id" element={<ProtectedRoute><PageWithNavbar><DirectoryPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/offerpost/:id" element={<ProtectedRoute><PageWithNavbar><OfferPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/trucks" element={<ProtectedRoute><PageWithNavbar><TruckPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/truckpost/:id" element={<ProtectedRoute><PageWithNavbar><TruckPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/loads" element={<ProtectedRoute><PageWithNavbar><LoadPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/loadpost/:id" element={<ProtectedRoute><PageWithNavbar><LoadPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/blogpost/:id" element={<ProtectedRoute><PageWithNavbar><BlogPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/requestpost/:id" element={<ProtectedRoute><PageWithNavbar><RequestPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/vehiclepost/:id" element={<ProtectedRoute><PageWithNavbar><VehiclePost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/directory" element={<ProtectedRoute><PageWithNavbar><DirectoryPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/videopost/:id" element={<ProtectedRoute><PageWithNavbar><VideoPost /></PageWithNavbar></ProtectedRoute>} />

    <Route path="/orders" element={<ProtectedRoute><PageWithNavbar><OrdersPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/inbox" element={<ProtectedRoute><PageWithNavbar><InboxPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/tokens" element={<ProtectedRoute><PageWithNavbar><TokenPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/cart" element={<ProtectedRoute><PageWithNavbar><ShoppingCart /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><PageWithNavbar><SettingsPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/myprofile" element={<ProtectedRoute><PageWithNavbar><MyProfile /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/myphotos" element={<ProtectedRoute><PageWithNavbar><MyPhotos /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/myreviews" element={<ProtectedRoute><PageWithNavbar><MyReviews /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/viewprofile/:userId" element={<ProtectedRoute><PageWithNavbar><ViewProfile /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/viewphotos/:userId" element={<ProtectedRoute><PageWithNavbar><ViewPhotos /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/viewreviews/:userId" element={<ProtectedRoute><PageWithNavbar><ViewReviews /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/seller" element={<ProtectedRoute><PageWithNavbar><SellerPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/bookmarks" element={<ProtectedRoute><PageWithNavbar><BookmarksPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/testpage" element={<ProtectedRoute><PageWithNavbar><TestPage /></PageWithNavbar></ProtectedRoute>} />

    <Route path="/adminpanel" element={<ProtectedRoute allowedEmail="mitchellalvizures@gmail.com"><PageWithNavbar><AdminPanel /></PageWithNavbar></ProtectedRoute>} />
  </Routes>
);

export default PageRouter;
