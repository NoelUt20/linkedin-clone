"use client";

import { useRef, useState } from "react";
import { Camera, Globe, Mail, MapPin, Pencil, Phone } from "lucide-react";

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
      <div className="break-inside-avoid overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div
          className="relative h-48 w-full bg-[linear-gradient(120deg,#9fb8c8,#c9d6da)] bg-cover bg-center"
          style={
            profile.banner ? { backgroundImage: `url(${profile.banner})` } : undefined
          }
        >
          <button
            type="button"
            onClick={openEdit}
            aria-label="Edit background banner"
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-background print:hidden"
          >
            <Camera className="size-4" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="relative -mt-16 flex items-end justify-between">
            <div className="relative">
              <Avatar className="size-32 border-4 border-card bg-card [&_[data-slot=avatar-fallback]]:text-3xl">
                <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
                <AvatarFallback>{initials(profile.name || "?")}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={openEdit}
                aria-label="Edit profile photo"
                className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow hover:bg-muted print:hidden"
              >
                <Camera className="size-4" />
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={openEdit}
              aria-label="Edit intro"
              className="mb-2 print:hidden"
            >
              <Pencil className="size-5" />
            </Button>
          </div>

          <div className="mt-4">
            {profile.name ? (
              <h1 className="text-2xl font-semibold text-foreground">{profile.name}</h1>
            ) : (
              <button
                type="button"
                onClick={openEdit}
                className="block text-lg font-semibold text-[#0a66c2] hover:underline print:hidden"
              >
                Add your name
              </button>
            )}
            {profile.headline && (
              <p className="mt-1 text-base text-foreground/90">{profile.headline}</p>
            )}
            {profile.location && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {profile.location}
              </p>
            )}
            <button
              type="button"
              onClick={openContact}
              className="mt-2 text-sm font-semibold text-[#0a66c2] hover:underline print:hidden"
            >
              Contact info
            </button>
            {(profile.contact.email || profile.contact.phone || profile.contact.website) && (
              <div className="mt-2 hidden flex-col gap-0.5 text-sm text-foreground/80 print:flex">
                {profile.contact.email && <span>{profile.contact.email}</span>}
                {profile.contact.phone && <span>{profile.contact.phone}</span>}
                {profile.contact.website && <span>{profile.contact.website}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

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
