import React from "react";
import { Link } from "react-router-dom";
import { Copy } from "lucide-react";
// import { toast } from "react-hot-toast";

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard!", {
    style: {
      background: "#1a1a2e",
      color: "#818cf8",
      border: "1px solid rgba(129,140,248,0.3)",
    },
    iconTheme: { primary: "#818cf8", secondary: "#1a1a2e" },
    duration: 1500,
  });
};

const truncateHash = (hash, startLen = 8, endLen = 6) => {
  if (!hash) return "—";
  if (hash.length <= startLen + endLen) return hash;
  return `${hash.slice(0, startLen)}...${hash.slice(-endLen)}`;
};

const TxHashCell = ({ hash, startLen = 8, endLen = 6 }) => {
  if (!hash) {
    return (
      <span
        style={{
          color: "#475569",
          fontStyle: "italic",
          fontSize: "12px",
        }}
      >
        —
      </span>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Link
        to={`/transactions/${hash}`}
        style={{
          color: "#006666",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: 500,
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.target.style.color = "#006666")}
        onMouseLeave={(e) => (e.target.style.color = "#006666")}
        title={hash}
      >
        {truncateHash(hash, startLen, endLen)}
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          copyToClipboard(hash);
        }}
        style={{
          background: "none",
          border: "none",
          color: "#475569",
          cursor: "pointer",
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          transition: "color 0.2s ease, background 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#818cf8";
          e.currentTarget.style.background = "rgba(129,140,248,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#475569";
          e.currentTarget.style.background = "none";
        }}
        title="Copy transaction hash"
      >
        <Copy size={12} />
      </button>
    </div>
  );
};

export default TxHashCell;