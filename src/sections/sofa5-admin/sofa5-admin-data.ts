// SOFA5 ADMIN — cấu hình khu vực quản trị (dữ liệu demo)
// Theme: Gold & Charcoal — "Sofa Royale"
// ----------------------------------------------------------------------

export const SOFA5_ADMIN_ROOT = '/sofa5/admin';

export type Sofa5AdminColumn = { key: string; label: string; type?: 'text' | 'status' | 'money' | 'number' };

export type Sofa5AdminModule = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  stats: { label: string; value: string; trend?: string }[];
  columns: Sofa5AdminColumn[];
  rows: Record<string, string | number>[];
  actions?: string[];
};

export type Sofa5AdminGroup = {
  slug: string;
  name: string;
  icon: string;
  modules: Sofa5AdminModule[];
};

const money = (v: number) => v;

function mod(
  slug: string,
  name: string,
  description: string,
  icon: string,
  stats: Sofa5AdminModule['stats'],
  columns: Sofa5AdminColumn[],
  rows: Record<string, string | number>[],
  actions?: string[]
): Sofa5AdminModule {
  return { slug, name, description, icon, stats, columns, rows, actions };
}

const STATUS_COL: Sofa5AdminColumn = { key: 'status', label: 'Trạng thái', type: 'status' };

// ----------------------------------------------------------------------
// CMS
// ----------------------------------------------------------------------

const cmsPage = (slug: string, name: string, path: string) =>
  mod(
    slug,
    name,
    `Quản lý nội dung, bố cục và trạng thái xuất bản cho ${name.toLowerCase()} (${path}).`,
    'solar:document-text-bold-duotone',
    [
      { label: 'Khối nội dung', value: '14' },
      { label: 'Lượt xem 30 ngày', value: '24.6K', trend: '+18%' },
      { label: 'Bản nháp', value: '3' },
      { label: 'Cập nhật cuối', value: '12/08' },
    ],
    [
      { key: 'block', label: 'Khối nội dung' },
      { key: 'type', label: 'Loại' },
      STATUS_COL,
      { key: 'updated', label: 'Cập nhật' },
      { key: 'author', label: 'Người sửa' },
    ],
    [
      { block: 'Hero Royale Gold', type: 'Banner', status: 'Đã xuất bản', updated: '12/08/2026', author: 'Ngọc Anh' },
      { block: 'Giới thiệu Sofa Royale', type: 'Rich text', status: 'Đã xuất bản', updated: '10/08/2026', author: 'Minh Quân' },
      { block: 'Bộ sưu tập Royale Noir', type: 'Danh sách SP', status: 'Bản nháp', updated: '09/08/2026', author: 'Thu Hà' },
      { block: 'Khách hàng thượng lưu', type: 'Slider', status: 'Đã xuất bản', updated: '02/08/2026', author: 'Ngọc Anh' },
      { block: 'CTA Bespoke Royale', type: 'Banner', status: 'Tạm ẩn', updated: '28/07/2026', author: 'Minh Quân' },
    ],
    ['Thêm khối', 'Xem trước', 'Xuất bản']
  );

const CMS_GROUP: Sofa5AdminGroup = {
  slug: 'cms',
  name: 'CMS',
  icon: 'solar:documents-bold-duotone',
  modules: [
    cmsPage('home', 'Trang chủ', '/sofa5'),
    cmsPage('about', 'Trang giới thiệu', '/sofa5/about'),
    cmsPage('contact', 'Trang liên hệ', '/sofa5/contact'),
    cmsPage('policy', 'Trang chính sách', '/sofa5/policy'),
    cmsPage('faq', 'Trang FAQ', '/sofa5/faq'),
    mod(
      'blog',
      'Trang blog',
      'Quản lý bài viết, chuyên mục, tác giả và lịch đăng bài.',
      'solar:notebook-bold-duotone',
      [
        { label: 'Bài viết', value: '186' },
        { label: 'Chờ duyệt', value: '8' },
        { label: 'Lượt đọc / tháng', value: '128K', trend: '+12%' },
        { label: 'Chuyên mục', value: '11' },
      ],
      [
        { key: 'title', label: 'Tiêu đề' },
        { key: 'category', label: 'Chuyên mục' },
        STATUS_COL,
        { key: 'views', label: 'Lượt đọc', type: 'number' },
        { key: 'updated', label: 'Ngày đăng' },
      ],
      [
        { title: 'Nghệ thuật mạ vàng 24K trên sofa', category: 'Chế tác', status: 'Đã xuất bản', views: 18420, updated: '11/08/2026' },
        { title: 'Bảo quản da bò Ý nguyên tấm', category: 'Bảo dưỡng', status: 'Đã xuất bản', views: 11200, updated: '05/08/2026' },
        { title: 'Xu hướng nội thất thượng lưu 2026', category: 'Xu hướng', status: 'Chờ duyệt', views: 0, updated: '13/08/2026' },
        { title: 'Gỗ óc chó Bắc Mỹ — đẳng cấp nội thất', category: 'Chất liệu', status: 'Bản nháp', views: 0, updated: '12/08/2026' },
      ],
      ['Viết bài', 'Duyệt bài']
    ),
    mod(
      'menu',
      'Menu',
      'Cấu trúc menu header, footer và menu mobile.',
      'solar:hamburger-menu-bold-duotone',
      [
        { label: 'Menu', value: '4' },
        { label: 'Mục menu', value: '58' },
        { label: 'Liên kết hỏng', value: '0' },
        { label: 'Cấp sâu nhất', value: '3' },
      ],
      [
        { key: 'menu', label: 'Menu' },
        { key: 'position', label: 'Vị trí' },
        { key: 'items', label: 'Số mục', type: 'number' },
        STATUS_COL,
      ],
      [
        { menu: 'Menu chính Royale', position: 'Header', items: 28, status: 'Đã xuất bản' },
        { menu: 'Menu bộ sưu tập', position: 'Header', items: 20, status: 'Đã xuất bản' },
        { menu: 'Menu footer', position: 'Footer', items: 10, status: 'Đã xuất bản' },
        { menu: 'Menu mobile', position: 'Mobile', items: 14, status: 'Bản nháp' },
      ],
      ['Thêm menu']
    ),
    mod(
      'banner',
      'Banner',
      'Banner khuyến mãi theo vị trí và lịch hiển thị.',
      'solar:gallery-wide-bold-duotone',
      [
        { label: 'Banner đang chạy', value: '8' },
        { label: 'CTR trung bình', value: '4.1%', trend: '+0.8%' },
        { label: 'Hết hạn tuần này', value: '2' },
        { label: 'Vị trí', value: '7' },
      ],
      [
        { key: 'name', label: 'Banner' },
        { key: 'position', label: 'Vị trí' },
        { key: 'schedule', label: 'Lịch chạy' },
        STATUS_COL,
      ],
      [
        { name: 'Royale Gold — Giảm 25%', position: 'Top bar', schedule: '01/08 – 31/08', status: 'Đang chạy' },
        { name: 'White-Glove miễn phí', position: 'Trang chủ', schedule: 'Không giới hạn', status: 'Đang chạy' },
        { name: 'Bộ sưu tập Royale Noir', position: 'Danh mục', schedule: '05/08 – 20/08', status: 'Đang chạy' },
        { name: 'Bespoke Royale — Đặt may độc quyền', position: 'Chi tiết SP', schedule: '01/07 – 31/07', status: 'Hết hạn' },
      ],
      ['Tạo banner']
    ),
    mod(
      'slider',
      'Slider',
      'Slideshow trang chủ và trang danh mục.',
      'solar:slider-horizontal-bold-duotone',
      [
        { label: 'Slider', value: '4' },
        { label: 'Slide', value: '18' },
        { label: 'Thời gian chuyển', value: '7s' },
        { label: 'Lượt click', value: '6.8K' },
      ],
      [
        { key: 'name', label: 'Slider' },
        { key: 'slides', label: 'Số slide', type: 'number' },
        { key: 'page', label: 'Trang áp dụng' },
        STATUS_COL,
      ],
      [
        { name: 'Hero trang chủ Royale', slides: 6, page: 'Trang chủ', status: 'Đã xuất bản' },
        { name: 'Bộ sưu tập Royale Gold', slides: 7, page: 'Bộ sưu tập', status: 'Đã xuất bản' },
        { name: 'Showroom 360°', slides: 5, page: 'Showroom', status: 'Bản nháp' },
      ],
      ['Tạo slider']
    ),
    mod(
      'seo',
      'SEO nội dung',
      'Thẻ tiêu đề, mô tả và ảnh chia sẻ cho từng trang tĩnh.',
      'solar:magnifer-bold-duotone',
      [
        { label: 'Trang đã tối ưu', value: '92%' },
        { label: 'Thiếu meta', value: '4' },
        { label: 'Điểm SEO', value: '95/100', trend: '+5' },
        { label: 'Từ khoá top 10', value: '168' },
      ],
      [
        { key: 'page', label: 'Trang' },
        { key: 'title', label: 'Meta title' },
        { key: 'length', label: 'Độ dài', type: 'number' },
        STATUS_COL,
      ],
      [
        { page: '/sofa5', title: 'SOFA5 Royale — Sofa da Ý cao cấp', length: 58, status: 'Tốt' },
        { page: '/sofa5/about', title: 'Về Sofa Royale | SOFA5', length: 44, status: 'Tốt' },
        { page: '/sofa5/faq', title: '', length: 0, status: 'Thiếu meta' },
        { page: '/sofa5/policy', title: 'Chính sách mua hàng SOFA5 Royale', length: 52, status: 'Tốt' },
      ],
      ['Quét lại']
    ),
    mod(
      'static-pages',
      'Trang tĩnh',
      'Các trang nội dung tự tạo ngoài cấu trúc mặc định.',
      'solar:file-text-bold-duotone',
      [
        { label: 'Trang tĩnh', value: '22' },
        { label: 'Đã xuất bản', value: '18' },
        { label: 'Bản nháp', value: '4' },
        { label: 'Lượt xem', value: '38K' },
      ],
      [
        { key: 'title', label: 'Tiêu đề' },
        { key: 'slug', label: 'Đường dẫn' },
        STATUS_COL,
        { key: 'updated', label: 'Cập nhật' },
      ],
      [
        { title: 'Hướng dẫn bảo quản da Ý', slug: '/sofa5/huong-dan-da-y', status: 'Đã xuất bản', updated: '08/08/2026' },
        { title: 'Cam kết chất liệu Royale', slug: '/sofa5/cam-ket-chat-lieu', status: 'Đã xuất bản', updated: '01/08/2026' },
        { title: 'Bespoke — Đặt may độc quyền', slug: '/sofa5/bespoke', status: 'Bản nháp', updated: '13/08/2026' },
      ],
      ['Tạo trang']
    ),
  ],
};

