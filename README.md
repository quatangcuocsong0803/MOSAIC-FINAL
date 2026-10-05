# MOSAIC

<img src="app/icon.png" alt="Biểu tượng con mắt MOSAIC" width="96" />

**Personality in pieces.**

MOSAIC là web app hỗ trợ khám phá bản thân thông qua các bài trắc nghiệm tính cách, thư viện kiến thức, thống kê cộng đồng và không gian thảo luận có kiểm duyệt. Giao diện lấy cảm hứng từ sách cổ, tranh kính màu và mỹ học cổ điển.

- **Web demo:** [mosaic-final-rho.vercel.app](https://mosaic-final-rho.vercel.app/)
- **Source code:** [quatangcuocsong0803/MOSAIC-FINAL](https://github.com/quatangcuocsong0803/MOSAIC-FINAL)

## 1. Mục tiêu

- Cung cấp công cụ tìm hiểu MBTI, Cognitive Functions và Enneagram.
- Kết nối bài test, kiến thức và thảo luận trong cùng một nền tảng.
- Khuyến khích phân biệt bằng chứng, lý thuyết, diễn giải và câu hỏi khi thảo luận.
- Trình bày dữ liệu cộng đồng bằng các biểu đồ có thể tương tác, đồng thời tôn trọng lựa chọn chia sẻ Statistics của người dùng.

Các bài test và nội dung typology phục vụ học hỏi và tự khám phá; không phải công cụ chẩn đoán y khoa hoặc đánh giá lâm sàng.

## 2. Các tính năng đã triển khai

| Nhóm tính năng | Nội dung |
| --- | --- |
| Tests | Bài test Cognitive Functions/MBTI truyền thống, Cognitive Functions AI Adaptive và Enneagram; lưu và xem kết quả. |
| Profile | Ảnh đại diện, thông tin cá nhân, lịch sử kết quả và lựa chọn personality identity để hiển thị. |
| Discover | Khám phá hồ sơ, gửi/chấp nhận lời mời kết bạn và quản lý tương tác. |
| Messages | Nhắn tin trực tiếp giữa người dùng theo quyền truy cập của hệ thống. |
| Knowledge | Thư viện về MBTI, Cognitive Functions, Enneagram và nền tảng lý thuyết. |
| Discussion | System Forums, soạn bài, citation editor, tệp đính kèm và các loại bài Evidence, Theory, Interpretation, Question. |
| Publication workflow | Lưu bản nháp và autosave; gửi duyệt, theo dõi kết quả, chỉnh sửa/gửi lại và thử lại khi quá trình đánh giá chưa hoàn tất. |
| Moderation | Kiểm duyệt bài viết, bình luận và phản hồi; lưu phiên bản và snapshot cho kết quả duyệt bài. Luồng Discussion được tách khỏi luồng AI Adaptive Test. |
| Citation verification | Tra cứu DOI bằng Crossref, kiểm tra URL/metadata, ghi nhận dữ liệu mâu thuẫn và kiểm tra truy cập mạng để hạn chế SSRF. |
| Groups | Tạo nhóm công khai/riêng tư, tham gia nhóm và quản lý thành viên theo vai trò. |
| Statistics | Biểu đồ cột, tròn, đường, cột chồng, biểu đồ kết hợp và bảng; lựa chọn chỉ số, đối chiếu MBTI × Enneagram, thống kê theo thời gian và xuất CSV. |
| Notifications | Thông báo bạn bè, bình luận/phản hồi, tương tác và kết quả duyệt bài; đánh dấu đã đọc và quản lý thông báo. |
| Settings | Quản lý tài khoản qua Clerk, chỉnh sửa hồ sơ/ảnh, danh sách chặn, tùy chọn thông báo, cỡ chữ, giảm chuyển động và nền trang trí. |
| Navigation | Tìm kiếm các trang/chức năng con, dropdown Discussion, footer có liên kết, hiệu ứng chuyển trang và chỉ báo đang tải. |

### Lựa chọn dữ liệu Statistics

Quyền đồng ý chia sẻ Statistics được lưu riêng cho từng kết quả bài test. Phân tích phân bố và đối chiếu sử dụng kết quả được đồng ý chia sẻ và chưa thu hồi. Một số số đếm tổng quan về số người hoặc lượt làm bài được xử lý riêng.

Người dùng có thể thu hồi chia sẻ tại hồ sơ. Việc chọn identity để hiển thị không tự thay đổi quyền chia sẻ Statistics, và đồng ý Statistics không đồng nghĩa công khai toàn bộ hồ sơ hay kết quả cá nhân.

### Kiểm duyệt và citation

Kết quả kiểm duyệt có thể yêu cầu chỉnh sửa hoặc từ chối bài trước khi công khai. Xác minh URL/DOI và đối chiếu metadata giúp kiểm tra thông tin nguồn; không chứng minh rằng mọi nội dung trong nguồn hoặc lập luận của bài viết đều đúng.

## 3. Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Web framework | Next.js 15, App Router |
| Giao diện | React 19, TypeScript, Tailwind CSS, CSS Modules |
| Database | PostgreSQL trên Supabase |
| ORM và migrations | Prisma 5 |
| Đăng nhập và quản lý tài khoản | Clerk |
| Lưu trữ ảnh và tệp | Supabase Storage |
| AI Adaptive Test và moderation | Groq API |
| Metadata nguồn trích dẫn | Crossref API |
| Biểu đồ | SVG và các thành phần React trong dự án |
| Kiểm thử | Vitest |
| Hosting | Vercel |

## 4. Cấu trúc source code

| Đường dẫn | Vai trò |
| --- | --- |
| `app/` | Các trang, layouts, Server Actions và API routes. |
| `src/components/` | Thành phần giao diện cho các tính năng. |
| `src/` | Dữ liệu, tiện ích và logic phía giao diện. |
| `lib/` | Database client, xử lý nghiệp vụ, moderation, citation verification, Statistics và Settings. |
| `prisma/schema.prisma` | Định nghĩa các model database. |
| `prisma/migrations/` | Lịch sử thay đổi database. |
| `public/` | Hình ảnh và tài nguyên tĩnh. |
| `types/` | Các khai báo kiểu bổ sung. |
| `middleware.ts` | Middleware tích hợp Clerk. |

## 5. Chạy dự án trên máy local

### Yêu cầu

- Node.js 22, phiên bản từ 22.12 trở lên, và npm.
- PostgreSQL/Supabase, ứng dụng Clerk và Groq API key.
- Supabase Storage được cấu hình phù hợp: bucket `mosaic-media` cho ảnh đại diện; bucket `discussion-attachments` riêng tư cho tệp Discussion. Migrations PostgreSQL không tự thiết lập các Storage policy.

### Bước 1 — Clone repository

```bash
git clone https://github.com/quatangcuocsong0803/MOSAIC-FINAL.git
cd MOSAIC-FINAL
```

### Bước 2 — Cấu hình môi trường

Tạo file `.env` ở thư mục gốc. Điền giá trị của các dịch vụ bạn sử dụng; khối dưới đây chỉ liệt kê tên biến, chưa có credentials:

```dotenv
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=

GROQ_API_KEY=
ADAPTIVE_TEST_SECRET=
```

| Biến | Mục đích |
| --- | --- |
| `DATABASE_URL` | Kết nối PostgreSQL cho ứng dụng. |
| `DIRECT_URL` | Kết nối PostgreSQL dùng cho các thao tác Prisma yêu cầu kết nối trực tiếp. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable key của ứng dụng Clerk. |
| `CLERK_SECRET_KEY` | Secret key thuộc cùng ứng dụng/instance Clerk. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key phía client, sử dụng với các quyền truy cập Storage được cấu hình. |
| `SUPABASE_SECRET_KEY` | Key phía server cho xử lý tệp Discussion. |
| `GROQ_API_KEY` | Key gọi Groq cho các tính năng AI. |
| `ADAPTIVE_TEST_SECRET` | Secret ngẫu nhiên để ký và xác thực token của AI Adaptive Test. |

Có thể tạo giá trị cho `ADAPTIVE_TEST_SECRET` bằng `openssl rand -hex 32`. Biến `GROQ_MODERATION_MODEL` là tùy chọn để chọn model moderation phù hợp với tài khoản Groq.

Không commit file `.env`, secret key hoặc URL database có mật khẩu. Các biến không có tiền tố `NEXT_PUBLIC_` phải được giữ ở phía server.

### Bước 3 — Cài dependency và áp dụng migrations

Với một database dành cho bản local của bạn, chạy:

```bash
npm ci
npx prisma validate
npx prisma generate
npx prisma migrate deploy
```

Repository chứa schema và migrations, không chứa bản sao dữ liệu người dùng của web demo. Migrations thiết lập cấu trúc database và các dữ liệu hệ thống có trong migration; không tạo toàn bộ dữ liệu cộng đồng của bản demo.

### Bước 4 — Khởi động

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

Để chạy bản production trên máy local, dừng dev server trước rồi chạy:

```bash
npm run build
npm run start
```

## 6. Kiểm tra code

Các lệnh có trong dự án:

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
```

Các lệnh này phục vụ kiểm tra kiểu dữ liệu, quy tắc code, các test hiện có và production build. Chúng không thay thế việc kiểm tra các luồng đăng nhập, database, upload và AI trên môi trường đã deploy.

## 7. Triển khai trên Vercel

1. Import repository vào Vercel, chọn preset **Next.js** và thư mục gốc của repository.
2. Thêm Environment Variables phù hợp với môi trường triển khai. Cấu hình Clerk phải tương ứng với instance và domain sử dụng.
3. Bảo đảm database đã có các migrations cần thiết; Vercel build không tự chạy `prisma migrate deploy` trong cấu hình hiện tại.
4. Giữ build command `npm run build` và output mặc định của Next.js.
5. Deploy và kiểm tra lại đăng nhập, lưu kết quả, Discussion, upload, Statistics và Settings qua link thật.

## 8. Hướng phát triển

Các nội dung sau **chưa triển khai trong phiên bản nộp hiện tại**:

- **OpenAlex:** bổ sung nguồn tra cứu metadata và đối chiếu với bộ xác minh citation hiện có.
- **Reputation / contributor credibility:** xây dựng tiêu chí đánh giá đóng góp và cơ chế hạn chế thao túng điểm; phân biệt mức độ phổ biến với độ đáng tin cậy.

Các hướng cải tiến tiếp theo gồm tối ưu hiệu năng, mở rộng kiểm thử và cải thiện trải nghiệm sử dụng theo phản hồi.
