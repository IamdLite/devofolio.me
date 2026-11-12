// Shared UI state for the overlays that can be opened from anywhere.
export const usePaletteOpen = () => useState("palette-open", () => false);
export const useTerminalOpen = () => useState("terminal-open", () => false);
export const useMatrixBoost = () => useState("matrix-boost", () => false);
// Incremented to fire a one-off screen glitch (route changes, successful hacks).
export const useGlitchPulse = () => useState("glitch-pulse", () => 0);
export const useWebNavOpen = () => useState("web-nav-open", () => false);
// Scan mode: hovering anything marked with data-scan shows a profiler readout.
export const useScanMode = () => useState("scan-mode", () => false);

export const useTheme = createSharedComposable(() => {
  const isDark = useDark({ initialValue: "dark" });
  const toggleTheme = () => (isDark.value = !isDark.value);
  return { isDark, toggleTheme };
});

export const navLinks = [
  { label: "Projects", to: "/projects", icon: "ph:cube-bold" },
  { label: "Research", to: "/research", icon: "ph:flask-bold" },
  { label: "Journey", to: "/journey", icon: "ph:path-bold" },
  { label: "Talks", to: "/presentations", icon: "ph:microphone-stage-bold" },
  { label: "Blog", to: "/blog", icon: "ph:article-bold" },
  { label: "Memes", to: "/memes", icon: "ph:smiley-wink-bold" },
  { label: "About", to: "/about", icon: "ph:user-bold" },
];
