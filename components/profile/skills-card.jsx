"use client";

import { useState } from "react";
import { Pencil, Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function SkillsCard({ skills, onChange }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(skills);
  const [newSkill, setNewSkill] = useState("");

  const openEdit = () => {
    setDraft(skills);
    setNewSkill("");
    setOpen(true);
  };

  const addSkill = () => {
    const value = newSkill.trim();
    if (!value || draft.includes(value)) return;
    setDraft([...draft, value]);
    setNewSkill("");
  };

  const removeDraftSkill = (skill) => setDraft(draft.filter((s) => s !== skill));

  const handleSave = () => {
    onChange(draft);
    setOpen(false);
  };

  return (
    <Card className="break-inside-avoid">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl">Skills</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={openEdit}
          aria-label="Edit skills"
          className="print:hidden"
        >
          <Pencil className="size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <button
            type="button"
            onClick={openEdit}
            className="text-sm font-semibold text-[#0a66c2] hover:underline print:hidden"
          >
            Add skills
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="h-auto gap-1 rounded-full py-1.5 pl-3 pr-2 text-sm font-normal"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => onChange(skills.filter((s) => s !== skill))}
                  aria-label={`Remove ${skill}`}
                  className="rounded-full p-0.5 hover:bg-foreground/10 print:hidden"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit skills</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button type="button" onClick={addSkill} disabled={!newSkill.trim()}>
              <Plus className="size-4" />
              Add
            </Button>
          </div>
          <div className="flex max-h-[40vh] flex-wrap gap-2 overflow-y-auto pt-1">
            {draft.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills yet.</p>
            )}
            {draft.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="h-auto gap-1 rounded-full py-1.5 pl-3 pr-2 text-sm font-normal"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeDraftSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  className="rounded-full p-0.5 hover:bg-foreground/10"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
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
