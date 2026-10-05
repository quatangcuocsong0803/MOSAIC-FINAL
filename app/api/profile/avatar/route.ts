import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { avatarFormat, MAX_AVATAR_BYTES } from '@/lib/avatar/validation';
export const runtime='nodejs';
const BUCKET='mosaic-media';
export async function POST(request: Request) {
  const {userId}=await auth();
  if(!userId) return NextResponse.json({error:'Vui lòng đăng nhập lại để đổi ảnh.'},{status:401});
  const origin=request.headers.get('origin');
  if(origin && origin!==new URL(request.url).origin) return NextResponse.json({error:'Yêu cầu tải ảnh không hợp lệ.'},{status:403});
  if(Number(request.headers.get('content-length')||0)>MAX_AVATAR_BYTES+64*1024) return NextResponse.json({error:'Ảnh cần nhỏ hơn 3 MB.'},{status:413});
  let storage: ReturnType<typeof getSupabaseAdmin> | undefined;
  let uploadedPath: string | undefined;
  try {
    const user=await prisma.user.findUnique({where:{clerkId:userId},select:{id:true}});
    if(!user) return NextResponse.json({error:'Vui lòng tải lại hồ sơ trước khi đổi ảnh.'},{status:409});
    const form=await request.formData();const file=form.get('avatar');
    if(!(file instanceof File) || !file.size) return NextResponse.json({error:'Chưa nhận được ảnh.'},{status:400});
    if(file.size>MAX_AVATAR_BYTES) return NextResponse.json({error:'Ảnh cần nhỏ hơn 3 MB.'},{status:413});
    const bytes=new Uint8Array(await file.arrayBuffer());const format=avatarFormat(bytes);
    if(!format) return NextResponse.json({error:'File không phải ảnh JPG, PNG, WebP hoặc GIF hợp lệ.'},{status:400});
    try {storage=getSupabaseAdmin();} catch {
      return NextResponse.json({error:'Dịch vụ ảnh chưa được cấu hình. Cần đặt SUPABASE_SECRET_KEY ở môi trường server.'},{status:503});
    }
    const bucket=await storage.storage.getBucket(BUCKET);
    if(bucket.error) {
      // A missing bucket can be provisioned; do not treat credential/network failures as absence.
      if(String(bucket.error.statusCode)!=='404' && !bucket.error.message.toLowerCase().includes('not found')) throw new Error('Không truy cập được kho ảnh. Kiểm tra cấu hình Storage phía server.');
      const created=await storage.storage.createBucket(BUCKET,{public:true,fileSizeLimit:MAX_AVATAR_BYTES,allowedMimeTypes:['image/jpeg','image/png','image/webp','image/gif']});
      if(created.error && !created.error.message.toLowerCase().includes('already')) throw new Error('Chưa tạo được kho ảnh đại diện.');
    } else if(!bucket.data?.public) {
      return NextResponse.json({error:'Kho avatar mosaic-media cần được cấu hình public để hiển thị ảnh.'},{status:503});
    }
    const path=`avatars/${user.id}/${randomUUID()}.${format.extension}`;
    const upload=await storage.storage.from(BUCKET).upload(path,bytes,{contentType:format.contentType,cacheControl:'31536000',upsert:false});
    if(upload.error) throw new Error('Storage chưa nhận được ảnh. Kiểm tra quyền và giới hạn của bucket mosaic-media.');
    uploadedPath=path;
    const {data}=storage.storage.from(BUCKET).getPublicUrl(path);
    const profile=await prisma.user.update({where:{id:user.id},data:{avatarUrl:data.publicUrl},select:{avatarUrl:true}});
    return NextResponse.json({success:true,avatarUrl:profile.avatarUrl},{headers:{'Cache-Control':'no-store'}});
  } catch(error) {
    if(storage && uploadedPath) {
      try {await storage.storage.from(BUCKET).remove([uploadedPath]);} catch { /* cleanup failure must not mask the save error */ }
    }
    console.error('Avatar upload failed:',error);
    return NextResponse.json({error:uploadedPath?'Ảnh đã tải lên nhưng chưa lưu được hồ sơ. Vui lòng thử lại.':error instanceof Error && error.message.startsWith('Storage')?error.message:'Chưa tải được ảnh. Vui lòng thử lại hoặc kiểm tra cấu hình Storage.'},{status:500});
  }
}
