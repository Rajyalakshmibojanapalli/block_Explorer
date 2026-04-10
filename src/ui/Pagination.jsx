
// import React from 'react';
// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// const Pagination = ({
//   currentPage,
//   totalPages,
//   totalItems,
//   itemsPerPage, // Accept itemsPerPage
//   perPage, // Also accept perPage for backward compatibility
//   onPageChange,
//   isDark = false,
//   isLoading = false,
//   showFirstLast = true,
//   showInfo = true,
// }) => {
//   // ✅ Use whichever prop is provided
//   const itemsPer = itemsPerPage || perPage || 10;

//   const getPageNumbers = () => {
//     const delta = 2;
//     const pages = [];

//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       pages.push(1);

//       const startPage = Math.max(2, currentPage - delta);
//       const endPage = Math.min(totalPages - 1, currentPage + delta);

//       if (startPage > 2) {
//         pages.push('...');
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }

//       if (endPage < totalPages - 1) {
//         pages.push('...');
//       }

//       pages.push(totalPages);
//     }

//     return pages;
//   };

//   const handleFirstPage = () => onPageChange(1);
//   const handlePrevPage = () => onPageChange(currentPage - 1);
//   const handleNextPage = () => onPageChange(currentPage + 1);
//   const handleLastPage = () => onPageChange(totalPages);
//   const handlePageClick = (page) => onPageChange(page);

//   const startItem = (currentPage - 1) * itemsPer + 1;
//   const endItem = Math.min(currentPage * itemsPer, totalItems);

//   const buttonClass = (disabled, active = false) => {
//     const base = 'transition-colors rounded-md';
    
//     if (disabled) {
//       return `${base} ${
//         isDark 
//           ? 'bg-gray-700 text-gray-600 cursor-not-allowed' 
//           : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//       }`;
//     }
    
//     if (active) {
//       return `${base} bg-[#00b2bd] text-white`;
//     }
    
//     return `${base} ${
//       isDark 
//         ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
//         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//     }`;
//   };

//   return (
//     <div className={`mt-6 rounded-md border p-4 ${
//       isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//     }`}>
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//         {/* Info text */}
       

//         {/* Pagination controls */}
//         <div className="flex items-center gap-2">
//           {/* First page */}
//           {showFirstLast && (
//             <button
//               onClick={handleFirstPage}
//               disabled={currentPage === 1 || isLoading}
//               className={`p-2 ${buttonClass(currentPage === 1 || isLoading)}`}
//               title="First page"
//             >
//               <ChevronsLeft className="w-5 h-5" />
//             </button>
//           )}

//           {/* Previous */}
//           <button
//             onClick={handlePrevPage}
//             disabled={currentPage === 1 || isLoading}
//             className={`p-2 ${buttonClass(currentPage === 1 || isLoading)}`}
//             title="Previous page"
//           >
//             <ChevronLeft className="w-5 h-5" />
//           </button>

//           {/* Page numbers */}
//           <div className="flex gap-1">
//             {getPageNumbers().map((pageNum, index) => {
//               if (pageNum === '...') {
//                 return (
//                   <span
//                     key={`ellipsis-${index}`}
//                     className={`w-8 h-8 flex items-center justify-center text-sm ${
//                       isDark ? 'text-gray-500' : 'text-gray-400'
//                     }`}
//                   >
//                     ...
//                   </span>
//                 );
//               }

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageClick(pageNum)}
//                   disabled={isLoading}
//                   className={`min-w-[32px] h-8 px-2 text-sm font-semibold ${
//                     buttonClass(isLoading, pageNum === currentPage)
//                   } ${isLoading ? 'opacity-50' : ''}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Next */}
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages || isLoading}
//             className={`p-2 ${buttonClass(currentPage === totalPages || isLoading)}`}
//             title="Next page"
//           >
//             <ChevronRight className="w-5 h-5" />
//           </button>

//           {/* Last page */}
//           {showFirstLast && (
//             <button
//               onClick={handleLastPage}
//               disabled={currentPage === totalPages || isLoading}
//               className={`p-2 ${buttonClass(currentPage === totalPages || isLoading)}`}
//               title="Last page"
//             >
//               <ChevronsRight className="w-5 h-5" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Pagination;



import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  perPage,
  onPageChange,
  isDark = false,
  isLoading = false,
  showFirstLast = true,
  showInfo = true,
}) => {
  const itemsPer = itemsPerPage || perPage || 10;

  const getPageNumbers = () => {
    const delta = window.innerWidth < 640 ? 1 : 2; // Less pages on mobile
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const startPage = Math.max(2, currentPage - delta);
      const endPage = Math.min(totalPages - 1, currentPage + delta);

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(currentPage - 1);
  const handleNextPage = () => onPageChange(currentPage + 1);
  const handleLastPage = () => onPageChange(totalPages);
  const handlePageClick = (page) => onPageChange(page);

  const startItem = (currentPage - 1) * itemsPer + 1;
  const endItem = Math.min(currentPage * itemsPer, totalItems);

  const buttonClass = (disabled, active = false) => {
    const base = 'transition-colors rounded-md';
    
    if (disabled) {
      return `${base} ${
        isDark 
          ? 'bg-gray-700 text-gray-600 cursor-not-allowed' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`;
    }
    
    if (active) {
      return `${base} bg-[#00b2bd] text-white`;
    }
    
    return `${base} ${
      isDark 
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  return (
    <div className={`mt-4 sm:mt-6 rounded-md border p-3 sm:p-4 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        {/* Info text - Mobile: Above, Desktop: Keep if needed */}
       
        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
          {/* First page - Hidden on mobile */}
          {showFirstLast && (
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1 || isLoading}
              className={`hidden sm:flex p-1.5 sm:p-2 ${buttonClass(currentPage === 1 || isLoading)}`}
              title="First page"
            >
              <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Previous */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
            className={`p-1.5 sm:p-2 ${buttonClass(currentPage === 1 || isLoading)}`}
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Page numbers */}
          <div className="flex gap-0.5 sm:gap-1">
            {getPageNumbers().map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  disabled={isLoading}
                  className={`min-w-[24px] sm:min-w-[32px] h-6 sm:h-8 px-1.5 sm:px-2 text-xs sm:text-sm font-semibold ${
                    buttonClass(isLoading, pageNum === currentPage)
                  } ${isLoading ? 'opacity-50' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || isLoading}
            className={`p-1.5 sm:p-2 ${buttonClass(currentPage === totalPages || isLoading)}`}
            title="Next page"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Last page - Hidden on mobile */}
          {showFirstLast && (
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages || isLoading}
              className={`hidden sm:flex p-1.5 sm:p-2 ${buttonClass(currentPage === totalPages || isLoading)}`}
              title="Last page"
            >
              <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;