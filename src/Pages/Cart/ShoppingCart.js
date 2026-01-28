import NavbarWithPost from '../../Components/NavbarWithPost';
import ShoppingCartHeader from './ShoppingCartHeader';
import '../../App.css';
import './ShoppingCart.css';
import CartBody from './CartBody';
import CheckoutForm from './CheckoutForm';

const ShoppingCart = () => {
  return (
    <div className="content-page">
      
      <ShoppingCartHeader />
      <div className="shopping-cart">
        <div className="cart-body-container">
          <CartBody />
        </div>
        <div className="cart-side-container">
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;