const VehicleInfoField = ({ sellerType, titleStatus, year, make, model, onChange }) => (
  <div>
    <div className="field-group">
        <label className="form-label">Seller Type</label>
        <select
        name="sellerType"
        value={sellerType}
        onChange={onChange}
      >
        <option value="">Select seller type</option>
        <option value="Owner">Owner</option>
        <option value="Dealer">Dealer</option>
      </select>
    </div>

    <div className="field-group">
        <label className="form-label">Title Status</label>
        <select
        name="titleStatus"
        value={titleStatus}
        onChange={onChange}
      >
        <option value="">Select title status</option>
        <option value="clean">Clean</option>
        <option value="salvage">Salvage</option>
        <option value="rebuilt">Rebuilt</option>
        <option value="parts only">Parts Only</option>
        <option value="lien">Lien</option>
        <option value="missing">Missing</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div className="field-group">
        <label className="form-label">Vehicle Year</label>
        <input
            type="number"
            name="year"
            value={year}
            onChange={onChange}
            placeholder="Enter vehicle year"
            min="1900"  // earliest reasonable vehicle year
            max={new Date().getFullYear() + 1} // allow current year + next year
            required
        />
    </div>

    <div className="field-group">
        <label className="form-label">Vehicle Make</label>
        <input
        type="text"
        name="make"
        value={make}
        onChange={onChange}
        placeholder="Enter vehicle make"
        />
    </div>

    <div className="field-group">
        <label className="form-label">Vehicle Model</label>
        <input
        type="text"
        name="model"
        value={model}
        onChange={onChange}
        placeholder="Enter vehicle model"
        />
    </div>
  </div>
);

export default VehicleInfoField;
