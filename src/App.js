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

function App() {

      console.log('ExampleData:', ExampleData);
      console.log('ViewData:', ViewData);

  return (
    <div className="App">

      {/*<Navbar />*/}
      <NavbarWithPost />
      <ContentHeader />
      {/*<Header />*/}
      <ExamplePosts />
      
      <ExampleData />
      {/*<ViewData />*/}
      {/*<CreatePost />*/}

    </div>
  );
}

export default App;
