"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EntryLogo, SectionCard } from "@/components/profile/section-card";

export function SkillsCard({ skills, sources, onChange }) {
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

  // Every skill on the profile — the ones added here plus those tagged on
  // experience, education and certifications — with the entries that use it.
  const grouped = new Map(skills.map((skill) => [skill, []]));
  for (const source of sources) {
    for (const skill of source.skills ?? []) {
      if (!grouped.has(skill)) grouped.set(skill, []);
      grouped.get(skill).push(source);
    }
  }
  // Skills backed by entries first, like LinkedIn; sort is stable so ties keep their order.
  const allSkills = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <SectionCard
      title="Skills"
      count={allSkills.length}
      onAdd={openEdit}
      addLabel="Add skills"
      onEdit={openEdit}
      editLabel="Edit skills"
    >
      {allSkills.length === 0 ? (
        <button
          type="button"
          onClick={openEdit}
          className="py-4 text-sm font-semibold text-link hover:underline print:hidden"
        >
          Add skills
        </button>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {allSkills.map(([skill, used]) => (
            <div key={skill} className="break-inside-avoid py-4">
              <p className="text-base font-semibold text-foreground">{skill}</p>
              {used.length > 0 && (
                <ul className="mt-3 flex flex-col gap-3">
                  {used.map((source) => (
                    <li key={source.id} className="flex items-center gap-3">
                      <EntryLogo
                        logo={source.logo}
                        fallback={source.icon}
                        className="size-7 rounded [&_svg]:size-4"
                      />
                      <span className="text-base text-foreground">{source.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

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
    </SectionCard>
  );
}