// ----------------------------------------------------------------------
// SẢN PHẨM
// ----------------------------------------------------------------------

const PRODUCT_GROUP: Sofa5AdminGroup = {
  slug: 'catalog',
  name: 'Sản phẩm',
  icon: 'solar:box-bold-duotone',
  modules: [
    mod(
      'categories',
      'Danh mục',
      'Cây danh mục sản phẩm và thứ tự hiển thị.',
      'solar:folder-with-files-bold-duotone',
      [
        { label: 'Danh mục', value: '18' },
        { label: 'Danh mục cha', value: '5' },
        { label: 'Sản phẩm gán', value: '286' },
        { label: 'Ẩn', value: '1' },
      ],
      [
        { key: 'name', label: 'Danh mục' },
        { key: 'parent', label: 'Danh mục cha' },
        { key: 'products', label: 'Sản phẩm', type: 'number' },
        STATUS_COL,
      ],
      [
        { name: 'Royale Gold', parent: 'Bộ sưu tập', products: 48, status: 'Hiển thị' },
        { name: 'Royale Noir', parent: 'Bộ sưu tập', products: 36, status: 'Hiển thị' },
        { name: 'Royale Ivory', parent: 'Bộ sưu tập', products: 28, status: 'Hiển thị' },
        { name: 'Sofa da Ý', parent: 'Theo chất liệu', products: 62, status: 'Hiển thị' },
        { name: 'Sofa velour', parent: 'Theo chất liệu', products: 24, status: 'Hiển thị' },
      ],
      ['Thêm danh mục']
    ),
    mod(
      'products',
      'Sản phẩm',
      'Danh sách sản phẩm, hình ảnh, mô tả và trạng thái bán.',
      'solar:armchair-bold-duotone',
      [
        { label: 'Sản phẩm', value: '286' },
        { label: 'Đang bán', value: '268' },
        { label: 'Hết hàng', value: '8' },
        { label: 'Mới tháng này', value: '16', trend: '+16' },
      ],
      [
        { key: 'sku', label: 'SKU' },
        { key: 'name', label: 'Tên sản phẩm' },
        { key: 'collection', label: 'Bộ sưu tập' },
        { key: 'price', label: 'Giá bán', type: 'money' },
        STATUS_COL,
      ],
      [
        { sku: 'SR-LOUIS-01', name: 'Sofa Royale Louis', collection: 'Royale Gold', price: money(45000000), status: 'Đang bán' },
        { sku: 'SR-VELVET-02', name: 'Sofa Royale Velvet', collection: 'Royale Noir', price: money(38000000), status: 'Đang bán' },
        { sku: 'SR-PEARL-03', name: 'Sofa Royale Pearl', collection: 'Royale Ivory', price: money(32000000), status: 'Đang bán' },
        { sku: 'SR-EMPIRE-04', name: 'Sofa Royale Empire', collection: 'Royale Gold', price: money(52000000), status: 'Hết hàng' },
        { sku: 'SR-ONYX-05', name: 'Sofa Royale Onyx', collection: 'Royale Noir', price: money(41000000), status: 'Đang bán' },
      ],
      ['Thêm sản phẩm', 'Nhập Excel']
    ),
    mod(
      'attributes',
      'Thuộc tính',
      'Bộ thuộc tính dùng để tạo biến thể: màu, chất liệu, kích thước.',
      'solar:tuning-square-bold-duotone',
      [
        { label: 'Nhóm thuộc tính', value: '8' },
        { label: 'Giá trị', value: '128' },
        { label: 'Dùng cho biến thể', value: '5' },
        { label: 'Bộ lọc mặt tiền', value: '4' },
      ],
      [
        { key: 'name', label: 'Thuộc tính' },
        { key: 'values', label: 'Số giá trị', type: 'number' },
        { key: 'usage', label: 'Áp dụng' },
        STATUS_COL,
      ],
      [
        { name: 'Màu sắc', values: 24, usage: 'Biến thể + Bộ lọc', status: 'Hoạt động' },
        { name: 'Chất liệu', values: 10, usage: 'Biến thể + Bộ lọc', status: 'Hoạt động' },
        { name: 'Kích thước', values: 14, usage: 'Biến thể', status: 'Hoạt động' },
        { name: 'Loại da', values: 6, usage: 'Tuỳ chọn', status: 'Hoạt động' },
        { name: 'Loại gỗ', values: 8, usage: 'Tuỳ chọn', status: 'Tạm ẩn' },
      ],
      ['Thêm thuộc tính']
    ),
    mod(
      'variants',
      'Biến thể sản phẩm',
      'Tổ hợp SKU theo màu, chất liệu và kích thước.',
      'solar:layers-bold-duotone',
      [
        { label: 'Biến thể', value: '986' },
        { label: 'Có tồn kho', value: '860' },
        { label: 'Cảnh báo tồn', value: '28' },
        { label: 'Ngừng bán', value: '18' },
      ],
      [
        { key: 'sku', label: 'SKU biến thể' },
        { key: 'product', label: 'Sản phẩm gốc' },
        { key: 'option', label: 'Tuỳ chọn' },
        { key: 'stock', label: 'Tồn', type: 'number' },
        { key: 'price', label: 'Giá', type: 'money' },
      ],
      [
        { sku: 'SR-LOUIS-01-GOLD', product: 'Sofa Royale Louis', option: 'Da bò Ý / Vàng / 3m0', stock: 8, price: money(45000000) },
        { sku: 'SR-LOUIS-01-NOIR', product: 'Sofa Royale Louis', option: 'Da bò Ý / Đen / 3m0', stock: 3, price: money(46000000) },
        { sku: 'SR-VELVET-02-NOIR', product: 'Sofa Royale Velvet', option: 'Velour Ý / Đen / 2m8', stock: 16, price: money(38000000) },
        { sku: 'SR-PEARL-03-IVORY', product: 'Sofa Royale Pearl', option: 'Linen Ý / Ngà / 2m6', stock: 0, price: money(32000000) },
      ],
      ['Tạo biến thể']
    ),
    mod(
      'inventory',
      'Kho hàng',
      'Tồn kho theo sản phẩm tại từng kho/showroom.',
      'solar:box-minimalistic-bold-duotone',
      [
        { label: 'Tổng tồn', value: '2.640' },
        { label: 'Sắp hết', value: '28' },
        { label: 'Hết hàng', value: '8' },
        { label: 'Giá trị tồn', value: '22.8 tỷ' },
      ],
      [
        { key: 'sku', label: 'SKU' },
        { key: 'warehouse', label: 'Kho' },
        { key: 'stock', label: 'Tồn', type: 'number' },
        { key: 'reserved', label: 'Đang giữ', type: 'number' },
        STATUS_COL,
      ],
      [
        { sku: 'SR-LOUIS-01-GOLD', warehouse: 'Kho Royale HN', stock: 8, reserved: 2, status: 'Đủ hàng' },
        { sku: 'SR-VELVET-02-NOIR', warehouse: 'Kho Royale HCM', stock: 16, reserved: 4, status: 'Đủ hàng' },
        { sku: 'SR-PEARL-03-IVORY', warehouse: 'Kho Royale HCM', stock: 0, reserved: 0, status: 'Hết hàng' },
        { sku: 'SR-EMPIRE-04-GOLD', warehouse: 'Showroom Royale HN', stock: 2, reserved: 1, status: 'Sắp hết' },
      ],
      ['Nhập kho', 'Kiểm kê']
    ),
    mod(
      'pricing',
      'Giá bán',
      'Bảng giá niêm yết, giá khuyến mãi và giá đại lý.',
      'solar:tag-price-bold-duotone',
      [
        { label: 'Bảng giá', value: '4' },
        { label: 'SP đang giảm giá', value: '48' },
        { label: 'Giảm trung bình', value: '22%' },
        { label: 'Biên lợi nhuận', value: '38%', trend: '+3%' },
      ],
      [
        { key: 'sku', label: 'SKU' },
        { key: 'list', label: 'Giá niêm yết', type: 'money' },
        { key: 'sale', label: 'Giá bán', type: 'money' },
        { key: 'dealer', label: 'Giá đại lý', type: 'money' },
        STATUS_COL,
      ],
      [
        { sku: 'SR-LOUIS-01', list: money(58000000), sale: money(45000000), dealer: money(39600000), status: 'Đang giảm' },
        { sku: 'SR-VELVET-02', list: money(49000000), sale: money(38000000), dealer: money(33440000), status: 'Đang giảm' },
        { sku: 'SR-EMPIRE-04', list: money(65000000), sale: money(52000000), dealer: money(45760000), status: 'Đang giảm' },
        { sku: 'SR-ONYX-05', list: money(41000000), sale: money(41000000), dealer: money(36080000), status: 'Giá gốc' },
      ],
      ['Tạo bảng giá']
    ),
  ],
};

