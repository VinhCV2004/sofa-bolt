import { Link as RouterLink, Navigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getSofa2DemoSession } from 'src/_mock/_sofa2-demo';

type Props = { children: React.ReactNode; resource?: string };

export function Sofa2DealerAdminGuard({ children, resource = 'dữ liệu đại lý' }: Props) {
  const location = useLocation();
  const demoSession = getSofa2DemoSession();

  if (!demoSession) {
    const returnTo = encodeURIComponent(location.pathname);
    return <Navigate to={`/sofa2/dealer/sign-in?redirect_url=${returnTo}`} replace />;
  }

  if (demoSession.role !== 'admin') {
    return (
      <Box sx={{ p: { xs: 2, md: 6 } }}>
        <Paper sx={{ maxWidth: 560, mx: 'auto', p: 4, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h5">Không có quyền truy cập</Typography>
            <Typography color="text.secondary">
              Chỉ tài khoản quản trị viên mới được quản lý {resource}.
            </Typography>
            <Button component={RouterLink} to="/sofa2/admin" variant="contained">
              Về trang quản trị
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
}
