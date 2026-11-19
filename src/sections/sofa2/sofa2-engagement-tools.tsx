import { useLocation } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { isSofa2SupportHref } from 'src/sections/sofa2-admin/sofa2-support';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import {
  initializeSofa2Analytics,
  getSofa2AnalyticsConsent,
  trackSofa2AnalyticsEvent,
  saveSofa2AnalyticsConsent,
  isSofa2AnalyticsConfigured,
} from 'src/sections/sofa2/sofa2-analytics';

const POPUP_DELAY_MS = 6500;
const POPUP_COOLDOWN_DAYS = 7;
const POPUP_STORAGE_PREFIX = 'sofa2-promo-popup-seen:';
const VISITOR_FIRST_SEEN_KEY = 'sofa2-visitor-first-seen';
type VisitorSegment = 'new' | 'returning';

const readVisitorSegment = (): VisitorSegment => {
  if (typeof window === 'undefined') return 'new';
  try {
    return window.localStorage.getItem(VISITOR_FIRST_SEEN_KEY) ? 'returning' : 'new';
  } catch {
    return 'new';
  }
};

const rememberVisitor = () => {
  if (typeof window === 'undefined') return;
  try {
    if (!window.localStorage.getItem(VISITOR_FIRST_SEEN_KEY)) {
      window.localStorage.setItem(VISITOR_FIRST_SEEN_KEY, String(Date.now()));
    }
  } catch {
    // Targeting falls back to the new-visitor segment when browser storage is unavailable.
  }
};

const matchesPopupAudience = (campaign: Record<string, string | number>, segment: VisitorSegment) => {
  const audience = String(campaign.popupAudience ?? 'Tất cả');
  return audience === 'Tất cả' || (audience === 'Khách mới' && segment === 'new')
    || (audience === 'Khách quay lại' && segment === 'returning');
};

const matchesPopupPath = (campaign: Record<string, string | number>, pathname: string) => {
  const configured = String(campaign.popupPaths ?? '').split(/\r?\n/).map((path) => path.trim()).filter(Boolean);
  if (!configured.length) return true;
  return configured.some((pattern) => {
    if (pattern.endsWith('*')) return pathname.startsWith(pattern.slice(0, -1));
    return pathname === pattern.replace(/\/$/, '');
  });
};

const popupCooldownMs = (campaign: Record<string, string | number>) => {
  const frequency = String(campaign.popupFrequency ?? '7 ngày');
  if (frequency === '1 ngày') return 24 * 60 * 60 * 1000;
  if (frequency === '30 ngày') return 30 * 24 * 60 * 60 * 1000;
  return POPUP_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
};

const isZaloHref = (value: unknown) => {
  const href = String(value ?? '').trim();
  if (!isSofa2SupportHref(href)) return false;
  try {
    const host = new URL(href).hostname.toLowerCase();
    return host === 'zalo.me' || host.endsWith('.zalo.me') || host === 'oa.zalo.me';
  } catch {
    return false;
  }
};

const isPortalEnabled = (value: unknown) => ['có', 'true', 'yes', '1'].includes(String(value ?? '').trim().toLowerCase());

const isCampaignCurrent = (row: Record<string, string | number>) => {
  if (row.status !== 'Đang chạy' || !isPortalEnabled(row.popupEnabled)) return false;
  const now = new Date();
  const startsAt = String(row.startAt ?? '');
  const endsAt = String(row.endAt ?? '');
  const start = startsAt ? new Date(`${startsAt.slice(0, 10)}T00:00:00`) : null;
  const end = endsAt ? new Date(`${endsAt.slice(0, 10)}T23:59:59.999`) : null;
  if (start && !Number.isNaN(start.getTime()) && start > now) return false;
  if (end && !Number.isNaN(end.getTime()) && end < now) return false;
  return true;
};

const getPopupImpressions = (campaign: Record<string, string | number>) => {
  if (typeof window === 'undefined') return [];
  const campaignId = String(campaign.id ?? campaign.code ?? campaign.title ?? '');
  const storageKey = `${POPUP_STORAGE_PREFIX}${campaignId}`;
  const sessionOnly = String(campaign.popupFrequency ?? '') === 'Mỗi phiên';
  const storage = sessionOnly ? window.sessionStorage : window.localStorage;
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(Number).filter(Number.isFinite);
    const legacyTimestamp = Number(raw);
    return Number.isFinite(legacyTimestamp) && legacyTimestamp > 0 ? [legacyTimestamp] : [];
  } catch {
    return [];
  }
};

