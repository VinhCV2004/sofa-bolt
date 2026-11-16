import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TableContainer from '@mui/material/TableContainer';

import {
  getSofa2DemoSession,
  clearSofa2DemoSession,
} from 'src/_mock/_sofa2-demo';

import { Iconify } from 'src/components/iconify';

import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import { isSofa2DealerPolicyVisible } from 'src/sections/sofa2-admin/sofa2-dealer';

type DataRow = Record<string, unknown>;

const NAV = [
  { label: 'Tổng quan', path: '/sofa2/dealer', icon: 'solar:widget-5-bold-duotone' },
  { label: 'Chính sách giá', path: '/sofa2/dealer/policy', icon: 'solar:tag-price-bold-duotone' },
  { label: 'Báo giá', path: '/sofa2/dealer/quotes', icon: 'solar:document-add-bold-duotone' },
  { label: 'Đơn hàng', path: '/sofa2/dealer/orders', icon: 'solar:cart-large-4-bold-duotone' },
  { label: 'Công nợ', path: '/sofa2/dealer/debt', icon: 'solar:wallet-money-bold-duotone' },
  { label: 'Tài liệu bán hàng', path: '/sofa2/dealer/documents', icon: 'solar:folder-open-bold-duotone' },
];

const ADMIN_MODULES: Record<string, string> = {
  '/sofa2/dealer': 'dashboard',
  '/sofa2/dealer/policy': 'price-policy',
  '/sofa2/dealer/quotes': 'quotes',
  '/sofa2/dealer/orders': 'dealer-orders',
  '/sofa2/dealer/debt': 'debts',
  '/sofa2/dealer/documents': 'sales-docs',
};

const SECTIONS: Record<string, { title: string; description: string }> = {
  '/sofa2/dealer': { title: 'Tổng quan đại lý', description: 'Theo dõi doanh số, đơn hàng và chính sách dành cho đại lý.' },
  '/sofa2/dealer/policy': { title: 'Chính sách giá', description: 'Mức chiết khấu và điều kiện áp dụng theo cấp đại lý.' },
  '/sofa2/dealer/quotes': { title: 'Báo giá', description: 'Gửi yêu cầu mới và theo dõi phản hồi báo giá.' },
  '/sofa2/dealer/orders': { title: 'Đơn hàng đại lý', description: 'Theo dõi trạng thái xử lý và giao hàng.' },
  '/sofa2/dealer/debt': { title: 'Công nợ', description: 'Hạn mức, dư nợ và thời hạn thanh toán của tài khoản.' },
  '/sofa2/dealer/documents': { title: 'Tài liệu bán hàng', description: 'Tải catalogue, bảng giá và tài liệu được cấp quyền.' },
};

const text = (value: unknown) => String(value ?? '').trim();
const isPortalEnabled = (value: unknown) => value === true || ['có', 'true', '1', 'yes'].includes(text(value).toLowerCase());
const amount = (value: unknown) => Number(text(value).replace(/[^\d.-]/g, '')) || 0;
const isDealerRecord = (row: DataRow, profile: DataRow) => {
  const rowId = text(row.dealerId);
  const profileId = text(profile.dealerId);
  if (rowId && profileId) return rowId === profileId;
  return text(row.dealer).toLocaleLowerCase() === text(profile.dealer).toLocaleLowerCase();
};
const hasDocumentAccess = (accessValue: unknown, levelValue: unknown) => {
  const access = text(accessValue);
  const rank = ['Đồng', 'Bạc', 'Vàng', 'Kim cương'].indexOf(text(levelValue));
  if (!access || access === 'Tất cả đại lý') return true;
  if (access === 'Đồng trở lên') return rank >= 0;
  if (access === 'Bạc trở lên') return rank >= 1;
  if (access === 'Vàng trở lên') return rank >= 2;
  if (access === 'Chỉ Kim cương') return rank === 3;
  return false;
};
const currency = (value: unknown) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount(value));
const formatDate = (value: unknown) => {
  const raw = text(value);
  const iso = raw.match(/^(\\d{4})-(\\d{2})-(\\d{2})/);
  return iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : raw;
};
const DATE_COLUMNS = new Set(['orderDate', 'deliveryDate', 'dueDate', 'validUntil', 'created', 'startDate', 'endDate', 'updated']);

