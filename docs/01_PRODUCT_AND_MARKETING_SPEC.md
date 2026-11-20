# 01 · Đặc tả sản phẩm và marketing

**Trạng thái:** Đề xuất để duyệt Demo v1 · **Tên làm việc:** Dead Interval · **Ngôn ngữ website:** Tiếng Anh (`en`)

## 1. Định vị

Dead Interval là kho hồ sơ hư cấu về những sự cố hạ tầng có dấu hiệu vượt khỏi khả năng giải thích của người vận hành. Khán giả có thể đọc, đối chiếu vật chứng và tự đưa ra cách hiểu ngay từ Demo v1. Sau khi công chiếu, mỗi bộ hồ sơ trở thành nơi đọc kịch bản đã công bố, xem hình chủ đạo, tìm hiểu nhân vật và mở tập phim tương ứng.

- **Lời hứa với khán giả.** “The system stayed healthy. Something inside it went quiet.” CTA chính `Read the first case` đưa thẳng vào hồ sơ có nội dung đầy đủ.
- **Điểm khác biệt.** Dùng dấu hiệu vận hành mà dân hạ tầng nhận ra ngay như lịch bảo trì, độ trễ, tính liên tục của nhật ký và trạng thái giám sát. Từ đó đặt câu hỏi về bản ngã, ký ức và sự im lặng. Mỗi vật chứng phải thêm một quan sát hoặc làm lung lay một giả thuyết.
- **Định vị công khai.** `An interactive archive of fictional infrastructure incidents.` Dòng này xuất hiện trên trang chủ, chân trang và được nhắc kín đáo trên trang hồ sơ mở trực tiếp. Bài đăng cộng đồng ghi rõ đây là dự án hư cấu do tác giả thực hiện. Dùng công ty, hệ thống và nhân vật hư cấu trong lore. Dữ kiện ngoài đời, nếu đưa vào bài hậu trường sau này, cần nguồn sơ cấp và ghi rõ phạm vi suy diễn.
- **Độc giả đầu tiên.** Người thích ARG, analog horror, cyberpunk hoặc sci-fi triết học ở Âu/Mỹ. Nhóm hạ tầng, AI và lập trình là khán giả có thể vừa đọc truyện vừa tranh luận về cách kho lưu trữ diễn giải bằng chứng.

Demo tập trung vào website công khai và được lên nhịp để một tác giả có thể vận hành trong quỹ thời gian 1,5–2 giờ mỗi tối. Nguồn sáng tác là mục 4 của [Blueprint dự án](../cosmic_horror_cyber_dystopia_ai_movie_blueprint.md).

## 2. Hành trình và điểm chuyển đổi

| Hành trình | Luồng | Tiêu chí trải nghiệm |
| --- | --- | --- |
| Người xem từ Reddit/X | Mở thẳng hồ sơ hoặc tín hiệu → đọc ngay một vật chứng → thấy ngữ cảnh và hồ sơ liên quan → sao chép liên kết hoặc theo dõi | Trang đích tự đứng được khi mở riêng. Trên màn hình đầu tiên có tên hồ sơ, dấu hiệu hư cấu và nội dung hoặc đường dẫn rõ ràng tới vật chứng. |
| Người mới từ tìm kiếm | Trang chủ hoặc hồ sơ mở → đọc đoạn tóm lược → xem vật chứng và nhân vật → sang hồ sơ thứ hai | Một lượt đọc ngắn khoảng 2–3 phút cho hồ sơ đầu. Mỗi trang đề xuất tối đa hai bước kế tiếp có liên quan trực tiếp. |
| Người thích giải đố | Đọc `The First Quiet` → đối chiếu hai nhật ký → thử giải ở `Compare the logs` → xem thông báo bổ sung → quay lại hồ sơ | Một câu đố có lời giải trong chính website, dễ dùng trên điện thoại, tối đa hai gợi ý. Có `Show the recovered note` để đọc tiếp bất cứ lúc nào. |
| Người theo dõi sớm | Nhận được giá trị từ hồ sơ hoặc teaser → chọn `Get release notes` → nhập email → xác nhận trong email → nhận thông báo khi có hồ sơ/tập mới | Một trường email. Thông báo xác nhận dùng ngôn ngữ ngoài vai, dễ hiểu. Đo thông tin đăng ký sau xác nhận. |
| Người đi từ YouTube về sau | Link tập phim → hồ sơ có cùng URL với lúc demo → mở kịch bản, keyframe hoặc hồ sơ thực thể → theo dõi kênh/Patreon | CTA theo tình trạng xuất bản thật. Kịch bản và transcript công bố được đọc ngay trong trang. |

