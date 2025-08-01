import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PageRouter from './Components/PageRouter'; // ✅ use your router
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PageRouter />  // ✅ HashRouter is used inside here
  </React.StrictMode>
);

reportWebVitals();
