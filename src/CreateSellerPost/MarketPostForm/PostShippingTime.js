import React from 'react';

const PostShippingTime = ({ value, onChange }) => (
  <>
    <label className="mpf-form-label">Shipping Time</label>
    <select name="shippingTime" value={value} onChange={onChange} className="mpf-dropdown">
      <option value="">Select shipping time</option>
      <option value="Local Pickup">Local Pickup</option>
      <option value="2-4 days">2-4 days</option>
      <option value="4-7 days">4-7 days</option>
      <option value="7-10 days">7-10 days</option>
    </select>
  </>
);

export default PostShippingTime;
