import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

const endpoint = String(import.meta.env.VITE_SEARCH_CONSOLE_API_URL ?? '').trim();

type SearchConsoleMetrics = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type SearchConsoleResponse = {
  source?: string;
  rangeDays?: number;
  fetchedAt?: string;
  totals: SearchConsoleMetrics;
  topPages?: Array<SearchConsoleMetrics & { page: string }>;
};

const numberFormat = new Intl.NumberFormat('vi-VN');

const ctrFormat = (value: number) => `${(value <= 1 ? value * 100 : value).toFixed(2)}%`;

export function Sofa2SearchConsolePanel() {
  const [data, setData] = useState<SearchConsoleResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    if (!endpoint) return undefined;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetch(`${endpoint}${endpoint.includes('?') ? '&' : '?'}days=28`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Search Console API trả về HTTP ${response.status}.`);
        const payload = await response.json() as SearchConsoleResponse;
        if (!payload?.totals || !Number.isFinite(Number(payload.totals.clicks))) {
          throw new Error('Dữ liệu Search Console không đúng định dạng tích hợp.');
        }
        setData(payload);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setData(null);
          setError(requestError instanceof Error ? requestError.message : 'Không tải được Search Console.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reloadToken]);

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={1}>
          <Stack spacing={0.5}>
            <Typography variant="h6">Google Search Console · 28 ngày gần nhất</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {data?.fetchedAt ? `Cập nhật ${new Date(data.fetchedAt).toLocaleString('vi-VN')}` : 'Báo cáo truy vấn tìm kiếm tự nhiên từ API được xác thực phía máy chủ.'}
            </Typography>
          </Stack>
          <Button size="small" variant="outlined" onClick={reload} disabled={!endpoint || loading} startIcon={<Iconify icon="solar:restart-bold" />}>
            Làm mới
          </Button>
        </Stack>

        {!endpoint && (
          <Alert severity="info">
            Chưa kết nối dữ liệu thật. Cấu hình <code>VITE_SEARCH_CONSOLE_API_URL</code> trỏ đến API backend đã xác thực với Google Search Console; không đặt service-account key trong trình duyệt.
          </Alert>
        )}
        {!!error && <Alert severity="error">{error}</Alert>}
        {loading && <Alert severity="info">Đang tải báo cáo Search Console…</Alert>}

        {data && (
          <>
            <Grid container spacing={2}>
              {[
                { label: 'Lượt nhấp', value: numberFormat.format(data.totals.clicks) },
                { label: 'Lượt hiển thị', value: numberFormat.format(data.totals.impressions) },
                { label: 'CTR trung bình', value: ctrFormat(data.totals.ctr) },
                { label: 'Vị trí trung bình', value: Number(data.totals.position).toFixed(1) },
              ].map((metric) => (
                <Grid key={metric.label} xs={6} md={3}>
                  <Card variant="outlined" sx={{ p: 2, height: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{metric.label}</Typography>
                    <Typography variant="h5">{metric.value}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {!!data.topPages?.length && (
              <Stack spacing={1}>
                <Typography variant="subtitle2">Trang có nhiều lượt nhấp</Typography>
                {data.topPages.slice(0, 5).map((row) => (
                  <Stack key={row.page} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.5} sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{row.page}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {numberFormat.format(row.clicks)} clicks · {numberFormat.format(row.impressions)} impressions · CTR {ctrFormat(row.ctr)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Card>
  );
}
