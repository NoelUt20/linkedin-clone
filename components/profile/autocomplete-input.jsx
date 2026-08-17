"use client";

import { useId, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

export function AutocompleteInput({
  id,
  value,
  onChange,
  onSelect,
  options,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const listId = useId();

  const matches = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];
    return options.filter((option) => option.toLowerCase().includes(query)).slice(0, 8);
  }, [value, options]);

  const showList = open && matches.length > 0;

  const handleSelect = (option) => {
    onChange(option);
    onSelect?.(option);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!showList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(matches[highlightedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlightedIndex(0);
        }}
        onFocus={() => value.trim() && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        onKeyDown={handleKeyDown}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-popover py-1 shadow-md"
        >
          {matches.map((option, index) => (
            <li key={option} role="option" aria-selected={index === highlightedIndex}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option)}
                className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-muted ${
                  index === highlightedIndex ? "bg-muted" : ""
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
