import { useEffect, useRef, useState } from 'react';
import { GOOGLE_API_KEY } from '../../Components/config';

const AddressField = ({ formData, setFormData }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const serviceRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.onload = () => {
        serviceRef.current = new window.google.maps.places.AutocompleteService();
      };
      document.body.appendChild(script);
    } else {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!value || !serviceRef.current) return;

    serviceRef.current.getPlacePredictions(
      { input: value, types: ['(cities)'], componentRestrictions: { country: 'us' } },
      (preds) => setSuggestions(preds || [])
    );
  };

  const selectCity = (place) => {
    const city = place.terms[0]?.value || '';
    const state = place.terms[1]?.value || '';
    setFormData((prev) => ({ ...prev, city, state, location: `${city}, ${state}` }));
    setInput(`${city}, ${state}`);
    setSuggestions([]);
  };

  return (
    <div>
      <label className="form-label">Post Location</label>
      <input value={input} onChange={handleChange} placeholder="Type a city..." />
      <ul className="autocomplete-suggestions">
        {suggestions.map((s) => (
          <li key={s.place_id} onClick={() => selectCity(s)}>
            {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddressField;
