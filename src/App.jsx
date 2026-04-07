// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./ui/Navbar";
import Footer from "./ui/Footer";

// Pages
import Home from "./pages/Home/Home";
import Proposals from "./pages/proposals/Proposals";
import ProposalDetail from "./pages/proposals/ProposalDetails";
import Blocks from "./pages/Blocks/Blocks";
import LatestBlocks from "./pages/Blocks/LatestBlocks";
import BlockDetail from "./pages/Blocks/BlockDetails";
import BlockTransactions from "./pages/Blocks/BlockHeightTransactions"
import Transactions from "./pages/Transactions/Trsansaction";
import TransactionDetailPage from "./pages/Transactions/TransactionDetailPage";
import Validators from "./pages/LeaderBoard/LeaderBoard";
import ValidatorDetail from "./pages/LeaderBoard/SetInfo";
import TopNft from "./pages/NFTS/TopNfts";
import NFTCollectionDetails from "./pages/NFTS/NFTCollectionDetails";
import TopMints from "./pages/NFTS/TopMints";
import LatestTransfer from "./pages/NFTS/LatestTransfer";
import LatestTrends from "./pages/NFTS/LatestTrends";
import LatestMints from "./pages/NFTS/LatestMints";
import AddressDetails from "./pages/address/AddressDetails";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Home */}
              <Route path="/" element={<Home />} />

              {/* Blocks */}
              <Route path="/blocks" element={<Blocks />} />
              <Route path="/blocks/latest" element={<LatestBlocks />} />
              <Route path="/blocks/:height" element={<LatestBlocks />} />
              <Route path="/blocks/:height/transactions" element={<BlockTransactions />} />
              <Route path="/address/:address" element={<AddressDetails />} />

              {/* Transactions */}
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/:hash" element={<TransactionDetailPage />} />

              {/* Validators */}
              <Route path="/validators/leaderboard" element={<Validators />} />
              <Route path="/validators/set-info" element={<ValidatorDetail />} />

              {/* NFTs */}
              <Route path="/nft/top" element={<TopNft />} />
              <Route
                path="/nft/collection/:contractAddress"
                element={<NFTCollectionDetails />}
              />
              <Route path="/nft/top-mints" element={<TopMints />} />
              <Route path="/nft/trades" element={<LatestTrends />} />
              <Route path="/nft/transfers" element={<LatestTransfer />} />
              <Route path="/nft/latest-mints" element={<LatestMints />} />
              <Route path="/nft/latest-trends" element={<LatestTrends />} />

              {/* Governance */}
              <Route path="/governance" element={<Proposals />} />
              <Route path="/proposal/:id" element={<ProposalDetail />} />

              {/* Search */}
              {/* <Route path="/search" element={<Search />} /> */}

              {/* Legal */}
              {/* <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} /> */}

              {/* 404 */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;