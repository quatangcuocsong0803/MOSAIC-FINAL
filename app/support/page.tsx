import Link from 'next/link';
import styles from '@/src/components/settings/Settings.module.css';
export const metadata = { title:'Báo lỗi & liên hệ · MOSAIC' };
export default function SupportPage() {
  return <div className={styles.page}><p className={styles.eyebrow}>MOSAIC / SUPPORT</p><h1>Báo lỗi & liên hệ</h1><p className={styles.intro}>Bạn có thể gửi góp ý qua email hoặc trao đổi công khai tại forum Meta / Platform Discussion.</p>
    <section id="report" className={styles.card}><h2>Báo lỗi</h2><p>Để dễ tìm nguyên nhân, hãy ghi tên trang, thao tác bạn thực hiện, kết quả mong muốn và lỗi thực tế. Nếu có, thêm trình duyệt, thiết bị và ảnh chụp màn hình đã che thông tin cá nhân.</p><p>Báo lỗi gửi qua Meta là bài thảo luận công khai sau khi được duyệt. Đừng đăng mật khẩu, mã đăng nhập, API key, nội dung tin nhắn riêng hoặc dữ liệu nhạy cảm.</p><div className={styles.actions}><Link href="/discussion/new?forum=meta">Viết bài báo lỗi trong Meta →</Link><Link href="/discussion?forum=meta">Xem các bài trong Meta →</Link></div></section>
    <section id="contact" className={styles.card}><h2>Liên hệ trực tiếp</h2><p>Trao đổi với người phát triển MOSAIC qua email: <a href="mailto:thepeacefulriver@gmail.com">thepeacefulriver@gmail.com</a>.</p><div className={styles.actions}><Link href="/contact">Thông tin liên hệ →</Link><Link href="/feedback">Trang góp ý →</Link></div></section><p className={styles.note}><Link href="/">← Trang chủ</Link> · <Link href="/settings">Cài đặt</Link></p></div>;
}
