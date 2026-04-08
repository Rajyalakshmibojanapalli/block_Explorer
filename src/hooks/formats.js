function timeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return `${seconds} secs ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hrs ago`;
  return `${Math.floor(hours / 24)} days ago`;
}
export { timeAgo };

function truncateHash(hash, start = 8, end = 4) {
  if (!hash) return "";
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
export { truncateHash };
function truncateAddress(addr, start = 6, end = 2) {
  if (!addr) return "";
  if (addr.length <= start + end) return addr;
  return `${addr.slice(0, start)}...${addr.slice(-end)}`;
}
export { truncateAddress };
const formatTime = (time) => {
  if (!time) return "—";
  const diff = Math.floor((Date.now() - new Date(time).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};
export { formatTime };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    let ago = '';
    if (diff < 60) ago = `${diff} secs ago`;
    else if (diff < 3600) ago = `${Math.floor(diff / 60)} mins ago`;
    else if (diff < 86400) ago = `${Math.floor(diff / 3600)} hours ago`;
    else ago = `${Math.floor(diff / 86400)} days ago`;

    return {
      full: date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      ago
    };
  };
  export { formatTimestamp };

function formatMethod(method) {
  if (!method) return 'Transfer';
  const parts = method.replace(/^\//, '').split('.');
  const raw = parts[parts.length - 1] || method;
  const cleaned = raw.replace(/^Msg/, '');
  return cleaned.replace(/([A-Z])/g, ' $1').trim();
}
export { formatMethod };

const METHOD_COLOR = '#006666';
const DEFAULT_COLOR = '#808080';

function getMethodColor(method) {
  const m = (method || '').toLowerCase();
  
  const knownMethods = [
    'execute',
    'send',
    'transfer',
    'store',
    'delegate',
    'staking',
    'vote',
    'proposal',
    'withdraw',
    'instantiate'
  ];
  
  const isKnown = knownMethods.some(key => m.includes(key));
  
  return isKnown ? METHOD_COLOR : DEFAULT_COLOR;
}

export { getMethodColor };

function formatAmount(amount) {
  if (!amount) return '0';
  return (parseFloat(amount) / 1000000).toFixed(6);
}
export { formatAmount };

function parseFee(fee) {
  if (!fee) return '0.000000';
  const num = parseFloat(fee);
  if (isNaN(num)) return '0.000000';
  return (num / 1000000).toFixed(6);
}
export { parseFee };


const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const now = new Date();
  const updated = new Date(timestamp);
  const seconds = Math.floor((now - updated) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    min: 60,
    sec: 1, // ← ADDED
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};
export { getTimeAgo };


const formatJMC = (val) => {
  if (!val) return "0.00";

  const num = Number(String(val).replace("uJMC", ""));
  if (isNaN(num)) return "0.00";

  return (num / 1_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};
export { formatJMC };