"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "linkedin-clone-profile";

export function useProfileStorage(initialProfile) {
  const [profile, setProfile] = useState(initialProfile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load profile from localStorage", error);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, hydrated]);

  useEffect(() => {
    function handleStorage(e) {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        setProfile(JSON.parse(e.newValue));
      } catch (error) {
        console.error("Failed to sync profile from another tab", error);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return [profile, setProfile, hydrated];
}
