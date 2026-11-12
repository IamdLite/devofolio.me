import { profile, socials, skills, certifications } from "~/data/profile";
import { projects } from "~/data/projects";
import { research } from "~/data/research";
import { timeline } from "~/data/timeline";

// A small but real shell over a virtual filesystem built from the site's data.
// Output lines are { text, tone?, to?, href? }; tone: neon | ice | hot | warn | dim.
// Commands receive (args, ctx) and return lines (or a Promise of lines); long-running
// commands stream through ctx.out and should stop when ctx.aborted() is true.

const HOME = "/home/iamdLite";
const pages = {
  home: "/",
  projects: "/projects",
  research: "/research",
  journey: "/journey",
  resume: "/journey",
  talks: "/presentations",
  blog: "/blog",
  memes: "/memes",
  about: "/about",
  contact: "/contact",
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const file = (text, page) => ({ type: "file", text, page });
const dir = (children, page) => ({ type: "dir", children, page });

function buildFs() {
  const work = timeline.filter((t) => t.kind === "work");
  return dir({
    home: dir({
      iamdLite: dir({
        "about.txt": file([`${profile.name} — ${profile.roles.join(" · ")}`, "", profile.tagline].join("\n"), "/about"),
        "contact.txt": file([`email     ${profile.email}`, `form      /contact`, `community ${profile.community}`].join("\n"), "/contact"),
        "resume.log": file(timeline.map((t) => `${t.when.padEnd(30)} [${t.kind}] ${t.title} — ${t.org}`).join("\n"), "/journey"),
        "experience.txt": file(work.map((t) => [`${t.title} @ ${t.org} (${t.when})`, ...t.points.map((p) => `  - ${p}`)].join("\n")).join("\n\n"), "/journey"),
        "skills.txt": file(skills.map((s) => `${s.group.padEnd(22)} ${s.items.join(", ")}`).join("\n"), "/about"),
        "certs.txt": file(certifications.map((c) => `✔ ${c.name} — ${c.issuer}`).join("\n"), "/journey"),
        "socials.txt": file(socials.map((s) => `${s.name.padEnd(10)} ${s.url}`).join("\n")),
        projects: dir(
          Object.fromEntries(
            projects.map((p) => [
              `${p.slug}.md`,
              file(
                [
                  `# ${p.title} (${p.year})`,
                  p.tagline,
                  "",
                  `stack: ${p.stack.join(", ")}`,
                  ...p.highlights.map((h) => `- ${h}`),
                  p.repo ? `repo: ${p.repo}` : p.private ? "repo: private" : "",
                  p.live ? `live: ${p.live}` : "",
                ].filter((l, i) => l || i === 2).join("\n"),
                `/projects/${p.slug}`
              ),
            ])
          ),
          "/projects"
        ),
        research: dir(
          Object.fromEntries(
            research.map((r) => [
              `${slugify(r.title)}.txt`,
              file([`${r.title}`, `${r.year} · ${r.venue} · ${r.status}`, "", r.abstract].join("\n"), "/research"),
            ])
          ),
          "/research"
        ),
        ".bash_history": file(["nmap -sV 10.10.10.10", "sudo make me-a-sandwich", "git commit -m 'final final v3'", "vim ~/.secret/flag.txt"].join("\n")),
        ".secret": dir({
          "flag.txt": file("flag{y0u_r3ad_th3_d0tf1l3s}\nNice recon. Send this flag through /contact and say hi."),
        }),
      }),
    }),
    etc: dir({ "motd": file("Authorised visitors only. Everything you type is… not logged. Relax.") }),
  });
}

const banner = [
  { text: "iamdLite//OS v5.0 — a real shell over this site. `help` lists commands, Tab completes, Ctrl+C stops.", tone: "neon" },
  { text: "tip: try `ls`, `cat about.txt`, `tree`, `grep -i python -r`, `hack scholarion`, or just ask a question.", tone: "dim" },
];

// Answers for plain-language questions, matched on keywords.
const faq = [
  { keys: ["where", "live", "location", "based", "country", "city"], answer: () => [{ text: "That's classified. 🕶️  I work remotely.", tone: "warn" }] },
  { keys: ["name", "real name", "called"], answer: () => [{ text: "iamdLite. That's all you get.", tone: "warn" }] },
  { keys: ["hire", "contact", "email", "reach", "available", "job"], answer: () => [{ text: `Yes, I'm open to red-team, pentest and security research roles. ${profile.email} or /contact.`, tone: "neon", to: "/contact" }] },
  { keys: ["experience", "work", "worked", "intern", "career"], answer: () => timeline.filter((t) => t.kind === "work").map((t) => ({ text: `• ${t.title} @ ${t.org} (${t.when})` })) },
  { keys: ["skill", "stack", "tool", "know", "language", "tech"], answer: () => skills.map((s) => ({ text: `• ${s.group}: ${s.items.slice(0, 5).join(", ")}` })) },
  { keys: ["project", "built", "build", "portfolio", "made"], answer: () => projects.map((p) => ({ text: `• ${p.title}: ${p.tagline}`, to: `/projects/${p.slug}` })) },
  { keys: ["research", "paper", "publication", "publish", "study"], answer: () => research.slice(0, 5).map((r) => ({ text: `• [${r.year}] ${r.title}`, to: "/research" })) },
  { keys: ["study", "education", "university", "degree", "school"], answer: () => timeline.filter((t) => t.kind === "education").map((t) => ({ text: `• ${t.title}, ${t.org} (${t.when})` })) },
  { keys: ["cert", "certified", "certification"], answer: () => certifications.map((c) => ({ text: `• ${c.name} — ${c.issuer}`, tone: "neon" })) },
  { keys: ["award", "win", "won", "prize"], answer: () => timeline.filter((t) => t.kind === "award").map((t) => ({ text: `🏆 ${t.title} — ${t.org} (${t.when})`, tone: "warn" })) },
  { keys: ["hobby", "hobbies", "fun", "free time", "weekend"], answer: () => [{ text: "Poetry, photography, vlogging and an unhealthy number of memes (see /memes).", to: "/memes" }] },
  { keys: ["who", "you", "yourself", "about"], answer: () => [{ text: `${profile.name}: ${profile.roles.slice(0, 3).join(", ")}.`, tone: "neon" }, { text: profile.tagline, tone: "dim" }] },
];

export function useTerminal({ onExit } = {}) {
  const router = useRouter();
  const { isDark } = useTheme();
  const matrixBoost = useMatrixBoost();
  const glitch = useGlitchPulse();
  const scanMode = useScanMode();
  const lines = ref([...banner]);
  const history = ref([]);
  const busy = ref(false);
  const fs = buildFs();
  const cwd = ref(HOME);
  const env = reactive({ USER: "guest", HOME, SHELL: "/bin/zsh", TERM: "xterm-256color", EDITOR: "vim" });
  let aborted = false;

  const norm = (l) => (typeof l === "string" ? { text: l } : l);
  const print = (...out) => lines.value.push(...out.map(norm));
  const err = (text) => [{ text, tone: "hot" }];
  const label = (path) => (path === HOME ? "~" : path.startsWith(`${HOME}/`) ? `~${path.slice(HOME.length)}` : path);
  const cwdLabel = computed(() => label(cwd.value));

  // ── Filesystem helpers ──
  function resolve(path = "") {
    const base = path.startsWith("/") ? [] : path.startsWith("~") ? HOME.split("/").filter(Boolean) : cwd.value.split("/").filter(Boolean);
    const rest = path.replace(/^~/, "").split("/").filter(Boolean);
    for (const seg of rest) {
      if (seg === ".") continue;
      if (seg === "..") base.pop();
      else base.push(seg);
    }
    return `/${base.join("/")}`;
  }
  function node(path) {
    let n = fs;
    for (const seg of path.split("/").filter(Boolean)) {
      if (n.type !== "dir" || !n.children[seg]) return null;
      n = n.children[seg];
    }
    return n;
  }
  function* walk(path, n = node(path)) {
    if (!n) return;
    yield [path, n];
    if (n.type === "dir") for (const [name, child] of Object.entries(n.children)) yield* walk(`${path === "/" ? "" : path}/${name}`, child);
  }
  const readText = (arg) => {
    const p = resolve(arg);
    const n = node(p);
    if (!n) return { error: `${arg}: No such file or directory` };
    if (n.type === "dir") return { error: `${arg}: Is a directory` };
    return { text: n.text };
  };
  // Text a filter command works on: named files, else piped stdin.
  function input(files, stdin) {
    if (files.length) {
      const out = [];
      for (const f of files) {
        const r = readText(f);
        if (r.error) return { error: r.error };
        out.push(...r.text.split("\n").map((text) => ({ text, file: f })));
      }
      return { lines: out };
    }
    return { lines: stdin ?? [] };
  }
  const flags = (args) => ({ opts: args.filter((a) => /^-[a-z]+$/i.test(a)).join("").replace(/-/g, ""), rest: args.filter((a) => !/^-[a-z]+$/i.test(a)) });

  function navigate(target) {
    router.push(target);
    return [{ text: `→ ${target}`, tone: "dim" }];
  }

  // ── Commands ──
  const commands = {
    help: {
      desc: "list commands",
      run: () => [
        ...Object.entries(commands)
          .filter(([, c]) => c.desc)
          .map(([name, c]) => ({ text: `${name.padEnd(10)} ${c.desc}`, tone: name === "help" ? "neon" : undefined })),
        { text: "pipes work: `cat resume.log | grep -i award | wc -l`. Questions work too: `what are your skills?`", tone: "dim" },
      ],
    },
    man: {
      desc: "manual for a command",
      usage: "man <command>",
      run: ([name]) => {
        const c = commands[name];
        if (!c) return err(`No manual entry for ${name ?? ""}`);
        return [{ text: `${name}(1)`, tone: "neon" }, { text: `  ${c.desc ?? "undocumented. you found an easter egg."}` }, { text: `  usage: ${c.usage ?? name}`, tone: "dim" }];
      },
    },
    ls: {
      desc: "list directory contents",
      usage: "ls [-a] [-l] [path]",
      run: (args) => {
        const { opts, rest } = flags(args);
        const p = resolve(rest[0] ?? ".");
        const n = node(p);
        if (!n) return err(`ls: cannot access '${rest[0]}': No such file or directory`);
        if (n.type === "file") return [{ text: rest[0] }];
        const entries = Object.entries(n.children).filter(([name]) => opts.includes("a") || !name.startsWith("."));
        if (opts.includes("l")) {
          return entries.map(([name, c]) => ({
            text: `${c.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--"}  iamdLite  ${String(c.type === "dir" ? 4096 : c.text.length).padStart(5)}  ${name}${c.type === "dir" ? "/" : ""}`,
            tone: c.type === "dir" ? "ice" : undefined,
          }));
        }
        return [{ text: entries.map(([name, c]) => (c.type === "dir" ? `${name}/` : name)).join("  ") || "(empty)", tone: "ice" }];
      },
    },
    cd: {
      desc: "change directory (or jump to a page: `cd blog`)",
      usage: "cd [path]",
      run: ([path = "~"]) => {
        const p = resolve(path);
        const n = node(p);
        if (n?.type === "dir") {
          cwd.value = p;
          return [];
        }
        if (n) return err(`cd: not a directory: ${path}`);
        const page = pages[path.replace(/\/$/, "")];
        return page ? navigate(page) : err(`cd: no such file or directory: ${path}`);
      },
    },
    pwd: { desc: "print working directory", run: () => [{ text: cwd.value }] },
    cat: {
      desc: "print files",
      usage: "cat <file...>",
      run: (args, { stdin }) => {
        if (!args.length) return stdin ?? [];
        const out = [];
        for (const f of args) {
          const r = readText(f);
          if (r.error) return [...out, ...err(`cat: ${r.error}`)];
          out.push(...r.text.split("\n").map((text) => ({ text })));
        }
        return out;
      },
    },
    tree: {
      desc: "show the directory tree",
      run: ([path = "."]) => {
        const root = resolve(path);
        const depth = (p) => p.slice(root.length).split("/").filter(Boolean).length;
        return [...walk(root)]
          .filter(([p]) => !p.split("/").some((s) => s.startsWith(".")))
          .map(([p, n]) => ({ text: p === root ? label(root) : `${"│   ".repeat(depth(p) - 1)}├── ${p.split("/").pop()}${n.type === "dir" ? "/" : ""}`, tone: n.type === "dir" ? "ice" : undefined }));
      },
    },
    find: {
      desc: "find files by name",
      usage: "find [path] <term>",
      run: (args) => {
        const [path, term] = args.length > 1 ? args : [".", args[0] ?? ""];
        const root = resolve(path);
        return [...walk(root)].filter(([p]) => p.split("/").pop().toLowerCase().includes(term.toLowerCase())).map(([p]) => ({ text: label(p) }));
      },
    },
    grep: {
      desc: "search text (files, -r, or piped input)",
      usage: "grep [-i] [-r] <pattern> [file...]",
      run: (args, { stdin }) => {
        const { opts, rest } = flags(args);
        const [pattern, ...files] = rest;
        if (!pattern) return err("usage: grep [-i] [-r] <pattern> [file...]");
        let re;
        try {
          re = new RegExp(pattern, opts.includes("i") ? "i" : "");
        } catch {
          return err(`grep: invalid pattern: ${pattern}`);
        }
        let pool;
        if (opts.includes("r")) {
          pool = [...walk(resolve(files[0] ?? "."))]
            .filter(([, n]) => n.type === "file")
            .flatMap(([p, n]) => n.text.split("\n").map((text) => ({ text, file: label(p) })));
        } else {
          const r = input(files, stdin);
          if (r.error) return err(`grep: ${r.error}`);
          pool = r.lines;
        }
        const hits = pool.filter((l) => re.test(l.text));
        const many = opts.includes("r") || files.length > 1;
        return hits.map((l) => ({ ...l, text: many && l.file ? `${l.file}: ${l.text}` : l.text, tone: l.tone ?? "neon" }));
      },
    },
    head: {
      usage: "head [-n N] [file]",
      desc: "first lines",
      run: (args, { stdin }) => {
        const n = Number(args[args.indexOf("-n") + 1]) || 10;
        const r = input(args.filter((a, i) => a !== "-n" && args[i - 1] !== "-n"), stdin);
        return r.error ? err(`head: ${r.error}`) : r.lines.slice(0, n);
      },
    },
    tail: {
      usage: "tail [-n N] [file]",
      desc: "last lines",
      run: (args, { stdin }) => {
        const n = Number(args[args.indexOf("-n") + 1]) || 10;
        const r = input(args.filter((a, i) => a !== "-n" && args[i - 1] !== "-n"), stdin);
        return r.error ? err(`tail: ${r.error}`) : r.lines.slice(-n);
      },
    },
    wc: {
      desc: "count lines, words, chars",
      run: (args, { stdin }) => {
        const { opts, rest } = flags(args);
        const r = input(rest, stdin);
        if (r.error) return err(`wc: ${r.error}`);
        const text = r.lines.map((l) => l.text).join("\n");
        const counts = { l: r.lines.length, w: text.split(/\s+/).filter(Boolean).length, c: text.length };
        return [{ text: opts ? [...opts].map((o) => counts[o]).filter((v) => v !== undefined).join(" ") : `${counts.l} ${counts.w} ${counts.c}` }];
      },
    },
    sort: { desc: "sort lines", run: (args, { stdin }) => { const r = input(flags(args).rest, stdin); return r.error ? err(`sort: ${r.error}`) : [...r.lines].sort((a, b) => a.text.localeCompare(b.text)); } },
    open: {
      desc: "open a project, page, file or URL",
      usage: "open <slug|page|file|url>",
      run: ([target]) => {
        if (!target) return err("usage: open <slug|page|file|url>");
        if (/^https?:\/\//.test(target)) {
          window.open(target, "_blank", "noopener");
          return [{ text: `opening ${target}`, tone: "dim" }];
        }
        const p = projects.find((x) => x.slug === target);
        if (p) return navigate(`/projects/${p.slug}`);
        if (pages[target]) return navigate(pages[target]);
        const n = node(resolve(target));
        if (n?.page) return navigate(n.page);
        return err(`open: '${target}' is not a project, page or file with a page. try \`projects\``);
      },
    },
    projects: {
      desc: "list projects",
      run: () => projects.map((p) => ({ text: `${p.slug.padEnd(24)} ${p.title}`, to: `/projects/${p.slug}` })),
    },
    scan: {
      desc: "toggle scan mode (or press Q)",
      run: () => {
        scanMode.value = !scanMode.value;
        return [{ text: scanMode.value ? "scan mode on: hover anything to profile it" : "scan mode off", tone: "ice" }];
      },
    },
    whoami: { desc: "who is behind the screen", run: () => [{ text: env.USER }, { text: `(the site belongs to ${profile.name}; try \`cat about.txt\`)`, tone: "dim" }] },
    id: { run: () => [{ text: `uid=1000(${env.USER}) gid=1000(visitors) groups=1000(visitors),1337(curious)` }] },
    uname: { desc: "system info", run: ([o]) => [{ text: o === "-a" ? "iamdLite//OS 5.0 portfolio x86_64 Nuxt/3 Vue/3 GNU/Linux-ish" : "iamdLite//OS" }] },
    hostname: { run: () => [{ text: "portfolio" }] },
    uptime: { run: () => [{ text: `up ${new Date().getFullYear() - 2018} years, load average: 0.42, 0.13, 0.37` }] },
    date: { desc: "current date", run: () => [{ text: new Date().toString() }] },
    echo: { desc: "print text ($VARS expand)", run: (args) => [{ text: args.join(" ") }] },
    env: { desc: "environment variables", run: () => Object.entries(env).map(([k, v]) => ({ text: `${k}=${v}` })) },
    export: {
      usage: "export NAME=value",
      run: ([pair = ""]) => {
        const [k, ...v] = pair.split("=");
        if (!k || !v.length) return err("usage: export NAME=value");
        env[k] = v.join("=");
        return [];
      },
    },
    expr: {
      desc: "evaluate arithmetic",
      usage: "expr 2 * (3 + 4)",
      run: (args) => {
        const e = args.join(" ");
        if (!/^[\d\s+\-*/%().]+$/.test(e)) return err("expr: only numbers and + - * / % ( ) are allowed");
        try {
          // Safe: the expression is restricted to digits and arithmetic operators above.
          const v = Function(`"use strict"; return (${e})`)();
          return [{ text: String(v), tone: "neon" }];
        } catch {
          return err("expr: syntax error");
        }
      },
    },
    base64: {
      desc: "encode/decode base64",
      usage: "base64 [-d] <text>",
      run: (args, { stdin }) => {
        const { opts, rest } = flags(args);
        const text = rest.length ? rest.join(" ") : (stdin ?? []).map((l) => l.text).join("\n");
        try {
          if (opts.includes("d")) return [{ text: new TextDecoder().decode(Uint8Array.from(atob(text), (c) => c.charCodeAt(0))) }];
          return [{ text: btoa(String.fromCharCode(...new TextEncoder().encode(text))) }];
        } catch {
          return err("base64: invalid input");
        }
      },
    },
    sha256sum: {
      desc: "SHA-256 of text",
      usage: "sha256sum <text>",
      run: async (args, { stdin }) => {
        const text = args.length ? args.join(" ") : (stdin ?? []).map((l) => l.text).join("\n");
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
        return [{ text: `${[...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("")}  -` }];
      },
    },
    rot13: { run: (args) => [{ text: args.join(" ").replace(/[a-z]/gi, (c) => String.fromCharCode(((c.toLowerCase().charCodeAt(0) - 97 + 13) % 26) + (c < "a" ? 65 : 97))) }] },
    ping: {
      desc: "ping a host (Ctrl+C to stop)",
      usage: "ping <host>",
      run: async ([host = "iamdlite.local"], { out, aborted }) => {
        out({ text: `PING ${host}: 56 data bytes`, tone: "dim" });
        let sent = 0;
        for (; sent < 4 && !aborted(); sent++) {
          await sleep(600);
          if (aborted()) break;
          out({ text: `64 bytes from ${host}: icmp_seq=${sent} ttl=64 time=${(Math.random() * 30 + 8).toFixed(1)} ms` });
        }
        return [{ text: `--- ${host} ping statistics: ${sent} packets transmitted, ${sent} received, 0% loss`, tone: "dim" }];
      },
    },
    nmap: {
      desc: "scan the target",
      run: async ([target = "iamdLite"], { out }) => {
        out({ text: `Starting Nmap against ${target} …`, tone: "dim" });
        await sleep(700);
        return [
          { text: "PORT      STATE  SERVICE" },
          { text: "22/tcp    open   red-teaming", tone: "neon" },
          { text: "443/tcp   open   agentic-ai-security", tone: "neon" },
          { text: "1337/tcp  open   social-engineering-research", tone: "neon" },
          { text: "8000/tcp  open   community (eOfbit)", tone: "neon" },
          { text: "3306/tcp  closed boredom", tone: "dim" },
          { text: "Nmap done: 1 human up, 0 vulnerabilities disclosed ;)", tone: "dim" },
        ];
      },
    },
    hack: {
      desc: "breach a target (for fun)",
      usage: "hack <target>",
      run: async ([target = "grid"], { out, aborted, update }) => {
        const steps = ["profiling target", "bypassing city-grid firewall", "injecting payload", "escalating privileges"];
        out({ text: `[net] node acquired: ${target}`, tone: "ice" });
        for (const step of steps) {
          const line = out({ text: "" });
          for (let pct = 0; pct <= 100; pct += 20) {
            if (aborted()) return err("^C connection dropped. they're onto you.");
            update(line, { text: `  ${step.padEnd(26)} [${"█".repeat(pct / 10).padEnd(10, "░")}] ${pct}%`, tone: "neon" });
            await sleep(90);
          }
        }
        glitch.value++;
        const p = projects.find((x) => x.slug === target);
        return [
          { text: "ACCESS GRANTED ▓▓ the collective says hi", tone: "warn" },
          p ? { text: `loot: ${p.title} — ${p.tagline}`, to: `/projects/${p.slug}` } : { text: "loot: a firm handshake and `cat ~/.secret/flag.txt`", tone: "dim" },
        ];
      },
    },
    neofetch: {
      desc: "system info, with style",
      run: () => [
        { text: "   ▄▀▀▀▄     iamdLite@portfolio", tone: "neon" },
        { text: "  █ ▄▄▄ █    ----------------", tone: "neon" },
        { text: "  █ █▄█ █    OS: iamdLite//OS 5.0 (Nuxt 3)", tone: "neon" },
        { text: "   ▀▄▄▄▀     Shell: zsh, caffeinated", tone: "neon" },
        { text: `             Uptime: since 2018 (eOfbit)` },
        { text: `             Theme: ${isDark.value ? "cyber night" : "daylight ops"}` },
        { text: "             Location: [REDACTED]", tone: "hot" },
      ],
    },
    socials: { desc: "where to find me", run: () => socials.map((s) => ({ text: `${s.name.padEnd(10)} ${s.url}`, href: s.url })) },
    contact: {
      desc: "copy my email",
      run: () => {
        navigator.clipboard?.writeText(profile.email).catch(() => {});
        return [{ text: `email: ${profile.email} (copied)`, tone: "neon" }, { text: "or use the form → /contact", to: "/contact", tone: "ice" }];
      },
    },
    ask: { desc: "ask me anything", usage: "ask <question>", run: (args) => answer(args.join(" ")) },
    theme: {
      desc: "switch theme: `theme dark|light`",
      run: ([mode]) => {
        isDark.value = mode ? mode !== "light" : !isDark.value;
        return [{ text: `theme → ${isDark.value ? "cyber night" : "daylight ops"}`, tone: "dim" }];
      },
    },
    matrix: {
      desc: "boost the background",
      run: () => {
        matrixBoost.value = !matrixBoost.value;
        return [{ text: matrixBoost.value ? "hello, friend." : "back to the quiet.", tone: "neon" }];
      },
    },
    sudo: {
      run: async (args, { out }) => {
        out({ text: `[sudo] password for ${env.USER}: ********`, tone: "dim" });
        await sleep(800);
        return err(`${env.USER} is not in the sudoers file. This incident will be reported.`);
      },
    },
    rm: { run: () => err("rm: nice try. Backups are offline and immutable.") },
    vim: { run: () => [{ text: "You are now trapped in vim. Just kidding: try `cat` instead.", tone: "warn" }] },
    history: { desc: "previous commands", run: () => history.value.map((h, i) => ({ text: `${String(i + 1).padStart(3)}  ${h}`, tone: "dim" })) },
    clear: {
      desc: "clear the screen",
      run: () => {
        lines.value = [];
        return [];
      },
    },
    exit: {
      desc: "close the terminal",
      run: () => {
        onExit?.();
        return [];
      },
    },
  };

  function answer(question) {
    const q = question.toLowerCase();
    const hit = faq.find((f) => f.keys.some((k) => q.includes(k)));
    if (hit) return hit.answer();
    return [{ text: "I don't have an answer for that yet. Try `help`, or ask about my projects, skills, research or experience.", tone: "dim" }];
  }

  // Splits on whitespace, honouring quotes, and expands $VARS.
  function parse(stage) {
    const tokens = stage.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
    return tokens.map((t) => {
      if (t.startsWith("'")) return t.slice(1, -1);
      const unq = t.startsWith('"') ? t.slice(1, -1) : t;
      return unq.replace(/\$(\w+)/g, (_, k) => (k === "PWD" ? cwd.value : env[k] ?? ""));
    });
  }

  async function exec(stage, stdin, live) {
    const buf = [];
    const out = (l) => {
      const line = norm(l);
      if (live) lines.value.push(line);
      else buf.push(line);
      return line;
    };
    const update = (line, next) => {
      const list = live ? lines.value : buf;
      const i = list.lastIndexOf(line);
      if (i >= 0) list[i] = next;
      Object.assign(line, next);
    };
    const [name = "", ...args] = parse(stage);
    const cmd = commands[name.toLowerCase()];
    let result;
    if (cmd) {
      result = await cmd.run(args, { stdin, out, update, aborted: () => aborted });
    } else if (/\?$/.test(stage) || stage.split(/\s+/).length >= 3) {
      result = answer(stage);
    } else {
      result = err(`command not found: ${name}. type \`help\`, or ask a question`);
    }
    for (const l of result ?? []) out(l);
    return live ? [] : buf;
  }

  async function run(raw) {
    const text = raw.trim();
    print({ text, prompt: true, cwd: cwdLabel.value });
    if (!text) return;
    history.value.push(text);
    busy.value = true;
    aborted = false;
    try {
      const stages = text.split(/\s*\|\s*/);
      let stdin = null;
      for (let i = 0; i < stages.length; i++) stdin = await exec(stages[i], stdin, i === stages.length - 1);
    } catch (e) {
      print({ text: `error: ${e.message}`, tone: "hot" });
    } finally {
      busy.value = false;
    }
  }

  const abort = () => {
    if (busy.value) aborted = true;
  };

  // Tab completion for command names, then paths/slugs/pages.
  function complete(value) {
    const parts = value.split(/\s+/);
    if (parts.length === 1) {
      const hits = Object.keys(commands).filter((n) => n.startsWith(parts[0]));
      return hits.length === 1 ? `${hits[0]} ` : value;
    }
    const arg = parts.pop();
    const slash = arg.lastIndexOf("/");
    const dirPart = slash >= 0 ? arg.slice(0, slash + 1) : "";
    const base = node(resolve(dirPart || "."));
    const pool = [
      ...(base?.type === "dir" ? Object.entries(base.children).map(([n, c]) => dirPart + n + (c.type === "dir" ? "/" : "")) : []),
      ...(parts[0] === "open" ? projects.map((p) => p.slug) : []),
      ...(parts[0] === "cd" || parts[0] === "open" ? Object.keys(pages) : []),
    ];
    const hits = [...new Set(pool)].filter((p) => p.startsWith(arg));
    return hits.length === 1 ? [...parts, hits[0]].join(" ") : value;
  }

  return { lines, history, busy, cwd: cwdLabel, run, abort, complete };
}
