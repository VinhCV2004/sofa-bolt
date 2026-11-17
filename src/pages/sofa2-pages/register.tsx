import { useState } from 'react';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { varFade } from 'src/components/animate';

import { SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';
import { Sofa2Section, Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { getSofa2AdminRows, createSofa2AdminRow } from 'src/sections/sofa2-admin/sofa2-admin-store';

// ----------------------------------------------------------------------

const metadata = { title: 'Đăng ký — LUXE Sofa' };

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submitRegistration = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim().toLowerCase();
    const password = String(data.get('password') ?? '');
    const confirmation = String(data.get('passwordConfirm') ?? '');
    if (password.length < 8 || password !== confirmation) {
      setError(password.length < 8 ? 'Mật khẩu cần có ít nhất 8 ký tự.' : 'Mật khẩu xác nhận chưa khớp.');
      return;
    }
    if (getSofa2AdminRows('customer', 'profiles').some((row) => String(row.email ?? '').toLowerCase() === email)) {
      setError('Email đã có hồ sơ. Vui lòng đăng nhập hoặc dùng chức năng quên mật khẩu.');
      return;
    }
    if (getSofa2AdminRows('customer', 'registrations').some((row) =>
      String(row.email ?? '').toLowerCase() === email && ['Chờ xác minh', 'Đang xem xét'].includes(String(row.status))
    )) {
      setError('Yêu cầu đăng ký với email này đang được xử lý.');
      return;
    }
    createSofa2AdminRow('customer', 'registrations', {
      requestId: `REG-${Date.now()}`,
      name: String(data.get('name') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      email,
      customerId: '',
      source: 'Website',
      consent: data.get('consent') ? 'Có' : 'Không',
      createdAt: new Date().toISOString().slice(0, 10),
      reviewedBy: '',
      reviewedAt: '',
      note: 'Hồ sơ demo chờ xác minh; mật khẩu không được lưu.',
      status: 'Chờ xác minh',
    });
    setError('');
    setSent(true);
  };

  return (
    <>
      <Helmet><title>{metadata.title}</title></Helmet>

      <Sofa2PageHero
        title="Đăng ký"
        subtitle="Tạo tài khoản LUXE Sofa để tận hưởng ưu đãi thành viên và theo dõi đơn hàng."
        image={SOFA2_PAGE_IMAGES.team}
        overline="Tài khoản"
      />

      <Sofa2Section>
        <Stack
          component={m.div}
          variants={varFade({ distance: 24 }).inUp}
          spacing={3}
          sx={{ maxWidth: 480, mx: 'auto', p: { xs: 3, md: 5 }, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}
        >
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Box sx={{ width: 56, height: 56, mx: 'auto', display: 'flex', borderRadius: 2, alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main', color: 'common.white' }}>
              <Iconify icon="solar:user-plus-bold-duotone" width={28} />
            </Box>
            <Typography variant="h5">Tạo tài khoản mới</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Điền thông tin để đăng ký thành viên LUXE Sofa.</Typography>
          </Stack>

          {sent && <Alert severity="success">Đã ghi nhận yêu cầu đăng ký demo. Tài khoản cần được xác minh trước khi sử dụng; mật khẩu không được lưu.</Alert>}
          {!!error && <Alert severity="error">{error}</Alert>}
          <Stack spacing={2.5} component={m.form} onSubmit={submitRegistration}>
            <TextField required name="name" fullWidth label="Họ và tên" placeholder="Nguyễn Minh Anh" />
            <TextField required name="phone" fullWidth label="Số điện thoại" placeholder="09xx xxx xxx" />
            <TextField required name="email" fullWidth label="Email" type="email" placeholder="anh.nguyen@email.com" />
            <TextField
              fullWidth
              name="password"
              required
              inputProps={{ minLength: 8 }}
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tối thiểu 8 ký tự"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={20} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              name="passwordConfirm"
              required
              label="Xác nhận mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
            />
            <FormControlLabel
              control={<Checkbox required name="consent" size="small" />}
              label={
                <Typography variant="body2">
                  Tôi đồng ý với{' '}
                  <Box component={RouterLink} href="/sofa2/policy/terms" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Điều khoản sử dụng
                  </Box>{' '}
                  và{' '}
                  <Box component={RouterLink} href="/sofa2/policy" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Chính sách bảo mật
                  </Box>
                </Typography>
              }
            />
            <Button type="submit" variant="contained" size="large" fullWidth disabled={sent} startIcon={<Iconify icon="solar:user-plus-bold-duotone" />}>
              Đăng ký tài khoản
            </Button>
          </Stack>

          <Divider>hoặc</Divider>

          <Stack direction="row" justifyContent="center" spacing={0.5}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Đã có tài khoản?</Typography>
            <Button component={RouterLink} href="/sofa2/login" size="small">
              Đăng nhập
            </Button>
          </Stack>
        </Stack>
      </Sofa2Section>
    </>
  );
}
