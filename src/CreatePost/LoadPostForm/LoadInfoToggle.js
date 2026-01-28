import React from 'react';

const LoadInfoToggle = ({ formData, handleChange }) => {
  return (
    <div className="load-details-container">
      <label className="form-label">Truck Type</label>
      <select name="truckType" value={formData.truckType} onChange={handleChange}>
        <option value="">Select truck type</option>
        <option value="Refrigerated Semi-Truck (Reefer)">Refrigerated Semi-Truck (Reefer)</option>
        <option value="Hot Shot">Hot Shot</option>
        <option value="Box Truck">Box Truck</option>
        <option value="Flat Bed">Flat Bed</option>
        <option value="Regular Semi Truck (Dry Van)">Regular Semi Truck (Dry Van)</option>
        <option value="Power Only">Power Only</option>
        <option value="Car Carrier Trailer">Car Carrier Trailer</option>
        <option value="Other">Other</option>
      </select>

      <label className="form-label">Load Weight (Pounds)</label>
      <input 
        type="number" 
        name="loadWeight" 
        value={formData.loadWeight} 
        onChange={handleChange}
        placeholder="e.g. 42000"
      />

      <label className="form-label">Load Length (ft)</label>
      <input 
        type="number" 
        name="loadLength" 
        value={formData.loadLength} 
        onChange={handleChange}
        placeholder="e.g. 53"
      />

      <label className="form-label">Payout ($)</label>
      <input 
        type="number" 
        name="payout" 
        value={formData.payout} 
        onChange={handleChange} 
        step="0.01"
        placeholder="e.g. 3100"
      />
    </div>
  );
};

export default LoadInfoToggle;