// ----------------------------------------------------------------------
// KHO HÀNG
// ----------------------------------------------------------------------

const WAREHOUSE_GROUP: Sofa5AdminGroup = {
  slug: 'warehouse',
  name: 'Kho hàng',
  icon: 'solar:warehouse-bold-duotone',
  modules: [
    mod(
      'overview',
      'Tổng quan kho',
      'Tình trạng tồn kho toàn hệ thống theo từng kho và showroom.',
      'solar:chart-square-bold-duotone',
      [
        { label: 'Kho', value: '5' },
        { label: 'Tổng tồn', value: '2.640' },
        { label: 'Đơn chờ xuất', value: '42' },
        { label: 'Tỷ lệ lấp đầy', value: '68%' },
      ],
      [
        { key: 'warehouse', label: 'Kho' },
        { key: 'city', label: 'Khu vực' },
        { key: 'stock', label: 'Tồn', type: 'number' },
        { key: 'fill', label: 'Lấp đầy' },
        STATUS_COL,
      ],
      [
        { warehouse: 'Kho Royale Hà Nội', city: 'Hà Nội', stock: 980, fill: '74%', status: 'Hoạt động' },
        { warehouse: 'Kho Royale HCM', city: 'HCM', stock: 860, fill: '79%', status: 'Hoạt động' },
        { warehouse: 'Showroom Royale HN', city: 'Hà Nội', stock: 320, fill: '52%', status: 'Hoạt động' },
        { warehouse: 'Showroom Royale HCM', city: 'HCM', stock: 280, fill: '48%', status: 'Hoạt động' },
        { warehouse: 'Kho ký gửi đại lý', city: 'Toàn quốc', stock: 200, fill: '41%', status: 'Hoạt động' },
      ],
      ['Thêm kho']
    ),
    mod(
      'receipts',
      'Nhập – Xuất kho',
      'Phiếu nhập từ xưởng chế tác và phiếu xuất giao khách.',
      'solar:import-bold-duotone',
      [
        { label: 'Phiếu tháng này', value: '142' },
        { label: 'Chờ duyệt', value: '6' },
        { label: 'Giá trị nhập', value: '6.8 tỷ' },
        { label: 'Giá trị xuất', value: '7.2 tỷ' },
      ],
      [
        { key: 'code', label: 'Mã phiếu' },
        { key: 'type', label: 'Loại' },
        { key: 'warehouse', label: 'Kho' },
        { key: 'value', label: 'Giá trị', type: 'money' },
        STATUS_COL,
      ],
      [
        { code: 'PN-2608-018', type: 'Nhập', warehouse: 'Kho Royale HN', value: money(682000000), status: 'Hoàn tất' },
        { code: 'PX-2608-104', type: 'Xuất', warehouse: 'Kho Royale HCM', value: money(186000000), status: 'Hoàn tất' },
        { code: 'PN-2608-019', type: 'Nhập', warehouse: 'Showroom Royale HN', value: money(124000000), status: 'Chờ duyệt' },
        { code: 'PX-2608-105', type: 'Xuất', warehouse: 'Kho Royale HN', value: money(45000000), status: 'Đang xử lý' },
      ],
      ['Tạo phiếu nhập', 'Tạo phiếu xuất']
    ),
    mod(
      'transfers',
      'Chuyển kho & Kiểm kê',
      'Điều chuyển hàng giữa các kho và biên bản kiểm kê định kỳ.',
      'solar:transfer-horizontal-bold-duotone',
      [
        { label: 'Lệnh chuyển', value: '24' },
        { label: 'Đang vận chuyển', value: '5' },
        { label: 'Lệch kiểm kê', value: '2' },
        { label: 'Kiểm kê gần nhất', value: '31/07' },
      ],
      [
        { key: 'code', label: 'Mã lệnh' },
        { key: 'from', label: 'Từ kho' },
        { key: 'to', label: 'Đến kho' },
        { key: 'items', label: 'Số món', type: 'number' },
        STATUS_COL,
      ],
      [
        { code: 'CK-0814', from: 'Kho Royale HCM', to: 'Showroom Royale HCM', items: 12, status: 'Đang vận chuyển' },
        { code: 'CK-0813', from: 'Kho Royale HN', to: 'Showroom Royale HN', items: 8, status: 'Hoàn tất' },
        { code: 'KK-0804', from: 'Kho Royale HN', to: '—', items: 320, status: 'Lệch 2 món' },
      ],
      ['Tạo lệnh chuyển', 'Mở kiểm kê']
    ),
  ],
};

