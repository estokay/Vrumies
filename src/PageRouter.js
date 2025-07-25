// src/PageRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContentPage from './ContentPage';
// import RequestPage from './RequestPage'; // Uncomment when needed

const PageRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContentPage />} />
        {/* <Route path="/request" element={<RequestPage />} /> */}
        {/* Add more pages here as needed */}
      </Routes>
    </Router>
  );
};

export default PageRouter;
