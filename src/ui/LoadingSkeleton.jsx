const LoadingSkeleton = ({ isDark }) => (
  <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-[#f5f7f9]"} animate-pulse`}>
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-6">
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className={`h-10 w-2/3 rounded mx-auto mb-6 ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
        <div className={`h-12 w-full rounded-full ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`rounded-xl border p-4 h-20 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className={`rounded-xl border h-80 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`} />
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`rounded-xl border p-4 h-16 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`} />
        ))}
      </div>
    </div>
  </div>
);
export default LoadingSkeleton;