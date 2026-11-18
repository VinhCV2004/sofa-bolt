import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';

const lines = (value: unknown) => String(value ?? '').split('\n').map((line) => line.trim()).filter(Boolean);

export default function Page() {
  const { id = '' } = useParams();
  const { rows } = useSofa2AdminRows('cms', 'showrooms');
  const showroom = rows.find((row) =>
    (String(row.id) === id || String(row.slug) === id) && String(row.status) === 'Đã xuất bản'
  );
  const gallery = lines(showroom?.gallery);
  const amenities = lines(showroom?.amenities);
  const services = lines(showroom?.services);
  const mapSrc = showroom ? `https://maps.google.com/maps?q=${Number(showroom.lat)},${Number(showroom.lng)}&z=15&output=embed` : '';
  const indexable = !['không', 'false', '0'].includes(String(showroom?.indexable ?? 'Có').toLocaleLowerCase());

  if (!showroom) {
    return (
      <>
        <Helmet><title>Không tìm thấy showroom - LUXE Sofa</title><meta name="robots" content="noindex, nofollow" /></Helmet>
        <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', py: 20 }}>
          <Iconify icon="solar:map-point-cross-bold-duotone" width={72} sx={{ color: 'text.disabled' }} />
          <Typography variant="h4">Không tìm thấy showroom</Typography>
          <Button component={RouterLink} href="/sofa2/showrooms" variant="contained">Quay lại danh sách</Button>
        </Stack>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{showroom.metaTitle || `${showroom.name} - LUXE Sofa`}</title>
        <meta name="description" content={String(showroom.metaDescription || showroom.description)} />
        <meta name="robots" content={indexable ? 'index, follow' : 'noindex, nofollow'} />
        <meta property="og:image" content={String(showroom.ogImage || showroom.image)} />
      </Helmet>

      <Sofa2PageHero overline={`Showroom · ${showroom.city}`} title={String(showroom.name)} subtitle={String(showroom.description)} image={String(showroom.image || SOFA2_PAGE_IMAGES.showroom1)} />

      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container component={MotionViewport}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="flex-start">
            <Grid xs={12} md={6}>
              <Box component={m.img} variants={varFade({ distance: 24 }).inLeft} src={String(showroom.image || SOFA2_PAGE_IMAGES.showroom1)} alt={String(showroom.name)} sx={{ width: 1, borderRadius: 2, aspectRatio: '4/3', objectFit: 'cover' }} />
            </Grid>
            <Grid xs={12} md={6}>
              <Stack spacing={3} component={m.div} variants={varFade({ distance: 24 }).inRight}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>Thông tin showroom</Typography>
                <Typography variant="h2">{showroom.name}</Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{showroom.description}</Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Iconify icon="solar:map-point-bold-duotone" width={22} sx={{ color: 'primary.main', mt: 0.25 }} />
                    <Box><Typography variant="caption" sx={{ color: 'text.disabled' }}>Địa chỉ</Typography><Typography>{showroom.address}</Typography></Box>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Iconify icon="solar:phone-bold-duotone" width={22} sx={{ color: 'primary.main' }} />
                    <Box><Typography variant="caption" sx={{ color: 'text.disabled' }}>Điện thoại</Typography><Typography component="a" href={`tel:${showroom.phone}`} sx={{ color: 'text.primary', textDecoration: 'none' }}>{showroom.phone}</Typography></Box>
                  </Stack>
                  {showroom.email && <Stack direction="row" spacing={1.5} alignItems="center"><Iconify icon="solar:letter-bold-duotone" width={22} sx={{ color: 'primary.main' }} /><Box><Typography variant="caption" sx={{ color: 'text.disabled' }}>Email</Typography><Typography component="a" href={`mailto:${showroom.email}`} sx={{ color: 'text.primary', textDecoration: 'none' }}>{showroom.email}</Typography></Box></Stack>}
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Iconify icon="solar:clock-circle-bold-duotone" width={22} sx={{ color: 'primary.main' }} />
                    <Box><Typography variant="caption" sx={{ color: 'text.disabled' }}>Giờ mở cửa</Typography><Typography>{showroom.hours}</Typography></Box>
                  </Stack>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                  <Button component={RouterLink} href={`/sofa2/showrooms/visit?showroom=${showroom.id}`} variant="contained" size="large" startIcon={<Iconify icon="solar:calendar-bold-duotone" />} disabled={String(showroom.bookingEnabled) !== 'Có'}>Đặt lịch tham quan</Button>
                  <Button component={RouterLink} href={`/sofa2/showrooms/consult?showroom=${showroom.id}`} variant="outlined" size="large" startIcon={<Iconify icon="solar:chat-square-bold-duotone" />} disabled={String(showroom.bookingEnabled) !== 'Có'}>Đặt lịch tư vấn</Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.04) }}>
        <Container>
          <Grid container spacing={{ xs: 5, md: 8 }}>
            <Grid xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>Lịch mở cửa</Typography>
                <Typography variant="h3">Thời gian đón khách</Typography>
                {lines(showroom.openingHours).map((line) => {
                  const [day, hours] = line.split('|');
                  return <Stack key={line} direction="row" justifyContent="space-between" spacing={2} sx={{ py: 1.25, borderBottom: 1, borderColor: 'divider' }}><Typography variant="body2">{day}</Typography><Typography variant="body2" sx={{ fontWeight: 'fontWeightMedium', textAlign: 'right' }}>{hours}</Typography></Stack>;
                })}
                {!!showroom.holidayHours && <Typography variant="body2" sx={{ color: 'text.secondary' }}>{showroom.holidayHours}</Typography>}
                {!!showroom.parking && <Box sx={{ mt: 2, p: 2, borderRadius: 1.5, bgcolor: 'background.paper' }}><Typography variant="subtitle2">Gửi xe</Typography><Typography variant="body2" sx={{ color: 'text.secondary' }}>{showroom.parking}</Typography></Box>}
              </Stack>
            </Grid>
            <Grid xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>Vị trí</Typography>
                <Typography variant="h3">Bản đồ đến showroom</Typography>
                <Box component="iframe" title={`Bản đồ ${showroom.name}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" sx={{ width: 1, height: 360, border: 0, borderRadius: 2, bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.12) }} />
                <Button component="a" href={String(showroom.directionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${showroom.lat},${showroom.lng}`)} target="_blank" rel="noreferrer" variant="outlined" startIcon={<Iconify icon="solar:route-bold-duotone" />} sx={{ alignSelf: 'flex-start' }}>Mở chỉ đường</Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container component={MotionViewport}>
          <Grid container spacing={6}>
            {!!services.length && <Grid xs={12} md={6}><Stack spacing={2}><Typography variant="overline" sx={{ color: 'text.disabled' }}>Trải nghiệm tại showroom</Typography><Typography variant="h3">Dịch vụ hỗ trợ</Typography>{services.map((item) => <Stack key={item} direction="row" spacing={1.5}><Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main' }} /><Typography>{item}</Typography></Stack>)}</Stack></Grid>}
            {!!amenities.length && <Grid xs={12} md={6}><Stack spacing={2}><Typography variant="overline" sx={{ color: 'text.disabled' }}>Tiện ích</Typography><Typography variant="h3">Chào đón bạn</Typography>{amenities.map((item) => <Stack key={item} direction="row" spacing={1.5}><Iconify icon="solar:check-circle-bold-duotone" sx={{ color: 'primary.main' }} /><Typography>{item}</Typography></Stack>)}</Stack></Grid>}
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.04) }}>
        <Container component={MotionViewport}>
          <Stack spacing={2} sx={{ mb: 4 }}><Typography variant="overline" sx={{ color: 'text.disabled' }}>Hình ảnh showroom</Typography><Typography variant="h3">Gallery không gian</Typography></Stack>
          <Grid container spacing={2}>
            {(gallery.length ? gallery : [String(showroom.image || SOFA2_PAGE_IMAGES.showroom1)]).map((src, index) => (
              <Grid key={`${src}-${index}`} xs={6} sm={3}><Box component={m.img} variants={varFade({ distance: 24 }).inUp} src={src} alt={`${showroom.name} — không gian ${index + 1}`} sx={{ width: 1, borderRadius: 2, aspectRatio: '1/1', objectFit: 'cover' }} /></Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
