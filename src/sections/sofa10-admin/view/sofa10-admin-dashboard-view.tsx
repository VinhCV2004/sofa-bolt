import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import {
  Sofa10AdminLayout,
  Sofa10AdminHeading,
  Sofa10AdminKpis,
} from './sofa10-admin-layout';
import { SOFA10_ADMIN_GROUPS } from './sofa10-admin-config';

// ----------------------------------------------------------------------

export function Sofa10AdminDashboardView() {
  return (
    <Sofa10AdminLayout>
      <Sofa10AdminHeading
        title="Tổng quan Sofa10"
        description="Bảng điều khiển quản trị — Wabi-Sabi Japanese Sofa"
        breadcrumb={[{ name: 'Admin' }, { name: 'Tổng quan' }]}
      />

      <Sofa10AdminKpis
        items={[
          { label: 'Doanh thu tháng', value: '4,8 tỷ', note: '+16,4% so với tháng trước' },
          { label: 'Đơn hàng', value: '328', note: '22 đang chờ xử lý' },
          { label: 'Sản phẩm', value: '142', note: '128 đang bán' },
          { label: 'Khách hàng', value: '3.486', note: '142 VIP' },
        ]}
      />

      <Box
        sx={{
          mb: 3,
          gap: 2,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        <Card sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'flex',
                borderRadius: 1.5,
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.lighter',
              }}
            >
              <Iconify icon="solar:cart-large-2-bold-duotone" width={28} sx={{ color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Đơn đang giao
              </Typography>
              <Typography variant="h5">28</Typography>
            </Box>
          </Stack>
        </Card>
        <Card sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'flex',
                borderRadius: 1.5,
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'success.lighter',
              }}
            >
              <Iconify icon="solar:box-bold-duotone" width={28} sx={{ color: 'success.main' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Sắp hết hàng
              </Typography>
              <Typography variant="h5">18 SKU</Typography>
            </Box>
          </Stack>
        </Card>
        <Card sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'flex',
                borderRadius: 1.5,
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'warning.lighter',
              }}
            >
              <Iconify icon="solar:users-group-rounded-bold-duotone" width={28} sx={{ color: 'warning.main' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Leads đang chăm sóc
              </Typography>
              <Typography variant="h5">186</Typography>
            </Box>
          </Stack>
        </Card>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Truy cập nhanh
      </Typography>

      <Box
        sx={{
          gap: 2,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {SOFA10_ADMIN_GROUPS.map((group) => (
          <Card key={group.slug} sx={{ p: 3, '&:hover': { boxShadow: (theme) => theme.customShadows.z12 } }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: 'flex',
                  borderRadius: 1.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.lighter',
                }}
              >
                <Iconify icon={group.icon} width={26} sx={{ color: 'primary.main' }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'fontWeightBold' }}>
                {group.name}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
              {group.desc}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              {group.sections.slice(0, 4).map((section) => (
                <Button
                  key={section.slug}
                  component={RouterLink}
                  href={`/sofa10/admin/${group.slug}/${section.slug}`}
                  size="small"
                  variant="soft"
                  sx={{ borderRadius: 1, fontSize: 12, mb: 0.5 }}
                >
                  {section.name}
                </Button>
              ))}
              {group.sections.length > 4 && (
                <Button
                  component={RouterLink}
                  href={`/sofa10/admin/${group.slug}`}
                  size="small"
                  variant="text"
                  sx={{ borderRadius: 1, fontSize: 12, mb: 0.5 }}
                >
                  +{group.sections.length - 4}
                </Button>
              )}
            </Stack>
          </Card>
        ))}
      </Box>
    </Sofa10AdminLayout>
  );
}
