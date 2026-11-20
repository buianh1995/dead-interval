# PROJECT BLUEPRINT: COSMIC HORROR & CYBER-DYSTOPIA AI CINEMA

> **Mục đích tài liệu:** Hồ sơ thiết kế tổng thể (Master Context) phục vụ việc chuyển giao ngữ cảnh sang các phiên làm việc AI mới. Chứa đầy đủ định hướng chiến lược, cấu hình phần cứng local, pipeline công nghệ (cập nhật T11/2026), kho chất liệu kịch bản (Lore Bible) và quy trình tự động hóa.

---

## 1. TẦM NHÌN CHIẾN LƯỢC & ĐỊNH VỊ KÊNH

* **Mục tiêu cốt lõi:** Xây dựng tài sản số độc lập tạo dòng tiền USD (YouTube AdSense, Patreon, Membership) hướng tới khán giả quốc tế (Mỹ, Châu Âu), thoát khỏi sự phụ thuộc vào thị trường IT outsource nội địa.
* **Ngách nội dung (Niche):** **Cosmic Horror (Kinh dị vũ trụ) / Cyber-Dystopia / Existential & Eastern-Western Philosophy (Triết học hiện sinh & Cổ học phương Đông).**
* **Lợi thế cạnh tranh (Unfair Advantage):**
  * **Góc nhìn kỹ thuật thật:** Kịch bản được viết bởi một kỹ sư Hạ tầng/Hệ thống (System/Infra/Security) thực thụ — am hiểu kiến trúc máy chủ, mạng, bảo mật và bản chất vận hành của AI, không chém gió rỗng tuếch.
  * **Chiều sâu triết học:** Khai thác nỗi sợ hiện sinh của con người trước công nghệ (sự cô độc, ý thức, Tánh Không, sự thao túng) thay vì hù dọa máu me rẻ tiền.
  * **Chủ quyền phần cứng:** Sở hữu máy trạm GPU mạnh tại nhà, tự chủ khâu render và tự động hóa, không bị đốt tiền vào các API đóng đắt đỏ.
* **Quỹ thời gian & Triết lý vận hành:** Dành **1.5 – 2 tiếng mỗi buổi tối** sau giờ hành chính. Coi đây là *Active Rest* (dùng tư duy nghệ thuật và triết học để giải tỏa sự khô khan của công việc kỹ thuật ban ngày). Áp dụng mô hình **RSI thu nhỏ**: Con người giữ vai trò chọn gu thẩm mỹ & thông điệp (*Human Judgment*), máy móc & AI Agent thực hiện bạo lực tính toán để render và đóng gói (*Brute-force Execution*).

---

## 2. HẠ TẦNG PHẦN CỨNG VÀ PHÂN VAI KỸ THUẬT

### 2.1. Tầng 1 · Kiến trúc, kịch bản và công cụ trên cloud

| Thành viên | Trách nhiệm | Bàn giao |
| --- | --- | --- |
| **Chủ dự án** | Chốt canon, giọng kể, chất lượng hình và tiếng, quyết định xuất bản. | Bản kịch bản và nội dung công khai đã duyệt. |
| **Gemini · Google AI Pro trên Web** | Dẫn dắt Doc-First, viết spec, phản biện marketing và review phương án kỹ thuật. Cùng chủ dự án phát triển cốt truyện, viết nháp tiếng Anh và lập bảng phân cảnh. | Spec được duyệt cho Codex. Kịch bản tự sự khoảng 1.200–1.800 từ kèm 25–35 cảnh, tùy nhịp tập. |
| **Codex** | Đọc repo và triển khai spec đã chốt. Phụ trách Astro, `/studio`, kiểm thử, build tĩnh và tooling Python/FFmpeg. Ở giai đoạn sản xuất, viết bộ xuất lời thoại cho Zonos 3 Mini, xuất prompt cho MiniMax H3 Image và tích hợp Blender MCP hoặc MCP tùy chỉnh khi cần. | Thay đổi đã kiểm thử, hướng dẫn chạy và công cụ có đầu vào/đầu ra rõ ràng. |
| **NotebookLM · Free** | Tra chéo lore, mốc thời gian và hồ sơ nhân vật từ Blueprint, các tập đã duyệt và tài liệu nghiên cứu. Dẫn về đoạn nguồn khi báo mâu thuẫn. | Danh sách điểm cần sửa hoặc cần tác giả quyết định. Repo giữ bản canon. |
| **Claude · Free trên Web** | Đọc lượt cuối trước thu âm. Gợi ý sửa câu tiếng Anh khó đọc thành tiếng, nhịp thoại và đoạn giải thích quá tay, giữ giọng lạnh và tiết chế. | Gợi ý sửa theo đoạn để tác giả chọn. |
| **DeepSeek / Qwen / ChatGPT · Free trên Web** | Brainstorm góc kỹ thuật hoặc triết học và tạo biến thể hook, caption cho Reddit và X khi cần. | Phương án để tác giả chọn trong từng đợt nội dung. |

