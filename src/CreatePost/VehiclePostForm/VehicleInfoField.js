const VehicleInfoField = ({ sellerType, titleStatus, year, make, model, odometer, transmission, fuel, cylinders, drive, trim, onChange }) => (
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

    <div className="field-group">
      <label className="form-label">Trim</label>
      <input
        type="text"
        name="trim"
        value={trim}
        onChange={onChange}
        placeholder="Enter vehicle trim (e.g. Sport, LX, SE)"
      />
    </div>

    <div className="field-group">
      <label className="form-label">Transmission</label>
      <select
        name="transmission"
        value={transmission}
        onChange={onChange}
      >
        <option value="">Select transmission</option>
        <option value="Automatic">Automatic</option>
        <option value="Manual">Manual</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div className="field-group">
      <label className="form-label">Drive</label>
      <select
        name="drive"
        value={drive}
        onChange={onChange}
      >
        <option value="">Select drive type</option>
        <option value="FWD">FWD</option>
        <option value="RWD">RWD</option>
        <option value="4WD">4WD</option>
      </select>
    </div>

    <div className="field-group">
      <label className="form-label">Cylinders</label>
      <input
        type="number"
        name="cylinders"
        value={cylinders}
        onChange={onChange}
        placeholder="Enter number of cylinders"
        min="1"
      />
    </div>

    <div className="field-group">
      <label className="form-label">Fuel</label>
      <select
        name="fuel"
        value={fuel}
        onChange={onChange}
      >
        <option value="">Select fuel type</option>
        <option value="Gas">Gas</option>
        <option value="Diesel">Diesel</option>
        <option value="Hybrid">Hybrid</option>
        <option value="Electric">Electric</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div className="field-group">
      <label className="form-label">Odometer</label>
      <input
        type="number"
        name="odometer"
        value={odometer}
        onChange={onChange}
        placeholder="Enter mileage"
        min="0"
      />
    </div>

    

  </div>
);

export default VehicleInfoField;
