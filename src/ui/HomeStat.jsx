
// import React from 'react';

// const StatCard = ({ 
//   title, 
//   value, 
//   badge, 
//   icon:Icon,
//   isDark,
//   className = "" 
// }) => {
//   // Check if icon is a React element or a component
//   const IconElement = React.isValidElement(Icon) ? Icon : Icon ? <Icon className="w-4 h-4" /> : null;

//   return (
//     <div 
//       className={`
//         rounded-lg border p-4 transition-all duration-200
//         ${isDark 
//           ? "bg-gray-800 border-gray-700 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30" 
//           : "bg-white border-gray-200 shadow-md shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/50"
//         }
//         ${className}
//       `}
//     >
//       {/* Top Row: Icon and Badge */}
//       <div className="flex items-start justify-between mb-3">
//         {/* Icon */}
//         {IconElement && (
//           <div className={`
//             w-8 h-8 rounded-lg flex items-center justify-center font-semibold
//             ${isDark ? "bg-[#e4fcfc]" : "bg-[#e4fcfc]"}
//           `}>
//             {React.cloneElement(IconElement, {
//               className: `w-5 h-5 ${isDark ? "text-[#006666]" : "text-[#006666]"}`
//             })}
//           </div>
//         )}
        
//         {/* Badge */}
//         {badge && (
//           <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ccf0f2] text-[#006666]">
//             {badge}
//           </span>
//         )}
//       </div>

//       {/* Title */}
//       <p className={`text-xs font-medium  mb-1 ${isDark ? "text-gray-600" : "text-gray-600"}`}>
//         {title}
//       </p>
      
//       {/* Value */}
//       <h3 className={`text-xl font-bold head truncate ${isDark ? "text-white" : "text-gray-900"}`}>
//         {value}
//       </h3>
//     </div>
//   );
// };

// export default StatCard;


// import React from 'react';

// const StatCard = ({ 
//   title, 
//   value, 
//   badge, 
//   icon: Icon,
//   subtitle,
//   isDark,
//   className = "" 
// }) => {
//   const IconElement = React.isValidElement(Icon) ? Icon : Icon ? <Icon className="w-4 h-4" /> : null;

//   return (
//     <div 
//       className={`
//         rounded-lg border p-4 transition-all duration-200
//         ${isDark 
//           ? "bg-gray-800 border-gray-700 shadow-2xl shadow-black/50 hover:shadow-2xl hover:shadow-black/30" 
//           : "bg-white border-gray-200 shadow-md shadow-gray-300/50 hover:shadow-xl hover:shadow-gray-300/50"
//         }
//         ${className}
//       `}
//     >
//       {/* Top Row: Icon and Badge */}
//       <div className="flex items-start justify-between mb-3">
//         {IconElement && (
//           <div className={`
//             w-8 h-8 rounded-lg flex items-center justify-center font-semibold
//             ${isDark ? "bg-[#e4fcfc]" : "bg-[#e4fcfc]"}
//           `}>
//             {React.cloneElement(IconElement, {
//               className: `w-5 h-5 ${isDark ? "text-[#006666]" : "text-[#006666]"}`
//             })}
//           </div>
//         )}
        
//         {badge && (
//           <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ccf0f2] text-[#006666]">
//             {badge}
//           </span>
//         )}
//       </div>

//       {/* Title */}
//       <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-600" : "text-gray-600"}`}>
//         {title}
//       </p>
      
//       {/* Value + Subtitle (side by side) */}
//       <div className="flex items-baseline gap-2">
//         <h3 className={`text-xl font-bold head truncate ${isDark ? "text-white" : "text-gray-900"}`}>
//           {value}
//         </h3>
//         {subtitle && (
//           <span className={`text-[11px] font-Regular ${isDark ? "text-gray-500" : "text-black/100"}`}>
//             {subtitle}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StatCard;


// import React from 'react';
// import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// const StatCard = ({ 
//   title, 
//   value, 
//   badge, 
//   icon: Icon,
//   subtitle,
//   trend, // { value: "+12.5%", direction: "up", label: "vs last month" }
//   isDark,
//   onClick,
//   className = "" 
// }) => {
//   const IconElement = React.isValidElement(Icon) ? Icon : Icon ? <Icon className="w-4 h-4" /> : null;

//   // Determine trend styling
//   const getTrendConfig = () => {
//     if (!trend) return null;
    
//     const direction = trend.direction || 'neutral';
    
//     const configs = {
//       up: {
//         icon: TrendingUp,
//         color: isDark ? 'text-green-400 bg-green-500/10' : 'text-green-600 ',
//         textColor: isDark ? 'text-green-400' : 'text-green-600'
//       },
//       down: {
//         icon: TrendingDown,
//         color: isDark ? 'text-red-400 bg-red-500/10' : 'text-red-600 bg-red-50',
//         textColor: isDark ? 'text-red-400' : 'text-red-600'
//       },
//       neutral: {
//         icon: Minus,
//         color: isDark ? 'text-gray-400 bg-gray-500/10' : 'text-gray-600 bg-gray-100',
//         textColor: isDark ? 'text-gray-400' : 'text-gray-600'
//       }
//     };
    
//     return configs[direction];
//   };

//   const trendConfig = getTrendConfig();
//   const TrendIcon = trendConfig?.icon;

