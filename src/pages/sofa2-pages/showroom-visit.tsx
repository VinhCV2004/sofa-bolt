import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useMemo, useState, useEffect, type FormEvent } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { varAlpha, textGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';

const lines = (value: unknown) => String(value ?? '').split('\n').map((line) => line.trim()).filter(Boolean);
const today = () => new Date().toISOString().slice(0, 10);
const makeBookingCode = () => `SR-${today().replace(/-/g, '').slice(2)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export default function Page() {
  const theme = useTheme();
  const location = useLocation();
  const isConsult = location.pathname.endsWith('/consult');
  const search = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [submittedCode, setSubmittedCode] = useState('');
  const [formError, setFormError] = useState('');
  const [purpose, setPurpose] = useState(isConsult ? 'Tư vấn nội thất' : 'Tham quan showroom');
  const [showroomId, setShowroomId] = useState(search.get('showroom') || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  useEffect(() => {
    setPurpose(isConsult ? 'Tư vấn nội thất' : 'Tham quan showroom');
  }, [isConsult]);
  useEffect(() => {
    const requestedShowroom = search.get('showroom');
    if (requestedShowroom) setShowroomId(requestedShowroom);
  }, [search]);
  const { rows: showroomRows } = useSofa2AdminRows('cms', 'showrooms');
  const { rows: bookingRows, createRow: createBooking } = useSofa2AdminRows('cms', 'showroom-bookings');
  const showrooms = showroomRows
    .filter((row) => String(row.status) === 'Đã xuất bản' && String(row.bookingEnabled) === 'Có')
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  const selectedShowroom = showrooms.find((row) => String(row.id) === showroomId);
  const timeSlots = lines(selectedShowroom?.appointmentSlots);
  const reservedSlots = bookingRows
    .filter((row) => String(row.showroomId) === showroomId
      && String(row.appointmentDate) === appointmentDate
      && ['Chờ xác nhận', 'Đã xác nhận'].includes(String(row.status)))
    .map((row) => String(row.appointmentTime));

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    const formData = new FormData(event.currentTarget);
    const showroom = showrooms.find((row) => String(row.id) === String(formData.get('showroomId') ?? ''));
    const date = String(formData.get('appointmentDate') ?? '');
    const time = String(formData.get('appointmentTime') ?? '');
    if (!showroom) {
      setFormError('Vui lòng chọn showroom đang nhận đặt lịch.');
      return;
    }
    if (date < today()) {
      setFormError('Ngày hẹn không thể ở quá khứ.');
      return;
    }
    if (!timeSlots.includes(time)) {
      setFormError('Vui lòng chọn một khung giờ hợp lệ của showroom.');
      return;
    }
    if (reservedSlots.includes(time)) {
      setFormError('Khung giờ này vừa được đăng ký. Vui lòng chọn khung giờ khác.');
      return;
    }

    const bookingCode = makeBookingCode();
    createBooking({
      id: bookingCode,
      bookingCode,
      customerName: String(formData.get('customerName') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim().toLocaleLowerCase(),
      showroom: String(showroom.name ?? ''),
      showroomId: String(showroom.id),
      purpose,
      appointmentDate: date,
      appointmentTime: time,
      guests: Number(formData.get('guests') ?? 1) || 1,
      interest: String(formData.get('interest') ?? '').trim(),
      notes: String(formData.get('notes') ?? '').trim(),
      status: 'Chờ xác nhận',
      assignedTo: 'Chưa phân công',
      internalNote: '',
      source: 'Website',
      createdAt: today(),
      updated: today(),
    });
    setSubmittedCode(bookingCode);
  };

  return (
    <>
      <Helmet>
        <title>{isConsult ? 'Đặt lịch tư vấn showroom' : 'Đặt lịch tham quan showroom'} - LUXE Sofa</title>
        <meta name="description" content="Chọn showroom, ngày và khung giờ để đội ngũ LUXE Sofa chuẩn bị buổi tham quan hoặc tư vấn riêng." />
      </Helmet>

      <Sofa2PageHero
        overline="Đặt lịch showroom"
        title={(
          <>
            Đặt lịch
            <Box component="span" sx={{ ...textGradient(`135deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}`) }}>
              {' '}tham quan & tư vấn
            </Box>
          </>
        )}
        subtitle="Chọn showroom và khung giờ phù hợp. Nhân viên sẽ liên hệ xác nhận lịch hẹn của bạn."
        image={String(selectedShowroom?.image || SOFA2_PAGE_IMAGES.showroom2)}
      />

      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container component={MotionViewport} maxWidth="md">
          {submittedCode ? (
            <Stack
              spacing={3}
              alignItems="center"
              sx={{ textAlign: 'center', p: { xs: 5, md: 8 }, borderRadius: 3, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}
              component={m.div}
              variants={varFade({ distance: 24 }).inUp}
            >
              <Box sx={{ width: 80, height: 80, display: 'flex', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', bgcolor: (t) => varAlpha(t.vars.palette.success.mainChannel, 0.12), color: 'success.main' }}>
                <Iconify icon="solar:check-circle-bold-duotone" width={44} />
              </Box>
              <Typography variant="h3">Đã ghi nhận yêu cầu đặt lịch</Typography>
              <Typography sx={{ color: 'text.secondary', maxWidth: 540 }}>
                LUXE Sofa sẽ liên hệ để xác nhận showroom, ngày và khung giờ. Mã lịch hẹn của bạn là <strong>{submittedCode}</strong>.
              </Typography>
              <Button onClick={() => { setSubmittedCode(''); setFormError(''); }} variant="outlined" startIcon={<Iconify icon="solar:refresh-bold-duotone" />}>
                Đặt lịch khác
              </Button>
            </Stack>
          ) : (
            <Stack
              spacing={4}
              sx={{ p: { xs: 4, md: 6 }, borderRadius: 3, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}
              component={m.form}
              variants={varFade({ distance: 24 }).inUp}
              onSubmit={submitBooking}
            >
              <Stack spacing={1}>
                <Typography variant="h3">Thông tin đặt lịch</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Lịch của bạn sẽ được lưu để đội ngũ showroom xác nhận và theo dõi.</Typography>
              </Stack>

              <FormControl>
                <FormLabel sx={{ mb: 1 }}>Mục đích</FormLabel>
                <RadioGroup row value={purpose} onChange={(event) => setPurpose(event.target.value)}>
                  <FormControlLabel value="Tham quan showroom" control={<Radio />} label="Tham quan showroom" />
                  <FormControlLabel value="Tư vấn nội thất" control={<Radio />} label="Tư vấn nội thất" />
                </RadioGroup>
              </FormControl>

              <Grid container spacing={3}>
                <Grid xs={12} sm={6}><TextField fullWidth required name="customerName" label="Họ và tên" placeholder="Nguyễn Văn A" /></Grid>
                <Grid xs={12} sm={6}><TextField fullWidth required name="phone" type="tel" label="Số điện thoại" placeholder="09xx xxx xxx" inputProps={{ pattern: '[0-9+() .-]{9,18}' }} /></Grid>
                <Grid xs={12}><TextField fullWidth name="email" type="email" label="Email" placeholder="email@example.com" /></Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid xs={12}>
                  <TextField fullWidth select required name="showroomId" label="Showroom" value={showroomId} onChange={(event) => { setShowroomId(event.target.value); setAppointmentTime(''); setFormError(''); }}>
                    {showrooms.map((showroom) => <MenuItem key={showroom.id} value={String(showroom.id)}>{showroom.name} — {showroom.city}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid xs={12} sm={6}><TextField fullWidth required name="appointmentDate" type="date" label="Ngày hẹn" value={appointmentDate} onChange={(event) => { setAppointmentDate(event.target.value); setAppointmentTime(''); setFormError(''); }} inputProps={{ min: today() }} InputLabelProps={{ shrink: true }} /></Grid>
                <Grid xs={12} sm={6}><TextField fullWidth required name="appointmentTime" select label="Khung giờ" value={appointmentTime} onChange={(event) => { setAppointmentTime(event.target.value); setFormError(''); }} disabled={!selectedShowroom || !appointmentDate}>
                  {timeSlots.map((slot) => {
                    const reserved = reservedSlots.includes(slot);
                    return <MenuItem key={slot} value={slot} disabled={reserved}>{slot}{reserved ? ' — Đang chờ xác nhận' : ''}</MenuItem>;
                  })}
                </TextField></Grid>
                <Grid xs={12} sm={6}><TextField fullWidth select name="guests" label="Số người tham quan" defaultValue="1">{[1, 2, 3, 4, 5, 6].map((count) => <MenuItem key={count} value={count}>{count} người</MenuItem>)}</TextField></Grid>
                <Grid xs={12} sm={6}><TextField fullWidth name="interest" label="Nhu cầu quan tâm" placeholder="Ví dụ: sofa da, sofa chữ L, tư vấn bố trí..." /></Grid>
                <Grid xs={12}><TextField fullWidth multiline rows={3} name="notes" label="Ghi chú (tuỳ chọn)" placeholder="Thông tin cần chuẩn bị trước buổi hẹn..." /></Grid>
              </Grid>

              {!!formError && <Typography role="alert" color="error.main" variant="body2">{formError}</Typography>}
              <Button type="submit" size="large" variant="contained" fullWidth startIcon={<Iconify icon="solar:calendar-bold-duotone" />} disabled={!showrooms.length}>
                Gửi yêu cầu đặt lịch
              </Button>
              <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>Lịch hẹn chỉ được xác nhận sau khi nhân viên showroom liên hệ với bạn.</Typography>
            </Stack>
          )}
        </Container>
      </Box>
    </>
  );
}
