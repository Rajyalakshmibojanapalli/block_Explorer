// src/components/ui/Pagination.jsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  isDark = false,
}) => {
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages if total is less than showPages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if near start
      if (currentPage <= 3) {
        end = 4;
      }

      // Adjust if near end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">


      {/* Pagination Buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg transition-all
            ${currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }
          `}
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg transition-all
            ${currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }
          `}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className={`px-3 py-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${page === currentPage
                    ? "bg-[#00b2bd] text-white shadow-sm"
                    : isDark
                      ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Mobile: Current Page Indicator */}
        <div className="sm:hidden">
          <span className={`px-3 py-1.5 text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
            {currentPage} / {totalPages}
          </span>
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg transition-all
            ${currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }
          `}
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg transition-all
            ${currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }
          `}
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;