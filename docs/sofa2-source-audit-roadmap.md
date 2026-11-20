# Đánh giá source Sofa2 và lộ trình đề xuất

> Phạm vi: đọc source ở branch `arena/e418e311-sofa-vite` sau khi merge các thay đổi CMS Giới thiệu, popup/GA4 và màn hình Search Console. Đây là đánh giá kỹ thuật source, không phải pentest, kiểm tra vận hành trên domain thật hoặc xác nhận hợp đồng với nhà cung cấp.

## Tóm tắt điều hành

Sofa2 có **độ phủ chức năng giao diện rộng**: storefront gồm danh mục/sản phẩm, giỏ hàng, checkout, showroom, blog, dịch vụ, hỗ trợ, B2B, tài khoản, tuyển dụng và nhiều trang nội dung; admin cũng có CMS, danh mục, kho, đơn, CRM, marketing, analytics, SEO, dealer, support và HR. Dữ liệu CMS và một số luồng cửa hàng đã nối với giao diện khách.

Tuy nhiên, source hiện vẫn chủ yếu là **prototype/demo chạy trong trình duyệt**, chưa đủ cơ sở coi là hệ thống bán hàng production. Rủi ro lớn nhất không nằm ở thiếu màn hình mà ở lớp nền: dữ liệu `localStorage`, đăng nhập demo, thanh toán giả lập, thiếu API server và các số liệu mẫu. Vì vậy, không nên nhập dữ liệu khách hàng thật, bật nhận thanh toán thật hoặc dùng KPI mẫu để ra quyết định.

**Ưu tiên đề xuất:**
1. Xác lập backend, xác thực, phân quyền và lưu dữ liệu an toàn.
2. Hoàn thiện đơn hàng–tồn kho–thanh toán như một luồng server-side có đối soát.
3. Sau đó mới nối Search Console/Analytics vào báo cáo quản trị và vận hành chiến dịch thật.
4. Nâng SEO kỹ thuật, nội dung, kiểm thử, bảo mật và hiệu năng trước phát hành rộng.

## Điểm phù hợp / nền tảng tốt

| Khu vực | Đánh giá | Bằng chứng trong source |
|---|---|---|
| Độ phủ storefront | Tốt cho prototype: có khoảng 57 page component dưới `src/pages/sofa2-pages`, bao quát hành trình mua và nội dung sau bán. | `src/pages/sofa2-pages/` |
| Admin & CMS | Có cấu trúc module theo nhóm, schema form và trạng thái; client đọc một số nội dung đã xuất bản, gồm About, trang nội dung, banner, menu, dịch vụ/ưu đãi. | `src/sections/sofa2-admin/sofa2-admin-data.ts`, `sofa2-cms.ts`, `src/sections/sofa2/sofa2-cms-client.ts` |
| Catalog & vận hành | Có sản phẩm, biến thể, danh mục, giá/tồn demo; có các module đơn hàng, CRM, kho, showroom, dealer và support để làm nền cho backend. | `src/sections/sofa2/sofa2-catalog-client.ts`, `src/sections/sofa2-admin/` |
| SEO on-page | Có trường title/description/canonical/Open Graph/robots/schema, công cụ sitemap/robots/JSON-LD và báo cáo Search Console phía admin theo adapter. | `src/sections/sofa2-admin/sofa2-seo.ts`, `sofa2-seo-head.tsx`, `sofa2-seo-generator.ts`, `view/sofa2-search-console-panel.tsx` |
| Chuyển đổi/CSKH | Có hotline/Zalo, form liên hệ, đặt lịch showroom, dịch vụ, popup campaign và GA4 event hooks có consent. | `src/sections/sofa2/sofa2-engagement-tools.tsx`, `sofa2-analytics.ts`, `src/pages/sofa2-pages/contact.tsx` |
| Minh bạch demo | Nhiều màn admin hiển thị cảnh báo rõ dữ liệu cục bộ, chưa an toàn và không dùng dữ liệu thật. Đây là điểm tốt cần giữ trong giai đoạn prototype. | `src/sections/sofa2-admin/view/sofa2-admin-cms-view.tsx` |

## Chưa phù hợp production / rủi ro cần xử lý

### P0 — Dữ liệu, bảo mật và giao dịch

