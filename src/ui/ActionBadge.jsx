// src/components/nft/ActionBadge.jsx
import React from "react";

const ACTION_CONFIGS = {
  mint: {
    label: "Mint",
    bg: "rgba(16, 185, 129, 0.15)",
    border: "rgba(16, 185, 129, 0.4)",
    color: "#10b981",
    glow: "0 0 12px rgba(16, 185, 129, 0.2)",
    icon: "✦",
  },
  transfer_nft: {
    label: "Transfer",
    bg: "rgba(99, 102, 241, 0.15)",
    border: "rgba(99, 102, 241, 0.4)",
    color: "#818cf8",
    glow: "0 0 12px rgba(99, 102, 241, 0.2)",
    icon: "⇄",
  },
  send_nft: {
    label: "Send",
    bg: "rgba(245, 158, 11, 0.15)",
    border: "rgba(245, 158, 11, 0.4)",
    color: "#f59e0b",
    glow: "0 0 12px rgba(245, 158, 11, 0.2)",
    icon: "↗",
  },
  burn: {
    label: "Burn",
    bg: "rgba(239, 68, 68, 0.15)",
    border: "rgba(239, 68, 68, 0.4)",
    color: "#ef4444",
    glow: "0 0 12px rgba(239, 68, 68, 0.2)",
    icon: "🔥",
  },
  approve: {
    label: "Approve",
    bg: "rgba(14, 165, 233, 0.15)",
    border: "rgba(14, 165, 233, 0.4)",
    color: "#0ea5e9",
    glow: "0 0 12px rgba(14, 165, 233, 0.2)",
    icon: "✓",
  },
  revoke: {
    label: "Revoke",
    bg: "rgba(168, 85, 247, 0.15)",
    border: "rgba(168, 85, 247, 0.4)",
    color: "#a855f7",
    glow: "0 0 12px rgba(168, 85, 247, 0.2)",
    icon: "✕",
  },
  list: {
    label: "List",
    bg: "rgba(34, 197, 94, 0.15)",
    border: "rgba(34, 197, 94, 0.4)",
    color: "#22c55e",
    glow: "0 0 12px rgba(34, 197, 94, 0.2)",
    icon: "📋",
  },
  buy: {
    label: "Buy",
    bg: "rgba(59, 130, 246, 0.15)",
    border: "rgba(59, 130, 246, 0.4)",
    color: "#3b82f6",
    glow: "0 0 12px rgba(59, 130, 246, 0.2)",
    icon: "💰",
  },
};

const DEFAULT_CONFIG = {
  label: "Unknown",
  bg: "rgba(148, 163, 184, 0.15)",
  border: "rgba(148, 163, 184, 0.4)",
  color: "#94a3b8",
  glow: "none",
  icon: "•",
};

const ActionBadge = ({ action, showIcon = true, size = "default" }) => {
  const config = ACTION_CONFIGS[action] || {
    ...DEFAULT_CONFIG,
    label: action
      ? action
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Unknown",
  };

  const sizeStyles = {
    small: {
      padding: "2px 8px",
      fontSize: "10px",
      dotSize: 4,
      gap: 4,
    },
    default: {
      padding: "4px 12px",
      fontSize: "12px",
      dotSize: 6,
      gap: 6,
    },
    large: {
      padding: "6px 16px",
      fontSize: "13px",
      dotSize: 7,
      gap: 7,
    },
  };

  const s = sizeStyles[size] || sizeStyles.default;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: s.padding,
        borderRadius: 20,
        fontSize: s.fontSize,
        fontWeight: 600,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        // background: config.bg,
        // border: `1px solid ${config.border}`,
        color: '#475569',
        // boxShadow: config.glow,
        whiteSpace: "nowrap",
        lineHeight: 1,
        transition: "all 0.2s ease",
        cursor: "default",
        userSelect: "none",
      }}
    >
      {/* Glowing dot indicator */}
      
      {config.label}
    </span>
  );
};

export default ActionBadge;