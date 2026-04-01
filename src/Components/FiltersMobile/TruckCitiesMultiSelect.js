import React, { useEffect, useRef, useState } from "react";
import "./TruckCitiesMultiSelect.css";
import { FaChevronDown } from "react-icons/fa";
import { useIsMobile } from "../../Hooks/useIsMobile";

const TruckCitiesMultiSelect = ({
  options = [],
  selected = [],
  onChange,
  placeholder = "Show All",
  searchPlaceholder = "Search..."
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const isMobile = useIsMobile();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tcms-container" ref={ref}>

      {/* Input */}
      <div
        className={`${isMobile ? "tcms-input" : "tcms-input-desktop"} ${open ? "open" : ""}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="tcms-input-inner">
          {selected.length === 0 ? (
            <span className={isMobile ? "tcms-placeholder" : "tcms-placeholder-desktop"}>{placeholder}</span>
          ) : (
            <span className="tcms-values">
              {selected.slice(0, 2).join(", ")}
              {selected.length > 2 && ` (+${selected.length - 2})`}
            </span>
          )}

          <FaChevronDown className={`tcms-arrow ${open ? "rotate" : ""}`} />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="tcms-dropdown">

          {/* Search */}
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="tcms-search"
          />

          {/* Options */}
          <div className="tcms-options">

            {/* Show All */}
            <div
              className={`tcms-option ${selected.length === 0 ? "active" : ""}`}
              onClick={() => {
                onChange([]);
                setSearch("");
              }}
            >
              Show All
            </div>

            {filteredOptions.map(opt => (
              <div
                key={opt}
                className={`tcms-option ${selected.includes(opt) ? "active" : ""}`}
                onClick={() => toggleOption(opt)}
              >
                {opt}
              </div>
            ))}

            {filteredOptions.length === 0 && (
              <div className="tcms-empty">No locations found</div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default TruckCitiesMultiSelect;