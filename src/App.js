// src/App.js
import './App.css';
import { HashRouter as Router } from 'react-router-dom';
import PageRouter from './Components/PageRouter';
import { AuthProvider } from './AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <PageRouter />

          <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false} 
            newestOnTop={true} 
            closeOnClick 
            pauseOnHover 
            draggable 
          />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
