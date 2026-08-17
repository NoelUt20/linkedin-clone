export const initialProfile = {
  banner: null,
  avatar: null,
  name: "Alex Morgan",
  headline: "Senior Product Designer at Northwind Studio",
  location: "San Francisco, California, United States",
  contact: {
    email: "alex.morgan@example.com",
    phone: "",
    website: "",
  },
  about:
    "Product designer with 8+ years of experience building human-centered software for startups and enterprise teams. I care about accessible, delightful interfaces and the systems that make them scalable.",
  experience: [
    {
      id: "exp-1",
      title: "Senior Product Designer",
      company: "Northwind Studio",
      employmentType: "Full-time",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "",
      current: true,
      description:
        "Leading design for the core platform team, partnering with engineering and product to ship end-to-end product experiences.",
      logo: null,
    },
    {
      id: "exp-2",
      title: "Product Designer",
      company: "Bright Labs",
      employmentType: "Full-time",
      location: "Remote",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      current: false,
      description:
        "Designed and shipped the onboarding and billing experiences for a B2B SaaS product used by 10,000+ teams.",
      logo: null,
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "University of California, Berkeley",
      degree: "Bachelor of Arts",
      fieldOfStudy: "Cognitive Science",
      startYear: "2015",
      endYear: "2019",
      description: "",
      logo: null,
    },
  ],
  skills: [
    "Product Design",
    "Figma",
    "Design Systems",
    "User Research",
    "Prototyping",
  ],
};
