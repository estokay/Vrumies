// src/App.js
import './App.css';
import { HashRouter as Router } from 'react-router-dom';
import PageRouter from './Components/PageRouter';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <PageRouter />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
