import { useEffect, useState } from "react";
import { db } from "../Components/firebase"; // adjust path
import { doc, getDoc } from "firebase/firestore";

function useGetPostLink({ postId }) {
  const [link, setLink] = useState("");

  useEffect(() => {
    const fetchLink = async () => {
      if (!postId) return;

      try {
        // 1. Fetch post
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) {
          setLink(""); // or some default
          return;
        }

        const postData = postSnap.data();

        // 2. Map post type to route
        const postRouteMap = {
          video: "videopost",
          blog: "blogpost",
          vehicle: "vehiclepost",
          event: "eventpost",
          market: "marketpost",
          directory: "directorypost",
          request: "requestpost",
          loads: "loadpost",
          trucks: "truckpost",
          offer: "offerpost",
        };

        const type = postData.type || "blog";
        const url = `/${postRouteMap[type] || "blogpost"}/${postId}`;
        setLink(url);
      } catch (err) {
        console.error("Error fetching post link:", err);
        setLink(""); // fallback
      }
    };

    fetchLink();
  }, [postId]);

  return link; // return string directly
}

export default useGetPostLink;
