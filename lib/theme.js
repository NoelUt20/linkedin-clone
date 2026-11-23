export const THEME_STORAGE_KEY = "linkedin-clone-theme";

// Runs in <head> before first paint so a saved (or system) dark preference
// never flashes light first.
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`;
