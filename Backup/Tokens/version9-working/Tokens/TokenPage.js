import '../../App.css';
import TokenHeader from './TokenHeader';
import TokenSidePanel from './TokenSidePanel';
import TokenBody from './TokenBody';
import TokenHistory from './TokenHistory';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51JN8mDDR30hjV6c2f6WkKbqaLIJ91qsbyfK9Ho1Ge3hCwL2b3aZnWim7Ew9RhfprRoiInPWDRsXC8gqcdW6v4ST700vBUAakpE");

const TokenPage = () => {
  return (
    <div className="content-page">
      
      <TokenHeader />
      <div className="main-content-area">
        <TokenSidePanel />
        <Elements stripe={stripePromise}>
          <TokenBody />
        </Elements>
        <TokenHistory />
      </div>
    </div>
  );
};

export default TokenPage;
