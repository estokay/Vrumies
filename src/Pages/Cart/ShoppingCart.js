import NavbarWithPost from '../../Components/NavbarWithPost';
import ShoppingCartHeader from './ShoppingCartHeader';
import '../../App.css';
import './ShoppingCart.css';
import CartBody from './CartBody';
import CartSidePanel from './CartSidePanel';

const ShoppingCart = () => {
  return (
    <div className="content-page">
      <NavbarWithPost />
      <ShoppingCartHeader />
      <div className="shopping-cart">
        <div className="cart-body-container">
          <CartBody />
        </div>
        <div className="cart-side-container">
          <CartSidePanel />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;