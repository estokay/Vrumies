import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Components/firebase";
import HomeHeader from './HomeHeader';
import './HomePage.css';
import ViewTopRatedSellers from "./ViewTopRatedSellers";
import Following from './Following';
import Popular from './Popular';
import PromotedPosts from './PromotedPosts';
import MoreFromSellers from './MoreFromSellers';
import NewPosts from './NewPosts';
import AuthOverlay from "../../Portal/AuthOverlay";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="home-page">
      <AuthOverlay isSignedIn={isSignedIn} />
      <HomeHeader />
      {/* <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}  /> */}
      <NewPosts />
      <Popular />
      <PromotedPosts />
      <ViewTopRatedSellers />
      <Following />
      <MoreFromSellers />
    </div>
  );
};

export default HomePage;
