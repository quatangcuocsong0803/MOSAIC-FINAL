'use server';
import {auth} from '@clerk/nextjs/server';
import {prisma} from '@/lib/prisma';
import {getUserProfile,updateUserProfile,type UpdateUserProfileInput} from './profile';
import {onboardingMove} from '@/lib/onboarding';
import {revalidatePath} from 'next/cache';
export async function saveOnboardingStep(step:number,direction:'next'|'back'|'save',input:UpdateUserProfileInput){
 try{
  const {userId}=await auth();if(!userId)return {success:false as const,error:'Vui lòng đăng nhập lại.'};
  const next=onboardingMove(step,direction);
  const current=await getUserProfile();if(!current.success||!current.profile)return {success:false as const,error:current.error||'Chưa tải được hồ sơ.'};
  if(current.profile.onboardingCompletedAt)return {success:true as const,profile:current.profile};
  if(current.profile.onboardingStep!==step)return {success:false as const,error:'Tiến độ đã thay đổi ở phiên khác. Hãy tải lại trang.'};
  const fields:Record<number,(keyof UpdateUserProfileInput)[]>={0:['username'],1:['displayName'],2:[],3:['location'],4:['dateOfBirth'],5:['bio'],6:['interestCodes','hobbies'],7:[]};
  const data:UpdateUserProfileInput={};
  for(const field of fields[step]){if(input[field]!==undefined)Object.assign(data,{[field]:input[field]});}
  if(direction==='next'&&((step===0&&!input.username?.trim())||(step===1&&!input.displayName?.trim())||(step===4&&!input.dateOfBirth)))return {success:false as const,error:'Vui lòng điền trường bắt buộc trước khi tiếp tục.'};
  // Save blank required fields only as drafts; advancing still requires validation.
  if(direction!=='next'){if(!data.username)delete data.username;if(!data.displayName)delete data.displayName;}
  const saved=await updateUserProfile(data);if(!saved.success)return saved;
  if(next===8&&(!saved.profile?.username||!saved.profile.displayName||!saved.profile.dateOfBirth))return {success:false as const,error:'Vui lòng bổ sung username, tên hiển thị và ngày sinh.'};
  const updated=await prisma.user.updateMany({where:{clerkId:userId,onboardingStep:step,onboardingCompletedAt:null},data:{onboardingStep:next,...(next===8?{onboardingCompletedAt:new Date()}:{})}});
  if(!updated.count)return {success:false as const,error:'Tiến độ đã thay đổi. Hãy tải lại trang.'};
  revalidatePath('/profile');return getUserProfile();
 }catch{ return {success:false as const,error:'Chưa lưu được tiến độ. Vui lòng thử lại.'}; }
}
