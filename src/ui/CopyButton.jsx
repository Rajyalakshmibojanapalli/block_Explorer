import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
const CopyBtn = ({ text, isDark, size = 'sm' }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied
        ? <Check className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} style={{ color: '#00b2bd' }} />
        : <Copy className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      }
    </button>
  );
};
export default CopyBtn;