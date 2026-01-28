const VehicleInfoField = ({ sellerType, titleStatus, year, make, model, onChange }) => (
  <div>
    <label className="form-label">Seller Type</label>
    <input
      type="text"
      name="sellertype"
      value={sellerType}
      onChange={onChange}
      placeholder="Enter seller type"
    />

    <label className="form-label">Title Status</label>
    <input
      type="text"
      name="titleStatus"
      value={titleStatus}
      onChange={onChange}
      placeholder="Enter title status"
    />

    <label className="form-label">Year</label>
    <input
      type="number"
      name="year"
      value={year}
      onChange={onChange}
      placeholder="Enter vehicle year"
    />

    <label className="form-label">Make</label>
    <input
      type="text"
      name="make"
      value={make}
      onChange={onChange}
      placeholder="Enter vehicle make"
    />
    
    <label className="form-label">Model</label>
    <input
      type="text"
      name="model"
      value={model}
      onChange={onChange}
      placeholder="Enter vehicle model"
    />
  </div>
);

export default VehicleInfoField;
