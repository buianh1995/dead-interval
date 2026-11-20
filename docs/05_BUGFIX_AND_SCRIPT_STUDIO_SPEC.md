# 05 · Sửa lỗi giao diện và thiết kế Script Studio

**Trạng thái — Chờ duyệt trước khi triển khai.** Phần công khai tiếp tục xuất tĩnh. Studio là công cụ soạn nội dung chạy cục bộ, với giao diện tác giả bằng tiếng Việt và bản xem trước tiếng Anh theo website hiện tại. Tài liệu này bổ sung các quyết định cho đợt nâng cấp so với [đặc tả sản phẩm](01_PRODUCT_AND_MARKETING_SPEC.md), [kiến trúc Demo v1](03_ARCHITECTURE_AND_DATA_SCHEMA.md) và [kế hoạch Demo v1](04_IMPLEMENTATION_PLAN.md).

## 1. Hiện trạng đã kiểm tra

Đã đọc cấu hình, mã nguồn ứng dụng, toàn bộ 14 tệp Markdown đang được nạp, tài liệu và tài nguyên dùng bởi từng nhóm trang. `npm run check` báo 0 lỗi. Build kiểm toán xuất 21 trang HTML vào `.astro/audit-studio`, có cảnh báo vì collection kịch bản đang trống. Các lỗi dưới đây có thể tái hiện từ tệp nguồn và HTML đã sinh. Trong thư mục làm việc hiện tại, Git chưa được khởi tạo.

| Phần | Hiện trạng và ảnh hưởng tới Studio |
| --- | --- |
| Stack | Astro 7.3.6, TypeScript strict, Tailwind 4 và Sätteri. `astro.config.mjs` đặt `output: 'static'`, `trailingSlash: 'always'` và quy tắc Markdown loại HTML thô, kiểm giao thức liên kết. |
| Kho nội dung | 4 Cases, 4 Entities, 6 Signals tại `src/content/`. Mỗi tệp dùng frontmatter cho metadata và Markdown cho thân bài. `src/content/scripts/` chỉ có `.gitkeep`. |
| Kiểm dữ liệu | `src/content.config.ts` dùng Zod strict và phân nhánh theo trạng thái. `src/lib/archive.ts` kiểm ID, slug, quan hệ, tài nguyên ảnh, nội dung khóa và chỉ mục. Markdown đúng cú pháp vẫn có thể trộn văn bản của hai hồ sơ. |
| Đi từ data đến trang | Các route động lấy record qua `getStaticPaths()`, dùng `render(entry)` của Astro để dựng Markdown, rồi render bằng `Base.astro` và CSS chung. Quan hệ Case–Entity lấy từ `Case.entityIds`, Case–Signal lấy từ `signalIds` và `Signal.caseId`. |
| Kịch bản công khai | Schema hiện có `id`, `caseId`, `title`, `kind` và thân Markdown. Case phải ở `released` và trỏ `scriptId` tới kịch bản thì renderer mới đưa vào trang. Hiện chưa có Case `released` và chưa có kịch bản công khai. |
| Xuất và cấu hình | `npm run build` sinh `dist/` theo mặc định. `npm run preview` phục vụ artifact tĩnh. `PUBLIC_ARCHIVE_PUBLIC` chi phối yêu cầu cấu hình phát hành và robots. Buttondown đang được cấu hình tập trung qua `src/lib/publishing.ts`. |

## 2. Lỗi giao diện và xử lý đề xuất

