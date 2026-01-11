import React from 'react';

const PostPrice = ({ value, onChange }) => {
  return (
    <div>
      <label className="mpf-form-label">Price</label>
      <input
        type="text"
        placeholder="$0.00"
        value={value || ''}
        onChange={onChange}
        className="mpf-dropdown"
      />
    </div>
  );
};

export default PostPrice;
