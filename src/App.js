import './App.css';
import VideoPost from './VideoPost';
import Header from './Header';
import ExamplePosts from './ExamplePosts';
import ExampleData from './ExampleData';
import ViewData from './ViewData';

import ContentHeader from './ContentHeader';
import NavbarWithPost from './NavbarWithPost';
import RequestHeader from './RequestHeader';
import ContentPage from './ContentPage';
import { HashRouter as Router } from 'react-router-dom';
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
