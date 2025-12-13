const TokenHistory = () => {
  const purchaseHistory = [
    { id: 1, name: "Purchase #1", date: "03/22/2021", tokens: 4, amount: "$1" },
    { id: 2, name: "Purchase #2", date: "05/03/2021", tokens: 20, amount: "$5" },
    { id: 3, name: "Purchase #3", date: "08/20/2021", tokens: 40, amount: "$10" },
    { id: 4, name: "Purchase #4", date: "08/20/2021", tokens: 40, amount: "$10" }, 
  ];

  return (
    <div className="token-history-panel">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

        .token-history-panel {
          background-color: #000;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 300px;
          min-width: 250px;
          flex-shrink: 0;
          border-left: 1px solid #1a202c; 
          box-sizing: border-box;
          color: #fff;
          overflow-y: auto; 
        }

        .token-history-panel h2 {
          font-family: 'Poppins', sans-serif;
          color: #fff;
          font-size: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: bold;
        }

        .token-history-panel .history-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 1rem 0;
          border-bottom: 1px solid #333; 
        }

        .token-history-panel .history-item:last-child {
          border-bottom: none; 
        }

        .token-history-panel .item-icon {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          margin-right: 1rem;
        }

        .token-history-panel .item-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .token-history-panel .item-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .token-history-panel .item-details p {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          font-size: 0.95rem;
          color: #fff;
        }

        .token-history-panel .item-details .item-date {
          color: #888;
          font-size: 0.8rem;
        }

        .token-history-panel .item-values {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          font-family: 'Poppins', sans-serif;
        }

        .token-history-panel .item-values .item-tokens {
          color: #00FF00;
          font-weight: bold;
          font-size: 0.95rem;
        }

        .token-history-panel .item-values .item-amount {
          color: #fff;
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .token-history-panel {
            width: 100%;
            max-width: none;
            border-left: none;
            border-top: 1px solid #1a202c; 
          }
        }
      `}</style>
      <h2>Token Purchase History</h2>
      {purchaseHistory.map(item => (
        <div key={item.id} className="history-item">
          <div className="item-icon">
            <img 
              src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1756806527/Tokens-Icon_bhee9s.png" 
              alt="Tokens Icon" 
            />
          </div>
          <div className="item-details">
            <p>{item.name}</p>
            <p className="item-date">{item.date}</p>
          </div>
          <div className="item-values">
            <span className="item-tokens">{item.tokens} VBT</span>
            <span className="item-amount">{item.amount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenHistory;
