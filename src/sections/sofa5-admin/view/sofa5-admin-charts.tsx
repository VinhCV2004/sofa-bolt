import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { Chart, useChart } from 'src/components/chart';

import { SOFA5_ADMIN_THEME } from './sofa5-admin-layout';

// ----------------------------------------------------------------------

const { ACCENT, SURFACE } = SOFA5_ADMIN_THEME;

const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9'];

export function Sofa5AdminCharts() {
  const revenueOptions = useChart({
    colors: [ACCENT],
    xaxis: { categories: MONTHS },
    stroke: { width: 3 },
    yaxis: { labels: { formatter: (value: number) => `${value} tỷ` } },
    tooltip: { y: { formatter: (value: number) => `${value} tỷ đồng` } },
  });

  const channelOptions = useChart({
    colors: [ACCENT, SURFACE, '#8A6B3D', '#D9C79A'],
    labels: ['Showroom', 'Website', 'Đại lý', 'Dự án B2B'],
    legend: { position: 'bottom' },
    tooltip: { y: { formatter: (value: number) => `${value}%` } },
  });

  const ordersOptions = useChart({
    colors: [ACCENT, '#8A6B3D'],
    xaxis: { categories: MONTHS },
    plotOptions: { bar: { columnWidth: '48%', borderRadius: 4 } },
  });

  return (
    <>
      <Grid xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Doanh thu 9 tháng
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Đơn vị: tỷ đồng
          </Typography>
          <Chart
            type="area"
            height={300}
            series={[{ name: 'Doanh thu', data: [3.2, 3.8, 4.1, 3.9, 4.8, 5.2, 5.0, 5.9, 6.4] }]}
            options={revenueOptions}
          />
        </Card>
      </Grid>

      <Grid xs={12} md={4}>
        <Card sx={{ p: 3, height: 1 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Nguồn doanh thu
          </Typography>
          <Chart type="donut" height={300} series={[42, 28, 18, 12]} options={channelOptions} />
        </Card>
      </Grid>

      <Grid xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Đơn hàng & đơn hoàn tất theo tháng
          </Typography>
          <Chart
            type="bar"
            height={300}
            series={[
              { name: 'Đơn tạo mới', data: [82, 96, 104, 98, 121, 133, 128, 149, 162] },
              { name: 'Đơn hoàn tất', data: [70, 84, 95, 88, 110, 121, 118, 137, 150] },
            ]}
            options={ordersOptions}
          />
        </Card>
      </Grid>
    </>
  );
}
