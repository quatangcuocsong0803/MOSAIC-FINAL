export type ChartRow = { label: string; values: Record<string, number> };
export type ChartSeries = { key: string; label: string; color: string };
export type ChartKind = 'bar' | 'donut' | 'line' | 'stacked' | 'combo' | 'table';
export const palette = ['#8b6b4a', '#547f7a', '#a76070', '#6f6b9d', '#c3a14b', '#597694'];
export function chartMaximum(rows: ChartRow[], series: ChartSeries[], stacked: boolean) {
  const max = Math.max(0, ...rows.map(row => stacked ? series.reduce((sum, s) => sum + (row.values[s.key] ?? 0), 0) : Math.max(0, ...series.map(s => row.values[s.key] ?? 0))));
  if (max <= 4) return 4;
  const power = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / power / 0.5) * power * 0.5;
}
export function csvForChart(rows: ChartRow[], series: ChartSeries[]) {
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  return '\uFEFF' + [['Nhóm', ...series.map(s => s.label)], ...rows.map(row => [row.label, ...series.map(s => row.values[s.key] ?? 0)])].map(row => row.map(escape).join(',')).join('\r\n');
}
