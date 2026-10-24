export const site = {
  name: "Mesalim",
  origin: "https://mesalim.com",
  // Keep homepage navigation away from the old root 301 cached by returning browsers.
  homeHref: "/?home=mesalim",
  productOrigin: "https://trackdub.com",
  github: "https://github.com/mesalimllc",
  description:
    "Tools for creators and developers, from the Trackdub dubbing workstation to open source inference, shell tooling, and agent memory.",
} as const;
