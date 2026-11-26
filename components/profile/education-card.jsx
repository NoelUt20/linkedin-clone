"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, GraduationCap, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  EntryActions,
  EntryLogo,
  OrderNote,
  SectionCard,
  SkillsField,
  SkillsLine,
} from "@/components/profile/section-card";
import { schools } from "@/data/schools";
import { formatMonthValue, toMonthInput } from "@/lib/dates";
import { displayLogo, isAutoLogo, logoUrl, resolveLogo } from "@/lib/logo";
import { educationRange, insertSorted, orderEntries, sortByDate } from "@/lib/sort-entries";

const emptyDraft = {
  school: "",
  degree: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
  description: "",
  logo: null,
  skills: [],
  document: null,
};

const fallbackIcon = <GraduationCap className="size-6 text-muted-foreground" />;

// `manualOrder` is true once the user has used the arrows; until then the list
// always follows the dates. `onChange(list, manual)` reports both.
export function EducationCard({ education, manualOrder = false, onChange }) {
  const [editingId, setEditingId] = useState(null); // null closed, "new", or item id
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteId, setDeleteId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const missingDocumentName = draft.document !== null && !draft.document.title.trim();
  const ordered = useMemo(
    () => orderEntries(education, educationRange, manualOrder),
    [education, manualOrder]
  );
  const endBeforeStart = draft.startYear && draft.endYear && draft.endYear < draft.startYear;

  const openAdd = () => {
    setDraft(emptyDraft);
    setEditingId("new");
  };

  const openEdit = (item) => {
    // Older entries hold free-text dates; convert them so the pickers open filled in.
    setDraft({
      ...emptyDraft,
      ...item,
      startYear: toMonthInput(item.startYear),
      endYear: toMonthInput(item.endYear),
    });
    setEditingId(item.id);
  };

  const close = () => setEditingId(null);

  // Sorted by date unless the user has set their own order, which is left alone.
  const commit = (list) =>
    onChange(manualOrder ? list : sortByDate(list, educationRange), manualOrder);

  const handleSave = () => {
    if (!draft.school.trim() || missingDocumentName || endBeforeStart) return;
    const saved = {
      ...draft,
      logo: resolveLogo(schools, draft.school, draft.logo),
      document: cleanDocument(draft.document),
    };
    if (editingId === "new") {
      const item = { ...saved, id: `edu-${Date.now()}` };
      commit(manualOrder ? insertSorted(ordered, item, educationRange) : [...ordered, item]);
    } else {
      commit(ordered.map((item) => (item.id === editingId ? { ...saved, id: editingId } : item)));
    }
    close();
  };

  const confirmDelete = () => {
    commit(ordered.filter((item) => item.id !== deleteId));
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onChange(next, true);
  };

  return (
    <SectionCard
      title="Education"
      count={education.length}
      onAdd={openAdd}
      addLabel="Add education"
      onEdit={education.length ? () => setEditMode((m) => !m) : undefined}
      editLabel="Edit education entries"
      editing={editMode}
    >
      {education.length === 0 && (
        <p className="py-4 text-sm text-muted-foreground">No education added yet.</p>
      )}
      {editMode && education.length > 1 && (
        <OrderNote
          manual={manualOrder}
          onSortByDate={() => onChange(sortByDate(ordered, educationRange), false)}
        />
      )}
      <div className="flex flex-col divide-y divide-border">
        {ordered.map((item, index) => (
          <div key={item.id} className="relative flex break-inside-avoid gap-3 py-4">
            <EntryLogo
              logo={displayLogo(schools, item.school, item.logo)}
              fallback={fallbackIcon}
            />
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold leading-snug text-foreground">{item.school}</p>
              {(item.degree || item.fieldOfStudy) && (
                <p className="text-base leading-snug text-foreground">
                  {[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}
                </p>
              )}
              {(item.startYear || item.endYear) && (
                <p className="text-base leading-snug text-muted-foreground">
                  {[item.startYear, item.endYear].map(formatMonthValue).filter(Boolean).join("–")}
                </p>
              )}
              {item.description && (
                <p className="mt-2 whitespace-pre-line text-base text-foreground">
                  {item.description}
                </p>
              )}
              <SkillsLine skills={item.skills} />
              {item.document && <DocumentAttachment document={item.document} />}
            </div>
            {editMode && (
              <EntryActions>
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
                  disabled={index === ordered.length - 1}
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
              </EntryActions>
            )}
          </div>
        ))}
      </div>

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
                fallback={fallbackIcon}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edu-school">School*</Label>
              <AutocompleteInput
                id="edu-school"
                value={draft.school}
                onChange={(school) => setDraft((d) => ({ ...d, school }))}
                onSelect={(option) =>
                  setDraft((d) =>
                    isAutoLogo(d.logo) ? { ...d, logo: logoUrl(option.domain) } : d
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
                <Label htmlFor="edu-start">Start date</Label>
                <Input
                  id="edu-start"
                  type="month"
                  value={draft.startYear}
                  onChange={(e) => setDraft({ ...draft, startYear: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edu-end">End date</Label>
                <Input
                  id="edu-end"
                  type="month"
                  value={draft.endYear}
                  min={draft.startYear || undefined}
                  aria-invalid={endBeforeStart ? true : undefined}
                  onChange={(e) => setDraft({ ...draft, endYear: e.target.value })}
                />
              </div>
            </div>
            {endBeforeStart && (
              <p className="-mt-2 text-sm text-destructive">
                End date can&apos;t be before the start date.
              </p>
            )}
            <div className="grid gap-1.5">
              <Label htmlFor="edu-desc">Description</Label>
              <Textarea
                id="edu-desc"
                rows={4}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <SkillsField
              key={editingId}
              id="edu-skills"
              skills={draft.skills}
              onChange={(skills) => setDraft((d) => ({ ...d, skills }))}
            />
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
            <Button
              onClick={handleSave}
              disabled={!draft.school.trim() || missingDocumentName || endBeforeStart}
            >
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
    </SectionCard>
  );
}
