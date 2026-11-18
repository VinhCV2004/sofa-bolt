import { m } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { varAlpha, textGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';

const lines = (value: unknown) => String(value ?? '').split('\n').map((line) => line.trim()).filter(Boolean);

export default function Page() {
  const theme = useTheme();
  const { rows } = useSofa2AdminRows('cms', 'showrooms');
  const showrooms = useMemo(() => rows
    .filter((row) => String(row.status) === 'Đã xuất bản')
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)), [rows]);
  const [selectedId, setSelectedId] = useState('');
  const selected = showrooms.find((row) => String(row.id) === selectedId) ?? showrooms[0];
  const mapSrc = selected
    ? `https://maps.google.com/maps?q=${Number(selected.lat)},${Number(selected.lng)}&z=14&output=embed`
    : '';

  return (
    <>
      <Helmet>
        <title>Showroom - LUXE Sofa</title>
        <meta name="description" content="Tìm showroom LUXE Sofa, xem địa chỉ, giờ mở cửa, bản đồ và đặt lịch tham quan hoặc tư vấn." />
      </Helmet>

      <Sofa2PageHero
        overline="Showroom"
        title={(
          <>
            Hệ thống
            <Box component="span" sx={{ ...textGradient(`135deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}`) }}>
              {' '}showroom toàn quốc
            </Box>
          </>
        )}
        subtitle={`Trải nghiệm trực tiếp chất lượng sofa LUXE tại ${showrooms.length} showroom. Đặt lịch tham quan hoặc tư vấn miễn phí ngay hôm nay.`}
        image={String(showrooms[0]?.image || SOFA2_PAGE_IMAGES.showroom1)}
      />

      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container component={MotionViewport}>
          <Stack spacing={2} sx={{ mb: 5, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>Danh sách showroom</Typography>
            <Typography variant="h3">
              Ghé thăm không gian
              <Box component="span" sx={{ ...textGradient(`135deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.warning.main}`) }}> trải nghiệm LUXE</Box>
            </Typography>
          </Stack>
          <Grid container spacing={4}>
            {showrooms.map((showroom) => (
              <Grid key={showroom.id} xs={12} sm={6} md={3}>
                <Stack
                  component={m.div}
                  variants={varFade({ distance: 24 }).inUp}
                  sx={{ height: 1, borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}
                >
                  <Box component="img" src={String(showroom.image || SOFA2_PAGE_IMAGES.showroom1)} alt={String(showroom.name)} sx={{ width: 1, aspectRatio: '4/3', objectFit: 'cover' }} />
                  <Stack spacing={1.5} sx={{ p: 3, flexGrow: 1 }}>
                    <Typography variant="h6">{showroom.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <Iconify icon="solar:map-point-bold-duotone" width={18} sx={{ color: 'primary.main', mt: 0.25 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{showroom.address}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Iconify icon="solar:phone-bold-duotone" width={18} sx={{ color: 'primary.main' }} />
                      <Typography component="a" href={`tel:${showroom.phone}`} variant="body2" sx={{ color: 'text.secondary', textDecoration: 'none' }}>{showroom.phone}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Iconify icon="solar:clock-circle-bold-duotone" width={18} sx={{ color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{showroom.hours}</Typography>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button component={RouterLink} href={`/sofa2/showrooms/${showroom.id}`} variant="outlined" size="small" startIcon={<Iconify icon="solar:eye-bold-duotone" />} sx={{ mt: 1 }}>
                      Xem chi tiết
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
          {!showrooms.length && <Typography sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>Hiện chưa có showroom đang hoạt động.</Typography>}
        </Container>
      </Box>

      <Box id="ban-do" component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.04) }}>
        <Container component={MotionViewport}>
          <Stack spacing={2} sx={{ mb: 5, textAlign: 'center', maxWidth: 640, mx: 'auto' }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>Bản đồ showroom</Typography>
            <Typography variant="h3">Tìm showroom gần bạn nhất</Typography>
            <Typography sx={{ color: 'text.secondary' }}>Chọn một địa điểm để xem bản đồ, thông tin mở cửa và hướng dẫn đường đi.</Typography>
          </Stack>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Stack spacing={1.5}>
                {showrooms.map((showroom) => (
                  <Button
                    key={showroom.id}
                    onClick={() => setSelectedId(String(showroom.id))}
                    variant={String(selected?.id) === String(showroom.id) ? 'contained' : 'outlined'}
                    color={String(selected?.id) === String(showroom.id) ? 'primary' : 'inherit'}
                    sx={{ p: 2, justifyContent: 'flex-start', textAlign: 'left' }}
                    startIcon={<Iconify icon="solar:map-point-bold-duotone" />}
                  >
                    <Box>
                      <Typography variant="subtitle2">{showroom.name}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.75 }}>{showroom.city} · {showroom.hours}</Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </Grid>
            <Grid xs={12} md={8}>
              {selected ? (
                <Stack spacing={2}>
                  <Box component="iframe" title={`Bản đồ ${selected.name}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" sx={{ width: 1, height: { xs: 320, md: 420 }, border: 0, borderRadius: 2, bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.12) }} />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">{selected.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{selected.address}</Typography>
                    </Stack>
                    <Button component="a" href={String(selected.directionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`)} target="_blank" rel="noreferrer" variant="outlined" startIcon={<Iconify icon="solar:route-bold-duotone" />}>
                      Chỉ đường
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Box sx={{ height: 360, display: 'grid', placeItems: 'center', borderRadius: 2, bgcolor: 'background.neutral' }}>Chưa có dữ liệu bản đồ.</Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {selected && (
        <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid xs={12} md={7}>
                <Stack spacing={2}>
                  <Typography variant="overline" sx={{ color: 'text.disabled' }}>Lịch mở cửa</Typography>
                  <Typography variant="h3">Lên kế hoạch ghé {selected.city}</Typography>
                  {lines(selected.openingHours).map((line) => {
                    const [day, hours] = line.split('|');
                    return <Stack key={line} direction="row" justifyContent="space-between" sx={{ py: 1.25, borderBottom: 1, borderColor: 'divider' }}><Typography variant="body2">{day}</Typography><Typography variant="body2" sx={{ fontWeight: 'fontWeightMedium' }}>{hours}</Typography></Stack>;
                  })}
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{selected.holidayHours}</Typography>
                </Stack>
              </Grid>
              <Grid xs={12} md={5}>
                <Stack spacing={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  <Typography variant="h5">Đặt lịch trước</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chọn giờ phù hợp để đội ngũ chuẩn bị khu vực trải nghiệm và tư vấn riêng cho bạn.</Typography>
                  <Button component={RouterLink} href={`/sofa2/showrooms/visit?showroom=${selected.id}`} variant="contained" startIcon={<Iconify icon="solar:calendar-bold-duotone" />} disabled={String(selected.bookingEnabled) !== 'Có'}>Đặt lịch tham quan</Button>
                  <Button component={RouterLink} href={`/sofa2/showrooms/consult?showroom=${selected.id}`} variant="outlined" startIcon={<Iconify icon="solar:chat-square-bold-duotone" />} disabled={String(selected.bookingEnabled) !== 'Có'}>Đặt lịch tư vấn</Button>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'primary.darker', color: 'common.white' }}>
        <Container>
          <Stack component={MotionViewport} spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
            <Typography variant="h3">Sẵn sàng trải nghiệm sofa LUXE?</Typography>
            <Typography sx={{ color: 'grey.400', maxWidth: 620 }}>Đặt lịch trước để được tư vấn riêng và dành thời gian trải nghiệm các chất liệu yêu thích.</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={RouterLink} href="/sofa2/showrooms/visit" size="large" variant="contained" color="warning" startIcon={<Iconify icon="solar:calendar-bold-duotone" />}>Đặt lịch tham quan</Button>
              <Button component={RouterLink} href="/sofa2/showrooms/consult" size="large" variant="outlined" color="inherit" startIcon={<Iconify icon="solar:chat-square-bold-duotone" />}>Đặt lịch tư vấn</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
