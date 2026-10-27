"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generatePlaceholderDocument } from "@/lib/generate-placeholder-text";

// A fake PDF page: real files aren't uploaded, so the thumbnail is just the
// document's generated filler text laid out like a page.
function DocumentPage({ document, page }) {
  // Rotate the filler paragraphs so each "page" in the viewer looks different.
  const offset = (page - 1) % document.paragraphs.length;
  const paragraphs = [
    ...document.paragraphs.slice(offset),
    ...document.paragraphs.slice(0, offset),
  ];
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e5df] p-3">
      <div className="h-full overflow-hidden rounded-sm bg-white p-8 shadow-sm">
        {page === 1 && (
          <>
            <p className="mb-1.5 text-xl font-bold leading-tight text-neutral-900">
              {document.heading}
            </p>
            <div className="mb-2 h-px bg-neutral-900/15" />
          </>
        )}
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="mb-3 text-[13px] leading-[1.4] text-neutral-600">
            {paragraph}
          </p>
        ))}
      </div>
      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
        Page {page}
      </span>
    </div>
  );
}

// Landscape cover-page thumbnail shown under an experience/education entry,
// like the media attachments on a LinkedIn profile.
function DocumentThumbnail({ document }) {
  return (
    <div className="flex h-[88px] w-[134px] shrink-0 flex-col items-center justify-center gap-[3px] overflow-hidden rounded-lg bg-white px-3 text-center ring-1 ring-foreground/15">
      <p className="text-[4px] leading-none text-neutral-500">{document.paragraphs[0].slice(0, 40)}</p>
      <p className="text-[6px] font-bold leading-tight text-neutral-900">{document.title}</p>
      <p className="text-[4.5px] font-semibold leading-tight text-neutral-700">{document.heading}</p>
      <p className="mt-1 text-[3.5px] leading-tight text-neutral-500">
        {document.paragraphs[1].slice(0, 90)}
      </p>
    </div>
  );
}

export function DocumentAttachment({ document }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPage(1);
          setOpen(true);
        }}
        className="mt-3 flex items-center gap-4 rounded-lg text-left hover:opacity-90"
      >
        <DocumentThumbnail document={document} />
        <span className="font-semibold text-foreground">{document.title}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="pr-8">{document.title}</DialogTitle>
          </DialogHeader>
          <div className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
            <DocumentPage document={document} page={page} />
          </div>
          <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            {page} / {document.pageCount}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((p) => Math.min(document.pageCount, p + 1))}
              disabled={page === document.pageCount}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Checkbox + name field for the experience/education edit dialogs. Checking it
// attaches a document with freshly generated filler text; unchecking removes it.
export function DocumentAttachmentField({ id, document, onChange }) {
  return (
    <div className="grid gap-2">
      <label className="flex items-center gap-2 text-sm text-foreground/90">
        <input
          type="checkbox"
          className="size-4"
          checked={document !== null}
          onChange={(e) =>
            onChange(e.target.checked ? { title: "", ...generatePlaceholderDocument() } : null)
          }
        />
        Attach a document
      </label>
      {document && (
        <div className="grid gap-1.5">
          <Label htmlFor={id}>Document name*</Label>
          <Input
            id={id}
            value={document.title}
            onChange={(e) => onChange({ ...document, title: e.target.value })}
            placeholder="e.g. Private Equity and the LBO process"
          />
        </div>
      )}
    </div>
  );
}

// A document with no name isn't worth showing — drop it on save.
export function cleanDocument(document) {
  return document?.title.trim() ? { ...document, title: document.title.trim() } : null;
}
