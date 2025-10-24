import '../../App.css';
import TokenHeader from './TokenHeader';
import TokenSidePanel from './TokenSidePanel';
import TokenBody from './TokenBody';
import TokenHistory from './TokenHistory';

const TokenPage = () => {
  return (
    <div className="content-page">
      
      <TokenHeader />
      <div className="main-content-area">
        <TokenSidePanel />
        <TokenBody />
        <TokenHistory />
      </div>
    </div>
  );
};

export default TokenPage;
