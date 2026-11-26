"use client";

import { useState } from "react";
import { Award, Briefcase, Download, GraduationCap, TriangleAlert, Trash2 } from "lucide-react";

import { AboutCard } from "@/components/profile/about-card";
import { CertificationsCard } from "@/components/profile/certifications-card";
import { ConfirmDeleteDialog } from "@/components/profile/confirm-delete-dialog";
import { EducationCard } from "@/components/profile/education-card";
import { ExperienceCard } from "@/components/profile/experience-card";
import { IntroCard } from "@/components/profile/intro-card";
import { MobileTopBar } from "@/components/profile/mobile-chrome";
import { ProfileTabBar } from "@/components/profile/profile-tab-bar";
import { SkillsCard } from "@/components/profile/skills-card";
import { ThemeToggle } from "@/components/profile/theme-toggle";
import { Button } from "@/components/ui/button";
import { companies } from "@/data/companies";
import { emptyProfile } from "@/data/empty-profile";
import { schools } from "@/data/schools";
import { displayLogo } from "@/lib/logo";
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
  } = useProfilesStorage(emptyProfile, emptyProfile);

  const [resetOpen, setResetOpen] = useState(false);
  const [closeTabId, setCloseTabId] = useState(null);

  if (!hydrated || !activeProfile) {
    return <div className="min-h-screen bg-page" />;
  }

  const profile = activeProfile.data;
  const certifications = profile.certifications ?? [];
  // Everything a skill can be tagged on, for the Skills section's "used at" lists.
  const skillSources = [
    ...profile.experience.map((item) => ({
      id: item.id,
      name: `${item.title} at ${item.company}`,
      logo: displayLogo(companies, item.company, item.logo),
      icon: <Briefcase className="text-muted-foreground" />,
      skills: item.skills,
    })),
    ...profile.education.map((item) => ({
      id: item.id,
      name: item.school,
      logo: displayLogo(schools, item.school, item.logo),
      icon: <GraduationCap className="text-muted-foreground" />,
      skills: item.skills,
    })),
    ...certifications.map((item) => ({
      id: item.id,
      name: item.name,
      logo: item.logo,
      icon: <Award className="text-muted-foreground" />,
      skills: item.skills,
    })),
  ];
  const slug = profile.name.trim() ? profile.name.toLowerCase().replace(/\s+/g, "-") : "your-name";

  return (
    <div className="min-h-screen bg-page">
      <MobileTopBar
        profiles={profiles}
        activeId={activeId}
        onSwitch={setActiveId}
        onAdd={addProfile}
        onRemove={(id) => setCloseTabId(id)}
        onExport={() => window.print()}
        onDeleteAll={() => setResetOpen(true)}
      />
      <header className="hidden border-b border-border bg-card sm:block print:hidden">
        <div className="mx-auto flex h-14 max-w-[1128px] items-center justify-between px-4">
          <span className="text-xl font-bold text-link">in</span>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto hidden max-w-[1128px] sm:block print:hidden">
        <ProfileTabBar
          profiles={profiles}
          activeId={activeId}
          onSwitch={setActiveId}
          onAdd={addProfile}
          onRemove={(id) => setCloseTabId(id)}
        />
      </div>

      <main className="mx-auto grid max-w-[1128px] grid-cols-1 gap-2 pb-6 sm:px-4 print:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-2">
          {saveError && (
            <div className="flex items-start gap-2 bg-destructive/10 p-4 text-sm text-destructive sm:rounded-xl print:hidden">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <p>{saveError}</p>
            </div>
          )}
          <div className="hidden justify-end gap-2 sm:flex print:hidden">
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
            manualOrder={profile.manualOrder?.experience ?? false}
            onChange={(experience, manual) =>
              updateActiveData((d) => ({
                ...d,
                experience,
                manualOrder: { ...d.manualOrder, experience: manual },
              }))
            }
          />
          <EducationCard
            education={profile.education}
            manualOrder={profile.manualOrder?.education ?? false}
            onChange={(education, manual) =>
              updateActiveData((d) => ({
                ...d,
                education,
                manualOrder: { ...d.manualOrder, education: manual },
              }))
            }
          />
          <CertificationsCard
            certifications={certifications}
            onChange={(certifications) => updateActiveData((d) => ({ ...d, certifications }))}
          />
          <SkillsCard
            skills={profile.skills}
            sources={skillSources}
            onChange={(skills) => updateActiveData((d) => ({ ...d, skills }))}
          />
        </div>

        <aside className="hidden flex-col gap-2 print:hidden lg:flex">
          <div className="rounded-lg bg-card p-4 text-sm ring-1 ring-foreground/10">
            <h2 className="mb-2 font-semibold text-foreground">Profile language</h2>
            <p className="text-foreground/80">English</p>
          </div>
          <div className="rounded-lg bg-card p-4 text-sm ring-1 ring-foreground/10">
            <h2 className="mb-2 font-semibold text-foreground">Public profile & URL</h2>
            <p className="truncate text-link">www.linkedin.com/in/{slug}</p>
          </div>
        </aside>
      </main>

      <ConfirmDeleteDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Delete all profile data?"
        description="This clears every field in this profile — intro, about, experience, education, certifications, and skills. This can't be undone."
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
