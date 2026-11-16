import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import { Sofa2Section, Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { formatSofa2Date, Sofa2CustomerPortalNav } from 'src/sections/sofa2/sofa2-customer-portal';
import {
  sofa2LocalDateKey,
  SOFA2_DEMO_CUSTOMER_ID,
  isSofa2CustomerPointAvailable,
} from 'src/sections/sofa2-admin/sofa2-customer';

export default function Page() {
  const voucherStore = useSofa2AdminRows('customer', 'vouchers');
  const pointStore = useSofa2AdminRows('customer', 'points');
  const profileStore = useSofa2AdminRows('customer', 'profiles');
  const customer = profileStore.rows.find((row) => String(row.customerId) === SOFA2_DEMO_CUSTOMER_ID);
  const customerName = String(customer?.name || 'Nguyễn Minh Anh');
  const [toast, setToast] = useState('');

  const today = sofa2LocalDateKey();
  const pointBalance = pointStore.rows
    .filter((row) => String(row.customerId) === SOFA2_DEMO_CUSTOMER_ID && isSofa2CustomerPointAvailable(row, today))
    .reduce((sum, row) => sum + Number(row.points || 0), 0);
  const walletCodes = new Set(voucherStore.rows
    .filter((row) => String(row.customerId) === SOFA2_DEMO_CUSTOMER_ID && ['Đã nhận', 'Đã sử dụng', 'Hết hạn'].includes(String(row.status)))
    .map((row) => String(row.code ?? '')));
  const vouchers = voucherStore.rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => {
      const recipient = String(row.customerId ?? '');
      const isForCustomer = recipient === 'Tất cả thành viên' || recipient === SOFA2_DEMO_CUSTOMER_ID;
      const status = String(row.status ?? '');
      const hasStarted = !row.startDate || String(row.startDate).slice(0, 10) <= today;
      const hasNotExpired = !row.endDate || String(row.endDate).slice(0, 10) >= today;
      const isInWallet = recipient === SOFA2_DEMO_CUSTOMER_ID &&
        ['Đã nhận', 'Đã sử dụng', 'Hết hạn'].includes(status);
      const isClaimedGlobalCampaign = recipient === 'Tất cả thành viên' && walletCodes.has(String(row.code ?? ''));
      const isAvailable = isForCustomer && status === 'Đang phát hành' && hasStarted && hasNotExpired && !isClaimedGlobalCampaign;
      return isInWallet || isAvailable;
    });

  const claimVoucher = (index: number) => {
    const voucher = voucherStore.rows[index];
    if (!voucher) return;
    const status = String(voucher.status ?? '');
    const recipient = String(voucher.customerId ?? '');
    const hasStarted = !voucher.startDate || String(voucher.startDate).slice(0, 10) <= today;
    const hasNotExpired = !voucher.endDate || String(voucher.endDate).slice(0, 10) >= today;
    if (status !== 'Đang phát hành' || !hasStarted || !hasNotExpired ||
      !['Tất cả thành viên', SOFA2_DEMO_CUSTOMER_ID].includes(recipient)) {
      setToast('Voucher hiện không nằm trong thời hạn phát hành.');
      return;
    }
    const alreadyClaimed = voucherStore.rows.some(
      (row, rowIndex) => rowIndex !== index && String(row.code) === String(voucher.code) &&
        String(row.customerId) === SOFA2_DEMO_CUSTOMER_ID &&
        ['Đã nhận', 'Đã sử dụng'].includes(String(row.status))
    ) || (recipient === SOFA2_DEMO_CUSTOMER_ID && ['Đã nhận', 'Đã sử dụng'].includes(status));
    if (alreadyClaimed) {
      setToast('Voucher này đã có trong ví của bạn.');
      return;
    }
    const pointCost = Number(voucher.pointsCost || 0);
    if (pointCost > pointBalance) {
      setToast(`Bạn cần ${pointCost.toLocaleString('vi-VN')} điểm để đổi voucher này.`);
      return;
    }
    if (recipient === SOFA2_DEMO_CUSTOMER_ID) {
      voucherStore.updateRow(index, { ...voucher, customer: customerName, status: 'Đã nhận' });
    } else {
      voucherStore.createRow({
        ...voucher,
        customerId: SOFA2_DEMO_CUSTOMER_ID,
        customer: customerName,
        status: 'Đã nhận',
      });
    }
    if (pointCost > 0) {
      pointStore.createRow({
        customerId: SOFA2_DEMO_CUSTOMER_ID,
        customer: customerName,
        reason: `Đổi voucher ${String(voucher.code)}`,
        points: -pointCost,
        date: new Date().toISOString().slice(0, 10),
        status: 'Đã ghi nhận',
      });
    }
    setToast(`Đã lưu voucher ${String(voucher.code)} vào ví.`);
  };

  return (
    <>
      <Helmet><title>Voucher của tôi — LUXE Sofa</title></Helmet>
      <Sofa2PageHero
        title="Voucher của tôi"
        subtitle="Lưu ưu đãi dành cho thành viên và theo dõi các mã đã nhận."
        image={SOFA2_PAGE_IMAGES.cta}
        overline="Tài khoản"
      />
      <Sofa2Section>
        <Sofa2CustomerPortalNav active="/sofa2/vouchers" />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4">Ưu đãi dành cho bạn</Typography>
            <Typography variant="body2" color="text.secondary">Số dư hiện tại: {pointBalance.toLocaleString('vi-VN')} điểm</Typography>
          </Box>
          <Chip icon={<Iconify icon="solar:ticket-sale-bold-duotone" />} label={`${vouchers.length} voucher`} color="primary" variant="soft" />
        </Stack>
        <Grid container spacing={3}>
          {vouchers.map(({ row, index }) => {
            const isForCustomer = String(row.customerId) === SOFA2_DEMO_CUSTOMER_ID;
            const expired = String(row.status) === 'Hết hạn' || (!!row.endDate && String(row.endDate).slice(0, 10) < today);
            const used = String(row.status) === 'Đã sử dụng';
            const isClaimed = isForCustomer && ['Đã nhận', 'Đã sử dụng', 'Hết hạn'].includes(String(row.status));
            return (
              <Grid key={`${row.code}-${row.customerId}-${index}`} xs={12} sm={6} md={4}>
                <Card sx={{ p: 3, height: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Chip size="small" label={String(row.campaign || 'Ưu đãi thành viên')} color="warning" variant="soft" />
                    {isForCustomer && <Chip size="small" label={expired ? 'Hết hạn' : String(row.status)} color={used || expired ? 'default' : 'success'} />}
                  </Stack>
                  <Typography variant="h5" sx={{ mt: 2 }}>{String(row.code)}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, flex: 1 }}>
                    Giảm {String(row.value)} · Đơn tối thiểu {Number(row.minOrder || 0).toLocaleString('vi-VN')}₫
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                    Hạn dùng: {formatSofa2Date(row.endDate)}
                    {Number(row.pointsCost || 0) > 0 ? ` · ${Number(row.pointsCost).toLocaleString('vi-VN')} điểm` : ''}
                  </Typography>
                  <Button
                    fullWidth
                    sx={{ mt: 2 }}
                    variant={isClaimed || expired ? 'outlined' : 'contained'}
                    disabled={isClaimed || expired}
                    onClick={() => claimVoucher(index)}
                    startIcon={<Iconify icon={isClaimed || expired ? 'eva:checkmark-fill' : 'solar:download-minimalistic-bold-duotone'} />}
                  >
                    {used ? 'Đã sử dụng' : expired ? 'Đã hết hạn' : isClaimed ? 'Đã có trong ví' : 'Lưu voucher'}
                  </Button>
                </Card>
              </Grid>
            );
          })}
          {!vouchers.length && <Grid xs={12}><Typography align="center" color="text.secondary">Hiện chưa có voucher dành cho bạn.</Typography></Grid>}
        </Grid>
      </Sofa2Section>
      <Snackbar open={!!toast} message={toast} autoHideDuration={2600} onClose={() => setToast('')} />
    </>
  );
}
