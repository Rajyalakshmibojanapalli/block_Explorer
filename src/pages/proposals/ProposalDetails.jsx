// src/pages/ProposalDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useGetProposalByIdQuery } from "./proposalApiSlice";
import { useTheme } from "../../context/ThemeContext";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDateRange(start, end) {
  const fmt = (d) =>
    new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getProposalTypeLabel(type) {
  if (!type) return "Proposal";
  const parts = type.split(".");
  const raw = parts[parts.length - 1] || type;
  // e.g. MsgSoftwareUpgradeProposal → Software Upgrade
  return raw
    .replace(/^Msg/, "")
    .replace(/Proposal$/, "")
    .replace(/([A-Z])/g, " $1")
    .trim();
}

// ─── Main Component ──────────────────────────────────────────────────────────

const ProposalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("description");

  const { data, isLoading, isError, refetch } = useGetProposalByIdQuery(id);

  if (isLoading) return <LoadingSkeleton isDark={isDark} />;
  if (isError) return <ErrorState onRetry={refetch} isDark={isDark} />;

  const proposal = data?.data || data;

  // ── Vote math ──
  const yesVotes    = parseFloat(proposal.yes_votes || 0);
  const noVotes     = parseFloat(proposal.no_votes || 0);
  const vetoVotes   = parseFloat(proposal.no_with_veto_votes || 0);
  const abstainVotes = parseFloat(proposal.abstain_votes || 0);
  const totalVotes  = yesVotes + noVotes + vetoVotes + abstainVotes;

  const pct = (v) => (totalVotes > 0 ? ((v / totalVotes) * 100).toFixed(1) : "0");
  const uJMC = (v) => `${parseFloat(v/1000000 || 0).toLocaleString()} JMC`;

  // Turnout / Quorum — adapt field names as needed
  const turnout = proposal.turnout ? `${parseFloat(proposal.turnout).toFixed(1)}%` : "65.4%";
  const quorum  = proposal.quorum  ? `${parseFloat(proposal.quorum).toFixed(2)}%`  : "40.00%";

  // ── Status ──
  const isPassed   = proposal.status === "PROPOSAL_STATUS_PASSED";
  const isRejected = proposal.status === "PROPOSAL_STATUS_REJECTED";
  const isVoting   = proposal.status === "PROPOSAL_STATUS_VOTING_PERIOD";

  const resultLabel = isPassed ? "PASSED" : isRejected ? "REJECTED" : isVoting ? "VOTING" : "PENDING";
  const resultColor = isPassed
    ? "text-green-500"
    : isRejected
    ? "text-red-500"
    : isVoting
    ? "text-blue-500"
    : "text-gray-500";

  const tabs = ["description", "votes", "details", "json"];

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-[#f0f4f7]"} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Back ── */}
        <button
          onClick={() => navigate("/governance")}
          className={`flex items-center gap-2 mb-6 text-sm font-medium transition-colors ${
            isDark ? "text-[#00b2bd] hover:text-white" : "text-[#00b2bd] hover:text-[#009da7]"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Governance
        </button>

        {/* ── Main Card ── */}      
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>

          {/* ── Proposal Header ── */}
          <div className="px-8 pt-8 pb-6">

            {/* Type badge */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold border ${
                isDark
                  ? "bg-purple-900/30 text-purple-300 border-purple-700/50"
                  : "bg-purple-50 text-purple-600 border-purple-200"
              }`}>
                {getProposalTypeLabel(proposal.proposal_type)}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-xl sm:text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              #{proposal.proposal_id}. {proposal.title}
            </h1>

            {/* Voting period */}
            <p className={`text-xs mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Voting:{" "}
              {formatDateRange(proposal.voting_start_time, proposal.voting_end_time)}
            </p>

            {/* Result + Turnout row */}
            <div className="flex flex-wrap items-center gap-8 mb-8">
              <div>
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Proposal Result
                </p>
                <p className={`text-sm font-bold ${resultColor}`}>{resultLabel}</p>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Turnout / Quorum
                </p>
                <p className={`text-xs font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {turnout} / {quorum}
                </p>
              </div>
            </div>

            {/* ── 4-Column Vote Breakdown ── */}
            <div className="grid  lg:grid-cols-4 gap-0   ">

              {/* YES — highlighted with border when leading */}
              <VoteColumn
                label="YES"
                percentage={pct(yesVotes)}
                amount={uJMC(yesVotes)}
                color="green"
                highlight={isPassed}
                isDark={isDark}
              />

              {/* NO */}
              <VoteColumn
                label="NO"
                percentage={pct(noVotes)}
                amount={uJMC(noVotes)}
                color="red"
                highlight={isRejected}
                isDark={isDark}
              />

              {/* VETO */}
              <VoteColumn
                label="VETO"
                percentage={pct(vetoVotes)}
                amount={uJMC(vetoVotes)}
                color="orange"
                isDark={isDark}
              />

              {/* ABSTAIN */}
              <VoteColumn
                label="ABSTAIN"
                percentage={pct(abstainVotes)}
                amount={uJMC(abstainVotes)}
                color="gray"
                isDark={isDark}
              />
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex px-8">
              {tabs.map((tab) => (  
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-4 text-sm font-medium capitalize border-b-2 transition-colors mr-2
                    ${activeTab === tab
                      ? "border-[#00b2bd] text-[#00b2bd]"
                      : `border-transparent ${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="px-8 py-6">
            {activeTab === "description" && (
              <DescriptionTab proposal={proposal} isDark={isDark} />
            )}
            {activeTab === "votes" && (
              <VotesTab
                yes={yesVotes} no={noVotes} veto={vetoVotes} abstain={abstainVotes}
                total={totalVotes} pct={pct} isDark={isDark}
              />
            )}
            {activeTab === "details" && (
              <DetailsTab proposal={proposal} isDark={isDark} />
            )}
            {activeTab === "json" && (
              <JsonTab proposal={proposal} isDark={isDark} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;

// ─── VoteColumn ─────────────────────────────────────────────────────────────

const VoteColumn = ({ label, percentage, amount, color, highlight, isDark }) => {
  const colors = {
    green:  { bar: "bg-green-500",  text: "text-green-500" },
    red:    { bar: "bg-red-500",    text: "text-red-500" },
    orange: { bar: "bg-orange-500", text: "text-orange-500" },
    gray:   { bar: isDark ? "bg-gray-500" : "bg-gray-400", text: isDark ? "text-gray-400" : "text-gray-500" },
  };
  const c = colors[color];

  return (
    <div className={`
      px-5 py-4 first:pl-0 last:pr-0
      ${highlight
        ? `rounded-xl border-2 border-green-500 mx-1 first:ml-0 last:mr-0 ${isDark ? "bg-green-900/10" : "bg-green-50/60"}`
        : ""
      }
    `}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold tracking-wide ${c.text}`}>{label}</span>
        <span className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          {percentage}%
        </span>
      </div>
      {/* Progress bar */}
      <div className={`h-1.5 rounded-full mb-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${c.bar}`}
          style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
        />
      </div>
      <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{amount}</p>
    </div>
  );
};

// ─── Tab Components ──────────────────────────────────────────────────────────

const DescriptionTab = ({ proposal, isDark }) => (
  <div>
    <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
      {proposal.description || "Summary of the proposal"}
    </p>
    {proposal.metadata && (
      <a
        href={proposal.metadata}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 mt-4 text-sm text-[#00b2bd] hover:underline"
      >
        View Metadata <ExternalLink className="w-3 h-3" />
      </a>
    )}
  </div>
);

const VotesTab = ({ yes, no, veto, abstain, total, pct, isDark }) => {
  const rows = [
    { label: "Yes",          votes: yes,     color: "text-green-500" },
    { label: "No",           votes: no,      color: "text-red-500" },
    { label: "No with Veto", votes: veto,    color: "text-orange-500" },
    { label: "Abstain",      votes: abstain, color: isDark ? "text-gray-400" : "text-gray-500" },
  ];
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className={`font-medium ${r.color}`}>{r.label}</span>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>
              {pct(r.votes)}% &nbsp;
              <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                ({parseFloat(r.votes).toLocaleString()} uJMC)
              </span>
            </span>
          </div>
          <div className={`h-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
            <div
              className={`h-full rounded-full ${
                r.label === "Yes" ? "bg-green-500"
                : r.label === "No" ? "bg-red-500"
                : r.label === "No with Veto" ? "bg-orange-500"
                : "bg-gray-400"
              }`}
              style={{ width: `${Math.min(parseFloat(pct(r.votes)), 100)}%` }}
            />
          </div>
        </div>
      ))}
      <div className={`pt-4 border-t text-sm flex justify-between ${isDark ? "border-gray-700 text-gray-400" : "border-gray-100 text-gray-500"}`}>
        <span>Total Votes</span>
        <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          {total.toLocaleString()} uJMC
        </span>
      </div>
    </div>
  );
};

const DetailsTab = ({ proposal, isDark }) => {
  const items = [
    ["Proposal ID", `#${proposal.proposal_id}`],
    ["Status", proposal.status?.replace("PROPOSAL_STATUS_", "") || "—"],
    ["Type", proposal.proposal_type?.split(".").pop() || "—"],
    ["Submit Time", new Date(proposal.submit_time).toLocaleString()],
    ["Deposit End Time", new Date(proposal.deposit_end_time).toLocaleString()],
    ["Voting Start", new Date(proposal.voting_start_time).toLocaleString()],
    ["Voting End", new Date(proposal.voting_end_time).toLocaleString()],
    ["Total Deposit", `${(parseInt(proposal.total_deposit || 0) / 1_000_000).toLocaleString()} JMC`],
    ["Block Height", proposal.height?.toLocaleString() || "—"],
    ["Proposer", proposal.proposer || "—"],
  ];

  return (
    <div className="grid  sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(([label, value]) => (
        <div 
          key={label} 
          className={`p-4 rounded-lg border ${
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}
        >
          <div className={`text-xs font-medium mb-2 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            {label}
          </div>
          <div className={`text-sm font-semibold break-all ${
            isDark ? "text-gray-200" : "text-gray-900"
          }`}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
};

const JsonTab = ({ proposal, isDark }) => (
  <pre className={`text-xs leading-relaxed overflow-auto rounded-xl p-4 max-h-96 ${
    isDark ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"
  }`}>
    {JSON.stringify(proposal, null, 2)}
  </pre>
);

// ─── Loading / Error ─────────────────────────────────────────────────────────

const LoadingSkeleton = ({ isDark }) => (
  <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-[#f0f4f7]"} animate-pulse`}>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className={`h-6 w-28 rounded ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
      <div className={`rounded-2xl border p-8 space-y-4 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className={`h-5 w-32 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
        <div className={`h-9 w-2/3 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
        <div className={`h-4 w-1/2 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
        <div className="grid grid-cols-4 gap-4 pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-20 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-100"}`} />
          ))}
        </div>
        <div className={`h-12 w-full rounded ${isDark ? "bg-gray-700" : "bg-gray-100"}`} />
        <div className={`h-24 w-full rounded ${isDark ? "bg-gray-700" : "bg-gray-100"}`} />
      </div>
    </div>
  </div>
);

const ErrorState = ({ onRetry, isDark }) => (
  <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-[#f0f4f7]"}`}>
    <div className="text-center space-y-4 px-4">
      <XCircle className={`w-12 h-12 mx-auto ${isDark ? "text-red-400" : "text-red-500"}`} />
      <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Failed to Load Proposal</h2>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Something went wrong. Please try again.</p>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 bg-[#00b2bd] text-white rounded-lg text-sm font-semibold hover:bg-[#009da7] transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);