// ----------------------------------------------------------------------
// ĐƠN HÀNG
// ----------------------------------------------------------------------

const ORDER_GROUP: Sofa5AdminGroup = {
  slug: 'orders',
  name: 'Đơn hàng',
  icon: 'solar:cart-large-2-bold-duotone',
  modules: [
    mod(
      'orders',
      'Đơn hàng',
      'Toàn bộ đơn hàng online, showroom và đại lý.',
      'solar:bill-list-bold-duotone',
      [
        { label: 'Đơn tháng này', value: '328', trend: '+16%' },
        { label: 'Chờ xác nhận', value: '18' },
        { label: 'Doanh thu', value: '8.2 tỷ', trend: '+14%' },
        { label: 'Giá trị TB/đơn', value: '25.0 tr' },
      ],
      [
        { key: 'code', label: 'Mã đơn' },
        { key: 'customer', label: 'Khách hàng' },
        { key: 'channel', label: 'Kênh' },
        { key: 'total', label: 'Tổng tiền', type: 'money' },
        STATUS_COL,
      ],
      [
        { code: 'SR-26081201', customer: 'Tôn Nữ Trang', channel: 'Showroom HN', total: money(45000000), status: 'Đang giao' },
        { code: 'SR-26081198', customer: 'Richard Chen', channel: 'Website', total: money(52000000), status: 'Hoàn tất' },
        { code: 'SR-26081195', customer: 'Lý Phương Anh', channel: 'Showroom HCM', total: money(38000000), status: 'Chờ xác nhận' },
        { code: 'SR-26081190', customer: 'Ngô Bảo Trân', channel: 'Website', total: money(32000000), status: 'Đã huỷ' },
      ],
      ['Tạo đơn', 'Xuất Excel']
    ),
    mod(
      'payments',
      'Thanh toán',
      'Giao dịch thanh toán, đối soát cổng và trả góp.',
      'solar:card-transfer-bold-duotone',
      [
        { label: 'Giao dịch tháng', value: '342' },
        { label: 'Thành công', value: '97.8%' },
        { label: 'Chờ đối soát', value: '12' },
        { label: 'Trả góp', value: '48 đơn' },
      ],
      [
        { key: 'txn', label: 'Mã giao dịch' },
        { key: 'order', label: 'Đơn hàng' },
        { key: 'method', label: 'Phương thức' },
        { key: 'amount', label: 'Số tiền', type: 'money' },
        STATUS_COL,
      ],
      [
        { txn: 'TXN-90218', order: 'SR-26081201', method: 'Chuyển khoản', amount: money(45000000), status: 'Thành công' },
        { txn: 'TXN-90215', order: 'SR-26081198', method: 'VNPay', amount: money(52000000), status: 'Thành công' },
        { txn: 'TXN-90212', order: 'SR-26081195', method: 'Thẻ quốc tế', amount: money(38000000), status: 'Chờ đối soát' },
        { txn: 'TXN-90208', order: 'SR-26081190', method: 'Thẻ quốc tế', amount: money(32000000), status: 'Thất bại' },
      ],
      ['Đối soát']
    ),
    mod(
      'shipping',
      'Vận chuyển',
      'Điều phối giao lắp white-glove, đối tác vận chuyển và lịch lắp đặt.',
      'solar:delivery-bold-duotone',
      [
        { label: 'Đơn đang giao', value: '42' },
        { label: 'Giao đúng hẹn', value: '96%' },
        { label: 'Đội white-glove', value: '8' },
        { label: 'Phí VC tháng', value: '248 tr' },
      ],
      [
        { key: 'code', label: 'Vận đơn' },
        { key: 'order', label: 'Đơn hàng' },
        { key: 'carrier', label: 'Đội giao' },
        { key: 'eta', label: 'Dự kiến' },
        STATUS_COL,
      ],
      [
        { code: 'VD-50118', order: 'SR-26081201', carrier: 'White-Glove HN', eta: '16/08/2026', status: 'Đang giao' },
        { code: 'VD-50115', order: 'SR-26081198', carrier: 'White-Glove HCM', eta: '12/08/2026', status: 'Đã giao' },
        { code: 'VD-50110', order: 'SR-26081195', carrier: 'White-Glove HCM', eta: '20/08/2026', status: 'Chờ lấy hàng' },
      ],
      ['Tạo vận đơn']
    ),
    mod(
      'refunds',
      'Hoàn tiền',
      'Yêu cầu hoàn tiền và tiến trình xử lý.',
      'solar:money-bag-bold-duotone',
      [
        { label: 'Yêu cầu tháng', value: '8' },
        { label: 'Đã hoàn', value: '6' },
        { label: 'Giá trị hoàn', value: '128 tr' },
        { label: 'Thời gian TB', value: '2.4 ngày' },
      ],
      [
        { key: 'code', label: 'Mã yêu cầu' },
        { key: 'order', label: 'Đơn hàng' },
        { key: 'reason', label: 'Lý do' },
        { key: 'amount', label: 'Số tiền', type: 'money' },
        STATUS_COL,
      ],
      [
        { code: 'HT-2608-06', order: 'SR-26081190', reason: 'Khách huỷ đơn', amount: money(32000000), status: 'Đã hoàn' },
        { code: 'HT-2608-07', order: 'SR-26081148', reason: 'Sai màu da', amount: money(8500000), status: 'Đang xử lý' },
        { code: 'HT-2608-08', order: 'SR-26081132', reason: 'Giao trễ hẹn', amount: money(2400000), status: 'Chờ duyệt' },
      ],
      ['Duyệt hoàn tiền']
    ),
    mod(
      'returns',
      'Đổi trả',
      'Yêu cầu đổi/trả sản phẩm và tình trạng hàng hoàn.',
      'solar:restart-bold-duotone',
      [
        { label: 'Yêu cầu tháng', value: '6' },
        { label: 'Tỷ lệ đổi trả', value: '1.2%' },
        { label: 'Đang thu hồi', value: '2' },
        { label: 'Tái nhập kho', value: '3' },
      ],
      [
        { key: 'code', label: 'Mã yêu cầu' },
        { key: 'product', label: 'Sản phẩm' },
        { key: 'type', label: 'Loại' },
        { key: 'reason', label: 'Lý do' },
        STATUS_COL,
      ],
      [
        { code: 'DT-2608-03', product: 'Sofa Royale Velvet', type: 'Đổi màu', reason: 'Không hợp nội thất', status: 'Đang thu hồi' },
        { code: 'DT-2608-04', product: 'Sofa Royale Louis', type: 'Trả hàng', reason: 'Lỗi đường may', status: 'Đã tái nhập' },
        { code: 'DT-2608-05', product: 'Sofa Royale Pearl', type: 'Đổi size', reason: 'Không vừa phòng', status: 'Chờ duyệt' },
      ],
      ['Tạo yêu cầu']
    ),
  ],
};

// ----------------------------------------------------------------------
// CRM
// ----------------------------------------------------------------------

