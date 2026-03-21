import React,{useEffect,useState} from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";
import PostRenderer from "../../Components/PostLayouts/PostRenderer";
import "./PromotedPosts.css";

function PromotedPosts(){
  const [posts,setPosts]=useState([]);
  const [loading,setLoading]=useState(true);
  const allowedTypes=["video","blog","event","request","market","directory","trucks","vehicle","loads"];

  useEffect(()=>{
    const fetchPromotedPosts=async()=>{
      try {
        const snapshot=await getDocs(collection(db,"Posts"));
        const results = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        })
        .filter(p => {
          const tokens = p.tokens;

          return (
            allowedTypes.includes(p.type) &&
            typeof tokens === "number" &&
            Number.isFinite(tokens) &&
            tokens > 0
          );
        })
        .sort((a, b) => b.tokens - a.tokens)
        .slice(0, 20);
        setPosts(results);
      }catch(err){console.error(err);}
      finally{setLoading(false);}
    };
    fetchPromotedPosts();
  },[]);

  return(
    <div className="promoted-panel">
      <div className="promoted-header"><h3>🚀 Promoted Posts</h3><span className="promoted-subtitle">Posts boosted with the most tokens</span></div>
      <div className="promoted-scroll">
        {loading && <p className="promoted-loading">Loading promoted posts...</p>}
        {!loading && !posts.length && <p className="promoted-empty">No promoted posts yet.</p>}
        {posts.map(post=>(<div key={post.id} className="promoted-post-wrapper"><PostRenderer post={post}/></div>))}
      </div>
    </div>
  );
}

export default PromotedPosts;