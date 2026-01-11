import React from 'react';

const BlogPostLocation = ({
  cityInput,
  suggestions,
  onCityChange,
  onSelectCity
}) => {
  return (
    <div>
      <label className="form-label">Post Location (City)</label>

      <input
        type="text"
        value={cityInput}
        onChange={onCityChange}
        placeholder="Type a city..."
        required
      />

      {suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              onClick={() => onSelectCity(s)}
            >
              {s.structured_formatting.main_text},{' '}
              {s.structured_formatting.secondary_text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogPostLocation;
