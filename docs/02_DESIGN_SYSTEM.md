# 02 · Hệ thống thiết kế

**Phạm vi:** Demo v1 của Dead Interval · **Tham chiếu màu:** Crimson, Magenta, Violet Twilight

## 1. Hướng mỹ thuật

Hình dung một ca trực trong trạm hạ tầng lúc hoàng hôn. Ánh san hô từ bên ngoài đi qua bê tông, kính chống nhiễu và một dãy tủ sẫm màu. Bên trong, chữ, timestamp và đường kẻ sáng lạnh tạo cảm giác đây là một hệ thống từng vận hành bình thường. Lấy cảm hứng từ dải màu hoàng hôn của GTA VI. Bố cục, hình ảnh, typography và nhận diện do dự án tự thiết kế.

- **Hai nhịp nhìn.** Trang chủ tạo ấn tượng bằng một khung cảnh và một câu. Trang hồ sơ chuyển sang nhịp đọc tĩnh, một cột chữ và vật chứng nằm đúng nơi chúng thay đổi câu chuyện.
- **Nền và chiều sâu.** Nền tím đen chiếm phần lớn diện tích. Các dải sáng đi từ rìa ảnh hoặc ngoài khung, tập trung ở điểm cần nhìn. Mỗi màn hình có một vùng nhấn chính. Chữ dài nằm trên bề mặt sắc độ ổn định.
- **Đồ họa hệ thống.** Canh hàng, mã hồ sơ, tên trường và timestamp mô phỏng kỷ luật của bảng điều khiển hạ tầng. Chỉ hiển thị chỉ số có ý nghĩa trong câu chuyện. Tông lạnh và nhịp chậm tăng cảm giác bất an.

## 2. Bảng màu

Tỷ lệ thị giác cho màn hình đầu của trang chủ ở desktop. Ước lượng theo diện tích cảm nhận sau khi đã hòa lớp sáng và ảnh. Trang đọc có thể tăng tỷ lệ nền tối lên khoảng 95%.

| Vai trò | Token | Mã màu | Tỷ lệ và cách dùng |
| --- | --- | --- | --- |
| Nền chính | `--surface-void` | `#100C18` | 74% cho nền và khoảng trống. |
| Bề mặt nội dung | `--surface-panel` | `#1B1326` | Cùng `raised` chiếm khoảng 16%, dùng cho vật chứng và thẻ. |
| Bề mặt nổi | `--surface-raised` | `#281B35` | Hàng hover, hint mở rộng, bảng nổi. |
| Đỏ san hô | `--accent-coral` | `#FF6577` | Cùng magenta và violet khoảng 7%. CTA chính, dấu hiệu cảnh báo và ánh hắt chủ đạo. |
| Hồng neon | `--accent-magenta` | `#F47AC7` | Ánh cạnh và trạng thái link hover. |
| Tím hoàng hôn | `--accent-violet` | `#A88AF2` | Viền focus, đầu sáng khu vực khóa, điểm chuyển nền. |
| Xanh băng | `--telemetry-ice` | `#A7E7F8` | Khoảng 3% cho timestamp, mã và giá trị cần đối chiếu. |
| Chữ chính | `--text-primary` | `#F6EFF8` | Tiêu đề và đoạn đọc. |
| Chữ phụ | `--text-muted` | `#BDB0C9` | Chú thích, metadata, lời nhắc. |
| Viền điều khiển | `--border-control` | `#826B95` | Biên vùng nhập, đường kẻ có chức năng. |
| Chữ trên CTA | `--text-on-coral` | `#180A14` | Văn bản và icon của nút san hô. |

