// import { useState, useRef, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   ChevronDown,
//   Menu,
//   X,
//   Search,
//   Sun,
//   Moon,
//   Blocks,
//   Users,
//   Vote,
//   Image,
//   Layers,
//   Award,
//   TrendingUp,
//   Repeat,
//   Send,
//   Sparkles,
// } from "lucide-react";
// import { useTheme } from "../context/ThemeContext";
// import { useLazySearchQuery } from "../pages/Home/homeApiSlice";
// import WalletConnect from "../pages/socket/WalletConnect";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { theme, toggleTheme } = useTheme();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileDropdown, setMobileDropdown] = useState(null);
//   const [hoveredDropdown, setHoveredDropdown] = useState(null);
//   const [scrolled, setScrolled] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navRef = useRef(null);
//   const hoverTimeoutRef = useRef(null);
//   const isDark = theme === "dark";

//   const [triggerSearch, { isLoading: isSearching }] = useLazySearchQuery();

//   useEffect(() => {
//     const handler = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handler);
//     return () => window.removeEventListener("scroll", handler);
//   }, []);

//   useEffect(() => {
//     setMobileOpen(false);
//     setMobileDropdown(null);
//     setHoveredDropdown(null);
//   }, [location.pathname]);

//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [mobileOpen]);

//   const isActive = (path) =>
//     path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

//   const go = (path) => {
//     navigate(path);
//     setMobileOpen(false);
//     setMobileDropdown(null);
//     setHoveredDropdown(null);
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;

//     try {
//       const result = await triggerSearch({ q: searchQuery.trim(), limit: 1 }).unwrap();

//       if (result?.results && result.results.length > 0) {
//         const firstResult = result.results[0];
//         const { type } = result;

//         if (type.is_a_user_address || type.is_a_contract_address) {
//           navigate(`/address/${firstResult.value}`);
//         } else if (type.is_a_transaction_hash) {
//           navigate(`/transactions/${firstResult.value}`);
//         } else if (type.is_a_block_number) {
//           navigate(`/blocks/${firstResult.value}`);
//         } else {
//           navigate(`/address/${firstResult.value}`);
//         }
//       } else {
//         console.log("No results found");
//         navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       }

//       setSearchQuery("");
//     } catch (err) {
//       console.error("Search failed:", err);
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//     }
//   };

//   const handleMouseEnter = (key) => {
//     if (hoverTimeoutRef.current) {
//       clearTimeout(hoverTimeoutRef.current);
//     }
//     setHoveredDropdown(key);
//   };

//   const handleMouseLeave = () => {
//     hoverTimeoutRef.current = setTimeout(() => {
//       setHoveredDropdown(null);
//     }, 150);
//   };

//   const navItems = [
//     { type: "link", label: "Home", path: "/" },
//     {
//       type: "dropdown",
//       key: "blockchain",
//       label: "Blockchain",
//       activePath: "/blocks",
//       items: [
//         { label: "View Blocks", desc: "Explore all blocks", icon: Blocks, path: "/blocks" },
//         { label: "Latest Block", desc: "Most recent block", icon: Layers, path: "/blocks/latest" },
//       ],
//     },
//     {
//       type: "dropdown",
//       key: "validators",
//       label: "Validators",
//       activePath: "/validators",
//       items: [
//         { label: "Leaderboard", desc: "Top validators", icon: Award, path: "/validators/leaderboard" },
//         { label: "Set Info", desc: "Validator details", icon: Users, path: "/validators/set-info" },
//       ],
//     },
//     { type: "link", label: "Transactions", path: "/transactions" },
//     {
//       type: "dropdown",
//       key: "nft",
//       label: "NFTs",
//       activePath: "/nft",
//       items: [
//         { label: "Top NFTs", desc: "Popular collections", icon: TrendingUp, path: "/nft/top" },
//         { label: "Top Mints", desc: "Trending mints", icon: Sparkles, path: "/nft/top-mints" },
//         { label: "Latest Trades", desc: "Recent trades", icon: Repeat, path: "/nft/trades" },
//         { label: "Latest Transfers", desc: "Recent transfers", icon: Send, path: "/nft/transfers" },
//         { label: "Latest Mints", desc: "New mints", icon: Image, path: "/nft/latest-mints" },
//       ],
//     },
//     { type: "link", label: "Proposals", path: "/governance", icon: Vote },
//   ];

