// // src/pages/address/AddressCw20Transfers.jsx
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight, Coins } from "lucide-react";
// import { useGetAddressCw20TransfersQuery } from "./addressApiSlice";
// import { timeAgo } from "../../hooks/formats";

// import Table from "../../ui/Table";
// import Pagination from "../../ui/Pagination";
// import LoadingSkeleton from "../../ui/LoadingSkeleton";
// import ErrorState from "../../ui/ErrorState";
// import EmptyState from "../../ui/EmptyState";
// import AddressCell from "../../ui/AddressCell";
// import TxHashCell from "../../ui/TxHashCell";
// import ActionBadge from "../../ui/ActionBadge";

// const PER_PAGE = 20;

// const AddressCw20Transfers = ({ address }) => {
//   const [page, setPage] = useState(1);

//   const { data, isLoading, isError, error, refetch } =
//     useGetAddressCw20TransfersQuery({
//       address,
//       page,
//       per_page: PER_PAGE,
//     });

//   const transfers = data?.data || [];
//   const total = data?.total || 0;
//   const totalPages = data?.total_pages || 1;
// const transformData = (transactions) => {
//   const flattened = [];
  
//   transactions.forEach(tx => {
//     const { execute_msg, execute_action } = tx;
    
//     if (execute_action === 'airdrop') {
//       // Create a row for each recipient in airdrop
//       execute_msg.airdrop.recipients.forEach((recipient, index) => {
//         flattened.push({
//           ...tx,
//           action: execute_action,
//           recipients: recipient,
//           amount: parseInt(execute_msg.airdrop.amounts[index])
//         });
//       });
//     } else if (execute_action === 'transfer') {
//       // Single row for transfer
//       flattened.push({
//         ...tx,
//         action: execute_action,
//         recipients: execute_msg.transfer.recipient,
//         amount: parseInt(execute_msg.transfer.amount)
//       });
//     }
//   });
  
//   return flattened;
// };
//   const columns = [
//     {
//       key: "tx_hash",
//       header: "Tx Hash",
//       render: (value) => <TxHashCell hash={value} />,
//     },
//     {
//       key: "action",
//       header: "Action",
//       render: (value) => <ActionBadge action={value} />,
//     },
//     {
//       key: "contract_address",
//       header: "Contract",
//       render: (value) => <AddressCell address={value} label="Contract" />,
//     },
//     {
//       key: "sender",
//       header: "From",
//       render: (value) => (
//         <AddressCell address={value || "Null"} label={!value ? "Mint" : ""} />
//       ),
//     },
//     {
//       key: "arrow",
//       header: "",
//       render: () => (
//         <div className="flex items-center justify-center">
//           <ArrowRight size={14} className="text-slate-600" />
//         </div>
//       ),
//     },
//   {
//   key: "recipients",
//   header: "To",
//   render: (value, row) => {
//     if (Array.isArray(value)) {
//       return (
//         <div className="space-y-1">
//           {value.map((addr, i) => (
//             <AddressCell key={i} address={addr} />
//           ))}
//         </div>
//       );
//     }
//     return <AddressCell address={value} />;
//   },
// },
//     {
//       key: "amount",
//       header: "Amount",
//       align: "right",
//       render: (value) => (
//         <span className="text-sm font-semibold text-blue-400 font-mono">
//           {value?.toLocaleString()}
//         </span>
//       ),
//     },
//     {
//       key: "height",
//       header: "Height",
//       align: "right",
//       render: (value) => (
//         <Link
//           to={`/block/${value}`}
//           className="text-[#00d4aa] hover:text-[#00ffc8] font-mono text-[13px] font-medium transition-colors"
//         >
//           {value?.toLocaleString()}
//         </Link>
//       ),
//     },
//     {
//       key: "timestamp",
//       header: "Time",
//       align: "right",
//       render: (value) => (
//         <span className="text-slate-500 text-xs whitespace-nowrap" title={value}>
//           {timeAgo(value)}
//         </span>
//       ),
//     },
//   ];

//   if (isLoading) {
//     return <LoadingSkeleton rows={10} cols={9} />;
//   }

//   if (isError) {
//     return (
//       <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
//         <ErrorState
//           message={error?.data?.message || "Failed to load CW20 transfers"}
//           onRetry={refetch}
//         />
//       </div>
//     );
//   }

