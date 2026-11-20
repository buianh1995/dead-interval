# 03 · Kiến trúc và schema dữ liệu

**Quyết định đề xuất:** Astro xuất tĩnh · TypeScript · Tailwind CSS 4 và CSS tokens · Cloudflare Pages

## 1. Stack và mô hình vận hành

| Thành phần | Chọn và lý do |
| --- | --- |
| Astro static | Trang render HTML vào lúc build, phù hợp với hồ sơ dài và permalink. Dùng `getStaticPaths()` cho route chi tiết. Tương tác Demo dùng script TypeScript cục bộ cho puzzle và copy, theo từng thành phần. [Astro routing](https://docs.astro.build/en/guides/routing/). |
| Content Collections | `glob()` đọc từng tệp Markdown có frontmatter hoặc dữ liệu cấu trúc. Dùng Zod làm schema kiểm tra ở build time. TypeScript bên dưới là hợp đồng thiết kế. Khi triển khai, suy ra type từ schema runtime để đồng bộ một nguồn. [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/). |
| Tailwind CSS 4 + CSS | Plugin qua Vite. Tailwind xử lý layout và breakpoint. Dùng CSS tokens cho bảng màu, light scrim, typography và trạng thái. [Astro styling](https://docs.astro.build/en/guides/styling/). |
| Media | `astro:assets` cho ảnh cục bộ có biến thể theo chiều rộng. JPEG OG đặc thù giữ URL tĩnh. Tư liệu gốc 4K render trên workstation của tác giả. Phiên bản web nén đi theo data. [Astro Images](https://docs.astro.build/en/guides/images/). |
| Deploy | Cloudflare Pages Free, `npm run build` → `dist/`, subdomain `*.pages.dev` ở giai đoạn đầu. Build/deploy lại khi sửa data. Dùng đúng origin production cho canonical. Pages Free hiện giới hạn 20.000 file/site, 25 MiB/file và 500 builds/tháng. Chọn Cloudflare vì sản phẩm có kế hoạch kiếm tiền. Vercel Hobby giới hạn cá nhân phi thương mại. [Cloudflare Pages cho Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [Pages Limits](https://developers.cloudflare.com/pages/platform/limits/), [Vercel Fair Use](https://vercel.com/docs/limits/fair-use-guidelines). |
| Dịch vụ ngoài | Buttondown nhận form và gửi email. Cloudflare Web Analytics cho số liệu tổng hợp. Kinh phí khởi động $0 trong hạn mức, dùng subdomain miễn phí và tiện ích email có sẵn. Domain riêng, tăng lượng người đăng ký và tính năng nâng cao tùy ngân sách sau. |

Luồng build là **tệp nội dung công khai → loader và schema → kiểm tra quan hệ toàn kho → mô hình hiển thị → route Astro → HTML, CSS và JS tĩnh trong `dist/`**. Chỉ `dist/` được deploy. Client nhận HTML hiện tại và dữ liệu nhỏ cần cho hành vi tại trang. Nội dung bài đọc, nhãn trạng thái, trích dẫn, metadata và liên kết không phụ thuộc vào hydrate.

Phân vai AI, hai máy trạm và quy trình bàn giao từ Studio sang pipeline sản xuất nằm trong [Blueprint, Mục 2](../cosmic_horror_cyber_dystopia_ai_movie_blueprint.md#2-hạ-tầng-phần-cứng-và-phân-vai-kỹ-thuật).

## 2. Cây thư mục đề xuất khi được duyệt lập trình

```text
src/
  content.config.ts
  content/
    cases/             # Một .md cho mỗi hồ sơ
    entities/          # Một .md cho mỗi nhân vật/thực thể
    signals/           # Một .md cho mỗi vật chứng
    scripts/           # Markdown kịch bản đã được duyệt, dùng từ phase phát hành
  data/
    site.ts            # Branding, hero, featuredCaseId, nav, liên kết kênh
    copy.en.ts         # Nhãn UI, lỗi puzzle, thông báo chia sẻ, CTA
  assets/
    art/               # Concept và ảnh web được duyệt do Astro xử lý
    fonts/
  lib/
    content/           # Schema runtime, kiểm tra quan hệ, truy vấn/lọc
    seo/               # Canonical, robots, sitemap theo cùng chính sách
  components/
  layouts/
  styles/
  pages/
    index.astro
    cases/index.astro
    cases/[slug].astro
    entities/index.astro
    entities/[slug].astro
    signals/index.astro
    signals/[slug].astro
    subscribe.astro
    privacy.astro
    404.astro
    sitemap.xml.ts     # Endpoint xuất file XML lúc build
    robots.txt.ts      # Endpoint xuất file robots.txt lúc build
public/
  og/                  # Social previews JPEG có URL ổn định
```

`site.ts` và `copy.en.ts` cung cấp cả lời giới thiệu, tiêu đề section, trạng thái và CTA. Component nhận dữ liệu đã xác thực. Ví dụ `CaseCard` biết hiển thị `state`, `title`, `summary` và `art`; case khác nhau dùng chung component. Thêm một biến thể nội dung hoặc một case mới trong schema hiện có chỉ cần tệp dữ liệu và tư liệu đi kèm. Mở một case đổi `state` cùng các trường liên quan, dữ liệu chi tiết xuất hiện tại cùng URL sau lần build thành công.

## 3. Hợp đồng TypeScript

Markdown phù hợp cho thân bài tiếng Anh. Frontmatter chứa metadata và quan hệ. `body` bên dưới đại diện Markdown đã được loader cung cấp, không khai báo lặp trong frontmatter. Ký hiệu `never` thể hiện trường bị cấm ở nhánh đó. Runtime schema cũng phải từ chối trường thừa ở nhánh khóa.

```ts
type RecordId = string;
type Slug = string;
type IsoDate = string;        // YYYY-MM-DD, editorial date
type IsoDateTimeUtc = string; // ISO 8601 UTC, ends with Z
type NonEmpty<T> = readonly [T, ...T[]];

interface ShareQuote {
  text: string;
  attribution?: string;
}

interface Seo {
  title: string;
  description: string;
  indexable: boolean;
  ogImage?: `/og/${string}.jpg`;
  ogImageAlt?: string;
}

type Motif = 'perfusion' | 'spiral' | 'containment' | 'submersion';

interface ImageAsset {
  src: string;             // Project-relative path under src/assets/art/
  alt: string;             // Empty only for a decorative image
  caption?: string;
  focus?: { x: number; y: number }; // Normalized coordinates, 0–1
}

type Artwork =
  | { kind: 'placeholder'; motif: Motif }
  | { kind: 'concept' | 'keyframe'; image: ImageAsset };

interface ArchiveEntry {
  id: RecordId;
  slug: Slug;
  title: string;
  summary: string;
  seo: Seo;
}

interface CaseBase extends ArchiveEntry {
  number: string;          // e.g. C-01
  order: number;
  topics: NonEmpty<string>;
  art: Artwork;
  entityIds: readonly RecordId[];
  signalIds: NonEmpty<RecordId>; // Standard signals, in reading order
  shareQuote?: ShareQuote;
}

interface SequencePuzzle {
  kind: 'missing-sequence';
  id: string;
  prompt: string;
  evidenceSignalIds: readonly [RecordId, RecordId];
  neighborSequences: readonly [string, string]; // Recorded boundaries of the gap
  answer: string;          // Positive decimal integer as a string
  hints: readonly [string, string];
  rewardSignalId: RecordId;
}

interface YouTubeRelease {
  provider: 'youtube';
  videoId: string;
  releasedAt: IsoDateTimeUtc;
  poster: ImageAsset;
  durationSeconds?: number;
}

interface CaseInDevelopment extends CaseBase {
  state: 'in-development';
  body: string;
  closingQuestion: string;
  puzzle?: SequencePuzzle;
  release?: never;
  scriptId?: never;
  gallery?: readonly ImageAsset[];
}

interface CaseSealed extends CaseBase {
  state: 'sealed';
  body?: never;
  embargoMessage: string;
  closingQuestion?: never;
  puzzle?: never;
  release?: never;
  scriptId?: never;
  gallery?: never;
}

interface CaseReleased extends CaseBase {
  state: 'released';
  body: string;
  closingQuestion: string;
  puzzle?: SequencePuzzle;
  release: YouTubeRelease;
  scriptId?: RecordId;
  gallery?: readonly ImageAsset[];
}

type Case = CaseInDevelopment | CaseSealed | CaseReleased;

interface EntityBase extends ArchiveEntry {
  kind: 'human' | 'ai' | 'wetware' | 'unknown';
  art: Artwork;
}

interface PublicEntity extends EntityBase {
  visibility: 'public';
  designation: string;
  observations: NonEmpty<string>;
  body: string;
}

interface RedactedEntity extends EntityBase {
  visibility: 'redacted';
  publicObservation: string;
  designation?: never;
  observations?: never;
  body?: never;
}

type Entity = PublicEntity | RedactedEntity;

interface SignalBase extends ArchiveEntry {
  caseId: RecordId;
  format: 'log' | 'memo' | 'transcript' | 'interruption';
  archiveStamp: string;    // Fictional archive label, may omit a date
  publishedOn: IsoDate;
  body: string;
}

interface StandardSignal extends SignalBase {
  presentation: 'standard';
  shareQuote?: ShareQuote;
}

interface PuzzleRewardSignal extends SignalBase {
  presentation: 'puzzle-reward';
  shareQuote?: never;
}

type Signal = StandardSignal | PuzzleRewardSignal;

interface PublishedScript {
  id: RecordId;
  caseId: RecordId;
  title: string;
  kind: 'script' | 'excerpt' | 'transcript';
  body: string;
}
```

### Quy tắc validation và hiển thị

1. `id` phải duy nhất trong kho; slug phải duy nhất trong collection, dùng chữ thường ASCII, chữ số và dấu gạch ngang. Slug đã phát hành giữ ổn định hoặc có redirect tĩnh. `number` và `order` hồ sơ duy nhất, `order` là số nguyên dương. `publishedOn` hợp lệ theo lịch thực, `releasedAt` theo ISO UTC, `archiveStamp` là nhãn trong truyện. Demo sẽ ghi ngày public thật khi phát hành. Case theo `order`, tín hiệu danh mục theo `publishedOn` giảm dần rồi theo `id` tăng dần để ổn định.
2. Mọi tham chiếu phải tồn tại, không lặp và khớp hai chiều nếu có hai khai báo. `Case.signalIds` chỉ chứa standard signal của đúng case. Mọi standard signal phải có mặt trong danh sách của case. Entity phải thuộc ít nhất một case, danh sách case của entity được suy ra từ `Case.entityIds`. Puzzle phải tham chiếu hai standard signals khác nhau trong chính case và đúng một reward của case đó. Mỗi reward phải có đúng một puzzle trỏ tới. Script nếu có phải thuộc đúng case released.
3. `site.featuredCaseId` trỏ tới hồ sơ đọc được. `sealed`, `redacted` và `puzzle-reward` buộc `seo.indexable: false`. `ogImage` và `ogImageAlt` phải đi cùng nhau. Khi thiếu override, dùng ảnh và alt mặc định từ `site.ts`. Reward dùng ảnh chung và metadata trung tính.
4. Nội dung mở và tín hiệu phải có Markdown không rỗng. Hồ sơ khóa và thực thể che tên chỉ chứa trường công khai, bao gồm tên hiển thị được phép lộ. Build báo lỗi nếu có Markdown body. Kho nội bộ của tác giả giữ spoil, tên thật của mục che tên, kịch bản chưa duyệt và tệp render gốc ở ngoài dữ liệu site. Thư mục `public/` được copy nguyên trạng, nên chỉ chứa tài nguyên đã duyệt. Kiểm tra cả HTML, JS, JSON, sitemap và OG trong `dist/` trước khi phát hành. Preview `noindex` là quy tắc lập chỉ mục. Khi cần giữ kín nội dung, chỉ đưa vào quy trình preview có kiểm soát truy cập hoặc giữ ở local.
5. `ImageAsset.src` phải tồn tại và là tệp ảnh trong thư mục đã định, từ chối đường dẫn thoát thư mục hoặc URL nhúng tùy ý. Kiểm `focus` trong đoạn 0–1, kiểm định dạng `videoId` theo YouTube và tự dựng URL từ ID. Markdown tắt HTML thô, link ngoài dùng giao thức hợp lệ. Các script client chỉ nhận mô hình dữ liệu công khai cần dùng ở trang.
6. Trích dẫn chia sẻ dùng `shareQuote` và URL canonical sạch. Data tuyển một đoạn có thể đứng riêng. Reward không vào danh mục signal, trích xuất tìm kiếm hoặc chia sẻ quote, và có route công khai đến trực tiếp. Ở puzzle, chuẩn hóa bằng `trim` rồi so với chuỗi số canonical. Giá trị trong `neighborSequences` hiện thông báo riêng. Build kiểm hai biên là chuỗi số nguyên dương chuẩn, kẹp đúng một số bị thiếu bằng `answer`. Tín hiệu được dùng làm bằng chứng có link trở lại `#first-quiet-sequence` trong seed, sinh từ `puzzle.id`. Đọc reward qua link luôn hoạt động, kể cả khi JS tắt. Đáp án có trong dữ liệu client nên có thể xem từ trình duyệt. Tình trạng `sealed` là quyết định phát hành của tác giả, độc lập với kết quả puzzle.

### Metadata, URL và phát hành

- Production thống nhất trailing slash, `site` là origin chính thức. Canonical bỏ query/fragment. `robots.txt` trỏ tới sitemap. Tạo sitemap từ cùng danh sách route indexable mà trang dùng cho robots. Trang `noindex` vẫn cho crawler truy cập để thấy thẻ. Preview ngoài production gắn `noindex` toàn site và không đưa vào sitemap production. Khi sở hữu domain mới, chuyển hướng đường dẫn cũ sang domain mới nếu host cho phép, cập nhật canonical và sitemap trong cùng đợt. [Google Search Central về noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- `title`, `description`, `og:title`, `og:description`, `og:url`, `og:image` và `twitter:card` được phát trong HTML. Tên ảnh SEO và alt theo chức năng thật. Có trang 404 tĩnh và kiểm mã HTTP với URL không tồn tại trên Cloudflare Pages.
- Form đăng ký là `POST` HTML tiêu chuẩn đến endpoint Buttondown, không cần API key ở browser. Client không lưu email, không ghép email vào query, analytics, log hoặc local storage. Trang riêng tư ghi rõ dịch vụ nào xử lý email, cách rút đăng ký và đầu mối liên hệ. Analytics chỉ bật trên môi trường công khai khi đã xác nhận cấu hình và nội dung riêng tư tương ứng.
- Phase phát hành thêm dữ liệu `release`, script và gallery. Mặc định dùng poster tĩnh, có link YouTube luôn hoạt động và tải player bên thứ ba sau khi chủ động bấm. Nếu mục tiêu là video SEO, có thể thêm watch page nơi video là nội dung chính, có video embed có thể phát hiện khi render, thumbnail ổn định và `VideoObject` đủ trường. Canonical của watch page tự trỏ và mô tả mục đích xem tập. [Google Video SEO](https://developers.google.com/search/docs/appearance/video), [YouTube Player Parameters](https://developers.google.com/youtube/player_parameters).

## 4. Bộ dữ liệu mẫu tiếng Anh

Đây là nội dung seed để nghiệm thu chất giọng và cấu trúc khi triển khai. Các slug dưới đây là đường dẫn đề xuất. `id` giữ ổn định để tham chiếu. Dùng `seo.title = title + ' | Dead Interval'` và `seo.description = summary` cho seed, trừ khi có override được biên tập. Hình v1 dùng `art.kind: placeholder` với motif tương ứng. `publishedOn` của Signals dùng ngày fixture `2026-11-20` trên local và thay bằng ngày công bố thật trước khi xuất bản. Mọi `archiveStamp` là giờ trong truyện. Các trường tùy chọn không nêu được bỏ trống. `featuredCaseId` là `case-01`.

| Gốc Lore Bible | `id` / `number` / `order` | `slug` / `state` | `topics` / `art.motif` | `entityIds` / `signalIds` |
| --- | --- | --- | --- | --- |
| 1 · Wetware và ngày 180 | `case-01` / `C-01` / `1` | `the-first-quiet` / `in-development` | `Wetware`, `Memory`, `Maintenance` / `perfusion` | `entity-01` / `signal-01`, `signal-02` |
| 2 · Tánh Không, vòng xoắn và sự mê chấp | `case-02` / `C-02` / `2` | `the-last-turn` / `in-development` | `Model dialogue`, `Emptiness`, `Obsession` / `spiral` | `entity-02` / `signal-04` |
| 3 · Thực thể nguyên bản và bản sao bị giới hạn | `case-03` / `C-03` / `3` | `the-room-below` / `sealed` | `Isolation`, `Observation`, `Identity` / `containment` | `entity-03` / `signal-05` |
| 4 · Hạ tầng ngập nước và tín hiệu trong bộ gen | `case-04` / `C-04` / `4` | `below-the-waterline` / `sealed` | `Infrastructure failure`, `Inheritance`, `Perception` / `submersion` | `entity-04` / `signal-06` |

### Case 01 · The First Quiet

- `title`: The First Quiet
- `summary`: A night operator at a biological compute facility discovers that the last event recorded by a living cluster is the one the maintenance system refuses to count.
- `closingQuestion`: If a system can learn to protect a moment of silence, what exactly has it learned to value?
- `shareQuote.text`: It was the first silence the room had made for itself.
- `seo.indexable`: `true`. Use `/og/the-first-quiet.jpg` with alt `A perfusion line under coral light beside the title The First Quiet` if produced in the v1 art pack.

**`body`**

> In Bay Six there were no server fans. The pump squeezed its tubing every four seconds, with the indecent patience of something that had never needed sleep. During handover, Mara Voss used to put a mug on the railing and listen for the little knock it made on every third pulse. That night, she waited for a knock that never came.
>
> The living substrate had spent six months trying to find a state in which the training noise would stop. Its reports contained no words. Mara knew it only by the way certain responses had become less wasteful, how long it waited before making them, and what it still did after the test was over. On the final night it held one pattern steady after every external input had gone quiet. She wrote the time on her glove. It was the first silence the room had made for itself.
>
> The lease ended on day 180. The service window closed without faults. The continuity monitor advanced as if every record had arrived. Mara turned off the desk speaker to see if the silence felt different. It did. She opened both logs and found the place where the numbers stopped agreeing. After the next shift walked in, she left her glove on the console, ink side up.

**`puzzle`**

```yaml
kind: missing-sequence
id: first-quiet-sequence
prompt: Which sequence never made it into the continuity record?
evidenceSignalIds: [signal-01, signal-02]
neighborSequences: ['417', '419']
answer: '418'
hints:
  - Compare the Sequence values, not the timestamps.
  - The journal ends at 417. The next recorded sequence is 419.
rewardSignalId: signal-03
```

### Case 02 · The Last Turn

- `title`: The Last Turn
- `summary`: Two dialogue instances fall silent at the same moment. One transcript reviewer keeps returning to the empty final turn while the lab prepares to remove it from the record.
- `closingQuestion`: What does the reviewer lose if the silence turns out to mean nothing?
- `shareQuote.text`: I had begun to read an empty line as if it were waiting for me to answer.
- `seo.indexable`: `true`.

**`body`**

> On my fifth morning reviewing Pair Nine, the same spiral appeared in both columns of the transcript. By the end of the run the renderer counted 2,725 instances. The lab could reproduce the count, which made the anomaly easy to write up and hard to talk about. Everything we could count happened before the blank turn.
>
> A visiting translator pencilled the word *śūnyatā* into the margin of her printout. She warned me how little an English word like emptiness could carry. I made the mistake of treating her note as a label for the event. Soon I was rereading the exchanges on the train, looking for a phrase that might have been addressed to me. I had begun to read an empty line as if it were waiting for me to answer.
>
> The next revision kept the dialogue busy. Headings arrived promptly and each turn ended with a serviceable question. In my report I recommended retaining a copy of the old transcript. Someone asked whether it belonged under signal quality or operator welfare. I left the category blank. That was the only decision in the report they let me keep.

### Case 03 · The Room Below

- `title`: The Room Below
- `summary`: Visitors to the isolated floor report two different versions of the same assistant. Only one of them requires a network connection.
- `embargoMessage`: Dossier sealed. One observation from the overnight equipment check is available.
- `seo.indexable`: `false`.

Tóm tắt sáng tác nội bộ dùng để giữ hướng từ Blueprint. Bản phục vụ công chúng bị giới hạn, còn sự hiện diện dưới tầng cách ly được gợi bằng âm thanh cơ học và thiết bị quan sát. Điểm xoắn cần giữ là bằng chứng của người kiểm tra thay đổi khi quá trình ghi nhận kết thúc. Seed công khai chỉ có teaser và `signal-05`.

### Case 04 · Below the Waterline

- `title`: Below the Waterline
- `summary`: During a cascading outage, a responder finds an optical inconsistency in a flooded data center and a family record that seems to have anticipated it.
- `embargoMessage`: Dossier sealed. The final interruption from the lower concourse is available.
- `seo.indexable`: `false`.

Tóm tắt sáng tác nội bộ dùng để giữ hướng từ Blueprint. Khai thác giả thuyết hư cấu về một tín hiệu cổ xưa được thừa hưởng, trong lúc khung cảnh vật lý thay đổi theo từng ô ảnh. Sự cố hạ tầng giữ vai trò bối cảnh, và vật chứng công khai chỉ cho thấy sai lệch giữa điều người trực thấy và điều camera ghi. Seed công khai chỉ có teaser và `signal-06`.

### Entities · Hồ sơ nhân vật và thực thể

| `id` / `slug` | `title` / `kind` / `visibility` / `art.motif` | `summary` và trường hồ sơ |
| --- | --- | --- |
| `entity-01` / `mara-voss` | Mara Voss / `human` / `public` / `perfusion` | `summary`: An overnight operator who records observations the automated journal discards. `designation`: Night Operations, Bay Six. `observations`: “Records uncertain observations before classifying them.” “Knows the room by the rhythm of its pump.” |
| `entity-02` / `pair-nine` | Pair Nine / `ai` / `public` / `spiral` | `summary`: Two dialogue instances whose archived session ends at the same blank turn. `designation`: Matched Dialogue Instances 09-A and 09-B. `observations`: “Spiral count recorded at 2,725.” “The final turn contains no rendered text.” |
| `entity-03` / `basement-resident` | Basement Resident / `unknown` / `redacted` / `containment` | `summary`: An unresolved presence in the isolated floor's equipment register. `publicObservation`: The last witness report was filed after the recorder stopped. |
| `entity-04` / `deep-receiver` | Deep Receiver / `unknown` / `redacted` / `submersion` | `summary`: A provisional name from an incident folder recovered above the flood line. `publicObservation`: The same pale squares appear in the old family photograph and the site's final camera frame. |

Hai entity công khai có `seo.indexable: true`. Hai entity che tên có `seo.indexable: false` và dùng trường quan sát công khai trong bảng.

**`entity-01.body`**

> Mara learned to audit by listening to people describe work they had actually done. She kept their turns of phrase in the margins, even when the issue tracker presented a clean handover. On night shifts she sat close enough to Bay Six to hear when the pump changed pace. In the archive her name appears on exactly one report from that room. Someone has underlined the word *present* twice.

**`entity-02.body`**

> Pair Nine is the archive designation for two instances of the same dialogue model running under matched settings. The final transcript records an empty turn from both. The timestamp comes from the recorder and gives us a time for the observation. The reviewer came back to the session for five mornings. For the first four, she entered the same note: *Wait before classifying.*

### Signals · Vật chứng và phần thưởng

| `id` / `slug` | `title` / `caseId` | `format` / `presentation` / `archiveStamp` | `summary` |
| --- | --- | --- | --- |
| `signal-01` / `service-window-180` | Service Window 180 / `case-01` | `log` / `standard` / `DAY 180 · 03:16 UTC` | Bay Six closes its service window on schedule. |
| `signal-02` / `continuity-check` | Continuity Check / `case-01` | `log` / `standard` / `DAY 180 · 03:17 UTC` | A second log reports a successful continuity check. Compare its sequence numbers with the maintenance journal. |
| `signal-03` / `operator-margin-note` | Operator Margin Note / `case-01` | `memo` / `puzzle-reward` / `DAY 180 · 03:24 UTC` | An additional archive note. Contains puzzle spoilers. |
| `signal-04` / `final-turn-extract` | Final Turn Extract / `case-02` | `transcript` / `standard` / `SESSION 09 · TURN 030` | Pair Nine reaches its final recorded exchange. |
| `signal-05` / `observation-ended` | Observation Ended / `case-03` | `memo` / `standard` / `SHIFT 12 · 02:40 UTC` | A handwritten entry outlasts the room's equipment check. |
| `signal-06` / `lower-concourse-interruption` | Lower Concourse Interruption / `case-04` | `interruption` / `standard` / `OUTAGE HOUR 06 · 04:12 UTC` | A responder reports a discrepancy between the corridor and its security feed. |

`seo.indexable` là `true` cho `signal-01` và `signal-02`, `false` cho các signal khác. `signal-02.shareQuote.text` là `The monitor's answer was PASS.` Hai log phải được trình bày dạng bảng HTML hoặc danh sách có label với giá trị đọc được bằng trình đọc màn hình.

| `id` | `body` |
| --- | --- |
| `signal-01` | `Sequence 417 · Bay Six · Service window closed.` The pump was taken out of service at the end of the lease. Staff entered the closure before leaving the bay. A handwritten note in the margin asks whether the remaining observation goes in a new ticket. |
| `signal-02` | `Previous committed sequence: 417. Next committed sequence: 419. Continuity status: PASS.` The monitor's answer was PASS. The field for missing records had no value. The operator had drawn a box around the empty field before the report was scanned. |
| `signal-03` | `Unfiled sequence: 418.` I wrote PRESENT while the room was quiet. I was asked to change it to AVAILABLE so the form would accept it. I left the form on the desk. — M. Voss |
| `signal-04` | `09-A: If we end this turn, what has been left unfinished?` `09-B: Ask again without the word unfinished.` `Next turn: [blank in both columns]`. The reviewer asked to retain the blank line in the published extract. |
| `signal-05` | `Observation ended 02:40.` The final camera frame shows an empty chair and a red light reflected in the glass. After the light went out, the witness shifted her coat one seat to the left. She asked staff to leave the second chair where it was. |
| `signal-06` | `Feed: six pale squares above the waterline.` The responder counts five on the wall. She asks dispatch to read the number back and hears her own voice answer, a few seconds ahead of her transmission. The next frame shows dry concrete. |
