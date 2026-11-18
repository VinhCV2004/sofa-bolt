import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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

const PRODUCTION_GROUP = 'Dịch vụ sản xuất';
const PRODUCTION_INTRO = 'Xưởng sản xuất cùng đội ngũ nghệ nhân lành nghề — biến ý tưởng và hồ sơ kỹ thuật thành sản phẩm chất lượng.';

const CAPABILITIES = [
  { value: '200m²', label: 'Diện tích xưởng', icon: 'solar:factory-bold-duotone' },
  { value: '50+', label: 'Nghệ nhân lành nghề', icon: 'solar:users-group-rounded-bold-duotone' },
  { value: '10 năm', label: 'Bảo hành chính hãng', icon: 'solar:shield-check-bold-duotone' },
];

const QUALITY_STEPS = [
  { title: 'Chọn nguyên liệu', desc: 'Kiểm tra vật liệu đầu vào theo mẫu và tiêu chuẩn đã thống nhất.' },
  { title: 'Chế tác khung', desc: 'Gia công cấu trúc theo bản vẽ và yêu cầu tải trọng.' },
  { title: 'May bọc & đệm', desc: 'Hoàn thiện vật liệu bọc, đệm và các chi tiết sản phẩm.' },
  { title: 'Kiểm định cuối', desc: 'Kiểm tra kích thước, hoàn thiện, đóng gói và bàn giao.' },
];

const lines = (value: unknown) => String(value ?? '').split('\n').map((item) => item.trim()).filter(Boolean);
const stepsFrom = (value: unknown) => lines(value).map((line) => {
  const [title, ...description] = line.split('|');
  return { title: title.trim(), description: description.join('|').trim() };
});

