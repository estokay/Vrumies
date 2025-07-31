// src/PageRouter.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ContentPage from './ContentPage';
import RequestPage from './RequestPage';
import MarketPage from './MarketPage';
import EventsPage from './EventsPage';
import DirectoryPage from './DirectoryPage';
import ViewVideoPostPage from './ViewVideoPostPage';

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
