# Dead Interval

Kho hồ sơ hư cấu bằng tiếng Anh, xuất tĩnh từ Astro.

## Chạy local

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Dùng Node.js 24 LTS. Bản build nằm trong `dist/`. Giữ `PUBLIC_ARCHIVE_PUBLIC=false` cho preview.

## Cập nhật nội dung

- Hồ sơ, thực thể và vật chứng nằm trong `src/content/cases`, `src/content/entities` và `src/content/signals`. Mỗi mục là một tệp Markdown có frontmatter. Giữ nguyên `id` và `slug` của trang đã chia sẻ.
- Thêm hồ sơ bằng một tệp Markdown và ít nhất một tín hiệu `standard` có `caseId` tương ứng. Đổi trạng thái hồ sơ khóa sang `in-development`, bỏ `embargoMessage`, rồi bổ sung đoạn đọc, `closingQuestion` và lựa chọn lập chỉ mục. Không đưa bản thảo chưa duyệt vào thư mục dữ liệu.
- Đặt ảnh web đã nén trong `public/art/`. Có thể khai báo `variants` theo chiều rộng trong dữ liệu ảnh. Ảnh social JPEG nằm trong `public/og/`.
- Khi có tập phát hành, điền `release` với ID YouTube và poster. Thêm script đã duyệt vào `src/content/scripts/` và trỏ `scriptId` về bản tương ứng. Chạy lại kiểm tra và build.

Concept art Bay Six được tạo bằng công cụ ImageGen với đề bài một buồng wetware dưới lòng đất, ống tưới tuần hoàn, bê tông tối, ánh hắt đỏ san hô và LED tím lạnh. Các ảnh web và ảnh OG được xuất từ cùng hình concept.

## Cloudflare Pages

Build command `npm run build`, output `dist`, đặt phiên bản Node 24. Bản public cần ba giá trị trong `.env.example` ngoài cờ `PUBLIC_ARCHIVE_PUBLIC=true`: origin HTTPS chính thức, tên newsletter Buttondown và email liên hệ riêng tư. Preview phải giữ cờ ở `false`. Đặt ngày phát hành thực cho tín hiệu trước khi mở production.

Buttondown nhận POST và xử lý xác nhận email. Dùng hộp thư kiểm thử để kiểm đăng ký, chống trùng và hủy đăng ký trước khi seeding. Kế hoạch và ma trận nghiệm thu ở [docs/04_IMPLEMENTATION_PLAN.md](docs/04_IMPLEMENTATION_PLAN.md).

