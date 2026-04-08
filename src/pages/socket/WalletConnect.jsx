// // src/components/WalletConnect.jsx
// import { useState, useEffect } from 'react';
// import { Wallet, LogOut, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
// import { useTheme } from '../../context/ThemeContext';

// const WalletConnect = () => {
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';
  
//   const [walletAddress, setWalletAddress] = useState('');
//   const [isWalletConnected, setIsWalletConnected] = useState(false);
//   const [balance, setBalance] = useState('0');
//   const [copied, setCopied] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);

//   // Chain configuration for Jaimax
//   const chainConfig = {
//     chainId: "jaimax-0", 
//     chainName: "JMC-24 Smart Chain",
//     rpc: import.meta.env.VITE_RPC_URL || "http://192.168.0.97:1417", 
//     rest: import.meta.env.VITE_REST_URL || "http://192.168.0.97:1417",
   
//     bip44: {
//       coinType: 118, 
//     },
//     bech32Config: {
//       bech32PrefixAccAddr: "jaimax",
//       bech32PrefixAccPub: "jaimaxpub",
//       bech32PrefixValAddr: "jaimaxvaloper",
//       bech32PrefixValPub: "jaimaxvaloperpub",
//       bech32PrefixConsAddr: "jaimaxvalcons",
//       bech32PrefixConsPub: "jaimaxvalconspub",
//     },
//     currencies: [
//       {
//         coinDenom: "JMC",
//         coinMinimalDenom: "uJMC",
//         coinDecimals: 6,
//         coinGeckoId: "jaimax", // Optional
//       },
//     ],
//     feeCurrencies: [
//       {
//         coinDenom: "JMC",
//         coinMinimalDenom: "uJMC",
//         coinDecimals: 6,
//         coinGeckoId: "jaimax",
//         gasPriceStep: {
//           low: 0.01,
//           average: 0.025,
//           high: 0.04,
//         },
//       },
//     ],
//     stakeCurrency: {
//       coinDenom: "JMC",
//       coinMinimalDenom: "uJMC",
//       coinDecimals: 6,
//       coinGeckoId: "jaimax",
//     },
//   };

//   // Check if Keplr is installed
//   const isKeplrInstalled = () => {
//     return typeof window.keplr !== 'undefined';
//   };

//   // Suggest chain to Keplr
//   const suggestChain = async () => {
//     try {
//       await window.keplr.experimentalSuggestChain(chainConfig);
//       console.log('✅ Chain suggested successfully');
//     } catch (error) {
//       console.error('❌ Failed to suggest chain:', error);
//       throw error;
//     }
//   };

//   // Connect wallet
//   const connectWallet = async () => {
//     if (!isKeplrInstalled()) {
//       window.open('https://www.keplr.app/download', '_blank');
//       // alert('Please install Keplr wallet extension!');
//       return;
//     }

//     setIsConnecting(true);

//     try {
//       // Suggest chain (will show popup if not already added)
//       await suggestChain();

//       // Enable the chain
//       await window.keplr.enable(chainConfig.chainId);

//       // Get the offline signer
//       const offlineSigner = window.keplr.getOfflineSigner(chainConfig.chainId);
      
//       // Get accounts
//       const accounts = await offlineSigner.getAccounts();
      
//       if (accounts.length > 0) {
//         const address = accounts[0].address;
//         setWalletAddress(address);
//         setIsWalletConnected(true);
        
//         // Store in localStorage
//         localStorage.setItem('walletAddress', address);
//         localStorage.setItem('isWalletConnected', 'true');
        
//         console.log('✅ Wallet connected:', address);
        
//         // Fetch balance
//         await fetchBalance(address);
//       }
//     } catch (error) {
//       console.error('❌ Failed to connect wallet:', error);
//       alert('Failed to connect wallet. Please try again.');
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   // Fetch wallet balance
//   const fetchBalance = async (address) => {
//     try {
//       const response = await fetch(
//         `${chainConfig.rest}/cosmos/bank/v1beta1/balances/${address}`
//       );
//       const data = await response.json();
      
//       const jmcBalance = data.balances.find(
//         (coin) => coin.denom === 'uJMC'
//       );
      
