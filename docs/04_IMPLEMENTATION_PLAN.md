# 04 · Kế hoạch triển khai và nghiệm thu Demo v1

**Điểm bắt đầu:** Sau khi chủ dự án duyệt bộ tài liệu. **Nhịp dự kiến:** 7–9 buổi, mỗi buổi 1,5–2 giờ. Thời gian duyệt nội dung, thiết lập tài khoản bên ngoài và chờ gửi email có thể kéo dài lịch.

## 1. Các bước triển khai

| Mốc | Công việc | Đầu ra để kiểm tra trước khi sang mốc tiếp theo |
| --- | --- | --- |
| **M0 · Duyệt thiết kế** | Duyệt tên làm việc `Dead Interval`, giọng kể, seed, palette, phạm vi và điều kiện public. Chọn tác giả/địa chỉ liên hệ công khai cho trang riêng tư. | Có quyết định về tên, nội dung seed và quyền triển khai. Các dữ liệu còn thiếu cho bản public được ghi rõ. |
| **M1 · Khung tĩnh** (1 buổi) | Khởi tạo Astro + TypeScript strict + Tailwind 4. Chốt Node LTS tương thích và lockfile. Tạo BaseLayout, điều hướng, footer, 404, tokens và font. Chuẩn bị `npm run check`, `npm run build`, `npm run preview`. | HTML tĩnh đọc được, responsive về 320 px. Build tái lập bằng lockfile. Đường dẫn và encoding UTF-8 đúng. |
| **M2 · Data và tuyến đọc** (2 buổi) | Tạo Content Collections, schema và xác thực quan hệ. Đưa seed 4 cases, 4 entities, 6 signals từ đặc tả vào file nội dung. Dùng chung các thành phần hiển thị cho trang danh mục và chi tiết. Đưa copy tiếng Anh vào cấu hình nội dung. | Một người có thể chỉnh tóm tắt hoặc thêm hồ sơ hợp lệ và thấy kết quả sau rebuild. Hồ sơ khóa chỉ xuất phần teaser đã duyệt. |
| **M3 · Hình ảnh và trải nghiệm** (2 buổi) | Tạo hero, bố trí dossier, trạng thái mở/khóa, vật chứng HTML và placeholder. Xuất ảnh OG chung và ảnh riêng cho hồ sơ 01. Làm puzzle và sao chép/chia sẻ. | Hoàn thành đường đọc chính trên mobile và desktop. Hai nguồn bằng chứng mở trực tiếp. Dùng được bàn phím và link đọc ghi chú khi JS tắt. |
| **M4 · Waitlist, SEO và preview** (1–2 buổi) | Dùng Buttondown mặc định của newsletter, cấu hình quy tắc consent/quyền riêng tư theo dịch vụ thực tế. Làm canonical, robots, sitemap và OG. Tạo build preview trên host sau khi được phép triển khai lên tài khoản. | Bản preview xem được hoặc kiểm tương đương ở local nếu chưa có tài khoản. Bản dự kiến đưa đi seeding vượt qua luồng email xác nhận và kiểm URL social. |
| **M5 · Kiểm thử và chuẩn bị seeding** (1–2 buổi) | Chạy ma trận bên dưới trên build tĩnh. Thử với người đọc chưa biết lore, chỉnh các chỗ vấp. Soạn bộ đăng gồm một quote card, link tới case và một log. Xác nhận cấu hình production, chuẩn bị phát hành và theo dõi tuần đầu. | Đủ checklist phát hành công khai. Bài đăng phản ánh trải nghiệm đang chạy và quy định kênh. |

Nếu thời gian bị kéo dài, ưu tiên đường dọc **trang chủ → hồ sơ 01 → vật chứng → ghi chú → đăng ký** để kiểm sớm. Sau đó hoàn thành đủ seed và trang còn lại trước khi gọi bản public là Demo v1. Dùng geometry CSS và công cụ soạn raster nhỏ nếu concept chi tiết chưa xong. Command palette, âm thanh và các tuyến kịch bản/video đi theo phân kỳ trong [đặc tả sản phẩm](01_PRODUCT_AND_MARKETING_SPEC.md).

