const TokenField = ({ value, onChange }) => (
  <div>
    <label className="form-label">Token Amount</label>
    <input
      type="number"
      name="tokens"
      value={value}
      onChange={onChange}
      placeholder="Enter token amount"
    />
  </div>
);

export default TokenField;
