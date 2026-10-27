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
  documents: [
    {
      id: "doc-1",
      title: "Design Portfolio 2026",
      heading: "Selected Work",
      paragraphs: [
        "A collection of product design projects spanning onboarding, billing, and design systems work. Each case study covers the problem, process, and measurable results.",
        "Northwind platform redesign reduced task completion time by 32% across core workflows. Research included 40 customer interviews and three rounds of usability testing.",
        "The Bright Labs billing flow was rebuilt from the ground up with a focus on clarity and trust. Support tickets related to invoices dropped by half within one quarter.",
        "Design system foundations covering tokens, components, and accessibility guidelines. Adopted by six product teams and over forty engineers.",
      ],
      pageCount: 18,
    },
    {
      id: "doc-2",
      title: "Accessibility Guidelines for Product Teams",
      heading: "Building for Everyone",
      paragraphs: [
        "Practical guidance for shipping accessible interfaces without slowing down delivery. Covers color contrast, focus states, and keyboard navigation patterns.",
        "Every interactive element should be reachable by keyboard and clearly announce its purpose. Test with a screen reader before each release.",
        "Color alone should never carry meaning in the interface. Pair status colors with icons or labels so the message survives for every reader.",
        "Motion should support understanding rather than decorate. Respect reduced motion settings and keep transitions short and purposeful.",
      ],
      pageCount: 9,
    },
  ],
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
