import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavbarWithPost from './NavbarWithPost';

// import your pages
import VideosPage from '../Pages/MainCategories/Videos/VideosPage';
import RequestPage from '../Pages/MainCategories/Requests/RequestPage';
import MarketPage from '../Pages/MainCategories/Market/MarketPage';
import EventsPage from '../Pages/MainCategories/Events/EventsPage';
import DirectoryPage from '../Pages/MainCategories/Directory/DirectoryPage';
import TruckPage from '../Pages/MainCategories/Trucks/TruckPage';
import LoadPage from '../Pages/MainCategories/Loads/LoadPage';
import ViewVideoPostPage from '../Pages/ViewPosts/Videos/ViewVideoPostPage';
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
import ViewProfile from '../Pages/ViewProfile/ViewProfile';
import SellerPage from '../Pages/Seller/SellerPage';
import EventPost from '../Pages/ViewPosts/Events/EventPost';
import DirectoryPost from '../Pages/ViewPosts/Directory/DirectoryPost';
import BlogPost from '../Pages/ViewPosts/Blogs/BlogPost';
import RequestPost from '../Pages/ViewPosts/Requests/RequestPost';
import VehiclePost from '../Pages/ViewPosts/Vehicles/VehiclePost';
import TruckPost from '../Pages/ViewPosts/Trucks/TruckPost';
import LoadPost from '../Pages/ViewPosts/Loads/LoadPost';
import BookmarksPage from '../Pages/Bookmarks/BookmarksPage';
import TestPage from '../Test/TestPage';
import Checkout from '../Pages/Checkout/Checkout';

// Layout for pages with Navbar
const PageWithNavbar = ({ children }) => (
  <>
    <NavbarWithPost />
    {children}
  </>
);

const PageRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/signin" replace />} />

    {/* Pages without Navbar */}
    <Route path="/signin" element={<SignIn />} />

    {/* Pages with Navbar */}
    <Route path="/videos" element={<PageWithNavbar><VideosPage /></PageWithNavbar>} />
    <Route path="/blogs" element={<PageWithNavbar><BlogPage /></PageWithNavbar>} />
    <Route path="/vehicles" element={<PageWithNavbar><VehiclePage /></PageWithNavbar>} />
    <Route path="/request" element={<PageWithNavbar><RequestPage /></PageWithNavbar>} />
    <Route path="/market" element={<PageWithNavbar><MarketPage /></PageWithNavbar>} />
    <Route path="/marketpost/:id" element={<PageWithNavbar><MarketPost /></PageWithNavbar>} />
    <Route path="/events" element={<PageWithNavbar><EventsPage /></PageWithNavbar>} />
    <Route path="/eventpost/:id" element={<PageWithNavbar><EventPost /></PageWithNavbar>} />
    <Route path="/directorypost/:id" element={<PageWithNavbar><DirectoryPost /></PageWithNavbar>} />
    <Route path="/trucks" element={<PageWithNavbar><TruckPage /></PageWithNavbar>} />
    <Route path="/truckpost/:id" element={<PageWithNavbar><TruckPost /></PageWithNavbar>} />
    <Route path="/loads" element={<PageWithNavbar><LoadPage /></PageWithNavbar>} />
    <Route path="/loadpost/:id" element={<PageWithNavbar><LoadPost /></PageWithNavbar>} />
    <Route path="/blogpost/:id" element={<PageWithNavbar><BlogPost /></PageWithNavbar>} />
    <Route path="/requestpost/:id" element={<PageWithNavbar><RequestPost /></PageWithNavbar>} />
    <Route path="/vehiclepost/:id" element={<PageWithNavbar><VehiclePost /></PageWithNavbar>} />
    <Route path="/directory" element={<PageWithNavbar><DirectoryPage /></PageWithNavbar>} />
    <Route path="/videopost/:id" element={<PageWithNavbar><ViewVideoPostPage /></PageWithNavbar>} />
    <Route path="/adminpanel" element={<PageWithNavbar><AdminPanel /></PageWithNavbar>} />
    <Route path="/orders" element={<PageWithNavbar><OrdersPage /></PageWithNavbar>} />
    <Route path="/inbox" element={<PageWithNavbar><InboxPage /></PageWithNavbar>} />
    <Route path="/tokens" element={<PageWithNavbar><TokenPage /></PageWithNavbar>} />
    <Route path="/cart" element={<PageWithNavbar><ShoppingCart /></PageWithNavbar>} />
    <Route path="/settings" element={<PageWithNavbar><SettingsPage /></PageWithNavbar>} />
    <Route path="/myprofile" element={<PageWithNavbar><MyProfile /></PageWithNavbar>} />
    {/* <Route path="/viewprofile" element={<PageWithNavbar><ViewProfile /></PageWithNavbar>} /> */}
    <Route path="/viewprofile/:userId" element={<PageWithNavbar><ViewProfile /></PageWithNavbar>} />
    <Route path="/seller" element={<PageWithNavbar><SellerPage /></PageWithNavbar>} />
    <Route path="/bookmarks" element={<PageWithNavbar><BookmarksPage /></PageWithNavbar>} />
    <Route path="/testpage" element={<PageWithNavbar><TestPage /></PageWithNavbar>} />
    <Route path="/checkout" element={<PageWithNavbar><Checkout /></PageWithNavbar>} />
  </Routes>
);

export default PageRouter;
