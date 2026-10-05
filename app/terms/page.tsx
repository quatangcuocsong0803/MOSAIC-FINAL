import Link from 'next/link';
import styles from '@/src/components/settings/Settings.module.css';
export const metadata = { title:'Điều khoản sử dụng · MOSAIC' };
export default function TermsPage() {
  return <div className={styles.page}><p className={styles.eyebrow}>MOSAIC / TERMS</p><h1>Điều khoản sử dụng</h1><p className={styles.intro}>Nguyên tắc cơ bản khi tham gia MOSAIC.</p>
    <section className={styles.card}><h2>Khám phá bản thân</h2><p>Bài test, phân tích typology và Statistics phục vụ tìm hiểu, học hỏi và tự khám phá. Kết quả không phải chẩn đoán y khoa hoặc đánh giá lâm sàng và không nên dùng để quyết định giá trị hay khả năng của một người.</p></section>
    <section className={styles.card}><h2>Thảo luận có trách nhiệm</h2><p>Phân biệt rõ dữ kiện, lý thuyết, diễn giải và câu hỏi. Dẫn nguồn cho các nhận định cần bằng chứng, tôn trọng bản quyền và quyền riêng tư. Không quấy rối, công kích cá nhân, đăng dữ liệu bí mật, giả mạo danh tính hoặc gửi nội dung spam.</p><p>Xác minh URL hoặc DOI tồn tại không có nghĩa MOSAIC xác nhận nguồn đó đúng hoặc mọi lập luận trong bài đã được chứng minh.</p></section>
    <section className={styles.card}><h2>Kiểm duyệt nội dung</h2><p>Bài viết và bình luận có thể cần được duyệt, chỉnh sửa hoặc bị từ chối trước khi công khai. Bạn có thể theo dõi kết quả bài viết, sửa và gửi lại theo quy trình Discussion. Chủ nhóm và moderator quản lý quyền tham gia theo các chức năng nhóm hiện có.</p><Link href="/discussion/reviews">Theo dõi bài viết của tôi →</Link></section>
    <section className={styles.card}><h2>Tài khoản và góp ý</h2><p>Bảo vệ phương thức đăng nhập của bạn và chỉ tải lên nội dung bạn có quyền chia sẻ. Nếu gặp lỗi hoặc muốn góp ý về các nguyên tắc này, hãy sử dụng kênh Meta của MOSAIC.</p><div className={styles.actions}><Link href="/support">Báo lỗi & liên hệ →</Link><Link href="/privacy">Quyền riêng tư →</Link></div></section></div>;
}
