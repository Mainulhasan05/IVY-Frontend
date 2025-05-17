export function getRoundedTimestamp() {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.toISOString();
} 