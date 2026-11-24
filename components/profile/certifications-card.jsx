"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Award, ExternalLink, Pencil, Trash2 } from "lucide-react";

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
import { ConfirmDeleteDialog } from "@/components/profile/confirm-delete-dialog";
import { LogoUpload } from "@/components/profile/logo-upload";
import {
  EntryActions,
  EntryLogo,
  SectionCard,
  SkillsField,
  SkillsLine,
} from "@/components/profile/section-card";
import { generateMonogramDataUrl } from "@/lib/generate-monogram";

const emptyDraft = {
  name: "",
  issuer: "",
  issueDate: "",
  expirationDate: "",
  credentialId: "",
  credentialUrl: "",
  logo: null,
  skills: [],
};

const fallbackIcon = <Award className="size-6 text-muted-foreground" />;

function withProtocol(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function CertificationsCard({ certifications, onChange }) {
  const [editingId, setEditingId] = useState(null); // null closed, "new", or item id
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteId, setDeleteId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const openAdd = () => {
    setDraft(emptyDraft);
    setEditingId("new");
  };

  const openEdit = (item) => {
    setDraft({ ...emptyDraft, ...item });
    setEditingId(item.id);
  };

  const close = () => setEditingId(null);

  const handleSave = () => {
    if (!draft.name.trim() || !draft.issuer.trim()) return;
    const saved = {
      ...draft,
      // Same treatment as companies and schools: a monogram until a real logo is uploaded.
      logo: draft.logo ?? generateMonogramDataUrl(draft.issuer),
    };
    if (editingId === "new") {
      onChange([...certifications, { ...saved, id: `cert-${Date.now()}` }]);
    } else {
      onChange(
        certifications.map((item) =>
          item.id === editingId ? { ...saved, id: editingId } : item
        )
      );
    }
    close();
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= certifications.length) return;
    const next = [...certifications];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onChange(next);
  };

  return (
    <SectionCard
      title="Licenses & certifications"
      count={certifications.length}
      onAdd={openAdd}
      addLabel="Add license or certification"
      onEdit={certifications.length ? () => setEditMode((m) => !m) : undefined}
      editLabel="Edit licenses and certifications"
      editing={editMode}
    >
      {certifications.length === 0 && (
        <p className="py-4 text-sm text-muted-foreground">No licenses or certifications yet.</p>
      )}
      <div className="flex flex-col divide-y divide-border">
        {certifications.map((item, index) => (
          <div key={item.id} className="relative flex break-inside-avoid gap-3 py-4">
            <EntryLogo logo={item.logo} fallback={fallbackIcon} />
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold leading-snug text-foreground">{item.name}</p>
              <p className="text-base leading-snug text-foreground">{item.issuer}</p>
              {(item.issueDate || item.expirationDate) && (
                <p className="text-base leading-snug text-muted-foreground">
                  {[
                    item.issueDate && `Issued ${item.issueDate}`,
                    item.expirationDate && `Expires ${item.expirationDate}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              {item.credentialId && (
                <p className="text-base leading-snug text-muted-foreground">
                  Credential ID {item.credentialId}
                </p>
              )}
              {item.credentialUrl && (
                <a
                  href={withProtocol(item.credentialUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-foreground/70 px-4 py-1.5 text-base font-semibold text-foreground/80 hover:bg-foreground/5 print:hidden"
                >
                  Show credential
                  <ExternalLink className="size-4" />
                </a>
              )}
              <SkillsLine skills={item.skills} />
            </div>
            {editMode && (
              <EntryActions>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  aria-label="Move certification up"
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === certifications.length - 1}
                  aria-label="Move certification down"
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(item)}
                  aria-label="Edit certification"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(item.id)}
                  aria-label="Delete certification"
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
            <DialogTitle>
              {editingId === "new" ? "Add license or certification" : "Edit license or certification"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
            <div className="grid gap-1.5">
              <Label>Organization logo</Label>
              <LogoUpload
                label="Upload organization logo"
                logo={draft.logo}
                onChange={(logo) => setDraft({ ...draft, logo })}
                fallback={fallbackIcon}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cert-name">Name*</Label>
              <Input
                id="cert-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Cambridge IGCSE"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cert-issuer">Issuing organization*</Label>
              <Input
                id="cert-issuer"
                value={draft.issuer}
                onChange={(e) => setDraft({ ...draft, issuer: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="cert-issued">Issue date</Label>
                <Input
                  id="cert-issued"
                  value={draft.issueDate}
                  onChange={(e) => setDraft({ ...draft, issueDate: e.target.value })}
                  placeholder="Nov 2022"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="cert-expires">Expiration date</Label>
                <Input
                  id="cert-expires"
                  value={draft.expirationDate}
                  onChange={(e) => setDraft({ ...draft, expirationDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cert-id">Credential ID</Label>
              <Input
                id="cert-id"
                value={draft.credentialId}
                onChange={(e) => setDraft({ ...draft, credentialId: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cert-url">Credential URL</Label>
              <Input
                id="cert-url"
                value={draft.credentialUrl}
                onChange={(e) => setDraft({ ...draft, credentialUrl: e.target.value })}
                placeholder="https://"
              />
            </div>
            <SkillsField
              key={editingId}
              id="cert-skills"
              skills={draft.skills}
              onChange={(skills) => setDraft((d) => ({ ...d, skills }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!draft.name.trim() || !draft.issuer.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove this certification?"
        description="This will permanently remove it from your profile."
        onConfirm={() => onChange(certifications.filter((item) => item.id !== deleteId))}
      />
    </SectionCard>
  );
}
