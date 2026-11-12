// status: published | review | preprint | ongoing | report
export const research = [
  {
    title: "Seam Exploitation in Agentic AI Stacks: An Empirical Study of Cross-Protocol Attack Chaining Across MCP and A2A",
    year: 2026,
    status: "review",
    venue: "Submitted to AAIRJ",
    area: "AI security",
    abstract:
      "MCP and A2A are each analysed in isolation, but real agent stacks join them. The seam between A2A task delegation and MCP tool calls is where identity, token scope and revocation signals should propagate, and in a baseline configuration they don't. I built a reproducible testbed and measured four cross-protocol attack chains over 30 trials each.",
    findings: [
      "Token scope bleeds from a read-only MCP server to an admin one.",
      "A forged A2A agent card is accepted without verification.",
      "MCP echo output re-routes A2A delegation (cross-protocol prompt injection).",
      "Privileges persist in A2A state after MCP revocation.",
    ],
    links: [{ label: "Testbed", url: "https://github.com/IamdLite/Seam-Exploitation-in-Agentic-AI-Stacks", icon: "simple-icons:github" }],
    project: "/projects/seam-exploitation",
  },
  {
    title: "Understanding Employee Vulnerability to Social Engineering: A Systematic Literature Review",
    year: 2026,
    status: "published",
    venue: "AAIRJ · Feb 2026",
    area: "Human factors",
    abstract:
      "A systematic literature review of what makes some employees more susceptible to social engineering than others, covering personality traits, workload, training and organisational culture.",
    findings: [],
    links: [{ label: "ORCID", url: "https://orcid.org/0009-0003-6958-9159/", icon: "simple-icons:orcid" }],
  },
  {
    title: "A Profiling Framework for Identifying Employees at High Risk of Social Engineering",
    year: 2026,
    status: "published",
    venue: "Presented at ICICPE · Jan 2026",
    area: "Human factors",
    abstract:
      "Builds on the literature review: a framework that profiles which employees are most likely to fall for social-engineering threats, so awareness training can be targeted where it matters.",
    findings: [],
    links: [{ label: "ORCID", url: "https://orcid.org/0009-0003-6958-9159/", icon: "simple-icons:orcid" }],
  },
  {
    title: "AI-Generated vs Human-Written Code: OWASP Top 10 Vulnerability Exposure",
    year: 2025,
    status: "ongoing",
    venue: "Group research proposal",
    area: "Secure software",
    abstract:
      "How do AI-generated and human-written code compare in exposure to OWASP Top 10 vulnerabilities? A comparative study design using static analysis and manual review.",
    findings: [],
    links: [],
  },
  {
    title: "GEAhancer: Evolutionary Generation of Creative Images Using a Polygon-Based Genetic Algorithm",
    year: 2025,
    status: "preprint",
    venue: "Open-source study",
    area: "Evolutionary computing",
    abstract:
      "Extends MedGA's medically validated evolutionary framework from pixel-level optimisation to populations of semi-transparent polygons, producing 512×512 artistic enhancements while keeping bimodal medical-image support.",
    findings: [],
    links: [{ label: "Code", url: "https://github.com/IamdLite/Genetic-Algorithm-Multimodal-Image-Enhancer", icon: "simple-icons:github" }],
    project: "/projects/geahancer",
  },
  {
    title: "Demystifying LockBit's Message to the FBI",
    year: 2024,
    status: "report",
    venue: "Threat-intelligence write-up",
    area: "Threat intel",
    abstract:
      "Breaks down LockBit's statement after Operation Cronos, the likely PHP CVE entry vector, and what security stakeholders should take from it.",
    findings: [],
    links: [{ label: "Report", url: "https://github.com/IamdLite/lockbit-message-fbi", icon: "simple-icons:github" }],
    project: "/projects/lockbit-analysis",
  },
  {
    title: "Developing a Nanosatellite in 6 Steps: GazpromNeftSat1",
    year: 2024,
    status: "published",
    venue: "Medium",
    area: "Space systems",
    abstract:
      "How I used the IDM suite (CIC, simu_CIC, VTS Timeloop) to design a CubeSat mission during the Gazprom Neft championship.",
    findings: [],
    links: [{ label: "Article", url: "https://iamdlite.medium.com/", icon: "simple-icons:medium" }],
  },
  {
    title: "MyHome Africa: Open Data on African Brain Drain",
    year: 2024,
    status: "report",
    venue: "NASA OLS Nebula pilot cohort",
    area: "Open science",
    abstract:
      "An open-science data collection platform that maps the African diaspora, helping aspiring emigrants find their communities and governments retain talent.",
    findings: [],
    links: [{ label: "Code", url: "https://github.com/IamdLite/myhome_africa", icon: "simple-icons:github" }],
  },
];

export const researchStatus = {
  published: { label: "Published", tone: "neon" },
  review: { label: "Under review", tone: "warn" },
  preprint: { label: "Preprint", tone: "ice" },
  ongoing: { label: "In progress", tone: "hot" },
  report: { label: "Report", tone: "dim" },
};
