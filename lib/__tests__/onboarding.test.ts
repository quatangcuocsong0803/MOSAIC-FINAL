import {expect,it} from 'vitest';
import {onboardingMove} from '../onboarding';
it('persists the current step, moves back and completes only at the final step',()=>{expect(onboardingMove(3,'save')).toBe(3);expect(onboardingMove(3,'back')).toBe(2);expect(onboardingMove(0,'back')).toBe(0);expect(onboardingMove(7,'next')).toBe(8);expect(()=>onboardingMove(8,'next')).toThrow();expect(()=>onboardingMove(-1,'back')).toThrow();});