//   if (transfers.length === 0) {
//     return (
//       <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
//         <EmptyState
//           icon={Coins}
//           title="No CW20 transfers found"
//           subtitle="This address hasn't made any CW20 token transfers yet"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <Table
//         columns={columns}
//         data={transfers}
//         rowKey="id"
//         hoverable
//         striped
//         bordered
//         rounded
//       />
//       <Pagination
//         page={page}
//         totalPages={totalPages}
//         total={total}
//         perPage={PER_PAGE}
//         onPageChange={setPage}
//       />
//     </div>
//   );
// };

// export default AddressCw20Transfers;



// src/pages/address/AddressCw20Transfers.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Coins } from "lucide-react";
import { useGetAddressCw20TransfersQuery } from "./addressApiSlice";
import { timeAgo } from "../../hooks/formats";

import Table, { TimeAgo } from "../../ui/Table";
import Pagination from "../../ui/Pagination";
import LoadingSkeleton from "../../ui/LoadingSkeleton";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
import AddressCell from "../../ui/AddressCell";
import TxHashCell from "../../ui/TxHashCell";
import ActionBadge from "../../ui/ActionBadge";

const PER_PAGE = 20;

const AddressCw20Transfers = ({ address }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } =
    useGetAddressCw20TransfersQuery({
      address,
      page,
      per_page: PER_PAGE,
    });

  const transfers = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  const transformData = (transactions) => {
    const flattened = [];
    
    transactions.forEach(tx => {
      const { execute_msg, execute_action } = tx;
      
      if (execute_action === 'airdrop') {
        // Create a row for each recipient in airdrop
        execute_msg.airdrop.recipients.forEach((recipient, index) => {
          flattened.push({
            ...tx,
            id: `${tx.id}-${index}`, // Unique ID for each row
            action: execute_action,
            recipients: recipient,
            amount: parseInt(execute_msg.airdrop.amounts[index])
          });
        });
      } else if (execute_action === 'transfer') {
        // Single row for transfer
        flattened.push({
          ...tx,
          action: execute_action,
          recipients: execute_msg.transfer.recipient,
          amount: parseInt(execute_msg.transfer.amount)
        });
      }
    });
    
    return flattened;
  };

  const columns = [
    {
      key: "tx_hash",
      header: "Tx Hash",
       align:'center',
      render: (value) => <TxHashCell hash={value} />,
    },
    {
      key: "action",
      header: "Action",
       align:'center',
      render: (value) => <ActionBadge action={value} />,
    },
    {
      key: "contract_address",
      header: "Contract",
       align:'center',
      render: (value) => <AddressCell address={value} label="Contract" />,
    },
    {
      key: "sender",
      header: "From",
       align:'center',
      render: (value) => (
        <AddressCell address={value || "Null"} label={!value ? "Mint" : ""} />
      ),
    },
    {
      key: "arrow",
      header: "",
      render: () => (
        <div className="flex items-center justify-center">
          <ArrowRight size={14} className="text-slate-600" />
        </div>
      ),
    },
    {
      key: "recipients",
      header: "To",
       align:'center',
      render: (value) => <AddressCell address={value} />,
    },
    {
      key: "amount",
      header: "Amount",
       align:'center',
      render: (value) => (
        <span className="text-sm font-semibold head text-[#006666] font-mono">
          {value ? (parseInt(value) / 1000000).toLocaleString() : '0'} JMC
        </span>
      ),
    },
    {
      key: "height",
      header: "Height",
       align:'center',
      render: (value) => (
        <Link
          to={`/blocks/${value}`}
          className="text-[#006666] hover:text-[#006666] font-semibold text-[13px] font-medium transition-colors"
        >
          {value?.toLocaleString()}
        </Link>
      ),
    },
    {
      key: "timestamp",
      header: "Time",
       align:'center',
      render: (value) => (
       <TimeAgo timestamp={(value)}/>
      ),
    },
  ];

  // Transform the data before using it
  const transformedData = transformData(transfers);

  if (isLoading) {
    return <LoadingSkeleton rows={10} cols={9} />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <ErrorState
          message={error?.data?.message || "Failed to load CW20 transfers"}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <EmptyState
          icon={Coins}
          title="No CW20 transfers found"
          subtitle="This address hasn't made any CW20 token transfers yet"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={transformedData} // Use transformed data instead of raw transfers
        rowKey="id"
        hoverable
        striped
        bordered
        rounded
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        total={transformedData.length} // Update total to reflect transformed rows
        perPage={PER_PAGE}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AddressCw20Transfers;