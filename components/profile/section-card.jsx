"use client";

import { useState } from "react";
import { Check, Gem, Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// LinkedIn's mobile section: full-bleed on phones (the black page shows
// between sections), a rounded card from `sm` up.
export function SectionCard({ title, count, onAdd, addLabel, onEdit, editLabel, editing, children, footer, className }) {
  return (
    <section
      className={cn(
        "break-inside-avoid bg-card text-card-foreground sm:rounded-lg sm:ring-1 sm:ring-foreground/10",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 px-4 pb-1 pt-4 sm:px-6">
        <h2 className="text-xl font-semibold">
          {title}
          {count ? ` (${count})` : ""}
        </h2>
        <div className="-mr-2 flex items-center print:hidden">
          {onAdd && (
            <Button variant="ghost" size="icon-lg" onClick={onAdd} aria-label={addLabel}>
              <Plus className="size-6" strokeWidth={1.5} />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={onEdit}
              aria-label={editing ? "Done editing" : editLabel}
              aria-pressed={editing}
            >
              {editing ? (
                <Check className="size-6" strokeWidth={1.5} />
              ) : (
                <Pencil className="size-5" strokeWidth={1.5} />
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="px-4 pb-4 sm:px-6">{children}</div>
      {footer}
    </section>
  );
}

export function EntryLogo({ logo, fallback, className }) {
  return (
    <div
      className={cn(
        "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted",
        className
      )}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" className="size-full object-cover" />
      ) : (
        fallback
      )}
    </div>
  );
}

// The "◇ Skill, Skill" line under an entry.
export function SkillsLine({ skills }) {
  if (!skills?.length) return null;
  return (
    <p className="mt-2 flex items-start gap-1.5 text-base font-semibold text-foreground">
      <Gem className="mt-[3px] size-4 shrink-0" strokeWidth={2} />
      <span>{skills.join(", ")}</span>
    </p>
  );
}

function parseSkills(text) {
  return [...new Set(text.split(",").map((s) => s.trim()).filter(Boolean))];
}

// Comma-separated skills input. Keeps its own text so typing "Excel, " isn't
// immediately normalised away.
export function SkillsField({ id, skills, onChange }) {
  const [text, setText] = useState(() => (skills ?? []).join(", "));
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>Skills</Label>
      <Input
        id={id}
        value={text}
        placeholder="e.g. Economics, Financial modelling"
        onChange={(e) => {
          setText(e.target.value);
          onChange(parseSkills(e.target.value));
        }}
      />
      <p className="text-xs text-muted-foreground">Separate skills with commas.</p>
    </div>
  );
}

// Reorder/edit/delete controls shown on each entry while the section's
// pencil is toggled on.
export function EntryActions({ children }) {
  return (
    <div className="absolute right-0 top-0 z-10 flex gap-0.5 rounded-full bg-card p-0.5 shadow-sm ring-1 ring-foreground/15 print:hidden">
      {children}
    </div>
  );
}
