import React from 'react';

const ForumHeader = () => {
  return (
    <div className="tokens-header-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

        .app-container {
          min-height: 100vh;
          background-color: #191b22ff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .tokens-header-wrapper {
          width: 100%;
          max-width: flex;
          margin-left: auto;
          margin-right: auto;
          padding: 2rem 3rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          background-image: url('https://www.mauth.cc/wp-content/uploads/2024/01/Depositphotos_91312248_L.jpg');
          background-size: cover;       /* Makes image fill container */
        background-position: center;  /* Centers the image */
          border-radius: 0rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          height: 60px;
          overflow: hidden;
        }

        .poppins-font {
          font-family: 'Poppins', sans-serif;
          color: #00FF00;
          font-size: 3rem;
          white-space: nowrap;
          text-shadow:
            -1px -1px 0 #000,  
            1px -1px 0 #000,
            -1px  1px 0 #000,
            1px  1px 0 #000;
        }

        @media (max-width: 640px) {
          .poppins-font {
            font-size: 1.5rem;
          }
        }
      `}</style>
      <h1 className="poppins-font">
        Forum Post
      </h1>
    </div>
  );
};

export default ForumHeader;
