"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";

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
import { schools } from "@/data/schools";
import { generateMonogramDataUrl } from "@/lib/generate-monogram";

const emptyDraft = {
  school: "",
  degree: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
  description: "",
  logo: null,
  document: null,
};

export function EducationCard({ education, onChange }) {
  const [editingId, setEditingId] = useState(null); // null closed, "new", or item id
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteId, setDeleteId] = useState(null);
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
    if (!draft.school.trim() || missingDocumentName) return;
    const saved = { ...draft, document: cleanDocument(draft.document) };
    if (editingId === "new") {
      onChange([...education, { ...saved, id: `edu-${Date.now()}` }]);
    } else {
      onChange(
        education.map((item) =>
          item.id === editingId ? { ...saved, id: editingId } : item
        )
      );
    }
    close();
  };

  const confirmDelete = () => {
    onChange(education.filter((item) => item.id !== deleteId));
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= education.length) return;
    const next = [...education];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onChange(next);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl">Education</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={openAdd}
          aria-label="Add education"
          className="print:hidden"
        >
          <Plus className="size-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        {education.length === 0 && (
          <p className="py-4 text-sm text-muted-foreground">No education added yet.</p>
        )}
        {education.map((item, index) => (
          <div key={item.id} className="group flex break-inside-avoid gap-3 py-4 first:pt-0">
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
              {item.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.logo} alt="" className="size-full object-cover" />
              ) : (
                <GraduationCap className="size-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{item.school}</p>
              <p className="text-sm text-foreground/80">
                {[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}
              </p>
              {(item.startYear || item.endYear) && (
                <p className="text-xs text-muted-foreground">
                  {item.startYear || "—"} – {item.endYear || "—"}
                </p>
              )}
              {item.description && (
                <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">
                  {item.description}
                </p>
              )}
              {item.document && <DocumentAttachment document={item.document} />}
            </div>
            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 print:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                aria-label="Move education up"
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(index, 1)}
                disabled={index === education.length - 1}
                aria-label="Move education down"
              >
                <ArrowDown className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(item)}
                aria-label="Edit education"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(item.id)}
                aria-label="Delete education"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId === "new" ? "Add education" : "Edit education"}</DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
            <div className="grid gap-1.5">
              <Label>School logo</Label>
              <LogoUpload
                label="Upload school logo"
                logo={draft.logo}
                onChange={(logo) => setDraft({ ...draft, logo })}
                fallback={<GraduationCap className="size-6 text-muted-foreground" />}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edu-school">School*</Label>
              <AutocompleteInput
                id="edu-school"
                value={draft.school}
                onChange={(school) => setDraft((d) => ({ ...d, school }))}
                onSelect={(school) =>
                  setDraft((d) =>
                    d.logo ? d : { ...d, logo: generateMonogramDataUrl(school) }
                  )
                }
                options={schools}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="edu-degree">Degree</Label>
                <Input
                  id="edu-degree"
                  value={draft.degree}
                  onChange={(e) => setDraft({ ...draft, degree: e.target.value })}
                  placeholder="Bachelor of Arts"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edu-field">Field of study</Label>
                <Input
                  id="edu-field"
                  value={draft.fieldOfStudy}
                  onChange={(e) => setDraft({ ...draft, fieldOfStudy: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="edu-start">Start year</Label>
                <Input
                  id="edu-start"
                  value={draft.startYear}
                  onChange={(e) => setDraft({ ...draft, startYear: e.target.value })}
                  placeholder="2015"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edu-end">End year</Label>
                <Input
                  id="edu-end"
                  value={draft.endYear}
                  onChange={(e) => setDraft({ ...draft, endYear: e.target.value })}
                  placeholder="2019"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edu-desc">Description</Label>
              <Textarea
                id="edu-desc"
                rows={4}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <DocumentAttachmentField
              id="edu-document"
              document={draft.document}
              onChange={(document) => setDraft((d) => ({ ...d, document }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!draft.school.trim() || missingDocumentName}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove this education entry?"
        description="This will permanently remove the entry from your profile."
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
