"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Download,
  Moon,
  Plus,
  Settings,
  Sun,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/components/profile/theme-toggle";
import { initials } from "@/lib/initials";
import { cn } from "@/lib/utils";

// Every profile created in the app, opened from the back arrow — the phone
// stand-in for the desktop tab bar.
function ProfilesMenu({ open, onOpenChange, profiles, activeId, onSwitch, onAdd, onRemove }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Profiles ({profiles.length})</DialogTitle>
        </DialogHeader>
        <ul className="-mx-2 flex max-h-[60vh] flex-col overflow-y-auto">
          {profiles.map(({ id, data }) => {
            const name = data.name?.trim() || "New profile";
            const isActive = id === activeId;
            return (
              <li key={id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onSwitch(id);
                    onOpenChange(false);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-foreground/5",
                    isActive && "bg-foreground/5"
                  )}
                >
                  <Avatar className="size-11">
                    <AvatarImage src={data.avatar || undefined} alt="" />
                    <AvatarFallback>{initials(name)}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-semibold text-foreground">
                      {name}
                    </span>
                    {data.headline && (
                      <span className="block truncate text-sm text-muted-foreground">
                        {data.headline}
                      </span>
                    )}
                  </span>
                  {isActive && <Check className="size-5 shrink-0 text-link" />}
                </button>
                {profiles.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onOpenChange(false);
                      onRemove(id);
                    }}
                    aria-label={`Delete ${name}`}
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
        <Button
          variant="outline"
          onClick={() => {
            onAdd();
            onOpenChange(false);
          }}
        >
          <Plus className="size-4" />
          New profile
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Phone-only app chrome modelled on LinkedIn's mobile app. The back arrow
// lists the app's profiles; search is decorative; the gear
// opens the settings that live in the desktop header (theme, export, delete).
export function MobileTopBar({ profiles, activeId, onSwitch, onAdd, onRemove, onExport, onDeleteAll }) {
  const [profilesOpen, setProfilesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dark, toggleTheme] = useTheme();

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b-8 border-page bg-card px-3 py-2 sm:hidden print:hidden">
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={() => setProfilesOpen(true)}
          aria-label="All profiles"
        >
          <ArrowLeft className="size-6" strokeWidth={1.75} />
        </Button>
        <div className="flex h-9 flex-1 items-center rounded-full border border-foreground/40 px-4 text-base text-muted-foreground">
          Search
        </div>
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          <Settings className="size-6" strokeWidth={1.75} />
        </Button>
      </div>

      <ProfilesMenu
        open={profilesOpen}
        onOpenChange={setProfilesOpen}
        profiles={profiles}
        activeId={activeId}
        onSwitch={onSwitch}
        onAdd={onAdd}
        onRemove={onRemove}
      />

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start" onClick={toggleTheme}>
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {dark ? "Switch to light mode" : "Switch to dark mode"}
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                setSettingsOpen(false);
                // Let the dialog close before the print dialog snapshots the page.
                setTimeout(onExport, 150);
              }}
            >
              <Download className="size-4" />
              Export to PDF
            </Button>
            <Button
              variant="destructive"
              className="justify-start"
              onClick={() => {
                setSettingsOpen(false);
                onDeleteAll();
              }}
            >
              <Trash2 className="size-4" />
              Delete all
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
