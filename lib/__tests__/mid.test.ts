import {expect,it} from 'vitest';
import {formatMid} from '../mid';
import {discoverWhere} from '../discover/query';
it('preserves leading zeros and rejects out-of-range IDs',()=>{expect(formatMid(1)).toBe('0000001');expect(formatMid(9999999)).toBe('9999999');expect(()=>formatMid(0)).toThrow();expect(()=>formatMid(10000000)).toThrow();});
it('searches a seven-digit MID exactly',()=>{expect(discoverWhere('me',null,null,{query:'0000001'})).toMatchObject({AND:[{}, {mid:1}]});expect(JSON.stringify(discoverWhere('me',null,null,{query:'000000'}))).not.toContain('"mid"');});
