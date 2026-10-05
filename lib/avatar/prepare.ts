/** Resize only the uploaded portrait, keeping aspect ratio and bounding request size. */
export async function prepareAvatar(file: File): Promise<File> {
  if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)) throw new Error('Chọn ảnh JPG, PNG, WebP hoặc GIF.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Ảnh quá lớn. Vui lòng chọn ảnh dưới 20 MB.');
  if (file.type === 'image/gif') {
    if (file.size > 3 * 1024 * 1024) throw new Error('Ảnh GIF cần nhỏ hơn 3 MB.');
    return file;
  }
  const url=URL.createObjectURL(file);
  try {
    const img=new Image();
    await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(new Error('Không đọc được ảnh. Hãy thử một ảnh JPG hoặc PNG khác.'));img.src=url;});
    const scale=Math.min(1,1024/Math.max(img.naturalWidth,img.naturalHeight));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
    const ctx=canvas.getContext('2d');if(!ctx) throw new Error('Trình duyệt chưa xử lý được ảnh.');
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    const format=file.type==='image/jpeg'?'image/jpeg':file.type==='image/png'?'image/png':'image/webp';
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Chưa xử lý được ảnh.')),format,0.86));
    if(blob.size>3*1024*1024) throw new Error('Ảnh vẫn quá lớn sau khi xử lý. Hãy chọn một ảnh nhỏ hơn.');
    const extension=blob.type==='image/jpeg'?'jpg':blob.type==='image/webp'?'webp':'png';
    return new File([blob],`avatar.${extension}`,{type:blob.type});
  } finally {URL.revokeObjectURL(url);}
}