function PortalTable({ rows, columns, emptyText }: { rows: DataRow[]; columns: [string, string][]; emptyText: string }) {
  if (rows.length === 0) {
    return <Alert severity="info">{emptyText}</Alert>;
  }
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(([key, label]) => <TableCell key={key}>{label}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={text(row.recordId) || text(row.code) || index}>
              {columns.map(([key]) => (
                <TableCell key={key}>
                  {key === 'total' || key === 'balance' || key === 'limit' || key === 'value'
                    ? currency(row[key])
                    : DATE_COLUMNS.has(key)
                      ? formatDate(row[key]) || '—'
                      : text(row[key]) || '—'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Sofa2DealerPortalPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [demoSession] = useState(() => getSofa2DemoSession());
  const { rows: dealerProfiles } = useSofa2AdminRows('dealer', 'dashboard');
  const { rows: policyRows } = useSofa2AdminRows('dealer', 'price-policy');
  const { rows: quoteRows, createRow: createQuoteRow } = useSofa2AdminRows('dealer', 'quotes');
  const { rows: orderRows } = useSofa2AdminRows('dealer', 'dealer-orders');
  const { rows: debtRows } = useSofa2AdminRows('dealer', 'debts');
  const { rows: documentRows, updateRow: updateDocumentRow } = useSofa2AdminRows('dealer', 'sales-docs');
  const portal = useMemo(() => {
    if (demoSession?.role !== 'dealer') return null;
    const email = demoSession.email.trim().toLowerCase();
    const profile = dealerProfiles.find((row) =>
      String(row.email ?? '').trim().toLowerCase() === email &&
      isPortalEnabled(row.portalAccess) && String(row.status ?? '') !== 'Tạm ngưng'
    );
    if (!profile) return null;
    const level = text(profile.level);
    const profileData = profile as DataRow;
    return {
      profile: profileData,
      policies: policyRows.filter((row) =>
        isSofa2DealerPolicyVisible(row) && ['Tất cả', level].includes(text(row.level))
      ) as DataRow[],
      quotes: quoteRows.filter((row) => isDealerRecord(row, profileData)) as DataRow[],
      orders: orderRows.filter((row) => isDealerRecord(row, profileData)) as DataRow[],
      debts: debtRows.filter((row) => isDealerRecord(row, profileData)) as DataRow[],
      documents: documentRows
        .map((row, index): DataRow => ({ ...row, __storeIndex: index }))
        .filter((row) => row.status === 'Đã xuất bản' && hasDocumentAccess(row.access, level)),
    };
  }, [demoSession, dealerProfiles, policyRows, quoteRows, orderRows, debtRows, documentRows]);
  const [products, setProducts] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  const section = SECTIONS[pathname] ? pathname : '/sofa2/dealer';
  const heading = SECTIONS[section];
  const displayName = text(portal?.profile.dealer) || demoSession?.name || demoSession?.email || 'Đại lý';
  const target = amount(portal?.profile.target);
  const achieved = amount(portal?.profile.achieved);
  const balance = useMemo(
    () => (portal?.debts ?? []).reduce((sum, row) => sum + amount(row.balance), 0),
    [portal?.debts]
  );
  const progress = target ? Math.min(100, Math.round((achieved / target) * 100)) : 0;

  if (!demoSession) {
    return <Navigate to="/sofa2/dealer/sign-in" replace />;
  }

  const submitQuote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setSentMessage('');
    try {
      const quoteCode = `BG-DL-${Date.now().toString().slice(-8)}`;
      const quote = {
        id: `quote-${quoteCode}`,
        code: quoteCode,
        dealerId: text(portal?.profile.dealerId),
        dealerEmail: demoSession.email.trim().toLowerCase(),
        dealer: text(portal?.profile.dealer),
        products: products.trim(),
        items: products.split(/[;\n]/).map((item) => item.trim()).filter(Boolean).length,
        note: note.trim(),
        value: 0,
        shipping: 0,
        created: new Date().toISOString().slice(0, 10),
        validUntil: '',
        status: 'Chờ xử lý',
      };
      createQuoteRow(quote);
      setProducts('');
      setNote('');
      setSentMessage(`Đã lưu yêu cầu ${quoteCode} trên cổng demo.`);
    } catch (submitError) {
      setSentMessage(submitError instanceof Error ? submitError.message : 'Không gửi được yêu cầu.');
    } finally {
      setSending(false);
    }
  };

  if (demoSession.role === 'admin') {
    return (
      <>
        <Helmet><title>Cổng đại lý | LUXE Sofa</title><meta name="robots" content="noindex, nofollow" /></Helmet>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f6f3ef', p: { xs: 2, md: 6 } }}>
          <Container maxWidth="md">
            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
              <Stack spacing={3}>
                <Box component="img" src="/logo.svg" alt="LUXE Sofa" sx={{ width: 160 }} />
                <Typography variant="h3">Quản trị cổng đại lý</Typography>
                <Typography color="text.secondary">
                  Bạn đang sử dụng quyền quản trị demo. Dữ liệu chỉ được lưu trên thiết bị hiện tại.
                </Typography>
                <Grid container spacing={2}>
                  {NAV.map((item) => (
                    <Grid key={item.path} xs={12} sm={6}>
                      <Button
                        fullWidth
                        component={RouterLink}
                        to={`/sofa2/admin/dealer/${ADMIN_MODULES[item.path]}`}
                        variant="outlined"
                        startIcon={<Iconify icon={item.icon} />}
                        sx={{ justifyContent: 'flex-start', py: 1.5 }}
                      >
                        {item.label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                <Button
                  variant="text"
                  onClick={() => {
                    clearSofa2DemoSession();
                    navigate('/sofa2/b2b');
                  }}
                >
                  Đăng xuất
                </Button>
              </Stack>
            </Paper>
          </Container>
        </Box>
      </>
    );
  }

  if (!portal) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f6f3ef', display: 'grid', placeItems: 'center', p: 2 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
            <Stack spacing={2} alignItems="flex-start">
              <Alert severity="warning">Email này chưa được cấp quyền truy cập cổng đại lý. Vui lòng liên hệ nhân viên phụ trách hoặc dùng email demo đã được quản trị viên bật quyền.</Alert>
              <Button component={RouterLink} to="/sofa2/dealer/sign-in" variant="contained">Đổi tài khoản demo</Button>
              <Button component={RouterLink} to="/sofa2/b2b" color="inherit">Quay lại trang hợp tác</Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  const content = () => {
    if (section === '/sofa2/dealer') {
      return (
        <Stack spacing={3}>
          <Grid container spacing={2}>
            {[
              { label: 'Cấp đại lý', value: text(portal.profile.level) || 'Chưa xếp hạng', icon: 'solar:medal-star-bold-duotone' },
              { label: 'Doanh số tháng', value: currency(portal.profile.achieved), icon: 'solar:chart-square-bold-duotone' },
              { label: 'Chỉ tiêu tháng', value: currency(portal.profile.target), icon: 'solar:target-bold-duotone' },
              { label: 'Dư nợ hiện tại', value: currency(balance), icon: 'solar:wallet-money-bold-duotone' },
            ].map((item) => (
              <Grid key={item.label} xs={12} sm={6} md={3}>
                <Card sx={{ height: 1 }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Iconify icon={item.icon} width={28} sx={{ color: 'primary.main' }} />
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="h6">{item.value}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">Tiến độ chỉ tiêu</Typography>
                  <Typography variant="subtitle2">{progress}%</Typography>
                </Stack>
                <Box sx={{ height: 10, borderRadius: 99, bgcolor: 'grey.200', overflow: 'hidden' }}>
                  <Box sx={{ width: `${progress}%`, height: 1, bgcolor: 'primary.main' }} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {currency(portal.profile.achieved)} / {currency(portal.profile.target)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          <Typography variant="h6">Đơn hàng gần đây</Typography>
          <PortalTable
            rows={portal.orders.slice(0, 5)}
            columns={[['code', 'Mã đơn'], ['orderDate', 'Ngày đặt'], ['total', 'Giá trị'], ['status', 'Trạng thái']]}
            emptyText="Chưa có đơn hàng đại lý."
          />
        </Stack>
      );
    }

    if (section === '/sofa2/dealer/policy') {
      return portal.policies.length ? (
        <Grid container spacing={2}>
          {portal.policies.map((row, index) => (
            <Grid key={text(row.recordId) || index} xs={12} md={6}>
              <Card sx={{ height: 1 }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="h6">{text(row.name) || 'Chính sách đang áp dụng'}</Typography>
                    <Typography variant="body2" color="text.secondary">Cấp áp dụng: {text(row.level) || 'Tất cả'}</Typography>
                    <Typography variant="h4" color="primary.main">{text(row.discount)}% chiết khấu</Typography>
                    <Divider />
                    <Typography variant="body2">Doanh số tối thiểu: {currency(row.minRevenue)}</Typography>
                    {row.bonus ? <Typography variant="body2">Thưởng doanh số: {text(row.bonus)}%</Typography> : null}
                    {row.paymentTerm ? <Typography variant="body2">Hạn công nợ: {text(row.paymentTerm)} ngày</Typography> : null}
                    {row.terms ? <Typography variant="body2" color="text.secondary">{text(row.terms)}</Typography> : null}
                    <Typography variant="caption" color="text.secondary">
                      Hiệu lực: {text(row.startDate) || '—'} – {text(row.endDate) || '—'}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : <Alert severity="info">Chưa có chính sách giá áp dụng cho cấp đại lý của bạn.</Alert>;
    }

    if (section === '/sofa2/dealer/quotes') {
      return (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Stack component="form" spacing={2} onSubmit={submitQuote}>
                <Typography variant="h6">Gửi yêu cầu báo giá</Typography>
                <TextField
                  required
                  multiline
                  minRows={2}
                  label="Sản phẩm và số lượng"
                  placeholder="Ví dụ: Sofa góc L-01 × 4; Sofa đơn A-02 × 2"
                  value={products}
                  onChange={(event) => setProducts(event.target.value)}
                />
                <TextField
                  multiline
                  minRows={2}
                  label="Ghi chú"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
                <Button type="submit" variant="contained" disabled={sending} sx={{ alignSelf: 'flex-start' }}>
                  {sending ? 'Đang gửi…' : 'Gửi yêu cầu'}
                </Button>
                {sentMessage ? <Alert severity={sentMessage.startsWith('Đã lưu') ? 'success' : 'error'}>{sentMessage}</Alert> : null}
              </Stack>
            </CardContent>
          </Card>
          <Typography variant="h6">Lịch sử báo giá</Typography>
          <PortalTable
            rows={portal.quotes}
            columns={[['code', 'Mã báo giá'], ['products', 'Sản phẩm'], ['value', 'Giá trị'], ['validUntil', 'Hiệu lực đến'], ['status', 'Trạng thái']]}
            emptyText="Chưa có yêu cầu báo giá."
          />
        </Stack>
      );
    }

    if (section === '/sofa2/dealer/orders') {
      return <PortalTable rows={portal.orders} columns={[['code', 'Mã đơn'], ['products', 'Sản phẩm'], ['orderDate', 'Ngày đặt'], ['deliveryDate', 'Dự kiến giao'], ['total', 'Tổng tiền'], ['status', 'Trạng thái']]} emptyText="Chưa có đơn hàng đại lý." />;
    }

    if (section === '/sofa2/dealer/debt') {
      return (
        <Stack spacing={2}>
          <Alert severity="info">Thông tin công nợ chỉ hiển thị cho tài khoản đại lý đã đăng nhập.</Alert>
          <PortalTable rows={portal.debts} columns={[['invoices', 'Hóa đơn'], ['limit', 'Hạn mức'], ['balance', 'Dư nợ'], ['paid', 'Đã thanh toán'], ['dueDate', 'Hạn thanh toán'], ['status', 'Trạng thái']]} emptyText="Chưa có dữ liệu công nợ." />
        </Stack>
      );
    }

    return portal.documents.length ? (
      <Grid container spacing={2}>
        {portal.documents.map((row, index) => (
          <Grid key={text(row.recordId) || index} xs={12} sm={6} lg={4}>
            <Card sx={{ height: 1 }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Iconify icon="solar:folder-open-bold-duotone" width={30} sx={{ color: 'primary.main' }} />
                  <Typography variant="h6">{text(row.title)}</Typography>
                  <Typography variant="caption" color="text.secondary">{text(row.type)}</Typography>
                  <Typography variant="body2" color="text.secondary">{text(row.description)}</Typography>
                  {text(row.fileUrl) ? (
                    <Button
                      href={text(row.fileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      variant="outlined"
                      sx={{ alignSelf: 'flex-start' }}
                      onClick={() => {
                        const storeIndex = Number(row.__storeIndex);
                        const current = documentRows[storeIndex];
                        if (current) updateDocumentRow(storeIndex, { ...current, downloads: amount(current.downloads) + 1 });
                      }}
                    >
                      Mở tài liệu
                    </Button>
                  ) : <Typography variant="caption" color="text.disabled">Quản trị viên chưa gắn liên kết tệp.</Typography>}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    ) : <Alert severity="info">Chưa có tài liệu được cấp cho đại lý của bạn.</Alert>;
  };

  return (
    <>
      <Helmet><title>{heading.title} | Cổng đại lý LUXE Sofa</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f6f3ef', py: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
            <Paper sx={{ width: { xs: 1, md: 260 }, p: 2.5, borderRadius: 3, flexShrink: 0 }}>
              <Stack spacing={2.5}>
                <Box component="img" src="/logo.svg" alt="LUXE Sofa" sx={{ width: 150 }} />
                <Divider />
                <Stack spacing={0.5}>
                  {NAV.map((item) => (
                    <Button
                      key={item.path}
                      component={RouterLink}
                      to={item.path}
                      color={section === item.path ? 'primary' : 'inherit'}
                      variant={section === item.path ? 'contained' : 'text'}
                      startIcon={<Iconify icon={item.icon} />}
                      sx={{ justifyContent: 'flex-start', px: 1.5 }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
                <Divider />
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">{displayName}</Typography>
                  <Typography variant="caption" color="text.secondary">{demoSession.email}</Typography>
                  <Typography variant="caption" color="text.secondary">Hạng {text(portal.profile.level) || 'chưa xếp hạng'}</Typography>
                </Stack>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    clearSofa2DemoSession();
                    navigate('/sofa2/b2b');
                  }}
                >
                  Đăng xuất
                </Button>
                <Button component={RouterLink} to="/sofa2/b2b" variant="text" size="small">Trang LUXE Sofa</Button>
              </Stack>
            </Paper>

            <Stack spacing={3} sx={{ width: 1, minWidth: 0 }}>
              <Paper sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="overline" color="text.secondary">CỔNG ĐẠI LÝ LUXE SOFA</Typography>
                    <Typography variant="h4">{heading.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{heading.description}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Xin chào, {displayName}</Typography>
                </Stack>
              </Paper>
              {content()}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
