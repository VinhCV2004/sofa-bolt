# Sofa2 analytics and conversion integrations

## Google Analytics 4

Set `VITE_GA4_MEASUREMENT_ID=G-...` in the deployment environment. The Sofa2 storefront shows an analytics-consent choice and does not load `gtag.js` before consent is granted. Declining stores the decision locally and keeps Analytics disabled. Ad storage, ad user data, and ad personalization remain denied.

The storefront sends GA4 events for page views, `contact_call_click`, `contact_zalo_click`, `promo_popup_view`, `promo_popup_click`, and `promo_popup_dismiss`. Event parameters contain page paths and campaign/channel identifiers only; no phone number, email, or form contents are sent. Events are sent only when a valid measurement ID exists and the visitor has granted analytics consent.

## Google Search Console reports

The admin SEO page can display live 28-day clicks, impressions, CTR, average position, and top pages from the endpoint configured in `VITE_SEARCH_CONSOLE_API_URL` (default: `/api/seo/search-console`). This repository is a Vite SPA and does not include a server endpoint or Google credentials. Implement the endpoint in the deployment's server/serverless layer and protect it with the application's admin authentication.

The endpoint must:

1. Keep Google service-account credentials or OAuth refresh tokens in server-side secrets, never in `VITE_*` variables or browser storage.
2. Query Search Console Search Analytics for the verified `https://luxesofa.vn/` property. Grant that service account access to the property in Search Console.
3. Return JSON shaped like:

```json
{
  "source": "google-search-console",
  "rangeDays": 28,
  "fetchedAt": "2026-11-15T00:00:00Z",
  "totals": { "clicks": 120, "impressions": 3400, "ctr": 0.0353, "position": 8.4 },
  "topPages": [
    { "page": "https://luxesofa.vn/sofa2/products/1", "clicks": 40, "impressions": 900, "ctr": 0.0444, "position": 5.2 }
  ]
}
```

Google data is delayed; use the latest complete date range available and return HTTP errors rather than fabricated metrics. The admin panel displays a configuration message when the endpoint is absent, and distinguishes fetch/shape errors from live data.

## Promotion popup targeting

Edit CMS → Khuyến mãi. A campaign must be active, within its start/end dates, and have **Hiển thị popup** enabled. Configure a delay, frequency window, maximum views, audience (`Tất cả`, `Khách mới`, `Khách quay lại`) and eligible paths (one path per line; trailing `*` is a prefix wildcard). Frequency counts are stored in first-party browser storage and are per browser, not cross-device identity. The seeded campaign is demo content; verify its offer and destination before publishing.
