"use client";

import { useId, useMemo, useState } from "react";
import { Building2 } from "lucide-react";

import { EntryLogo } from "@/components/profile/section-card";
import { Input } from "@/components/ui/input";
import { logoUrl } from "@/lib/logo";

// Case- and accent-insensitive, so "linkoping" finds "Linköping".
function fold(text) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// `options` are { name, domain, group, aliases }. Selecting one fills in the name
// and hands the whole option to `onSelect` (the logo comes from its domain).
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

  const searchable = useMemo(
    () => options.map((option) => ({ option, terms: [option.name, ...option.aliases].map(fold) })),
    [options]
  );

  // Names that start with the query first, then ones that merely contain it.
  const matches = useMemo(() => {
    const query = fold(value.trim());
    if (!query) return [];
    const hits = [];
    for (const { option, terms } of searchable) {
      if (terms.some((term) => term.startsWith(query))) hits.push({ option, rank: 0 });
      else if (terms.some((term) => term.includes(query))) hits.push({ option, rank: 1 });
    }
    return hits
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 8)
      .map((hit) => hit.option);
  }, [value, searchable]);

  const showList = open && matches.length > 0;

  const handleSelect = (option) => {
    onChange(option.name);
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
          className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-popover py-1 shadow-md"
        >
          {matches.map((option, index) => (
            <li key={option.name} role="option" aria-selected={index === highlightedIndex}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm hover:bg-muted ${
                  index === highlightedIndex ? "bg-muted" : ""
                }`}
              >
                <EntryLogo
                  logo={logoUrl(option.domain)}
                  fallback={<Building2 className="size-4 text-muted-foreground" />}
                  className="size-8 rounded"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-foreground">{option.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{option.group}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