//   return (
//     <header
//       ref={navRef}
//       style={{
//         position: "sticky",
//         top: 0,
//         zIndex: 50,
//         backgroundColor: isDark ? "#111827" : "#ffffff",
//         borderBottom: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
//         boxShadow: scrolled
//           ? isDark
//             ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
//             : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
//           : "none",
//         transition: "all 0.3s ease",
//       }}
//     >
//       {/* Top Accent Line */}
//       <div
//         style={{
//           height: "3px",
//           background: "linear-gradient(90deg, #00b2bd 0%, #00d4e0 50%, #00b2bd 100%)",
//         }}
//       />

//       <div 
//         className="navbar-container"
//         style={{ 
//           maxWidth: "100%",
//           margin: "0 auto", 
//           padding: "0 12px",
//           width: "100%",
//         }}
//       >
//         <div 
//           className="navbar-content"
//           style={{ 
//             display: "flex", 
//             alignItems: "center", 
//             height: "64px", 
//             gap: "8px",
//             justifyContent: "space-between",
//             width: "100%",
//           }}
//         >

//           {/* Logo */}
//           <button
//             onClick={() => go("/")}
//             className="logo-button"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               padding: 0,
//               flexShrink: 0,
//             }}
//           >
//             <div
//               style={{
//                 width: "36px",
//                 height: "36px",
//                 backgroundColor: "#00b2bd",
//                 borderRadius: "8px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 transform: "rotate(45deg)",
//               }}
//             >
//               <span
//                 style={{
//                   color: "white",
//                   fontWeight: "bold",
//                   fontSize: "14px",
//                   transform: "rotate(-45deg)",
//                 }}
//               >
//                 JMC
//               </span>
//             </div>
//             <div className="logo-text">
//               <div
//                 style={{
//                   fontWeight: "bold",
//                   fontSize: "18px",
//                   color: isDark ? "#ffffff" : "#111827",
//                   lineHeight: 1,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 JMC-24 Scan
//               </div>
//               <div
//                 style={{
//                   fontSize: "10px",
//                   color: "#00b2bd",
//                   fontWeight: "500",
//                   letterSpacing: "1px",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 Explorer
//               </div>
//             </div>
//           </button>

