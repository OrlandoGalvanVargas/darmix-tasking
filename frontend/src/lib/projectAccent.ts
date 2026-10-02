const PALETTE = [
  { base: "#0f766e", soft: "#ccfbf1" }, // teal
  { base: "#7c3aed", soft: "#ede9fe" }, // violet
  { base: "#ea580c", soft: "#ffedd5" }, // orange
  { base: "#0369a1", soft: "#e0f2fe" }, // sky
  { base: "#be185d", soft: "#fce7f3" }, // pink
  { base: "#65a30d", soft: "#ecfccb" }, // lime
  { base: "#c026d3", soft: "#fae8ff" }, // fuchsia
] as const;

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function projectAccent(name: string) {
  return PALETTE[hash(name) % PALETTE.length];
}
