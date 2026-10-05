import { knowledgePages } from './knowledge-pages';
export type SearchPage = { label: string; href: string; category: string; description: string; keywords: string };
const page = (label: string, href: string, category: string, description: string, keywords: string): SearchPage => ({ label, href, category, description, keywords });
export const searchPages: SearchPage[] = [
  page('Trang chủ MOSAIC','/','MOSAIC','Khám phá các nội dung và tính năng của MOSAIC.','home homepage mosaic'),
  page('Tất cả bài test','/test','Bài test','Chọn bài trắc nghiệm phù hợp.','tests trac nghiem tinh cach'),
  page('Bài test MBTI truyền thống','/test/mbti','Bài test','Trắc nghiệm MBTI với 72 câu hỏi.','mbti traditional 72 cau hoi myers briggs tinh cach'),
  page('Bài test MBTI AI Adaptive','/test/cognitive-functions/ai','Bài test','Khám phá chức năng nhận thức qua câu hỏi mở thích ứng.','test ai cognitive functions adaptive tri tue nhan tao chuc nang nhan thuc cau hoi mo'),
  page('Bài test Enneagram','/test/enneagram','Bài test','Trắc nghiệm Enneagram, wing và bản năng.','ennea enneagram traditional 9 type wing canh instinct ban nang sp sx so'),
  page('Khám phá & kết nối','/discover','Kết nối','Tìm thành viên và gợi ý tương đồng tính cách.','discover ban be tim nguoi ket noi tuong dong'),
  page('Diễn đàn Discussion','/discussion','Discussion','Duyệt diễn đàn và các bài thảo luận công khai.','forum forums bai viet cong dong discussion thao luan'),
  page('Tạo bài thảo luận','/discussion/new','Discussion','Soạn bài, thêm citation và tệp đính kèm để gửi duyệt.','viet bai dang bai new post composer soan bai citation trich dan doi nguon attachment upload tep dinh kem'),
  page('Bản nháp thảo luận','/discussion/drafts','Discussion','Mở, sửa hoặc xóa bản nháp đã lưu của bạn.','draft drafts autosave tu dong luu bai viet ban nhap discussion'),
  page('Trạng thái duyệt bài','/discussion/reviews','Discussion','Theo dõi kết quả duyệt, yêu cầu chỉnh sửa và gửi lại bài.','moderation review approve reject revise retry edit resubmit kiem duyet chinh sua gui lai discussion'),
  page('Nhóm thảo luận','/discussion/groups','Discussion','Khám phá và tham gia các nhóm thảo luận.','group groups nhom discussion thanh vien tham gia'),
  page('Tạo nhóm thảo luận','/discussion/groups/new','Discussion','Tạo nhóm mới và chọn chế độ công khai hoặc riêng tư.','new group tao nhom public private discussion'),
  page('Bình luận & phản hồi','/discussion','Discussion','Mở bài thảo luận để xem và gửi bình luận hoặc trả lời.','comment comments reply replies binh luan phan hoi tra loi moderation kiem duyet discussion'),
  page('Quản lý thành viên nhóm','/discussion/groups','Discussion','Mở nhóm của bạn để quản lý thành viên và yêu cầu tham gia.','quan ly thanh vien group members owner moderator yeu cau tham gia duyet nhom'),
  page('Kiến thức typology','/knowledge','Kiến thức','Tra cứu MBTI, Enneagram và các chức năng nhận thức.','knowledge ly thuyet typology tinh cach'),
  page('Cơ sở lý thuyết MOSAIC','/knowledge/theory','Kiến thức','Tìm hiểu nền tảng lý thuyết và cách tiếp cận của MOSAIC.','theory jung myers briggs nen tang'),
  page('Thống kê cộng đồng','/statistics','Statistics','Đổi biểu đồ, chọn dữ liệu và xuất CSV.','statistics thong ke so lieu chart bieu do bar pie bang csv'),
  page('Phân bố MBTI','/statistics#mbti','Statistics','Biểu đồ phân bố các nhóm MBTI.','thong ke statistics ti le ty le mbti'),
  page('Phân bố Enneagram','/statistics#enneagram','Statistics','Biểu đồ phân bố Enneagram.','thong ke statistics ti le ty le enneagram'),
  page('Phân bố độ tuổi','/statistics#age','Statistics','Thống kê các nhóm tuổi trong mẫu chia sẻ.','age demographics nhan khau hoc tuoi thong ke'),
  page('Biểu đồ nhiều chỉ số theo thời gian','/statistics#activity','Statistics','So sánh MBTI, Enneagram và bài test khác theo tháng.','worldbank ket hop cot chong line duong thoi gian nhieu chi so thong ke statistics'),
  page('Đối chiếu cung hoàng đạo','/statistics#zodiac','Statistics','So sánh mẫu chia sẻ kết quả trong từng cung.','zodiac chiem tinh cung hoang dao thong ke'),
  page('Đối chiếu MBTI × Enneagram','/statistics#personality-cross','Statistics','Bảng đối chiếu hai kết quả được đồng ý chia sẻ.','heatmap ma tran cross tab bang cheo mbti enneagram thong ke'),
  page('Điểm nổi bật của cộng đồng','/statistics#community-insights','Statistics','Các ghi nhận mô tả từ mẫu dữ liệu.','fun facts xu huong thong ke statistics'),
  page('Tin nhắn','/messages','Tài khoản','Mở các cuộc trò chuyện của bạn.','messages message chat nhan tin tro chuyen'),
  page('Hồ sơ cá nhân','/profile','Tài khoản','Xem và cập nhật hồ sơ của bạn.','profile tai khoan avatar thong tin ca nhan'),
  page('Người dùng đã chặn','/profile/blocked','Tài khoản','Quản lý danh sách chặn và bỏ chặn.','block blocked unblock chan bo chan rieng tu'),
  page('Kết quả bài test','/result','Kết quả','Xem kết quả trắc nghiệm đã lưu.','result results ket qua lich su test'),
  page('Kết quả MBTI','/result/mbti','Kết quả','Xem phân tích kết quả MBTI của bạn.','result cognitive function stack mbti ket qua'),
  page('Kết quả Enneagram','/result/enneagram','Kết quả','Xem kết quả Enneagram, wing và bản năng.','result enneagram wing instinct ket qua'),
  page('Giới thiệu MOSAIC','/about','MOSAIC','Mục tiêu, cấu trúc và cách tiếp cận của dự án.','about gioi thieu du an'),
  page('Về nhà phát triển','/about/developer','MOSAIC','Người xây dựng và định hướng của MOSAIC.','developer nha phat trien tac gia'),
  page('Triển lãm nghệ thuật','/about/exhibition','MOSAIC','Khám phá không gian nghệ thuật MOSAIC.','exhibition trien lam nghe thuat'),
  page('Cập nhật tính năng','/about/news','MOSAIC','Những thay đổi và tính năng mới của dự án.','news update features cap nhat tin tuc'),
  page('Đăng nhập','/sign-in','Tài khoản','Đăng nhập để sử dụng các tính năng cá nhân.','login sign in dang nhap'),
  page('Đăng ký','/sign-up','Tài khoản','Tạo tài khoản MOSAIC.','register sign up dang ky'),
  page('Cài đặt tài khoản','/settings','Tài khoản','Tùy chọn tài khoản, thông báo và hiển thị.','settings cai dat tuy chon'),
  page('Tài khoản & bảo mật','/settings#account','Cài đặt','Quản lý email, phương thức và phiên đăng nhập.','security bao mat mat khau email dang nhap'),
  page('Ảnh đại diện & hồ sơ','/settings#profile','Cài đặt','Chỉnh sửa avatar và hồ sơ cá nhân.','hinh anh avatar anh dai dien ho so'),
  page('Cài đặt thông báo','/settings#notifications','Cài đặt','Chọn thông báo bạn bè, bình luận, tương tác và duyệt bài.','notifications thong bao settings cai dat'),
  page('Cài đặt hiển thị','/settings#display','Cài đặt','Cỡ chữ, giảm chuyển động và nền trang trí.','display font co chu motion animation hinh nen'),
  page('Báo lỗi & liên hệ','/support','MOSAIC','Hướng dẫn gửi báo lỗi và góp ý trong forum Meta.','support contact bug bao loi lien he ho tro'),
  page('Quyền riêng tư','/privacy','MOSAIC','Dữ liệu và các lựa chọn quyền riêng tư hiện có.','privacy consent du lieu quyen rieng tu'),
  page('Điều khoản sử dụng','/terms','MOSAIC','Nguyên tắc cơ bản khi tham gia MOSAIC.','terms dieu khoan su dung quy dinh'),
  ...knowledgePages,
];
export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
}
export function findPages(query: string): SearchPage[] {
  const normalized = normalizeSearch(query.slice(0,100));
  if (!normalized) return searchPages.filter(p => ['/test/mbti','/test/cognitive-functions/ai','/test/enneagram','/discussion/new','/discussion/drafts','/discussion/groups','/statistics','/knowledge'].includes(p.href));
  const terms = normalized.split(/\s+/);
  return searchPages.map((item,index) => {
    const title = normalizeSearch(item.label), searchable = normalizeSearch(`${item.label} ${item.category} ${item.description} ${item.keywords}`);
    if (!terms.every(term => searchable.includes(term))) return {item,index,score:-1};
    const words = title.split(' ');
    const score = (title === normalized ? 100 : title.startsWith(normalized) ? 40 : title.includes(normalized) ? 20 : 0) + terms.reduce((sum,term) => sum+(words.includes(term)?12:title.includes(term)?5:1),0);
    return {item,index,score};
  }).filter(r => r.score >= 0).sort((a,b) => b.score-a.score || a.index-b.index).map(r => r.item);
}
