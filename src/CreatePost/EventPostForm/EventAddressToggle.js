import React, { useState, useEffect, useRef } from 'react';
import { GOOGLE_API_KEY } from '../../Components/config';

const EventAddressToggle = ({ eventAddress, onAddressSelect }) => {
  const [inputValue, setInputValue] = useState(eventAddress || '');
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteServiceRef = useRef(null);

  // Load Google Places API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      };
      document.body.appendChild(script);
    } else {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  // Input change
  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (!autocompleteServiceRef.current || !value) {
      setSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ['address'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) {
          setSuggestions([]);
          return;
        }
        setSuggestions(predictions);
      }
    );
  };

  // Select an address
  const handleSelect = (place) => {
    setInputValue(place.description);
    setSuggestions([]);
    if (onAddressSelect) onAddressSelect(place.description);
  };

  // Remove address
  const handleRemove = () => {
    setInputValue('');
    setSuggestions([]);
    if (onAddressSelect) onAddressSelect('');
  };

  return (
    <div className="event-post-form">
      <label className="event-form-label">Event Address</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter event address..."
      />

      {suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map(s => (
            <li key={s.place_id} onClick={() => handleSelect(s)}>
              {s.description}
            </li>
          ))}
        </ul>
      )}

      {inputValue && (
        <div className="chip">
          {inputValue}
          <button type="button" className="chip-remove" onClick={handleRemove}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default EventAddressToggle;