'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { SignOutButton, useClerk } from '@clerk/nextjs';
import type { UserProfileData } from '@/app/actions/profile';
import { getUserSettings, saveUserSettings } from '@/app/actions/settings';
import { type Preferences, type SettingsSnapshot } from '@/lib/settings/preferences';
import { announceSettings } from './DisplayPreferences';
import styles from './Settings.module.css';
const ProfileFormModal = dynamic(() => import('@/src/components/ProfileFormModal'), { ssr: false });
const notificationOptions = [
  ['notificationFriends', 'Bạn bè', 'Lời mời kết bạn và thông báo chấp nhận lời mời.'],
  ['notificationComments', 'Bình luận & trả lời', 'Bình luận đã được duyệt trên bài viết hoặc phản hồi dành cho bạn.'],
  ['notificationReactions', 'Tương tác cộng đồng', 'Reaction và hoạt động cộng đồng có gửi thông báo.'],
  ['notificationReviews', 'Kết quả duyệt bài', 'Kết quả kiểm duyệt và yêu cầu chỉnh sửa bài Discussion.'],
] as const;
function preferencesOnly({ revision: _revision, ...preferences }: SettingsSnapshot): Preferences { return preferences; }
export default function SettingsPanel({ initialProfile, initialSettings, clerkId }: { initialProfile: UserProfileData; initialSettings: SettingsSnapshot; clerkId: string }) {
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(initialSettings);
  const [draft, setDraft] = useState(preferencesOnly(initialSettings));
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [conflict, setConflict] = useState(false);
  const { openUserProfile } = useClerk();
  const dirty = JSON.stringify(draft) !== JSON.stringify(preferencesOnly(saved));
  function change<K extends keyof Preferences>(key: K, value: Preferences[K]) { setDraft(current => ({ ...current, [key]: value })); setMessage(''); }
  async function save() {
    setPending(true);
    try {
      const result = await saveUserSettings(draft, saved.revision);
      setError(!result.success);
      if (!result.success) { setMessage(result.error); setConflict(Boolean(result.conflict)); return; }
      setSaved(result.settings); setDraft(preferencesOnly(result.settings)); setConflict(false);
      announceSettings(clerkId, result.settings); setMessage('Đã lưu cài đặt.');
    } catch { setError(true); setMessage('Mất kết nối. Hãy thử lưu lại.'); }
    finally { setPending(false); }
  }
  async function reload() {
    setPending(true);
    try {
      const result = await getUserSettings();
      if (!result.success) { setError(true); setMessage(result.error); return; }
      setSaved(result.settings); setDraft(preferencesOnly(result.settings)); setConflict(false); setError(false);
      announceSettings(clerkId, result.settings); setMessage('Đã tải cài đặt mới nhất.');
    } catch { setError(true); setMessage('Chưa tải được cài đặt. Hãy thử lại.'); }
    finally { setPending(false); }
  }
  return <div className={styles.page}>
    <p className={styles.eyebrow}>YOUR MOSAIC</p><h1>Cài đặt</h1><p className={styles.intro}>Một không gian phù hợp hơn với bạn. Các tùy chọn được lưu riêng theo tài khoản.</p>
    <nav className={styles.tabs} aria-label="Các mục cài đặt"><a href="#account">Tài khoản & bảo mật</a><a href="#profile">Hồ sơ & hình ảnh</a><a href="#notifications">Thông báo</a><a href="#display">Hiển thị</a></nav>
    <section id="account" className={styles.card}><h2>Tài khoản & bảo mật</h2><p>Quản lý email, phương thức đăng nhập và phiên đăng nhập trong phần quản lý tài khoản Clerk. Các lựa chọn bảo mật phụ thuộc vào phương thức đăng nhập đang dùng.</p><div className={styles.actions}><button type="button" onClick={() => openUserProfile()}>Quản lý tài khoản & bảo mật</button><Link href="/profile/blocked">Người dùng đã chặn →</Link><SignOutButton redirectUrl="/"><button type="button" className={styles.secondary}>Đăng xuất</button></SignOutButton></div></section>
    <section id="profile" className={styles.card}><h2>Hồ sơ & hình ảnh</h2><div className={styles.profile}>
      {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Ảnh đại diện của bạn" className={styles.avatar} /> : <span className={styles.avatar} aria-hidden="true">{profile.username?.slice(0, 1).toUpperCase() || 'M'}</span>}
      <div><strong>{profile.displayName || profile.username || 'Thành viên MOSAIC'}</strong><p>Ảnh đại diện, giới thiệu, sở thích và thông tin hồ sơ.</p></div></div>
      <div className={styles.actions}><button type="button" onClick={() => setEditing(true)}>Chỉnh sửa hồ sơ & ảnh</button><Link href="/profile">Xem hồ sơ & lựa chọn chia sẻ kết quả →</Link></div>
    </section>
    <form onSubmit={event => { event.preventDefault(); void save(); }}>
      <fieldset disabled={pending} className={styles.fieldset}>
        <section id="notifications" className={styles.card}><h2>Thông báo</h2><p>Áp dụng cho thông báo mới trong MOSAIC sau khi lưu. Những thông báo đã nhận vẫn được giữ lại.</p>
          {notificationOptions.map(([key, title, description]) => <label className={styles.row} key={key}><span><strong>{title}</strong><small>{description}</small></span><input type="checkbox" checked={draft[key]} onChange={event => change(key, event.target.checked)} /></label>)}
        </section>
        <section id="display" className={styles.card}><h2>Hiển thị</h2><label className={styles.row}><span><strong>Cỡ chữ</strong><small>Tăng cỡ chữ cơ bản của giao diện.</small></span><select value={draft.textSize} onChange={event => change('textSize', event.target.value as Preferences['textSize'])}><option value="NORMAL">Tiêu chuẩn</option><option value="LARGE">Lớn</option></select></label>
          <label className={styles.row}><span><strong>Giảm chuyển động</strong><small>Giảm hiệu ứng chuyển trang, hover và dừng carousel tự chạy. Thiết lập giảm chuyển động của thiết bị cũng được tôn trọng.</small></span><input type="checkbox" checked={draft.reducedMotion} onChange={event => change('reducedMotion', event.target.checked)} /></label>
          <label className={styles.row}><span><strong>Nền trang trí nội dung</strong><small>Hiện hình nền trang chủ và các họa tiết nền quanh nội dung.</small></span><input type="checkbox" checked={draft.showDecorations} onChange={event => change('showDecorations', event.target.checked)} /></label>
        </section>
      </fieldset>
      <div className={styles.saveBar}><span role={error ? 'alert' : 'status'} aria-live="polite">{message || (dirty ? 'Bạn có thay đổi chưa lưu.' : 'Cài đặt đã được đồng bộ.')}</span><div className={styles.actions}>{conflict && <button type="button" disabled={pending} onClick={() => void reload()} className={styles.secondary}>Tải bản mới (bỏ thay đổi chưa lưu)</button>}<button disabled={pending || !dirty || conflict} type="submit">{pending ? 'Đang xử lý…' : 'Lưu cài đặt'}</button></div></div>
    </form>
    <p className={styles.note}><Link href="/privacy">Quyền riêng tư</Link> · <Link href="/terms">Điều khoản sử dụng</Link> · <Link href="/support">Báo lỗi & liên hệ</Link></p>
    {editing && <ProfileFormModal isOpen={editing} onClose={() => setEditing(false)} initialData={profile} onSuccess={updated => { setProfile(updated); setEditing(false); }} />}
  </div>;
}
