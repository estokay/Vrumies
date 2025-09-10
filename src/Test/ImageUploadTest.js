import React, { useState } from "react";
import { storage } from "../Components/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ImageUploadTest = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setProgress(0);
    setUrl("");

    const storageRef = ref(storage, `testUploads/${Date.now()}_${selected.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selected);

    uploadTask.on(
      "state_changed",
      (snapshot) => setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (err) => console.error("Upload failed:", err),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadURL);
        console.log("Upload success! URL:", downloadURL);
      }
    );
  };

  return (
    <div>
      <h2>Firebase Upload Test</h2>
      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" style={{ width: 200 }} />}
      {progress > 0 && <p>Progress: {Math.round(progress)}%</p>}
      {url && <p>Download URL: <a href={url}>{url}</a></p>}
    </div>
  );
};

export default ImageUploadTest;
