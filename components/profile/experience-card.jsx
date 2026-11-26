"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Briefcase, Pencil, Trash2 } from "lucide-react";

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
import { companies } from "@/data/companies";
import { formatMonthValue, toMonthInput } from "@/lib/dates";
import { formatSpan } from "@/lib/duration";
import { displayLogo, isAutoLogo, logoUrl, resolveLogo } from "@/lib/logo";
import { experienceRange, insertSorted, orderEntries, sortByDate } from "@/lib/sort-entries";

const emptyDraft = {
  title: "",
  company: "",
  employmentType: "",
  location: "",
  locationType: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  logo: null,
  skills: [],
  document: null,
};

// Adjacent positions at the same company are grouped under one logo and
// connected by a timeline, matching LinkedIn's treatment of multiple roles
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

function dateRange(item) {
  const end = item.current ? "Present" : formatMonthValue(item.endDate);
  const range = [formatMonthValue(item.startDate), end].filter(Boolean).join("–");
  const span = formatSpan([item]);
  return [range, span].filter(Boolean).join(" · ");
}

const fallbackIcon = <Briefcase className="size-6 text-muted-foreground" />;

function RoleDetails({ item }) {
  return (
    <>
      {item.description && (
        <p className="mt-2 whitespace-pre-line text-base text-foreground">{item.description}</p>
      )}
      <SkillsLine skills={item.skills} />
      {item.document && <DocumentAttachment document={item.document} />}
    </>
  );
}

