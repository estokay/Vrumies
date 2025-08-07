// UploadToCloudinary.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadToCloudinary = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'vrumies_preset'); // your unsigned preset

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dmjvngk3o/image/upload',
        formData
      );
      setImageUrl(res.data.secure_url);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload to Cloudinary (Unsigned)</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" width="300" />
        </div>
      )}
    </div>
  );
};

export default UploadToCloudinary;
