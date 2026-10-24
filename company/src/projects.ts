export const projects = [
  {
    slug: "linml",
    name: "LinML",
    number: "01",
    category: "Inference",
    mark: "λ",
    headline: "Run ONNX models on Linux.",
    summary: "ONNX Runtime tooling for Linux, with explicit provider selection and diagnostics.",
    source: "https://github.com/mesalimllc/LinML",
    docs: "https://github.com/mesalimllc/LinML#readme",
    secondary: "https://github.com/mesalimllc/LinML#readme",
    secondaryLabel: "Packages & documentation",
    audience: "Inference developers",
    interface: "CLI / .NET packages",
    status: "Check current provider support",
    introduction:
      "Bring provider discovery, explicit selection, inference, and diagnostics into a Linux-oriented ONNX Runtime workflow.",
    capabilities: [
      "Discover execution providers and inspect readiness.",
      "Select the provider intended for the workload.",
      "Inspect outputs and runtime diagnostics.",
    ],
    diagram: ["ONNX model + inputs", "Provider selection + runtime", "Outputs + diagnostics"],
    tags: ["Discovery", "Selection", "Diagnostics"],
    limitations:
      "Provider and platform support depend on the current release. LinML is independent software, not an official Microsoft product or a Microsoft-endorsed project. Follow the repository for supported configurations and installation guidance.",
  },
  {
    slug: "numan",
    name: "Numan",
    number: "02",
    category: "Nushell",
    mark: "nu",
    headline: "Manage your Nushell packages.",
    summary: "Package management for Nushell plugins, modules, scripts, and completions.",
    source: "https://github.com/numan-cli/numan",
    docs: "https://github.com/numan-cli/numan#readme",
    secondary: "https://numan-cli.github.io/numan-registry/",
    secondaryLabel: "Browse the registry",
    audience: "Nushell users",
    interface: "Packages / registry / lockfiles",
    status: "Early stage",
    introduction:
      "Install Nushell packages from signed registries, verify downloaded artifacts, and record install state in a lockfile. Installed packages stay inert until you choose supported activation steps.",
    capabilities: [
      "Install and verify plugins, modules, scripts, and completions.",
      "Keep immutable package state in reproducible lockfiles.",
      "Activate plugins and modules explicitly; enable hook packages separately.",
    ],
    diagram: [
      "Signed registry + artifact verification",
      "Inert install + lockfile",
      "Explicit activation or hook enable",
    ],
    tags: ["Plugins", "Modules", "Scripts", "Completions"],
    limitations:
      "Numan is an early-stage project. Installation does not execute packages or change Nushell configuration. Plugins and modules use explicit activation; hook profiles require separate enabling. Scripts and completion packages are install-only. Check the repository for current compatibility and support boundaries.",
  },
  {
    slug: "lucid-mem",
    name: "lucid-mem",
    number: "03",
    category: "Agent memory",
    mark: "mem",
    headline: "Carry context between coding sessions.",
    summary:
      "Git-backed memory for AI coding agents, across sessions and projects through hooks and MCP integrations.",
    source: "https://github.com/tonythethompson/lucid-mem",
    docs: "https://github.com/tonythethompson/lucid-mem#readme",
    secondary: "https://www.npmjs.com/package/lucid-mem",
    secondaryLabel: "View the npm package",
    audience: "AI coding agent users",
    interface: "CLI / hooks / MCP",
    status: "Host integration required",
    introduction:
      "Retrieve useful context, save durable project knowledge, and maintain a Git-backed memory repository with the Agent Memory Repo workflow.",
    capabilities: [
      "Retrieve context through configured session hooks and MCP.",
      "Let agents save durable preferences and project knowledge.",
      "Maintain and sync memory through a Git workflow you control.",
    ],
    diagram: ["Retrieve session context", "Save durable knowledge", "Maintain + sync through Git"],
    tags: ["Sessions", "Projects", "Hooks", "MCP"],
    limitations:
      "Saving depends on agent judgment and host integration. Review the repository for current host support and memory handling. Public source code does not make your memory public; choose a private memory remote and review what you store. Memory retrieval does not guarantee perfect recall or protect every secret automatically.",
  },
] as const;

export type Project = (typeof projects)[number];
