const PALETTE = [
  { base: "#0f766e", soft: "#ccfbf1" },
  { base: "#7c3aed", soft: "#ede9fe" },
  { base: "#ea580c", soft: "#ffedd5" },
  { base: "#0369a1", soft: "#e0f2fe" },
  { base: "#be185d", soft: "#fce7f3" },
  { base: "#65a30d", soft: "#ecfccb" },
  { base: "#c026d3", soft: "#fae8ff" },
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
