// src/pages/address/AddressOverview.jsx
import React from "react";
import { Wallet, TrendingUp, Send, Vote, Shield } from "lucide-react";
import { formatAmount } from "../../hooks/formats";
import StatCard from "../../ui/HomeStat";
const AddressOverview = ({ address, balances, isAuthority }) => {
  const stats = [
    {
      label: "Bank Transfers",
      value: address?.bank_transfer_count || 0,
      icon: Send,
      color: "emerald",
    },
    {
      label: "CW20 Transfers",
      value: address?.cw20_transfer_count || 0,
      icon: TrendingUp,
      color: "blue",
    },
    {
      label: "Transactions",
      value: address?.tx_count || 0,
      icon: Wallet,
      color: "purple",
    },
    {
      label: "Votes",
      value: address?.vote_count || 0,
      icon: Vote,
      color: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Authority Badge */}
      {isAuthority && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          {/* <Shield size={20} className="text-amber-400" /> */}
          <div>
            <p className="text-sm font-semibold text-black">
              Authority Address
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              This address has special permissions on the network
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-slate-800/40 border border-white/6 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-black uppercase font-semibold">
                  {stat.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg  border border-${stat.color}-500/20 flex items-center justify-center`}
                >
                  <Icon size={16} className={`text-${stat.color}-400`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-200">
                {stat.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Balances */}
      {balances && balances.length > 0 && (
        <div className="rounded-xl bg-slate-800/40 border border-white/6 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6">
            <h3 className="text-base font-semibold text-slate-200">
              Balances
            </h3>
          </div>
          <div className="divide-y divide-white/6">
            {balances.map((balance, idx) => (
              <div
                key={idx}
                className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    {balance.denom}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Block #{balance.height?.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-slate-200 font-mono">
                    {formatAmount(balance.amount, balance.denom)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {balance.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressOverview;