import React from 'react';

function PostForms({ postType, post, onChange, disabled }) {
  if (!postType) return null;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    onChange(name, files ? files[0] : value);
  };

  return (
    <div className="post-form-fields">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={post.title}
        onChange={handleInputChange}
        disabled={disabled}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={post.description}
        onChange={handleInputChange}
        disabled={disabled}
      />

      {postType === 'Video' && (
        <input
          type="file"
          name="videoFile"
          accept="video/*"
          onChange={handleInputChange}
          disabled={disabled}
        />
      )}

      {postType === 'Blog' && (
        <>
          <input
            type="text"
            name="websiteLink"
            placeholder="Website Link"
            value={post.websiteLink}
            onChange={handleInputChange}
            disabled={disabled}
          />
          <input
            type="file"
            name="thumbnailImage"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled}
          />
        </>
      )}

      {postType === 'Request' && (
        <>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={post.address}
            onChange={handleInputChange}
            disabled={disabled}
          />
          <input
            type="text"
            name="urgency"
            placeholder="Urgency Level"
            value={post.urgency}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </>
      )}

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled}
      />

      <input
        type="text"
        name="tokens"
        placeholder="Tokens"
        value={post.tokens}
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );
}

export default PostForms;
