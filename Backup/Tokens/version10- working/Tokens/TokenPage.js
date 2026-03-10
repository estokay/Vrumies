import '../../App.css';
import TokenHeader from './TokenHeader';
import TokenSidePanel from './TokenSidePanel';
import TokenBody from './TokenBody';
import TokenHistory from './TokenHistory';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { STRIPE_API_KEY } from '../../Components/config';

const stripePromise = loadStripe(STRIPE_API_KEY);

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
