const FeatureCard = ({ icon, title, description, href, isDark }) => (
  <a
    href={href}
    className={`rounded-lg border p-4 flex items-center gap-3 transition-all hover:shadow-md group ${isDark ? "bg-gray-800 border-gray-700 hover:border-[#00b2bd]/40" : "bg-white border-gray-200 hover:border-[#00b2bd]/40"
      }`}
  >
    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-[#00b2bd]/10" : "bg-[#00b2bd]/10"
      }`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{title}</p>
      <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>{description}</p>
    </div>
  </a>
);
export default FeatureCard;