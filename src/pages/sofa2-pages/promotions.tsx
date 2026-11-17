import { useState } from 'react';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { varAlpha, textGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import { Sofa2Section, Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';

// ----------------------------------------------------------------------

const metadata = { title: 'Dịch vụ hậu mãi - LUXE Sofa' };

const promotionDate = (value: unknown) => {
  const text = String(value ?? '').trim();
  if (!text) return null;
  const date = new Date(`${text.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function Page() {
  const theme = useTheme();
  const { rows: serviceRows } = useSofa2AdminRows('cms', 'promotion-services');
  const { rows: campaignRows } = useSofa2AdminRows('cms', 'promotions');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) setSubscribed(true);
  };
  const services = serviceRows
    .filter((row) => String(row.status ?? '') === 'Đã xuất bản')
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeCampaigns = campaignRows
    .filter((row) => {
      if (String(row.status ?? '') !== 'Đang chạy') return false;
      const starts = promotionDate(row.startAt);
      const ends = promotionDate(row.endAt);
      const remaining = Number(row.stockLimit ?? 0) - Number(row.usedCount ?? 0);
      return (!starts || starts <= today) && (!ends || ends >= today) && (Number(row.stockLimit ?? 0) <= 0 || remaining > 0);
    })
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  const formatDate = (value: unknown) => {
    const date = promotionDate(value);
    return date ? new Intl.DateTimeFormat('vi-VN').format(date) : '';
  };
  const formatVnd = (value: unknown) => `${Number(value ?? 0).toLocaleString('vi-VN')}đ`;

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <Sofa2PageHero
        overline="Dịch vụ hậu mãi"
        title="Dịch Vụ Hậu Mãi"
        subtitle="Bảo hành, bảo trì, sửa chữa, vệ sinh và đổi trả — chăm sóc sofa trọn đời cùng LUXE Sofa."
        image={SOFA2_PAGE_IMAGES.service4}
      />

      {/* Service cards */}
      <Sofa2Section>
        <Stack spacing={2} sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>Dịch vụ</Typography>
          <Typography variant="h2">
            Năm dịch vụ
            <Box component="span" sx={{ ...textGradient(`135deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.warning.main}`) }}> hậu mãi</Box>
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid key={service.slug} xs={12} sm={6} md={4}>
              <Stack
                component={m.div}
                variants={varFade({ distance: 24 }).inUp}
                spacing={2}
                sx={{ p: 4, height: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card, transition: (t) => t.transitions.create(['transform'], { duration: 300 }), '&:hover': { transform: 'translateY(-6px)' } }}
              >
                <Box sx={{ width: 56, height: 56, display: 'flex', borderRadius: 1.5, alignItems: 'center', justifyContent: 'center', bgcolor: (t) => varAlpha(t.vars.palette.primary.mainChannel, 0.08), color: 'primary.main' }}>
                  <Iconify icon={String(service.icon || 'solar:star-bold-duotone')} width={28} />
                </Box>
                <Typography variant="h6">{service.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>{service.description}</Typography>
                <Button component={RouterLink} href={`/sofa2/promotions/${service.slug}`} size="small" endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
                  Xem chi tiết
                </Button>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Sofa2Section>

      {/* Campaigns are managed by the admin Promotions module */}
      {activeCampaigns.length > 0 && (
        <Sofa2Section bg="grey">
          <Stack spacing={2} sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>Ưu đãi đang áp dụng</Typography>
            <Typography variant="h2">Chương trình khuyến mãi</Typography>
            <Typography sx={{ color: 'text.secondary' }}>Ưu đãi giả lập được đồng bộ từ CMS; điều kiện và thời hạn được quản lý trong từng chiến dịch.</Typography>
          </Stack>
          <Grid container spacing={3}>
            {activeCampaigns.map((campaign) => (
              <Grid key={String(campaign.id ?? campaign.code)} xs={12} sm={6} md={4}>
                <Stack spacing={2} sx={{ height: 1, p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                    <Typography variant="overline" color="primary.main">{String(campaign.offerText ?? 'Ưu đãi')}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Mã: {String(campaign.code ?? '')}</Typography>
                  </Stack>
                  <Typography variant="h5">{String(campaign.headline ?? campaign.title ?? '')}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>{String(campaign.description ?? '')}</Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Áp dụng: {String(campaign.scope ?? '')}</Typography>
                    {Number(campaign.minOrder ?? 0) > 0 && <Typography variant="caption" sx={{ color: 'text.secondary' }}>Đơn tối thiểu {formatVnd(campaign.minOrder)}</Typography>}
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Thời hạn: {formatDate(campaign.startAt)} – {formatDate(campaign.endAt)}</Typography>
                  </Stack>
                  <Button component={RouterLink} href={String(campaign.ctaLink || '/sofa2/promotions')} variant="outlined" endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
                    {String(campaign.ctaLabel || 'Xem ưu đãi')}
                  </Button>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Sofa2Section>
      )}

      {/* Newsletter */}
      <Sofa2Section>
        <Stack component={MotionViewport} spacing={3} alignItems="center" sx={{ textAlign: 'center', maxWidth: 560, mx: 'auto' }}>
          <Iconify icon="solar:letter-bold-duotone" width={48} sx={{ color: 'primary.main' }} />
          <Typography variant="h3">Đăng ký nhận khuyến mãi</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Nhận thông tin ưu đãi sớm nhất gửi ngay đến hộp thư của bạn.</Typography>
          {subscribed ? (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 2, borderRadius: 1.5, bgcolor: (t) => varAlpha(t.vars.palette.success.mainChannel, 0.08), color: 'success.main' }}>
              <Iconify icon="eva:checkmark-circle-2-fill" width={24} />
              <Typography>Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi ưu đãi sớm nhất.</Typography>
            </Stack>
          ) : (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: 1 }}>
              <TextField fullWidth label="Email của bạn" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button variant="contained" size="large" onClick={handleSubscribe} startIcon={<Iconify icon="solar:letter-bold-duotone" />}>Đăng ký</Button>
            </Stack>
          )}
        </Stack>
      </Sofa2Section>
    </>
  );
}
