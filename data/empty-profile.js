export const emptyProfile = {
  banner: null,
  avatar: null,
  name: "",
  verified: false,
  headline: "",
  location: "",
  connections: "",
  contact: {
    email: "",
    phone: "",
    website: "",
  },
  about: "",
  experience: [],
  education: [],
  // Set when the user reorders a section by hand; otherwise it follows the dates.
  manualOrder: { experience: false, education: false },
  certifications: [],
  skills: [],
};
