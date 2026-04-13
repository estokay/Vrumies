import axios from 'axios';
import { useState } from 'react';
import { CLOUDINARY_CONFIG } from '../../Components/config';

const VideoUploadField = ({ formData, setFormData, onUploadStateChange  }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadProgress(0);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_CONFIG.preset);

    try {
      setIsUploading(true);
      onUploadStateChange(true); // 🔥 tell parent

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`,
        data,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      const previewImage = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload/so_1/${res.data.public_id}.jpg`;

      setFormData((prev) => ({
        ...prev,
        video: res.data.secure_url,
        videoDuration: Math.round(res.data.duration),
        videoPreviewImage: previewImage,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      onUploadStateChange(false); // 🔥 done uploading
    }
  };

  return (
    <div>
      <label className="form-label">Upload Video</label>
      <input type="file" accept="video/*" onChange={uploadVideo} />

      {isUploading && (
        <p className="uploading-text">
          Uploading: {uploadProgress}%
        </p>
      )}

      {formData.video && (
        <video src={formData.video} controls className="preview-media" />
      )}
    </div>
  );
};

export default VideoUploadField;