const CRM_GROUP: Sofa5AdminGroup = {
  slug: 'crm',
  name: 'CRM',
  icon: 'solar:users-group-rounded-bold-duotone',
  modules: [
    mod(
      'customers',
      'Khách hàng',
      'Hồ sơ khách hàng, phân hạng và giá trị vòng đời.',
      'solar:user-id-bold-duotone',
      [
        { label: 'Khách hàng', value: '8.640' },
        { label: 'Mới tháng này', value: '328', trend: '+12%' },
        { label: 'Khách Royale VIP', value: '186' },
        { label: 'LTV trung bình', value: '58 tr' },
      ],
      [
        { key: 'name', label: 'Khách hàng' },
        { key: 'phone', label: 'Điện thoại' },
        { key: 'tier', label: 'Hạng' },
        { key: 'spent', label: 'Chi tiêu', type: 'money' },
        STATUS_COL,
      ],
      [
        { name: 'Tôn Nữ Trang', phone: '0912 xxx 118', tier: 'Royale VIP', spent: money(124000000), status: 'Hoạt động' },
        { name: 'Richard Chen', phone: '0987 xxx 204', tier: 'Vàng', spent: money(52000000), status: 'Hoạt động' },
        { name: 'Lý Phương Anh', phone: '0905 xxx 882', tier: 'Bạc', spent: money(38000000), status: 'Hoạt động' },
        { name: 'Ngô Bảo Trân', phone: '0243 xxx 660', tier: 'Thường', spent: money(32000000), status: 'Ngưng tương tác' },
      ],
      ['Thêm khách hàng', 'Nhập danh bạ']
    ),
    mod(
      'leads',
      'Leads',
      'Khách tiềm năng từ form, hotline, showroom và quảng cáo.',
      'solar:magnet-bold-duotone',
      [
        { label: 'Lead tháng', value: '842' },
        { label: 'Đã liên hệ', value: '612' },
        { label: 'Tỷ lệ chốt', value: '22.4%', trend: '+3.2%' },
        { label: 'Lead nóng', value: '68' },
      ],
      [
        { key: 'name', label: 'Lead' },
        { key: 'source', label: 'Nguồn' },
        { key: 'interest', label: 'Quan tâm' },
        { key: 'owner', label: 'Phụ trách' },
        STATUS_COL,
      ],
      [
        { name: 'Phạm Bảo Ngọc', source: 'Instagram Ads', interest: 'Royale Gold', owner: 'Ngọc Anh', status: 'Lead nóng' },
        { name: 'Đỗ Văn Kiên', source: 'Google Ads', interest: 'Sofa da Ý', owner: 'Minh Quân', status: 'Đã liên hệ' },
        { name: 'Vũ Thanh Trúc', source: 'Showroom HCM', interest: 'Royale Noir', owner: 'Thu Hà', status: 'Đang tư vấn' },
        { name: 'Hoàng Gia Bảo', source: 'Zalo OA', interest: 'Bespoke Royale', owner: 'Chưa gán', status: 'Mới' },
      ],
      ['Thêm lead', 'Phân bổ']
    ),
    mod(
      'purchase-history',
      'Lịch sử mua hàng',
      'Dòng thời gian giao dịch của từng khách hàng.',
      'solar:history-bold-duotone',
      [
        { label: 'Giao dịch', value: '12.480' },
        { label: 'Khách mua lại', value: '42%' },
        { label: 'Chu kỳ mua lại', value: '12 tháng' },
        { label: 'Đơn/khách', value: '1.4' },
      ],
      [
        { key: 'customer', label: 'Khách hàng' },
        { key: 'order', label: 'Đơn hàng' },
        { key: 'date', label: 'Ngày mua' },
        { key: 'total', label: 'Giá trị', type: 'money' },
        STATUS_COL,
      ],
      [
        { customer: 'Tôn Nữ Trang', order: 'SR-26081201', date: '12/08/2026', total: money(45000000), status: 'Đang giao' },
        { customer: 'Tôn Nữ Trang', order: 'SR-25110428', date: '04/11/2025', total: money(78000000), status: 'Hoàn tất' },
        { customer: 'Richard Chen', order: 'SR-26081198', date: '11/08/2026', total: money(52000000), status: 'Hoàn tất' },
      ]
    ),
    mod(
      'care',
      'Chăm sóc khách hàng',
      'Ticket, lịch gọi lại, khảo sát hài lòng và bảo hành.',
      'solar:chat-round-call-bold-duotone',
      [
        { label: 'Ticket mở', value: '24' },
        { label: 'Thời gian phản hồi', value: '28 phút' },
        { label: 'CSAT', value: '4.9/5', trend: '+0.1' },
        { label: 'Bảo hành đang xử lý', value: '6' },
      ],
      [
        { key: 'ticket', label: 'Ticket' },
        { key: 'customer', label: 'Khách hàng' },
        { key: 'topic', label: 'Chủ đề' },
        { key: 'agent', label: 'Nhân viên' },
        STATUS_COL,
      ],
      [
        { ticket: 'TK-10021', customer: 'Ngô Bảo Trân', topic: 'Hoàn tiền đơn huỷ', agent: 'Thu Hà', status: 'Đang xử lý' },
        { ticket: 'TK-10018', customer: 'Tôn Nữ Trang', topic: 'Đặt lịch bảo dưỡng', agent: 'Ngọc Anh', status: 'Đã đóng' },
        { ticket: 'TK-10015', customer: 'Richard Chen', topic: 'Bảo hành khung gỗ', agent: 'Minh Quân', status: 'Chờ khách phản hồi' },
      ],
      ['Tạo ticket']
    ),
  ],
};

// ----------------------------------------------------------------------
// MARKETING
// ----------------------------------------------------------------------

