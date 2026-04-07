// src/pages/address/AddressAssets.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Coins, FileCode, Send, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useGetTransactionsByAddressQuery } from "../Transactions/transactionsApiSlice";
import LoadingSkeleton from "../../ui/LoadingSkeleton";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination";
import { timeAgo, truncateAddress } from "../../hooks/formats";
import TxHashCell from "../../ui/TxHashCell";

const AddressAssets = ({ address }) => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("transactions");
  const perPage = 20;

  const { data, isLoading, isError, error, refetch } = useGetTransactionsByAddressQuery(
    {
      address: address,
      page: page,
      per_page: perPage,
    },
    { skip: !address }
  );

  if (!address) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <div className="text-slate-400 text-center">No address provided</div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton rows={10} cols={6} />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <ErrorState
          message={error?.message || "Failed to load assets"}
          onRetry={refetch}
        />
      </div>
    );
  }

  const transactions = data?.transactions || [];
  const wasmExecutions = data?.wasm_executions || [];

  // Helper functions
  const formatAmount = (amount, denom) => {
    if (!amount) return "—";
    if (typeof amount === 'string' && amount.includes(denom)) {
      const value = parseInt(amount.replace(denom, ''));
      return `${(value / 1000000).toLocaleString()} ${denom.replace('u', '').toUpperCase()}`;
    }
    if (typeof amount === 'number') {
      return `${(amount / 1000000).toLocaleString()} ${denom ? denom.replace('u', '').toUpperCase() : 'JMC'}`;
    }
    return amount;
  };

  const getMethodName = (method) => {
    if (!method) return 'Unknown';
    const parts = method.split('.');
    return parts[parts.length - 1] || method;
  };

  const getTransactionDirection = (tx) => {
    if (tx.from_address === address) return 'out';
    if (tx.to_address === address) return 'in';
    return 'internal';
  };

  // Transaction columns
  const transactionColumns = [
    {
      key: "hash",
      header: "TX Hash",
      render: (value) => <TxHashCell hash={value} />,
    },
    {
      key: "method",
      header: "Method",
      render: (value, row) => {
        const direction = getTransactionDirection(row);
        const isIncoming = direction === 'in';
        return (
          <div className="flex items-center gap-2">
            
            <span className="text-sm font-regular text-gray-600">
              {getMethodName(value)}
            </span>
          </div>
        );
      },
    },
    {
      key: "height",
      header: "Block",
      align: "right",
      render: (value) => (
        <Link
          to={`/block/${value}`}
          className="text-[#006666] hover:text-[#00ffc8] font-semibold text-xs transition-colors"
        >
          {value?.toLocaleString()}
        </Link>
      ),
    },
     {
      key: "timestamp",
      header: "Age",
      align: "right",
      render: (value) => (
        <span className="text-slate-500 text-xs whitespace-nowrap" title={value}>
          {timeAgo(value)}
        </span>
      ),
    },

    
    {
      key: "from_address",
      header: "From",
      render: (value) => (
        <Link
          to={`/address/${value}`}
          className="text-[#006666] hover:text-[#00ffc8] font-semibold text-xs transition-colors"
        >
          {truncateAddress(value, 6, 6)}
        </Link>
      ),
    },
    {
      key: "to_address",
      header: "To",
      render: (value) => (
        <Link
          to={`/address/${value}`}
          className="text-[#006666] hover:text-[#00ffc8] font-semibold text-xs transition-colors"
        >
          {truncateAddress(value, 6, 6)}
        </Link>
      ),
    },
    {
      key: "amount_value",
      header: "Amount",
      align: "right",
      render: (value, row) => {
        const direction = getTransactionDirection(row);
        const isIncoming = direction === 'in';
        return (
          <>
          <span className={`text-[11px] font-semibold head `}>
            {(value, row.amount_value/1000000)} JMC
          </span>
         
          </>
        );
      },
    },
{
  key: "fee",
  header: "Fee",
  align: "right",
  render: (value, row) => {
    // Remove "uJMC" from the end and extract only the numerical value
    const feeValue = row.fee?.toString().replace(/uJMC$/i, '').trim();
    
    return (
      <span className="text-[11px] head font-semibold head">
        {feeValue/1000000 || '—'} JMC
      </span>
    );
  },
},
        {
      key: "status",
      header: "Status",
      render: (value, row) => {
        const isSuccess = row.success;
        return (
          <div className=" items-center gap-1.5">
            {isSuccess ? (
              <>
                <span className="text-xs font-medium text-[#006666]">Success</span>
              </>
            ) : (
              <>
                <span className="text-xs font-medium text-red-400">Failed</span>
              </>
            )}
          </div>
        );
      },
    },
   
  ];

  // WASM Execution columns
  const wasmColumns = [
    {
      key: "tx_hash",
      header: "TX Hash",
      render: (value) => <TxHashCell hash={value} />,
    },
    {
      key: "execute_action",
      header: "Action",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FileCode size={12} className="text-blue-400" />
          </div>
          <span className="text-sm font-medium text-slate-300">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "success",
      header: "Status",
      render: (value, row) => (
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            {value ? (
              <>
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Success</span>
              </>
            ) : (
              <>
                <XCircle size={14} className="text-red-400" />
                <span className="text-xs font-medium text-red-400">Failed</span>
              </>
            )}
          </div>
          {row.error && (
            <p className="text-xs text-red-400 max-w-xs truncate" title={row.error}>
              {row.error}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "contract_address",
      header: "Contract",
      render: (value) => (
        <Link
          to={`/contract/${value}`}
          className="text-[#00d4aa] hover:text-[#00ffc8] font-mono text-xs transition-colors"
        >
          {truncateAddress(value, 8, 8)}
        </Link>
      ),
    },
    {
      key: "gas_used",
      header: "Gas Used",
      align: "right",
      render: (value) => (
        <span className="text-sm font-mono text-slate-300">
          {value?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "height",
      header: "Block",
      align: "right",
      render: (value) => (
        <Link
          to={`/block/${value}`}
          className="text-[#00d4aa] hover:text-[#00ffc8] font-mono text-xs transition-colors"
        >
          {value?.toLocaleString()}
        </Link>
      ),
    },
    {
      key: "timestamp",
      header: "Time",
      align: "right",
      render: (value) => (
        <span className="text-slate-500 text-xs whitespace-nowrap" title={value}>
          {timeAgo(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="rounded-2xl  border border-white/6 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
           
            <div>
              <h3 className="text-lg font-semibold text-black">
                Address Activity
              </h3>
              
            </div>
          </div>
        </div>
        {activeTab === "transactions" && (
          transactions.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No transactions found"
              subtitle="This address hasn't made any transactions"
            />
          ) : (
            <Table
              columns={transactionColumns}
              data={transactions}
              rowKey="hash"
              hoverable
              striped
              bordered
              rounded
            />
          )
        )}

        {activeTab === "wasm" && (
          wasmExecutions.length === 0 ? (
            <EmptyState
              icon={FileCode}
              title="No WASM executions found"
              subtitle="This address hasn't executed any smart contracts"
            />
          ) : (
            <Table
              columns={wasmColumns}
              data={wasmExecutions}
              rowKey="tx_hash"
              hoverable
              striped
              bordered
              rounded
            />
          )
        )}
      </div>

      {/* Pagination */}
      {data?.total_pages > 1 && (
        <Pagination
          page={page}
          totalPages={data.total_pages}
          total={data.total}
          perPage={perPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default AddressAssets;