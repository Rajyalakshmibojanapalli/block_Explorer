// src/components/Footer.jsx
import { useNavigate } from "react-router-dom";
import { Computer, Bird , MessageCircle, Globe, Heart, ChevronRight, ArrowUpRight, Mail } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Explorer",
      links: [
        { label: "Blocks", path: "/blocks" },
        { label: "Transactions", path: "/transactions" },
        { label: "Validators", path: "/validators/leaderboard" },
        { label: "Proposals", path: "/governance" },
      ],
    },
    {
      title: "NFTs",
      links: [
        { label: "Top NFTs", path: "/nft/top" },
        { label: "Top Mints", path: "/nft/top-mints" },
        { label: "Latest Trades", path: "/nft/trades" },
        { label: "Latest Mints", path: "/nft/latest-mints" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "API Docs", path: "#", external: true },
        { label: "Status Page", path: "#", external: true },
        { label: "Terms of Service", path: "/terms" },
        { label: "Privacy Policy", path: "/privacy" },
      ],
    },
  ];

  const socials = [
    { icon: Computer, href: "https://Computer.com", label: "Computer" },
    { icon: Bird , href: "https://Bird .com", label: "Bird " },
    { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
    { icon: Globe, href: "#", label: "Website" },
  ];

  return (
    <footer className={`${isDark ? "bg-white-900 border-t border-white-800" : "bg-[#006666] border-t border-white-100"}`}>



      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 sm:py-12">
        <div className="grid  sm:grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="">
            <div className="flex items-center gap-2.5 mb-4">
             
              <div>
                <span className={`font-bold text-lg leading-none ${isDark ? "text-white" : "text-white"}`}>
                  JMC-24 Scan
                </span>
                <span className="block text-[10px] text-white font-medium tracking-widest uppercase">
                  Explorer
                </span>
              </div>
            </div>
            <p className={`text-sm leading-relaxed max-w-xs mb-6 ${isDark ? "text-white-500" : "text-white"}`}>
              A comprehensive blockchain explorer providing real-time data, transaction tracking, and network analytics.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isDark
                      ? "bg-white/5 text-white hover:bg-[#00b2bd]/10 hover:text-[#00b2bd]"
                      : "bg-white-100 text-white hover:bg-[#00b2bd]/10 hover:text-[#00b2bd]"
                  }`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-white"}`}>
                <span className="w-1 h-4 bg-[#00b2bd] rounded-full" />
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => link.external ? window.open(link.path, "_blank") : navigate(link.path)}
                      className={`group flex items-center gap-1 text-sm transition-colors hover:text-[#00b2bd] ${
                        isDark ? "text-white" : "text-white"
                      }`}
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.label}
                      {link.external && <ArrowUpRight className="w-3 h-3 opacity-50" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>



      {/* Bottom Bar */}
      <div className={`border-t ${isDark ? "border-white-800" : "border-white-100"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className={`text-xs ${isDark ? "text-white-500" : "text-white-400"}`}>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;