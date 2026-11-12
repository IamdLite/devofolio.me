// Single source of truth for identity, links and headline numbers.
export const profile = {
  name: "iamdLite",
  handle: "iamdLite",
  email: "diffouo44@gmail.com",
  tagline:
    "I break systems so organisations can build resilient ones — red teaming, agentic-AI security research and space systems.",
  roles: [
    "Red Teamer",
    "Offensive Security Engineer",
    "Agentic AI Security Researcher",
    "Space Systems Enthusiast",
    "Community Builder",
  ],
  resumeUrl:
    "https://drive.google.com/file/d/1uaG7OOgPqH0F6uxM91eZwy4d2WLfFdl9/view?usp=drive_link",
  certificatesUrl:
    "https://drive.google.com/drive/folders/1k3ZZ0Ooud-PTJp0xSsnS__OepqoBnpc_?usp=sharing",
  orcid: "https://orcid.org/0009-0003-6958-9159/",
  community: "https://t.me/endOfilebitsociety",
};

export const socials = [
  { name: "GitHub", icon: "simple-icons:github", url: "https://github.com/IamdLite" },
  { name: "LinkedIn", icon: "simple-icons:linkedin", url: "https://www.linkedin.com/in/eofbit/" },
  { name: "X", icon: "simple-icons:x", url: "https://twitter.com/iamdlite" },
  { name: "Medium", icon: "simple-icons:medium", url: "https://iamdlite.medium.com/" },
  { name: "TryHackMe", icon: "simple-icons:tryhackme", url: "https://tryhackme.com/r/p/iamdlite" },
  { name: "ORCID", icon: "simple-icons:orcid", url: "https://orcid.org/0009-0003-6958-9159/" },
  { name: "Credly", icon: "simple-icons:credly", url: "https://www.credly.com/users/iamdlite" },
];

export const stats = [
  { value: 8000, suffix: "+", label: "people reached with cyber-safety campaigns" },
  { value: 5, suffix: "", label: "countries touched by eOfbit Society" },
  { value: 15, suffix: "+", label: "talks, keynotes & workshops" },
  { value: 7, suffix: "", label: "professional certifications" },
];

export const skills = [
  {
    group: "Offensive security",
    icon: "ph:skull-bold",
    items: ["Red team ops", "C2 infrastructure", "AV/EDR evasion", "Active Directory", "OWASP Top 10", "Malware development", "Social engineering"],
  },
  {
    group: "AI & agent security",
    icon: "ph:robot-bold",
    items: ["MCP", "A2A", "Prompt injection", "Token scope & revocation", "Threat modelling", "Autonomous SOC"],
  },
  {
    group: "Cloud & DevSecOps",
    icon: "ph:cloud-bold",
    items: ["AWS EC2", "Kubernetes / K3s", "HPA & autoscaling", "Docker", "NATS JetStream", "Redis Sentinel", "Wazuh", "Prometheus & Grafana", "Tailscale"],
  },
  {
    group: "Languages",
    icon: "ph:code-bold",
    items: ["Python", "C", "Java", "TypeScript", "System Verilog", "Bash", "PHP / Laravel", "SQL"],
  },
  {
    group: "Space systems",
    icon: "ph:planet-bold",
    items: ["Nanosatellite mission design", "IDM suite (CIC, VTS)", "ARCADIA / Capella MBSE", "Hardware security", "Low-TRL space tech"],
  },
  {
    group: "Human layer",
    icon: "ph:users-three-bold",
    items: ["Leadership", "Public speaking", "Technical writing", "Content marketing", "Bilingual EN / FR", "Research methods"],
  },
];

// Professional certifications, as listed on the current resume.
export const certifications = [
  { name: "Certified White Hat Hacker", issuer: "CyberED × Positive Technologies", url: "https://drive.google.com/file/d/1i8sMWVYA-OgZ5s8G-0fXwNrr9FU4d5vA/view?usp=drive_link" },
  { name: "Red Teaming", issuer: "TryHackMe", url: "https://drive.google.com/file/d/1qgZ0MH9XsIGxgz9gFyr3RLIyJyjuadhk/view?usp=drive_link" },
  { name: "Certified in Cybersecurity (CC)", issuer: "(ISC)²", url: "https://www.credly.com/users/iamdlite/badges" },
  { name: "LFD259: Kubernetes for Developers", issuer: "The Linux Foundation", url: "https://www.credly.com/users/iamdlite/badges" },
  { name: "Junior Penetration Tester", issuer: "TryHackMe", url: "https://drive.google.com/file/d/1FCxBTCeFzVywkqo8Gw8dkNb08gUo2a5g/view?usp=drive_link" },
  { name: "Space Systems Engineering", issuer: "Space Generation Advisory Council", url: "https://drive.google.com/file/d/1YjgKN9wMr-yed84_Id6M2tplbKv1WqzN/view?usp=drive_link" },
  { name: "NASA-OLS Nebula Open Science 101", issuer: "OLS × NASA", url: "https://drive.google.com/file/d/18ciHEH08kF9rm6zmGIAbZHu4fJIbaVfv/view?usp=drive_link" },
];