//       if (jmcBalance) {
//         // Convert from uJMC to JMC (divide by 1,000,000)
//         const balanceInJMC = (parseInt(jmcBalance.amount) / 1_000_000).toFixed(2);
//         setBalance(balanceInJMC);
//       } else {
//         setBalance('0');
//       }
//     } catch (error) {
//       console.error('❌ Failed to fetch balance:', error);
//       setBalance('0');
//     }
//   };

//   // Disconnect wallet
//   const disconnectWallet = () => {
//     setWalletAddress('');
//     setIsWalletConnected(false);
//     setBalance('0');
//     localStorage.removeItem('walletAddress');
//     localStorage.removeItem('isWalletConnected');
//     console.log('👋 Wallet disconnected');
//   };

//   // Copy address to clipboard
//   const copyAddress = () => {
//     navigator.clipboard.writeText(walletAddress);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   // Truncate address
//   const truncateAddress = (address) => {
//     if (!address) return '';
//     return `${address.slice(0, 10)}...${address.slice(-6)}`;
//   };

//   // Auto-connect on mount if previously connected
//   useEffect(() => {
//     const savedAddress = localStorage.getItem('walletAddress');
//     const savedConnected = localStorage.getItem('isWalletConnected');
    
//     if (savedAddress && savedConnected === 'true' && isKeplrInstalled()) {
//       connectWallet();
//     }
//   }, []);

//   // Listen for Keplr account changes
//   useEffect(() => {
//     if (isKeplrInstalled() && isWalletConnected) {
//       window.addEventListener('keplr_keystorechange', () => {
//         console.log('🔄 Keplr account changed');
//         connectWallet();
//       });

//       return () => {
//         window.removeEventListener('keplr_keystorechange', connectWallet);
//       };
//     }
//   }, [isWalletConnected]);

//   return (
//     // <div>
//     //   {!isWalletConnected ? (
//     //     // Connect Button
//     //     <button
//     //       onClick={connectWallet}
//     //       disabled={isConnecting}
//     //       className={`
//     //         flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
//     //         transition-all duration-200
//     //         ${isDark
//     //           ? 'bg-[#00b2bd] text-white hover:bg-[#009da7]'
//     //           : 'bg-[#00b2bd] text-white hover:bg-[#009da7]'
//     //         }
//     //         ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
//     //         shadow-sm hover:shadow-md
//     //       `}
//     //     >
//     //       <Wallet className="w-4 h-4" />
//     //       {isConnecting ? 'Connecting...' : 'Connect Wallet'}
//     //     </button>
//     //   ) : (
//     //     // Connected Wallet Display
//     //     <div className={`
//     //       flex items-center gap-3 px-4 py-2 rounded-lg
//     //       ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
//     //     `}>
//     //       {/* Balance */}
//     //       <div className="flex flex-col">
//     //         <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//     //           Balance
//     //         </span>
//     //         <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
//     //           {balance} JMC
//     //         </span>
//     //       </div>

//     //       {/* Divider */}
//     //       <div className={`h-8 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

//     //       {/* Address */}
//     //       <div className="flex items-center gap-2">
//     //         <div className="flex flex-col">
//     //           <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//     //             Address
//     //           </span>
//     //           <span className={`text-sm font-mono font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
//     //             {truncateAddress(walletAddress)}
//     //           </span>
//     //         </div>

//     //         {/* Copy Button */}
//     //         <button
//     //           onClick={copyAddress}
//     //           className={`p-1.5 rounded transition-colors ${
//     //             isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
//     //           }`}
//     //           title="Copy address"
//     //         >
//     //           {copied ? (
//     //             <CheckCircle2 className="w-4 h-4 text-green-500" />
//     //           ) : (
//     //             <Copy className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
//     //           )}
//     //         </button>

//     //         {/* View in Explorer */}
//     //         <a
//     //           href={`/address/${walletAddress}`}
//     //           target="_blank"
//     //           rel="noopener noreferrer"
//     //           className={`p-1.5 rounded transition-colors ${
//     //             isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
//     //           }`}
//     //           title="View in explorer"
//     //         >
//     //           <ExternalLink className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
//     //         </a>

