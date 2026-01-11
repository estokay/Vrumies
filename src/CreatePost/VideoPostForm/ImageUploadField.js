import axios from 'axios';
import { CLOUDINARY_CONFIG } from '../../Components/config';

const ImageUploadField = ({ formData, setFormData }) => {
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_CONFIG.preset);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      data
    );

    setFormData((prev) => ({ ...prev, image: res.data.secure_url }));
  };

  return (
    <div>
      <label className="form-label">Upload Image</label>
      <input type="file" accept="image/*" onChange={uploadImage} />
      {formData.image && (
        <img src={formData.image} className="preview-media" alt="preview" />
      )}
    </div>
  );
};

export default ImageUploadField;
