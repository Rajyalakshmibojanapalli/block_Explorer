const ErrorState = ({ onRetry, isDark }) => (
  <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-[#f5f7f9]"}`}>
    <div className="text-center space-y-4 px-4">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isDark ? "bg-red-900/20" : "bg-red-50"}`}>
        <svg className={`w-8 h-8 ${isDark ? "text-red-400" : "text-red-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Failed to load data</h2>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Something went wrong. Please try again.</p>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 bg-[#00b2bd] text-white rounded-lg text-sm font-medium hover:bg-[#009da7] transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);
export default ErrorState;