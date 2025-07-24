import './App.css';
import Navbar from './Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <img src="/logo-clear.png" className="App-logo" alt="logo" />
        <p>
          The Automotive Marketplace
        </p>
        <a
          className="App-link"
          href="https://vrumies.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to the Vrumies Website
        </a>
      </header>
    </div>
  );
}

export default App;
