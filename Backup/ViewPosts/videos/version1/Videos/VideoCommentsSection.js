import React, { useState } from 'react';
import './VideoCommentsSection.css';

function VideoCommentsSection() {
  const [comment, setComment] = useState('');
  const maxChars = 130;

  // Hardcoded comments with online avatar URLs
  const commentsData = [
    {
      name: 'MICHAEL DARIUS',
      date: 'MARCH 29, 2022',
      avatar: 'https://i.pravatar.cc/40?img=12',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat at eget massa sollicitudin. Ac orci ornare est, orci enim porta egestas. Mauris at auctor purus neque amet. Est, tellus pharetra, dictum donec laoreet in feugiat leo. A feugiat fermentum.'
    },
    {
      name: 'FRANK MIKK',
      date: 'MARCH 29, 2022',
      avatar: 'https://i.pravatar.cc/40?img=32',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat at eget massa sollicitudin. Ac orci ornare est, orci enim porta egestas. Mauris at auctor purus neque amet. Est, tellus pharetra, dictum donec laoreet in feugiat leo. A feugiat fermentum.'
    },
    {
      name: 'STEPHEN DARIUS',
      date: 'MARCH 29, 2022',
      avatar: 'https://i.pravatar.cc/40?img=45',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat at eget massa sollicitudin. Ac orci ornare est, orci enim porta egestas. Mauris at auctor purus neque amet. Est, tellus pharetra, dictum donec laoreet in feugiat leo. A feugiat fermentum.'
    }
  ];

  const handleSubmit = () => {
    if (comment.trim() !== '') {
      alert('Comment submitted: ' + comment);
      setComment('');
    }
  };

  return (
    <div className="video-comments-section">
      {/* Header */}
      <div className="section-header">
        <h2>COMMENTS SECTION</h2>
        <div className="votes">
          <span className="likes">👍 60</span>
          <span className="dislikes">👎 9</span>
        </div>
      </div>

      {/* Input box */}
      <div className="comment-input-row">
        <img
          src="https://i.pravatar.cc/40?img=5"
          alt="Current User"
          className="avatar"
        />
        <div className="input-container">
          <div className="input-header">
            <span className="username">Jake Anderson</span>
            <span className="date">MARCH 29, 2022</span>
            <span className="char-limit">Maximum Characters Allowed: {maxChars}</span>
          </div>
          <input
            type="text"
            value={comment}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                setComment(e.target.value);
              }
            }}
            placeholder="Type your comment here..."
          />
        </div>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>

      {/* Hardcoded comment list */}
      {commentsData.map((c, index) => (
        <div key={index} className="comment-row">
          <img src={c.avatar} alt={c.name} className="avatar" />
          <div className="comment-content">
            <div className="comment-header">
              <span className="username">{c.name}</span>
              <span className="date">{c.date}</span>
            </div>
            <p>{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoCommentsSection;