//           {/* Desktop Navigation */}
//           <nav 
//             className="desktop-nav" 
//             style={{ 
//               display: "flex", 
//               alignItems: "center", 
//               gap: "2px", 
//               flex: "0 1 auto",
//               minWidth: 0,
//             }}
//           >
//             {navItems.map((item) =>
//               item.type === "link" ? (
//                 <button
//                   key={item.path}
//                   onClick={() => go(item.path)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "6px",
//                     padding: "8px 12px",
//                     borderRadius: "8px",
//                     fontSize: "14px",
//                     fontWeight: "500",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: isActive(item.path) ? "#00b2bd" : isDark ? "#9ca3af" : "#6b7280",
//                     transition: "all 0.2s ease",
//                     position: "relative",
//                     whiteSpace: "nowrap",
//                     flexShrink: 0,
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isActive(item.path)) {
//                       e.currentTarget.style.color = isDark ? "#ffffff" : "#111827";
//                       e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "#f5f7f9";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isActive(item.path)) {
//                       e.currentTarget.style.color = isDark ? "#9ca3af" : "#6b7280";
//                       e.currentTarget.style.backgroundColor = "transparent";
//                     }
//                   }}
//                 >
//                   {item.icon && <item.icon size={14} />}
//                   {item.label}
//                   {isActive(item.path) && (
//                     <span
//                       style={{
//                         position: "absolute",
//                         bottom: 0,
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         width: "20px",
//                         height: "2px",
//                         backgroundColor: "#00b2bd",
//                         borderRadius: "2px",
//                       }}
//                     />
//                   )}
//                 </button>
//               ) : (
//                 <div
//                   key={item.key}
//                   style={{ position: "relative", flexShrink: 0 }}
//                   onMouseEnter={() => handleMouseEnter(item.key)}
//                   onMouseLeave={handleMouseLeave}
//                 >
//                   <button
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "4px",
//                       padding: "8px 12px",
//                       borderRadius: "8px",
//                       fontSize: "14px",
//                       fontWeight: "500",
//                       background: hoveredDropdown === item.key ? (isDark ? "rgba(255,255,255,0.05)" : "#f5f7f9") : "none",
//                       border: "none",
//                       cursor: "pointer",
//                       color: isActive(item.activePath) || hoveredDropdown === item.key
//                         ? "#00b2bd"
//                         : isDark ? "#9ca3af" : "#6b7280",
//                       transition: "all 0.2s ease",
//                       position: "relative",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {item.label}
//                     <ChevronDown
//                       size={14}
//                       style={{
//                         transition: "transform 0.2s ease",
//                         transform: hoveredDropdown === item.key ? "rotate(180deg)" : "rotate(0deg)",
//                       }}
//                     />
//                     {isActive(item.activePath) && (
//                       <span
//                         style={{
//                           position: "absolute",
//                           bottom: 0,
//                           left: "50%",
//                           transform: "translateX(-50%)",
//                           width: "20px",
//                           height: "2px",
//                           backgroundColor: "#00b2bd",
//                           borderRadius: "2px",
//                         }}
//                       />
//                     )}
//                   </button>

//                   {/* Dropdown Menu */}
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "calc(100% + 8px)",
//                       left: 0,
//                       minWidth: "280px",
//                       backgroundColor: isDark ? "#1f2937" : "#ffffff",
//                       border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
//                       borderRadius: "12px",
//                       boxShadow: isDark
//                         ? "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
//                         : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
//                       padding: "8px",
//                       zIndex: 100,
//                       opacity: hoveredDropdown === item.key ? 1 : 0,
//                       visibility: hoveredDropdown === item.key ? "visible" : "hidden",
//                       transform: hoveredDropdown === item.key ? "translateY(0)" : "translateY(-10px)",
//                       transition: "all 0.2s ease",
//                     }}
//                   >
//                     {item.items.map((dropItem, idx) => {
//                       const Icon = dropItem.icon;
//                       return (
//                         <button
//                           key={idx}
//                           onClick={() => go(dropItem.path)}
//                           style={{
//                             display: "flex",
//                             alignItems: "flex-start",
//                             gap: "12px",
//                             width: "100%",
//                             padding: "12px",
//                             borderRadius: "8px",
//                             background: "none",
//                             border: "none",
//                             cursor: "pointer",
//                             textAlign: "left",
//                             transition: "all 0.2s ease",
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "#f5f7f9";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.backgroundColor = "transparent";
//                           }}
//                         >
//                           <div
//                             style={{
//                               width: "36px",
//                               height: "36px",
//                               borderRadius: "8px",
//                               backgroundColor: "rgba(0, 178, 189, 0.1)",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               color: "#00b2bd",
//                               flexShrink: 0,
//                             }}
//                           >
//                             <Icon size={18} />
//                           </div>
//                           <div>
//                             <div
//                               style={{
//                                 fontSize: "14px",
//                                 fontWeight: "500",
//                                 color: isDark ? "#f3f4f6" : "#111827",
//                                 marginBottom: "2px",
//                               }}
//                             >
//                               {dropItem.label}
//                             </div>
//                             <div style={{ fontSize: "12px", color: isDark ? "#9ca3af" : "#6b7280" }}>
//                               {dropItem.desc}
//                             </div>
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )
//             )}
//           </nav>

//           {/* Right Section */}
//           <div 
//             className="navbar-right"
//             style={{ 
//               display: "flex", 
//               alignItems: "center", 
//               gap: "8px",
//               flexShrink: 0,
//             }}
//           >
//             {/* Desktop Search Bar */}
//             <form 
//               onSubmit={handleSearch} 
//               className="desktop-search" 
//               style={{ position: "relative" }}
//             >
//               <Search
//                 size={16}
//                 style={{
//                   position: "absolute",
//                   left: "12px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "#9ca3af",
//                   pointerEvents: "none",
//                 }}
//               />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Address / Tx / Block..."
//                 disabled={isSearching}
//                 className="search-input"
//                 style={{
//                   width: "220px",
//                   padding: "8px 36px 8px 36px",
//                   borderRadius: "10px",
//                   border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
//                   backgroundColor: isDark ? "#1f2937" : "#f5f7f9",
//                   color: isDark ? "#ffffff" : "#111827",
//                   fontSize: "13px",
//                   outline: "none",
//                   transition: "all 0.2s ease",
//                   opacity: isSearching ? 0.6 : 1,
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "#00b2bd";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = isDark ? "#374151" : "#e5e7eb";
//                 }}
//               />
//               {searchQuery && !isSearching && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchQuery("")}
//                   style={{
//                     position: "absolute",
//                     right: "8px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     padding: "4px",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "#9ca3af",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     borderRadius: "8px",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = "transparent";
//                   }}
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//               {isSearching && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     right: "8px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                   }}
//                 >
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#00b2bd] border-t-transparent"></div>
//                 </div>
//               )}
//             </form>

