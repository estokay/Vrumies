import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavbarWithPost from './Navbar/NavbarWithPost';
import ProtectedRoute from "./ProtectedRoute";
import MobileLayout from "./NavbarMobile/MobileLayout";

// import your pages
import HomePage from '../Pages/Home/HomePage';
import Home from '../Pages/HomeMobile/Home';
import VideosPage from '../Pages/MainCategories/Videos/VideosPage';
import VideoPageMobile from '../Pages/MainCategories/VideosMobile/VideoPageMobile';
import RequestPage from '../Pages/MainCategories/Requests/RequestPage';
import RequestPageMobile from '../Pages/MainCategories/RequestsMobile/RequestPageMobile';
import MarketPage from '../Pages/MainCategories/Market/MarketPage';
import MarketPageMobile from '../Pages/MainCategories/MarketMobile/MarketPageMobile';
import EventsPage from '../Pages/MainCategories/Events/EventsPage';
import EventPageMobile from '../Pages/MainCategories/EventsMobile/EventPageMobile';
import DirectoryPage from '../Pages/MainCategories/Directory/DirectoryPage';
import DirectoryPageMobile from '../Pages/MainCategories/DirectoryMobile/DirectoryPageMobile';
import TruckPage from '../Pages/MainCategories/Trucks/TruckPage';
import TruckPageMobile from '../Pages/MainCategories/TrucksMobile/TruckPageMobile';
import LoadPage from '../Pages/MainCategories/Loads/LoadPage';
import LoadPageMobile from '../Pages/MainCategories/LoadsMobile/LoadPageMobile';
import VideoPost from '../Pages/ViewPosts/Videos/VideoPost';
import VideoPostMobile from '../Pages/ViewPosts/VideosMobile/VideoPostMobile';
import AdminPanel from '../Pages/Admin Panel/AdminPanel';
import BlogPage from '../Pages/MainCategories/Blogs/BlogPage';
import BlogPageMobile from '../Pages/MainCategories/BlogsMobile/BlogPageMobile';
import VehiclePage from '../Pages/MainCategories/Vehicles/VehiclePage';
import VehiclePageMobile from '../Pages/MainCategories/VehiclesMobile/VehiclePageMobile';
import OrdersPage from '../Pages/Orders/OrdersPage';
import OrdersPageMobile from '../Pages/OrdersMobile/OrdersPageMobile';
import InboxPage from '../Pages/Messages/InboxPage';
import InboxPageMobile from '../Pages/MessagesMobile/InboxPageMobile';
import TokenPage from '../Pages/Tokens/TokenPage';
import TokenPageMobile from '../Pages/TokensMobile/TokenPageMobile';
import SignIn from '../Pages/SignIn/SignIn';
import ShoppingCart from '../Pages/Cart/ShoppingCart';
import ShoppingCartMobile from '../Pages/CartMobile/ShoppingCartMobile';
import MarketPost from '../Pages/ViewPosts/Market/MarketPost';
import MarketPostMobile from '../Pages/ViewPosts/MarketMobile/MarketPostMobile';
import SettingsPage from '../Pages/Settings/SettingsPage';
import SettingsPageMobile from '../Pages/SettingsMobile/SettingsPageMobile';
import MyProfile from '../Pages/MyProfile/MyProfile';
import MyProfileMobile from '../Pages/MyProfileMobile/MyProfileMobile';
import MyPhotos from '../Pages/MyProfilePhotos/MyPhotos';
import MyReviews from '../Pages/MyProfileReviews/MyReviews';
import ViewProfile from '../Pages/ViewProfile/ViewProfile';
import ViewProfileMobile from '../Pages/ViewProfileMobile/ViewProfileMobile';
import ViewPhotos from '../Pages/ViewProfilePhotos/ViewPhotos';
import ViewReviews from '../Pages/ViewProfileReviews/ViewReviews';
import SellerPage from '../Pages/Seller/SellerPage';
import SellerPageMobile from '../Pages/SellerMobile/SellerPageMobile';
import EventPost from '../Pages/ViewPosts/Events/EventPost';
import EventPostMobile from '../Pages/ViewPosts/EventsMobile/EventPostMobile';
import DirectoryPost from '../Pages/ViewPosts/Directory/DirectoryPost';
import DirectoryPostMobile from '../Pages/ViewPosts/DirectoryMobile/DirectoryPostMobile';
import OfferPost from '../Pages/ViewPosts/CustomOffers/OfferPost';
import OfferPostMobile from '../Pages/ViewPosts/CustomOffersMobile/OfferPostMobile';
import BlogPost from '../Pages/ViewPosts/Blogs/BlogPost';
import BlogPostMobile from '../Pages/ViewPosts/BlogsMobile/BlogPostMobile';
import RequestPost from '../Pages/ViewPosts/Requests/RequestPost';
import RequestPostMobile from '../Pages/ViewPosts/RequestsMobile/RequestPostMobile';
import VehiclePost from '../Pages/ViewPosts/Vehicles/VehiclePost';
import VehiclePostMobile from '../Pages/ViewPosts/VehiclesMobile/VehiclePostMobile';
import TruckPost from '../Pages/ViewPosts/Trucks/TruckPost';
import TruckPostMobile from '../Pages/ViewPosts/TrucksMobile/TruckPostMobile';
import LoadPost from '../Pages/ViewPosts/Loads/LoadPost';
import LoadPostMobile from '../Pages/ViewPosts/LoadsMobile/LoadPostMobile';
import BookmarksPage from '../Pages/Bookmarks/BookmarksPage';
import BookmarksPageMobile from '../Pages/BookmarksMobile/BookmarksPageMobile';
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
    <Route path="/homemobile" element={<MobileLayout><Home /></MobileLayout>} />
    <Route path="/videos" element={<ProtectedRoute><PageWithNavbar><VideosPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/videosmobile" element={<ProtectedRoute><MobileLayout><VideoPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/blogs" element={<ProtectedRoute><PageWithNavbar><BlogPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/blogsmobile" element={<ProtectedRoute><MobileLayout><BlogPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/vehicles" element={<ProtectedRoute><PageWithNavbar><VehiclePage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/vehiclesmobile" element={<ProtectedRoute><MobileLayout><VehiclePageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/request" element={<ProtectedRoute><PageWithNavbar><RequestPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/requestmobile" element={<ProtectedRoute><MobileLayout><RequestPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/market" element={<ProtectedRoute><PageWithNavbar><MarketPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/marketmobile" element={<ProtectedRoute><MobileLayout><MarketPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/marketpost/:id" element={<ProtectedRoute><PageWithNavbar><MarketPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/marketpostmobile/:id" element={<ProtectedRoute><MobileLayout><MarketPostMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/events" element={<ProtectedRoute><PageWithNavbar><EventsPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/eventsmobile" element={<ProtectedRoute><MobileLayout><EventPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/eventpost/:id" element={<ProtectedRoute><PageWithNavbar><EventPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/eventpostmobile/:id" element={<ProtectedRoute><MobileLayout><EventPostMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/directorypost/:id" element={<ProtectedRoute><PageWithNavbar><DirectoryPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/directorypostmobile/:id" element={<ProtectedRoute><MobileLayout><DirectoryPostMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/offerpost/:id" element={<ProtectedRoute><PageWithNavbar><OfferPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/offerpostmobile/:id" element={<ProtectedRoute><MobileLayout><OfferPostMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/trucks" element={<ProtectedRoute><PageWithNavbar><TruckPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/trucksmobile" element={<ProtectedRoute><MobileLayout><TruckPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/truckpost/:id" element={<ProtectedRoute><PageWithNavbar><TruckPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/truckpostmobile/:id" element={<ProtectedRoute><MobileLayout><TruckPostMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/loads" element={<ProtectedRoute><PageWithNavbar><LoadPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/loadsmobile" element={<ProtectedRoute><MobileLayout><LoadPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/loadpost/:id" element={<ProtectedRoute><PageWithNavbar><LoadPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/loadpostmobile/:id" element={<ProtectedRoute><MobileLayout><LoadPostMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/blogpost/:id" element={<ProtectedRoute><PageWithNavbar><BlogPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/blogpostmobile/:id" element={<ProtectedRoute><MobileLayout><BlogPostMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/requestpost/:id" element={<ProtectedRoute><PageWithNavbar><RequestPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/requestpostmobile/:id" element={<ProtectedRoute><MobileLayout><RequestPostMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/vehiclepost/:id" element={<ProtectedRoute><PageWithNavbar><VehiclePost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/vehiclepostmobile/:id" element={<ProtectedRoute><MobileLayout><VehiclePostMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/directory" element={<ProtectedRoute><PageWithNavbar><DirectoryPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/directorymobile" element={<ProtectedRoute><MobileLayout><DirectoryPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/videopost/:id" element={<ProtectedRoute><PageWithNavbar><VideoPost /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/videopostmobile/:id" element={<ProtectedRoute><MobileLayout><VideoPostMobile /></MobileLayout></ProtectedRoute>} />

    <Route path="/orders" element={<ProtectedRoute><PageWithNavbar><OrdersPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/ordersmobile" element={<ProtectedRoute><MobileLayout><OrdersPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/inbox" element={<ProtectedRoute><PageWithNavbar><InboxPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/inboxmobile" element={<ProtectedRoute><MobileLayout><InboxPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/tokens" element={<ProtectedRoute><PageWithNavbar><TokenPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/tokensmobile" element={<ProtectedRoute><MobileLayout><TokenPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/cart" element={<ProtectedRoute><PageWithNavbar><ShoppingCart /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/cartmobile" element={<ProtectedRoute><MobileLayout><ShoppingCartMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><PageWithNavbar><SettingsPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/settingsmobile" element={<ProtectedRoute><MobileLayout><SettingsPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/myprofile" element={<ProtectedRoute><PageWithNavbar><MyProfile /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/myprofilemobile" element={<ProtectedRoute><MobileLayout><MyProfileMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/myphotos" element={<ProtectedRoute><PageWithNavbar><MyPhotos /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/myreviews" element={<ProtectedRoute><PageWithNavbar><MyReviews /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/viewprofile/:userId" element={<ProtectedRoute><PageWithNavbar><ViewProfile /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/viewprofilemobile/:userId" element={<ProtectedRoute><MobileLayout><ViewProfileMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/viewphotos/:userId" element={<ProtectedRoute><PageWithNavbar><ViewPhotos /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/viewreviews/:userId" element={<ProtectedRoute><PageWithNavbar><ViewReviews /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/seller" element={<ProtectedRoute><PageWithNavbar><SellerPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/sellermobile" element={<ProtectedRoute><MobileLayout><SellerPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/bookmarks" element={<ProtectedRoute><PageWithNavbar><BookmarksPage /></PageWithNavbar></ProtectedRoute>} />
    <Route path="/bookmarksmobile" element={<ProtectedRoute><MobileLayout><BookmarksPageMobile /></MobileLayout></ProtectedRoute>} />
    <Route path="/testpage" element={<ProtectedRoute><PageWithNavbar><TestPage /></PageWithNavbar></ProtectedRoute>} />

    <Route path="/adminpanel" element={<ProtectedRoute allowedEmail="mitchellalvizures@gmail.com" redirectTo="/signin"><PageWithNavbar><AdminPanel /></PageWithNavbar></ProtectedRoute>} />
  </Routes>
);

export default PageRouter;
