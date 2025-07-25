import './App.css';
import Navbar from './Navbar';
import VideoPost from './VideoPost';
import Header from './Header';
import ExamplePosts from './ExamplePosts';
import ExampleData from './ExampleData';
import ViewData from './ViewData';
import CreatePost from './CreatePost';
import ContentHeader from './ContentHeader';
import NavbarWithPost from './NavbarWithPost';
import RequestHeader from './RequestHeader';
import ContentPage from './ContentPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RequestPage from './RequestPage';
import PageRouter from './PageRouter';


function App() {
  return (
    <div className="App">
      <PageRouter />
    </div>
  );
}

export default App;
