import { useState, useRef, useEffect } from "react";
import { BsChevronDown, BsCheck2 } from "react-icons/bs";

const Dropdown = ({ options, value, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const activeRef = useRef(null);

  const selectedLabel =
    options.find((option) => option.value === value)?.title || placeholder;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeRef.current) {
      activeRef.current.scrollIntoView({ block: "center" });
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="glass-btn gap-4"
      >
        {selectedLabel}
        <BsChevronDown
          className={`w-3 h-3 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="glass-3 absolute right-0 mt-2 w-48 max-h-[280px] overflow-y-auto rounded-glass z-50 py-1 hide-scrollbar animate-fade-in"
        >
          {options.map((option) => {
            const isActive = value === option.value;

            return (
              <button
                key={option.value}
                role="option"
                aria-selected={isActive}
                ref={isActive ? activeRef : null}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors duration-100 ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {option.title}
                {isActive && <BsCheck2 className="w-3.5 h-3.5 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