## 2. Ma trận kiểm thử

| Mã | Mục cần xác nhận | Tiêu chí đạt |
| --- | --- | --- |
| **T01** | Build và thêm data | `npm ci`, `npm run check`, `npm run build` và `npm run preview` chạy trên môi trường sạch. Tạo fixture case mới có một signal hợp lệ, mở được đường dẫn, thấy trên danh mục và sitemap nếu indexable. Sửa chỉ tên hoặc tóm tắt case có sẵn, rebuild rồi kiểm landing, trang chi tiết và metadata. |
| **T02** | Data không hợp lệ và nội dung khóa | URL trùng trong collection, `id` trùng, id liên quan sai, asset mất hoặc sealed có body phải làm build lỗi có tên file/trường. Tạm đưa chuỗi thử duy nhất vào dữ liệu nội bộ nằm ngoài loader, kiểm chuỗi không có trong `dist/`. Kiểm sealed có teaser và liên kết tín hiệu. |
| **T03** | Hành trình chính và deeplink | Người mới biết đây là hư cấu, đọc hồ sơ 01 từ trang chủ, mở trực tiếp mỗi vật chứng qua permalink, về lại puzzle và sang hồ sơ 02. Người đọc đi thẳng từ một URL signal biết nó thuộc case nào và có lối vào waitlist. Bản seed có đúng 4 cases, 4 entities và 6 signals, gồm một bonus chỉ biên tập trong đường puzzle. |
| **T04** | Puzzle có thể hoàn thành | Thử trống, ký tự sai, `417`, `419`, một số sai khác và `418`. Hai gợi ý chỉ ra đúng dữ liệu. Dùng Tab, Enter và trình đọc màn hình để nghe lỗi/kết quả. Link bonus hoạt động khi JS tắt và mở được từ URL trực tiếp. Bonus mang nhãn spoiler và bị loại khỏi danh mục/sitemap. |
| **T05** | Form email | Thử email hợp lệ, sai định dạng, email đã đăng ký và luồng không hoàn tất xác nhận. Kiểm thư xác nhận nhận được, danh sách chỉ tăng người đã xác nhận một lần, hủy đăng ký hoạt động. Kiểm form khi JS tắt, điều hướng tới nhà cung cấp khi cần CAPTCHA, và link đăng ký trực tiếp. Khi config bị thiếu ở preview, thấy thông báo tử tế. |
| **T06** | Chia sẻ và SEO | Với từng kiểu trang, kiểm title, description, canonical, ảnh OG trả HTTP 200 cùng alt, HTML đọc được khi JS tắt. Thử Clipboard API thành công và bị chặn, URL/trích dẫn chính xác, X và Reddit mở luồng soạn bài. Sitemap lọc đúng trạng thái. Kiểm preview `noindex`, production chỉ index mục đã chọn, URL sai trả HTTP 404 trên host. |
| **T07** | Trợ năng và trình duyệt | Kiểm chiều rộng 320/390/768/1024/1440 px, zoom 200%, bàn phím, `Skip to content`, focus, reduced motion và đọc với NVDA hoặc VoiceOver. Chạy axe trên landing, hồ sơ, tín hiệu và form. Sửa lỗi critical/serious và rà thủ công mục tiêu WCAG 2.2 AA. Kiểm Chrome/Edge, Firefox, Safari desktop nếu có, thêm iOS Safari hoặc Android Chrome trên thiết bị thật ưu tiên tuyến chính. Ghi rõ nền tảng chưa kiểm. |
| **T08** | Hiệu năng | Mục tiêu lab ở mobile với build production, median 3 lượt Lighthouse trên trang chủ và hồ sơ 01: Performance ≥ 90, LCP ≤ 2,5 s, CLS ≤ 0,10. Ngân sách lần tải đầu ≤ 450 KB truyền qua mạng, JS do site gửi ≤ 30 KB nén. Đo với cấu hình analytics production và ghi cả trường hợp có/không có cache. Sau khi có dữ liệu hiện trường, theo dõi p75 LCP ≤ 2,5 s, CLS ≤ 0,10, INP ≤ 200 ms nếu đủ mẫu. [Web Vitals](https://web.dev/articles/vitals). |
| **T09** | Trải nghiệm người mới | Quan sát 3 người lần đầu vào site. Ít nhất 2 người nói được tiền đề và tìm được hai vật chứng, ghi chú hoặc hồ sơ kế tiếp mà chưa cần tác giả chỉ. Lưu các vị trí vấp để chỉnh cùng đợt. |

Kiểm data bằng bộ trường hợp tối thiểu nhắm vào sai kiểu, quan hệ, hồ sơ khóa và khả năng thêm nội dung. Kiểm UI theo các hành trình trên build static. Đến cuối M5, lưu URL preview, kết quả build, ảnh mobile/desktop và các mục kiểm đã đạt trong ghi chú phát hành.

## 3. Trước và sau phát hành

1. **Preview.** Dùng canonical cấu hình cho origin sẽ phát hành, giữ `noindex` cho preview. Kiểm artwork, copy, `dist/` và link ngoài. Chặn trộn dữ liệu thử với danh sách email thật bằng cấu hình phù hợp. Nếu chưa có danh sách riêng, dùng hộp thư kiểm thử trên flow dự kiến public và loại các bản ghi kiểm thử khỏi số đo.
2. **Production.** Chốt origin/subdomain, rà quota host và email, xác nhận link privacy, cấu hình Buttondown và analytics. Sau deploy, kiểm sitemap, HTTP 404, một lượt đọc trên thiết bị di động và một email xác nhận. Dùng file build đã QA hoặc cùng revision, config và lockfile đã kiểm. Mốc phát hành chỉ đạt khi bản công khai có đầy đủ nội dung và waitlist hoạt động.
3. **Bộ seeding.** Chuẩn bị một permalink hồ sơ, một permalink tín hiệu, một ảnh 1200 × 630 và hai đoạn giới thiệu tiếng Anh theo kênh. Chọn thời điểm đăng theo cộng đồng. Tự kiểm preview card trên X/Reddit và đọc lại nội quy trước khi đăng. Chỉ phát tán khi chủ dự án yêu cầu hoặc tự thực hiện.
4. **Vận hành tuần đầu.** Ghi email xác nhận, lượt xem hồ sơ, lượt vào trang đăng ký, nguồn giới thiệu và phản hồi. Quyết định chỉnh gì bằng dấu hiệu cụ thể. Ví dụ đọc xong hồ sơ nhưng ít mở vật chứng thì chỉnh vị trí link và nhãn. Khi cần hoàn tác, quay về deployment đã kiểm trước đó; dùng lại snapshot dữ liệu và cấu hình tương ứng, sau đó chạy smoke test. [Cloudflare Pages Rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/).

### Điều kiện bàn giao

- Demo v1 thể hiện được chất liệu của cả bốn ý tưởng từ Blueprint, với hai hồ sơ đầy đủ và hai teaser khóa.
- Có thể cập nhật nội dung trong data và rebuild để thấy kết quả trên site mà không sửa component.
- Luồng đọc, giải đố, chia sẻ và waitlist dùng được qua URL trực tiếp. Nội dung mở vẫn đọc được khi tắt JS.
- Artifact là site tĩnh, URL, metadata, accessibility và performance đã kiểm trên phạm vi nêu trên. Kinh phí public ở mức $0 trong hạn mức gói đã chọn.
- Tác giả có quy trình ngắn để mở case, thêm vật chứng và thay ảnh concept bằng keyframe. Tình trạng duyệt, build và triển khai được ghi rõ khi bàn giao.

Đặc tả kèm theo gồm [Sản phẩm và marketing](01_PRODUCT_AND_MARKETING_SPEC.md), [Hệ thống thiết kế](02_DESIGN_SYSTEM.md) và [Kiến trúc và schema](03_ARCHITECTURE_AND_DATA_SCHEMA.md).