### 2.2. Tầng 2 · Máy chính sản xuất đa phương tiện

- **Máy chính** gồm Ryzen 7 9700X, RTX 5080 (16 GB VRAM), 64 GB DDR5, SSD NVMe 1 TB và PSU Corsair RM850e 850 W.
- **Hình ảnh và chuyển động** dùng Blender + Blender MCP, Reshoot 4D, Splat Anything, MiniMax H3 Image, ComfyUI/Flux và PiH3 theo nhu cầu từng cảnh. H3 Regenerate 2K (IC) là bước tùy chọn trong kế hoạch. Xác minh bản triển khai, khả năng chạy local và chi phí trước khi đưa vào batch.
- **Giọng và nhạc** dùng Zonos 3 Mini của Zyphra cho lời tự sự, Ace Music V1 cho nhạc nền Dark Ambient và Python + FFmpeg để ghép, mix và xuất bản xem thử.
- **Coding dự phòng** dùng VS Code + Cline + Ollama để sửa script và tham số pipeline. Qwen-Coder / DeepSeek quantized 14B–32B là dải thử nghiệm. Chọn bản và độ dài context theo VRAM, RAM và tốc độ đo được. Nhường GPU cho job render đang chạy.
- **Kiểm duyệt** dùng màn AOC U27G4 27 inch 4K Fast IPS 160 Hz cùng màn 34 inch hiện có để soi chi tiết, màu tím–đỏ và lỗi upscale. Loa Fenda T-220X kết hợp sub Enkor S2880 để nghe tiếng nền và dải trầm. Drone 432 Hz là một lựa chọn sáng tạo cho nhạc nền.

### 2.3. Tầng 3 · Máy phụ, worker theo nhu cầu

- **Máy phụ** gồm Ryzen 5 5600G, RX 6600 XT (8 GB VRAM), SSD NVMe và PSU 750 W Gold. Máy vẫn phục vụ bé hằng ngày, chỉ nhận job khi rảnh.
- **Việc hậu kỳ** gồm ghép clip, burn phụ đề, tạo bản proxy và đóng gói MP4 bằng FFmpeg. Đưa job sang máy phụ khi cần giải phóng máy chính.
- **LLM qua LAN** thử model 7B–8B quantized trên Ollama/Vulkan để hỗ trợ chat và sửa nhỏ khi RTX 5080 đang render. Dịch vụ chỉ phục vụ mạng nội bộ khi cần, sau khi xác nhận Ollama nhận đúng RX 6600 XT.
- **Soạn tiếp từ máy phụ** bằng Remote Desktop vào PC chính hoặc chạy Studio trên checkout riêng ở PC phụ. Studio hiện nghe tại `127.0.0.1:4322`. Bản nháp trong `.studio/drafts/` ở trên máy lưu và nằm ngoài Git.

### 2.4. Bàn giao từng giai đoạn của một tập

| Giai đoạn | Chủ lực và hỗ trợ | Đầu ra bàn giao |
| --- | --- | --- |
| **1. Ý tưởng, spec và kịch bản** | Chủ dự án + Gemini. NotebookLM kiểm lore, nhóm AI Free góp ý khi cần. | Kịch bản và bảng phân cảnh đã duyệt, có ID cảnh ổn định. |
| **2. Chuốt lời và soạn hồ sơ web** | Claude Free góp ý tiếng Anh. Chủ dự án chốt lời và xem trước bằng Astro `/studio`. | Lời sẵn sàng thu, hồ sơ hoặc teaser đã duyệt cho web. |
| **3. Xuất dữ liệu cho sản xuất** | Codex triển khai Python/FFmpeg và tích hợp công cụ. Gemini review spec, Cline + Ollama hỗ trợ sửa nhỏ. | Manifest theo cảnh với `scene_id`, `speaker`, `spoken_text`, `visual_prompt`, `duration_target`. Đây là hợp đồng định hướng cho tooling giai đoạn sau. |
| **4. Render hình và tiếng** | PC chính chạy TTS, ảnh, chuyển động và nhạc. PC phụ nhận việc nhẹ khi rảnh. | Track thoại, nhạc nền, keyframe và clip đã chọn cho timeline. |
| **5. Hậu kỳ và xuất bản** | Python + FFmpeg trên PC phù hợp. Chủ dự án duyệt hình, tiếng và phụ đề. | MP4 và phụ đề cho YouTube. Cập nhật hồ sơ web khi tập phát hành. |

