import React, { useState } from "react";
import DeletePostOverlay from "../Components/Overlays/DeletePostOverlay";

export default function ExampleDeletePost() {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <button onClick={() => setShowDelete(true)}>Delete Post</button>

      <DeletePostOverlay
        postId="abc123"
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={(id) => {
          console.log("Deleted post:", id);
          setShowDelete(false);
        }}
      />
    </>
  );
}