//   return (
//     <div 
//       onClick={onClick}
//       className={`
//         rounded-lg border p-4 transition-all duration-200
//         ${isDark 
//           ? "bg-gray-800 border-gray-700 shadow-2xl shadow-black/50 hover:shadow-2xl hover:shadow-black/30" 
//           : "bg-white border-gray-200 shadow-md shadow-gray-300/50 hover:shadow-xl hover:shadow-gray-300/50"
//         }
//         ${className}
//       `}
//     >
//       {/* Top Row: Icon and Badge */}
//       <div className="flex items-start justify-between mb-3">
//         {IconElement && (
//           <div className={`
//             w-8 h-8 rounded-lg flex items-center justify-center font-semibold
//             ${isDark ? "bg-[#e4fcfc]" : "bg-[#e4fcfc]"}
//           `}>
//             {React.cloneElement(IconElement, {
//               className: `w-5 h-5 ${isDark ? "text-[#006666]" : "text-[#006666]"}`
//             })}
//           </div>
//         )}
        
//         {badge && (
//           <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ccf0f2] text-[#006666]">
//             {badge}
//           </span>
//         )}
//       </div>

//       {/* Title */}
//       <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-600" : "text-gray-600"}`}>
//         {title}
//       </p>
      
//       {/* Value + Subtitle (side by side) */}
//       <div className="flex items-baseline gap-2 mb-2">
//         <h3 className={`text-xl font-bold head truncate ${isDark ? "text-white" : "text-gray-900"}`}>
//           {value}
//         </h3>
//         {subtitle && (
//           <span className={`text-[11px] font-Regular ${isDark ? "text-gray-500" : "text-black/100"}`}>
//             {subtitle}
//           </span>
//         )}
//       </div>

//       {/* Trending Section */}
//       {trend && trendConfig && (
//         <div className="flex items-center gap-2">
//           <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md `}>
//             {/* <TrendIcon className="w-3 h-3" /> */}
//             <span className={`text-[10px] font-semibold text-gray-500 `}>
//               {trend.value}
//             </span>
//           </div>
//           {trend.label && (
//             <span className={`text-[5px] head ${isDark ? "text-gray-500" : "text-gray-300"}`}>
//               {trend.label}
//             </span>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StatCard;


// src/ui/HomeStat.jsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  badge, 
  icon: Icon,
  subtitle,
  trend, 
  isDark,
  onClick,
  className = "" 
}) => {
  const IconElement = React.isValidElement(Icon) ? Icon : Icon ? <Icon className="w-4 h-4" /> : null;

  const getTrendConfig = () => {
    if (!trend) return null;
    
    const direction = trend.direction || 'neutral';
    
    const configs = {
      up: {
        icon: TrendingUp,
        color: isDark ? 'text-green-400 bg-green-500/10' : 'text-green-600',
        textColor: isDark ? 'text-green-400' : 'text-green-600'
      },
      down: {
        icon: TrendingDown,
        color: isDark ? 'text-red-400 bg-red-500/10' : 'text-red-600 bg-red-50',
        textColor: isDark ? 'text-red-400' : 'text-red-600'
      },
      neutral: {
        icon: Minus,
        color: isDark ? 'text-gray-400 bg-gray-500/10' : 'text-gray-600 bg-gray-100',
        textColor: isDark ? 'text-gray-400' : 'text-gray-600'
      }
    };
    
    return configs[direction];
  };

  const trendConfig = getTrendConfig();
  const TrendIcon = trendConfig?.icon;

  return (
    <div 
      onClick={onClick}
      className={`
        rounded-lg border p-4 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''} 
        ${isDark 
          ? "bg-gray-800 border-gray-700 shadow-2xl shadow-black/50 hover:shadow-2xl hover:shadow-black/30 hover:border-[#00b2bd]/50" 
          : "bg-white border-gray-200 shadow-md shadow-gray-300/50 hover:shadow-xl hover:shadow-gray-300/50 hover:border-[#00b2bd]/30"
        }
        ${className}
      `}
    >
      {/* Top Row: Icon and Badge */}
      <div className="flex items-start justify-between mb-3">
        {IconElement && (
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center font-semibold
            ${isDark ? "bg-[#e4fcfc]" : "bg-[#e4fcfc]"}
          `}>
            {React.cloneElement(IconElement, {
              className: `w-5 h-5 ${isDark ? "text-[#006666]" : "text-[#006666]"}`
            })}
          </div>
        )}
        
        {badge && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ccf0f2] text-[#006666]">
            {badge}
          </span>
        )}
      </div>

      {/* Title */}
      <p className={`text-xs font-medium mb-1 ${isDark ? "text-gray-600" : "text-gray-600"}`}>
        {title}
      </p>
      
      {/* Value + Subtitle (side by side) */}
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className={`text-xl font-bold head truncate ${isDark ? "text-white" : "text-gray-900"}`}>
          {value}
        </h3>
        {subtitle && (
          <span className={`text-[11px] font-Regular ${isDark ? "text-gray-500" : "text-black/100"}`}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Trending Section */}
      {trend && trendConfig && (
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md`}>
            <span className={`text-[10px] font-semibold text-gray-500`}>
              {trend.value}
            </span>
          </div>
          {trend.label && (
            <span className={`text-[10px] head ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;