| Lỗi | Bằng chứng và nguyên nhân | Cách xử lý và tiêu chí đạt |
| --- | --- | --- |
| **Mara Voss bị nối đoạn Pair Nine** | [Mara Voss](../src/content/entities/mara-voss.md) chứa nguyên văn đoạn thân bài [Pair Nine](../src/content/entities/pair-nine.md) ngay sau đoạn Mara. Cả hai route đang render đúng file được chọn. Đặc tả seed tách hai đoạn thành hai mục riêng. | Bỏ đúng đoạn trùng trong tệp Mara, giữ phần kết `Someone has underlined the word *present* twice.` và hai quan sát của Mara. Kiểm cả frontmatter lẫn HTML của cả hai trang để đảm bảo đoạn `Pair Nine is the archive designation…` chỉ còn trong hồ sơ Pair Nine. |
| **Mô tả chung lặp ở đầu trang chi tiết** | [Case detail](../src/pages/cases/%5Bslug%5D.astro) và [Entity detail](../src/pages/entities/%5Bslug%5D.astro) chèn `site.description` sau `summary`. [Base](../src/layouts/Base.astro) đã in câu này ở footer. Có một bản lặp trong `main` ở cả 8 trang chi tiết. | Bỏ `<p class="fiction">` tại Case và Entity, giữ `summary` riêng, footer và metadata như hiện tại. Signals cũng dùng lớp `.fiction`; phạm vi gỡ lần này là Case và Entity theo yêu cầu. |
| **SEALED thiếu đăng ký trong thân trang** | Nhánh SEALED hiện chỉ dựng `embargoMessage`. CTA ở sidebar và header dẫn đến `/subscribe/`. Hai trang SEALED đều chưa có form. | Tạo `SubscribeForm.astro` dùng lại ở `/subscribe/` và panel `Clearance notifications` ngay sau teaser, trước khối chia sẻ. Chỉ nhánh `sealed` có panel này. Ở SEALED, CTA sidebar trỏ về `#clearance` để người cuộn dài quay lại form. |
| **Dấu `|` thừa cuối Signal** | Cả 6 tệp Signal kết thúc bằng ` |`. Dấu phân cột từ bảng seed đã đi vào Markdown công khai. Dấu này xuất hiện trong đoạn cuối của trang vật chứng. | Bỏ đúng hậu tố thừa ở 6 đoạn cuối. Giữ nguyên dữ kiện và định dạng các dòng log, nhất là `417`, `419` và phần thưởng `418`. |

Đối chiếu 4 Case và 4 Entity cho thấy một đoạn dài bị lặp nguyên văn giữa hai hồ sơ nêu trên. Hai Case mở theo đúng mạch `The First Quiet` và `The Last Turn`; hai Case SEALED cùng hai Entity redacted có thân bài rỗng đúng chủ đích. Việc nhắc Pair Nine trong Case 02 và Signal 04 là tham chiếu có chủ đích. Nghiệm thu bổ sung đối chiếu mô tả, quan sát, quan hệ, SEO theo bảng seed. Có thể cảnh báo khi hai hồ sơ khác nhau chứa đoạn dài trùng nguyên văn và để tác giả xác nhận trích dẫn có chủ ý.

### Panel đăng ký giải mật

| Trạng thái | Hành vi |
| --- | --- |
| Có cấu hình Buttondown | Tiêu đề `Get notified when this case is declassified`. Copy `Get release notes and declassification announcements. Unsubscribe anytime.` Một trường `Email address`, nút `Get clearance alerts`, lời nhắc xác nhận email và link `Privacy`. Dùng cùng danh sách hiện tại; copy nói rõ nhận bản tin chung cùng thông báo giải mật, chưa hứa đích danh email riêng cho từng Case. |
| Preview thiếu cấu hình | Panel vẫn hiển thị đúng vị trí. Dùng `Subscriptions are unavailable in this preview.` Khi xem trong Studio, form minh họa bị vô hiệu và không gửi dữ liệu ra ngoài. |
| Case đã mở | Giữ luồng nhận tin qua liên kết hiện có. Case đã mở không có panel giải mật. |

