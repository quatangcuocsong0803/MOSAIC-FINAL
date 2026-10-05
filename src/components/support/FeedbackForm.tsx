"use client";
import { useState, type FormEvent } from 'react';
import { contactEmail, feedbackKinds, prepareFeedback } from '@/lib/contact/message';
import styles from './Support.module.css';
export default function FeedbackForm() {
  const [draft,setDraft]=useState<{body:string;mailto:string}|null>(null);
  const [status,setStatus]=useState('');
  function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();const data=new FormData(event.currentTarget);
    const value=(key:string)=>String(data.get(key)??'');
    const result=prepareFeedback({kind:value('kind'),name:value('name'),email:value('email'),subject:value('subject'),message:value('message'),page:value('page')});
    if(!result.success){setDraft(null);setStatus(result.error);return;}
    setDraft(result);setStatus('Nội dung đã sẵn sàng. Mở ứng dụng email bên dưới để kiểm tra và gửi.');
  }
  async function copy(){
    try{if(!draft||!navigator.clipboard)throw new Error('unavailable');await navigator.clipboard.writeText(draft.body);setStatus('Đã sao chép nội dung. Bạn có thể dán vào email và gửi tới '+contactEmail);}
    catch{setStatus('Chưa thể sao chép tự động. Hãy chọn nội dung trong ô bên dưới rồi sao chép thủ công.');}
  }
  return <form onSubmit={submit} className={styles.form} onChange={()=>{setDraft(null);setStatus('');}}>
    <div className={styles.formGrid}><label>Loại góp ý<select name="kind" defaultValue={feedbackKinds[0]}>{feedbackKinds.map(kind=><option key={kind}>{kind}</option>)}</select></label><label>Tên của bạn <span>(không bắt buộc)</span><input name="name" autoComplete="name" maxLength={80}/></label><label className={styles.full}>Email để phản hồi <span>(không bắt buộc)</span><input name="email" type="email" autoComplete="email" maxLength={254} placeholder="ban@example.com"/></label></div>
    <label>Tiêu đề<input name="subject" required minLength={3} maxLength={100} placeholder="Bạn muốn MOSAIC cải thiện điều gì?"/></label>
    <label>Trang liên quan <span>(không bắt buộc)</span><input name="page" maxLength={300} placeholder="Ví dụ: /statistics hoặc tên bài test"/></label>
    <label>Nội dung<textarea name="message" required minLength={20} maxLength={2000} rows={7} placeholder="Chia sẻ ý tưởng của bạn. Nếu báo lỗi, hãy ghi thao tác, điều bạn mong đợi và kết quả thực tế."/></label>
    <p className={styles.formHint}>Form chuẩn bị nội dung email, không tự gửi hoặc lưu góp ý lên website. Bạn sẽ gửi từ ứng dụng email của mình. Đừng đưa mật khẩu, mã đăng nhập hoặc thông tin riêng tư của người khác vào nội dung.</p>
    <button type="submit" className={styles.primaryButton}>Chuẩn bị email góp ý →</button>
    <p role="status" aria-live="polite" className={styles.status}>{status}</p>
    {draft&&<div className={styles.draft}><h3>Góp ý đã chuẩn bị</h3><label>Nội dung email<textarea readOnly value={draft.body} rows={7}/></label><div className={styles.actions}><a href={draft.mailto} className={styles.primaryButton}>Mở ứng dụng email →</a><button type="button" onClick={copy} className={styles.secondaryButton}>Sao chép nội dung</button></div><p>Người nhận: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Nếu chưa thiết lập ứng dụng email, hãy sao chép nội dung rồi gửi bằng Gmail hoặc dịch vụ bạn đang dùng.</p></div>}
  </form>;
}
