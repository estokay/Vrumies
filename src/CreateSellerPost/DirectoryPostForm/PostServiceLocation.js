import React from 'react';

const PostServiceLocation = ({ formData, handleChange }) => {
  return (
    <>
      <label className="directory-form-label">Service Location</label>
      <select name="serviceLocation" value={formData.serviceLocation} onChange={handleChange} className="directory-dropdown">
        <option value="">Select service location</option>
        <option value="Business Address">Business Address</option>
        <option value="Customer Address">Customer Address</option>
      </select>
      {formData.serviceLocation === 'Business Address' && (
        <input
          type="text"
          name="businessAddress"
          placeholder="Enter business address"
          value={formData.businessAddress}
          onChange={handleChange}
          className="directory-post-form-input"
        />
      )}
    </>
  );
};

export default PostServiceLocation;