// `manualOrder` is true once the user has used the arrows; until then the list
// always follows the dates. `onChange(list, manual)` reports both.
export function ExperienceCard({ experience, manualOrder = false, onChange }) {
  const [editingId, setEditingId] = useState(null); // null closed, "new", or item id
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteId, setDeleteId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const ordered = useMemo(
    () => orderEntries(experience, experienceRange, manualOrder),
    [experience, manualOrder]
  );
  const groups = useMemo(() => groupByCompany(ordered), [ordered]);
  const endBeforeStart =
    !draft.current && draft.startDate && draft.endDate && draft.endDate < draft.startDate;
  const missingDocumentName = draft.document !== null && !draft.document.title.trim();

  const openAdd = () => {
    setDraft(emptyDraft);
    setEditingId("new");
  };

  const openEdit = (item) => {
    // Older entries hold free-text dates; convert them so the pickers open filled in.
    setDraft({
      ...emptyDraft,
      ...item,
      startDate: toMonthInput(item.startDate),
      endDate: toMonthInput(item.endDate),
    });
    setEditingId(item.id);
  };

  const close = () => setEditingId(null);

  // Sorted by date unless the user has set their own order, which is left alone.
  const commit = (list) =>
    onChange(manualOrder ? list : sortByDate(list, experienceRange), manualOrder);

  const handleSave = () => {
    if (!draft.title.trim() || !draft.company.trim() || missingDocumentName || endBeforeStart) {
      return;
    }
    const saved = {
      ...draft,
      logo: resolveLogo(companies, draft.company, draft.logo),
      document: cleanDocument(draft.document),
    };
    if (editingId === "new") {
      const item = { ...saved, id: `exp-${Date.now()}` };
      commit(manualOrder ? insertSorted(ordered, item, experienceRange) : [...ordered, item]);
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

  const actions = (item, index) =>
    editMode && (
      <EntryActions>
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
          disabled={index === ordered.length - 1}
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
      </EntryActions>
    );

  return (
    <SectionCard
      title="Experience"
      onAdd={openAdd}
      addLabel="Add experience"
      onEdit={experience.length ? () => setEditMode((m) => !m) : undefined}
      editLabel="Edit experience entries"
      editing={editMode}
    >
      {experience.length === 0 && (
        <p className="py-4 text-sm text-muted-foreground">No experience added yet.</p>
      )}
      {editMode && experience.length > 1 && (
        <OrderNote
          manual={manualOrder}
          onSortByDate={() => onChange(sortByDate(ordered, experienceRange), false)}
        />
      )}
      <div className="flex flex-col divide-y divide-border">
        {groups.map((group) => {
          if (group.entries.length === 1) {
            const { item, index } = group.entries[0];
            return (
              <div key={item.id} className="relative flex break-inside-avoid gap-3 py-4">
                <EntryLogo
                  logo={displayLogo(companies, item.company, item.logo)}
                  fallback={fallbackIcon}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold leading-snug text-foreground">
                    {item.title}
                  </p>
                  <p className="text-base leading-snug text-foreground">
                    {[item.company, item.employmentType].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-base leading-snug text-muted-foreground">{dateRange(item)}</p>
                  {(item.location || item.locationType) && (
                    <p className="text-base leading-snug text-muted-foreground">
                      {[item.location, item.locationType].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <RoleDetails item={item} />
                </div>
                {actions(item, index)}
              </div>
            );
          }

          const items = group.entries.map(({ item }) => item);
          const first = items[0];
          const groupLogo =
            items.map((item) => displayLogo(companies, item.company, item.logo)).find(Boolean) ?? null;
          const employmentType = items.find((item) => item.employmentType)?.employmentType;
          const locationType = items.find((item) => item.locationType)?.locationType;
          return (
            <div key={group.key + first.id} className="break-inside-avoid py-4">
              <div className="flex gap-3">
                <EntryLogo logo={groupLogo} fallback={fallbackIcon} />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold leading-snug text-foreground">
                    {first.company}
                  </p>
                  <p className="text-base leading-snug text-foreground">
                    {[employmentType, formatSpan(items)].filter(Boolean).join(" · ")}
                  </p>
                  {locationType && (
                    <p className="text-base leading-snug text-muted-foreground">{locationType}</p>
                  )}
                </div>
              </div>
              <ol className="mt-3">
                {group.entries.map(({ item, index }, i) => {
                  const isLast = i === group.entries.length - 1;
                  return (
                    <li key={item.id} className="relative flex gap-3">
                      {/* Timeline: a dot per role, joined by a line, centred under the logo. */}
                      <div className="relative flex w-12 shrink-0 justify-center">
                        <span className="mt-2 size-2 rounded-full bg-muted-foreground/70" />
                        {!isLast && (
                          <span className="absolute bottom-1 top-6 w-0.5 rounded bg-muted-foreground/40" />
                        )}
                      </div>
                      <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-6"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-base font-semibold leading-snug text-foreground">
                            {item.title}
                          </p>
                          {item.current && !editMode && (
                            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-sm font-semibold text-foreground/80">
                              Now
                            </span>
                          )}
                        </div>
                        <p className="text-base leading-snug text-muted-foreground">
                          {dateRange(item)}
                        </p>
                        {item.location && (
                          <p className="text-base leading-snug text-muted-foreground">
                            {item.location}
                          </p>
                        )}
                        <RoleDetails item={item} />
                      </div>
                      {actions(item, index)}
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>

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
                fallback={fallbackIcon}
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
                onSelect={(option) =>
                  setDraft((d) =>
                    isAutoLogo(d.logo) ? { ...d, logo: logoUrl(option.domain) } : d
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
                <Label htmlFor="exp-location-type">Location type</Label>
                <Input
                  id="exp-location-type"
                  value={draft.locationType}
                  onChange={(e) => setDraft({ ...draft, locationType: e.target.value })}
                  placeholder="On-site"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="exp-location">Location</Label>
              <Input
                id="exp-location"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                placeholder="Stockholm, Sweden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="exp-start">Start date</Label>
                <Input
                  id="exp-start"
                  type="month"
                  value={draft.startDate}
                  onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="exp-end">End date</Label>
                <Input
                  id="exp-end"
                  type="month"
                  value={draft.endDate}
                  min={draft.startDate || undefined}
                  disabled={draft.current}
                  aria-invalid={endBeforeStart ? true : undefined}
                  onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                />
              </div>
            </div>
            {endBeforeStart && (
              <p className="-mt-2 text-sm text-destructive">
                End date can&apos;t be before the start date.
              </p>
            )}
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
            <SkillsField
              key={editingId}
              id="exp-skills"
              skills={draft.skills}
              onChange={(skills) => setDraft((d) => ({ ...d, skills }))}
            />
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
              disabled={
                !draft.title.trim() ||
                !draft.company.trim() ||
                missingDocumentName ||
                endBeforeStart
              }
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
    </SectionCard>
  );
}
