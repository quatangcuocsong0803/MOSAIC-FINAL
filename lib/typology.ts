export const TYPOLOGY_OPTIONS = {
 mbtiType:['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'],
 enneagramCore:['1','2','3','4','5','6','7','8','9'],
 socionicsType:['ILE','SEI','ESE','LII','EIE','LSI','SLE','IEI','SEE','ILI','LIE','ESI','LSE','EII','IEE','SLI'],
 attitudinalPsyche:['VLFE','VLEF','VFLE','VFEL','VELF','VEFL','LVFE','LVEF','LFVE','LFEV','LEVF','LEFV','FVLE','FVEL','FLVE','FLEV','FEVL','FELV','EVLF','EVFL','ELVF','ELFV','EFVL','EFLV'],
 instinctStack:['sp/so','sp/sx','so/sp','so/sx','sx/sp','sx/so'],
 moralAlignment:['Lawful Good','Neutral Good','Chaotic Good','Lawful Neutral','True Neutral','Chaotic Neutral','Lawful Evil','Neutral Evil','Chaotic Evil'],
 temperament:['Sanguine','Choleric','Melancholic','Phlegmatic','Sanguine-Choleric','Sanguine-Melancholic','Sanguine-Phlegmatic','Choleric-Sanguine','Choleric-Melancholic','Choleric-Phlegmatic','Melancholic-Sanguine','Melancholic-Choleric','Melancholic-Phlegmatic','Phlegmatic-Sanguine','Phlegmatic-Choleric','Phlegmatic-Melancholic'],
 sloanType:Array.from({length:32},(_,i)=>`${i&16?'R':'S'}${i&8?'L':'C'}${i&4?'U':'O'}${i&2?'E':'A'}${i&1?'N':'I'}`),
} as const;
export type TypologyInput = Partial<Record<keyof typeof TYPOLOGY_OPTIONS,string|null>> & {enneagramWing?:string|null;enneagramTritype?:string|null};
export const EXTRA_TYPOLOGY_FIELDS=['socionicsType','attitudinalPsyche','instinctStack','moralAlignment','temperament','sloanType'] as const;
export function validateExtraTypology(input:TypologyInput){
 const data:Record<string,string|null>={};
 for(const field of EXTRA_TYPOLOGY_FIELDS){if(input[field]!==undefined){const value=input[field];if(value!==null&&typeof value!=='string')throw Error('Typology không hợp lệ.');const normalized=value?.trim()||null;if(normalized&&!(TYPOLOGY_OPTIONS[field] as readonly string[]).includes(normalized))throw Error(`${field} không hợp lệ.`);data[field]=normalized;}}
 return data;
}
export function typologyFromProfile(profile: {confirmedMbtiType:string|null;confirmedEnneagramType:string|null;confirmedEnneagramWing:string|null;confirmedEnneagramTritype:string|null} & Partial<Record<typeof EXTRA_TYPOLOGY_FIELDS[number],string|null>>):TypologyInput {
 return {mbtiType:profile.confirmedMbtiType,enneagramCore:profile.confirmedEnneagramType?.match(/[1-9]/)?.[0]||null,enneagramWing:profile.confirmedEnneagramWing,enneagramTritype:profile.confirmedEnneagramTritype,...Object.fromEntries(EXTRA_TYPOLOGY_FIELDS.map(field=>[field,profile[field]||null]))};
}
