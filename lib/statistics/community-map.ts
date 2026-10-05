export const MBTI_COLORS: Record<string,string> = {
 INFJ:'#28634c', ENFJ:'#3e8867', ENFP:'#7cb99a', INFP:'#a2ccb1',
 INTJ:'#66518b', INTP:'#9280ae', ENTJ:'#4f3c75', ENTP:'#b4a1cb',
 ISTJ:'#345f85', ISFJ:'#618bad', ESTJ:'#274d70', ESFJ:'#9abed6',
 ISTP:'#b28a35', ISFP:'#d4b15f', ESTP:'#967020', ESFP:'#e8cf8b' };
export const ENNEAGRAM_COLORS: Record<string,string> = {'1':'#85533c','2':'#b67164','3':'#be963e','4':'#8e5c96','5':'#556b9e','6':'#3b7a8c','7':'#d2ac57','8':'#9d4949','9':'#709977'};
export type CountryTotals = { code:string; mbti:Record<string,number>; enneagram:Record<string,number> };
export function aggregateShares(rows: {countryCode:string;mbti:string|null;enneagram:string|null}[]): CountryTotals[] {
 const map = new Map<string,CountryTotals>();
 for (const row of rows) { const item = map.get(row.countryCode) || {code:row.countryCode,mbti:{},enneagram:{}};
  if (row.mbti && MBTI_COLORS[row.mbti]) item.mbti[row.mbti]=(item.mbti[row.mbti]||0)+1;
  if (row.enneagram && ENNEAGRAM_COLORS[row.enneagram]) item.enneagram[row.enneagram]=(item.enneagram[row.enneagram]||0)+1;
  map.set(row.countryCode,item); }
 return [...map.values()];
}
export function leadingTypes(values: Record<string,number>) { const max = Math.max(0,...Object.values(values)); return max ? Object.keys(values).filter(k=>values[k]===max) : []; }