const MARKETING_GROUP: Sofa5AdminGroup = {
  slug: 'marketing',
  name: 'Marketing',
  icon: 'solar:megaphone-bold-duotone',
  modules: [
    mod(
      'email',
      'Email Marketing',
      'Chiến dịch email, kịch bản tự động và hiệu quả gửi.',
      'solar:letter-bold-duotone',
      [
        { label: 'Chiến dịch', value: '18' },
        { label: 'Tỷ lệ mở', value: '42.6%', trend: '+4.2%' },
        { label: 'Tỷ lệ click', value: '8.4%' },
        { label: 'Doanh thu quy đổi', value: '1.2 tỷ' },
      ],
      [
        { key: 'campaign', label: 'Chiến dịch' },
        { key: 'segment', label: 'Tệp gửi' },
        { key: 'sent', label: 'Đã gửi', type: 'number' },
        { key: 'open', label: 'Tỷ lệ mở' },
        STATUS_COL,
      ],
      [
        { campaign: 'Royale Gold — Giảm 25%', segment: 'Toàn bộ khách', sent: 8640, open: '46%', status: 'Đã gửi' },
        { campaign: 'Bộ sưu tập Royale Noir', segment: 'Quan tâm velour', sent: 2180, open: '52%', status: 'Đã gửi' },
        { campaign: 'Nhắc giỏ hàng bỏ quên', segment: 'Tự động', sent: 486, open: '58%', status: 'Đang chạy' },
        { campaign: 'Chúc mừng sinh nhật VIP', segment: 'Tự động', sent: 142, open: '64%', status: 'Đang chạy' },
      ],
      ['Tạo chiến dịch']
    ),
    mod(
      'sms',
      'SMS Marketing',
      'Tin nhắn thương hiệu, OTP và chăm sóc sau bán.',
      'solar:chat-square-code-bold-duotone',
      [
        { label: 'Tin đã gửi', value: '32.6K' },
        { label: 'Tỷ lệ nhận', value: '98.8%' },
        { label: 'Chi phí tháng', value: '24 tr' },
        { label: 'Brandname', value: 'SOFA5' },
      ],
      [
        { key: 'campaign', label: 'Chiến dịch' },
        { key: 'segment', label: 'Tệp gửi' },
        { key: 'sent', label: 'Đã gửi', type: 'number' },
        { key: 'cost', label: 'Chi phí', type: 'money' },
        STATUS_COL,
      ],
      [
        { campaign: 'Flash sale cuối tuần Royale', segment: 'Khách HN + HCM', sent: 12400, cost: money(9680000), status: 'Đã gửi' },
        { campaign: 'Nhắc lịch bảo dưỡng', segment: 'Tự động', sent: 286, cost: money(200000), status: 'Đang chạy' },
        { campaign: 'Ưu đãi khách Royale VIP', segment: 'Hạng VIP', sent: 186, cost: money(130000), status: 'Lên lịch' },
      ],
      ['Tạo chiến dịch SMS']
    ),
    mod(
      'push',
      'Push Notification',
      'Thông báo đẩy web/app theo hành vi người dùng.',
      'solar:bell-bing-bold-duotone',
      [
        { label: 'Người đăng ký', value: '18.2K' },
        { label: 'Tỷ lệ click', value: '5.6%' },
        { label: 'Thông báo tháng', value: '14' },
        { label: 'Huỷ đăng ký', value: '0.6%' },
      ],
      [
        { key: 'title', label: 'Thông báo' },
        { key: 'trigger', label: 'Kích hoạt' },
        { key: 'reach', label: 'Tiếp cận', type: 'number' },
        { key: 'ctr', label: 'CTR' },
        STATUS_COL,
      ],
      [
        { title: 'Giảm 25% Royale Gold', trigger: 'Thủ công', reach: 18200, ctr: '6.8%', status: 'Đã gửi' },
        { title: 'Sản phẩm bạn xem đã giảm giá', trigger: 'Hành vi', reach: 2480, ctr: '11.2%', status: 'Đang chạy' },
        { title: 'Showroom Royale mới', trigger: 'Vị trí', reach: 860, ctr: '4.1%', status: 'Lên lịch' },
      ],
      ['Tạo thông báo']
    ),
    mod(
      'coupon',
      'Coupon',
      'Mã giảm giá, điều kiện áp dụng và giới hạn sử dụng.',
      'solar:ticket-sale-bold-duotone',
      [
        { label: 'Mã đang chạy', value: '12' },
        { label: 'Lượt dùng', value: '1.486' },
        { label: 'Giá trị giảm', value: '628 tr' },
        { label: 'Tỷ lệ dùng', value: '38%' },
      ],
      [
        { key: 'code', label: 'Mã' },
        { key: 'value', label: 'Ưu đãi' },
        { key: 'condition', label: 'Điều kiện' },
        { key: 'used', label: 'Đã dùng', type: 'number' },
        STATUS_COL,
      ],
      [
        { code: 'ROYALE25', value: 'Giảm 25%', condition: 'Đơn từ 30 triệu', used: 568, status: 'Đang chạy' },
        { code: 'WHITEGLOVE', value: 'Miễn phí giao lắp', condition: 'Nội thành HN/HCM', used: 820, status: 'Đang chạy' },
        { code: 'VIP10', value: 'Giảm 10 triệu', condition: 'Khách Royale VIP', used: 68, status: 'Đang chạy' },
        { code: 'AUG20', value: 'Giảm 20%', condition: 'Đơn từ 20 triệu', used: 30, status: 'Hết hạn' },
      ],
      ['Tạo coupon']
    ),
    mod(
      'affiliate',
      'Affiliate',
      'Cộng tác viên, hoa hồng và thanh toán đối soát.',
      'solar:hand-money-bold-duotone',
      [
        { label: 'Cộng tác viên', value: '168' },
        { label: 'Đơn giới thiệu', value: '286' },
        { label: 'Hoa hồng tháng', value: '248 tr' },
        { label: 'Tỷ lệ hoa hồng', value: '8%' },
      ],
      [
        { key: 'partner', label: 'Cộng tác viên' },
        { key: 'channel', label: 'Kênh' },
        { key: 'orders', label: 'Đơn', type: 'number' },
        { key: 'commission', label: 'Hoa hồng', type: 'money' },
        STATUS_COL,
      ],
      [
        { partner: 'Luxury Interior Review', channel: 'YouTube', orders: 62, commission: money(82400000), status: 'Đang hợp tác' },
        { partner: 'Décor Royale Blog', channel: 'Blog', orders: 28, commission: money(28600000), status: 'Đang hợp tác' },
        { partner: 'Mansion Tips', channel: 'TikTok', orders: 18, commission: money(14800000), status: 'Chờ đối soát' },
      ],
      ['Mời cộng tác viên']
    ),
  ],
};

// ----------------------------------------------------------------------
// ANALYTICS
// ----------------------------------------------------------------------

const ANALYTICS_GROUP: Sofa5AdminGroup = {
  slug: 'analytics',
  name: 'Analytics',
  icon: 'solar:chart-2-bold-duotone',
  modules: [
    mod(
      'revenue',
      'Doanh thu',
      'Doanh thu theo thời gian, kênh bán và khu vực.',
      'solar:dollar-minimalistic-bold-duotone',
      [
        { label: 'Doanh thu tháng', value: '8.2 tỷ', trend: '+14%' },
        { label: 'Lợi nhuận gộp', value: '3.1 tỷ' },
        { label: 'Đơn hàng', value: '328' },
        { label: 'AOV', value: '25.0 tr', trend: '+4%' },
      ],
      [
        { key: 'channel', label: 'Kênh bán' },
        { key: 'orders', label: 'Đơn', type: 'number' },
        { key: 'revenue', label: 'Doanh thu', type: 'money' },
        { key: 'share', label: 'Tỷ trọng' },
        { key: 'growth', label: 'Tăng trưởng' },
      ],
      [
        { channel: 'Showroom', orders: 148, revenue: money(4120000000), share: '50%', growth: '+18%' },
        { channel: 'Website', orders: 128, revenue: money(2840000000), share: '35%', growth: '+12%' },
        { channel: 'Đại lý B2B', orders: 38, revenue: money(984000000), share: '12%', growth: '+8%' },
        { channel: 'Sàn TMĐT', orders: 14, revenue: money(256000000), share: '3%', growth: '-2%' },
      ]
    ),
    mod(
      'best-sellers',
      'Sản phẩm bán chạy',
      'Xếp hạng sản phẩm theo doanh số và tồn kho tương ứng.',
      'solar:medal-star-bold-duotone',
      [
        { label: 'SP bán chạy', value: '24' },
        { label: 'Top 10 đóng góp', value: '52%' },
        { label: 'SP không bán được', value: '12' },
        { label: 'Vòng quay tồn', value: '3.8' },
      ],
      [
        { key: 'product', label: 'Sản phẩm' },
        { key: 'sold', label: 'Đã bán', type: 'number' },
        { key: 'revenue', label: 'Doanh thu', type: 'money' },
        { key: 'stock', label: 'Tồn', type: 'number' },
      ],
      [
        { product: 'Sofa Royale Louis', sold: 62, revenue: money(2790000000), stock: 8 },
        { product: 'Sofa Royale Velvet', sold: 48, revenue: money(1824000000), stock: 16 },
        { product: 'Sofa Royale Empire', sold: 36, revenue: money(1872000000), stock: 2 },
        { product: 'Sofa Royale Onyx', sold: 32, revenue: money(1312000000), stock: 12 },
      ]
    ),
    mod(
      'traffic',
      'Nguồn truy cập',
      'Phân bổ lưu lượng theo kênh và chất lượng phiên.',
      'solar:global-bold-duotone',
      [
        { label: 'Phiên tháng', value: '186K', trend: '+12%' },
        { label: 'Người dùng mới', value: '64%' },
        { label: 'Thời gian TB', value: '4:22' },
        { label: 'Tỷ lệ thoát', value: '38%' },
      ],
      [
        { key: 'source', label: 'Nguồn' },
        { key: 'sessions', label: 'Phiên', type: 'number' },
        { key: 'bounce', label: 'Thoát' },
        { key: 'conversion', label: 'Chuyển đổi' },
      ],
      [
        { source: 'Organic Search', sessions: 82400, bounce: '34%', conversion: '3.2%' },
        { source: 'Instagram', sessions: 42800, bounce: '42%', conversion: '2.1%' },
        { source: 'Direct', sessions: 32200, bounce: '31%', conversion: '4.2%' },
        { source: 'Referral', sessions: 16400, bounce: '40%', conversion: '2.6%' },
        { source: 'Email', sessions: 12200, bounce: '26%', conversion: '6.2%' },
      ]
    ),
    mod(
      'behavior',
      'Hành vi khách hàng',
      'Luồng xem trang, tìm kiếm nội bộ và tương tác sản phẩm.',
      'solar:cursor-bold-duotone',
      [
        { label: 'Trang/phiên', value: '5.2' },
        { label: 'Thêm giỏ', value: '12.4K' },
        { label: 'Bỏ giỏ', value: '62%' },
        { label: 'Xem 360°', value: '6.8K' },
      ],
      [
        { key: 'step', label: 'Bước hành trình' },
        { key: 'users', label: 'Người dùng', type: 'number' },
        { key: 'drop', label: 'Rời bỏ' },
        { key: 'time', label: 'Thời gian TB' },
      ],
      [
        { step: 'Xem trang chủ', users: 186000, drop: '20%', time: '0:52' },
        { step: 'Xem bộ sưu tập', users: 148000, drop: '28%', time: '1:38' },
        { step: 'Xem chi tiết SP', users: 106000, drop: '42%', time: '3:12' },
        { step: 'Thêm vào giỏ', users: 12400, drop: '62%', time: '0:28' },
        { step: 'Hoàn tất thanh toán', users: 4600, drop: '—', time: '3:42' },
      ]
    ),
    mod(
      'conversion',
      'Tỷ lệ chuyển đổi',
      'Phễu chuyển đổi theo kênh, thiết bị và chiến dịch.',
      'solar:filter-bold-duotone',
      [
        { label: 'CR tổng', value: '2.48%', trend: '+0.4%' },
        { label: 'CR mobile', value: '1.92%' },
        { label: 'CR desktop', value: '3.42%' },
        { label: 'CR có tư vấn', value: '14.2%' },
      ],
      [
        { key: 'segment', label: 'Phân khúc' },
        { key: 'sessions', label: 'Phiên', type: 'number' },
        { key: 'orders', label: 'Đơn', type: 'number' },
        { key: 'cr', label: 'CR' },
      ],
      [
        { segment: 'Mobile – Organic', sessions: 62400, orders: 1198, cr: '1.92%' },
        { segment: 'Desktop – Organic', sessions: 22000, orders: 752, cr: '3.42%' },
        { segment: 'Email remarketing', sessions: 12200, orders: 756, cr: '6.20%' },
        { segment: 'Tư vấn showroom', sessions: 3200, orders: 454, cr: '14.2%' },
      ]
    ),
  ],
};