//     //         {/* Disconnect Button */}
//     //         <button
//     //           onClick={disconnectWallet}
//     //           className={`p-1.5 rounded transition-colors ${
//     //             isDark ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'
//     //           }`}
//     //           title="Disconnect wallet"
//     //         >
//     //           <LogOut className="w-4 h-4" />
//     //         </button>
//     //       </div>
//     //     </div>
//     //   )}
//     // </div>
//     <div>
//   {!isWalletConnected ? (
//     // Connect Button
//     <button
//       onClick={connectWallet}
//       disabled={isConnecting}
//       className={`
//         group relative overflow-hidden
//         flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm
//         transition-all duration-300 transform hover:scale-105
//         ${isDark
//           ? 'bg-gradient-to-r from-[#00b2bd] to-[#00d4e0] text-white hover:shadow-[0_0_20px_rgba(0,178,189,0.4)]'
//           : 'bg-gradient-to-r from-[#00b2bd] to-[#00d4e0] text-white hover:shadow-[0_8px_30px_rgba(0,178,189,0.3)]'
//         }
//         ${isConnecting ? 'opacity-70 cursor-not-allowed scale-100' : ''}
//         shadow-lg
//       `}
//     >
//       <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
//       <Wallet className={`w-4 h-4 ${isConnecting ? 'animate-pulse' : ''}`} />
//       <span className="relative z-10">
//         {isConnecting ? 'Connecting...' : 'Connect Wallet'}
//       </span>
//     </button>
//   ) : (
//     // Connected Wallet Display
//     <div className={`
//       flex items-center gap-4 px-5 py-3 rounded-xl
//       backdrop-blur-sm transition-all duration-300
//       ${isDark 
//         ? 'bg-gray-800/90 border border-gray-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)]' 
//         : 'bg-white/90 border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
//       }
//     `}>
//       {/* Balance Section */}
//       <div className="flex items-center gap-2 pr-4 border-r border-gray-700/30">
//         <div className={`
//           p-2 rounded-lg
//           ${isDark ? 'bg-[#00b2bd]/10' : 'bg-[#00b2bd]/5'}
//         `}>
//           <Wallet className="w-4 h-4 text-[#00b2bd]" />
//         </div>
//         <div className="flex flex-col">
//           <span className={`text-[10px] uppercase tracking-wider font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
//             Balance
//           </span>
//           <span className={`text-sm font-bold bg-gradient-to-r from-[#00b2bd] to-[#00d4e0] bg-clip-text text-transparent`}>
//             {balance} JMC
//           </span>
//         </div>
//       </div>

//       {/* Address Section */}
//       <div className="flex items-center gap-2">
//         <div className="flex flex-col">
//           <span className={`text-[10px] uppercase tracking-wider font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
//             Address
//           </span>
//           <span className={`text-sm font-mono font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
//             {truncateAddress(walletAddress)}
//           </span>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center gap-1 ml-2">
//           {/* Copy Button */}
//           <button
//             onClick={copyAddress}
//             className={`
//               p-2 rounded-lg transition-all duration-200 transform hover:scale-110
//               ${isDark 
//                 ? 'hover:bg-gray-700/50 active:bg-gray-700' 
//                 : 'hover:bg-gray-100/80 active:bg-gray-200'
//               }
//             `}
//             title="Copy address"
//           >
//             {copied ? (
//               <CheckCircle2 className="w-4 h-4 text-green-500" />
//             ) : (
//               <Copy className={`w-4 h-4 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`} />
//             )}
//           </button>

//           {/* View in Explorer */}
//           <a
//             href={`/address/${walletAddress}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className={`
//               p-2 rounded-lg transition-all duration-200 transform hover:scale-110
//               ${isDark 
//                 ? 'hover:bg-gray-700/50 active:bg-gray-700' 
//                 : 'hover:bg-gray-100/80 active:bg-gray-200'
//               }
//             `}
//             title="View in explorer"
//           >
//             <ExternalLink className={`w-4 h-4 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`} />
//           </a>

//           {/* Divider */}
//           <div className={`h-6 w-px mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

//           {/* Disconnect Button */}
//           <button
//             onClick={disconnectWallet}
//             className={`
//               p-2 rounded-lg transition-all duration-200 transform hover:scale-110
//               ${isDark 
//                 ? 'hover:bg-red-500/10 text-red-400 hover:text-red-300' 
//                 : 'hover:bg-red-50 text-red-600 hover:text-red-700'
//               }
//             `}
//             title="Disconnect wallet"
//           >
//             <LogOut className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   )}
// </div>
//   );
// };

