import axios from 'axios';
import { CLOUDINARY_CONFIG } from '../../Components/config';

const ImageUploadField = ({ formData, setFormData }) => {
  const uploadImages = async (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 7) {
      return alert('Max 7 images');
    }

    const uploads = await Promise.all(
      files.map(file => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_CONFIG.preset);
        return axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
          data
        );
      })
    );

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploads.map(r => r.data.secure_url)],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <label className="form-label">Upload Images</label>

      <input type="file" multiple accept="image/*" onChange={uploadImages} />

      <div className="preview-gallery">
        {formData.images.map((img, i) => (
          <div
            key={i}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <img
              src={img}
              alt="preview"
              className="preview-media"
            />

            <button
              type="button"
              onClick={() => handleRemoveImage(i)}
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'red',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadField;
