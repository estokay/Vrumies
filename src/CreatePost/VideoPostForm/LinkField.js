const LinkField = ({ value, onChange }) => (
  <div>
    <label className="form-label">Website Link</label>
    <input type="text" name="link" value={value} placeholder="e.g. www.mybusiness.com" onChange={onChange} />
  </div>
);

export default LinkField;
