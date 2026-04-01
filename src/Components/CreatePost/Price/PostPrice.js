import React from 'react';
import { NumericFormat } from 'react-number-format';
import './PostPrice.css';

const PostPrice = ({ value, setFormData }) => (
  <div>
    <label className="cppp-form-label">Price</label>

    <NumericFormat
      thousandSeparator={false}
      decimalScale={2}
      fixedDecimalScale={true}
      prefix="$"
      value={value}
      allowNegative={false}
      onValueChange={(values) => {
        setFormData(prev => ({
          ...prev,
          price: values.floatValue ?? 0
        }));
      }}
      placeholder="$0.00"
      className="cppp-dropdown"
    />
  </div>
);

export default PostPrice;