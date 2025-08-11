const TokenBody = () => {
  return (
    <div className="token-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

        .token-body {
          flex-grow: 1; /* Allow it to take up remaining space */
          background-color: #1a202c; /* Dark background */
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          color: #fff;
        }

        .token-body .order-section {
          background-color: #000;
          padding: 1.5rem;
          border-radius: 0.5rem;
          width: 100%;
          max-width: 500px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .token-body .order-header {
          font-family: 'Poppins', sans-serif;
          color: #00FF00;
          font-size: 1.8rem;
          margin-bottom: 1rem;
          text-align: left;
        }

        .token-body .quantity-selector {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .token-body .quantity-selector label {
          font-family: 'Poppins', sans-serif;
          color: #fff;
          font-size: 1.2rem;
        }

        .token-body .quantity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .token-body .quantity-button {
          background-color: #00FF00;
          color: #000;
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: bold;
        }

        .token-body .quantity-display {
          font-family: 'Poppins', sans-serif;
          color: #00FF00;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .token-body .total-section {
          background-color: #333;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .token-body .total-section span {
          font-family: 'Poppins', sans-serif;
          font-size: 1.2rem;
          color: #fff;
        }

        .token-body .card-info-section {
          background-color: #000;
          padding: 1.5rem;
          border-radius: 0.5rem;
          width: 100%;
          max-width: 500px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .token-body .card-info-header {
          font-family: 'Poppins', sans-serif;
          color: #00FF00;
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .token-body .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .token-body .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .token-body label {
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          color: #888;
          margin-bottom: 0.3rem;
        }

        .token-body input {
          background-color: transparent;
          border: none;
          border-bottom: 1px solid #555;
          color: #fff;
          padding: 0.5rem 0;
          font-size: 1rem;
          font-family: 'Poppins', sans-serif;
          outline: none;
        }

        .token-body input::placeholder {
          color: #777;
        }

        .token-body .bank-icon {
          font-size: 4rem;
          color: #00FF00;
          margin-bottom: 2rem;
        }

        .token-body .action-buttons {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 500px;
          gap: 1rem;
        }

        .token-body .action-buttons button {
          font-family: 'Poppins', sans-serif;
          padding: 0.8rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          flex: 1;
          font-weight: bold;
        }

        .token-body .back-button {
          background-color: transparent;
          color: #00FF00;
          border: 1px solid #00FF00;
        }

        .token-body .back-button:hover {
          background-color: rgba(0, 255, 0, 0.1);
        }

        .token-body .pay-button {
          background-color: #00FF00;
          color: #000;
          border: none;
        }

        .token-body .pay-button:hover {
          background-color: #00CC00;
        }

        /* Overall App Container Styling */
        .app-container {
          min-height: 100vh;
          background-color: #1a202c;
          display: flex;
          flex-direction: column; /* Stack header on top */
          align-items: center;
          padding: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .main-content-area {
          display: flex;
          flex-grow: 1; /* Takes remaining vertical space */
          width: 100%;
          box-sizing: border-box;
          justify-content: center; /* Center content when side panel is smaller */
        }

        @media (max-width: 768px) {
          .main-content-area {
            flex-direction: column; /* Stack side panel and body vertically on smaller screens */
          }
        }
      `}</style>
      <div className="order-section">
        <h3 className="order-header">Basic Order</h3>
        <div className="quantity-selector">
          <label>Select Quantity</label>
          <div className="quantity-controls">
            <button className="quantity-button">-</button>
            <span className="quantity-display">40</span>
            <button className="quantity-button">+</button>
            <span className="quantity-display">VBT</span>
          </div>
        </div>
        <div className="total-section">
          <span>Total</span>
          <span>$10</span>
        </div>
      </div>

      <div className="card-info-section">
        <h3 className="card-info-header">Card Info</h3>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" value="John" readOnly />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" value="Smith" readOnly />
          </div>
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <input type="text" value="4756 5648 8496 9018" readOnly />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Expiration Date</label>
            <input type="text" value="07 / 22" readOnly />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input type="text" value="319" readOnly />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input type="text" value="78505" readOnly />
          </div>
        </div>
      </div>
      <div className="bank-icon">🏦</div>
      <div className="action-buttons">
        <button className="back-button">Back</button>
        <button className="pay-button">Pay</button>
      </div>
    </div>
  );
};

export default TokenBody;
