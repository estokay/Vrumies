import React from 'react';

const EventLocationToggle = ({
  locationInput,
  suggestions,
  onChange,
  onSelect
}) => {
  return (
    <div className="autocomplete-wrapper">
      <label className="event-form-label">Post Location (City)</label>

      <input
        type="text"
        placeholder="Type a city..."
        value={locationInput}
        onChange={onChange}
        required
      />

      {suggestions.length > 0 && (
        <ul className="event-suggestions">
          {suggestions.map((s) => (
            <li key={s.place_id} onClick={() => onSelect(s)}>
              {s.structured_formatting.main_text},{' '}
              {s.structured_formatting.secondary_text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventLocationToggle;