//             {/* Wallet Connect - Desktop Only */}
//             <div className="desktop-wallet">
//               <WalletConnect/>
//             </div>

//             {/* Theme Toggle - Desktop */}
//             <button
//               onClick={toggleTheme}
//               className="desktop-theme-toggle"
//               style={{
//                 padding: "8px",
//                 borderRadius: "8px",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: isDark ? "#9ca3af" : "#6b7280",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 transition: "all 0.2s ease",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "#f5f7f9";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "transparent";
//               }}
//             >
//               {isDark ? <Sun size={18} /> : <Moon size={18} />}
//             </button>

//             {/* Mobile Menu Toggle */}
//             <button
//               onClick={() => setMobileOpen(!mobileOpen)}
//               className="mobile-toggle"
//               style={{
//                 display: "none",
//                 padding: "8px",
//                 borderRadius: "8px",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: isDark ? "#9ca3af" : "#6b7280",
//               }}
//             >
//               {mobileOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <>
//           <div
//             onClick={() => setMobileOpen(false)}
//             style={{
//               position: "fixed",
//               inset: 0,
//               top: "67px",
//               backgroundColor: "rgba(0, 0, 0, 0.5)",
//               zIndex: 40,
//             }}
//           />
//           <div
//             style={{
//               position: "fixed",
//               top: "67px",
//               left: 0,
//               right: 0,
//               maxHeight: "calc(100vh - 67px)",
//               overflowY: "auto",
//               backgroundColor: isDark ? "#111827" : "#ffffff",
//               borderTop: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
//               zIndex: 50,
//               padding: "16px",
//             }}
//           >
//             {/* Mobile Wallet Section */}
//             <div style={{ marginBottom: "16px" }}>
//               <WalletConnect />
//             </div>

//             {/* Mobile Search */}
//             <form onSubmit={handleSearch} style={{ position: "relative", marginBottom: "16px" }}>
//               <Search
//                 size={16}
//                 style={{
//                   position: "absolute",
//                   left: "12px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "#9ca3af",
//                 }}
//               />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search address, tx, block..."
//                 disabled={isSearching}
//                 style={{
//                   width: "100%",
//                   padding: "12px 40px 12px 40px",
//                   borderRadius: "12px",
//                   border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
//                   backgroundColor: isDark ? "#1f2937" : "#f5f7f9",
//                   color: isDark ? "#ffffff" : "#111827",
//                   fontSize: "14px",
//                   outline: "none",
//                   opacity: isSearching ? 0.6 : 1,
//                 }}
//               />
//               {isSearching && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     right: "12px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                   }}
//                 >
//                   <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#00b2bd] border-t-transparent"></div>
//                 </div>
//               )}
//             </form>

//             {/* Mobile Nav Items */}
//             <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
//               {navItems.map((item) =>
//                 item.type === "link" ? (
//                   <button
//                     key={item.path}
//                     onClick={() => go(item.path)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       padding: "12px 16px",
//                       borderRadius: "12px",
//                       background: isActive(item.path) ? "rgba(0, 178, 189, 0.1)" : "none",
//                       border: "none",
//                       cursor: "pointer",
//                       color: isActive(item.path) ? "#00b2bd" : isDark ? "#9ca3af" : "#6b7280",
//                       fontSize: "14px",
//                       fontWeight: "500",
//                       textAlign: "left",
//                       width: "100%",
//                     }}
//                   >
//                     <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                       {item.icon && <item.icon size={16} />}
//                       {item.label}
//                     </span>
//                     {isActive(item.path) && (
//                       <span
//                         style={{
//                           width: "6px",
//                           height: "6px",
//                           borderRadius: "50%",
//                           backgroundColor: "#00b2bd",
//                         }}
//                       />
//                     )}
//                   </button>
//                 ) : (
//                   <div key={item.key}>
//                     <button
//                       onClick={() => setMobileDropdown(mobileDropdown === item.key ? null : item.key)}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         padding: "12px 16px",
//                         borderRadius: "12px",
//                         background:
//                           isActive(item.activePath) || mobileDropdown === item.key
//                             ? "rgba(0, 178, 189, 0.1)"
//                             : "none",
//                         border: "none",
//                         cursor: "pointer",
//                         color:
//                           isActive(item.activePath) || mobileDropdown === item.key
//                             ? "#00b2bd"
//                             : isDark ? "#9ca3af" : "#6b7280",
//                         fontSize: "14px",
//                         fontWeight: "500",
//                         textAlign: "left",
//                         width: "100%",
//                       }}
//                     >
//                       {item.label}
//                       <ChevronDown
//                         size={16}
//                         style={{
//                           transition: "transform 0.2s ease",
//                           transform: mobileDropdown === item.key ? "rotate(180deg)" : "rotate(0deg)",
//                         }}
//                       />
//                     </button>

