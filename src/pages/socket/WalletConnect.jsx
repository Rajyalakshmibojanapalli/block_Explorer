// src/components/WalletConnect.jsx
import { useState, useEffect } from 'react';
import { Wallet, LogOut, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const WalletConnect = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Chain configuration for Jaimax
  const chainConfig = {
    chainId: "jaimax-0", // Replace with your actual chain ID
    chainName: "JMC-24 Smart Chain",
    // rpc: "https://192.168.0.97:26757",
    // rest: "https://192.168.0.97:1417",
    rpc: import.meta.env.VITE_RPC_URL || "http://192.168.0.97:1417", // ✅ Use HTTP for local
    rest: import.meta.env.VITE_REST_URL || "http://192.168.0.97:1417", // ✅ Use HTTP for local
   
    bip44: {
      coinType: 118, // Standard Cosmos coin type
    },
    bech32Config: {
      bech32PrefixAccAddr: "jaimax",
      bech32PrefixAccPub: "jaimaxpub",
      bech32PrefixValAddr: "jaimaxvaloper",
      bech32PrefixValPub: "jaimaxvaloperpub",
      bech32PrefixConsAddr: "jaimaxvalcons",
      bech32PrefixConsPub: "jaimaxvalconspub",
    },
    currencies: [
      {
        coinDenom: "JMC",
        coinMinimalDenom: "uJMC",
        coinDecimals: 6,
        coinGeckoId: "jaimax", // Optional
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "JMC",
        coinMinimalDenom: "uJMC",
        coinDecimals: 6,
        coinGeckoId: "jaimax",
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: "JMC",
      coinMinimalDenom: "uJMC",
      coinDecimals: 6,
      coinGeckoId: "jaimax",
    },
  };

  // Check if Keplr is installed
  const isKeplrInstalled = () => {
    return typeof window.keplr !== 'undefined';
  };

  // Suggest chain to Keplr
  const suggestChain = async () => {
    try {
      await window.keplr.experimentalSuggestChain(chainConfig);
      console.log('✅ Chain suggested successfully');
    } catch (error) {
      console.error('❌ Failed to suggest chain:', error);
      throw error;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!isKeplrInstalled()) {
      window.open('https://www.keplr.app/download', '_blank');
      alert('Please install Keplr wallet extension!');
      return;
    }

    setIsConnecting(true);

    try {
      // Suggest chain (will show popup if not already added)
      await suggestChain();

      // Enable the chain
      await window.keplr.enable(chainConfig.chainId);

      // Get the offline signer
      const offlineSigner = window.keplr.getOfflineSigner(chainConfig.chainId);
      
      // Get accounts
      const accounts = await offlineSigner.getAccounts();
      
      if (accounts.length > 0) {
        const address = accounts[0].address;
        setWalletAddress(address);
        setIsWalletConnected(true);
        
        // Store in localStorage
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('isWalletConnected', 'true');
        
        console.log('✅ Wallet connected:', address);
        
        // Fetch balance
        await fetchBalance(address);
      }
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Fetch wallet balance
  const fetchBalance = async (address) => {
    try {
      const response = await fetch(
        `${chainConfig.rest}/cosmos/bank/v1beta1/balances/${address}`
      );
      const data = await response.json();
      
      const jmcBalance = data.balances.find(
        (coin) => coin.denom === 'uJMC'
      );
      
      if (jmcBalance) {
        // Convert from uJMC to JMC (divide by 1,000,000)
        const balanceInJMC = (parseInt(jmcBalance.amount) / 1_000_000).toFixed(2);
        setBalance(balanceInJMC);
      } else {
        setBalance('0');
      }
    } catch (error) {
      console.error('❌ Failed to fetch balance:', error);
      setBalance('0');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress('');
    setIsWalletConnected(false);
    setBalance('0');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('isWalletConnected');
    console.log('👋 Wallet disconnected');
  };

  // Copy address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Truncate address
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 10)}...${address.slice(-6)}`;
  };

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    const savedConnected = localStorage.getItem('isWalletConnected');
    
    if (savedAddress && savedConnected === 'true' && isKeplrInstalled()) {
      connectWallet();
    }
  }, []);

  // Listen for Keplr account changes
  useEffect(() => {
    if (isKeplrInstalled() && isWalletConnected) {
      window.addEventListener('keplr_keystorechange', () => {
        console.log('🔄 Keplr account changed');
        connectWallet();
      });

      return () => {
        window.removeEventListener('keplr_keystorechange', connectWallet);
      };
    }
  }, [isWalletConnected]);

  return (
    <div>
      {!isWalletConnected ? (
        // Connect Button
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200
            ${isDark
              ? 'bg-[#00b2bd] text-white hover:bg-[#009da7]'
              : 'bg-[#00b2bd] text-white hover:bg-[#009da7]'
            }
            ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
            shadow-sm hover:shadow-md
          `}
        >
          <Wallet className="w-4 h-4" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        // Connected Wallet Display
        <div className={`
          flex items-center gap-3 px-4 py-2 rounded-lg
          ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
        `}>
          {/* Balance */}
          <div className="flex flex-col">
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Balance
            </span>
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {balance} JMC
            </span>
          </div>

          {/* Divider */}
          <div className={`h-8 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

          {/* Address */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Address
              </span>
              <span className={`text-sm font-mono font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {truncateAddress(walletAddress)}
              </span>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyAddress}
              className={`p-1.5 rounded transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Copy address"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              )}
            </button>

            {/* View in Explorer */}
            <a
              href={`/address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1.5 rounded transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="View in explorer"
            >
              <ExternalLink className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </a>

            {/* Disconnect Button */}
            <button
              onClick={disconnectWallet}
              className={`p-1.5 rounded transition-colors ${
                isDark ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'
              }`}
              title="Disconnect wallet"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;