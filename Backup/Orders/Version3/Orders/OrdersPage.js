import OrdersPageHeader from './OrdersPageHeader';
import '../../App.css';
import OrdersBody from './OrdersBody';

const OrdersPage = () => {
  return (
    <div className="content-page">
      <OrdersPageHeader />
      <OrdersBody />
    </div>
  );
};

export default OrdersPage;