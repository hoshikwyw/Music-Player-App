import { useState, useRef, useEffect } from "react";
import { BsChevronDown, BsCheck2 } from "react-icons/bs";

const RetroDropdown = ({ options, value, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const activeRef = useRef(null);

  const selectedLabel = options.find((o) => o.value === value)?.title || placeholder;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && activeRef.current) {
      activeRef.current.scrollIntoView({ block: "center" });
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-5 px-3.5 py-2 bg-card border-2 border-border rounded-retro-sm shadow-retro-sm text-sm font-semibold text-text-primary hover:shadow-retro transition-all duration-150 cursor-pointer"
      >
        {selectedLabel}
        <BsChevronDown
          className={`w-3 h-3 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-44 max-h-[260px] overflow-y-auto bg-card border-2 border-border rounded-retro-sm shadow-retro z-50 py-1 hide-scrollbar">
            {options.map((option) => {
              const isActive = value === option.value;
              return (
                <button
                  key={option.value}
                  ref={isActive ? activeRef : null}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-[7px] text-[13px] flex items-center justify-between transition-colors duration-100 ${
                    isActive
                      ? "bg-primary text-on-accent font-semibold"
                      : "text-text-primary hover:bg-background-secondary"
                  }`}
                >
                  {option.title}
                  {isActive && <BsCheck2 className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default RetroDropdown;
