export const ONBOARDING_STEPS = ['Username','Tên hiển thị','Ảnh đại diện','Vị trí','Ngày sinh','Giới thiệu','Sở thích','Typology'] as const;
export function onboardingMove(current: number, direction: 'next'|'back'|'save') {
  if (!Number.isInteger(current) || current < 0 || current > 7) throw new Error('Bước onboarding không hợp lệ.');
  if (!['next','back','save'].includes(direction)) throw new Error('Thao tác không hợp lệ.');
  return direction==='next'?current+1:direction==='back'?Math.max(0,current-1):current;
}
