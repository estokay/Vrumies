import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Components/firebase";
import { FaSearch } from "react-icons/fa";
import SearchDropDown from "./SearchDropDown";
import "./SearchBar.css";

const allowedTypes = [
  "video","blog","event","request","market","directory","trucks","vehicle","loads"
];

export default function SearchBar() {
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchPosts = async () => {
      if (queryText.length < 2) return setResults([]);
      const q = query(collection(db, "Posts"), where("type","in",allowedTypes));
      const snapshot = await getDocs(q);
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(post =>
          post.title?.toLowerCase().includes(queryText.toLowerCase()) ||
          post.description?.toLowerCase().includes(queryText.toLowerCase())
        );
      setResults(filtered.slice(0,8));
    };
    searchPosts();
  }, [queryText]);

  return (
    <div className="hh-header-search">
      <input
        type="text"
        placeholder="Search products, services, vehicles..."
        value={queryText}
        onChange={e => setQueryText(e.target.value)}
      />
      <button><FaSearch /></button>
      {results.length > 0 && <SearchDropDown results={results} />}
    </div>
  );
}