import './App.css';
import Navbar from './Navbar';
import VideoPost from './VideoPost';
import Header from './Header';
import ExamplePosts from './ExamplePosts';
import ExampleData from './ExampleData';
import ViewData from './ViewData';

function App() {

      console.log('ExampleData:', ExampleData);
      console.log('ViewData:', ViewData);

  return (
    <div className="App">

      <Navbar />
      <Header />
      <ExamplePosts />
      
      <ExampleData />
      {/*<ViewData />*/}

    </div>
  );
}

export default App;
