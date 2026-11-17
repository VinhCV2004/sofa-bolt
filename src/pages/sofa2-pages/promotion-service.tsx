import { useState } from 'react';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { RouterLink } from 'src/routes/components';

import { varAlpha, textGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import { Sofa2Section, Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { SOFA2_FAQS, SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';

// ----------------------------------------------------------------------

const SERVICE_IMAGES: Record<string, string> = {
  warranty: SOFA2_PAGE_IMAGES.service4,
  maintenance: SOFA2_PAGE_IMAGES.service2,
  repair: SOFA2_PAGE_IMAGES.factory,
  cleaning: SOFA2_PAGE_IMAGES.service3,
  returns: SOFA2_PAGE_IMAGES.service1,
};

const parseLines = (value: unknown) => String(value ?? '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const parsePairs = (value: unknown) => parseLines(value).map((line) => {
  const [title = '', desc = ''] = line.split('|').map((part) => part.trim());
  return { title, desc };
}).filter((item) => item.title);
const parsePlans = (value: unknown) => parseLines(value).map((line) => {
  const [tier = '', price = '', period = '', rawFeatures = '', popular = ''] = line.split('|').map((part) => part.trim());
  return { tier, price, period, features: rawFeatures.split(';').map((feature) => feature.trim()).filter(Boolean), popular: popular === 'Có' };
}).filter((plan) => plan.tier);

export default function Page() {
  const theme = useTheme();
  const { service } = useParams();
  const { rows: serviceRows } = useSofa2AdminRows('cms', 'promotion-services');
  const item = serviceRows.find((row) => String(row.slug ?? '') === service && String(row.status ?? '') === 'Đã xuất bản');
  const covered = parseLines(item?.included);
  const steps = parsePairs(item?.steps);
  const plans = parsePlans(item?.plans);
  const serviceFaqs = parsePairs(item?.faq);
  const faqs = serviceFaqs.length ? serviceFaqs : SOFA2_FAQS.map((faq) => ({ title: faq.question, desc: faq.answer }));
  const [expanded, setExpanded] = useState<string | false>(false);

  if (!item) {
    return (
      <>
        <Helmet><title>Không tìm thấy dịch vụ - LUXE Sofa</title></Helmet>
        <Container sx={{ py: { xs: 10, md: 16 }, textAlign: 'center' }}>
          <Stack spacing={3} alignItems="center">
            <Iconify icon="solar:question-circle-bold-duotone" width={80} sx={{ color: 'text.disabled' }} />
            <Typography variant="h3">Không tìm thấy dịch vụ</Typography>
            <Typography sx={{ color: 'text.secondary' }}>Dịch vụ bạn tìm kiếm không tồn tại.</Typography>
            <Button component={RouterLink} href="/sofa2/promotions" variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
              Quay lại danh sách
            </Button>
          </Stack>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{String(item.metaTitle || `${item.title} - LUXE Sofa`)}</title>
        {String(item.metaDescription ?? '') && <meta name="description" content={String(item.metaDescription)} />}
      </Helmet>

      <Sofa2PageHero
        overline="Dịch vụ hậu mãi"
        title={String(item.title ?? '')}
        subtitle={String(item.description ?? '')}
        image={String(item.image || SERVICE_IMAGES[String(item.slug)] || SOFA2_PAGE_IMAGES.service1)}
      />

      {/* Description + covered */}
      <Sofa2Section>
        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid xs={12} md={7}>
            <Stack spacing={3} component={m.div} variants={varFade({ distance: 24 }).inUp}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>Mô tả chi tiết</Typography>
              <Typography variant="h3">{item.title}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{String(item.description ?? '')}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{String(item.detail ?? '')}</Typography>
            </Stack>
          </Grid>
          <Grid xs={12} md={5}>
            <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} sx={{ p: 4, borderRadius: 2, bgcolor: (t) => varAlpha(t.vars.palette.primary.mainChannel, 0.04) }}>
              <Typography variant="h6">Dịch vụ bao gồm</Typography>
              {covered.map((c) => (
                <Stack key={c} direction="row" spacing={1.5} alignItems="flex-start">
                  <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main', mt: 0.25 }} width={20} />
                  <Typography variant="body2">{c}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Sofa2Section>

      {/* Process steps */}
      <Sofa2Section bg="grey">
        <Stack spacing={2} sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>Quy trình</Typography>
          <Typography variant="h2">Quy trình thực hiện</Typography>
        </Stack>
        <Grid container spacing={3}>
          {steps.map((step, index) => (
            <Grid key={step.title} xs={12} sm={6} md={3}>
              <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} sx={{ position: 'relative', p: 3 }}>
                <Box sx={{ width: 56, height: 56, display: 'flex', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main', color: 'common.white', fontWeight: 'fontWeightBold', fontSize: 22 }}>
                  {index + 1}
                </Box>
                <Typography variant="h6">{step.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{step.desc}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Sofa2Section>

      {/* Pricing table */}
      {plans.length > 0 && <Sofa2Section>
        <Stack spacing={2} sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', mb: { xs: 5, md: 8 } }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>Bảng giá</Typography>
          <Typography variant="h2">Gói dịch vụ</Typography>
        </Stack>
        <Grid container spacing={3} alignItems="stretch">
          {plans.map((plan) => (
            <Grid key={plan.tier} xs={12} md={4}>
              <Stack
                component={m.div}
                variants={varFade({ distance: 24 }).inUp}
                spacing={2}
                sx={{
                  p: 4,
                  height: 1,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: (t) => t.customShadows.card,
                  outline: plan.popular ? (t) => `2px solid ${t.vars.palette.primary.main}` : 'none',
                  position: 'relative',
                }}
              >
                {plan.popular && (
                  <Box sx={{ position: 'absolute', top: 16, right: 16, px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 'primary.main', color: 'common.white' }}>
                    <Typography variant="caption" fontWeight="fontWeightBold">Phổ biến</Typography>
                  </Box>
                )}
                <Typography variant="h6">{plan.tier}</Typography>
                <Stack direction="row" alignItems="flex-end" spacing={0.5}>
                  <Typography variant="h3" sx={{ ...textGradient(`135deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.warning.main}`) }}>{plan.price}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{plan.period}</Typography>
                </Stack>
                <Stack spacing={1.5}>
                  {plan.features.map((f) => (
                    <Stack key={f} direction="row" spacing={1.5} alignItems="flex-start">
                      <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main', mt: 0.25 }} width={18} />
                      <Typography variant="body2">{f}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button component={RouterLink} href={`/sofa2/contact?service=${encodeURIComponent(String(item.title ?? ''))}`} variant={plan.popular ? 'contained' : 'outlined'} sx={{ mt: 'auto' }} endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
                  Đặt lịch
                </Button>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Sofa2Section>}

      {/* FAQ */}
      <Sofa2Section bg="grey">
        <Stack spacing={2} sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>Câu hỏi thường gặp</Typography>
          <Typography variant="h2">FAQ</Typography>
        </Stack>
        <Container component={MotionViewport} maxWidth="md" sx={{ px: 0 }}>
          <Stack spacing={1.5}>
            {faqs.map((faq) => (
              <Accordion
                key={faq.title}
                expanded={expanded === faq.title}
                onChange={(_, isExpanded) => setExpanded(isExpanded ? faq.title : false)}
              >
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <Typography variant="subtitle1">{faq.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary' }}>{faq.desc}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Sofa2Section>

      {/* CTA */}
      <Sofa2Section>
        <Stack component={MotionViewport} spacing={3} alignItems="center" sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto' }}>
          <Typography variant="h3">Đặt lịch dịch vụ ngay</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Liên hệ để được tư vấn và đặt lịch dịch vụ {String(item.title ?? '').toLowerCase()} từ LUXE Sofa.</Typography>
          <Button component={RouterLink} href={`/sofa2/contact?service=${encodeURIComponent(String(item.title ?? ''))}`} size="large" variant="contained" color="primary" startIcon={<Iconify icon="solar:calendar-bold-duotone" />}>
            Đặt lịch ngay
          </Button>
        </Stack>
      </Sofa2Section>
    </>
  );
}
