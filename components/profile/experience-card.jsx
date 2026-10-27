"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Briefcase, Pencil, Plus, Trash2 } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDeleteDialog } from "@/components/profile/confirm-delete-dialog";
import { LogoUpload } from "@/components/profile/logo-upload";
import { AutocompleteInput } from "@/components/profile/autocomplete-input";
import {
  cleanDocument,
  DocumentAttachment,
  DocumentAttachmentField,
} from "@/components/profile/document-attachment";
import { companies } from "@/data/companies";
import { generateMonogramDataUrl } from "@/lib/generate-monogram";

const emptyDraft = {
  title: "",
  company: "",
  employmentType: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  logo: null,
  document: null,
};

// Adjacent positions at the same company are grouped under one logo and
// connected by a line, matching LinkedIn's treatment of multiple roles
// held at a single employer.
function groupByCompany(experience) {
  const groups = [];
  experience.forEach((item, index) => {
    const key = item.company.trim().toLowerCase();
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.entries.push({ item, index });
    } else {
      groups.push({ key, entries: [{ item, index }] });
    }
  });
  return groups;
}

export function ExperienceCard({ experience, onChange }) {
  const [editingId, setEditingId] = useState(null); // null closed, "new", or item id
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteId, setDeleteId] = useState(null);

  const groups = useMemo(() => groupByCompany(experience), [experience]);
  const missingDocumentName = draft.document !== null && !draft.document.title.trim();

  const openAdd = () => {
    setDraft(emptyDraft);
    setEditingId("new");
  };

  const openEdit = (item) => {
    setDraft({ document: null, ...item });
    setEditingId(item.id);
  };

  const close = () => setEditingId(null);

  const handleSave = () => {
    if (!draft.title.trim() || !draft.company.trim() || missingDocumentName) return;
    const saved = { ...draft, document: cleanDocument(draft.document) };
    if (editingId === "new") {
      onChange([...experience, { ...saved, id: `exp-${Date.now()}` }]);
    } else {
      onChange(
        experience.map((item) =>
          item.id === editingId ? { ...saved, id: editingId } : item
        )
      );
    }
    close();
  };

  const confirmDelete = () => {
    onChange(experience.filter((item) => item.id !== deleteId));
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= experience.length) return;
    const next = [...experience];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onChange(next);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl">Experience</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={openAdd}
          aria-label="Add experience"
          className="print:hidden"
        >
          <Plus className="size-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        {experience.length === 0 && (
          <p className="py-4 text-sm text-muted-foreground">No experience added yet.</p>
        )}
        {groups.map((group) => {
          const isGrouped = group.entries.length > 1;
          const groupLogo = group.entries.find(({ item }) => item.logo)?.item.logo ?? null;

          const actions = (item, index) => (
            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 print:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                aria-label="Move experience up"
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(index, 1)}
                disabled={index === experience.length - 1}
                aria-label="Move experience down"
              >
                <ArrowDown className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(item)}
                aria-label="Edit experience"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(item.id)}
                aria-label="Delete experience"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          );

          if (!isGrouped) {
            const { item, index } = group.entries[0];
            return (
              <div key={item.id} className="group flex break-inside-avoid gap-3 py-4 first:pt-0">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                  {item.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.logo} alt="" className="size-full object-cover" />
                  ) : (
                    <Briefcase className="size-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-foreground/80">
                    {item.company}
                    {item.employmentType ? ` · ${item.employmentType}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.startDate || "—"} – {item.current ? "Present" : item.endDate || "—"}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                  {item.description && (
                    <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">
                      {item.description}
                    </p>
                  )}
                  {item.document && <DocumentAttachment document={item.document} />}
                </div>
                {actions(item, index)}
              </div>
            );
          }

          return (
            <div
              key={group.key + group.entries[0].item.id}
              className="flex break-inside-avoid gap-3 py-4 first:pt-0"
            >
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                {groupLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={groupLogo} alt="" className="size-full object-cover" />
                ) : (
                  <Briefcase className="size-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {group.entries[0].item.company}
                </p>
                <div className="mt-3 flex flex-col gap-4 border-l-2 border-border pl-4">
                  {group.entries.map(({ item, index }) => (
                    <div key={item.id} className="group">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{item.title}</p>
                          {item.employmentType && (
                            <p className="text-sm text-foreground/80">{item.employmentType}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {item.startDate || "—"} –{" "}
                            {item.current ? "Present" : item.endDate || "—"}
                            {item.location ? ` · ${item.location}` : ""}
                          </p>
                        </div>
                        {actions(item, index)}
                      </div>
                      {item.description && (
                        <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">
                          {item.description}
                        </p>
                      )}
                      {item.document && <DocumentAttachment document={item.document} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId === "new" ? "Add experience" : "Edit experience"}</DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
            <div className="grid gap-1.5">
              <Label>Company logo</Label>
              <LogoUpload
                label="Upload company logo"
                logo={draft.logo}
                onChange={(logo) => setDraft({ ...draft, logo })}
                fallback={<Briefcase className="size-6 text-muted-foreground" />}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="exp-title">Title*</Label>
              <Input
                id="exp-title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="exp-company">Company*</Label>
              <AutocompleteInput
                id="exp-company"
                value={draft.company}
                onChange={(company) => setDraft((d) => ({ ...d, company }))}
                onSelect={(company) =>
                  setDraft((d) =>
                    d.logo ? d : { ...d, logo: generateMonogramDataUrl(company) }
                  )
                }
                options={companies}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="exp-type">Employment type</Label>
                <Input
                  id="exp-type"
                  value={draft.employmentType}
                  onChange={(e) => setDraft({ ...draft, employmentType: e.target.value })}
                  placeholder="Full-time"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="exp-location">Location</Label>
                <Input
                  id="exp-location"
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="exp-start">Start date</Label>
                <Input
                  id="exp-start"
                  value={draft.startDate}
                  onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                  placeholder="Jan 2022"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="exp-end">End date</Label>
                <Input
                  id="exp-end"
                  value={draft.endDate}
                  disabled={draft.current}
                  onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                  placeholder="Dec 2023"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground/90">
              <input
                type="checkbox"
                className="size-4"
                checked={draft.current}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : draft.endDate,
                  })
                }
              />
              I currently work here
            </label>
            <div className="grid gap-1.5">
              <Label htmlFor="exp-desc">Description</Label>
              <Textarea
                id="exp-desc"
                rows={4}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <DocumentAttachmentField
              id="exp-document"
              document={draft.document}
              onChange={(document) => setDraft((d) => ({ ...d, document }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!draft.title.trim() || !draft.company.trim() || missingDocumentName}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove this experience entry?"
        description="This will permanently remove the entry from your profile."
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
