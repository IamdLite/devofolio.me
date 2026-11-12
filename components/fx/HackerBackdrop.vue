<script setup>
// Background in the spirit of TV hacker dramas: faint terminal panes typing out intrusion
// logs, the occasional screen tear, and a rare whispered line. `matrix` in the terminal
// (or the Konami code) turns it up.
const canvas = ref(null);
const boost = useMatrixBoost();
const glitchPulse = useGlitchPulse();
const { isDark } = useTheme();
const reducedMotion = usePreferredReducedMotion();

const script = [
  "root@target:~# nmap -sS -p- 10.0.13.37",
  "PORT     STATE SERVICE",
  "22/tcp   open  ssh",
  "445/tcp  open  microsoft-ds",
  "8080/tcp open  http-proxy",
  "[*] exploit/multi/handler started",
  "[+] meterpreter session 1 opened",
  "meterpreter > hashdump",
  "Administrator:500:aad3b435b51404ee:31d6cfe0d16ae931",
  "root@target:~# ssh -i id_rsa svc_backup@10.0.13.40",
  "svc_backup@dc01:~$ sudo -l",
  "(ALL) NOPASSWD: /usr/bin/tar",
  "svc_backup@dc01:~$ sudo tar -cf /dev/null x --checkpoint-action=exec=/bin/sh",
  "# id",
  "uid=0(root) gid=0(root)",
  "[+] persistence: crontab installed",
  "0x0000: 4865 6c6c 6f2c 2066 7269 656e 642e",
  "0x0010: 7765 2061 7265 2069 6e2e 2e2e 0a00",
  "$ gpg --decrypt payload.asc",
  "[-] EDR hook detected · rotating syscalls",
  "[+] bypass ok · beacon every 60s ±30%",
  "$ cat /etc/shadow | head -3",
  "$ python3 exfil.py --chunk 512 --dns",
  "[*] 128 chunks queued · 0 alerts",
  "$ shred -u ~/.bash_history",
];
const whispers = ["hello, friend.", "control is an illusion.", "are you a one or a zero?", "we see everything.", "trust no one."];

let ctx, raf, panes = [], whisper = null, glitchUntil = 0, nextGlitch = 0, last = 0, w = 0, h = 0;
const LINE = 16;

function makePane(i, count) {
  const width = Math.min(420, w / count);
  return {
    x: (w / count) * i + Math.random() * Math.max(0, w / count - width),
    y: 80 + Math.random() * Math.max(0, h - 360),
    rows: 8 + ((Math.random() * 8) | 0),
    lines: [],
    typed: "",
    cursor: (Math.random() * script.length) | 0,
    pause: Math.random() * 40,
  };
}

function resize() {
  const el = canvas.value;
  if (!el) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  el.width = w * dpr;
  el.height = h * dpr;
  ctx = el.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = w < 640 ? 1 : w < 1100 ? 2 : 3;
  panes = Array.from({ length: count }, (_, i) => makePane(i, count));
}

function step(pane, i) {
  if (pane.pause > 0) return pane.pause--;
  const target = script[pane.cursor % script.length];
  pane.typed = target.slice(0, pane.typed.length + 1 + ((Math.random() * 3) | 0));
  if (pane.typed.length >= target.length) {
    pane.lines.push(pane.typed);
    pane.typed = "";
    pane.cursor++;
    pane.pause = target.startsWith("$") || target.includes("#") ? 18 : 4;
    if (pane.lines.length > pane.rows) {
      // Pane is full: fade it out and open a fresh one elsewhere.
      Object.assign(pane, makePane(i, panes.length));
    }
  }
}

function draw(t) {
  const dark = isDark.value;
  const strong = boost.value;
  ctx.clearRect(0, 0, w, h);
  ctx.font = `12px "JetBrains Mono Variable", monospace`;
  const base = dark ? (strong ? 0.5 : 0.22) : strong ? 0.35 : 0.12;

  for (const pane of panes) {
    pane.lines.forEach((text, j) => {
      const age = (pane.lines.length - j) / (pane.rows + 1);
      const hit = text.startsWith("[+]") || text.startsWith("#") || text.startsWith("uid=0");
      ctx.fillStyle = hit ? (dark ? `rgba(255,61,110,${base * 1.4})` : `rgba(200,20,60,${base * 1.4})`) : dark ? `rgba(0,255,156,${base * (1 - age * 0.6)})` : `rgba(10,60,40,${base * (1 - age * 0.6)})`;
      ctx.fillText(text, pane.x, pane.y + j * LINE);
    });
    const blink = Math.floor(t / 500) % 2 ? "█" : "";
    ctx.fillStyle = dark ? `rgba(207,227,238,${base * 1.5})` : `rgba(20,30,40,${base * 1.5})`;
    ctx.fillText(pane.typed + blink, pane.x, pane.y + pane.lines.length * LINE);
  }

  if (whisper) {
    const life = (t - whisper.start) / 3500;
    if (life >= 1) whisper = null;
    else {
      const a = Math.sin(life * Math.PI) * (dark ? 0.35 : 0.25) * (Math.random() > 0.08 ? 1 : 0.3);
      ctx.font = `600 ${w < 640 ? 18 : 26}px "JetBrains Mono Variable", monospace`;
      ctx.fillStyle = dark ? `rgba(255,255,255,${a})` : `rgba(10,15,20,${a})`;
      ctx.fillText(whisper.text, whisper.x, whisper.y);
    }
  }

  // Screen tear: shift random horizontal slices sideways, with a red/cyan ghost.
  if (t < glitchUntil) {
    for (let k = 0; k < 6; k++) {
      const y = Math.random() * h;
      const sh = 4 + Math.random() * 40;
      const dx = (Math.random() - 0.5) * 60;
      ctx.drawImage(canvas.value, 0, y * (canvas.value.width / w), canvas.value.width, sh * (canvas.value.width / w), dx, y, w, sh);
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,61,110,.06)" : "rgba(56,214,255,.06)";
      ctx.fillRect(0, y, w, sh);
    }
  }
}

function frame(t) {
  raf = requestAnimationFrame(frame);
  if (t - last < 50) return;
  last = t;
  panes.forEach(step);
  if (t > nextGlitch) {
    glitchUntil = t + 160 + Math.random() * 200;
    nextGlitch = t + (boost.value ? 2500 : 7000) + Math.random() * 6000;
    if (!whisper && Math.random() > 0.55) {
      whisper = { text: whispers[(Math.random() * whispers.length) | 0], start: t, x: 40 + Math.random() * Math.max(0, w - 420), y: 140 + Math.random() * Math.max(0, h - 260) };
    }
  }
  draw(t);
}

function start() {
  cancelAnimationFrame(raf);
  resize();
  if (reducedMotion.value === "reduce") {
    // One still frame: a filled pane, no motion.
    panes.forEach((p) => (p.lines = script.slice(p.cursor, p.cursor + p.rows)));
    draw(0);
    return;
  }
  nextGlitch = performance.now() + 4000;
  raf = requestAnimationFrame(frame);
}

onMounted(() => {
  start();
  useEventListener(window, "resize", useDebounceFn(start, 200));
  useEventListener(document, "visibilitychange", () => (document.hidden ? cancelAnimationFrame(raf) : start()));
});
watch(reducedMotion, start);
// External triggers (route changes, `hack`) tear the screen immediately.
watch(glitchPulse, () => (glitchUntil = performance.now() + 450));
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <canvas ref="canvas" aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
</template>