// ----------------------------------------------------------------------
// SEO
// ----------------------------------------------------------------------

const seoPage = (slug: string, name: string, sample: string) =>
  mod(
    slug,
    name,
    `Tối ưu tiêu đề, mô tả, heading và liên kết nội bộ cho ${name.toLowerCase()}.`,
    'solar:graph-up-bold-duotone',
    [
      { label: 'URL theo dõi', value: '42' },
      { label: 'Điểm trung bình', value: '91/100' },
      { label: 'Thiếu meta', value: '2' },
      { label: 'Từ khoá top 10', value: '38' },
    ],
    [
      { key: 'url', label: 'URL' },
      { key: 'title', label: 'Meta title' },
      { key: 'keyword', label: 'Từ khoá chính' },
      { key: 'position', label: 'Thứ hạng', type: 'number' },
      STATUS_COL,
    ],
    [
      { url: sample, title: `${name} – SOFA5 Royale`, keyword: 'sofa cao cấp', position: 3, status: 'Tốt' },
      { url: `${sample}/da-y`, title: 'Sofa da Ý cao cấp', keyword: 'sofa da ý', position: 5, status: 'Tốt' },
      { url: `${sample}/velour`, title: '', keyword: 'sofa velour', position: 14, status: 'Thiếu meta' },
      { url: `${sample}/bespoke`, title: 'Sofa bespoke độc quyền', keyword: 'sofa bespoke', position: 8, status: 'Cần cải thiện' },
    ],
    ['Quét SEO', 'Xuất báo cáo']
  );

const SEO_GROUP: Sofa5AdminGroup = {
  slug: 'seo',
  name: 'SEO',
  icon: 'solar:graph-new-bold-duotone',
  modules: [
    seoPage('category', 'Trang danh mục', '/sofa5/products/category'),
    seoPage('product', 'Trang sản phẩm', '/sofa5/products'),
    seoPage('collection', 'Trang bộ sưu tập', '/sofa5/collections'),
    seoPage('project', 'Trang dự án', '/sofa5/projects'),
    seoPage('showroom', 'Trang showroom', '/sofa5/showrooms'),
    seoPage('blog', 'Trang blog', '/sofa5/blog'),
    seoPage('brand', 'Trang thương hiệu', '/sofa5/about'),
    mod(
      'sitemap',
      'Sitemap',
      'Sơ đồ site XML gửi tới công cụ tìm kiếm.',
      'solar:sitemap-bold-duotone',
      [
        { label: 'URL trong sitemap', value: '1.286' },
        { label: 'Đã index', value: '1.224' },
        { label: 'Lỗi', value: '4' },
        { label: 'Cập nhật cuối', value: '13/08' },
      ],
      [
        { key: 'file', label: 'Tệp sitemap' },
        { key: 'urls', label: 'Số URL', type: 'number' },
        { key: 'indexed', label: 'Đã index', type: 'number' },
        STATUS_COL,
      ],
      [
        { file: 'sitemap-products.xml', urls: 286, indexed: 278, status: 'Hợp lệ' },
        { file: 'sitemap-categories.xml', urls: 18, indexed: 18, status: 'Hợp lệ' },
        { file: 'sitemap-blog.xml', urls: 186, indexed: 180, status: 'Hợp lệ' },
        { file: 'sitemap-pages.xml', urls: 42, indexed: 38, status: '4 URL lỗi' },
      ],
      ['Tạo lại sitemap', 'Gửi Search Console']
    ),
    mod(
      'robots',
      'Robots',
      'Quy tắc thu thập dữ liệu cho từng bot.',
      'solar:shield-check-bold-duotone',
      [
        { label: 'Quy tắc', value: '10' },
        { label: 'Đường dẫn chặn', value: '6' },
        { label: 'Bot cho phép', value: '4' },
        { label: 'Cập nhật cuối', value: '02/08' },
      ],
      [
        { key: 'agent', label: 'User-agent' },
        { key: 'rule', label: 'Quy tắc' },
        { key: 'path', label: 'Đường dẫn' },
        STATUS_COL,
      ],
      [
        { agent: '*', rule: 'Allow', path: '/', status: 'Hoạt động' },
        { agent: '*', rule: 'Disallow', path: '/sofa5/admin', status: 'Hoạt động' },
        { agent: '*', rule: 'Disallow', path: '/sofa5/cart', status: 'Hoạt động' },
        { agent: 'Googlebot', rule: 'Allow', path: '/', status: 'Hoạt động' },
      ],
      ['Sửa robots.txt']
    ),
    mod(
      'schema',
      'Schema',
      'Dữ liệu có cấu trúc JSON-LD cho sản phẩm, bài viết và doanh nghiệp.',
      'solar:code-square-bold-duotone',
      [
        { label: 'Loại schema', value: '8' },
        { label: 'URL áp dụng', value: '986' },
        { label: 'Cảnh báo', value: '2' },
        { label: 'Lỗi', value: '0' },
      ],
      [
        { key: 'type', label: 'Loại schema' },
        { key: 'scope', label: 'Áp dụng cho' },
        { key: 'urls', label: 'URL', type: 'number' },
        STATUS_COL,
      ],
      [
        { type: 'Product', scope: 'Trang sản phẩm', urls: 286, status: 'Hợp lệ' },
        { type: 'BreadcrumbList', scope: 'Toàn site', urls: 986, status: 'Hợp lệ' },
        { type: 'Article', scope: 'Blog', urls: 186, status: '2 cảnh báo' },
        { type: 'LocalBusiness', scope: 'Showroom', urls: 5, status: 'Hợp lệ' },
        { type: 'FAQPage', scope: 'Trang FAQ', urls: 1, status: 'Hợp lệ' },
      ],
      ['Kiểm tra schema']
    ),
  ],
};

