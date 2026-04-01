import '../../App.css';
import TokenHeader from './TokenHeader';
import TokenSidePanel from './TokenSidePanel';
import TokenBody from './TokenBody';
import TokenHistory from './TokenHistory';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import usePaymentModes from "../../Hooks/usePaymentModes";
import { STRIPE_PUBLIC_KEYS } from '../../Components/config';
import { useMemo } from 'react';

const TokenPage = () => {
  const { stripeMode, loading: modeLoading, error: modeError } = usePaymentModes();

  const stripePromise = useMemo(() => {
    if (!stripeMode) return null;
    const key = STRIPE_PUBLIC_KEYS[stripeMode];
    return key ? loadStripe(key) : null;
  }, [stripeMode]);

  if (modeLoading) return <div>Loading payment config...</div>;
  if (modeError) return <div>Error loading payment config</div>;
  if (!stripePromise) return <div>Stripe not configured</div>;

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
