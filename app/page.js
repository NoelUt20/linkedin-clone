"use client";

import { useState } from "react";
import { Download, TriangleAlert, Trash2 } from "lucide-react";

import { AboutCard } from "@/components/profile/about-card";
import { ConfirmDeleteDialog } from "@/components/profile/confirm-delete-dialog";
import { EducationCard } from "@/components/profile/education-card";
import { ExperienceCard } from "@/components/profile/experience-card";
import { IntroCard } from "@/components/profile/intro-card";
import { ProfileTabBar } from "@/components/profile/profile-tab-bar";
import { SkillsCard } from "@/components/profile/skills-card";
import { Button } from "@/components/ui/button";
import { emptyProfile } from "@/data/empty-profile";
import { initialProfile } from "@/data/initial-profile";
import { useProfilesStorage } from "@/lib/use-profiles-storage";

export default function ProfilePage() {
  const {
    profiles,
    activeId,
    activeProfile,
    hydrated,
    saveError,
    setActiveId,
    updateActiveData,
    addProfile,
    removeProfile,
    resetActiveData,
  } = useProfilesStorage(initialProfile, emptyProfile);

  const [resetOpen, setResetOpen] = useState(false);
  const [closeTabId, setCloseTabId] = useState(null);

  if (!hydrated || !activeProfile) {
    return <div className="min-h-screen bg-[#f4f2ee]" />;
  }

  const profile = activeProfile.data;
  const slug = profile.name.trim() ? profile.name.toLowerCase().replace(/\s+/g, "-") : "your-name";

  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      <header className="border-b border-black/10 bg-white print:hidden">
        <div className="mx-auto flex h-14 max-w-[1128px] items-center px-4">
          <span className="text-xl font-bold text-[#0a66c2]">in</span>
        </div>
      </header>

      <div className="mx-auto max-w-[1128px] print:hidden">
        <ProfileTabBar
          profiles={profiles}
          activeId={activeId}
          onSwitch={setActiveId}
          onAdd={addProfile}
          onRemove={(id) => setCloseTabId(id)}
        />
      </div>

      <main className="mx-auto grid max-w-[1128px] grid-cols-1 gap-4 px-4 pb-6 print:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4">
          {saveError && (
            <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive print:hidden">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <p>{saveError}</p>
            </div>
          )}
          <div className="flex justify-end gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download className="size-4" />
              Export to PDF
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setResetOpen(true)}>
              <Trash2 className="size-4" />
              Delete all
            </Button>
          </div>

          <IntroCard profile={profile} onChange={updateActiveData} />
          <AboutCard
            about={profile.about}
            onChange={(about) => updateActiveData((d) => ({ ...d, about }))}
          />
          <ExperienceCard
            experience={profile.experience}
            onChange={(experience) => updateActiveData((d) => ({ ...d, experience }))}
          />
          <EducationCard
            education={profile.education}
            onChange={(education) => updateActiveData((d) => ({ ...d, education }))}
          />
          <SkillsCard
            skills={profile.skills}
            onChange={(skills) => updateActiveData((d) => ({ ...d, skills }))}
          />
        </div>

        <aside className="hidden flex-col gap-4 print:hidden lg:flex">
          <div className="rounded-xl bg-card p-4 text-sm ring-1 ring-foreground/10">
            <h2 className="mb-2 font-semibold text-foreground">Profile language</h2>
            <p className="text-foreground/80">English</p>
          </div>
          <div className="rounded-xl bg-card p-4 text-sm ring-1 ring-foreground/10">
            <h2 className="mb-2 font-semibold text-foreground">Public profile & URL</h2>
            <p className="truncate text-[#0a66c2]">www.linkedin.com/in/{slug}</p>
          </div>
        </aside>
      </main>

      <ConfirmDeleteDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Delete all profile data?"
        description="This clears every field in this profile — intro, about, experience, education, and skills. This can't be undone."
        onConfirm={resetActiveData}
        confirmLabel="Delete all"
      />

      <ConfirmDeleteDialog
        open={closeTabId !== null}
        onOpenChange={(open) => !open && setCloseTabId(null)}
        title="Close this profile?"
        description="This permanently deletes this profile and all of its data. This can't be undone."
        onConfirm={() => removeProfile(closeTabId)}
        confirmLabel="Close profile"
      />
    </div>
  );
}
