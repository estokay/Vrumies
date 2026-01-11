import axios from 'axios';
import { CLOUDINARY_CONFIG } from '../../Components/config';

const VideoUploadField = ({ formData, setFormData }) => {
  const uploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_CONFIG.preset);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`,
      data
    );

    setFormData((prev) => ({ ...prev, video: res.data.secure_url }));
  };

  return (
    <div>
      <label className="form-label">Upload Video</label>
      <input type="file" accept="video/*" onChange={uploadVideo} />
      {formData.video && (
        <video src={formData.video} controls className="preview-media" />
      )}
    </div>
  );
};

export default VideoUploadField;
