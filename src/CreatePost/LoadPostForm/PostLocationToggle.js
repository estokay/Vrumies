import React from 'react';

const PostLocationToggle = ({
  postLocationInput,
  postLocationSuggestions,
  handlePostLocationChange,
  selectPostLocation
}) => {
  return (
    <div>
      <label className="form-label">Post Location (City)</label>
      <input
        type="text"
        value={postLocationInput}
        onChange={handlePostLocationChange}
        placeholder="Type a city..."
      />

      {postLocationSuggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {postLocationSuggestions.map((s) => (
            <li key={s.place_id} onClick={() => selectPostLocation(s)}>
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostLocationToggle;
