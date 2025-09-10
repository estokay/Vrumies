import NavbarWithPost from '../../Components/NavbarWithPost';
import OrdersPageHeader from './OrdersPageHeader';
import '../../App.css';
import OrdersSidePanel from './OrdersSidePanel';
import OrdersBody from './OrdersBody';



const OrdersPage = () => {
  return (
    <div className="content-page">
      
      <OrdersPageHeader />
      {/*<OrdersSidePanel />*/}
      <OrdersBody />
    </div>
  );
};

export default OrdersPage;