//                     {mobileDropdown === item.key && (
//                       <div
//                         style={{
//                           marginLeft: "16px",
//                           marginTop: "4px",
//                           paddingLeft: "16px",
//                           borderLeft: "2px solid rgba(0, 178, 189, 0.2)",
//                         }}
//                       >
//                         {item.items.map((dropItem, idx) => {
//                           const Icon = dropItem.icon;
//                           return (
//                             <button
//                               key={idx}
//                               onClick={() => go(dropItem.path)}
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "12px",
//                                 padding: "10px 12px",
//                                 borderRadius: "8px",
//                                 background: "none",
//                                 border: "none",
//                                 cursor: "pointer",
//                                 textAlign: "left",
//                                 width: "100%",
//                                 color: isDark ? "#9ca3af" : "#6b7280",
//                                 fontSize: "14px",
//                               }}
//                             >
//                               <Icon size={16} style={{ color: "#00b2bd" }} />
//                               <div>
//                                 <div style={{ fontWeight: "500" }}>{dropItem.label}</div>
//                                 <div style={{ fontSize: "12px", opacity: 0.7 }}>{dropItem.desc}</div>
//                               </div>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 )
//               )}
//             </nav>

//             {/* Mobile Footer */}
//             <div
//               style={{
//                 marginTop: "16px",
//                 paddingTop: "16px",
//                 borderTop: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
//               }}
//             >
//               <button
//                 onClick={toggleTheme}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "12px 16px",
//                   borderRadius: "12px",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   color: isDark ? "#9ca3af" : "#6b7280",
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   width: "100%",
//                   marginBottom: "8px",
//                 }}
//               >
//                 <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                   {isDark ? <Sun size={16} style={{ color: "#fbbf24" }} /> : <Moon size={16} />}
//                   {isDark ? "Light Mode" : "Dark Mode"}
//                 </span>
//                 <div
//                   style={{
//                     width: "40px",
//                     height: "20px",
//                     borderRadius: "10px",
//                     backgroundColor: isDark ? "#00b2bd" : "#d1d5db",
//                     position: "relative",
//                     transition: "all 0.2s ease",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: "16px",
//                       height: "16px",
//                       borderRadius: "50%",
//                       backgroundColor: "white",
//                       position: "absolute",
//                       top: "2px",
//                       left: isDark ? "22px" : "2px",
//                       transition: "all 0.2s ease",
//                       boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
//                     }}
//                   />
//                 </div>
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }
        
//         /* Desktop */
//         @media (min-width: 1024px) {
//           .desktop-nav {
//             display: flex !important;
//           }
//           .desktop-search {
//             display: block !important;
//           }
//           .desktop-wallet {
//             display: block !important;
//           }
//           .desktop-theme-toggle {
//             display: flex !important;
//           }
//           .logo-text {
//             display: block !important;
//           }
//           .mobile-toggle {
//             display: none !important;
//           }
//         }

//         /* Large Desktop */
//         @media (min-width: 1440px) {
//           .search-input {
//             width: 280px !important;
//           }
//           .navbar-content {
//             gap: 16px !important;
//           }
//           .desktop-nav {
//             gap: 4px !important;
//           }
//         }
        
//         /* Standard Desktop */
//         @media (min-width: 1024px) and (max-width: 1439px) {
//           .search-input {
//             width: 200px !important;
//           }
//           .navbar-content {
//             gap: 12px !important;
//           }
//           .desktop-nav {
//             gap: 2px !important;
//           }
//         }
        
//         /* Tablet/Mobile */
//         @media (max-width: 1023px) {
//           .desktop-nav {
//             display: none !important;
//           }
//           .desktop-search {
//             display: none !important;
//           }
//           .desktop-wallet {
//             display: none !important;
//           }
//           .desktop-theme-toggle {
//             display: none !important;
//           }
//           .logo-text {
//             display: none !important;
//           }
//           .mobile-toggle {
//             display: flex !important;
//           }
//           .navbar-container {
//             padding: 0 8px !important;
//           }
//           .navbar-content {
//             gap: 6px !important;
//           }
//         }

//         /* Small Mobile */
//         @media (max-width: 480px) {
//           .navbar-container {
//             padding: 0 6px !important;
//           }
//           .navbar-content {
//             gap: 4px !important;
//           }
//           .logo-button {
//             gap: 6px !important;
//           }
//         }
//       `}</style>
//     </header>
//   );
// };

