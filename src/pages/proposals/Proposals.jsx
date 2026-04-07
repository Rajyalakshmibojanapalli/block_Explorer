import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProposalsQuery } from "./proposalApiSlice";
import { useTheme } from "../../context/ThemeContext";
import Pagination from "../../ui/Pagination";
import StatsCard from "../../ui/StatCard";
import Table, { Badge } from "../../ui/Table";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Landmark,
} from "lucide-react";

const Proposals = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("proposal_id");
  const [sortDirection, setSortDirection] = useState("desc");

  const { data, isLoading, isError, refetch } = useGetProposalsQuery({
    page: currentPage,
    per_page: perPage,
  });

  if (isError) return <ErrorState onRetry={refetch} isDark={isDark} />;

  const proposals = data?.data || [];
  const totalPages = data?.total_pages || 1;
  const totalItems = data?.total || 0;

  const filteredProposals = proposals
    .filter((proposal) => {
      const matchesSearch =
        searchQuery === "" ||
        proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.proposal_id.toString().includes(searchQuery);
      return matchesSearch;
    })
    .sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case "proposal_id":
          aVal = parseInt(a.proposal_id);
          bVal = parseInt(b.proposal_id);
          break;
        case "voting_end_time":
          aVal = new Date(a.voting_end_time).getTime();
          bVal = new Date(b.voting_end_time).getTime();
          break;
        case "yes_percentage":
          aVal = getYesPercentage(a);
          bVal = getYesPercentage(b);
          break;
        default:
          return 0;
      }
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

  const stats = {
    total: totalItems,
    passed: proposals.filter((p) => p.status === "PROPOSAL_STATUS_PASSED").length,
    rejected: proposals.filter((p) => p.status === "PROPOSAL_STATUS_REJECTED").length,
    voting: proposals.filter((p) => p.status === "PROPOSAL_STATUS_VOTING_PERIOD").length,
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const columns = [
    {
      key: "proposal_id",
      header: "#ID",
      sortable: true,
      width: "w-20",
      render: (val) => (
        <span
          className={`inline-flex items-center justify-center w-10 h-8 rounded-lg text-xs font-bold ${
            isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: "title",
      header: "Title",
      sortable: false,
      className: "max-w-xs lg:max-w-lg",
      render: (val, row) => (
        <div className=" flex-col gap-1.5">
          <span
            className={`text-sm font-semibold leading-snug group-hover:text-[#00b2bd] transition-colors line-clamp-2 ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
            title={val}
          >
            {val}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md w-fit ${
              isDark
                ? "bg-gray-700/60 text-gray-400 border border-gray-600/50"
                : "bg-gray-100 text-gray-500 border border-gray-200"
            }`}
            title={row.description}
          >
            {row.description}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      render: (val) => {
        const config = getStatusConfig(val, isDark);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        );
      },
    },
    {
      key: "yes_percentage",
      header: "Voting",
      // sortable: true,
      width: "w-[40px]",
      render: (_val, row) => {
        const totalVotes =
          parseInt(row.yes_votes || 0) +
          parseInt(row.no_votes || 0) +
          parseInt(row.abstain_votes || 0) +
          parseInt(row.no_with_veto_votes || 0);

        const yesPercentage =
          totalVotes > 0
            ? ((parseInt(row.yes_votes) / totalVotes) * 100).toFixed(1)
            : 0;
        const noPercentage =
          totalVotes > 0
            ? ((parseInt(row.no_votes) / totalVotes) * 100).toFixed(1)
            : 0;
        const abstainPercentage =
          totalVotes > 0
            ? ((parseInt(row.abstain_votes) / totalVotes) * 100).toFixed(1)
            : 0;

        if (totalVotes === 0) {
          return (
            <span className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              No votes yet
            </span>
          );
        }

        return (
          <div className="space-y-1.5">
            <div
              className={`h-2 rounded-full overflow-hidden flex ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <div
                className="bg-green-300 transition-all duration-300"
                style={{ width: `${yesPercentage}%` }}
              />
              <div
                className="bg-red-300 transition-all duration-300"
                style={{ width: `${noPercentage}%` }}
              />
              <div
                className="bg-gray-400 transition-all duration-300"
                style={{ width: `${abstainPercentage}%` }}
              />
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span
                  className={`font-semibold ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {yesPercentage}%
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span
                  className={`font-semibold ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {noPercentage}%
                </span>
              </span>
              <span className={`${isDark ? "text-gray-600" : "text-gray-400"}`}>
                {totalVotes.toLocaleString()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "voting_end_time",
      header: "Voting End",
      // sortable: true,
      render: (val) => (
        <div className="flex flex-col gap-0.5 whitespace-nowrap">
          <span
            className={`text-xs font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {new Date(val).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span
            className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
            title={new Date(val).toLocaleString()}
          >
            {timeAgo(val)}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-900" : "bg-[#f5f7f9]"
      } transition-colors`}
    >
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1
            className={`text-2xl subhead sm:text-4xl font-extrabold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Governance
          </h1>
          <p
            className={`text-xs sm:text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Participate in the decentralized evolution of the Architect network.
            Vote on active proposals and track protocol changes.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Proposals"
            value={stats.total}
            icon={Landmark}
            isDark={isDark}
          />
          <StatsCard
            title="Passed"
            value={stats.passed}
            icon={CheckCircle2}
            isDark={isDark}
          />
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            isDark={isDark}
          />
          <StatsCard
            title="Voting"
            value={stats.voting}
            icon={Clock}
            isDark={isDark}
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={filteredProposals}
          isLoading={isLoading}
          rowKey="proposal_id"
          onRowClick={(row) => navigate(`/proposal/${row.proposal_id}`)}
          // Sorting
          sortable
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          title="All Proposals"
          subtitle={`${filteredProposals.length} results`}
          // Pagination
          pagination={{
            page: currentPage,
            totalPages,
            totalItems,
            onPageChange: setCurrentPage,
          }}
          // Empty state
          emptyIcon={<AlertCircle className="w-10 h-10" />}
          emptyTitle="No Proposals Found"
          emptyMessage="Try adjusting your search query"
          // Styling
          compact={false}
          striped
          hoverable
          bordered
          rounded
        />
      </div>
    </div>
  );
};

export default Proposals;

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

function getYesPercentage(proposal) {
  const totalVotes =
    parseInt(proposal.yes_votes || 0) +
    parseInt(proposal.no_votes || 0) +
    parseInt(proposal.abstain_votes || 0) +
    parseInt(proposal.no_with_veto_votes || 0);
  return totalVotes > 0 ? (parseInt(proposal.yes_votes) / totalVotes) * 100 : 0;
}

function getStatusConfig(status, isDark) {
  switch (status) {
    case "PROPOSAL_STATUS_PASSED":
      return {
        label: "Passed",
        dot: "bg-green-500",
        bg: isDark ? "bg-green-300/10" : "bg-green-50",
        text: isDark ? "text-green-400" : "text-green-600",
        border: isDark ? "border-green-500/20" : "border-green-200",
      };
    case "PROPOSAL_STATUS_REJECTED":
      return {
        label: "Rejected",
        dot: "bg-red-300",
        bg: isDark ? "bg-red-300/10" : "bg-red-50",
        text: isDark ? "text-red-400" : "text-red-600",
        border: isDark ? "border-red-500/20" : "border-red-200",
      };
    case "PROPOSAL_STATUS_VOTING_PERIOD":
      return {
        label: "Voting",
        dot: "bg-blue-300 animate-pulse",
        bg: isDark ? "bg-blue-300/10" : "bg-blue-50",
        text: isDark ? "text-blue-400" : "text-blue-600",
        border: isDark ? "border-blue-500/20" : "border-blue-200",
      };
    case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
      return {
        label: "Deposit",
        dot: "bg-yellow-300",
        bg: isDark ? "bg-yellow-300/10" : "bg-yellow-50",
        text: isDark ? "text-yellow-400" : "text-yellow-600",
        border: isDark ? "border-yellow-500/20" : "border-yellow-200",
      };
    default:
      return {
        label: "Unknown",
        dot: "bg-gray-500",
        bg: isDark ? "bg-gray-500/10" : "bg-gray-50",
        text: isDark ? "text-gray-400" : "text-gray-600",
        border: isDark ? "border-gray-500/20" : "border-gray-200",
      };
  }
}

function timeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = then - now;

  if (diff < 0) {
    const seconds = Math.floor(Math.abs(diff) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } else {
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `in ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `in ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `in ${hours}h`;
    const days = Math.floor(hours / 24);
    return `in ${days}d`;
  }
}

// ═══════════════════════════════════════════
// Error State (kept as standalone)
// ═══════════════════════════════════════════

const ErrorState = ({ onRetry, isDark }) => (
  <div
    className={`min-h-screen flex items-center justify-center ${
      isDark ? "bg-gray-900" : "bg-[#f5f7f9]"
    }`}
  >
    <div className="text-center space-y-4 px-4">
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
          isDark ? "bg-red-900/20" : "bg-red-50"
        }`}
      >
        <XCircle
          className={`w-10 h-10 ${isDark ? "text-red-400" : "text-red-500"}`}
        />
      </div>
      <h2
        className={`text-xl font-bold ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Failed to Load Proposals
      </h2>
      <p
        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        Something went wrong. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-[#00b2bd] text-white rounded-xl text-sm font-semibold hover:bg-[#009da7] transition-colors shadow-lg shadow-[#00b2bd]/20"
      >
        Retry
      </button>
    </div>
  </div>
);