1. **Toàn bộ state admin quan trọng lưu trên máy khách.** `sofa2-admin-store.ts` khởi tạo các nhóm từ mock data và persist vào `localStorage`; CMS, catalog, đơn, CRM, kho, phân quyền… không phải database dùng chung. Thay đổi không đồng bộ giữa thiết bị/nhân viên, dễ mất dữ liệu khi xóa browser storage, không có backup/transaction/concurrency control.
2. **Đăng nhập và quyền quản trị là demo client-side.** Trang login chỉ ghi nhận sự kiện demo; guard dựa trên session localStorage trong `src/_mock/_sofa2-demo.ts` và `sofa2-admin-access-guard.tsx`. RBAC hiện không bảo vệ API/database vì chưa có API thật. Nút đăng nhập Google/Facebook chưa là OAuth thực.
3. **Checkout chưa thu tiền thật.** `src/pages/sofa2-pages/checkout.tsx` tạo order, tracking và transaction cục bộ rồi chuyển thẳng sang success. `payment.tsx` là trang giới thiệu/phân kỳ trả góp, không phải gateway payment. Không có webhook, idempotency, xử lý hoàn tiền/đối soát hoặc giữ tồn kho nguyên tử.
4. **PII/CV/ticket không phù hợp để nhận dữ liệu thật.** Thông tin checkout, khách hàng, ticket và hồ sơ tuyển dụng có thể nằm trong localStorage/IndexedDB. Chưa có phân quyền server-side, chính sách retention, backup/xóa dữ liệu hoặc kho file bảo mật.
5. **Phân quyền có độ lệch giữa mô hình và guard.** Guard có nhánh staff/permissions nhưng demo session hiện chỉ phân biệt admin/dealer; session được chuyển thành admin hoặc null. Cần chốt ma trận quyền thực trước khi xây RBAC production.

### P1 — Đo lường, SEO và marketing

6. **Google Analytics chưa hoạt động nếu chưa cấu hình.** GA4 chỉ tải khi có `VITE_GA4_MEASUREMENT_ID` và khách đồng ý. Event click gọi/Zalo/popup đã có trong source, nhưng chưa có ID thì không có dữ liệu thu về; cũng chưa có dashboard attribution phía server.
7. **Search Console chưa có backend connector thật.** Admin panel gọi endpoint cấu hình qua `VITE_SEARCH_CONSOLE_API_URL`; repo chưa có API/OAuth proxy hoặc quyền Search Console. Không để service account secret trong `VITE_*`; cần backend được xác thực và cấp quyền trên property.
8. **Sitemap/robots chưa được phục vụ tại root domain.** Bộ sinh tạo nội dung/tệp trong admin, nhưng `public/` chỉ có favicon/logo và Vercel hiện rewrite mọi route về SPA. Chưa thấy `sitemap.xml`/`robots.txt` deployment endpoint thực tế.
9. **SEO metadata áp dụng bằng JavaScript phía client.** `Sofa2SeoHead` cập nhật head sau render; crawler có thể phải render JS, gây trễ/không đồng nhất với SEO server-rendered. Cần prerender/SSR hoặc build-time metadata cho URL có giá trị tìm kiếm.
10. **Popup targeting chỉ nhận diện trình duyệt.** Nhóm “mới/quay lại” và giới hạn lượt dựa localStorage/sessionStorage, không liên kết account, không cross-device và có thể bị xóa/reset. Popup chưa có lịch kiểm thử theo thiết bị/route/consent.
11. **Nội dung/kPI mẫu có thể gây hiểu nhầm.** Một số con số, địa chỉ, cam kết bảo hành, lượt xem, doanh thu và đối tác là demo; phải rà soát trước khi công bố. Không dùng KPI mock làm số liệu kinh doanh.

### P2 — Trải nghiệm, chất lượng và vận hành

12. **Chưa có bộ test tự động cho Sofa2.** `package.json` có build/lint/typecheck nhưng không có script test/unit/integration/e2e. Route trả HTTP 200 chỉ chứng minh SPA fallback, không chứng minh luồng checkout, quyền truy cập hay nội dung hoạt động đúng.
13. **Bundle production có chunk lớn.** Build đã cảnh báo chunk >500 kB; còn chunk lên tới nhiều MB. Tăng thời gian tải trên mobile và có thể làm giảm Core Web Vitals.
14. **Thiếu thông báo/automation backend.** Chưa thấy luồng gửi email/SMS/Zalo OA khi có đơn, lead, lịch showroom hay thay đổi trạng thái; hiện nhiều thao tác mới dừng ở cập nhật local store.
15. **Tích hợp ngoài chưa xác nhận production.** Hotline/Zalo, ảnh từ nguồn ngoài, phương thức payment và địa chỉ showroom phải được thay bằng cấu hình đã xác minh; URL Zalo hiện chỉ là link đi ra, chưa phải Zalo OA API/chat integration.

