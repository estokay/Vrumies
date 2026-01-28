const LinkField = ({ value, onChange }) => (
  <div>
    <label className="form-label">Website Link</label>
    <input
      type="text"
      name="link"
      value={value}
      onChange={onChange}
      placeholder="e.g. www.mybusiness.com"
    />
  </div>
);

export default LinkField;
