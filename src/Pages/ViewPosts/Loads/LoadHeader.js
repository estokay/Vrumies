import React from 'react';

const LoadHeader = () => {
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
  width: 100%;                  /* full width */
  max-width: 100%;              /* never exceed parent/container */
  margin: 0;                     /* no extra margins */
  padding: 0;                    /* remove extra horizontal padding */
  display: flex;
  align-items: center;
  justify-content: flex-start;
          background-image: url('https://images.squarespace-cdn.com/content/v1/6598c8e83ff0af0197ff19f9/a05c7d5e-3711-48bb-a4c8-f3ce0f076355/JCCI-2024-Banner.jpg');
  background-size: cover;
  background-position: center;
  height: 120px;                /* adjust to match navbar/logo */
  box-sizing: border-box;       /* include padding in width */
  overflow: hidden;             /* prevent horizontal scroll */
}

        .poppins-font {
          font-family: 'Poppins', sans-serif;
          color: #00FF00;
          font-size: 3rem;
          margin-left: 50px;
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
        Load Post
      </h1>
    </div>
  );
};

export default LoadHeader;