Form dùng POST HTML tới endpoint Buttondown đã có, có liên kết sang trang đăng ký do Buttondown lưu trữ. Dùng ID trường lấy từ ngữ cảnh để tránh trùng ID. Email đi thẳng tới nhà cung cấp, hỗ trợ trình duyệt tắt JS và luồng xác nhận hai bước theo cấu hình newsletter. Đăng ký chỉ đăng ký nhận tin; trạng thái SEALED đổi qua biên tập dữ liệu. [Tài liệu form HTML của Buttondown](https://docs.buttondown.com/building-your-subscriber-base).

## 3. Studio v1 chạy local

### Luồng tác giả

1. Chạy `npm run studio`, mở `http://127.0.0.1:4322/studio/`. Chọn **Hồ sơ**, **Thực thể** hoặc **Kịch bản**. Với Hồ sơ/Thực thể, v1 chỉnh mục đã có. Với Kịch bản, v1 cho tạo bản nháp mới từ một Case có sẵn, kể cả Case SEALED.
2. Form hiển thị các trường đúng trạng thái. Hồ sơ mở có tóm tắt, Markdown và câu hỏi kết; hồ sơ SEALED có teaser và thông báo khóa. Entity mở có Markdown, định danh và quan sát; Entity redacted có đoạn quan sát công khai. Tên, mô tả, liên kết thực thể/tín hiệu và SEO có nhóm trường tương ứng. `id`, `slug` và mã hồ sơ hiện hữu được khóa trong UI để giữ định danh và URL. Art, câu đố và cấu hình YouTube hiện hữu được đọc và giữ nguyên khi lưu; quản lý tài nguyên và đổi trạng thái phát hành như `released` vẫn qua biên tập nguồn ở v1.
3. Bên phải hiển thị **Xem trước trang công khai** theo nội dung đang nhập. Có chiều rộng máy tính/điện thoại. Khi viết bản đầy đủ cho Case SEALED hoặc Entity redacted, chọn **Xem trước bản đầy đủ (chỉ local)**. Nhãn này đặt ngoài khung xem, phân biệt rõ với những gì xuất ra web.
4. **Lưu bản nháp** ghi JSON local để mở lại. **Ghi vào kho công khai** ghi trực tiếp trường đã duyệt vào tệp Markdown nguồn. Với kịch bản, tác giả chuẩn bị đoạn văn công khai ở một trường riêng, xem đúng đoạn này rồi bấm **Ghi trích đoạn công khai**. Mỗi lần ghi công khai hiển thị đường dẫn đích và phần nội dung thay đổi trước khi xác nhận ngay trong Studio. Phát hành ra Cloudflare vẫn theo quy trình build/deploy hiện có.
5. Thanh trạng thái hiển thị `Chưa lưu`, `Đang lưu`, `Đã lưu`, `Lỗi khi lưu` hoặc `Tệp đã thay đổi`. Chuyển mục hoặc rời trang khi có thay đổi chưa lưu phải có nhắc. Sau khi ghi, tác giả mở permalink public trên dev để đối chiếu HTML đọc từ file thật. Không tự ghi bản công khai khi đang gõ hoặc xem trước.

### Cách bật route và cấu trúc đề xuất

Thêm một integration Astro mỏng. Hook `astro:config:setup` chỉ đăng ký các route động khi `command === 'dev'` và wrapper `npm run studio` bật `DEAD_INTERVAL_STUDIO=1`. Route dùng `injectRoute` với `prerender: false`, entrypoint nằm ngoài `src/pages`. Wrapper ép `127.0.0.1:4322`, cổng cố định và từ chối khởi động nếu cổng bận hoặc cấu hình cho phép bind ra ngoài. Chạy thử một route tối thiểu trên đúng Astro 7.3.6 ở bước đầu để xác nhận cách inject trong dev mà build tĩnh vẫn chạy không cần adapter. [Astro Integration API](https://docs.astro.build/en/reference/integrations-reference/).

```text
src/
  components/archive/        # CaseDossier, EntityProfile, PublicScript, SubscribeForm
  lib/content/               # Schema và kiểm quan hệ chia sẻ giữa build và Studio
  pages/                     # Route công khai tĩnh như hiện tại
  studio/
    routes/                  # UI, API và khung preview được inject riêng khi dev
    server/                  # Phiên local, render nháp, đọc/ghi file
    client/                  # Editor và giao tiếp preview
scripts/studio-dev.mjs       # Wrapper ép cấu hình local
.studio/drafts/              # JSON nội bộ trong cây dự án, thêm vào .gitignore
```

| Route dự kiến | Vai trò |
| --- | --- |
| `GET /studio/` | Mở editor và khởi tạo phiên local. Giao diện Astro và TypeScript trình duyệt, dùng form chuẩn và textarea Markdown. |
| `GET /studio/api/records/` và `GET /studio/api/records/[collection]/[id]/` | Danh sách, metadata/thân bài, thông tin revision, bản nháp tương ứng. Chỉ trả dữ liệu cần cho editor. |
| `POST /studio/api/preview/` | Xác thực snapshot đang soạn, cấp ID preview ngẫu nhiên, gắn phiên local và lưu snapshot đã xác thực trong RAM có hạn dùng. |
| `GET /studio/preview/[id]/` | Dựng trang Astro từ snapshot trong RAM. ID lạ, hết hạn hoặc sai phiên trả 404. |
| `POST /studio/api/save/` | Nhận intent cụ thể `saveDraft`, `applyRecord` hoặc `publishExcerpt`, revision tương ứng và dữ liệu có kiểu. Server tự xác định file đích. |

### Live Preview có cùng giao diện với web thật

- Tách markup của trang Case và Entity ra các component dùng chung. Public route vẫn dùng `getStaticPaths()` và `render(entry)`. Studio đưa dữ liệu đã validate vào cùng component và dùng phần layout/CSS/font hiện có. Slot nội dung công khai và slot preview nhận Markdown đã render. Preview dùng cùng cấu hình Sätteri và quy tắc HTML/URL, tạo runtime renderer qua `createRenderer()` với cấu hình chung. Kiểm bằng test đối chiếu heading, paragraph, list, code và link; đánh dấu tương đương ở cấp DOM, bỏ qua khác biệt do wrapper preview. [Sätteri API](https://docs.astro.build/en/reference/markdown-processors/satteri/).
- Sau khoảng 300 ms dừng gõ, editor gửi snapshot của mục đang mở. Bỏ qua phản hồi cũ theo số thứ tự request và ID record để tránh màn hình nhảy khi gõ nhanh hoặc chuyển mục. Chỉ đổi iframe khi có snapshot hợp lệ, giữ bản hợp lệ gần nhất và báo lỗi cạnh trường đang nhập. Yêu cầu hợp lệ về kiểu nhưng thiếu dữ liệu bắt buộc có thể đưa vào chế độ xem nháp có thông báo; lỗi chặn phát hành vẫn hiện trong validator. Mục tiêu v1 là phản hồi trong một giây kể từ khi ngừng gõ với hồ sơ hiện tại trên máy local khi server đã khởi động.
- Preview dùng iframe với `sandbox="allow-same-origin"`, không cấp quyền chạy script, submit form, mở cửa sổ hoặc điều hướng trang cha. Response preview cũng có CSP HTTP tương ứng, giới hạn CSS/font/ảnh local, chặn script/kết nối/iframe ngoài và `form-action 'none'`. Quyền same-origin phục vụ tài nguyên nội bộ và kiểm giao diện; phần preview bỏ href điều hướng và điểm gọi ngoại vi, hiện đúng bố cục của các nút dưới dạng minh họa. Dùng permalink dev thật để thử puzzle, chia sẻ, video hoặc đường dẫn. [Tiêu chuẩn HTML về sandbox](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox).
- Snapshot chưa lưu không xuất hiện trong URL, collection hoặc file nguồn. Chỉ lưu ID không mang nội dung trong URL preview. Giữ số snapshot nhỏ cho mỗi phiên và tự hết hạn. Để chịu được reload do Astro theo dõi file, giữ bản đệm đang gõ theo tab trong `sessionStorage` ở origin Studio, cùng ID và revision. Khôi phục khi cùng tab reload, xóa khi lưu thành công hoặc tác giả chọn bỏ thay đổi. Nếu revision đã đổi ngoài editor, hiện bản đệm cùng trạng thái xung đột. Tệp nháp đã lưu trên đĩa vẫn là nguồn khôi phục khi đóng tab.

## 4. Ghi file và ranh giới xuất bản

| Thao tác | Nơi ghi | Kết quả |
| --- | --- | --- |
| Lưu bản nháp hồ sơ/thực thể/kịch bản | `.studio/drafts/<collection>/<id>.json` | Duy trì nội dung làm việc trong cây dự án qua các lần mở Studio. Thư mục nằm ngoài Content Collections và được ignore. |
| Ghi hồ sơ/thực thể công khai | Tệp `.md` đang có trong `src/content/cases/` hoặc `src/content/entities/` | Gộp trường được phép chỉnh sửa vào metadata gốc, giữ trường ngoài form, validate và cập nhật đúng một tệp UTF-8. Case SEALED và Entity redacted chỉ ghi trường công khai của trạng thái tương ứng. |
| Ghi trích đoạn công khai | Một tệp `.md` trong `src/content/scripts/`, xác định tên bằng ID của Case hoặc sử dụng file đã liên kết | Chỉ dùng trường công khai đã duyệt. Case phải là `released` để ghi. Kịch bản đầy đủ, phân cảnh và ghi chú nội bộ vẫn nằm ở bản nháp. |

**Quy trình ghi một tệp.** Server đọc dữ liệu gốc từ đĩa và trả revision là hash của bytes. Khi lưu, khóa theo đích trong tiến trình Studio, đối chiếu revision và kiểm khác biệt nếu có. File có thay đổi ngoài editor trả `409 Conflict` và giữ nội dung đang gõ. Khi áp dụng ra nguồn công khai, validate toàn bộ record và các quan hệ bị ảnh hưởng bằng cùng quy tắc đang áp dụng lúc build. Không ghi đè mù dựa trên snapshot cũ do Astro cache. Dùng bộ đọc/ghi frontmatter chuẩn, hỗ trợ UTF-8, xuống dòng và kiểu ngày/chuỗi theo schema. Bản ghi lỗi cú pháp hoặc schema có thông báo tên file và trường lỗi.

Để giảm nguy cơ file bị ghi dở, tạo file tạm tên riêng trong cùng thư mục với đích, có đuôi ngoài glob `*.md`, ghi hết bytes, flush và đóng handle rồi thay bằng `rename`. Kiểm revision lại ngay trước khi thay. Nếu Windows khóa file hoặc thao tác thất bại, giữ tệp gốc và báo lỗi có thể thử lại. Dọn file tạm do phiên tạo và xác thực lại nội dung sau ghi. So sánh revision bảo vệ giữa các tab Studio và trước phần lớn sửa bên ngoài; một trình soạn thảo khác vẫn có thể ghi đúng lúc giữa lần kiểm cuối và thao tác thay tệp. Tránh sửa đồng thời cùng một file khi dùng hai editor. [Node.js File System API](https://nodejs.org/api/fs.html).

### Bảo vệ công cụ local

- **Cổng và nguồn request.** Guard server xác nhận đang chạy Studio local, kiểm `Host` đúng `127.0.0.1:4322` và `Origin` trùng origin trên request POST. POST chỉ nhận JSON có giới hạn kích thước và yêu cầu token của phiên. Dùng cookie phiên `HttpOnly`, `SameSite=Strict`, giới hạn path `/studio/`, thêm mã chống giả mạo request theo phiên vào header POST. GET private cần cookie phiên hợp lệ. Không bật proxy, CORS mở hoặc chuyển tiếp cổng Studio. [Vite Server Options](https://vite.dev/config/server-options.html).
- **Đường dẫn.** Danh sách collection và extension cố định. Validate ID, tra file qua bản ghi gốc, từ chối đường dẫn tuyệt đối, dấu phân cách, liên kết tượng trưng và junction. Kiểm `realpath` của thư mục/file nằm trong root đã định trước khi đọc/ghi, gồm cả thư mục lưu bản nháp. Không nhận path tự do từ browser. Bổ sung `.studio` và mẫu file tạm vào `server.fs.deny` ở cả dev thường lẫn Studio, giữ các mục mặc định của Vite. Kiểm đường dẫn tài nguyên trực tiếp, gồm cả biến thể mã hóa. [Vite `server.fs.deny`](https://vite.dev/config/server-options.html#server-fs-deny).
- **Phạm vi phản hồi.** `Cache-Control: no-store`, `X-Robots-Tag: noindex, nofollow`, không ghi nội dung nháp hoặc token vào log. Preview và editor dùng chính sách framing theo ngữ cảnh: iframe preview cho phép parent cùng origin, editor chặn bị nhúng. Quy tắc Markdown loại HTML thô và kiểm URI ở cả lúc render lẫn trước khi lưu dữ liệu công khai.
- **Build.** `astro build` và `astro preview` không đăng ký `/studio`, kể cả khi cờ môi trường còn bật. Import module đọc/ghi và UI Studio chỉ qua entrypoint dev. Kiểm `dist/` không có route, asset riêng Studio, payload nháp hoặc endpoint ghi; thử chạy production preview và xác nhận các route Studio trả 404. Sitemap và menu công khai chỉ dùng route đã phát hành. Kiểm cả trường hợp server bị cấu hình nhầm với cờ public, cờ này không được dùng để cấp quyền ghi. Chỉ deploy `dist/`; `.studio/` không vào Git và không được đặt trong `public/`.

## 5. Mô hình kịch bản mở rộng được

Kịch bản có bản làm việc và phần đã duyệt dùng cho web. Bản làm việc gắn `caseId` từ lúc tạo, không phụ thuộc Case đang SEALED hay đã có phim. v1 chỉ cần form Markdown phẳng và vùng soạn đoạn công khai. Trường `format` chừa chỗ cho cảnh có cấu trúc về sau.

```ts
interface ScriptScene {
  id: string;
  heading: string;
  objective?: string;
  narrationMarkdown: string;
  dialogue?: { speaker: string; line: string }[];
  performanceNotes?: string;
  soundNotes?: string;
  authorNotes?: string;
}

interface ScriptDraftBase {
  schemaVersion: 1;
  id: string;
  caseId: string;
  workingTitle: string;
  updatedAt: string;
  authorNotes?: string;
  excerptCandidate?: {
    title: string;
    kind: 'excerpt' | 'script' | 'transcript';
    bodyMarkdown: string;
  };
}

type ScriptDraft = ScriptDraftBase & (
  | { format: 'markdown'; bodyMarkdown: string }
  | { format: 'scenes'; scenes: [ScriptScene, ...ScriptScene[]] }
);

interface PublishedScript {
  id: string;
  caseId: string;
  title: string;
  kind: 'excerpt' | 'script' | 'transcript';
  bodyMarkdown: string;
}
```

- **Định dạng file hiện tại.** `PublishedScript` vẫn là Markdown. Frontmatter chứa đúng `id`, `caseId`, `title`, `kind`. `bodyMarkdown` là phần thân tệp. `updatedAt` của bản nháp dùng ISO UTC thực và không đưa vào dữ liệu công khai. Validation của bản nháp cho phép nội dung còn dang dở. Validation publish yêu cầu tiêu đề, thân Markdown có nội dung và Case đích hợp lệ.
- **Liên kết và ghi một tệp.** Vẫn hỗ trợ `Case.scriptId` nếu dữ liệu dùng liên kết này. Thêm quy tắc khi Case `released` chưa khai báo `scriptId`, renderer lấy tối đa một `PublishedScript` có `caseId` trùng. Studio kiểm trùng trước khi ghi và cập nhật file hiện có nếu có. `archive.ts` kiểm script không mồ côi, từ chối một Case có nhiều script hoặc `scriptId` trỏ sai. Cách này cho phép áp dụng đoạn công khai bằng một lần ghi tệp, không cần đồng thời sửa frontmatter của Case. Case đang có script công khai phải gỡ hoặc chuyển đoạn đó khỏi kho công khai trước khi hạ trạng thái; v1 vẫn kiểm điều này ở build và khi lưu.
- **Cổng duyệt.** Mặc định đề xuất `kind: 'excerpt'`. API publish chỉ nhận payload `PublishedScript` đã chọn, không nhận toàn bộ `ScriptDraft` làm input để serialize. Dựng bản xem trước từ đúng `title` và Markdown sẽ ghi. Bản nháp của Case `in-development`/SEALED vẫn xem trước được trên máy, còn build chỉ hiện script thuộc Case `released`.
- **Mở rộng phân cảnh.** Thứ tự phần tử `scenes` là thứ tự kể, ID ổn định khi di chuyển. Có thể thêm UI quản lý cảnh và sinh đề xuất văn bản công khai từ lời kể/hội thoại để tác giả duyệt về sau. Component web chỉ nhận `PublishedScript`, nên thêm trường phân cảnh hoặc đổi editor không đổi layout trang phim. `performanceNotes`, `soundNotes` và `authorNotes` chỉ thuộc kho làm việc.

## 6. Kế hoạch triển khai và kiểm thử sau khi duyệt

| Mốc | Công việc | Khi hoàn thành |
| --- | --- | --- |
| 1 · Sửa dữ liệu và giao diện công khai | Gỡ đoạn trùng/pipe thừa, bỏ mô tả ở Case và Entity, tách form dùng chung và thêm panel SEALED. | Chạy build tĩnh, đối chiếu các trang trước/sau, thử form có cấu hình giả và không cấu hình, chưa gửi email thật khi thiếu tài khoản kiểm thử. |
| 2 · Chia sẻ renderer và mở Studio local | Tách component, schema và quy tắc Markdown dùng chung, thử route dev-only trên Astro đang cài, thêm editor và preview chỉ đọc. | HTML của nội dung đã lưu giữa preview và permalink tương đương tại desktop/mobile; thay đổi chưa lưu chỉ xuất hiện trong iframe. |
| 3 · Ghi file và kịch bản | Làm lưu nháp, revision, validate trước ghi, ghi nguyên tử một tệp, và quy tắc liên kết script theo Case. Thêm panel soạn trích đoạn và xem thay đổi trước ghi. | Lưu và nạp lại đúng Markdown/Unicode. Sửa một record không đổi những record khác. Tác giả dùng được luồng xem trước và ghi từ đầu tới cuối. |
| 4 · Nghiệm thu dev và production | Chạy ma trận dưới đây, cập nhật README về lệnh Studio, phạm vi v1 và cách phục hồi bản nháp. Kiểm phát hành bằng artifact tĩnh. | Cả build mặc định lẫn build với cờ Studio bật đều không chứa công cụ và nháp. |

| Mã | Kiểm thử bắt buộc |
| --- | --- |
| **PUB-01** | Mara chỉ có đoạn của mình; Pair Nine vẫn đủ; 4 Case và 4 Entity đúng ID, metadata, quan hệ và trạng thái. Tám trang không có mô tả chung trong `main`, footer còn đúng một bản. Sáu Signal không còn dấu `|` thừa, puzzle giải được. |
| **PUB-02** | Hai SEALED có panel trong thân, hai Case mở không có panel đó. Thử tab, focus và layout mobile; bản có cấu hình sinh form POST chuẩn, bản không cấu hình hiện copy preview. Kiểm xác nhận và hủy đăng ký bằng tài khoản/hộp thư được cấp trước khi phát hành. |
| **ST-01** | Mở Case, Entity và Script; sửa tóm tắt/Markdown; xem desktop/mobile, chuyển nhanh giữa hai hồ sơ trong lúc preview đang tải. Khung không render nhầm mục, không gửi form hoặc tải media ngoài. Đối chiếu cấu trúc DOM với route công khai sau lưu. |
| **ST-02** | Lưu nháp rồi đóng/mở lại Studio. Reload khi đang gõ và kiểm khôi phục bản đệm đúng mục. Sửa hai tab cùng file, thử file bị khóa trên Windows và file được chỉnh ngoài Studio. Bản mới không ghi đè lặng lẽ; lỗi giữ văn bản đã nhập và file gốc. Kiểm UTF-8, trạng thái lỗi schema, kích thước payload và đường dẫn sai. |
| **ST-03** | Viết bản đầy đủ cho SEALED và Entity redacted, chỉ thấy trong preview nội bộ. Ghi teaser công khai, rebuild và dò chuỗi chỉ có trong bản nháp trên toàn bộ artifact. Thử publish kịch bản khi chưa `released`, tham chiếu sai Case và hai script trùng Case. |
| **ST-04** | Ghi đoạn script vào fixture Case `released`, kiểm hiển thị sau build với `scriptId` hiện có và với quy tắc theo `caseId`. Thử ghi chú nội bộ, transcript có Markdown và payload chứa field thừa. Chỉ phần được duyệt xuất hiện. |
| **ST-05** | Thử `Host` hoặc `Origin` khác, thiếu token/phiên, ID preview hết hạn, path thoát root và junction. Chạy `dev` thường, lệnh Studio trên loopback, build thường, build với cờ Studio và production preview. Chỉ lệnh Studio cho phép vào editor và ghi file. |

Mốc 1 có thể duyệt riêng để sửa phần công khai sớm. Các mốc Studio nên nghiệm thu bằng một vòng thực tế **mở hồ sơ → sửa nội dung → xem trước → lưu nháp → ghi phần công khai → build → đối chiếu permalink**. Phạm vi công cụ dừng ở soạn thảo và xem trước giao diện web. Pipeline ComfyUI, ảnh và video nằm ngoài đợt này.
