import React from "react";
import { Link } from "react-router-dom";
import { Copy } from "lucide-react";
// import { toast } from "react-hot-toast";

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard!", {
    style: {
      background: "#1a1a2e",
      color: "#00d4aa",
      border: "1px solid rgba(0,212,170,0.3)",
    },
    iconTheme: { primary: "#00d4aa", secondary: "#1a1a2e" },
    duration: 1500,
  });
};

const truncateAddress = (addr, startLen = 10, endLen = 6) => {
  if (!addr) return "—";
  if (addr.length <= startLen + endLen) return addr;
  return `${addr.slice(0, startLen)}...${addr.slice(-endLen)}`;
};

const AddressCell = ({ address, label, startLen = 10, endLen = 6 }) => {
  if (!address) {
    return (
      <span
        style={{
          color: "#475569",
          fontStyle: "italic",
          fontSize: "12px",
        }}
      >
        {label || "—"}
      </span>
    );
  }

  return (
    <div
      style={{
        display: "",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Link
        to={`/address/${address}`}
        style={{
          color: "#006666",
          textDecoration: "none",
          // fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          fontWeight: 500,
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.target.style.color = "#000000")}
        onMouseLeave={(e) => (e.target.style.color = "#006666")}
        title={address}
      >
        {truncateAddress(address, startLen, endLen)}
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          copyToClipboard(address);
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
          e.currentTarget.style.color = "#006666";
          e.currentTarget.style.background = "rgba(0,212,170,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#475569";
          e.currentTarget.style.background = "none";
        }}
        title="Copy address"
      >
        {/* <Copy size={12} /> */}
      </button>
    </div>
  );
};

export default AddressCell;