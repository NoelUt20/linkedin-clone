"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function AboutCard({ about, onChange }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(about);

  const openEdit = () => {
    setDraft(about);
    setOpen(true);
  };

  const handleSave = () => {
    onChange(draft.trim());
    setOpen(false);
  };

  return (
    <Card className="break-inside-avoid">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl">About</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={openEdit}
          aria-label="Edit about"
          className="print:hidden"
        >
          <Pencil className="size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {about ? (
          <p className="whitespace-pre-line text-sm text-foreground/90">{about}</p>
        ) : (
          <button
            type="button"
            onClick={openEdit}
            className="text-sm font-semibold text-[#0a66c2] hover:underline print:hidden"
          >
            Add a summary about yourself
          </button>
        )}
      </CardContent>

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
    </Card>
  );
}
