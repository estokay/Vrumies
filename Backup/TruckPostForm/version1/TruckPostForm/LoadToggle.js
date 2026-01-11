import React from 'react';
import { NumericFormat } from 'react-number-format';

const LoadToggle = ({ activeField, formData, handleChange, setFormData }) => {
  if (activeField !== 'load') return null;

  return (
    <div className="load-details-container">
      <label className="form-label">Truck Type</label>
      <select name="truckType" value={formData.truckType} onChange={handleChange} required>
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

      <label className="form-label">Load Weight Max Limit (Ibs)</label>
      <input
        type="number"
        name="loadWeightMax"
        value={formData.loadWeightMax}
        onChange={handleChange}
        placeholder="e.g. 42000"
      />

      <label className="form-label">Load Length Max Limit (ft)</label>
      <input
        type="number"
        name="loadLengthMax"
        value={formData.loadLengthMax}
        onChange={handleChange}
        placeholder="e.g. 53"
      />

      <label className="form-label">Minimum Per Mile Rate</label>
      <div className="truck-price-wrapper">
        <span className="price-symbol">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          name="minPerMile"
          value={formData.minPerMile}
          onChange={(e) =>
            setFormData(prev => ({ ...prev, minPerMile: Number(e.target.value) }))
          }
        />
      </div>

      <label className="form-label">DOT# (Optional)</label>
      <input
        type="text"
        name="dotNumber"
        value={formData.dotNumber}
        onChange={handleChange}
        placeholder="Enter DOT Number"
      />
    </div>
  );
};

export default LoadToggle;