const wasRecentlySeen = (campaign: Record<string, string | number>) => {
  if (typeof window === 'undefined') return true;
  const sessionOnly = String(campaign.popupFrequency ?? '') === 'Mỗi phiên';
  const cooldown = sessionOnly ? Number.POSITIVE_INFINITY : popupCooldownMs(campaign);
  const recentImpressions = getPopupImpressions(campaign).filter((timestamp) => Date.now() - timestamp < cooldown);
  const maxViews = Math.min(10, Math.max(1, Number(campaign.popupMaxViews ?? 1)));
  return recentImpressions.length >= maxViews;
};

const rememberPopupImpression = (campaign: Record<string, string | number>) => {
  if (typeof window === 'undefined') return;
  const campaignId = String(campaign.id ?? campaign.code ?? campaign.title ?? '');
  const storageKey = `${POPUP_STORAGE_PREFIX}${campaignId}`;
  const sessionOnly = String(campaign.popupFrequency ?? '') === 'Mỗi phiên';
  const storage = sessionOnly ? window.sessionStorage : window.localStorage;
  try {
    const cooldown = sessionOnly ? Number.POSITIVE_INFINITY : popupCooldownMs(campaign);
    const nextImpressions = getPopupImpressions(campaign)
      .filter((timestamp) => Date.now() - timestamp < cooldown);
    nextImpressions.push(Date.now());
    storage.setItem(storageKey, JSON.stringify(nextImpressions));
  } catch {
    // The popup still works if browser storage is unavailable.
  }
};

