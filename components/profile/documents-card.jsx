"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Pencil, Plus, Trash2, X } from "lucide-react";

import { ConfirmDeleteDialog } from "@/components/profile/confirm-delete-dialog";
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
import { generatePlaceholderDocument } from "@/lib/generate-placeholder-text";
import { cn } from "@/lib/utils";

function createDocId() {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function PdfThumbnail({ doc, page = 1, large = false }) {
  // Rotate the filler paragraphs so each "page" in the viewer looks different.
  const offset = (page - 1) % doc.paragraphs.length;
  const paragraphs = [...doc.paragraphs.slice(offset), ...doc.paragraphs.slice(0, offset)];
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e5df] p-3">
      <div className={cn("h-full overflow-hidden rounded-sm bg-white shadow-sm", large ? "p-8" : "p-3")}>
        {page === 1 && (
          <>
            <p className={cn("mb-1.5 font-bold leading-tight text-foreground", large ? "text-xl" : "text-[9px]")}>{doc.heading}</p>
            <div className="mb-2 h-px bg-foreground/15" />
          </>
        )}
        {paragraphs.map((paragraph, i) => (
          <p key={i} className={cn("leading-[1.4] text-foreground/60", large ? "mb-3 text-[13px]" : "mb-1.5 text-[6px]")}>
            {paragraph}
          </p>
        ))}
      </div>
      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
        {page === 1 ? `${doc.pageCount} pages` : `Page ${page}`}
      </span>
    </div>
  );
}

function DocumentTile({ doc, onView }) {
  return (
    <button
      type="button"
      onClick={onView}
      className="flex w-[200px] shrink-0 flex-col overflow-hidden rounded-lg text-left ring-1 ring-foreground/10 transition-shadow hover:shadow-md"
    >
      <PdfThumbnail doc={doc} />
      <div className="flex flex-col gap-1 border-t border-foreground/10 p-3">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <FileText className="size-3.5 text-[#c4302b]" />
          Document · PDF
        </span>
        <span className="line-clamp-2 font-semibold text-foreground">{doc.title}</span>
      </div>
    </button>
  );
}

export function DocumentsCard({ documents, onChange }) {
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(documents);
  const [newTitle, setNewTitle] = useState("");
  const [viewing, setViewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);

  const openEdit = () => {
    setDraft(documents);
    setNewTitle("");
    setEditOpen(true);
  };

  const addDocument = () => {
    const title = newTitle.trim();
    if (!title) return;
    setDraft([...draft, { id: createDocId(), title, ...generatePlaceholderDocument() }]);
    setNewTitle("");
  };

  const renameDraft = (id, title) =>
    setDraft(draft.map((d) => (d.id === id ? { ...d, title } : d)));

  const handleSave = () => {
    onChange(draft.filter((d) => d.title.trim()));
    setEditOpen(false);
  };

  const openViewer = (doc) => {
    setPage(1);
    setViewing(doc);
  };

  return (
    <Card className="break-inside-avoid">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl">Documents</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={openEdit}
          aria-label="Edit documents"
          className="print:hidden"
        >
          {documents.length === 0 ? <Plus className="size-4" /> : <Pencil className="size-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <button
            type="button"
            onClick={openEdit}
            className="text-sm font-semibold text-[#0a66c2] hover:underline print:hidden"
          >
            Add documents
          </button>
        ) : (
          <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
            {documents.map((doc) => (
              <DocumentTile key={doc.id} doc={doc} onView={() => openViewer(doc)} />
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit documents</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="doc-title">Document name</Label>
            <div className="flex gap-2">
              <Input
                id="doc-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Portfolio 2026"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDocument();
                  }
                }}
              />
              <Button type="button" onClick={addDocument} disabled={!newTitle.trim()}>
                <Plus className="size-4" />
                Add
              </Button>
            </div>
          </div>
          <div className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto pt-1">
            {draft.length === 0 && (
              <p className="text-sm text-muted-foreground">No documents yet.</p>
            )}
            {draft.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2">
                <FileText className="size-4 shrink-0 text-[#c4302b]" />
                <Input
                  value={doc.title}
                  onChange={(e) => renameDraft(doc.id, e.target.value)}
                  aria-label="Document name"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDraft(draft.filter((d) => d.id !== doc.id))}
                  aria-label={`Remove ${doc.title}`}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-8">{viewing.title}</DialogTitle>
              </DialogHeader>
              <div className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
                <PdfThumbnail doc={viewing} page={page} large />
              </div>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDeleteId(viewing.id);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  {page} / {viewing.pageCount}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(viewing.pageCount, p + 1))}
                    disabled={page === viewing.pageCount}
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete this document?"
        description="This removes the document from your profile. This can't be undone."
        onConfirm={() => {
          onChange(documents.filter((d) => d.id !== deleteId));
          setViewing(null);
        }}
        confirmLabel="Delete"
      />
    </Card>
  );
}