## Lộ trình thực hiện đề xuất

### Giai đoạn 0 — Chốt yêu cầu và dữ liệu chuẩn (3–5 ngày)

- Xác nhận chủ sở hữu dữ liệu, môi trường hosting, dùng Supabase hay backend hiện hữu, domain canonical, GA4 property, GSC property, tài khoản payment/shipping thực.
- Chốt danh sách trường PII, phân loại dữ liệu, thời hạn lưu, quy trình xin consent và xóa dữ liệu.
- Đối chiếu mock data (sản phẩm, giá, tồn, showroom, bảo hành, ưu đãi, đối tác, marketing claims) với dữ liệu đã được doanh nghiệp duyệt.
- Chốt trạng thái đơn chuẩn: `pending payment → paid/confirmed → picking → shipping → delivered → completed`, cùng cancel/refund.
- **Tiêu chí hoàn tất:** có data dictionary, state diagram, danh sách tích hợp/owner và checklist nội dung thật.

### Giai đoạn 1 — Backend, xác thực, phân quyền (1–2 sprint)

- Chọn database/API; với cấu trúc hiện tại có thể đánh giá Supabase/Postgres + Edge Functions hoặc backend service riêng. Migrations hiện có mới là nền, cần đánh giá coverage trước khi quyết định.
- Chuyển lần lượt CMS, sản phẩm/biến thể, tồn kho, khách hàng, địa chỉ, đơn, ticket và booking khỏi localStorage; tạo repository/service abstraction để giữ component UI ít phụ thuộc.
- Thay demo login bằng auth thực, xác minh email/OTP, reset password, session server, RBAC server-side, audit log. Tách admin/staff/dealer/customer; kiểm tra quyền trên mọi API, không chỉ ẩn nút ở frontend.
- Thêm validation server, rate limiting, CSRF/CORS policy, logging, backup/restore và migration dữ liệu demo có kiểm soát.
- **Tiêu chí hoàn tất:** hai trình duyệt/nhân viên thấy dữ liệu nhất quán; user không đọc/sửa dữ liệu ngoài quyền; dữ liệu phục hồi được từ backup; không dùng PII trong localStorage.

### Giai đoạn 2 — Checkout, thanh toán, tồn kho (1–2 sprint, phụ thuộc GĐ 1)

- Tạo order/payment intent ở server; tính lại giá/khuyến mãi/phí ship/tồn kho server-side, không tin giá từ browser.
- Tích hợp một gateway trước (ví dụ VNPAY/MoMo theo hợp đồng), ký/verify callback, webhook idempotent, cập nhật trạng thái và đối soát; COD là phương thức riêng.
- Giữ/nhả tồn kho theo TTL, xử lý đồng thời nhiều đơn, huỷ đơn, hoàn tiền, hóa đơn và email xác nhận.
- Nối đơn với vận chuyển, tracking, đổi trả/bảo hành; kiểm thử lỗi gateway, gửi lặp callback, thiếu tồn và refresh trang success.
- **Tiêu chí hoàn tất:** đơn không thể được đánh dấu đã thanh toán chỉ bằng client; callback lặp không tạo giao dịch trùng; báo cáo đơn khớp payment provider.

### Giai đoạn 3 — SEO và đo lường thật (1 sprint, song song sau GĐ 1)

- Cấu hình GA4 ID production; QA consent flow, SPA page_view và event `contact_call_click`, `contact_zalo_click`, `promo_popup_view/click/dismiss`; đặt naming/conversion policy và kiểm tra trong DebugView.
- Xây endpoint Search Console server-side, service account/OAuth trong secrets manager, kiểm soát quyền admin, cache/rate limit; nối đúng domain property. Không gửi credentials xuống browser.
- Phục vụ `robots.txt` và sitemap theo route đã xuất bản; loại URL noindex/ẩn, canonical nhất quán; xác minh Search Console sitemap status.
- Prerender/SSR trang chủ, danh mục, sản phẩm, blog, showroom và About; JSON-LD cần trùng với nội dung/giá/tồn thực tế, không đưa rating/availability giả.
- Tạo dashboard phân biệt rõ **GSC clicks/impressions** với **GA4 sessions/events/conversions**; hiển thị nguồn và thời điểm đồng bộ, không fallback sang mock khi API lỗi.
- **Tiêu chí hoàn tất:** đối chiếu số liệu GSC/GA4 với console; không có title/canonical/structured-data trùng/sai ở URL trọng yếu; sitemap được crawler lấy thành công.

