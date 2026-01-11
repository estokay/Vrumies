import React from 'react';

const RoutesToggle = ({
  pickupInput,
  dropoffInput,
  pickupSuggestions,
  dropoffSuggestions,
  handlePickupChange,
  handleDropoffChange,
  selectPickup,
  selectDropoff,
  formData,
  handleChange
}) => {
  return (
    <div className="load-details-container">
      <label className="form-label">Pickup Address</label>
      <input
        type="text"
        value={pickupInput}
        onChange={handlePickupChange}
        placeholder="Start Address..."
      />

      {pickupSuggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {pickupSuggestions.map((s) => (
            <li key={s.place_id} onClick={() => selectPickup(s)}>
              {s.description}
            </li>
          ))}
        </ul>
      )}

      <div>
        {formData.pickupLocations.map((loc, i) => (
          <span key={i} className="chip">{loc}</span>
        ))}
      </div>

      <label className="form-label">Drop-Off Address</label>
      <input
        type="text"
        value={dropoffInput}
        onChange={handleDropoffChange}
        placeholder="Destination Address..."
      />

      {dropoffSuggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {dropoffSuggestions.map((s) => (
            <li key={s.place_id} onClick={() => selectDropoff(s)}>
              {s.description}
            </li>
          ))}
        </ul>
      )}

      <div>
        {formData.dropoffLocations.map((loc, i) => (
          <span key={i} className="chip">{loc}</span>
        ))}
      </div>

      <label className="form-label">Available Date</label>
      <input
        type="date"
        name="availableDate"
        value={formData.availableDate}
        onChange={handleChange}
      />
    </div>
  );
};

export default RoutesToggle;