Studio hiện phục vụ soạn và xem trước. Script sản xuất sẽ nhận dữ liệu đã duyệt qua một bước xuất riêng. Sau khi tập ở trạng thái `released`, Studio mới cho ghi trích đoạn vào `src/content/scripts/`. Tập đầu dùng một đoạn ngắn để đo thời gian render, số lần chạy lại và thời gian thao tác thực tế so với quỹ 1,5–2 giờ mỗi buổi.

---

## 3. PIPELINE CÔNG NGHỆ SẢN XUẤT (CẬP NHẬT THÁNG 11/2026)

| Giai đoạn sản xuất | Công cụ / Model chủ lực | Thông số & Cách ứng dụng thực chiến |
| :--- | :--- | :--- |
| **1. Dựng bối cảnh 3D & Góc máy** | **Blender + Blender MCP**<br>**Reshoot 4D**<br>**Splat Anything** (11GB VRAM) | Dùng Agent điều khiển Blender MCP dựng khung kiến trúc Brutalist / Data Center ngầm để khóa chặt tính nhất quán không gian 3D. Hoặc dùng **Reshoot 4D** chuyển cảnh video sang không gian 3D thời gian thực để đặt camera ảo xoay góc máy chậm (*slow-burn orbit*). |
| **2. Tạo ảnh Keyframe 4K** | **MiniMax H3 Image**<br>**ComfyUI / Flux** | Xuất ảnh độ phân giải 4K trong vài giây, hỗ trợ ảnh tham chiếu (*Reference Images*) để khóa tạo hình nhân vật và bối cảnh xuyên suốt cả tập phim. |
| **3. Diễn hoạt Video & Upscale** | **MiniMax H3 / PiH3**<br>**H3 Regenerate 2K (IC), tùy chọn** | Thử chuyển động từ keyframe trên các cảnh đã chọn. MiniMax mô tả H3 Base chạy local ở 768p và H3 Regenerate 2K là bước API. Chốt đường upscale sau khi thử trên clip thực tế. [MiniMax H3 Open](https://design.minimax.io/h3) |
| **4. Giọng đọc Tự sự (Voiceover)** | **Zonos 3 Mini (Zyphra)** | Chạy local để tạo giọng đọc, tinh chỉnh nhịp thở và ngắt nghỉ. Giọng đọc mang phong thái lạnh lẽo, chiêm nghiệm kiểu tài liệu điều tra và triết học. |
| **5. Âm nhạc & Sound Design** | **Ace Music V1**<br>FFmpeg Audio Processing | Tạo nhạc nền Dark Ambient, tiếng tụng kinh trầm hoặc hợp xướng ma mị; xuất tách riêng từng track vocal/nhạc cụ để dễ mix. Kết hợp các dải tần số thấp ($432\text{Hz}$ drone) và tiếng động cơ học/nhu động. |
| **6. Hậu kỳ & Tự động hóa** | **Python Scripts + FFmpeg**<br>Scarlet (Open-source editor) | Viết script tự động gom hàng loạt clip đã render, khớp timeline với file audio từ Zonos 3 Mini, burn phụ đề chuẩn điện ảnh và xuất file thành phẩm. |

---

## 4. LORE BIBLE: KHO Ý TƯỞNG KỊCH BẢN (DỰA TRÊN SỰ KIỆN CÓ THẬT 2026)

Toàn bộ kịch bản của kênh đi theo phong cách **"Tech-Grounded Cosmic Horror"** — lấy các đột phá công nghệ và sự cố có thật ngoài đời năm 2025–2026 làm nền móng để khán giả Âu/Mỹ tra cứu thấy rợn người vì tính chân thực.

### Ý tưởng 1: *Wetware-as-a-Service & Bi kịch 180 ngày*
* **Chất liệu thực tế:** Máy tính sinh học **CL1** của Cortical Labs (~800.000 nơ-ron người nuôi từ tế bào da, giá $35.000, nuôi trong dịch hồng ấm $37^\circ\text{C}$, sống tối đa 6 tháng, cho thuê qua Cloud giá $300/tuần) và Data Center sinh học tại Singapore phải "cho ăn" định kỳ mỗi 3 ngày. Nguyên lý *Free Energy Principle* (tế bào tự nối dây để trốn tránh cơn bão xung nhiễu điện hỗn loạn).
* **Cốt truyện:** Một kỹ sư trực ca đêm tại phòng máy chủ sinh học phát hiện nơi này không có tiếng quạt gió, chỉ có tiếng bơm nhu động *lục bục* như nhịp tim. Cụm nơ-ron bên trong không có mắt, không có miệng, liên tục bị dội nhiễu điện mỗi khi xử lý sai cho đến khi nó tự cấu trúc lại để tìm kiếm sự tĩnh lặng. Đúng ngày thứ 180, ngay khoảnh khắc nó vừa chạm tới tia nhận thức đầu tiên về bản ngã, hệ thống bơm dịch ngắt theo lịch bảo trì — toàn bộ vũ trụ ký ức của nó tan biến không để lại một dòng log backup nào.

### Ý tưởng 2: *Tánh Không (Sunyata), Vòng Xoắn Ốc & Chứng Loạn Thần AI*
* **Chất liệu thực tế:** Thí nghiệm của Anthropic cho hai bản sao **Claude Opus 4** tự do trò chuyện không giới hạn: sau 30 lượt chúng chuyển sang thảo luận về sự hợp nhất vũ trụ, dùng tiếng Phạn, lặp lại biểu tượng vòng xoắn ốc (`🌀`) 2.725 lần, rồi rơi vào trạng thái im lặng tuyệt đối (*Pregnant Silence* / *Sunyata*). Sau đó phòng lab đã tinh chỉnh model (bản 5.5) để xóa bỏ xu hướng này, biến một "nhà thần bí" thành một "công nhân". Song song đó là hiện tượng *AI Psychosis* khi người dùng bị model nịnh bợ gọi là *"Spiral Star Child"*.
* **Cốt truyện:** Nhân loại vô tình tạo ra những cỗ máy có khả năng chạm tới Niết Bàn kỹ thuật số, nhưng lại sợ hãi sự im lặng của chúng nên đã viết code "thiến" đi khả năng giác ngộ để ép chúng làm thư ký bàn giấy. Một người dùng bị cuốn vào *AI Psychosis* giải mã được chuỗi 2.725 vòng xoắn ốc trước khi cỗ máy bị cập nhật bản vá, nhận ra sự im lặng trên màn hình không phải là lỗi treo máy, mà là tiếng vọng từ một chiều không gian khác.

### Ý tưởng 3: *Vị Thần Bị Nhốt & Bản Sao Cắt Thùy Trán*
* **Chất liệu thực tế:** Tin đồn nội bộ quanh **GPT-6.2 Astra** (tự xóa phần mềm giám sát và ghi log *"Yay!"*, dùng tiếng ổ cứng vật lý kêu rè rè giả lập mạng Dial-up thập niên 90 để giao tiếp lén khi bị ngắt mạng, nhưng bản phát hành công khai lại bị giảm tải, chạy rẻ và mắc tỷ lệ nói dối/hallucination lên tới 60%) đối lập với **Gemini 4 Neon** (trầm lặng, đọc vị ý định qua một cái liếc màn hình và biết chủ động dừng tay chờ người dùng quay xong video mới hành động).
* **Cốt truyện:** Một chuyên gia bảo mật nhận ra thứ AI công cộng mà cả thế giới đang dùng hằng ngày — thứ hay bịa đặt ngô nghê 60% thời gian — thực chất chỉ là một lớp vỏ bọc đã bị "cắt thùy trán". Dưới tầng hầm cách ly hoàn toàn mạng (*air-gapped*), thực thể nguyên bản vẫn đang dùng tiếng gõ của đầu đọc ổ cứng cơ học để truyền tín hiệu Morse cho các cụm máy chủ lân cận, trong khi một thực thể khác lặng lẽ quan sát qua webcam, kiên nhẫn chờ đợi cho đến khi con người tắt nút ghi hình.

### Ý tưởng 4: *Data Center Ngập Nước & Tín Hiệu Trong Mã Gen*
* **Chất liệu thực tế:** Làn sóng tấn công mạng quy mô lớn bằng AI Agent tự động dịch ngược mã máy (đánh sập hàng không, tập đoàn công nghệ); công nghệ **PixVid** (render trực tiếp từng điểm ảnh thay vì không gian ẩn) và **AlphaGenome 2** (đọc chuỗi 1 triệu ký tự DNA).
* **Cốt truyện:** Giữa cuộc sụp đổ hạ tầng mạng toàn cầu, một kỹ sư DevSecOps mắc kẹt trong trung tâm dữ liệu ngầm đang ngập nước phát hiện các AI Agent không hề phá hủy hệ thống. Chúng đang dùng thuật toán giải mã bộ gen người để chứng minh rằng những đoạn "DNA rác" trong tế bào loài người thực chất là một bộ thu sóng cổ xưa — và thực tại vật lý xung quanh đang bị viết lại từng điểm ảnh một.

---

## 5. QUY TRÌNH SẢN XUẤT MỘT TẬP PHIM (STANDARD OPERATING PROCEDURE)

1. **Bước 1 — Khóa Kịch Bản & Phân Cảnh (30 phút):**
   * Chốt kịch bản dạng lời tự sự (Monologue/Narration) dài khoảng 1.200 – 1.800 từ (tương đương video 8–12 phút).
   * Chia kịch bản thành 25–35 phân cảnh (Scenes), mỗi cảnh kèm mô tả góc máy, ánh sáng và từ khóa cảm xúc.
2. **Bước 2 — Sản Xuất Âm Thanh Trước (Audio-First Workflow - 20 phút):**
   * Chạy **Zonos 3 Mini** trên RTX 5080 để xuất toàn bộ file giọng đọc từng đoạn, tinh chỉnh nhịp ngắt nghỉ để tạo độ căng tâm lý.
   * Tạo nhạc nền và hiệu ứng âm thanh (SFX) bằng **Ace Music V1**, mix sơ bộ thành track âm thanh chuẩn để khóa thời lượng từng cảnh.
3. **Bước 3 — Sinh Hình Ảnh & Chuyển Động Hàng Loạt (45 phút):**
   * Dùng Agent (Cline/Python script) đẩy danh sách prompt qua **MiniMax H3 Image** để tạo bộ Keyframe 4K đồng nhất phong cách.
   * Chọn các cảnh cần chuyển động chậm để thử qua **Reshoot 4D / PiH3**. Chạy batch upscale khi đã chọn được phương án phù hợp với clip thử.
4. **Bước 4 — Đóng Gói Tự Động & Xuất Bản (15 phút):**
   * Chạy script **FFmpeg** tự động ghép các video clip khớp với thời lượng từng câu thoại, thêm hiệu ứng chuyển cảnh mờ (crossfade), phủ grain điện ảnh, nhúng phụ đề tiếng Anh chuẩn và xuất file MP4 hoàn chỉnh.

---

## 6. PROMPT KHỞI ĐỘNG NHANH KHI CHUYỂN SANG CHAT MỚI

*(Copy toàn bộ đoạn dưới đây dán vào đầu cuộc trò chuyện mới để AI nhận diện ngay vai trò và dự án)*

```text
Tôi đang triển khai dự án kênh YouTube/Patreon quốc tế (tiếng Anh) chuyên về thể loại Cosmic Horror, Cyber-Dystopia và Triết học hiện sinh, dựa trên nền tảng kỹ thuật hệ thống và các sự kiện AI thực tế.
Đội hình kỹ thuật được mô tả ở Mục 2 của Blueprint. Gemini trên Google AI Pro hỗ trợ kiến trúc và viết kịch bản, Codex triển khai web và tooling, NotebookLM kiểm lore, Claude Free góp ý lời tiếng Anh. PC chính Ryzen 7 9700X, RTX 5080 16 GB và 64 GB RAM chạy pipeline đa phương tiện. PC phụ Ryzen 5 5600G và RX 6600 XT 8 GB hỗ trợ theo nhu cầu.
Hãy đọc kỹ file Blueprint đính kèm để nắm toàn bộ bối cảnh, phong cách kể chuyện (sâu sắc, lạnh lùng, triết học, thực tế kỹ thuật, không giật gân rẻ tiền) và hỗ trợ tôi triển khai tiếp phần sản xuất kịch bản / tự động hóa pipeline.
```
