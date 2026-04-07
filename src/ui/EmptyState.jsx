import React from "react";
import { Shield } from "lucide-react";
const EmptyState = ({ isDark, searchMoniker }) => (
  <div className={`rounded-md border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
    <Shield className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
      {searchMoniker ? `No validators match "${searchMoniker}"` : 'No validators found'}
    </p>
    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
      {searchMoniker 
        ? 'Try adjusting your search term'
        : 'No validators are currently registered on the network.'
      }
    </p>
  </div>
);  
export default EmptyState;