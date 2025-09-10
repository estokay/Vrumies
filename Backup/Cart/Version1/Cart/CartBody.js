import React from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';
import './CartBody.css';

const cartItems = [
  {
    id: 1,
    seller: 'Gryan Dumimson',
    reviews: 54,
    product: 'Hammaka Hitch Stand Combo',
    price: 375.99,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSFYpV7_lRsHEp7yJlHJr32bcbunV4o-0Ue1xsfgmNhxcveNLeYJSnEdohsvp-mQyJXqlZMmwI9FwpY6w2YNpvLmuHhcT67'
  },
  {
    id: 2,
    seller: 'Gryan Dumimson',
    reviews: 54,
    product: 'OBD Check Engine Code Scanner',
    price: 12.99,
    image: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1676579426-motopower-1676579394.jpg?crop=0.669xw:1.00xh;0.233xw,0&resize=980:*'
  },
  {
    id: 3,
    seller: 'Gryan Dumimson',
    reviews: 54,
    product: 'AC 120V Vehicle Converter',
    price: 9.99,
    image: 'https://i5.walmartimages.com/seo/LVYUAN-3000-Watts-Pure-Sine-Wave-Power-Inverter-DC-12V-to-AC-110V-120V-Converter-4USB-4AC-LCD-Remote-Control_85ea5ffb-9b49-48f1-9303-379c7fcaee9b.04c46a44d50b99ce550464d7d345e14c.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF'
  }
];

export default function CartBody() {
  return (
    <div className="cart-body">
      <h3 className="cart-title">CART ITEMS:</h3>
      {cartItems.map(item => (
        <div className="cart-item" key={item.id}>
          <div className="cart-remove">
            <FaTimes />
          </div>
          <div className="cart-top">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt={item.seller}
              className="seller-avatar"
            />
            <div className="seller-info">
              <span className="seller-name">{item.seller}</span>
              <span className="seller-market">Market</span>
              <div className="stars">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar key={i} color="#f6c61d" />
                  ))}
                <span className="review-count">{item.reviews} Reviews</span>
              </div>
            </div>
          </div>
          <div className="cart-content">
            <img src={item.image} alt={item.product} className="product-image" />
            <div className="product-info">
              <span className="product-name">{item.product}</span>
              <span className="product-price">${item.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