/** Cross-page call/Zalo actions and a frequency-capped campaign popup for the Sofa2 storefront. */
export function Sofa2EngagementTools({ enabled }: { enabled: boolean }) {
  const { pathname } = useLocation();
  const { rows: channels } = useSofa2AdminRows('support', 'channels');
  const { rows: socials } = useSofa2AdminRows('support', 'contact-socials');
  const { rows: campaigns } = useSofa2AdminRows('cms', 'promotions');
  const [open, setOpen] = useState(false);
  const [visitorSegment] = useState(readVisitorSegment);
  const [analyticsConsent, setAnalyticsConsent] = useState(getSofa2AnalyticsConsent);

  useEffect(() => {
    rememberVisitor();
  }, []);

  useEffect(() => {
    if (analyticsConsent === 'granted') initializeSofa2Analytics();
  }, [analyticsConsent]);

  useEffect(() => {
    if (analyticsConsent === 'granted' && initializeSofa2Analytics()) {
      trackSofa2AnalyticsEvent('page_view', { page_path: pathname, page_title: document.title });
    }
  }, [analyticsConsent, pathname]);

  const eligible = enabled && pathname.startsWith('/sofa2') && !pathname.startsWith('/sofa2/admin')
    && !['/sofa2/cart', '/sofa2/checkout', '/sofa2/payment'].includes(pathname);
  const showConsentPrompt = eligible && isSofa2AnalyticsConfigured() && !analyticsConsent;
  const chooseAnalyticsConsent = (consent: 'granted' | 'denied') => {
    saveSofa2AnalyticsConsent(consent);
    setAnalyticsConsent(consent);
  };

  const phone = channels.find((row) => row.status === 'Đang bật'
    && /^tel:/i.test(String(row.href ?? '').trim())
    && isSofa2SupportHref(row.href));
  const zalo = socials.find((row) => row.status === 'Đang hiển thị' && isZaloHref(row.href));

  const popupCampaign = useMemo(() => campaigns
    .filter((row) => isCampaignCurrent(row)
      && matchesPopupAudience(row, visitorSegment)
      && matchesPopupPath(row, pathname))
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
    .find((row) => !wasRecentlySeen(row)), [campaigns, pathname, visitorSegment]);

  const campaignId = String(popupCampaign?.id ?? popupCampaign?.code ?? popupCampaign?.title ?? '');
  const popupDelay = Math.min(120, Math.max(0, Number(popupCampaign?.popupDelay ?? POPUP_DELAY_MS / 1000))) * 1000;

  useEffect(() => {
    setOpen(false);
    if (!eligible || !popupCampaign || !campaignId) return undefined;
    const timer = window.setTimeout(() => {
      setOpen(true);
      rememberPopupImpression(popupCampaign);
      trackSofa2AnalyticsEvent('promo_popup_view', { campaign_id: campaignId, page_path: pathname });
    }, popupDelay);
    return () => window.clearTimeout(timer);
  }, [campaignId, eligible, pathname, popupCampaign, popupDelay]);

  const dismissPopup = () => {
    if (popupCampaign && open) {
      trackSofa2AnalyticsEvent('promo_popup_dismiss', { campaign_id: campaignId, page_path: pathname });
    }
    setOpen(false);
  };

  if (!eligible) return null;

  return (
    <>
      {showConsentPrompt && (
        <Paper role="dialog" aria-label="Cài đặt phân tích truy cập" sx={{ position: 'fixed', zIndex: (theme) => theme.zIndex.snackbar, left: { xs: 2, sm: 3 }, bottom: { xs: 2, sm: 3 }, width: { xs: 'calc(100vw - 112px)', sm: 360 }, p: 2, border: 1, borderColor: 'divider' }}>
          <Stack spacing={1.25}>
            <Typography variant="subtitle2">Cho phép đo lường truy cập?</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Google Analytics sẽ ghi nhận lượt xem trang và thao tác chuyển đổi khi bạn đồng ý. Không gửi thông tin cá nhân.
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" color="inherit" onClick={() => chooseAnalyticsConsent('denied')}>Từ chối</Button>
              <Button size="small" variant="contained" onClick={() => chooseAnalyticsConsent('granted')}>Đồng ý</Button>
            </Stack>
          </Stack>
        </Paper>
      )}
      <Stack spacing={1.5} sx={{ position: 'fixed', zIndex: (theme) => theme.zIndex.speedDial, right: { xs: 2, sm: 3 }, bottom: { xs: 2, sm: 3 } }}>
        {phone && (
          <Tooltip title={`Gọi ${String(phone.value ?? phone.title ?? 'tư vấn')}`} placement="left">
            <Fab
              component="a"
              href={String(phone.href)}
              color="success"
              aria-label="Gọi tư vấn LUXE Sofa"
              onClick={() => trackSofa2AnalyticsEvent('contact_call_click', { page_path: pathname, channel: String(phone.title ?? 'hotline') })}
            >
              <Iconify icon="solar:phone-calling-bold-duotone" width={26} />
            </Fab>
          </Tooltip>
        )}
        {zalo && (
          <Tooltip title="Nhắn tin qua Zalo" placement="left">
            <Fab
              component="a"
              href={String(zalo.href)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat với LUXE Sofa trên Zalo"
              onClick={() => trackSofa2AnalyticsEvent('contact_zalo_click', { page_path: pathname, channel: String(zalo.title ?? 'zalo') })}
              sx={{ bgcolor: '#0068ff', color: 'common.white', '&:hover': { bgcolor: '#0057d9' } }}
            >
              <Iconify icon="solar:chat-round-dots-bold-duotone" width={26} />
            </Fab>
          </Tooltip>
        )}
      </Stack>

      <Dialog open={open} onClose={dismissPopup} fullWidth maxWidth="sm" aria-labelledby="sofa2-promo-title">
        <Box sx={{ position: 'relative' }}>
          {!!popupCampaign?.image && (
            <Box component="img" src={String(popupCampaign.image)} alt="" sx={{ display: 'block', width: 1, maxHeight: 300, objectFit: 'cover' }} />
          )}
          <IconButton onClick={dismissPopup} aria-label="Đóng ưu đãi" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' } }}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Box>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="overline" color="primary.main">Ưu đãi dành cho bạn · {String(popupCampaign?.offerText ?? 'Có thời hạn')}</Typography>
          <Typography id="sofa2-promo-title" variant="h4" sx={{ mt: 1 }}>{String(popupCampaign?.headline ?? popupCampaign?.title ?? 'Ưu đãi mới')}</Typography>
          <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>{String(popupCampaign?.description ?? '')}</Typography>
          {!!popupCampaign?.terms && <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary', whiteSpace: 'pre-line' }}>{String(popupCampaign.terms)}</Typography>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={dismissPopup} color="inherit">Để sau</Button>
          <Button
            component={RouterLink}
            href={String(popupCampaign?.ctaLink || '/sofa2/promotions')}
            variant="contained"
            onClick={() => {
              trackSofa2AnalyticsEvent('promo_popup_click', { campaign_id: campaignId, page_path: pathname });
              dismissPopup();
            }}
          >
            {String(popupCampaign?.ctaLabel || 'Xem ưu đãi')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
