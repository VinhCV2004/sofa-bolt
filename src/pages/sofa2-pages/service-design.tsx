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

import { textGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import { Sofa2Section, Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { SOFA2_PROJECTS, SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';

const DESIGN_GROUP = 'Thiết kế nội thất';
const DESIGN_INTRO = 'Từ ý tưởng đến bản vẽ — chúng tôi kiến tạo không gian sống mang dấu ấn riêng của bạn.';

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
    .filter((row) => String(row.serviceGroup) === DESIGN_GROUP && String(row.status) === 'Đã xuất bản')
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  const currentService = sub ? services.find((service) => String(service.slug) === sub) : undefined;
  const features = lines(currentService?.features);
  const steps = stepsFrom(currentService?.steps);
  const deliverables = lines(currentService?.deliverables);
  const faq = stepsFrom(currentService?.faq);
  const title = currentService ? String(currentService.title) : 'Thiết Kế Nội Thất';
  const description = currentService ? String(currentService.description) : DESIGN_INTRO;
  const image = String(currentService?.image || SOFA2_PAGE_IMAGES.service1);
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
        overline={currentService ? 'Dịch vụ thiết kế' : 'Dịch vụ thiết kế'}
        title={title}
        subtitle={description}
        image={image}
      />

      <Sofa2Section>
        <Stack spacing={2} sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>Dịch vụ</Typography>
          <Typography variant="h2">
            {services.length} dịch vụ
            <Box component="span" sx={{ ...textGradient(`135deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.warning.main}`) }}> thiết kế</Box>
          </Typography>
        </Stack>
        <Grid container spacing={4}>
          {services.map((service) => {
            const isActive = String(service.slug) === sub;
            return (
              <Grid key={service.id} xs={12} md={4}>
                <Stack
                  component={m.div}
                  variants={varFade({ distance: 24 }).inUp}
                  spacing={2}
                  sx={{
                    p: 3,
                    height: 1,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    overflow: 'hidden',
                    boxShadow: (t) => t.customShadows.card,
                    outline: isActive ? (t) => `2px solid ${t.vars.palette.primary.main}` : 'none',
                  }}
                >
                  <Box component="img" src={String(service.image || SOFA2_PAGE_IMAGES.service1)} alt={String(service.title)} sx={{ width: 1, borderRadius: 1.5, aspectRatio: '16/10', objectFit: 'cover' }} />
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Iconify icon={String(service.icon || 'solar:pen-new-round-bold-duotone')} width={28} sx={{ color: 'primary.main' }} />
                    <Typography variant="h5">{service.title}</Typography>
                    {isActive && <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main' }} />}
                  </Stack>
                  <Typography sx={{ color: 'text.secondary' }}>{service.description}</Typography>
                  {!!lines(service.features).length && (
                    <Stack spacing={1}>
                      {lines(service.features).map((feature) => (
                        <Stack key={feature} direction="row" spacing={1.5} alignItems="flex-start">
                          <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main', mt: 0.25 }} width={18} />
                          <Typography variant="body2">{feature}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                  <Button component={RouterLink} href={`/sofa2/services/design/${service.slug}`} size="small" sx={{ width: 'fit-content' }} endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
                    Xem chi tiết
                  </Button>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Sofa2Section>

      {currentService && (
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
                {features.length > 0 && <Typography variant="subtitle1" sx={{ mt: 2 }}>Dịch vụ bao gồm</Typography>}
                {features.map((feature) => (
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
                  {currentService.ctaLabel || 'Liên hệ tư vấn'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Sofa2Section>
      )}

      <Sofa2Section bg={currentService ? undefined : 'grey'}>
        <Stack spacing={2} sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>Dự án tiêu biểu</Typography>
          <Typography variant="h2">Mẫu thiết kế đã thực hiện</Typography>
        </Stack>
        <Grid container spacing={3}>
          {SOFA2_PROJECTS.slice(0, 6).map((project) => (
            <Grid key={project.id} xs={12} sm={6} md={4}>
              <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                <Box component="img" src={project.image} alt={project.name} sx={{ width: 1, aspectRatio: '4/3', objectFit: 'cover' }} />
                <Stack spacing={1} sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="solar:map-point-bold-duotone" width={16} sx={{ color: 'primary.main' }} />
                    <Typography variant="caption" sx={{ color: 'primary.main' }}>{project.location} · {project.year}</Typography>
                  </Stack>
                  <Typography variant="h6">{project.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{project.description}</Typography>
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Sofa2Section>

      <Sofa2Section>
        <Stack component={MotionViewport} spacing={3} alignItems="center" sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto' }}>
          <Typography variant="h3">Sẵn sàng bắt đầu thiết kế?</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Liên hệ để được tư vấn về không gian, vật liệu và giải pháp phù hợp.</Typography>
          <Button component={RouterLink} href={String(currentService?.ctaLink || '/sofa2/contact')} size="large" variant="contained" startIcon={<Iconify icon="solar:phone-bold-duotone" />}>
            {currentService?.ctaLabel || 'Liên hệ tư vấn'}
          </Button>
        </Stack>
      </Sofa2Section>
    </>
  );
}