export default function Page() {
  const theme = useTheme();
  const { sub } = useParams();
  const { rows } = useSofa2AdminRows('cms', 'service-catalog');
  const services = rows
    .filter((row) => String(row.serviceGroup) === PRODUCTION_GROUP && String(row.status) === 'Đã xuất bản')
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  const currentService = sub ? services.find((service) => String(service.slug) === sub) : undefined;
  const steps = stepsFrom(currentService?.steps);
  const deliverables = lines(currentService?.deliverables);
  const faq = stepsFrom(currentService?.faq);
  const title = currentService ? String(currentService.title) : 'Dịch Vụ Sản Xuất';
  const description = currentService ? String(currentService.description) : PRODUCTION_INTRO;
  const image = String(currentService?.image || SOFA2_PAGE_IMAGES.factory);
  const indexable = !['không', 'false', '0'].includes(String(currentService?.indexable ?? 'Có').toLocaleLowerCase());

  return (
    <>
      <Helmet>
        <title>{currentService?.metaTitle || `${title} - LUXE Sofa`}</title>
        <meta name="description" content={String(currentService?.metaDescription || description)} />
        <meta name="robots" content={indexable ? 'index, follow' : 'noindex, nofollow'} />
        {(currentService?.ogImage || currentService?.image) && <meta property="og:image" content={String(currentService.ogImage || currentService.image)} />}
      </Helmet>

      <Sofa2PageHero
        overline="Dịch vụ sản xuất"
        title={title}
        subtitle={description}
        image={image}
      />

      <Sofa2Section>
        <Stack spacing={2} sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>Sản xuất</Typography>
          <Typography variant="h2">
            {services.length} dịch vụ
            <Box component="span" sx={{ ...textGradient(`135deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.warning.main}`) }}> sản xuất</Box>
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {services.map((service) => {
            const isActive = String(service.slug) === sub;
            return (
              <Grid key={service.id} xs={12} sm={6} md={3}>
                <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} sx={{ p: 4, height: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card, outline: isActive ? (t) => `2px solid ${t.vars.palette.primary.main}` : 'none' }}>
                  <Box sx={{ width: 56, height: 56, display: 'flex', borderRadius: 1.5, alignItems: 'center', justifyContent: 'center', bgcolor: (t) => varAlpha(t.vars.palette.primary.mainChannel, 0.08), color: 'primary.main' }}>
                    <Iconify icon={String(service.icon || 'solar:factory-bold-duotone')} width={28} />
                  </Box>
                  <Typography variant="h6">{service.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>{service.description}</Typography>
                  <Button component={RouterLink} href={`/sofa2/services/production/${service.slug}`} size="small" sx={{ width: 'fit-content' }} endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
                    Xem chi tiết
                  </Button>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Sofa2Section>

      {currentService ? (
        <Sofa2Section bg="grey">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">
            <Grid xs={12} md={7}>
              <Stack spacing={2} component={MotionViewport}>
                <Typography variant="overline" sx={{ color: 'primary.main' }}>Chi tiết dịch vụ</Typography>
                <Typography variant="h3">{currentService.title}</Typography>
                {lines(currentService.detail).map((paragraph, index) => (
                  <Typography key={index} sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{paragraph}</Typography>
                ))}
                {currentService.targetAudience && (
                  <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: 'background.neutral' }}>
                    <Typography variant="subtitle2">Phù hợp với</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{currentService.targetAudience}</Typography>
                  </Box>
                )}
                <Grid container spacing={2}>
                  {!!currentService.duration && <Grid xs={12} sm={6}><Typography variant="subtitle2">Thời gian dự kiến</Typography><Typography variant="body2" sx={{ color: 'text.secondary' }}>{currentService.duration}</Typography></Grid>}
                  {!!currentService.investment && <Grid xs={12} sm={6}><Typography variant="subtitle2">Chi phí tham khảo</Typography><Typography variant="body2" sx={{ color: 'text.secondary' }}>{currentService.investment}</Typography></Grid>}
                </Grid>
                {!!deliverables.length && <Typography variant="subtitle1" sx={{ mt: 2 }}>Kết quả bàn giao</Typography>}
                {deliverables.map((item) => <Stack key={item} direction="row" spacing={1}><Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main' }} /><Typography variant="body2">{item}</Typography></Stack>)}
                {lines(currentService.features).length > 0 && <Typography variant="subtitle1" sx={{ mt: 2 }}>Năng lực & quyền lợi</Typography>}
                {lines(currentService.features).map((feature) => (
                  <Stack key={feature} direction="row" spacing={1}>
                    <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main' }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Stack>
                ))}
                {!!faq.length && (
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Câu hỏi thường gặp</Typography>
                    {faq.map((item) => <Box key={item.title}><Typography variant="subtitle2">{item.title}</Typography><Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.description}</Typography></Box>)}
                  </Stack>
                )}
              </Stack>
            </Grid>
            <Grid xs={12} md={5}>
              <Stack spacing={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                <Typography variant="h5">Quy trình thực hiện</Typography>
                {steps.map((step, index) => (
                  <Stack key={`${step.title}-${index}`} direction="row" spacing={2}>
                    <Box sx={{ minWidth: 32, height: 32, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: 'primary.main', color: 'common.white', fontWeight: 'fontWeightBold' }}>{index + 1}</Box>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2">{step.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{step.description}</Typography>
                    </Stack>
                  </Stack>
                ))}
                <Button component={RouterLink} href={String(currentService.ctaLink || '/sofa2/contact')} variant="contained" sx={{ alignSelf: 'flex-start', mt: 1 }} endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
                  {currentService.ctaLabel || 'Liên hệ hợp tác'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Sofa2Section>
      ) : (
        <>
          <Sofa2Section bg="grey">
            <Stack spacing={2} sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', mb: { xs: 5, md: 8 } }}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>Năng lực</Typography>
              <Typography variant="h2">Cơ sở sản xuất</Typography>
            </Stack>
            <Grid container spacing={3}>
              {CAPABILITIES.map((cap) => (
                <Grid key={cap.label} xs={12} md={4}>
                  <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} alignItems="center" sx={{ p: 5, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card, textAlign: 'center' }}>
                    <Iconify icon={cap.icon} width={48} sx={{ color: 'primary.main' }} />
                    <Typography variant="h3" sx={{ ...textGradient(`135deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.warning.main}`) }}>{cap.value}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{cap.label}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Sofa2Section>
          <Sofa2Section>
            <Stack spacing={2} sx={{ mb: { xs: 5, md: 8 } }}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>Kiểm soát chất lượng</Typography>
              <Typography variant="h2">Quy trình sản xuất</Typography>
            </Stack>
            <Grid container spacing={3}>
              {QUALITY_STEPS.map((step, index) => (
                <Grid key={step.title} xs={12} sm={6} md={3}>
                  <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} sx={{ p: 3 }}>
                    <Box sx={{ width: 56, height: 56, display: 'flex', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main', color: 'common.white', fontWeight: 'fontWeightBold', fontSize: 22 }}>{index + 1}</Box>
                    <Typography variant="h6">{step.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{step.desc}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Sofa2Section>
        </>
      )}

      <Sofa2Section bg="grey">
        <Stack component={MotionViewport} spacing={3} alignItems="center" sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto' }}>
          <Typography variant="h3">Cần giải pháp sản xuất?</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Liên hệ để trao đổi hồ sơ kỹ thuật, năng lực và tiến độ phù hợp với dự án.</Typography>
          <Button component={RouterLink} href={String(currentService?.ctaLink || '/sofa2/contact')} size="large" variant="contained" startIcon={<Iconify icon="solar:phone-bold-duotone" />}>
            {currentService?.ctaLabel || 'Liên hệ hợp tác'}
          </Button>
        </Stack>
      </Sofa2Section>
    </>
  );
}
