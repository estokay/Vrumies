import React from 'react';

function PostForms({ postType, post, onChange, disabled }) {
  // Helper to update fields in parent
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      onChange(name, files[0]);
    } else {
      onChange(name, value);
    }
  };

  // Render form fields by postType
  switch (postType) {
    case 'Video':
      return (
        <>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={post.address || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <input
            type="file"
            name="thumbnailImage"
            accept="image/*"
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <input
            type="file"
            name="videoFile"
            accept="video/*"
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <input
            type="text"
            name="websiteLink"
            placeholder="Website Link"
            value={post.websiteLink || ''}
            onChange={handleChange}
            disabled={disabled}
          />
          <input
            type="number"
            name="tokens"
            placeholder="Tokens"
            value={post.tokens || ''}
            onChange={handleChange}
            disabled={disabled}
            required
            min={0}
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={post.title || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={post.description || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
        </>
      );

    case 'Blog':
      return (
        <>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={post.address || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <input
            type="text"
            name="websiteLink"
            placeholder="Website Link"
            value={post.websiteLink || ''}
            onChange={handleChange}
            disabled={disabled}
          />
          <input
            type="number"
            name="tokens"
            placeholder="Tokens"
            value={post.tokens || ''}
            onChange={handleChange}
            disabled={disabled}
            required
            min={0}
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={post.title || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={post.description || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
        </>
      );

    case 'Forum':
      return (
        <>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={post.address || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <input
            type="text"
            name="websiteLink"
            placeholder="Website Link"
            value={post.websiteLink || ''}
            onChange={handleChange}
            disabled={disabled}
          />
          <input
            type="number"
            name="tokens"
            placeholder="Tokens"
            value={post.tokens || ''}
            onChange={handleChange}
            disabled={disabled}
            required
            min={0}
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={post.title || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={post.description || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
        </>
      );

    case 'Request':
      return (
        <>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={post.address || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <input
            type="text"
            name="websiteLink"
            placeholder="Website Link"
            value={post.websiteLink || ''}
            onChange={handleChange}
            disabled={disabled}
          />
          <input
            type="number"
            name="tokens"
            placeholder="Tokens"
            value={post.tokens || ''}
            onChange={handleChange}
            disabled={disabled}
            required
            min={0}
          />
          <select
            name="urgency"
            value={post.urgency || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          >
            <option value="" disabled>Select Urgency</option>
            <option value="Urgent">Urgent</option>
            <option value="I Can Wait">I Can Wait</option>
            <option value="Just Looking">Just Looking</option>
          </select>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={post.title || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={post.description || ''}
            onChange={handleChange}
            disabled={disabled}
            required
          />
        </>
      );

    default:
      return <p>Please select a post type above to see the form.</p>;
  }
}

export default PostForms;