// export default WalletConnect;



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
    chainId: "jaimax-0",
    chainName: "JMC-24 Smart Chain",
    rpc: import.meta.env.VITE_RPC_URL || "http://192.168.0.97:26757",
    rest: import.meta.env.VITE_REST_URL || "http://192.168.0.97:1417",
    bip44: {
      coinType: 118,
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
        coinGeckoId: "jaimax",
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

  const isKeplrInstalled = () => {
    return typeof window.keplr !== 'undefined';
  };

  const suggestChain = async () => {
    try {
      await window.keplr.experimentalSuggestChain(chainConfig);
      console.log('✅ Chain suggested successfully');
    } catch (error) {
      console.error('❌ Failed to suggest chain:', error);
      throw error;
    }
  };

  const connectWallet = async () => {
    if (!isKeplrInstalled()) {
      window.open('https://www.keplr.app/download', '_blank');
      alert('Please install Keplr wallet extension!');
      return;
    }

    setIsConnecting(true);

    try {
      await suggestChain();
      await window.keplr.enable(chainConfig.chainId);
      const offlineSigner = window.keplr.getOfflineSigner(chainConfig.chainId);
      const accounts = await offlineSigner.getAccounts();
      
      if (accounts.length > 0) {
        const address = accounts[0].address;
        setWalletAddress(address);
        setIsWalletConnected(true);
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('isWalletConnected', 'true');
        console.log('✅ Wallet connected:', address);
        await fetchBalance(address);
      }
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchBalance = async (address) => {
    try {
      const response = await fetch(
        `${chainConfig.rest}/cosmos/bank/v1beta1/balances/${address}`
      );
      const data = await response.json();
      const jmcBalance = data.balances.find((coin) => coin.denom === 'uJMC');
      
      if (jmcBalance) {
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

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsWalletConnected(false);
    setBalance('0');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('isWalletConnected');
    console.log('👋 Wallet disconnected');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    const savedConnected = localStorage.getItem('isWalletConnected');
    
    if (savedAddress && savedConnected === 'true' && isKeplrInstalled()) {
      connectWallet();
    }
  }, []);

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
    <div className="wallet-connect-wrapper">
      {!isWalletConnected ? (
        // Connect Button
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className={`
            wallet-connect-btn group relative overflow-hidden
            flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
            transition-all duration-300 transform
            ${isDark
              ? 'bg-gradient-to-r from-[#00b2bd] to-[#00d4e0] text-white hover:shadow-[0_0_20px_rgba(0,178,189,0.4)]'
              : 'bg-gradient-to-r from-[#00b2bd] to-[#00d4e0] text-white hover:shadow-[0_8px_30px_rgba(0,178,189,0.3)]'
            }
            ${isConnecting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}
            shadow-lg
          `}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <Wallet className={`w-4 h-4 ${isConnecting ? 'animate-pulse' : ''}`} />
          <span className="wallet-btn-text relative z-10">
            {isConnecting ? 'Connecting...' : 'Connect'}
          </span>
        </button>
      ) : (
        // Connected Wallet Display
        <div className={`
          wallet-connected flex items-center gap-2 px-3 py-2 rounded-xl
          backdrop-blur-sm transition-all duration-300
          ${isDark 
            ? 'bg-gray-800/90 border border-gray-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)]' 
            : 'bg-white/90 border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
          }
        `}>
          {/* Balance Section */}
          <div className="wallet-balance-section flex items-center gap-2 pr-2 border-r border-gray-700/30">
            <div className={`
              p-1.5 rounded-lg
              ${isDark ? 'bg-[#00b2bd]/10' : 'bg-[#00b2bd]/5'}
            `}>
              <Wallet className="w-3.5 h-3.5 text-[#00b2bd]" />
            </div>
            <div className="flex flex-col">
              <span className={`text-[9px] uppercase tracking-wider font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Balance
              </span>
              <span className={`text-xs font-bold head bg-gradient-to-r from-[#00b2bd] to-[#00d4e0] bg-clip-text text-transparent`}>
                {balance} JMC
              </span>
            </div>
          </div>

          {/* Address Section */}
          <div className="wallet-address-section flex items-center gap-1.5">
            <div className="wallet-address-text flex flex-col">
              <span className={`text-[9px] uppercase tracking-wider font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Address
              </span>
              <span className={`text-xs font-semibold head font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {truncateAddress(walletAddress)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="wallet-actions flex items-center gap-0.5">
              {/* Copy Button */}
              <button
                onClick={copyAddress}
                className={`
                  p-1.5 rounded-lg transition-all duration-200 transform hover:scale-110
                  ${isDark 
                    ? 'hover:bg-gray-700/50 active:bg-gray-700' 
                    : 'hover:bg-gray-100/80 active:bg-gray-200'
                  }
                `}
                title="Copy address"
              >
                {copied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`} />
                )}
              </button>

              {/* View in Explorer */}
              <a
                href={`/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  wallet-explorer-link p-1.5 rounded-lg transition-all duration-200 transform hover:scale-110
                  ${isDark 
                    ? 'hover:bg-gray-700/50 active:bg-gray-700' 
                    : 'hover:bg-gray-100/80 active:bg-gray-200'
                  }
                `}
                title="View in explorer"
              >
                <ExternalLink className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`} />
              </a>

              {/* Divider */}
              <div className={`wallet-divider h-5 w-px mx-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

              {/* Disconnect Button */}
              <button
                onClick={disconnectWallet}
                className={`
                  p-1.5 rounded-lg transition-all duration-200 transform hover:scale-110
                  ${isDark 
                    ? 'hover:bg-red-500/10 text-red-400 hover:text-red-300' 
                    : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                  }
                `}
                title="Disconnect wallet"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Desktop - Full display (1280px+) */
        @media (min-width: 1280px) {
          .wallet-connect-wrapper {
            display: block;
          }
          .wallet-btn-text {
            display: inline;
          }
          .wallet-balance-section {
            display: flex;
          }
          .wallet-address-text {
            display: flex;
          }
          .wallet-explorer-link {
            display: flex;
          }
          .wallet-divider {
            display: block;
          }
        }

        /* Laptop - Compact (1024px - 1279px) */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .wallet-connect-wrapper {
            display: block;
          }
          .wallet-btn-text {
            display: inline;
          }
          .wallet-balance-section {
            display: none;
          }
          .wallet-address-text {
            display: flex;
          }
          .wallet-explorer-link {
            display: flex;
          }
          .wallet-divider {
            display: block;
          }
          .wallet-connected {
            gap: 0.5rem !important;
            padding: 0.5rem 0.75rem !important;
          }
        }

        /* Tablet - Hide address label (768px - 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .wallet-connect-wrapper {
            display: block;
          }
          .wallet-btn-text {
            display: inline;
          }
          .wallet-balance-section {
            display: none;
          }
          .wallet-address-text span:first-child {
            display: none;
          }
          .wallet-explorer-link {
            display: none;
          }
          .wallet-divider {
            display: block;
          }
          .wallet-connected {
            gap: 0.5rem !important;
            padding: 0.5rem 0.75rem !important;
          }
        }

        /* Mobile - Icon only (< 768px) */
        @media (max-width: 767px) {
          .wallet-connect-wrapper {
            display: block;
          }
          .wallet-btn-text {
            display: none;
          }
          .wallet-connect-btn {
            padding: 0.5rem !important;
            min-width: 40px;
          }
          .wallet-balance-section {
            display: none;
          }
          .wallet-address-text {
            display: none;
          }
          .wallet-address-section {
            gap: 0.25rem !important;
          }
          .wallet-connected {
            gap: 0.25rem !important;
            padding: 0.375rem 0.5rem !important;
          }
          .wallet-explorer-link {
            display: none;
          }
          .wallet-divider {
            display: none;
          }
          .wallet-actions {
            gap: 0 !important;
          }
          .wallet-actions button,
          .wallet-actions a {
            padding: 0.375rem !important;
          }
        }

        /* Extra Small - Ultra compact (< 480px) */
        @media (max-width: 480px) {
          .wallet-actions button,
          .wallet-actions a {
            padding: 0.25rem !important;
          }
          .wallet-actions .w-3\.5 {
            width: 0.875rem !important;
            height: 0.875rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WalletConnect;