// export default Navbar;


import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Blocks,
  Users,
  Vote,
  Image,
  Layers,
  Award,
  TrendingUp,
  Repeat,
  Send,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLazySearchQuery } from "../pages/Home/homeApiSlice";
import WalletConnect from "../pages/socket/WalletConnect";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const isDark = theme === "dark";

  const [triggerSearch, { isLoading: isSearching }] = useLazySearchQuery();

  // ✅ Check if current page is home
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileDropdown(null);
    setHoveredDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
    setMobileDropdown(null);
    setHoveredDropdown(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const result = await triggerSearch({ q: searchQuery.trim(), limit: 1 }).unwrap();

      if (result?.results && result.results.length > 0) {
        const firstResult = result.results[0];
        const { type } = result;

        if (type.is_a_user_address || type.is_a_contract_address) {
          navigate(`/address/${firstResult.value}`);
        } else if (type.is_a_transaction_hash) {
          navigate(`/transactions/${firstResult.value}`);
        } else if (type.is_a_block_number) {
          navigate(`/blocks/${firstResult.value}`);
        } else {
          navigate(`/address/${firstResult.value}`);
        }
      } else {
        console.log("No results found");
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }

      setSearchQuery("");
    } catch (err) {
      console.error("Search failed:", err);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleMouseEnter = (key) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredDropdown(key);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 150);
  };

  const navItems = [
    { type: "link", label: "Home", path: "/" },
    {
      type: "dropdown",
      key: "blockchain",
      label: "Blockchain",
      activePath: "/blocks",
      items: [
        { label: "View Blocks", desc: "Explore all blocks", icon: Blocks, path: "/blocks" },
        { label: "Latest Block", desc: "Most recent block", icon: Layers, path: "/blocks/latest" },
      ],
    },
    {
      type: "dropdown",
      key: "validators",
      label: "Validators",
      activePath: "/validators",
      items: [
        { label: "Leaderboard", desc: "Top validators", icon: Award, path: "/validators/leaderboard" },
        { label: "Set Info", desc: "Validator details", icon: Users, path: "/validators/set-info" },
      ],
    },
    { type: "link", label: "Transactions", path: "/transactions" },
    {
      type: "dropdown",
      key: "nft",
      label: "NFTs",
      activePath: "/nft",
      items: [
        { label: "Top NFTs", desc: "Popular collections", icon: TrendingUp, path: "/nft/top" },
        { label: "Top Mints", desc: "Trending mints", icon: Sparkles, path: "/nft/top-mints" },
        { label: "Latest Trades", desc: "Recent trades", icon: Repeat, path: "/nft/trades" },
        { label: "Latest Transfers", desc: "Recent transfers", icon: Send, path: "/nft/transfers" },
        { label: "Latest Mints", desc: "New mints", icon: Image, path: "/nft/latest-mints" },
      ],
    },
    { type: "link", label: "Proposals", path: "/governance", icon: Vote },
  ];

  return (
    <header
      ref={navRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: isDark ? "#111827" : "#ffffff",
        borderBottom: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
        boxShadow: scrolled
          ? isDark
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          : "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* Top Accent Line */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #00b2bd 0%, #00d4e0 50%, #00b2bd 100%)",
        }}
      />

      <div 
        className="navbar-container"
        style={{ 
          maxWidth: "100%",
          margin: "0 auto", 
          padding: "0 12px",
          width: "100%",
        }}
      >
        <div 
          className="navbar-content"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            height: "64px", 
            gap: "8px",
            justifyContent: "space-between",
            width: "100%",
          }}
        >

          {/* Logo */}
          <button
            onClick={() => go("/")}
            className="logo-button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#00b2bd",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(45deg)",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                  transform: "rotate(-45deg)",
                }}
              >
                JMC
              </span>
            </div>
            <div className="logo-text">
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: isDark ? "#ffffff" : "#111827",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                JMC-24 Scan
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#00b2bd",
                  fontWeight: "500",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Explorer
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav 
            className="desktop-nav" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "2px", 
              flex: "0 1 auto",
              minWidth: 0,
            }}
          >
            {navItems.map((item) =>
              item.type === "link" ? (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: isActive(item.path) ? "#00b2bd" : isDark ? "#9ca3af" : "#6b7280",
                    transition: "all 0.2s ease",
                    position: "relative",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.color = isDark ? "#ffffff" : "#111827";
                      e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "#f5f7f9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.color = isDark ? "#9ca3af" : "#6b7280";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {item.icon && <item.icon size={14} />}
                  {item.label}
                  {isActive(item.path) && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "20px",
                        height: "2px",
                        backgroundColor: "#00b2bd",
                        borderRadius: "2px",
                      }}
                    />
                  )}
                </button>
              ) : (
                <div
                  key={item.key}
                  style={{ position: "relative", flexShrink: 0 }}
                  onMouseEnter={() => handleMouseEnter(item.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      background: hoveredDropdown === item.key ? (isDark ? "rgba(255,255,255,0.05)" : "#f5f7f9") : "none",
                      border: "none",
                      cursor: "pointer",
                      color: isActive(item.activePath) || hoveredDropdown === item.key
                        ? "#00b2bd"
                        : isDark ? "#9ca3af" : "#6b7280",
                      transition: "all 0.2s ease",
                      position: "relative",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      style={{
                        transition: "transform 0.2s ease",
                        transform: hoveredDropdown === item.key ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                    {isActive(item.activePath) && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "20px",
                          height: "2px",
                          backgroundColor: "#00b2bd",
                          borderRadius: "2px",
                        }}
                      />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      minWidth: "280px",
                      backgroundColor: isDark ? "#1f2937" : "#ffffff",
                      border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                      borderRadius: "12px",
                      boxShadow: isDark
                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
                        : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      padding: "8px",
                      zIndex: 100,
                      opacity: hoveredDropdown === item.key ? 1 : 0,
                      visibility: hoveredDropdown === item.key ? "visible" : "hidden",
                      transform: hoveredDropdown === item.key ? "translateY(0)" : "translateY(-10px)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item.items.map((dropItem, idx) => {
                      const Icon = dropItem.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => go(dropItem.path)}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "#f5f7f9";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              backgroundColor: "rgba(0, 178, 189, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#00b2bd",
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: isDark ? "#f3f4f6" : "#111827",
                                marginBottom: "2px",
                              }}
                            >
                              {dropItem.label}
                            </div>
                            <div style={{ fontSize: "12px", color: isDark ? "#9ca3af" : "#6b7280" }}>
                              {dropItem.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </nav>

          {/* Right Section */}
          <div 
            className="navbar-right"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              flexShrink: 0,
            }}
          >
            {/* Desktop Search Bar - ✅ Hide on home page */}
            {!isHomePage && (
              <form 
                onSubmit={handleSearch} 
                className="desktop-search" 
                style={{ position: "relative" }}
              >
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Address / Tx / Block..."
                  disabled={isSearching}
                  className="search-input"
                  style={{
                    width: "220px",
                    padding: "8px 36px 8px 36px",
                    borderRadius: "10px",
                    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                    backgroundColor: isDark ? "#1f2937" : "#f5f7f9",
                    color: isDark ? "#ffffff" : "#111827",
                    fontSize: "13px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    opacity: isSearching ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#00b2bd";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDark ? "#374151" : "#e5e7eb";
                  }}
                />
                {searchQuery && !isSearching && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: "4px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
                {isSearching && (
                  <div
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#00b2bd] border-t-transparent"></div>
                  </div>
                )}
              </form>
            )}

            {/* Wallet Connect - Desktop Only */}
            <div className="desktop-wallet">
              <WalletConnect/>
            </div>

            {/* Theme Toggle - Desktop */}
            <button
              onClick={toggleTheme}
              className="desktop-theme-toggle"
              style={{
                padding: "8px",
                borderRadius: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isDark ? "#9ca3af" : "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "#f5f7f9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-toggle"
              style={{
                display: "none",
                padding: "8px",
                borderRadius: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isDark ? "#9ca3af" : "#6b7280",
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              top: "67px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "67px",
              left: 0,
              right: 0,
              maxHeight: "calc(100vh - 67px)",
              overflowY: "auto",
              backgroundColor: isDark ? "#111827" : "#ffffff",
              borderTop: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
              zIndex: 50,
              padding: "16px",
            }}
          >
            {/* Mobile Wallet Section */}
            <div style={{ marginBottom: "16px" }}>
              <WalletConnect />
            </div>

            {/* Mobile Search - ✅ Hide on home page */}
            {!isHomePage && (
              <form onSubmit={handleSearch} style={{ position: "relative", marginBottom: "16px" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search address, tx, block..."
                  disabled={isSearching}
                  style={{
                    width: "100%",
                    padding: "12px 40px 12px 40px",
                    borderRadius: "12px",
                    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                    backgroundColor: isDark ? "#1f2937" : "#f5f7f9",
                    color: isDark ? "#ffffff" : "#111827",
                    fontSize: "14px",
                    outline: "none",
                    opacity: isSearching ? 0.6 : 1,
                  }}
                />
                {isSearching && (
                  <div
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#00b2bd] border-t-transparent"></div>
                  </div>
                )}
              </form>
            )}

            {/* Mobile Nav Items */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {navItems.map((item) =>
                item.type === "link" ? (
                  <button
                    key={item.path}
                    onClick={() => go(item.path)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      background: isActive(item.path) ? "rgba(0, 178, 189, 0.1)" : "none",
                      border: "none",
                      cursor: "pointer",
                      color: isActive(item.path) ? "#00b2bd" : isDark ? "#9ca3af" : "#6b7280",
                      fontSize: "14px",
                      fontWeight: "500",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {item.icon && <item.icon size={16} />}
                      {item.label}
                    </span>
                    {isActive(item.path) && (
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "#00b2bd",
                        }}
                      />
                    )}
                  </button>
                ) : (
                  <div key={item.key}>
                    <button
                      onClick={() => setMobileDropdown(mobileDropdown === item.key ? null : item.key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background:
                          isActive(item.activePath) || mobileDropdown === item.key
                            ? "rgba(0, 178, 189, 0.1)"
                            : "none",
                        border: "none",
                        cursor: "pointer",
                        color:
                          isActive(item.activePath) || mobileDropdown === item.key
                            ? "#00b2bd"
                            : isDark ? "#9ca3af" : "#6b7280",
                        fontSize: "14px",
                        fontWeight: "500",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        style={{
                          transition: "transform 0.2s ease",
                          transform: mobileDropdown === item.key ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>

                    {mobileDropdown === item.key && (
                      <div
                        style={{
                          marginLeft: "16px",
                          marginTop: "4px",
                          paddingLeft: "16px",
                          borderLeft: "2px solid rgba(0, 178, 189, 0.2)",
                        }}
                      >
                        {item.items.map((dropItem, idx) => {
                          const Icon = dropItem.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => go(dropItem.path)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textAlign: "left",
                                width: "100%",
                                color: isDark ? "#9ca3af" : "#6b7280",
                                fontSize: "14px",
                              }}
                            >
                              <Icon size={16} style={{ color: "#00b2bd" }} />
                              <div>
                                <div style={{ fontWeight: "500" }}>{dropItem.label}</div>
                                <div style={{ fontSize: "12px", opacity: 0.7 }}>{dropItem.desc}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              )}
            </nav>

            {/* Mobile Footer */}
            <div
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
              }}
            >
              <button
                onClick={toggleTheme}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: isDark ? "#9ca3af" : "#6b7280",
                  fontSize: "14px",
                  fontWeight: "500",
                  width: "100%",
                  marginBottom: "8px",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {isDark ? <Sun size={16} style={{ color: "#fbbf24" }} /> : <Moon size={16} />}
                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
                <div
                  style={{
                    width: "40px",
                    height: "20px",
                    borderRadius: "10px",
                    backgroundColor: isDark ? "#00b2bd" : "#d1d5db",
                    position: "relative",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      position: "absolute",
                      top: "2px",
                      left: isDark ? "22px" : "2px",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Desktop */
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-search {
            display: block !important;
          }
          .desktop-wallet {
            display: block !important;
          }
          .desktop-theme-toggle {
            display: flex !important;
          }
          .logo-text {
            display: block !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }

        /* Large Desktop */
        @media (min-width: 1440px) {
          .search-input {
            width: 280px !important;
          }
          .navbar-content {
            gap: 16px !important;
          }
          .desktop-nav {
            gap: 4px !important;
          }
        }
        
        /* Standard Desktop */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .search-input {
            width: 200px !important;
          }
          .navbar-content {
            gap: 12px !important;
          }
          .desktop-nav {
            gap: 2px !important;
          }
        }
        
        /* Tablet/Mobile */
        @media (max-width: 1023px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-search {
            display: none !important;
          }
          .desktop-wallet {
            display: none !important;
          }
          .desktop-theme-toggle {
            display: none !important;
          }
          .logo-text {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
          .navbar-container {
            padding: 0 8px !important;
          }
          .navbar-content {
            gap: 6px !important;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .navbar-container {
            padding: 0 6px !important;
          }
          .navbar-content {
            gap: 4px !important;
          }
          .logo-button {
            gap: 6px !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;