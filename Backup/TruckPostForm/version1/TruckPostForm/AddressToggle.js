import React from 'react';

const AddressToggle = ({
  activeField,
  addressInput,
  handleAddressChange,
  suggestions,
  selectAddress
}) => {
  if (activeField !== 'address') return null;

  return (
    <div>
      <label className="form-label">Post Location (City)</label>
      <input
        type="text"
        value={addressInput}
        onChange={handleAddressChange}
        placeholder="Type a city..."
        required
      />

      {suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((s) => (
            <li key={s.place_id} onClick={() => selectAddress(s)}>
              {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressToggle;
