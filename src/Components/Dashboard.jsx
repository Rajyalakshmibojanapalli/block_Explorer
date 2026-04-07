// pages/Dashboard.jsx
import StatCard from "../components/ui/StatCard";
import SearchBar from "../components/ui/SearchBar";
import Button from "../components/ui/Button";
import Dropdown from "../components/ui/Dropdown";
import { useState } from "react";

const Dashboard = () => {
  const [status, setStatus] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="12,450" icon="👥" trend="up" trendValue="12%" />
        <StatCard title="Revenue" value="$84,200" icon="💰" trend="up" trendValue="8.5%" />
        <StatCard title="Orders" value="1,320" icon="📦" trend="down" trendValue="3.2%" />
        <StatCard title="Tickets" value="45" icon="🎫" />
      </div>

      {/* Search + Actions */}
      <div className="flex flex-wrap items-end gap-4">
        <SearchBar
          placeholder="Search users..."
          onSearch={(val) => console.log(val)}
        />

        <Dropdown
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Pending", value: "pending" },
          ]}
        />

        <Button variant="primary" icon="➕">Add New</Button>
        <Button variant="outline">Export</Button>
        <Button variant="danger" size="sm">Delete</Button>
        <Button variant="success" loading>Saving...</Button>
      </div>
    </div>
  );
};

export default Dashboard;