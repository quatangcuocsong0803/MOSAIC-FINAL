"use server";
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { knowledgePages } from '@/lib/search/knowledge-pages';
import { findPages } from '@/lib/search/pages';
export async function recordKnowledgeSearch(query:string) {
 if(typeof query!=='string'||!query.trim()||query.length>100)return;
 const {userId}=await auth();if(!userId)return;
 const match=findPages(query).find(p=>p.href.startsWith('/knowledge/'));if(!match)return;
 const day=new Date().toISOString().slice(0,10);
 try{await prisma.knowledgeSearchDaily.upsert({where:{clerkId_href_day:{clerkId:userId,href:match.href,day}},create:{clerkId:userId,href:match.href,day},update:{}});}catch{}
}
export async function popularKnowledge(){
 try{ const groups=await prisma.knowledgeSearchDaily.groupBy({by:['href'],_count:{href:true},orderBy:{_count:{href:'desc'}},take:8});return groups.flatMap(g=>{const page=knowledgePages.find(p=>p.href===g.href);return page?[{label:page.label,href:page.href,count:g._count.href}]:[];});}catch{return [];}
}