Tỷ lệ tương phản trên nền đặc đã tính theo độ chói tương đối. `text-primary`/`surface-void` 17,12:1, `text-muted`/`surface-panel` 8,75:1, `telemetry-ice`/`surface-panel` 13,21:1, `text-on-coral`/`accent-coral` 6,76:1, `border-control`/`surface-raised` 3,46:1, `accent-violet`/`surface-raised` 5,84:1. Mục tiêu WCAG 2.2 AA là 4,5:1 cho chữ cỡ thường, 3:1 cho chữ lớn và các dấu hiệu UI cần tương phản. Đo lại trên ảnh, overlay, hover và focus thực tế. [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## 3. Typography, nhịp và bố cục

| Tầng | Font và thông số đề xuất | Cách dùng |
| --- | --- | --- |
| Display | **Barlow Condensed** 600–700, `clamp(3rem, 8vw, 7rem)`, line-height 0,93–1,02 | Hero, tiêu đề hồ sơ. Viết hoa chủ yếu cho tên archive hoặc mã. |
| Tiêu đề nội dung | **Inter** 600–650, 22–36 px, line-height 1,2 | Mục lục, khối vật chứng, tiêu đề tầng hai. |
| Chữ đọc | **Inter** 400–500, 16–18 px, line-height 1,65–1,75 | Đoạn dẫn và dossier. Tối đa 65–72 ký tự trung bình trên một dòng. |
| Dữ liệu | **IBM Plex Mono** 400–500, 13–14 px, line-height 1,5 | Dòng log, số thứ tự, timestamp. Bật `tabular-nums`, cho xuống dòng với giá trị dài. |

Tự host WOFF2 Latin và lưu giấy phép. Ưu tiên tải tập con chữ cơ bản và font tiêu đề nơi cần. Có fallback `system-ui` cho Inter, sans-serif cho display và `ui-monospace` cho log. Đặt `font-display: swap` và kiểm tra dịch chuyển khi đổi font. Gạch chân liên kết trong văn xuôi, nhất là liên kết giữa tín hiệu và hồ sơ.

- **Lưới.** Dùng khoảng cách bội số 4/8, nhịp chính 8, 16, 24, 32, 48, 64 và 96 px. Khung tối đa khoảng 1280 px. Mobile 320–639 px một cột với lề 16–20 px, 640–1023 px tối đa hai cột thẻ, từ 1024 px có lưới 12 cột với gutter 24–32 px. Màn hình đọc đặt thân bài ở khoảng 7 cột và mục lục/vật chứng ở phần còn lại khi phù hợp.
- **Màn hình đầu.** Header có `Cases`, `Entities`, `Signals` và link `Get release notes`. Mobile cho phép tiêu đề hero xuống dòng tự nhiên. CTA `Read the first case` và dấu hiệu hư cấu nhìn thấy ngay hoặc ngay sau một lần cuộn ngắn. Khi vào hồ sơ qua permalink, bỏ hero trang chủ, đi thẳng vào tiêu đề và nội dung liên quan.
- **Khung và lớp.** Panel phẳng với viền 1 px và góc 4–8 px. Viền trái 2 px hỗ trợ phân biệt trạng thái. Tránh bóng mạnh quanh mọi thẻ. Vùng bấm quan trọng ít nhất 44 × 44 px; link trong văn xuôi có khoảng cách dòng dễ chạm.

## 4. Ánh sáng và texture

- **Hero.** Radial gradient tím ở rìa dưới hoặc sau chủ thể, san hô từ một phía, lớp scrim `surface-void` phía sau chữ. Dùng opacity khoảng 0,12–0,30 cho vùng sáng, giảm dần khi đi vào vùng đọc. Gợi ý thứ tự lớp là nền → concept art hoặc geometry CSS → ánh hắt → scrim → chữ.
- **Vật chứng.** Nhãn như `MAINTENANCE JOURNAL` và `SEQUENCE` trên panel tối, số liệu xanh băng, một dấu san hô cho bất thường. Có thể có đường kẻ kỹ thuật mờ hoặc film grain tĩnh khoảng 2–4% nếu thử nghiệm đọc đạt. Timestamp của thế giới hư cấu nằm cạnh nhãn `Archive time` hoặc trong vật chứng có ngữ cảnh.
- **Chân dung.** Crop 4:5, một nguồn sáng cạnh magenta, nguồn bổ trợ xanh băng, giữ khoảng tối và nhận diện gương mặt. Nhân vật chưa có concept dùng bóng dáng hoặc biểu trưng theo loại thực thể. Hồ sơ che tên dùng mặt phẳng tối và biên violet, giữ đoạn teaser đọc được.
- **Chuyển động.** Hover và focus 140–200 ms cho viền, độ mờ hoặc dịch chuyển 2 px. Mở hint nhẹ, giữ vị trí đọc. `prefers-reduced-motion` loại bỏ dịch chuyển và các chuyển động trang trí. Tránh flash, glitch chữ, cuộn cưỡng bức và nền chuyển động liên tục. Audio ở giai đoạn sau chỉ phát sau thao tác có chủ ý và có nút tắt ngay.

## 5. Hình ảnh khi chưa có keyframe hoặc video

| Mục | Demo v1 | Khi có tư liệu được duyệt |
| --- | --- | --- |
| Hero và thẻ hồ sơ | Chọn giữa một ảnh concept do tác giả chuẩn bị và khung hình trừu tượng CSS. Hình đại diện cho không gian cụ thể như ống dẫn, hành lang cách ly hoặc ranh nước. | Thay trong data bằng ảnh được duyệt. Hero có ảnh ngang, thẻ dùng 16:9, có điểm crop cho màn hình nhỏ. |
| Nhân vật/thực thể | Dùng geometry, silhouette hoặc mặt cắt dụng cụ có quan hệ với nhân vật. Concept vẽ riêng có caption `Concept art`. | Dùng chân dung nhất quán, đặt điểm crop quanh mắt hoặc dấu hiệu nhận diện. |
| Vật chứng | Dựng bằng HTML có thể chọn chữ. Kèm một proof card ảnh tĩnh để seeding và OG nếu cần. | Giữ bản text, thay ảnh minh họa hoặc gắn keyframe đúng nơi trong hồ sơ. |
| Social / OG | Ảnh raster JPEG 1200 × 630. Tối thiểu một ảnh fallback theo brand và một ảnh riêng cho hồ sơ 01. Giữ nội dung quan trọng trong vùng trung tâm có lề 80 px. | Ảnh riêng cho case và vật chứng đáng chia sẻ. Dùng copy tránh spoiler, giữ logo/nhãn gọn. |
| Video | Case có logline, excerpt và vật chứng ngay khi mở. Chỉ hiện giao diện video khi có video trong dữ liệu. | Poster tĩnh 16:9, nút phát rõ, caption, transcript và liên kết YouTube. |

Nếu có concept tự render trên workstation, xuất các biến thể ảnh web 640/960/1440 px trước khi công bố bản 4K riêng. Nén AVIF/WebP với fallback JPEG phù hợp. Ràng buộc kích thước khung để hạn chế nhảy layout. Chỉ tải ảnh LCP với ưu tiên cao. Ảnh phía dưới lazy-load. Ảnh truyền đạt bằng chứng cần `alt` mô tả thông tin nhìn thấy. Hình thuần không khí có `alt=""` hoặc là background CSS.

## 6. Trạng thái và chi tiết tương tác

| Thành phần | Mặc định | Khi tương tác hoặc đổi trạng thái |
| --- | --- | --- |
| Thẻ hồ sơ mở | Tên, mã, logline, nhãn `In development`, hình hoặc geometry | Focus viền violet 2 px với offset 2–3 px. Click vào link mở hồ sơ. |
| Thẻ hồ sơ khóa | Nhãn `Sealed`, mô tả riêng và tín hiệu đã công bố | CTA `View public excerpt`. Dùng icon kèm chữ để nhận biết trạng thái. |
| Puzzle | Hai liên kết vật chứng, label câu hỏi, input, `Check sequence`, hai hint và link đọc ghi chú | Empty/invalid có lỗi gắn với trường. Sai: `That sequence is present. Look for the gap.` áp dụng cho số thật sự xuất hiện trong hai log. Các đáp án sai khác dùng `That sequence does not match the gap.` Đúng: `Sequence matched. One note recovered.` |
| Footer/email | Link `Privacy`, mô tả hư cấu, lời hứa nhận tin. Form có label và hướng dẫn rõ | Form dẫn sang màn hình xác nhận của nhà cung cấp. Khi không có cấu hình preview, dùng thông báo chữ và giữ layout đọc. |
| Chia sẻ | Link, nút hoặc trích dẫn ngắn. Chuỗi hiển thị giữ độ tương phản | Báo `Link copied` hoặc `Quote copied` bằng live region. Nếu trình duyệt không cho sao chép, hiển thị chuỗi để chọn. |

Đặt `Skip to content` là liên kết nhận focus đầu tiên trên mọi trang công khai. Liên kết hiện khi có focus và đưa focus tới vùng nội dung chính. Kiểm tra ở 320, 390, 768, 1024 và 1440 px, zoom 200%, bàn phím, chế độ giảm chuyển động và màn hình cảm ứng. Thanh tiêu đề nếu sticky phải chừa chỗ để focus và anchor không bị che. Không dùng màu, âm thanh hoặc hình ảnh làm tín hiệu duy nhất của câu đố. Chuẩn nghiệm thu đầy đủ ở [kế hoạch triển khai](04_IMPLEMENTATION_PLAN.md).
