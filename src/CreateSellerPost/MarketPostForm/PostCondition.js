import React from 'react';

const PostCondition = ({ value, onChange }) => (
  <>
    <label className="mpf-form-label">Condition</label>
    <select name="condition" value={value} onChange={onChange} className="mpf-dropdown">
      <option value="">Select condition</option>
      <option value="New">New</option>
      <option value="Used">Used</option>
    </select>
  </>
);

export default PostCondition;
