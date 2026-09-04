import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const sofa6NavData = [
  { title: 'Trang chủ', path: '/sofa6', icon: <Iconify width={22} icon="solar:home-2-bold-duotone" /> },
  {
    title: 'Giới thiệu công ty',
    path: '/sofa6/about',
    icon: <Iconify width={22} icon="solar:info-circle-bold-duotone" />,
  },
  {
    title: 'Tất cả sản phẩm',
    path: '/sofa6/products',
    icon: <Iconify width={22} icon="solar:bag-check-bold-duotone" />,
  },
  {
    title: 'Bộ sưu tập',
    path: '/sofa6#collections',
    icon: <Iconify width={22} icon="solar:leaf-bold-duotone" />,
  },
  {
    title: 'Sản phẩm',
    path: '/sofa6#products',
    icon: <Iconify width={22} icon="solar:armchair-bold-duotone" />,
  },
  {
    title: 'Chế tác',
    path: '/sofa6#craft',
    icon: <Iconify width={22} icon="solar:hand-stars-bold-duotone" />,
  },
  {
    title: 'Không gian',
    path: '/sofa6#gallery',
    icon: <Iconify width={22} icon="solar:gallery-bold-duotone" />,
  },
  {
    title: 'Đánh giá',
    path: '/sofa6#testimonials',
    icon: <Iconify width={22} icon="solar:star-bold-duotone" />,
  },
  {
    title: 'Liên hệ',
    path: paths.contact,
    icon: <Iconify width={22} icon="solar:phone-bold-duotone" />,
  },
  {
    title: 'Quản trị',
    path: '/sofa6/admin',
    icon: <Iconify width={22} icon="solar:widget-5-bold-duotone" />,
    children: [
      { title: 'Tổng quan', path: '/sofa6/admin' },
      { title: 'CMS', path: '/sofa6/admin/cms/home' },
      { title: 'Sản phẩm', path: '/sofa6/admin/catalog/products' },
      { title: 'Kho hàng', path: '/sofa6/admin/warehouse/overview' },
      { title: 'Đơn hàng', path: '/sofa6/admin/orders/orders' },
      { title: 'CRM', path: '/sofa6/admin/crm/customers' },
      { title: 'Marketing', path: '/sofa6/admin/marketing/email' },
      { title: 'Analytics', path: '/sofa6/admin/analytics/revenue' },
      { title: 'SEO', path: '/sofa6/admin/seo/sitemap' },
      { title: 'Phân quyền', path: '/sofa6/admin/access/users' },
      { title: 'Báo cáo tổng hợp', path: '/sofa6/admin/tools/reports' },
      { title: 'Cài đặt hệ thống', path: '/sofa6/admin/tools/settings' },
    ],
  },

];
