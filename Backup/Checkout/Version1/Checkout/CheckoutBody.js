<div className="cb-checkout-body">
  <h3 className="cb-checkout-title">Checkout</h3>

  <form className="cb-checkout-form" onSubmit={handleSubmit}>
    {/* Shipping Info */}
    <div className="cb-section">
      <h4 className="cb-section-title">Delivery Information</h4>
      <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
      <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} required />
      <div className="cb-two-col">
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
      </div>
      <input type="text" name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleChange} required />
    </div>

    {/* Billing Info */}
    <div className="cb-section">
      <h4 className="cb-section-title">Billing Information</h4>
      <label>
        <input
          type="checkbox"
          checked={formData.useShippingAsBilling}
          onChange={(e) => setFormData((prev) => ({ ...prev, useShippingAsBilling: e.target.checked }))}
        />{" "}
        Use shipping info as billing info
      </label>

      {!formData.useShippingAsBilling && (
        <div className="cb-billing-fields">
          <input type="text" name="billingFullName" placeholder="Billing Full Name" value={formData.billingFullName} onChange={handleChange} />
          <input type="text" name="billingAddress" placeholder="Billing Street Address" value={formData.billingAddress} onChange={handleChange} />
          <div className="cb-two-col">
            <input type="text" name="billingCity" placeholder="Billing City" value={formData.billingCity} onChange={handleChange} />
            <input type="text" name="billingState" placeholder="Billing State" value={formData.billingState} onChange={handleChange} />
          </div>
          <input type="text" name="billingZip" placeholder="Billing ZIP" value={formData.billingZip} onChange={handleChange} />
        </div>
      )}
    </div>

    {/* Payment Info */}
    <div className="cb-section">
      <h4 className="cb-section-title">Payment Information</h4>
      <div className="cb-card-element">
        <CardElement options={{ style: cardStyle }} />
      </div>
    </div>

    {/* Order Summary */}
    <div className="cb-section cb-order-summary">
      <div className="cb-row">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="cb-row">
        <span>Taxes & Fees:</span>
        <span>${taxes.toFixed(2)}</span>
      </div>
      <hr />
      <div className="cb-row cb-total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>

    <button type="submit" className="cb-submit-btn" disabled={!stripe}>
      Pay Now
    </button>
  </form>

  {message && (
    <p style={{ marginTop: "15px", color: message.startsWith("Error") ? "#ff6b6b" : "#00FF00" }}>
      {message}
    </p>
  )}
</div>
