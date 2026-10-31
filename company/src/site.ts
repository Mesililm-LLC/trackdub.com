export const site = {
  name: "Mesilim",
  origin: "https://mesilim.org",
  // Keep homepage navigation away from the old root 301 cached by returning browsers.
  homeHref: "/?home=mesilim",
  productOrigin: "https://trackdub.com",
  github: "https://github.com/MesilimLLC",
  description:
    "Tools for creators and developers, from the Trackdub dubbing workstation to open source inference, shell tooling, and agent memory.",
} as const;
