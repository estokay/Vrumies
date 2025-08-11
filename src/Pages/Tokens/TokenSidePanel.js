const TokenSidePanel = () => {
  return (
    <div className="token-side-panel">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

        .token-side-panel {
          background-color: #000;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 300px;
          min-width: 250px;
          flex-shrink: 0;
          border-right: 1px solid #1a202c;
          box-sizing: border-box;
          text-align: center;
          color: #fff;
        }

        .token-side-panel .logo-circle {
          width: 80px;
          height: 80px;
          background-color: #FFC107;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          position: relative;
          box-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
        }

        .token-side-panel .logo-star {
          color: #000;
          font-size: 3rem;
          line-height: 1;
        }

        .token-side-panel h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .token-side-panel p {
          font-family: 'Poppins', sans-serif;
          font-size: 1.2rem;
          color: #00FF00;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .token-side-panel .conversion-rate {
          font-size: 0.9rem;
          color: #888;
          margin-bottom: 2rem;
        }

        .token-side-panel button {
          font-family: 'Poppins', sans-serif;
          background-color: #00FF00;
          color: #000;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          width: 90%;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .token-side-panel button:hover {
          background-color: #00CC00;
        }

        .token-side-panel .secondary-button {
          background-color: transparent;
          color: #00FF00;
          border: 1px solid #00FF00;
        }

        .token-side-panel .secondary-button:hover {
          background-color: rgba(0, 255, 0, 0.1);
        }

        @media (max-width: 768px) {
          .token-side-panel {
            width: 100%;
            max-width: none;
            border-right: none;
            border-bottom: 1px solid #1a202c;
          }
        }
      `}</style>
      <div className="logo-circle">
        <span className="logo-star">★</span>
      </div>
      <h2>Vrumies Bump Tokens</h2>
      <p>You have:</p>
      <p>100 VBT</p>
      <span className="conversion-rate">1 VBT = $0.25</span>
    </div>
  );
};

export default TokenSidePanel;