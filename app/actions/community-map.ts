"use server";
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import countries from '@/lib/statistics/world-countries.json';
import { aggregateShares, MBTI_COLORS, ENNEAGRAM_COLORS } from '@/lib/statistics/community-map';
export async function getCommunityMap() {
 try { return { available:true, countries: aggregateShares(await prisma.communityMapShare.findMany({select:{countryCode:true,mbti:true,enneagram:true}})) }; }
 catch { return { available:false, countries:[] }; }
}
export async function getMyMapShare() {
 const {userId}=await auth(); if(!userId)return null;
 try { return await prisma.communityMapShare.findUnique({where:{clerkId:userId},select:{countryCode:true,mbti:true,enneagram:true}}); } catch{return null;}
}
export async function saveMapShare(input:{countryCode:string;mbti:string;enneagram:string;consent:boolean}) {
 const {userId}=await auth();if(!userId)return {success:false,message:'Vui lòng đăng nhập để chia sẻ.'};
 if(input.consent !== true || !countries.some(c=>c.code===input.countryCode) || (input.mbti && !MBTI_COLORS[input.mbti]) || (input.enneagram && !ENNEAGRAM_COLORS[input.enneagram]) || (!input.mbti && !input.enneagram))return {success:false,message:'Chọn quốc gia, ít nhất một kiểu và đồng ý chia sẻ.'};
 try {await prisma.communityMapShare.upsert({where:{clerkId:userId},create:{clerkId:userId,countryCode:input.countryCode,mbti:input.mbti||null,enneagram:input.enneagram||null},update:{countryCode:input.countryCode,mbti:input.mbti||null,enneagram:input.enneagram||null}});revalidatePath('/statistics/map'); revalidatePath('/statistics');return {success:true,message:'Đã cập nhật chia sẻ của bạn.'};}catch{return {success:false,message:'Chưa lưu được. Vui lòng thử lại.'};}
}
export async function withdrawMapShare() {
 const {userId}=await auth();if(!userId)return {success:false,message:'Vui lòng đăng nhập.'};
 try { await prisma.communityMapShare.deleteMany({where:{clerkId:userId}});revalidatePath('/statistics/map');revalidatePath('/statistics');return {success:true,message:'Đã rút chia sẻ khỏi bản đồ.'}; }catch{return {success:false,message:'Chưa rút được chia sẻ. Vui lòng thử lại.'};}
}
