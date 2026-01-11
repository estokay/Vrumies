import React from 'react';

const PostLocation = ({
  locationInput,
  suggestions,
  onLocationChange,
  onSelectLocation
}) => {
  return (
    <div className="autocomplete-wrapper">
      <label className="mpf-form-label">Post Location (City)</label>

      <input
        type="text"
        placeholder="Type a city..."
        value={locationInput}
        onChange={onLocationChange}
        required
      />

      {suggestions.length > 0 && (
        <ul className="market-suggestions">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              onClick={() => onSelectLocation(s)}
            >
              {s.structured_formatting.main_text},
              {s.structured_formatting.secondary_text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostLocation;