### Giai đoạn 4 — Marketing, CRM và tích hợp CSKH (1 sprint)

- Mở rộng popup: lịch bắt đầu/kết thúc, ưu tiên giữa chiến dịch, segment theo nguồn/campaign/consent hoặc customer cohort (sau khi có auth), giới hạn tần suất phía server, A/B test và conversion attribution.
- Nối lead/đơn/booking với CRM server-side; queue gửi email/SMS và Zalo OA qua nhà cung cấp thật, retry/idempotency, opt-out và lịch sử consent.
- Thay link Zalo demo bằng OA đã xác minh; đánh giá Zalo OA API/webhook riêng. Hotline cần tracking redirect hoặc call provider nếu cần số liệu cuộc gọi hoàn tất (click `tel:` chỉ đo ý định gọi).
- Bổ sung quy trình nhân viên: phân công lead, SLA, nhắc việc, trạng thái liên hệ, lý do mất đơn, báo cáo theo nguồn.
- **Tiêu chí hoàn tất:** có thể truy xuất một campaign từ impression → click → lead/order; không gửi marketing tới người đã opt-out.

### Giai đoạn 5 — QA, bảo mật, hiệu năng và phát hành (liên tục; 1 sprint hardening)

- Unit tests cho tính giá/discount/tồn/SEO; API integration tests; E2E Playwright cho tìm sản phẩm → giỏ → checkout → payment, login/customer portal, admin permission, popup, form lead.
- Kiểm thử accessibility WCAG cơ bản, mobile breakpoints, lỗi network/storage, browser refresh/back/duplicate submit.
- Phân tách bundle theo route, lazy-load editor/chart/map, tối ưu ảnh responsive/AVIF/WebP, kiểm tra Core Web Vitals.
- Thêm Sentry/monitoring, logs không chứa PII, alert payment/API, CI test/build, rollback và playbook sự cố.
- **Tiêu chí phát hành:** không còn dữ liệu demo ở môi trường production; E2E các luồng P0 đạt; có backup/rollback, cảnh báo và người phụ trách vận hành.

## Thứ tự ưu tiên thực tế

| Ưu tiên | Hạng mục | Lý do |
|---|---|---|
| P0 | Backend + auth/RBAC + data model | Nếu chưa có, admin và store không an toàn/không dùng chung; mọi tích hợp tiếp theo chỉ là demo. |
| P0 | Order/payment/inventory server-side | Ngăn đơn/tiền/tồn kho sai và giao dịch trùng. |
| P1 | GA4 consent + GSC proxy + dashboard thật | Đo nguồn truy cập và hiệu quả sau khi event/data source đã đúng. GA4 client event hooks và Search Console UI đã có nền; cần env/service backend. |
| P1 | Sitemap/robots phục vụ thật + prerender/SSR SEO | Tăng khả năng index và giảm phụ thuộc crawler render JavaScript. |
| P1 | CRM/notifications/Zalo OA | Không bỏ sót lead và giúp đo chuyển đổi từ click sang liên hệ/đơn. |
| P2 | Content/media workflow, accessibility, performance, tests | Tăng chất lượng, tốc độ và an toàn vận hành sau khi luồng lõi ổn định. |

## Quyết định cần có trước khi bắt đầu

1. Môi trường deploy và backend chuẩn (Supabase hay API service khác).
2. Nhà cung cấp/payment gateway và vận chuyển sẽ dùng thật.
3. Ai sở hữu GA4/GSC, Search Console property nào, ai cấp quyền service account/OAuth.
4. Hotline/Zalo OA chính thức, chính sách cookie/analytics/marketing, người phê duyệt nội dung.
5. Danh sách dữ liệu demo được phép giữ; quy trình nạp dữ liệu thật và chuyển môi trường.
