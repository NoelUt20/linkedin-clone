"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/profile/section-card";
import { cn } from "@/lib/utils";

export function AboutCard({ about, onChange }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(about);
  const [expanded, setExpanded] = useState(false);

  const openEdit = () => {
    setDraft(about);
    setOpen(true);
  };

  const handleSave = () => {
    onChange(draft.trim());
    setOpen(false);
  };

  return (
    <SectionCard title="About" onEdit={openEdit} editLabel="Edit about">
      {about ? (
        <div className="pt-2">
          <p
            className={cn(
              "whitespace-pre-line text-base text-foreground",
              !expanded && "line-clamp-4 print:line-clamp-none"
            )}
          >
            {about}
          </p>
          {!expanded && about.length > 150 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-base text-muted-foreground hover:underline print:hidden"
            >
              …see more
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={openEdit}
          className="py-2 text-sm font-semibold text-link hover:underline print:hidden"
        >
          Add a summary about yourself
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit about</DialogTitle>
          </DialogHeader>
          <Textarea
            rows={8}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Share a bit about your background and interests"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}
