import React from 'react';

const LocationField = ({
  cityInput,
  handleCityChange,
  suggestions,
  selectCity
}) => {
  return (
    <div>
      <label className="form-label">Post Location (City)</label>

      <input
        type="text"
        value={cityInput}
        onChange={handleCityChange}
        placeholder="Type a city..."
        required
      />

      {suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((s) => (
            <li key={s.place_id} onClick={() => selectCity(s)}>
              {s.structured_formatting.main_text},
              {s.structured_formatting.secondary_text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationField;
