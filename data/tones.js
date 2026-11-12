// Literal class names per tone, so Tailwind can see them (dynamic `text-${tone}` would be purged).
export const toneText = { neon: "text-neon", ice: "text-ice", hot: "text-hot", warn: "text-warn", dim: "text-dim" };
export const toneBg = { neon: "bg-neon", ice: "bg-ice", hot: "bg-hot", warn: "bg-warn", dim: "bg-dim" };
export const toneBorder = {
  neon: "border-neon/50 bg-neon/10",
  ice: "border-ice/50 bg-ice/10",
  hot: "border-hot/50 bg-hot/10",
  warn: "border-warn/50 bg-warn/10",
  dim: "border-line bg-panel2",
};
