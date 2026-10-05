"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { StatisticsData } from '@/app/actions/statistics';
import DataChart from './DataChart';
import { palette, type ChartRow } from './chart-model';
import styles from './Statistics.module.css';
const datasets = { mbti: 'MBTI', enneagram: 'Enneagram', age: 'Độ tuổi', zodiac: 'Cung hoàng đạo' };
type Dataset = keyof typeof datasets;
const types = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
export default function StatisticsDashboard({ stats }: { stats: StatisticsData }) {
  const [dataset, setDataset] = useState<Dataset>('mbti');
  const [measure, setMeasure] = useState('count');
  const [sort, setSort] = useState('count');
  const [months, setMonths] = useState(6);
  const [selectedMbti, setSelectedMbti] = useState('all');
  useEffect(() => {
    const selectFromHash = () => {
      const hash = location.hash.slice(1);
      if (hash === 'mbti' || hash === 'enneagram' || hash === 'age') setDataset(hash);
    };
    selectFromHash();
    window.addEventListener('hashchange', selectFromHash);
    return () => window.removeEventListener('hashchange', selectFromHash);
  }, []);
  const distribution = dataset === 'mbti' ? stats.mbtiDistribution.map(r => ({ label: r.type, count: r.count })) : dataset === 'enneagram' ? stats.enneagramDistribution.map(r => ({ label: r.type, count: r.count })) : dataset === 'age' ? stats.ageDistribution.map(r => ({ label: r.label, count: r.count })) : stats.zodiacCrossDistribution.map(r => ({ label: r.sign, count: r.count }));
  const sample = distribution.reduce((n, row) => n + row.count, 0);
  const rows: ChartRow[] = [...distribution].sort((a, b) => sort === 'count' ? b.count - a.count || a.label.localeCompare(b.label, 'vi') : a.label.localeCompare(b.label, 'vi', { numeric: true })).map(row => ({ label: row.label, values: { value: measure === 'count' ? row.count : sample ? row.count / sample * 100 : 0 } }));
  const pairs = stats.personalityPairs ?? [];
  const pairSample = pairs.reduce((sum, pair) => sum + pair.count, 0);
  const heatRows = types.filter(type => selectedMbti === 'all' || type === selectedMbti);
  const maxPair = Math.max(1, ...pairs.map(pair => pair.count));
  const series = [{ key: 'mbti', label: 'MBTI', color: palette[0] }, { key: 'enneagram', label: 'Enneagram', color: palette[1] }, { key: 'other', label: 'Bài test khác', color: palette[2] }];
  const monthly = (stats.monthlyActivity ?? []).slice(-months).map(point => ({ label: point.label, values: { mbti: point.mbti, enneagram: point.enneagram, other: point.other } }));
  const zodiacRows = stats.zodiacCrossDistribution.map(row => ({ label: row.sign, values: { mbti: row.mbtiCount ?? 0, enneagram: row.enneagramCount ?? 0 } }));
  return <div className={styles.dashboard}>
    <header className={styles.hero} id="statistics-overview"><div><span className={styles.eyebrow}>MOSAIC · Dữ liệu cộng đồng</span><h1>Thống kê & khám phá dữ liệu</h1><p>Chọn góc nhìn, đổi biểu đồ và so sánh các chỉ số từ dữ liệu thực tế của cộng đồng.</p></div><Link href="/test" className={styles.primaryLink}>Đóng góp kết quả →</Link></header>
    {stats.dataUnavailable && <p className={styles.notice} role="alert">Chưa thể tải dữ liệu. Hãy tải lại trang; các giá trị bên dưới chưa phản ánh số liệu hiện tại.</p>}
    <div className={styles.metrics}>{[{ label: 'Thành viên', value: stats.totalUsers, note: 'Tài khoản đã đăng ký' }, { label: 'Đã làm bài test', value: stats.testedUsersCount, note: 'Số người có kết quả đã lưu' }, { label: 'Kết quả đã lưu', value: stats.totalTestsCompleted, note: 'Một người có thể làm nhiều bài' }, { label: 'Mẫu đối chiếu', value: pairSample, note: 'Chia sẻ cả MBTI và Enneagram' }].map(item => <div className={styles.metric} key={item.label}><span>{item.label}</span><strong>{item.value.toLocaleString('vi-VN')}</strong><small>{item.note}</small></div>)}</div>
    <p className={styles.notice}>Phân bố và đối chiếu chỉ sử dụng kết quả đang được đồng ý chia sẻ. Mỗi người đóng góp tối đa một kết quả gần nhất cho mỗi loại trong phân bố. Đây là mẫu cộng đồng MOSAIC, chưa đại diện cho dân số.</p>
    <section className={styles.explorer} id="mbti"><div className={styles.sectionHeading}><span className={styles.eyebrow}>01 · Phân bố</span><h2>Một bộ dữ liệu, nhiều góc nhìn</h2></div>
      <div className={styles.filters}><label>Dữ liệu<select value={dataset} onChange={e => setDataset(e.target.value as Dataset)}>{Object.entries(datasets).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>Đơn vị<select value={measure} onChange={e => setMeasure(e.target.value)}><option value="count">Số người</option><option value="percentage">Tỷ lệ trong mẫu (%)</option></select></label><label>Sắp xếp<select value={sort} onChange={e => setSort(e.target.value)}><option value="count">Số lượng giảm dần</option><option value="name">Tên nhóm</option></select></label><div className={styles.sample}>Mẫu: <strong>{sample.toLocaleString('vi-VN')} người</strong></div></div>
      <DataChart key={`${dataset}-${measure}`} title={`Phân bố ${datasets[dataset]}`} description={`Mẫu gồm ${sample} người${dataset === 'zodiac' ? ' có cung hoàng đạo hợp lệ và đã đồng ý chia sẻ' : ' đã đồng ý chia sẻ'}. Nhóm có số lượng 0 vẫn được hiển thị.`} rows={rows} series={[{ key: 'value', label: datasets[dataset], color: palette[0] }]} unit={measure === 'count' ? 'người' : '%'} />
      <span id="enneagram" /><span id="age" />
    </section>
    <section id="activity"><div className={styles.sectionHeading}><span className={styles.eyebrow}>02 · Theo thời gian</span><h2>So sánh nhiều chỉ số</h2></div><div className={styles.filters}><label>Khoảng thời gian<select value={months} onChange={e => setMonths(Number(e.target.value))}>{[3,6,12].map(value => <option value={value} key={value}>{value} tháng gần nhất</option>)}</select></label></div>
      <DataChart title="Kết quả được chia sẻ theo tháng" description="Đếm lượt kết quả theo ngày hoàn thành, trong múi giờ Việt Nam. Chỉ gồm kết quả đang có consent; tháng hiện tại chưa hoàn tất. Đây là lượt bài test, không phải số người mới." rows={monthly} series={series} ordered initial="combo" unit="kết quả" />
    </section>
    <section id="zodiac"><div className={styles.sectionHeading}><span className={styles.eyebrow}>03 · Đối chiếu</span><h2>Các chỉ số trong cùng nhóm</h2></div><DataChart title="Mẫu chia sẻ theo cung hoàng đạo" description="So sánh số người chia sẻ MBTI và Enneagram trong từng cung. Một người có thể thuộc cả hai mẫu nên các cột không cộng thành tổng số người." rows={zodiacRows} series={series.slice(0,2)} additive={false} unit="người" /></section>
    <section className={styles.chartCard} id="personality-cross"><div className={styles.chartHeading}><div><h2>MBTI × Enneagram</h2><p>{pairSample} người chia sẻ cả hai kết quả. Màu đậm biểu thị nhiều người hơn; số trong ô là số người thực tế.</p></div><label className={styles.filterLabel}>Nhóm MBTI<select value={selectedMbti} onChange={e => setSelectedMbti(e.target.value)}><option value="all">Tất cả</option>{types.map(type => <option key={type}>{type}</option>)}</select></label></div>
      {pairSample === 0 ? <div className={styles.emptyChart}>Chưa có người chia sẻ đủ cả MBTI và Enneagram để đối chiếu.</div> : <div className={styles.tableScroll}><table className={styles.heatmap}><caption>Số người theo cặp MBTI và Enneagram</caption><thead><tr><th scope="col">MBTI</th>{Array.from({ length: 9 }, (_, index) => <th scope="col" key={index}>Type {index+1}</th>)}<th scope="col">Tổng</th></tr></thead><tbody>{heatRows.map(type => <tr key={type}><th scope="row">{type}</th>{Array.from({ length: 9 }, (_, index) => { const count = pairs.find(pair => pair.mbti === type && pair.enneagram === String(index+1))?.count ?? 0; return <td key={index} style={{ background: `rgba(84,127,122,${count ? .12 + count / maxPair * .62 : .02})`, color: count / maxPair > .65 ? '#fff' : '#4f4437' }} title={`${type} × Type ${index+1}: ${count} người`}>{count}</td>; })}<td>{pairs.filter(pair => pair.mbti === type).reduce((sum, pair) => sum + pair.count, 0)}</td></tr>)}</tbody></table></div>}
      <p className={styles.footnote}>Đối chiếu mô tả sự xuất hiện cùng nhau trong mẫu; không suy ra quan hệ nhân quả hay mức độ tương thích.</p>
    </section>
    {stats.funFacts.length > 0 && <section id="community-insights"><div className={styles.sectionHeading}><span className={styles.eyebrow}>04 · Ghi nhận từ mẫu</span><h2>Điểm nổi bật của cộng đồng</h2></div><div className={styles.factGrid}>{stats.funFacts.map(fact => <article key={fact.id}><h3>{fact.title}</h3><strong>{fact.highlight}</strong><p>{fact.description}</p></article>)}</div></section>}
  </div>;
}
