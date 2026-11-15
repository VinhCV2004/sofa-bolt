import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { setSofa2DemoSession, type Sofa2DemoRole } from 'src/_mock/_sofa2-demo';

function AuthPageFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <>
      <Helmet>
        <title>{title} | LUXE Sofa</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          px: 2,
          py: 6,
          bgcolor: '#f6f3ef',
        }}
      >
        <Container maxWidth="sm">
          <Stack spacing={3} alignItems="center">
            <Box component="img" src="/logo.svg" alt="LUXE Sofa" sx={{ width: 170, height: 'auto' }} />
            <Stack spacing={0.5} alignItems="center" sx={{ textAlign: 'center' }}>
              <Typography variant="h4">{title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Khu vực minh họa, không sử dụng xác thực tài khoản thật.
              </Typography>
            </Stack>
            {children}
          </Stack>
        </Container>
      </Box>
    </>
  );
}

function DemoAuthPage({ signUp = false }: { signUp?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const enterDemo = (role: Sofa2DemoRole) => {
    try {
      setSofa2DemoSession(role, email);
      const redirect = new URLSearchParams(location.search).get('redirect_url');
      const safeRedirect =
        redirect?.startsWith('/sofa2/') && !redirect.startsWith('//') ? redirect : null;
      navigate(safeRedirect ?? (role === 'admin' ? '/sofa2/admin' : '/sofa2/dealer'), {
        replace: true,
      });
    } catch (sessionError) {
      setError(sessionError instanceof Error ? sessionError.message : 'Không thể tạo phiên demo.');
    }
  };

  return (
    <AuthPageFrame title={signUp ? 'Tạo tài khoản đại lý demo' : 'Đăng nhập cổng đại lý'}>
      <Stack spacing={2} sx={{ width: 1, maxWidth: 440 }}>
        <Alert severity="warning">
          Phiên demo và dữ liệu được lưu cục bộ trên trình duyệt; đây không phải cơ chế bảo mật.
        </Alert>
        <TextField
          fullWidth
          label="Email hiển thị"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {error ? <Alert severity="error">{error}</Alert> : null}
        {signUp ? (
          <Button fullWidth size="large" variant="contained" onClick={() => enterDemo('dealer')}>
            Tạo phiên đại lý demo
          </Button>
        ) : (
          <Stack spacing={1.5}>
            <Button fullWidth size="large" variant="contained" onClick={() => enterDemo('dealer')}>
              Tiếp tục với vai trò đại lý demo
            </Button>
            <Button fullWidth size="large" variant="outlined" onClick={() => enterDemo('admin')}>
              Tiếp tục với vai trò quản trị demo
            </Button>
          </Stack>
        )}
        <Button
          component="a"
          href={signUp ? '/sofa2/dealer/sign-in' : '/sofa2/b2b'}
          color="inherit"
          variant="text"
        >
          {signUp ? 'Đã có tài khoản? Đăng nhập' : 'Quay lại trang hợp tác B2B'}
        </Button>
      </Stack>
    </AuthPageFrame>
  );
}

export function Sofa2DealerSignInPage() {
  return <DemoAuthPage />;
}

export function Sofa2DealerSignUpPage() {
  return <DemoAuthPage signUp />;
}
