"use server";
import {auth} from '@clerk/nextjs/server';
import {prisma} from '@/lib/prisma';
export async function getNavigationAvatar(){
 const {userId}=await auth();if(!userId)return {success:false,avatarUrl:null};
 try{const user=await prisma.user.findUnique({where:{clerkId:userId},select:{avatarUrl:true}});return {success:true,avatarUrl:user?.avatarUrl??null};}
 catch{return {success:false,avatarUrl:null};}
}
