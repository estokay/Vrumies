import React from 'react';

const PostLocation = ({ formData, setFormData, locationInput, setLocationInput, suggestions, setSuggestions, selectLocation, handleLocationChange }) => {
  return (
    <div>
      <label className="directory-form-label">Post Location (City)</label>
      <input
        type="text"
        placeholder="Type a city..."
        value={locationInput}
        onChange={handleLocationChange}
        required
      />
      {suggestions.length > 0 && (
        <ul className="directory-suggestions">
          {suggestions.map((s) => (
            <li key={s.place_id} onClick={() => selectLocation(s)}>
              {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostLocation;
