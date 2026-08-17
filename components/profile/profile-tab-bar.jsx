"use client";

import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";

export function ProfileTabBar({ profiles, activeId, onSwitch, onAdd, onRemove }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto px-1 pt-2">
      {profiles.map((profile) => {
        const label = profile.data.name?.trim() || "New profile";
        const isActive = profile.id === activeId;
        return (
          <div
            key={profile.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSwitch(profile.id)}
            className={cn(
              "group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-t-lg border border-b-0 border-transparent px-3 py-2 text-sm",
              isActive
                ? "border-border bg-card font-medium text-foreground"
                : "text-muted-foreground hover:bg-card/60"
            )}
          >
            <span className="max-w-[140px] truncate">{label}</span>
            {profiles.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(profile.id);
                }}
                aria-label={`Close ${label}`}
                className="rounded-full p-0.5 opacity-0 hover:bg-foreground/10 group-hover:opacity-100"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={onAdd}
        aria-label="Add new profile"
        className="ml-1 flex shrink-0 items-center justify-center rounded-full p-1.5 text-muted-foreground hover:bg-card/60 hover:text-foreground"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
