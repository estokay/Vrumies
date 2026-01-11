import React from 'react';

const PostPrice = ({ formData, setFormData }) => {
  return (
    <div>
      <label className="directory-form-label">Price</label>
      <input
        type="text"
        name="price"
        placeholder="$0.00"
        value={formData.price || ''}
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9.]/g, '');
          const floatVal = parseFloat(value);
          value = !isNaN(floatVal) ? `$${floatVal.toFixed(2)}` : '$0.00';
          setFormData((prev) => ({ ...prev, price: value }));
        }}
        className="directory-post-form-input"
      />
    </div>
  );
};

export default PostPrice;
