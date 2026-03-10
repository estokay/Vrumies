import React from 'react';

const RoutesToggle = ({
  activeField,
  originInput,
  handleOriginChange,
  originSuggestions,
  selectOrigin,
  removeOrigin,
  destinationInput,
  handleDestinationChange,
  destinationSuggestions,
  selectDestination,
  removeDestination,
  originCities,
  destinationCities,
  availableDate,
  handleAvailableDateChange
}) => {
  if (activeField !== 'routes') return null;

  return (
    <div className="truck-routes-container">
      <label className="form-label">Origin (Start City) - max 5</label>
      <input type="text" value={originInput} onChange={handleOriginChange} placeholder="Type a city..." />

      {originSuggestions.length > 0 && (
        <ul className="truck-autocomplete-suggestions">
          {originSuggestions.map((s) => (
            <li key={s.place_id} onClick={() => selectOrigin(s)}>
              {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
            </li>
          ))}
        </ul>
      )}

      <div className="truck-chips-container">
        {originCities.map((c, i) => (
          <div key={i} className="truck-chip">
            {c}
            <span className="truck-chip-close" onClick={() => removeOrigin(i)}>×</span>
          </div>
        ))}
      </div>

      <label className="form-label">Destination (End City) - max 5</label>
      <input type="text" value={destinationInput} onChange={handleDestinationChange} placeholder="Type a city..." />

      {destinationSuggestions.length > 0 && (
        <ul className="truck-autocomplete-suggestions">
          {destinationSuggestions.map((s) => (
            <li key={s.place_id} onClick={() => selectDestination(s)}>
              {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
            </li>
          ))}
        </ul>
      )}

      <div className="truck-chips-container">
        {destinationCities.map((c, i) => (
          <div key={i} className="truck-chip">
            {c}
            <span className="truck-chip-close" onClick={() => removeDestination(i)}>×</span>
          </div>
        ))}
      </div>

      <label className="form-label">Available Date</label>
      <input type="date" value={availableDate} onChange={handleAvailableDateChange} />
    </div>
  );
};

export default RoutesToggle;