## 3. Sitemap và tính năng Demo v1

| URL | Nội dung và hành động chính | Lập chỉ mục production |
| --- | --- | --- |
| `/` | Một hero, lời hứa rõ, vật chứng trích ngắn, hồ sơ nổi bật, lối vào hai hồ sơ khóa và một CTA nhận tin sau nội dung. Trích dẫn lấy từ dữ liệu. | Có |
| `/cases/` | Bốn hồ sơ có nhãn `In development` hoặc `Sealed`. Hiển thị theo thứ tự biên tập. Thẻ có mô tả và liên kết tới hồ sơ. | Có |
| `/cases/[slug]/` | Hai hồ sơ mở có bài đọc, vật chứng, thực thể và câu hỏi. Hai hồ sơ khóa có teaser viết riêng và các tín hiệu đã phát hành. Phân biệt `In development` với `Sealed` bằng nhãn chữ. | Hồ sơ mở có. Hồ sơ khóa `noindex` cho đến khi mở. |
| `/entities/`, `/entities/[slug]/` | Danh mục và hồ sơ nhân vật/thực thể được phép công bố. Các hồ sơ khóa hiển thị danh tính che tên và một mẩu quan sát. | Danh mục và hồ sơ mở có. Hồ sơ che tên `noindex`. |
| `/signals/`, `/signals/[slug]/` | Dòng tín hiệu công khai và permalink riêng cho từng vật chứng. Mỗi trang dẫn ngược về hồ sơ tương ứng. Phần thưởng câu đố có permalink có thể mở thẳng và được gắn nhãn `Contains puzzle spoilers`. | Danh mục có. Trang lẻ lấy `seo.indexable` từ dữ liệu. Demo chỉ lập chỉ mục hai vật chứng chính của hồ sơ 01. |
| `/subscribe/` | Lời hứa về email, form và liên kết tới trang đăng ký của nhà cung cấp. | `noindex` |
| `/privacy/`, trang 404 | Chính sách dữ liệu ghi theo cấu hình thực tế. 404 có lối về danh mục và hồ sơ nổi bật. Kiểm tra HTTP 404 thực tế trên host. | Chính sách có. 404 `noindex`. |

Các mục tùy chọn như kịch bản, bộ ảnh, video và liên kết kênh chỉ xuất hiện khi dữ liệu công bố tương ứng đã sẵn sàng. Trang chi tiết giữ cùng nội dung chính khi mở trực tiếp, tải lại hoặc đi từ danh mục.

### Trải nghiệm chủ đạo · Compare the logs

Trong `The First Quiet`, một nhật ký ghi ca bảo trì kết thúc, một nhật ký khác có số thứ tự bị khuyết. Người đọc trả lời bằng số của bản ghi bị thiếu. Hai gợi ý lần lượt chỉ tới trường `Sequence` và hai giá trị kẹp khoảng trống. Kết quả là một ghi chú của kỹ sư làm thay đổi cách đọc báo cáo. Sai thì thử lại ngay. Dùng được với bàn phím, trình đọc màn hình và màn hình nhỏ. Link `Show the recovered note` hoạt động khi tắt JavaScript. Khi làm đúng, hiển thị liên kết `Read the recovered note` và thông báo kết quả bằng vùng thông báo trợ năng. Đặc tả câu hỏi, đáp án và các URL nằm trong [kiến trúc và schema](03_ARCHITECTURE_AND_DATA_SCHEMA.md).