// ----------------------------------------------------------------------
// PHÂN QUYỀN
// ----------------------------------------------------------------------

const ACCESS_GROUP: Sofa5AdminGroup = {
  slug: 'access',
  name: 'Phân quyền',
  icon: 'solar:lock-keyhole-bold-duotone',
  modules: [
    mod(
      'users',
      'Người dùng',
      'Tài khoản quản trị viên và trạng thái truy cập.',
      'solar:user-bold-duotone',
      [
        { label: 'Tài khoản', value: '28' },
        { label: 'Đang hoạt động', value: '25' },
        { label: 'Bật 2FA', value: '20' },
        { label: 'Bị khoá', value: '1' },
      ],
      [
        { key: 'name', label: 'Người dùng' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Vai trò' },
        { key: 'last', label: 'Đăng nhập cuối' },
        STATUS_COL,
      ],
      [
        { name: 'Ngọc Anh', email: 'ngocanh@sofa5.vn', role: 'Quản trị hệ thống', last: '15/08/2026 09:12', status: 'Hoạt động' },
        { name: 'Minh Quân', email: 'quan@sofa5.vn', role: 'Quản lý bán hàng', last: '14/08/2026 17:40', status: 'Hoạt động' },
        { name: 'Thu Hà', email: 'ha@sofa5.vn', role: 'CSKH', last: '15/08/2026 08:02', status: 'Hoạt động' },
        { name: 'Gia Bảo', email: 'bao@sofa5.vn', role: 'Biên tập nội dung', last: '02/07/2026 10:20', status: 'Bị khoá' },
      ],
      ['Mời người dùng']
    ),
    mod(
      'roles',
      'Vai trò',
      'Nhóm vai trò và phạm vi quyền tương ứng.',
      'solar:users-group-two-rounded-bold-duotone',
      [
        { label: 'Vai trò', value: '6' },
        { label: 'Vai trò tuỳ chỉnh', value: '2' },
        { label: 'Người dùng gán', value: '28' },
        { label: 'Vai trò mặc định', value: 'Nhân viên' },
      ],
      [
        { key: 'role', label: 'Vai trò' },
        { key: 'users', label: 'Người dùng', type: 'number' },
        { key: 'scope', label: 'Phạm vi' },
        STATUS_COL,
      ],
      [
        { role: 'Quản trị hệ thống', users: 2, scope: 'Toàn quyền', status: 'Hệ thống' },
        { role: 'Quản lý bán hàng', users: 6, scope: 'Đơn hàng, CRM, Kho', status: 'Hệ thống' },
        { role: 'Biên tập nội dung', users: 4, scope: 'CMS, Blog, SEO', status: 'Tuỳ chỉnh' },
        { role: 'CSKH', users: 10, scope: 'CRM, Đổi trả, Hỗ trợ', status: 'Tuỳ chỉnh' },
        { role: 'Kế toán', users: 3, scope: 'Thanh toán, Hoàn tiền', status: 'Tuỳ chỉnh' },
      ],
      ['Tạo vai trò']
    ),
    mod(
      'permissions',
      'Quyền hạn',
      'Ma trận quyền chi tiết theo module và hành động.',
      'solar:key-bold-duotone',
      [
        { label: 'Module', value: '28' },
        { label: 'Quyền', value: '112' },
        { label: 'Quyền nhạy cảm', value: '12' },
        { label: 'Cần phê duyệt', value: '4' },
      ],
      [
        { key: 'module', label: 'Module' },
        { key: 'action', label: 'Hành động' },
        { key: 'roles', label: 'Vai trò được cấp' },
        STATUS_COL,
      ],
      [
        { module: 'Đơn hàng', action: 'Huỷ đơn', roles: 'Quản trị, Quản lý bán hàng', status: 'Cần phê duyệt' },
        { module: 'Hoàn tiền', action: 'Duyệt hoàn tiền', roles: 'Quản trị, Kế toán', status: 'Nhạy cảm' },
        { module: 'CMS', action: 'Xuất bản trang', roles: 'Quản trị, Biên tập', status: 'Bình thường' },
        { module: 'Phân quyền', action: 'Gán vai trò', roles: 'Quản trị', status: 'Nhạy cảm' },
      ],
      ['Sửa ma trận quyền']
    ),
    mod(
      'audit-log',
      'Nhật ký hệ thống',
      'Lịch sử thao tác, đăng nhập và thay đổi cấu hình.',
      'solar:clipboard-list-bold-duotone',
      [
        { label: 'Sự kiện hôm nay', value: '986' },
        { label: 'Đăng nhập thất bại', value: '8' },
        { label: 'Thay đổi cấu hình', value: '6' },
        { label: 'Lưu trữ', value: '180 ngày' },
      ],
      [
        { key: 'time', label: 'Thời gian' },
        { key: 'user', label: 'Người dùng' },
        { key: 'action', label: 'Hành động' },
        { key: 'ip', label: 'IP' },
        STATUS_COL,
      ],
      [
        { time: '15/08 09:12', user: 'Ngọc Anh', action: 'Xuất bản trang chủ', ip: '113.20.x.14', status: 'Thành công' },
        { time: '15/08 08:41', user: 'Thu Hà', action: 'Duyệt hoàn tiền HT-2608-06', ip: '113.20.x.22', status: 'Thành công' },
        { time: '15/08 07:58', user: 'unknown', action: 'Đăng nhập thất bại', ip: '45.61.x.203', status: 'Từ chối' },
        { time: '14/08 22:10', user: 'Minh Quân', action: 'Sửa bảng giá đại lý', ip: '113.20.x.31', status: 'Thành công' },
      ],
      ['Xuất nhật ký']
    ),
  ],
};

// ----------------------------------------------------------------------

export const SOFA5_ADMIN_GROUPS: Sofa5AdminGroup[] = [
  CMS_GROUP,
  PRODUCT_GROUP,
  WAREHOUSE_GROUP,
  ORDER_GROUP,
  CRM_GROUP,
  MARKETING_GROUP,
  ANALYTICS_GROUP,
  SEO_GROUP,
  ACCESS_GROUP,
];

export function findSofa5AdminModule(groupSlug?: string, moduleSlug?: string) {
  const group = SOFA5_ADMIN_GROUPS.find((g) => g.slug === groupSlug);
  if (!group) return null;
  const found = group.modules.find((m) => m.slug === moduleSlug) ?? group.modules[0];
  return { group, module: found };
}

export const SOFA5_ADMIN_KPIS = [
  { label: 'Doanh thu tháng', value: '8.2 tỷ', trend: '+14%', color: 'primary' as const },
  { label: 'Đơn hàng', value: '328', trend: '+16%', color: 'info' as const },
  { label: 'Khách hàng mới', value: '328', trend: '+12%', color: 'success' as const },
  { label: 'Tỷ lệ chuyển đổi', value: '2.48%', trend: '+0.4%', color: 'warning' as const },
];

export const SOFA5_ADMIN_ACTIVITIES = [
  { time: '09:12', text: 'Ngọc Anh xuất bản lại Trang chủ Royale', tag: 'CMS' },
  { time: '08:41', text: 'Duyệt hoàn tiền HT-2608-06 (32.0tr)', tag: 'Đơn hàng' },
  { time: '08:02', text: '18 đơn hàng mới chờ xác nhận', tag: 'Đơn hàng' },
  { time: '07:30', text: 'Chiến dịch "Royale Gold" đạt 46% tỷ lệ mở', tag: 'Marketing' },
  { time: '06:55', text: 'SKU SR-PEARL-03-IVORY hết hàng tại Kho Royale HCM', tag: 'Kho hàng' },
];
