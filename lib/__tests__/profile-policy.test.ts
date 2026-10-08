import { describe, expect, it } from 'vitest';
import {birthFacts,visibleProfile} from '../profile-policy';
const profile={dateOfBirth:new Date('2000-03-21'),dateOfBirthVisibility:'PRIVATE',username:'mosaic',usernameVisibility:'PUBLIC',displayName:'M',displayNameVisibility:'PUBLIC',avatarUrl:'avatar',avatarUrlVisibility:'FRIENDS',bio:'secret',bioVisibility:'PRIVATE',hobbies:'reading',interestCodes:['reading'],hobbiesVisibility:'FRIENDS',location:'city',locationVisibility:'PRIVATE'};
describe('profile privacy and birth facts',()=>{
 it('removes protected fields for strangers including derived DOB information',()=>{const p=visibleProfile(profile,false,false);expect(p.bio).toBeNull();expect(p.avatarUrl).toBeNull();expect(p.interestCodes).toEqual([]);expect(p.age).toBeNull();expect(p.zodiacSign).toBeNull();expect(p).not.toHaveProperty('bioVisibility');});
 it('allows friends fields without exposing private fields',()=>{const p=visibleProfile(profile,false,true);expect(p.avatarUrl).toBe('avatar');expect(p.interestCodes).toEqual(['reading']);expect(p.bio).toBeNull();});
 it('allows the owner to see all fields',()=>{expect(visibleProfile(profile,true,false).bio).toBe('secret');});
 it('computes birthday and zodiac using UTC dates',()=>{expect(birthFacts('2000-03-21',new Date('2026-03-20'))).toEqual({age:25,zodiacSign:'Bạch Dương'});expect(birthFacts('2000-03-21',new Date('2026-03-21')).age).toBe(26);expect(birthFacts('2000-01-19').zodiacSign).toBe('Ma Kết');expect(birthFacts('2000-01-20').zodiacSign).toBe('Bảo Bình');expect(birthFacts('2000-02-29').zodiacSign).toBe('Song Ngư');});
});
