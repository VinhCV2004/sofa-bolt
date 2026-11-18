import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { isSofa2SupportHref } from 'src/sections/sofa2-admin/sofa2-support';
import { Sofa2Section, Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { useCmsSeo, useCmsPageBlocks } from 'src/sections/sofa2/sofa2-cms-client';
import { SOFA2_PAGE_IMAGES, SOFA2_COMPANY_INFO } from 'src/sections/sofa2/sofa2-pages-data';
import { type AdminRow, useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';

// ----------------------------------------------------------------------

const metadata = { title: 'Liên hệ LUXE Sofa' };

const INFO = [
  { icon: 'solar:phone-bold-duotone', label: 'Hotline', value: SOFA2_COMPANY_INFO.phone, sub: 'Hỗ trợ 8:00 - 20:00', href: 'tel:+842438551234' },
  { icon: 'solar:letter-bold-duotone', label: 'Email', value: SOFA2_COMPANY_INFO.email, sub: 'Phản hồi trong 24h', href: `mailto:${SOFA2_COMPANY_INFO.email}` },
  { icon: 'solar:map-point-bold-duotone', label: 'Địa chỉ', value: SOFA2_COMPANY_INFO.address, sub: 'Showroom Hà Nội', href: 'https://maps.google.com/?q=123+Nguyen+Trai+Thanh+Xuan+Ha+Noi' },
  { icon: 'solar:clock-circle-bold-duotone', label: 'Giờ làm việc', value: '8:00 - 20:00', sub: 'Thứ 2 - Chủ nhật', href: '' },
];

const SOCIALS = [
  { icon: 'solar:facebook-bold-duotone', label: 'Facebook', href: 'https://www.facebook.com/' },
  { icon: 'solar:instagram-bold-duotone', label: 'Instagram', href: 'https://www.instagram.com/' },
  { icon: 'solar:youtube-bold-duotone', label: 'YouTube', href: 'https://www.youtube.com/' },
  { icon: 'solar:chat-bold-duotone', label: 'Zalo', href: 'https://zalo.me/' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Page() {
  const [searchParams] = useSearchParams();
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [form, setForm] = useState(() => ({ name: '', email: '', phone: '', subject: searchParams.get('service') ?? '', message: '' }));
  const { blocks: cmsBlocks } = useCmsPageBlocks('contact');
  const { seo } = useCmsSeo('/sofa2/contact');
  const contactInfoStore = useSofa2AdminRows('support', 'contact-info');
  const managedShowroomsStore = useSofa2AdminRows('cms', 'showrooms');
  const contactChannelsStore = useSofa2AdminRows('support', 'channels');
  const contactSocialStore = useSofa2AdminRows('support', 'contact-socials');
  const contactInquiryStore = useSofa2AdminRows('support', 'contact-inquiries');
  const cmsIntro = cmsBlocks.find((b) => b.block === 'intro' && b.content);
  const activeContactInfo = contactInfoStore.rows.filter((row) => row.status === 'Đang hiển thị');
  const activeContactChannels = contactChannelsStore.rows
    .filter((row) => {
      const href = String(row.href ?? '').trim().toLowerCase();
      return row.status === 'Đang bật' && (href.startsWith('tel:') || href.startsWith('mailto:')) && isSofa2SupportHref(href);
    })
    .map((row) => ({ ...row, label: String(row.title ?? ''), order: Number(row.order ?? 0) }));
  const managedShowroomCards: AdminRow[] = managedShowroomsStore.rows
    .filter((row) => String(row.status) === 'Đã xuất bản')
    .map((row, index) => ({
      label: `Địa chỉ · ${String(row.name ?? '')}`,
      value: String(row.address ?? ''),
      sub: `${String(row.phone ?? '')} · Mở cửa ${String(row.hours ?? '')}`,
      href: String(row.directionsUrl ?? ''),
      icon: 'solar:map-point-bold-duotone',
      order: 10 + Number(row.order ?? index),
      status: 'Đang hiển thị',
    }));
  const displayLocationRows = managedShowroomCards.length ? managedShowroomCards : activeContactInfo;
  const contactCards: AdminRow[] = contactInfoStore.rows.length || contactChannelsStore.rows.length || managedShowroomCards.length
    ? [...activeContactChannels, ...displayLocationRows].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
    : INFO.map((item, order) => ({ ...item, label: item.label, order }));
  const activeSocials = contactSocialStore.rows
    .filter((row) => row.status === 'Đang hiển thị' && String(row.href ?? '').trim() && isSofa2SupportHref(row.href))
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  const socials = contactSocialStore.rows.length
    ? activeSocials
    : SOCIALS.map((item, order) => ({ ...item, title: item.label, order }));
  const locationInfo = contactCards.find((item) => String(item.label ?? '').toLowerCase().includes('địa chỉ'));
  const mapHref = String(locationInfo?.href ?? '');

  const setField = (field: keyof typeof form, value: string) => {
    setSent(false);
    setFormError('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const phoneDigits = phone.replace(/\D/g, '');
    if (!name || !form.subject.trim() || !form.message.trim()) {
      setFormError('Vui lòng nhập họ tên, chủ đề và nội dung cần liên hệ.');
      return;
    }
    if (!email && !phoneDigits) {
      setFormError('Vui lòng cung cấp email hoặc số điện thoại để chúng tôi phản hồi.');
      return;
    }
    if (email && !EMAIL_PATTERN.test(email)) {
      setFormError('Địa chỉ email chưa hợp lệ.');
      return;
    }
    if (phoneDigits && (phoneDigits.length < 9 || phoneDigits.length > 15)) {
      setFormError('Số điện thoại cần có từ 9 đến 15 chữ số.');
      return;
    }

    const inquiryId = `CT-${Date.now()}`;
    contactInquiryStore.createRow({
      inquiryId,
      name,
      email,
      phone,
      subject: form.subject.trim(),
      message: form.message.trim(),
      receivedAt: new Date().toISOString(),
      source: 'Trang Liên hệ',
      assignedTo: 'Chưa phân công',
      reply: '',
      repliedAt: '',
      internalNote: '',
      status: 'Mới tiếp nhận',
    });
    setSentCode(inquiryId);
    setSent(true);
    setFormError('');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>{seo?.metaTitle || metadata.title}</title>
        {seo?.metaDescription && <meta name="description" content={seo.metaDescription} />}
        {seo?.keywords && <meta name="keywords" content={seo.keywords} />}
      </Helmet>

      <Sofa2PageHero
        title={cmsIntro?.heading || 'Liên hệ LUXE Sofa'}
        subtitle={cmsIntro?.content || 'Chúng tôi luôn sẵn sàng lắng nghe — liên hệ qua hotline, email hoặc đến trực tiếp showroom để được tư vấn tận tâm.'}
        image={cmsIntro?.image || SOFA2_PAGE_IMAGES.contact}
        overline={cmsIntro?.title || 'Liên hệ'}
      />

      {/* Info cards */}
      <Sofa2Section>
        <Grid container spacing={3}>
          {contactCards.map((item, index) => (
            <Grid key={String(item.label)} xs={12} sm={6} md={3}>
              <Stack
                component={m.div}
                variants={varFade({ distance: 24 }).inUp}
                transition={{ delay: index * 0.08 }}
                spacing={2}
                sx={{ p: 4, height: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}
              >
                <Box sx={{ width: 56, height: 56, display: 'flex', borderRadius: 1.5, alignItems: 'center', justifyContent: 'center', bgcolor: (t) => varAlpha(t.vars.palette.primary.mainChannel, 0.08), color: 'primary.main' }}>
                  <Iconify icon={String(item.icon ?? 'solar:chat-bold-duotone')} width={28} />
                </Box>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>{String(item.label ?? '')}</Typography>
                {String(item.href ?? '') && isSofa2SupportHref(item.href) ? (
                  <Typography
                    component="a"
                    href={String(item.href)}
                    target={String(item.href).startsWith('http') ? '_blank' : undefined}
                    rel={String(item.href).startsWith('http') ? 'noreferrer' : undefined}
                    variant="h6"
                    sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                  >
                    {String(item.value ?? '')}
                  </Typography>
                ) : <Typography variant="h6">{String(item.value ?? '')}</Typography>}
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{String(item.sub ?? '')}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Sofa2Section>

      {/* Form + Map */}
      <Sofa2Section bg="grey">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid xs={12} md={6}>
            <Stack
              id="contact-form"
              spacing={3}
              component={m.form}
              onSubmit={submitContact}
              variants={varFade({ distance: 24 }).inLeft}
              sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card, scrollMarginTop: 100 }}
            >
              <Typography variant="h5">Gửi tin nhắn cho chúng tôi</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Điền thông tin, chúng tôi sẽ liên hệ lại qua email hoặc điện thoại. Các trường liên hệ chỉ lưu trong bản demo trên trình duyệt.
              </Typography>
              {sent && <Alert severity="success">Đã ghi nhận yêu cầu {sentCode}. Bộ phận tư vấn sẽ liên hệ theo thông tin bạn cung cấp.</Alert>}
              {!!formError && <Alert severity="error">{formError}</Alert>}
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <TextField required fullWidth label="Họ và tên" value={form.name} onChange={(event) => setField('name', event.target.value)} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField fullWidth label="Email" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField fullWidth label="Số điện thoại" value={form.phone} onChange={(event) => setField('phone', event.target.value)} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField required fullWidth label="Chủ đề" value={form.subject} onChange={(event) => setField('subject', event.target.value)} />
                </Grid>
                <Grid xs={12}>
                  <TextField required fullWidth label="Nội dung tin nhắn" multiline rows={4} value={form.message} onChange={(event) => setField('message', event.target.value)} />
                </Grid>
                <Grid xs={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Vui lòng cung cấp ít nhất một trong hai thông tin: email hoặc số điện thoại.</Typography>
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Iconify icon="solar:letter-bold-duotone" />}
                sx={{ width: 'fit-content' }}
              >
                Gửi tin nhắn
              </Button>
            </Stack>
          </Grid>

          <Grid xs={12} md={6}>
            <Stack spacing={3} component={m.div} variants={varFade({ distance: 24 }).inRight}>
              <Box
                sx={{
                  height: 300,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.16),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Iconify icon="solar:map-point-bold-duotone" width={64} sx={{ color: 'primary.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Bản đồ Google Maps</Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center' }}>
                  {String(locationInfo?.value ?? SOFA2_COMPANY_INFO.address)}
                </Typography>
                {mapHref && isSofa2SupportHref(mapHref) && (
                  <Button component="a" href={mapHref} target={mapHref.startsWith('http') ? '_blank' : undefined} rel={mapHref.startsWith('http') ? 'noreferrer' : undefined} variant="outlined" size="small">
                    Mở bản đồ
                  </Button>
                )}
              </Box>
              <Stack direction="row" spacing={2}>
                {socials.map((social) => {
                  const href = String(social.href ?? '');
                  const title = String(social.title ?? social.label ?? 'Mạng xã hội');
                  return (
                    <Button
                      key={title}
                      component="a"
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noreferrer' : undefined}
                      aria-label={title}
                      title={title}
                      variant="soft"
                      color="primary"
                      sx={{ minWidth: 'auto', px: 1.5 }}
                    >
                      <Iconify icon={String(social.icon ?? 'solar:share-bold-duotone')} width={24} />
                    </Button>
                  );
                })}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Sofa2Section>

      {/* CTA */}
      <Sofa2Section>
        <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto' }} component={MotionViewport}>
          <Typography variant="h3">Đến showroom trải nghiệm</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Ghé thăm showroom LUXE Sofa gần nhất để tận mắt nhìn thấy chất lượng chế tác thủ công.</Typography>
          <Button component={RouterLink} href="/sofa2/showrooms" size="large" variant="contained" color="primary" startIcon={<Iconify icon="solar:map-point-bold-duotone" />}>
            Xem showroom
          </Button>
        </Stack>
      </Sofa2Section>
    </>
  );
}
