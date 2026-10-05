export type SharedResult = { testType: string; resultName: string; statisticsConsent: boolean; statisticsConsentRevokedAt: Date | null; createdAt: Date };
export type MonthlyPoint = { month: string; label: string; mbti: number; enneagram: number; other: number };
export type PersonalityPair = { mbti: string; enneagram: string; count: number };
export function activeResult(result: SharedResult) {
  return result.statisticsConsent && result.statisticsConsentRevokedAt === null;
}
export function mbtiCode(value: string) { return value.toUpperCase().match(/\b([IE][NS][TF][JP])\b/)?.[1] ?? null; }
export function enneagramCode(value: string) { return value.match(/[1-9]/)?.[0] ?? null; }
export function monthKey(date: Date) {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit' }).formatToParts(date);
  return `${parts.find(p => p.type === 'year')!.value}-${parts.find(p => p.type === 'month')!.value}`;
}
// Events count shared test submissions; a person may submit more than one test.
export function monthlyResults(results: SharedResult[], now = new Date()): MonthlyPoint[] {
  const [year, month] = monthKey(now).split('-').map(Number);
  const points = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 12 + index, 1));
    return { month: date.toISOString().slice(0, 7), label: `${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`, mbti: 0, enneagram: 0, other: 0 };
  });
  const byMonth = new Map(points.map(point => [point.month, point]));
  for (const result of results) {
    if (!activeResult(result) || result.createdAt > now) continue;
    const point = byMonth.get(monthKey(result.createdAt));
    if (!point) continue;
    const type = result.testType.toUpperCase();
    point[type === 'MBTI' ? 'mbti' : type === 'ENNEAGRAM' ? 'enneagram' : 'other']++;
  }
  return points;
}
// Exactly one latest shared result per test type and per person.
export function personalityPairs(users: { testResults: SharedResult[] }[]): PersonalityPair[] {
  const counts = new Map<string, PersonalityPair>();
  for (const user of users) {
    const sorted = [...user.testResults].filter(activeResult).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const mbti = mbtiCode(sorted.find(r => r.testType.toUpperCase() === 'MBTI')?.resultName ?? '');
    const enneagram = enneagramCode(sorted.find(r => r.testType.toUpperCase() === 'ENNEAGRAM')?.resultName ?? '');
    if (!mbti || !enneagram) continue;
    const key = `${mbti}:${enneagram}`;
    const item = counts.get(key) ?? { mbti, enneagram, count: 0 };
    item.count++;
    counts.set(key, item);
  }
  return [...counts.values()];
}
