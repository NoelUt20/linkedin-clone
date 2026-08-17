"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "linkedin-clone-profiles-v1";
const LEGACY_KEY = "linkedin-clone-profile";

let idCounter = 0;
function createId() {
  idCounter += 1;
  return `profile-${Date.now()}-${idCounter}`;
}

export function useProfilesStorage(initialProfile, emptyProfile) {
  const [profiles, setProfiles] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.profiles?.length) {
          setProfiles(parsed.profiles);
          setActiveId(parsed.activeId ?? parsed.profiles[0].id);
          setHydrated(true);
          // Data already lives under the current key — the old single-profile
          // key, if it's still around, is dead weight eating into the quota.
          window.localStorage.removeItem(LEGACY_KEY);
          return;
        }
      }
      const legacy = window.localStorage.getItem(LEGACY_KEY);
      const data = legacy ? JSON.parse(legacy) : initialProfile;
      const id = createId();
      setProfiles([{ id, data }]);
      setActiveId(id);
      // Migrated (or nothing to migrate) — safe to drop the legacy key now.
      window.localStorage.removeItem(LEGACY_KEY);
    } catch (error) {
      console.error("Failed to load profiles from localStorage", error);
      const id = createId();
      setProfiles([{ id, data: initialProfile }]);
      setActiveId(id);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles, activeId }));
      setSaveError(null);
    } catch (error) {
      console.error("Failed to save profiles to localStorage", error);
      setSaveError(
        error.name === "QuotaExceededError"
          ? "Your changes aren't being saved — browser storage is full. Try removing an uploaded photo or logo, or deleting an unused profile."
          : "Your changes aren't being saved. Your browser may be blocking local storage (private browsing, or storage disabled)."
      );
    }
  }, [profiles, activeId, hydrated]);

  useEffect(() => {
    function handleStorage(e) {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        setProfiles(parsed.profiles);
        setActiveId(parsed.activeId);
      } catch (error) {
        console.error("Failed to sync profiles from another tab", error);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const activeProfile = profiles.find((p) => p.id === activeId) ?? profiles[0] ?? null;

  const updateActiveData = (updater) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeId
          ? { ...p, data: typeof updater === "function" ? updater(p.data) : updater }
          : p
      )
    );
  };

  const addProfile = () => {
    const id = createId();
    setProfiles((prev) => [...prev, { id, data: emptyProfile }]);
    setActiveId(id);
  };

  const removeProfile = (id) => {
    if (profiles.length <= 1) return;
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    setActiveId((prevActiveId) => {
      if (prevActiveId !== id) return prevActiveId;
      const remaining = profiles.filter((p) => p.id !== id);
      return remaining[0]?.id ?? prevActiveId;
    });
  };

  const resetActiveData = () => {
    updateActiveData(() => emptyProfile);
  };

  return {
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
  };
}
