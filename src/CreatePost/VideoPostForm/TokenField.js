const TokenField = ({ value, onChange }) => (
  <div>
    <label className="form-label">Token Amount</label>
    <input
      type="number"
      name="tokens"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default TokenField;
