import {visibleFieldWhere} from '@/lib/profile-policy';
import type { Prisma } from '@prisma/client';
export type DiscoverTab='suggested'|'community'|'requests';
export type DiscoverOptions={tab?:DiscoverTab;query?:string;type?:string;after?:string};
export const DISCOVER_PAGE_SIZE=24;
export const discoverSelect={id:true,clerkId:true,username:true,createdAt:true,displayName:true,interestCodes:true,dateOfBirth:true,usernameVisibility:true,displayNameVisibility:true,avatarUrlVisibility:true,dateOfBirthVisibility:true,bioVisibility:true,hobbiesVisibility:true,locationVisibility:true,avatarUrl:true,bio:true,hobbies:true,location:true,confirmedMbtiType:true,confirmedEnneagramType:true} satisfies Prisma.UserSelect;
export function enneagramFilter(core:string): Prisma.UserWhereInput {
  // Match the core at the start, not a wing such as the 5 in Type 4w5.
  return {OR:[{confirmedEnneagramType:{startsWith:core}},{confirmedEnneagramType:{startsWith:`Type ${core}`,mode:'insensitive'}},{confirmedEnneagramType:{startsWith:`Type${core}`,mode:'insensitive'}}]};
}
export function discoverWhere(id:string,mbti:string|null,enneagram:string|null,options:DiscoverOptions): Prisma.UserWhereInput {
  const conditions:Prisma.UserWhereInput[]=[{id:{not:id},blocksCreated:{none:{blockedId:id}},blocksReceived:{none:{blockerId:id}}}];
  if(options.tab==='suggested') {
    const OR:Prisma.UserWhereInput[]=[];
    if(mbti) OR.push({confirmedMbtiType:{equals:mbti,mode:'insensitive'}});
    if(enneagram) OR.push(enneagramFilter(enneagram));
    if(!OR.length) conditions.push({id:{in:[]}});else conditions.push({OR});
  }
  if(options.tab==='requests') conditions.push({sentRequests:{some:{receiverId:id,status:'PENDING'}},NOT:{OR:[{sentRequests:{some:{receiverId:id,status:'ACCEPTED'}}},{receivedRequests:{some:{senderId:id,status:'ACCEPTED'}}}]}});
  const type=options.type?.trim()||'';
  if(/^[IE][NS][TF][JP]$/i.test(type)) conditions.push({confirmedMbtiType:{equals:type.toUpperCase(),mode:'insensitive'}});
  else if(/^Type [1-9]$/i.test(type)) conditions.push(enneagramFilter(type.slice(-1)));
  const query=options.query?.trim().slice(0,100);
  if(query) conditions.push({OR:[...(['username','displayName','hobbies','location'] as const).map(field=>({AND:[{[field]:{contains:query,mode:'insensitive'}},visibleFieldWhere(field,id)]})),...['confirmedMbtiType','confirmedEnneagramType'].map(field=>({[field]:{contains:query,mode:'insensitive'}}))]});
  return {AND:conditions};
}
