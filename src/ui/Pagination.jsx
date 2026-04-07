// // src/components/ui/Pagination.jsx
// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// const Pagination = ({
//   currentPage,
//   totalPages,
//   totalItems,
//   perPage,
//   onPageChange,
//   isDark = false,
// }) => {
//   const startItem = (currentPage - 1) * perPage + 1;
//   const endItem = Math.min(currentPage * perPage, totalItems);

//   const getPageNumbers = () => {
//     const pages = [];
//     const showPages = 5; // Number of page buttons to show

//     if (totalPages <= showPages) {
//       // Show all pages if total is less than showPages
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       // Always show first page
//       pages.push(1);

//       let start = Math.max(2, currentPage - 1);
//       let end = Math.min(totalPages - 1, currentPage + 1);

//       // Adjust if near start
//       if (currentPage <= 3) {
//         end = 4;
//       }

//       // Adjust if near end
//       if (currentPage >= totalPages - 2) {
//         start = totalPages - 3;
//       }

//       // Add ellipsis after first page if needed
//       if (start > 2) {
//         pages.push("...");
//       }

//       // Add middle pages
//       for (let i = start; i <= end; i++) {
//         pages.push(i);
//       }

//       // Add ellipsis before last page if needed
//       if (end < totalPages - 1) {
//         pages.push("...");
//       }

//       // Always show last page
//       pages.push(totalPages);
//     }

//     return pages;
//   };

//   const pageNumbers = getPageNumbers();

//   return (
//     <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">


//       {/* Pagination Buttons */}
//       <div className="flex items-center gap-1 sm:gap-2">
//         {/* First Page */}
//         <button
//           onClick={() => onPageChange(1)}
//           disabled={currentPage === 1}
//           className={`
//             p-2 rounded-lg transition-all
//             ${currentPage === 1
//               ? "opacity-50 cursor-not-allowed"
//               : isDark
//                 ? "hover:bg-gray-700 text-gray-400 hover:text-white"
//                 : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
//             }
//           `}
//           title="First Page"
//         >
//           <ChevronsLeft className="w-4 h-4" />
//         </button>

//         {/* Previous Page */}
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className={`
//             p-2 rounded-lg transition-all
//             ${currentPage === 1
//               ? "opacity-50 cursor-not-allowed"
//               : isDark
//                 ? "hover:bg-gray-700 text-gray-400 hover:text-white"
//                 : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
//             }
//           `}
//           title="Previous Page"
//         >
//           <ChevronLeft className="w-4 h-4" />
//         </button>

//         {/* Page Numbers */}
//         <div className="hidden sm:flex items-center gap-1">
//           {pageNumbers.map((page, idx) =>
//             page === "..." ? (
//               <span
//                 key={`ellipsis-${idx}`}
//                 className={`px-3 py-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
//               >
//                 ...
//               </span>
//             ) : (
//               <button
//                 key={page}
//                 onClick={() => onPageChange(page)}
//                 className={`
//                   px-3 py-1.5 rounded-lg text-sm font-medium transition-all
//                   ${page === currentPage
//                     ? "bg-[#00b2bd] text-white shadow-sm"
//                     : isDark
//                       ? "text-gray-400 hover:bg-gray-700 hover:text-white"
//                       : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                   }
//                 `}
//               >
//                 {page}
//               </button>
//             )
//           )}
//         </div>

//         {/* Mobile: Current Page Indicator */}
//         <div className="sm:hidden">
//           <span className={`px-3 py-1.5 text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
//             {currentPage} / {totalPages}
//           </span>
//         </div>

//         {/* Next Page */}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className={`
//             p-2 rounded-lg transition-all
//             ${currentPage === totalPages
//               ? "opacity-50 cursor-not-allowed"
//               : isDark
//                 ? "hover:bg-gray-700 text-gray-400 hover:text-white"
//                 : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
//             }
//           `}
//           title="Next Page"
//         >
//           <ChevronRight className="w-4 h-4" />
//         </button>

//         {/* Last Page */}
//         <button
//           onClick={() => onPageChange(totalPages)}
//           disabled={currentPage === totalPages}
//           className={`
//             p-2 rounded-lg transition-all
//             ${currentPage === totalPages
//               ? "opacity-50 cursor-not-allowed"
//               : isDark
//                 ? "hover:bg-gray-700 text-gray-400 hover:text-white"
//                 : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
//             }
//           `}
//           title="Last Page"
//         >
//           <ChevronsRight className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Pagination;



// src/ui/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isDark = false,
  isLoading = false,
  showFirstLast = true,
  showInfo = true,
}) => {
  // Calculate page numbers to display
  const getPageNumbers = () => {
    const delta = 2;
    const pages = [];

    if (totalPages <= 7) {
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

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

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
    <div className={`mt-6 rounded-md border p-4 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Info text */}
      
        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          {/* First page */}
          {showFirstLast && (
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1 || isLoading}
              className={`p-2 ${buttonClass(currentPage === 1 || isLoading)}`}
              title="First page"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
          )}

          {/* Previous */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
            className={`p-2 ${buttonClass(currentPage === 1 || isLoading)}`}
            title="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page numbers */}
          <div className="flex gap-1">
            {getPageNumbers().map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className={`w-8 h-8 flex items-center justify-center text-sm ${
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
                  className={`min-w-[32px] h-8 px-2 text-sm font-semibold ${
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
            className={`p-2 ${buttonClass(currentPage === totalPages || isLoading)}`}
            title="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Last page */}
          {showFirstLast && (
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages || isLoading}
              className={`p-2 ${buttonClass(currentPage === totalPages || isLoading)}`}
              title="Last page"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;