"use client";
import {useId,useRef,useState} from 'react';
import countries from '@/lib/statistics/world-countries.json';
import {MBTI_COLORS,ENNEAGRAM_COLORS,leadingTypes,type CountryTotals} from '@/lib/statistics/community-map';
import styles from './WorldMap.module.css';
type Props={data:CountryTotals[];variable:'mbti'|'enneagram';filter?:string;selected:string;onSelect:(code:string)=>void;zoom?:number;compact?:boolean};
export default function WorldMap({data,variable,filter='',selected,onSelect,zoom=1,compact=false}:Props){
 const pattern='map-tie-'+useId().replace(/:/g,'');const shell=useRef<HTMLDivElement>(null);const [hover,setHover]=useState<{code:string;x:number;y:number}|null>(null);
 const colors=variable==='mbti'?MBTI_COLORS:ENNEAGRAM_COLORS;const lookup=new Map(data.map(c=>[c.code,c]));
 function show(code:string,clientX:number,clientY:number){const rect=shell.current?.getBoundingClientRect();if(!rect)return;setHover({code,x:Math.max(8,Math.min(clientX-rect.left+14,rect.width-290)),y:Math.max(8,Math.min(clientY-rect.top+14,rect.height-250))});onSelect(code);}
 function fill(code:string){const values=lookup.get(code)?.[variable]||{};if(filter)return values[filter]?colors[filter]:'#e5ded1';const leaders=leadingTypes(values);return leaders.length===1?colors[leaders[0]]:leaders.length>1?`url(#${pattern})`:'#e5ded1';}
 const stats=hover?lookup.get(hover.code)?.[variable]||{}:{};const total=Object.values(stats).reduce((a,b)=>a+b,0);const ordered=Object.entries(stats).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
 return <div ref={shell} className={`${styles.shell} ${compact?styles.compact:''}`} onPointerLeave={()=>setHover(null)}>
 <div className={styles.viewport}><svg viewBox="0 25 900 390" style={{width:`${zoom*100}%`}} role="img" aria-label="Bản đồ phân bố MBTI và Enneagram. Di chuột hoặc chạm vào quốc gia để xem tỷ lệ."><defs><pattern id={pattern} width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#bca8ca"/><path d="M0 0L6 6" stroke="#fff" strokeWidth="2"/></pattern></defs>{countries.map(c=><path key={c.code} d={c.path} fill={fill(c.code)} stroke={selected===c.code?'#6d5437':'#fffdf8'} strokeWidth={selected===c.code?1.3:.5} className={hover?.code===c.code?styles.active:''} onPointerEnter={e=>{if(e.pointerType!=='touch')show(c.code,e.clientX,e.clientY)}} onPointerMove={e=>{if(e.pointerType!=='touch')show(c.code,e.clientX,e.clientY)}} onClick={e=>show(c.code,e.clientX,e.clientY)} aria-label={c.name}></path>)}</svg></div>
 {hover&&<div className={styles.tooltip} role="tooltip" style={{left:hover.x,top:hover.y}}><strong>{countries.find(c=>c.code===hover.code)?.name}</strong><small>{total} chia sẻ {variable==='mbti'?'MBTI':'Enneagram'}</small>{total?<div className={styles.percentGrid}>{ordered.map(([type,n])=><div key={type}><span><i style={{background:colors[type]}}/>{variable==='mbti'?type:'Type '+type}</span><b>{(n/total*100).toFixed(1)}%</b></div>)}</div>:<p>Chưa có dữ liệu được chia sẻ.</p>}<footer>Tỷ lệ trong quốc gia này</footer></div>}
 </div>;
}
