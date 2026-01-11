import React from 'react';

const PostLocation = ({ value, onChange, suggestions, onSelect }) => (
  <div className="toggle-field">
    <label className="mpf-form-label">Post Location (City)</label>
    <input
      type="text"
      placeholder="Type a city..."
      value={value}
      onChange={onChange}
    />
    {suggestions.length > 0 && (
      <ul className="market-suggestions">
        {suggestions.map((s) => (
          <li key={s.place_id} onClick={() => onSelect(s)}>
            {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default PostLocation;