### Chia sẻ và waitlist

- **Chia sẻ.** Hồ sơ mở, teaser và tín hiệu thường có `Copy link`. Vật chứng được tuyển chọn có thêm `Copy quote`, `Share on X` hoặc `Share on Reddit` để người đọc tự soạn và quyết định đăng. URL canonical được gắn trong trích dẫn, ảnh chia sẻ ưu tiên vật chứng hoặc concept art. Phần thưởng giải đố chỉ có permalink để tránh lộ lời giải qua nút chia sẻ hoặc ảnh OG. Nếu Clipboard API lỗi, hiện URL/trích dẫn để người dùng tự chọn và sao chép.
- **Email.** Form HTML của Buttondown hoặc trang đăng ký mặc định của cùng danh sách. Copy đề xuất `Get new case files and premiere announcements. Unsubscribe anytime.` Nhà cung cấp xử lý xác nhận hai bước, chống gửi trùng và hủy đăng ký. Nếu thiếu cấu hình, bản preview dùng thông báo `Subscriptions are unavailable in this preview.` Bản đưa đi seeding phải có luồng xác nhận hoạt động. Gói khởi động hiện miễn phí cho 100 người đăng ký đầu, cần kiểm tra lại trước khi cấu hình production. [Buttondown Pricing](https://buttondown.com/pricing), [HTML subscribe](https://docs.buttondown.com/building-your-subscriber-base), [Double opt-in](https://docs.buttondown.com/double-opt-in).
- **Nhịp gửi.** Email xác nhận hướng người dùng về hồ sơ đầu qua link trên màn hình thành công nếu cấu hình được. Sau đó gửi bản tin khi có một phát hiện mới, mở hồ sơ hoặc công chiếu. Giữ lời hứa về nội dung và để ngày công chiếu trống đến khi chốt.

## 4. Chiến lược seeding

| Kênh | Điểm vào và nội dung đăng | Điều kiện sử dụng |
| --- | --- | --- |
| `r/ARG` | Mở bằng hai dòng nhật ký và một câu hỏi. Trỏ tới `The First Quiet`, để người chơi tự lần theo số thứ tự. | Đọc quy định hiện hành, dùng đúng flair và nơi cộng đồng cho phép chia sẻ dự án. |
| `r/analoghorror` | Một ảnh proof card về ca trực và cách dùng khoảng im trong tư liệu. Cho người đọc xem một vật chứng ngay trong bài. | Kiểm tra bài tĩnh và hình thức đăng được chấp nhận. Hỏi mod qua modmail khi quy định chưa rõ. |
| `r/cyberpunk` | Concept art của trạm sinh học hoặc buồng quan sát, kèm chuyện bảo trì và chi phí của việc đo mọi thứ bằng uptime. | Chủ đề, hình ảnh và nội dung tự giới thiệu phải phù hợp quy định tại thời điểm đăng. |
| `r/singularity` | Thảo luận câu hỏi đo lường trong `The Last Turn`, ví dụ giá trị dữ liệu khi một hệ thống dừng trả lời. | Ghi rõ tiền đề hư cấu và ưu tiên thảo luận. Chỉ thêm link nếu được phép. |
| X | Một quote card và đường dẫn đến tín hiệu, tiếp theo bằng một bài giải thích cách dựng vật chứng. | Mỗi bài đọc độc lập và dùng OG đúng trang đích. |
| Hacker News | `Show HN` khi demo đọc và chơi được. Kể về cách một kỹ sư tự xây kho hồ sơ tĩnh, với case và puzzle vào thẳng được. | Tác giả có mặt để thảo luận. Chỉ đăng khi trải nghiệm thật sự đủ dùng và tạo được trao đổi kỹ thuật. [Show HN Guidelines](https://news.ycombinator.com/showhn.html). |

Vòng seeding đầu ưu tiên một cộng đồng phù hợp nhất và X. Thu nhận câu hỏi người đọc thật sự đặt ra, chỉnh hook hoặc chỉ dẫn giải đố, rồi mở sang kênh kế tiếp theo quy định tại thời điểm đăng. Các nền tảng và cộng đồng có quy định riêng về tự quảng bá. [Reddit Help về spam](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam), [Hướng dẫn tìm cộng đồng của Reddit](https://www.business.reddit.com/learning-hub/articles/find-subreddits-for-your-business).

### Đo lường và SEO

- **Chỉ số chính.** Số email xác nhận mới theo tuần. Nếu đủ dữ liệu, lấy số email xác nhận chia số lượt truy cập ghi nhận cùng kỳ để theo dõi xu hướng tổng hợp. Đây là tỷ lệ xấp xỉ, do analytics có thể bị chặn và lượt xác nhận có độ trễ.
- **Chỉ số dẫn đường.** Lượt xem hồ sơ mở, lượt xem hai vật chứng, lượt vào `/subscribe/`, tên miền giới thiệu và phản hồi có nội dung từ cộng đồng. Dùng Cloudflare Web Analytics cho lượt xem và nguồn giới thiệu tổng hợp. Công cụ này hiện chưa theo dõi UTM hoặc custom event, nên Demo v1 chưa thể báo cáo tỷ lệ giải đố, lượt bấm chia sẻ hay chuyển đổi theo từng kênh. Ghi ngày, URL đích và phản hồi từng đợt trong bảng vận hành của tác giả. [Cloudflare Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/).
- **SEO nội dung.** Trang tiếng Anh có tiêu đề riêng, đoạn mô tả tự nhiên, nội dung đọc được ở HTML ban đầu, liên kết nội bộ theo thực thể và vật chứng, canonical ổn định, sitemap lọc theo bảng trên. Từ khóa mục tiêu gắn với nội dung thực tế như `cyberpunk horror stories`, `cosmic horror interactive fiction` và `AI consciousness horror`. OG teaser trung tính cho hồ sơ khóa. Sau publish, kiểm tra canonical/sitemap trong Search Console và lập đường chuẩn qua hai đợt seeding đầu. [Google Search Central về canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [về sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

## 5. Phân kỳ

| Giai đoạn | Nội dung ưu tiên | Điều kiện chuyển giai đoạn |
| --- | --- | --- |
| **Demo v1** | 4 cases, 4 entities, 6 signals, 1 câu đố, 1 funnel email, chia sẻ permalink/trích dẫn, SEO tĩnh. | Hai hồ sơ mở đủ cuốn hút khi đọc độc lập, email xác nhận được và nghiệm thu theo kế hoạch triển khai. |
| **Sau seeding** | Mini command palette `Ctrl/⌘+K` và nút `Search archive`, tìm theo tên, định danh và chủ đề đã công khai. Dark ambient tùy chọn, nút `Play ambience`/`Mute`, ghi nhớ tùy chọn nếu trình duyệt cho phép. | Ưu tiên search khi điều hướng bằng danh mục bắt đầu khó. Thêm audio khi có track có quyền sử dụng, tệp nhẹ, và xác minh phát sau thao tác chủ động. |
| **Phát hành tập** | Mở hồ sơ theo lịch biên tập, kịch bản hoặc trích đoạn, thư viện keyframe, YouTube embed và liên kết Patreon khi kênh sẵn sàng. Có thể tạo watch page riêng khi video trở thành nội dung chính. | Có video, poster, transcript và tư liệu đã duyệt. Giữ permalink hồ sơ dùng từ Demo. |
| **Mở rộng Lore Hub** | Các vệt truyện xuyên hồ sơ, bộ lọc thực thể và puzzle nhiều bước. Rà dữ liệu điểm rơi trước khi đổi kiến trúc. | Có thêm nội dung đủ khác biệt và người đọc cho thấy nhu cầu tra cứu. |
