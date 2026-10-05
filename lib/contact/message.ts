export const contactEmail = 'thepeacefulriver@gmail.com';
export const feedbackKinds = ['Góp ý giao diện','Đề xuất tính năng','Báo lỗi','Nội dung & kiến thức','Khác'] as const;
export type FeedbackFields = {kind:string;name:string;email:string;subject:string;message:string;page:string};
export function prepareFeedback(fields:FeedbackFields): {success:true;body:string;mailto:string}|{success:false;error:string} {
  const kind=fields.kind.trim(),subject=fields.subject.trim(),message=fields.message.trim();
  if(!feedbackKinds.some(item=>item===kind))return {success:false,error:'Hãy chọn một loại góp ý hợp lệ.'};
  if(subject.length<3||subject.length>100)return {success:false,error:'Tiêu đề cần từ 3 đến 100 ký tự.'};
  if(message.length<20||message.length>2000)return {success:false,error:'Nội dung cần từ 20 đến 2000 ký tự.'};
  const email=fields.email.trim();
  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return {success:false,error:'Email phản hồi chưa đúng định dạng.'};
  const clean=(value:string)=>value.replace(/[\r\n]/g,' ').trim();
  const body=[`Loại góp ý: ${kind}`,`Tên: ${clean(fields.name).slice(0,80)||'Không cung cấp'}`,`Email phản hồi: ${clean(email).slice(0,254)||'Dùng địa chỉ gửi email'}`,`Trang liên quan: ${clean(fields.page).slice(0,300)||'Không cung cấp'}`,'',message].join('\n');
  return {success:true,body,mailto:`mailto:${contactEmail}?subject=${encodeURIComponent(`[MOSAIC / ${kind}] ${clean(subject)}`)}&body=${encodeURIComponent(body)}`};
}
