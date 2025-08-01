// src/PageRouter.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ContentPage from '../Pages/MainCategories/Videos/ContentPage';
import RequestPage from '../Pages/MainCategories/Requests/RequestPage';
import MarketPage from '../Pages/MainCategories/Market/MarketPage';
import EventsPage from '../Pages/MainCategories/Events/EventsPage';
import DirectoryPage from '../Pages/MainCategories/Directory/DirectoryPage';
import ViewVideoPostPage from '../Pages/ViewPosts/Videos/ViewVideoPostPage';

const PageRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContentPage />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/videopost/:id" element={<ViewVideoPostPage />} />
        {/* Add more pages here as needed */}
      </Routes>
    </Router>
  );
};

export default PageRouter;
