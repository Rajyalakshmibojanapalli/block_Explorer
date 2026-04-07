// components/ui/Dropdown.jsx
import { useState, useRef, useEffect } from "react";

const Dropdown = ({
  label = "Select",
  options = [],
  value,
  onChange,
  placeholder = "Choose an option",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full max-w-xs ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-2.5 rounded-lg border
          text-sm text-left transition-all
          ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-pointer hover:border-gray-400"}
        `}
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-400"}>
          {selectedOption?.label || placeholder}
        </span>
        <span
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`
                px-4 py-2.5 text-sm cursor-pointer transition-colors
                ${option.value === value
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {option.label}
            </li>
          ))}
          {options.length === 0 && (
            <li className="px-4 py-2.5 text-sm text-gray-400 text-center">
              No options
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;