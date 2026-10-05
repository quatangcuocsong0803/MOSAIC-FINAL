"use client";
import { useId, useState } from 'react';
import { chartMaximum, csvForChart, palette, type ChartKind, type ChartRow, type ChartSeries } from './chart-model';
import styles from './Statistics.module.css';
const names: Record<ChartKind, string> = { bar: 'Cột', donut: 'Tròn', line: 'Đường', stacked: 'Cột chồng', combo: 'Kết hợp', table: 'Bảng' };
export default function DataChart({ title, description, rows, series, ordered = false, initial = 'bar', unit = 'người', additive = true, emptyMessage = 'Chưa có dữ liệu được chia sẻ.' }: { title: string; description: string; rows: ChartRow[]; series: ChartSeries[]; ordered?: boolean; additive?: boolean; initial?: ChartKind; unit?: string; emptyMessage?: string }) {
  const id = useId();
  const [kind, setKind] = useState<ChartKind>(initial);
  const [hidden, setHidden] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const visible = series.filter(s => !hidden.includes(s.key));
  const options: ChartKind[] = ['bar', ...(series.length === 1 ? ['donut' as const] : additive ? ['stacked' as const] : []), ...(ordered ? ['line' as const, ...(series.length > 1 && additive ? ['combo' as const] : [])] : []), 'table'];
  const mode = options.includes(kind) ? kind : 'bar';
  const hasData = rows.some(row => visible.some(s => row.values[s.key] > 0));
  const stacked = mode === 'stacked' || mode === 'combo';
  const max = chartMaximum(rows, visible, stacked);
  const width = Math.max(640, rows.length * 48 + 96), height = 340, left = 60, top = 24, plotWidth = width - 84, plotHeight = 230;
  const slot = plotWidth / Math.max(rows.length, 1);
  const x = (index: number) => left + slot * (index + .5);
  const y = (value: number) => top + plotHeight * (1 - value / max);
  const valueText = (value: number) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value)} ${unit}`;
  const total = rows.reduce((sum, row) => sum + (row.values[visible[0]?.key] ?? 0), 0);
  const announce = (row: ChartRow, s: ChartSeries) => `${row.label} · ${s.label}: ${valueText(row.values[s.key] ?? 0)}`;
  function download() {
    const url = URL.createObjectURL(new Blob([csvForChart(rows, visible)], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'mosaic-statistics.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className={styles.chartCard} aria-labelledby={`${id}-title`}>
    <div className={styles.chartHeading}><div><h2 id={`${id}-title`}>{title}</h2><p>{description}</p></div><button className={styles.secondaryButton} onClick={download} type="button">CSV ↓</button></div>
    <div className={styles.chartToolbar} role="group" aria-label="Dạng biểu đồ">{options.map(option => <button type="button" key={option} onClick={() => { setKind(option); setActive(null); }} aria-pressed={mode === option} className={mode === option ? styles.selected : ''}>{names[option]}</button>)}</div>
    {series.length > 1 && <div className={styles.legend} aria-label="Chọn chỉ số">{series.map(s => <button type="button" key={s.key} aria-pressed={!hidden.includes(s.key)} onClick={() => { setActive(null); setHidden(current => current.includes(s.key) ? current.filter(key => key !== s.key) : visible.length > 1 ? [...current, s.key] : current); }}><i style={{ background: s.color, opacity: hidden.includes(s.key) ? .3 : 1 }} />{s.label}</button>)}</div>}
    {mode === 'table' ? <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={`${title}: bảng dữ liệu, có thể cuộn ngang`}><table><caption>{title} ({unit})</caption><thead><tr><th scope="col">Nhóm</th>{visible.map(s => <th scope="col" key={s.key}>{s.label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{visible.map(s => <td key={s.key}>{valueText(row.values[s.key] ?? 0)}</td>)}</tr>)}</tbody></table></div> : !hasData ? <div className={styles.emptyChart}>{emptyMessage}</div> : mode === 'donut' ? <div className={styles.donutLayout}>
      <svg viewBox="0 0 240 240" className={styles.donut} role="img" aria-labelledby={`${id}-title`}><desc>{rows.filter(r => r.values[visible[0].key] > 0).map(r => `${r.label}: ${valueText(r.values[visible[0].key])}`).join('; ')}</desc>
        {rows.map((row, index) => { const value = row.values[visible[0].key] ?? 0, circumference = 2 * Math.PI * 80, length = circumference * value / total, offset = rows.slice(0, index).reduce((sum, r) => sum + r.values[visible[0].key], 0) / total * circumference; return value > 0 && <circle key={row.label} cx="120" cy="120" r="80" fill="none" stroke={palette[index % palette.length]} strokeWidth="36" strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-offset} transform="rotate(-90 120 120)" tabIndex={0} onPointerEnter={() => setActive(announce(row, visible[0]))} onClick={() => setActive(announce(row, visible[0]))} onFocus={() => setActive(announce(row, visible[0]))}><title>{announce(row, visible[0])}</title></circle>; })}
        <text x="120" y="117" textAnchor="middle" fontSize="26" fill="#5c4326">{new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(total)}</text><text x="120" y="140" textAnchor="middle" fontSize="12" fill="#776754">{unit === '%' ? '% tổng tỷ lệ' : `${unit} trong mẫu`}</text>
      </svg><ul className={styles.donutLegend}>{rows.map((row, index) => <li key={row.label}><i style={{ background: palette[index % palette.length] }} /><span>{row.label}</span><strong>{valueText(row.values[visible[0].key] ?? 0)}</strong></li>)}</ul>
    </div> : <div className={styles.plotScroll} tabIndex={0} role="region" aria-label={`${title}: biểu đồ, có thể cuộn ngang`}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ minWidth: width }} role="img" aria-labelledby={`${id}-title`}><desc>{description} Dùng nút Bảng để đọc toàn bộ giá trị.</desc>
        {Array.from({ length: 5 }, (_, i) => max * i / 4).map(tick => <g key={tick}><line x1={left} x2={width - 24} y1={y(tick)} y2={y(tick)} stroke="#e8e0d3" strokeDasharray={tick ? '3 5' : undefined} /><text x={left - 10} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#776754">{new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(tick)}</text></g>)}
        <text x={left} y="14" fontSize="11" fill="#776754">{unit}</text>
        {rows.map((row, index) => <text key={row.label} x={x(index)} y={top + plotHeight + 22} transform={`rotate(-35 ${x(index)} ${top + plotHeight + 22})`} textAnchor="end" fontSize="11" fill="#5c4326">{row.label}</text>)}
        {mode !== 'line' && rows.map((row, index) => visible.map((s, seriesIndex) => { const value = row.values[s.key] ?? 0, before = stacked ? visible.slice(0, seriesIndex).reduce((sum, prev) => sum + (row.values[prev.key] ?? 0), 0) : 0, barWidth = Math.min(32, slot * .72 / (stacked ? 1 : visible.length)); return <rect key={`${row.label}-${s.key}`} x={stacked ? x(index) - barWidth / 2 : x(index) - barWidth * visible.length / 2 + seriesIndex * barWidth} y={y(value + before)} width={Math.max(1, barWidth - (stacked ? 0 : 2))} height={Math.max(0, value / max * plotHeight)} rx={stacked ? 0 : 3} fill={s.color} tabIndex={0} onPointerEnter={() => setActive(announce(row, s))} onClick={() => setActive(announce(row, s))} onFocus={() => setActive(announce(row, s))}><title>{announce(row, s)}</title></rect>; }))}
        {mode === 'line' && visible.map(s => <g key={s.key}><polyline fill="none" stroke={s.color} strokeWidth="2.5" points={rows.map((r, i) => `${x(i)},${y(r.values[s.key] ?? 0)}`).join(' ')} />{rows.map((r, i) => <circle key={r.label} cx={x(i)} cy={y(r.values[s.key] ?? 0)} r="4" fill={s.color} stroke="#fff" strokeWidth="1.5" tabIndex={0} onPointerEnter={() => setActive(announce(r, s))} onClick={() => setActive(announce(r, s))} onFocus={() => setActive(announce(r, s))}><title>{announce(r, s)}</title></circle>)}</g>)}
        {mode === 'combo' && <g><polyline fill="none" stroke="#382c22" strokeWidth="2.5" points={rows.map((r, i) => `${x(i)},${y(visible.reduce((sum, s) => sum + (r.values[s.key] ?? 0), 0))}`).join(' ')} />{rows.map((r, i) => { const sum = visible.reduce((n, s) => n + (r.values[s.key] ?? 0), 0); return <circle key={r.label} cx={x(i)} cy={y(sum)} r="4" fill="#382c22" tabIndex={0} onClick={() => setActive(`${r.label} · Tổng chỉ số đang chọn: ${valueText(sum)}`)} onFocus={() => setActive(`${r.label} · Tổng chỉ số đang chọn: ${valueText(sum)}`)} onPointerEnter={() => setActive(`${r.label} · Tổng chỉ số đang chọn: ${valueText(sum)}`)}><title>Tổng: {valueText(sum)}</title></circle>; })}</g>}
      </svg>
    </div>}
    <p className={styles.tooltip} aria-live="polite">{active ?? (mode === 'combo' ? 'Đường màu đậm = tổng các chỉ số đang chọn.' : 'Chạm, di chuột hoặc dùng phím Tab để xem giá trị. Vuốt ngang để xem hết biểu đồ; chọn Bảng để đọc dữ liệu.')}</p>
  </section>;
}
