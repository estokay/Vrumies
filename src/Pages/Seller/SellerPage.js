import NavbarWithPost from '../../Components/NavbarWithPost';
import SellerPageHeader from './SellerPageHeader';
import '../../App.css';
import SellerSidePanel from './SellerSidePanel';
import SellerBody from './SellerBody';
import PaymentMethodsOverlay from './PaymentMethodsOverlay';

const SellerPage = () => {
  return (
    <div className="content-page">
      <SellerPageHeader />
      <SellerBody />
    </div>
  );
};

export default SellerPage;