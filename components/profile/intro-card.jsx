"use client";

import { useRef, useState } from "react";
import { Globe, Mail, Pencil, Phone, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { resizeImageToDataUrl } from "@/lib/resize-image";

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function IntroCard({ profile, onChange }) {
  const [editOpen, setEditOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [contactDraft, setContactDraft] = useState(profile.contact);
  const bannerInputRef = useRef(null);
  const currentCompany = (
    profile.experience.find((item) => item.current) ?? profile.experience[0]
  )?.company;
  const latestSchool = profile.education[0]?.school;
  const avatarInputRef = useRef(null);

  const openEdit = () => {
    setDraft(profile);
    setEditOpen(true);
  };

  const openContact = () => {
    setContactDraft(profile.contact);
    setContactOpen(true);
  };

  const handleBannerFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImageToDataUrl(file, { maxWidth: 1200, maxHeight: 400 });
    setDraft((d) => ({ ...d, banner: dataUrl }));
    e.target.value = "";
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImageToDataUrl(file, { maxWidth: 400, maxHeight: 400 });
    setDraft((d) => ({ ...d, avatar: dataUrl }));
    e.target.value = "";
  };

  const handleSave = () => {
    if (!draft.name.trim()) return;
    onChange({ ...draft });
    setEditOpen(false);
  };

  const handleContactSave = () => {
    onChange({ ...profile, contact: contactDraft });
    setContactOpen(false);
  };

  return (
    <>
      <section className="break-inside-avoid overflow-hidden bg-card sm:rounded-lg sm:ring-1 sm:ring-foreground/10">
        <div
          className="relative aspect-[4/1] w-full bg-[linear-gradient(120deg,#9fb8c8,#c9d6da)] bg-cover bg-center"
          style={
            profile.banner ? { backgroundImage: `url(${profile.banner})` } : undefined
          }
        >
          <button
            type="button"
            onClick={openEdit}
            aria-label="Edit background banner"
            className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white text-black shadow-sm hover:bg-white/90 print:hidden"
          >
            <Pencil className="size-5" strokeWidth={2} />
          </button>
        </div>

        <div className="px-4 pb-5 sm:px-6">
          {/* The photo's centre sits on the banner's bottom edge. */}
          <div className="flex items-start justify-between">
            <Avatar className="-mt-[52px] size-[104px] border-4 border-white bg-card dark:border-black sm:-mt-[68px] sm:size-[136px] [&_[data-slot=avatar-fallback]]:text-3xl">
              <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
              <AvatarFallback>{initials(profile.name || "?")}</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={openEdit}
              aria-label="Edit intro"
              className="-mr-2 mt-3 print:hidden"
            >
              <Pencil className="size-6" strokeWidth={1.5} />
            </Button>
          </div>

          <div className="mt-3">
            {profile.name ? (
              <h1 className="flex items-center gap-2 text-2xl font-semibold leading-tight text-foreground">
                {profile.name}
                {profile.verified && (
                  <ShieldCheck
                    className="size-6 shrink-0 text-muted-foreground"
                    strokeWidth={1.75}
                    aria-label="Verified"
                  />
                )}
              </h1>
            ) : (
              <button
                type="button"
                onClick={openEdit}
                className="block text-lg font-semibold text-link hover:underline print:hidden"
              >
                Add your name
              </button>
            )}
            {profile.headline && (
              <p className="mt-1 text-base leading-snug text-foreground">{profile.headline}</p>
            )}
            {(currentCompany || latestSchool) && (
              <p className="mt-1 text-base leading-snug text-foreground">
                {[currentCompany, latestSchool].filter(Boolean).join(" · ")}
              </p>
            )}
            {profile.location && (
              <p className="mt-1 text-base leading-snug text-muted-foreground">{profile.location}</p>
            )}
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-base">
              {profile.connections && (
                <>
                  <span className="font-semibold text-link">{profile.connections} connections</span>
                  <span className="text-muted-foreground print:hidden">·</span>
                </>
              )}
              <button
                type="button"
                onClick={openContact}
                className="font-semibold text-link hover:underline print:hidden"
              >
                Contact info
              </button>
            </p>
            {(profile.contact.email || profile.contact.phone || profile.contact.website) && (
              <div className="mt-2 hidden flex-col gap-0.5 text-sm text-foreground/80 print:flex">
                {profile.contact.email && <span>{profile.contact.email}</span>}
                {profile.contact.phone && <span>{profile.contact.phone}</span>}
                {profile.contact.website && <span>{profile.contact.website}</span>}
              </div>
            )}
          </div>
        </div>
      </section>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit intro</DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1">
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col items-center gap-2">
                <Avatar className="size-20">
                  <AvatarImage src={draft.avatar || undefined} alt={draft.name} />
                  <AvatarFallback>{initials(draft.name || "?")}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  Change photo
                </Button>
                {draft.avatar && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:underline"
                    onClick={() => setDraft((d) => ({ ...d, avatar: null }))}
                  >
                    Remove photo
                  </button>
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFile}
                />
              </div>
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="h-20 w-full rounded-md bg-[linear-gradient(120deg,#9fb8c8,#c9d6da)] bg-cover bg-center"
                  style={
                    draft.banner ? { backgroundImage: `url(${draft.banner})` } : undefined
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => bannerInputRef.current?.click()}
                >
                  Change banner
                </Button>
                {draft.banner && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:underline"
                    onClick={() => setDraft((d) => ({ ...d, banner: null }))}
                  >
                    Remove banner
                  </button>
                )}
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerFile}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="intro-name">Name*</Label>
              <Input
                id="intro-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="intro-headline">Headline</Label>
              <Input
                id="intro-headline"
                value={draft.headline}
                onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="intro-location">Location</Label>
              <Input
                id="intro-location"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="intro-connections">Connections</Label>
              <Input
                id="intro-connections"
                value={draft.connections ?? ""}
                onChange={(e) => setDraft({ ...draft, connections: e.target.value })}
                placeholder="500+"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground/90">
              <input
                type="checkbox"
                className="size-4"
                checked={Boolean(draft.verified)}
                onChange={(e) => setDraft({ ...draft, verified: e.target.checked })}
              />
              Show verified badge
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!draft.name.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{profile.name} — Contact Info</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid gap-1.5">
              <Label
                htmlFor="contact-email"
                className="flex items-center gap-2 text-xs uppercase text-muted-foreground"
              >
                <Mail className="size-3.5" /> Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={contactDraft.email}
                onChange={(e) =>
                  setContactDraft({ ...contactDraft, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label
                htmlFor="contact-phone"
                className="flex items-center gap-2 text-xs uppercase text-muted-foreground"
              >
                <Phone className="size-3.5" /> Phone
              </Label>
              <Input
                id="contact-phone"
                value={contactDraft.phone}
                onChange={(e) =>
                  setContactDraft({ ...contactDraft, phone: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label
                htmlFor="contact-website"
                className="flex items-center gap-2 text-xs uppercase text-muted-foreground"
              >
                <Globe className="size-3.5" /> Website
              </Label>
              <Input
                id="contact-website"
                value={contactDraft.website}
                onChange={(e) =>
                  setContactDraft({ ...contactDraft, website: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleContactSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
