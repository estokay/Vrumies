import React from 'react';

const TokenHeader = () => {
  return (
    <div className="tokens-header-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

        /* Ensure padding is included in width calculations */
        .tokens-header-wrapper {
          width: 100%;
          max-width: 100%; /* Prevents overflow */
          margin-left: auto;
          margin-right: auto;
          padding: 1rem 2rem; /* Reduced horizontal padding */
          display: flex;
          align-items: center;
          justify-content: flex-start;
          background-image: url('https://miro.medium.com/v2/resize:fit:1400/1*6mJcjTUqaSlRQA4O58TWCg.jpeg');
          background-size: cover;
          background-position: center;
          border-radius: 0rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
                      0 4px 6px -2px rgba(0, 0, 0, 0.05);
          min-height: 60px;
          overflow: hidden;
          box-sizing: border-box; /* Includes padding in width */
        }

        .poppins-font {
          font-family: 'Poppins', sans-serif;
          color: #00FF00;
          font-size: 3rem;
          white-space: nowrap; /* Keeps text on a single line */
          text-shadow: 2px 2px 6px #000; /* Fixed syntax */
          margin: 0; /* Remove default h1 margin */
        }

        @media (max-width: 640px) {
          .poppins-font {
            font-size: 1.5rem;
          }
        }
      `}</style>
      <h1 className="poppins-font">
        Test Page
      </h1>
    </div>
  );
};

export default TokenHeader;
