// SOFA9 ADMIN — Retro Memphis — khu vực quản trị
// ----------------------------------------------------------------------
import { paths } from 'src/routes/paths';

export const SOFA9_ADMIN_ROOT = '/sofa9/admin';

export type Sofa9AdminColumn = { key: string; label: string; type?: 'text' | 'status' | 'money' | 'number' };

export type Sofa9AdminRow = Record<string, string | number> & {
  id?: string;
  editHref?: string;
  viewHref?: string;
};

export type Sofa9CmsFieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date';
  options?: { value: string; label: string }[];
  required?: boolean;
};

export type Sofa9AdminModule = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  stats: { label: string; value: string; trend?: string }[];
  columns: Sofa9AdminColumn[];
  rows: Sofa9AdminRow[];
  actions?: string[];
  newHref?: string;
  manageHref?: string;
  linked?: boolean;
  crudFields?: Sofa9CmsFieldDef[];
  crudEntityLabel?: string;
  publicHref?: string;
};

export type Sofa9AdminGroup = {
  slug: string;
  name: string;
  icon: string;
  modules: Sofa9AdminModule[];
};

const money = (v: number) => v;

function mod(
  slug: string,
  name: string,
  description: string,
  icon: string,
  stats: Sofa9AdminModule['stats'],
  columns: Sofa9AdminColumn[],
  rows: Sofa9AdminRow[],
  actions?: string[],
  linkOpts?: {
    newHref?: string;
    manageHref?: string;
    linked?: boolean;
    crudFields?: Sofa9CmsFieldDef[];
    crudEntityLabel?: string;
    publicHref?: string;
  }
): Sofa9AdminModule {
  return { slug, name, description, icon, stats, columns, rows, actions, ...linkOpts };
}

const STATUS_COL: Sofa9AdminColumn = { key: 'status', label: 'Trạng thái', type: 'status' };

// ----------------------------------------------------------------------
// CMS GROUP
// ----------------------------------------------------------------------
const CMS_GROUP: Sofa9AdminGroup = {
  slug: 'cms',
  name: 'CMS',
  icon: 'solar:documents-bold-duotone',
  modules: [
    mod('home', 'Trang chủ', 'Quản lý nội dung trang chủ — hero, banner, section.', 'solar:document-text-bold-duotone',
      [{ label: 'Khối nội dung', value: '12' }, { label: 'Đã xuất bản', value: '9' }, { label: 'Bản nháp', value: '3' }, { label: 'Tạm ẩn', value: '0' }],
      [{ key: 'block', label: 'Khối' }, { key: 'type', label: 'Loại' }, STATUS_COL, { key: 'updated', label: 'Cập nhật' }],
      [{ block: 'Hero Banner', type: 'Banner', status: 'Đã xuất bản', updated: '12/08/2026' }, { block: 'Marquee', type: 'Slider', status: 'Đã xuất bản', updated: '10/08/2026' }, { block: 'Product Section', type: 'Grid', status: 'Đã xuất bản', updated: '08/08/2026' }, { block: 'Gallery', type: 'Gallery', status: 'Bản nháp', updated: '05/08/2026' }],
      ['Thêm khối'], { linked: true, publicHref: '/sofa9', crudEntityLabel: 'khối nội dung', crudFields: [{ key: 'block', label: 'Tên khối', type: 'text', required: true }, { key: 'type', label: 'Loại', type: 'select', options: [{ value: 'Banner', label: 'Banner' }, { value: 'Slider', label: 'Slider' }, { value: 'Grid', label: 'Grid' }, { value: 'Gallery', label: 'Gallery' }] }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đã xuất bản', label: 'Đã xuất bản' }, { value: 'Bản nháp', label: 'Bản nháp' }, { value: 'Tạm ẩn', label: 'Tạm ẩn' }] }] }
    ),
    mod('about', 'Trang giới thiệu', 'Quản lý nội dung trang giới thiệu.', 'solar:document-text-bold-duotone',
      [{ label: 'Khối', value: '8' }, { label: 'Đã xuất bản', value: '6' }, { label: 'Bản nháp', value: '2' }, { label: 'Tạm ẩn', value: '0' }],
      [{ key: 'block', label: 'Khối' }, { key: 'type', label: 'Loại' }, STATUS_COL, { key: 'updated', label: 'Cập nhật' }],
      [{ block: 'Brand Story', type: 'Text', status: 'Đã xuất bản', updated: '10/08/2026' }, { block: 'Timeline', type: 'Timeline', status: 'Đã xuất bản', updated: '08/08/2026' }, { block: 'Team', type: 'Grid', status: 'Bản nháp', updated: '01/08/2026' }],
      ['Thêm khối'], { linked: true, publicHref: '/sofa9/about', crudEntityLabel: 'khối nội dung', crudFields: [{ key: 'block', label: 'Tên khối', type: 'text', required: true }, { key: 'type', label: 'Loại', type: 'select', options: [{ value: 'Text', label: 'Text' }, { value: 'Timeline', label: 'Timeline' }, { value: 'Grid', label: 'Grid' }] }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đã xuất bản', label: 'Đã xuất bản' }, { value: 'Bản nháp', label: 'Bản nháp' }] }] }
    ),
    mod('contact', 'Trang liên hệ', 'Quản lý nội dung trang liên hệ.', 'solar:document-text-bold-duotone',
      [{ label: 'Khối', value: '5' }, { label: 'Đã xuất bản', value: '5' }, { label: 'Bản nháp', value: '0' }, { label: 'Tạm ẩn', value: '0' }],
      [{ key: 'block', label: 'Khối' }, { key: 'type', label: 'Loại' }, STATUS_COL, { key: 'updated', label: 'Cập nhật' }],
      [{ block: 'Contact Form', type: 'Form', status: 'Đã xuất bản', updated: '10/08/2026' }, { block: 'Map', type: 'Map', status: 'Đã xuất bản', updated: '08/08/2026' }, { block: 'Showroom List', type: 'Grid', status: 'Đã xuất bản', updated: '05/08/2026' }],
      ['Thêm khối'], { linked: true, publicHref: '/sofa9/contact', crudEntityLabel: 'khối nội dung', crudFields: [{ key: 'block', label: 'Tên khối', type: 'text', required: true }, { key: 'type', label: 'Loại', type: 'select', options: [{ value: 'Form', label: 'Form' }, { value: 'Map', label: 'Map' }, { value: 'Grid', label: 'Grid' }] }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đã xuất bản', label: 'Đã xuất bản' }, { value: 'Bản nháp', label: 'Bản nháp' }] }] }
    ),
    mod('policy', 'Trang chính sách', 'Quản lý nội dung trang chính sách.', 'solar:document-text-bold-duotone',
      [{ label: 'Khối', value: '6' }, { label: 'Đã xuất bản', value: '6' }, { label: 'Bản nháp', value: '0' }, { label: 'Tạm ẩn', value: '0' }],
      [{ key: 'block', label: 'Khối' }, { key: 'type', label: 'Loại' }, STATUS_COL, { key: 'updated', label: 'Cập nhật' }],
      [{ block: 'Bảo hành', type: 'Text', status: 'Đã xuất bản', updated: '10/08/2026' }, { block: 'Đổi trả', type: 'Text', status: 'Đã xuất bản', updated: '08/08/2026' }, { block: 'Bảo mật', type: 'Text', status: 'Đã xuất bản', updated: '05/08/2026' }],
      ['Thêm khối'], { linked: true, publicHref: '/sofa9/policy', crudEntityLabel: 'khối nội dung', crudFields: [{ key: 'block', label: 'Tên khối', type: 'text', required: true }, { key: 'type', label: 'Loại', type: 'select', options: [{ value: 'Text', label: 'Text' }] }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đã xuất bản', label: 'Đã xuất bản' }, { value: 'Bản nháp', label: 'Bản nháp' }] }] }
    ),
    mod('faq', 'Trang FAQ', 'Câu hỏi thường gặp — hiển thị ở /sofa9/faq.', 'solar:question-circle-bold-duotone',
      [{ label: 'Câu hỏi', value: '5' }, { label: 'Đã xuất bản', value: '5' }, { label: 'Bản nháp', value: '0' }, { label: 'Chuyên mục', value: '3' }],
      [{ key: 'question', label: 'Câu hỏi' }, { key: 'category', label: 'Chuyên mục' }, { key: 'order', label: 'Thứ tự', type: 'number' }, STATUS_COL],
      [{ id: '1', question: 'Sofa retro có hợp nội thất hiện đại?', category: 'Sản phẩm', order: 1, status: 'Đã xuất bản' }, { id: '2', question: 'Velvet màu sáng dễ bẩn?', category: 'Chất liệu', order: 2, status: 'Đã xuất bản' }, { id: '3', question: 'Chọn màu và pattern riêng?', category: 'Tùy chỉnh', order: 3, status: 'Đã xuất bản' }, { id: '4', question: 'Phù hợp café/shop?', category: 'Thương mại', order: 4, status: 'Đã xuất bản' }, { id: '5', question: 'Bảo hành đổi trả?', category: 'Dịch vụ', order: 5, status: 'Đã xuất bản' }],
      ['Thêm câu hỏi'], { linked: true, publicHref: '/sofa9/faq', crudEntityLabel: 'câu hỏi FAQ', crudFields: [{ key: 'question', label: 'Câu hỏi', type: 'text', required: true }, { key: 'answer', label: 'Câu trả lời', type: 'textarea', required: true }, { key: 'category', label: 'Chuyên mục', type: 'text' }, { key: 'order', label: 'Thứ tự', type: 'number' }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đã xuất bản', label: 'Đã xuất bản' }, { value: 'Bản nháp', label: 'Bản nháp' }] }] }
    ),
    mod('blog', 'Trang blog', 'Bài viết blog — thêm/sửa ngay tại đây.', 'solar:notebook-bold-duotone',
      [{ label: 'Bài viết', value: '8' }, { label: 'Đã xuất bản', value: '6' }, { label: 'Bản nháp', value: '2' }, { label: 'Chuyên mục', value: '4' }],
      [{ key: 'title', label: 'Tiêu đề' }, { key: 'category', label: 'Chuyên mục' }, { key: 'author', label: 'Tác giả' }, STATUS_COL, { key: 'updated', label: 'Ngày đăng' }],
      [{ id: '1', title: 'Retro Memphis: Hướng dẫn mix màu sofa', category: 'Xu hướng', author: 'Bảo Ngân', status: 'Đã xuất bản', updated: '12/08/2026', viewHref: '/sofa9/blog' }, { id: '2', title: 'Velvet care 101', category: 'Kiến thức', author: 'Đức Anh', status: 'Đã xuất bản', updated: '10/08/2026', viewHref: '/sofa9/blog' }, { id: '3', title: 'Sofa cho café Instagram', category: 'Thương mại', author: 'Mỹ Duyên', status: 'Bản nháp', updated: '05/08/2026', viewHref: '/sofa9/blog' }],
      ['Viết bài'], { linked: true, publicHref: '/sofa9/blog', crudEntityLabel: 'bài viết', crudFields: [{ key: 'title', label: 'Tiêu đề', type: 'text', required: true }, { key: 'category', label: 'Chuyên mục', type: 'select', required: true, options: [{ value: 'Xu hướng', label: 'Xu hướng' }, { value: 'Kiến thức', label: 'Kiến thức' }, { value: 'Thương mại', label: 'Thương mại' }, { value: 'Hướng dẫn', label: 'Hướng dẫn' }] }, { key: 'author', label: 'Tác giả', type: 'text', required: true }, { key: 'excerpt', label: 'Mô tả ngắn', type: 'textarea' }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đã xuất bản', label: 'Đã xuất bản' }, { value: 'Bản nháp', label: 'Bản nháp' }] }] }
    ),
    mod('menu', 'Menu', 'Cấu trúc menu header, footer, mobile.', 'solar:hamburger-menu-bold-duotone',
      [{ label: 'Menu', value: '4' }, { label: 'Mục menu', value: '28' }, { label: 'Đã xuất bản', value: '4' }, { label: 'Bản nháp', value: '0' }],
      [{ key: 'name', label: 'Menu' }, { key: 'position', label: 'Vị trí' }, { key: 'itemsCount', label: 'Số mục', type: 'number' }, STATUS_COL],
      [{ id: '1', name: 'Main Nav', position: 'Header', itemsCount: 8, status: 'Đã xuất bản' }, { id: '2', name: 'Footer Menu', position: 'Footer', itemsCount: 12, status: 'Đã xuất bản' }, { id: '3', name: 'Mobile Menu', position: 'Mobile', itemsCount: 8, status: 'Đã xuất bản' }],
      ['Thêm menu'], { linked: true, publicHref: '/sofa9', crudEntityLabel: 'menu', crudFields: [{ key: 'name', label: 'Tên menu', type: 'text', required: true }, { key: 'position', label: 'Vị trí', type: 'select', required: true, options: [{ value: 'Header', label: 'Header' }, { value: 'Footer', label: 'Footer' }, { value: 'Mobile', label: 'Mobile' }] }, { key: 'itemsCount', label: 'Số mục', type: 'number' }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đã xuất bản', label: 'Đã xuất bản' }, { value: 'Bản nháp', label: 'Bản nháp' }] }] }
    ),
    mod('banner', 'Banner', 'Banner khuyến mãi theo vị trí.', 'solar:gallery-wide-bold-duotone',
      [{ label: 'Banner', value: '6' }, { label: 'Đang chạy', value: '4' }, { label: 'Tạm ẩn', value: '2' }, { label: 'Vị trí', value: '3' }],
      [{ key: 'name', label: 'Banner' }, { key: 'position', label: 'Vị trí' }, { key: 'schedule', label: 'Lịch chạy' }, STATUS_COL],
      [{ id: '1', name: 'Flash Sale Hồng', position: 'Home Top', schedule: '01/08 – 31/08', status: 'Đang chạy' }, { id: '2', name: 'BST Velvet Mới', position: 'Category', schedule: '10/08 – 10/09', status: 'Đang chạy' }, { id: '3', name: 'Café Deal', position: 'Sidebar', schedule: '—', status: 'Tạm ẩn' }],
      ['Tạo banner'], { linked: true, publicHref: '/sofa9', crudEntityLabel: 'banner', crudFields: [{ key: 'name', label: 'Tên banner', type: 'text', required: true }, { key: 'position', label: 'Vị trí', type: 'text', required: true }, { key: 'schedule', label: 'Lịch chạy', type: 'text' }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đang chạy', label: 'Đang chạy' }, { value: 'Tạm ẩn', label: 'Tạm ẩn' }] }] }
    ),
    mod('slider', 'Slider', 'Slideshow trang chủ và danh mục.', 'solar:slider-horizontal-bold-duotone',
      [{ label: 'Slider', value: '3' }, { label: 'Slide', value: '14' }, { label: 'Đã xuất bản', value: '3' }, { label: 'Bản nháp', value: '0' }],
      [{ key: 'name', label: 'Slider' }, { key: 'slidesCount', label: 'Số slide', type: 'number' }, { key: 'page', label: 'Trang' }, STATUS_COL],
      [{ id: '1', name: 'Home Hero', slidesCount: 6, page: 'Trang chủ', status: 'Đã xuất bản' }, { id: '2', name: 'Category Hero', slidesCount: 4, page: 'Danh mục', status: 'Đã xuất bản' }, { id: '3', name: 'Promo Strip', slidesCount: 4, page: 'Tất cả', status: 'Đã xuất bản' }],
      ['Tạo slider'], { linked: true, publicHref: '/sofa9', crudEntityLabel: 'slider', crudFields: [{ key: 'name', label: 'Tên slider', type: 'text', required: true }, { key: 'slidesCount', label: 'Số slide', type: 'number' }, { key: 'page', label: 'Trang áp dụng', type: 'select', options: [{ value: 'Trang chủ', label: 'Trang chủ' }, { value: 'Danh mục', label: 'Danh mục' }, { value: 'Tất cả', label: 'Tất cả' }] }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đã xuất bản', label: 'Đã xuất bản' }, { value: 'Bản nháp', label: 'Bản nháp' }] }] }
    ),
    mod('seo', 'SEO', 'Thẻ meta cho từng trang.', 'solar:magnifer-bold-duotone',
      [{ label: 'Trang theo dõi', value: '12' }, { label: 'Tốt', value: '9' }, { label: 'Thiếu meta', value: '2' }, { label: 'Độ dài TB', value: '52 ký tự' }],
      [{ key: 'page', label: 'Trang' }, { key: 'title', label: 'Meta title' }, { key: 'length', label: 'Độ dài', type: 'number' }, STATUS_COL],
      [{ id: '1', page: '/sofa9', title: 'Retro Memphis Sofa — Sofa màu bùng nổ', length: 48, status: 'Tốt', viewHref: '/sofa9' }, { id: '2', page: '/sofa9/products', title: 'Sofa retro — Pop Art, Tropical, Velvet', length: 52, status: 'Tốt', viewHref: '/sofa9/products' }, { id: '3', page: '/sofa9/blog', title: '', length: 0, status: 'Thiếu meta', viewHref: '/sofa9/blog' }],
      ['Thêm trang SEO'], { linked: true, crudEntityLabel: 'trang SEO', crudFields: [{ key: 'page', label: 'Đường dẫn', type: 'text', required: true }, { key: 'title', label: 'Meta title', type: 'text' }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Tốt', label: 'Tốt' }, { value: 'Thiếu meta', label: 'Thiếu meta' }, { value: 'Cần cải thiện', label: 'Cần cải thiện' }] }] }
    ),
    mod('static-pages', 'Trang tĩnh', 'Trang nội dung tự tạo.', 'solar:file-text-bold-duotone',
      [{ label: 'Trang tĩnh', value: '4' }, { label: 'Đã xuất bản', value: '4' }, { label: 'Bản nháp', value: '0' }, { label: 'Tạm ẩn', value: '0' }],
      [{ key: 'title', label: 'Tiêu đề' }, { key: 'slug', label: 'Đường dẫn' }, STATUS_COL, { key: 'updated', label: 'Cập nhật' }],
      [{ id: '1', title: 'Hướng dẫn chọn size', slug: '/sofa9/huong-dan-size', status: 'Đã xuất bản', updated: '10/08/2026', viewHref: '/sofa9' }, { id: '2', title: 'Về chúng tôi', slug: '/sofa9/about', status: 'Đã xuất bản', updated: '08/08/2026', viewHref: '/sofa9/about' }],
      ['Tạo trang'], { linked: true, crudEntityLabel: 'trang tĩnh', crudFields: [{ key: 'title', label: 'Tiêu đề', type: 'text', required: true }, { key: 'slug', label: 'Đường dẫn', type: 'text', required: true }, { key: 'content', label: 'Nội dung', type: 'textarea' }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đã xuất bản', label: 'Đã xuất bản' }, { value: 'Bản nháp', label: 'Bản nháp' }] }] }
    ),
  ],
};

// ----------------------------------------------------------------------
// PRODUCT GROUP
// ----------------------------------------------------------------------
const PRODUCT_GROUP: Sofa9AdminGroup = {
  slug: 'catalog',
  name: 'Sản phẩm',
  icon: 'solar:box-bold-duotone',
  modules: [
    mod('categories', 'Danh mục', 'Danh mục sản phẩm retro.', 'solar:folder-with-files-bold-duotone',
      [{ label: 'Danh mục', value: '4' }, { label: 'Đã xuất bản', value: '4' }, { label: 'Bản nháp', value: '0' }, { label: 'Tổng SP', value: '40' }],
      [{ key: 'name', label: 'Danh mục' }, { key: 'itemCount', label: 'Sản phẩm', type: 'number' }, { key: 'updated', label: 'Cập nhật' }, STATUS_COL],
      [{ id: '1', name: 'Pop Art', itemCount: 12, updated: '10/08/2026', status: 'Đã xuất bản' }, { id: '2', name: 'Tropical Retro', itemCount: 9, updated: '08/08/2026', status: 'Đã xuất bản' }, { id: '3', name: 'Velvet Groove', itemCount: 8, updated: '05/08/2026', status: 'Đã xuất bản' }, { id: '4', name: 'Flower Power', itemCount: 7, updated: '01/08/2026', status: 'Đã xuất bản' }],
      ['Thêm danh mục'], { linked: true, publicHref: '/sofa9/products', crudEntityLabel: 'danh mục', crudFields: [{ key: 'name', label: 'Tên danh mục', type: 'text', required: true }, { key: 'itemCount', label: 'Số sản phẩm', type: 'number' }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đã xuất bản', label: 'Đã xuất bản' }, { value: 'Bản nháp', label: 'Bản nháp' }] }] }
    ),
    mod('products', 'Sản phẩm', 'Danh sách sản phẩm retro.', 'solar:armchair-bold-duotone',
      [{ label: 'Sản phẩm', value: '40' }, { label: 'Đang bán', value: '36' }, { label: 'Hết hàng', value: '2' }, { label: 'Sắp hết', value: '2' }],
      [{ key: 'sku', label: 'SKU' }, { key: 'name', label: 'Tên' }, { key: 'category', label: 'Danh mục' }, { key: 'price', label: 'Giá', type: 'money' }, STATUS_COL],
      [{ id: '1', sku: 'SF9-PP01', name: 'Sofa Pink Pop', category: 'Pop Art', price: money(12500000), status: 'Đang bán', viewHref: '/sofa9/products' }, { id: '2', sku: 'SF9-GD02', name: 'Sofa Green Disco', category: 'Tropical Retro', price: money(13900000), status: 'Đang bán', viewHref: '/sofa9/products' }, { id: '3', sku: 'SF9-VG03', name: 'Sofa Velvet Groove', category: 'Velvet Groove', price: money(15500000), status: 'Đang bán', viewHref: '/sofa9/products' }, { id: '4', sku: 'SF9-FP04', name: 'Sofa Flower Power', category: 'Flower Power', price: money(11500000), status: 'Hết hàng', viewHref: '/sofa9/products' }],
      ['Thêm sản phẩm'], { linked: true, publicHref: '/sofa9/products', crudEntityLabel: 'sản phẩm', crudFields: [{ key: 'sku', label: 'SKU', type: 'text', required: true }, { key: 'name', label: 'Tên sản phẩm', type: 'text', required: true }, { key: 'category', label: 'Danh mục', type: 'select', required: true, options: [{ value: 'Pop Art', label: 'Pop Art' }, { value: 'Tropical Retro', label: 'Tropical Retro' }, { value: 'Velvet Groove', label: 'Velvet Groove' }, { value: 'Flower Power', label: 'Flower Power' }] }, { key: 'price', label: 'Giá bán', type: 'number' }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đang bán', label: 'Đang bán' }, { value: 'Hết hàng', label: 'Hết hàng' }, { value: 'Sắp hết', label: 'Sắp hết' }] }] }
    ),
    mod('attributes', 'Thuộc tính', 'Bộ thuộc tính tạo biến thể: màu, chất liệu, kích thước.', 'solar:tuning-square-bold-duotone',
      [{ label: 'Nhóm thuộc tính', value: '6' }, { label: 'Giá trị', value: '92' }, { label: 'Dùng cho biến thể', value: '4' }, { label: 'Bộ lọc', value: '4' }],
      [{ key: 'name', label: 'Thuộc tính' }, { key: 'values', label: 'Số giá trị', type: 'number' }, { key: 'usage', label: 'Áp dụng' }, STATUS_COL],
      [{ name: 'Màu velvet', values: 40, usage: 'Biến thể + Bộ lọc', status: 'Hoạt động' }, { name: 'Chất liệu', values: 8, usage: 'Biến thể + Bộ lọc', status: 'Hoạt động' }, { name: 'Kích thước', values: 12, usage: 'Biến thể', status: 'Hoạt động' }, { name: 'Họa tiết', values: 20, usage: 'Tuỳ chọn', status: 'Hoạt động' }, { name: 'Kiểu chân', values: 6, usage: 'Tuỳ chọn', status: 'Tạm ẩn' }],
      ['Thêm thuộc tính']
    ),
    mod('variants', 'Biến thể sản phẩm', 'Tổ hợp SKU theo màu, chất liệu, kích thước.', 'solar:layers-bold-duotone',
      [{ label: 'Biến thể', value: '842' }, { label: 'Có tồn kho', value: '720' }, { label: 'Cảnh báo', value: '28' }, { label: 'Ngừng bán', value: '18' }],
      [{ key: 'sku', label: 'SKU' }, { key: 'product', label: 'Sản phẩm' }, { key: 'option', label: 'Tuỳ chọn' }, { key: 'stock', label: 'Tồn', type: 'number' }, { key: 'price', label: 'Giá', type: 'money' }],
      [{ sku: 'SF9-PP01-PK-2M', product: 'Sofa Pink Pop', option: 'Velvet hồng / 2m', stock: 12, price: money(12500000) }, { sku: 'SF9-PP01-YL-2M', product: 'Sofa Pink Pop', option: 'Velvet vàng / 2m', stock: 5, price: money(12900000) }, { sku: 'SF9-GD02-TL-3M', product: 'Sofa Green Disco', option: 'Velvet teal / 3m', stock: 0, price: money(15900000) }],
      ['Tạo biến thể']
    ),
    mod('inventory', 'Kho hàng', 'Tồn kho theo sản phẩm.', 'solar:box-minimalistic-bold-duotone',
      [{ label: 'Tổng tồn', value: '2.184' }, { label: 'Sắp hết', value: '28' }, { label: 'Hết hàng', value: '18' }, { label: 'Giá trị tồn', value: '12.4 tỷ' }],
      [{ key: 'sku', label: 'SKU' }, { key: 'warehouse', label: 'Kho' }, { key: 'stock', label: 'Tồn', type: 'number' }, { key: 'reserved', label: 'Đang giữ', type: 'number' }, STATUS_COL],
      [{ sku: 'SF9-PP01-PK-2M', warehouse: 'Kho HN', stock: 12, reserved: 2, status: 'Đủ hàng' }, { sku: 'SF9-GD02-TL-3M', warehouse: 'Kho HCM', stock: 0, reserved: 0, status: 'Hết hàng' }, { sku: 'SF9-VG03-GR-2M', warehouse: 'Kho ĐN', stock: 4, reserved: 1, status: 'Sắp hết' }],
      ['Nhập kho', 'Kiểm kê']
    ),
    mod('pricing', 'Giá bán', 'Bảng giá niêm yết, khuyến mãi, đại lý.', 'solar:tag-price-bold-duotone',
      [{ label: 'Bảng giá', value: '3' }, { label: 'SP giảm giá', value: '28' }, { label: 'Giảm TB', value: '22%' }, { label: 'Biên LN', value: '38%', trend: '+3%' }],
      [{ key: 'sku', label: 'SKU' }, { key: 'list', label: 'Giá niêm yết', type: 'money' }, { key: 'sale', label: 'Giá bán', type: 'money' }, STATUS_COL],
      [{ sku: 'SF9-PP01', list: money(16000000), sale: money(12500000), status: 'Đang giảm' }, { sku: 'SF9-GD02', list: money(18000000), sale: money(13900000), status: 'Đang giảm' }, { sku: 'SF9-VG03', list: money(20000000), sale: money(15500000), status: 'Đang giảm' }],
      ['Tạo bảng giá']
    ),
  ],
};

// ----------------------------------------------------------------------
// WAREHOUSE GROUP
// ----------------------------------------------------------------------
const WAREHOUSE_GROUP: Sofa9AdminGroup = {
  slug: 'warehouse', name: 'Kho hàng', icon: 'solar:warehouse-bold-duotone',
  modules: [
    mod('overview', 'Tổng quan kho', 'Tình trạng tồn kho toàn hệ thống.', 'solar:chart-square-bold-duotone',
      [{ label: 'Kho', value: '4' }, { label: 'Tổng tồn', value: '2.184' }, { label: 'Đơn chờ xuất', value: '32' }, { label: 'Lấp đầy', value: '68%' }],
      [{ key: 'warehouse', label: 'Kho' }, { key: 'city', label: 'Khu vực' }, { key: 'stock', label: 'Tồn', type: 'number' }, STATUS_COL],
      [{ warehouse: 'Kho HN', city: 'Hà Nội', stock: 820, status: 'Hoạt động' }, { warehouse: 'Kho HCM', city: 'TP HCM', stock: 740, status: 'Hoạt động' }, { warehouse: 'Kho ĐN', city: 'Đà Nẵng', stock: 384, status: 'Hoạt động' }, { warehouse: 'Kho ký gửi', city: 'Toàn quốc', stock: 240, status: 'Hoạt động' }],
      ['Thêm kho']
    ),
    mod('receipts', 'Nhập – Xuất kho', 'Phiếu nhập/xuất kho.', 'solar:import-bold-duotone',
      [{ label: 'Phiếu tháng', value: '124' }, { label: 'Chờ duyệt', value: '6' }, { label: 'Giá trị nhập', value: '2.8 tỷ' }, { label: 'Giá trị xuất', value: '3.4 tỷ' }],
      [{ key: 'code', label: 'Mã phiếu' }, { key: 'type', label: 'Loại' }, { key: 'warehouse', label: 'Kho' }, { key: 'value', label: 'Giá trị', type: 'money' }, STATUS_COL],
      [{ code: 'PN-08-014', type: 'Nhập', warehouse: 'Kho HN', value: money(284000000), status: 'Hoàn tất' }, { code: 'PX-08-092', type: 'Xuất', warehouse: 'Kho HCM', value: money(86000000), status: 'Hoàn tất' }, { code: 'PN-08-015', type: 'Nhập', warehouse: 'Kho ĐN', value: money(64000000), status: 'Chờ duyệt' }],
      ['Tạo phiếu nhập', 'Tạo phiếu xuất']
    ),
    mod('transfers', 'Chuyển kho & Kiểm kê', 'Điều chuyển hàng, biên bản kiểm kê.', 'solar:transfer-horizontal-bold-duotone',
      [{ label: 'Lệnh chuyển', value: '18' }, { label: 'Đang VC', value: '4' }, { label: 'Lệch KK', value: '2' }, { label: 'KK gần nhất', value: '31/07' }],
      [{ key: 'code', label: 'Mã lệnh' }, { key: 'from', label: 'Từ kho' }, { key: 'to', label: 'Đến kho' }, { key: 'items', label: 'Số món', type: 'number' }, STATUS_COL],
      [{ code: 'CK-0812', from: 'Kho HCM', to: 'Kho ĐN', items: 12, status: 'Đang vận chuyển' }, { code: 'CK-0811', from: 'Kho HN', to: 'Kho HCM', items: 8, status: 'Hoàn tất' }],
      ['Tạo lệnh chuyển', 'Mở kiểm kê']
    ),
  ],
};

// ----------------------------------------------------------------------
// ORDER GROUP
// ----------------------------------------------------------------------
const ORDER_GROUP: Sofa9AdminGroup = {
  slug: 'orders', name: 'Đơn hàng', icon: 'solar:cart-large-2-bold-duotone',
  modules: [
    mod('orders', 'Đơn hàng', 'Toàn bộ đơn hàng.', 'solar:bill-list-bold-duotone',
      [{ label: 'Đơn hàng', value: '284' }, { label: 'Chờ xác nhận', value: '24' }, { label: 'Tổng DT', value: '4.2 tỷ' }, { label: 'Đã hủy', value: '12' }],
      [{ key: 'orderNumber', label: 'Mã đơn' }, { key: 'customerName', label: 'Khách hàng' }, { key: 'total', label: 'Tổng tiền', type: 'money' }, STATUS_COL],
      [{ id: '1', orderNumber: 'SF9-26081201', customerName: 'Bảo Ngân', total: money(12500000), status: 'Đang giao' }, { id: '2', orderNumber: 'SF9-26081198', customerName: 'Đức Anh', total: money(13900000), status: 'Hoàn tất' }, { id: '3', orderNumber: 'SF9-26081195', customerName: 'Mỹ Duyên', total: money(15500000), status: 'Chờ xác nhận' }],
      ['Quản lý đầy đủ']
    ),
    mod('payments', 'Thanh toán', 'Giao dịch thanh toán.', 'solar:card-transfer-bold-duotone',
      [{ label: 'Giao dịch tháng', value: '312' }, { label: 'Thành công', value: '95.8%' }, { label: 'Chờ đối soát', value: '12' }, { label: 'Trả góp', value: '48 đơn' }],
      [{ key: 'txn', label: 'Mã GD' }, { key: 'order', label: 'Đơn hàng' }, { key: 'method', label: 'PT' }, { key: 'amount', label: 'Số tiền', type: 'money' }, STATUS_COL],
      [{ txn: 'TXN-88213', order: 'SF9-26081201', method: 'VNPay', amount: money(12500000), status: 'Thành công' }, { txn: 'TXN-88210', order: 'SF9-26081198', method: 'Chuyển khoản', amount: money(13900000), status: 'Thành công' }, { txn: 'TXN-88208', order: 'SF9-26081195', method: 'Momo', amount: money(15500000), status: 'Chờ đối soát' }],
      ['Đối soát']
    ),
    mod('shipping', 'Vận chuyển', 'Điều phối giao lắp.', 'solar:delivery-bold-duotone',
      [{ label: 'Đang giao', value: '32' }, { label: 'Đúng hẹn', value: '92%' }, { label: 'Đội lắp', value: '8' }, { label: 'Phí VC', value: '96 tr' }],
      [{ key: 'code', label: 'Vận đơn' }, { key: 'order', label: 'Đơn' }, { key: 'carrier', label: 'Đơn vị' }, STATUS_COL],
      [{ code: 'VD-40112', order: 'SF9-26081201', carrier: 'Đội nội bộ', status: 'Đang giao' }, { code: 'VD-40109', order: 'SF9-26081198', carrier: 'Đội nội bộ', status: 'Đã giao' }],
      ['Tạo vận đơn']
    ),
    mod('refunds', 'Hoàn tiền', 'Yêu cầu hoàn tiền.', 'solar:money-bag-bold-duotone',
      [{ label: 'Yêu cầu tháng', value: '8' }, { label: 'Đã hoàn', value: '6' }, { label: 'Giá trị', value: '82 tr' }, { label: 'TB', value: '2.4 ngày' }],
      [{ key: 'code', label: 'Mã YC' }, { key: 'order', label: 'Đơn' }, { key: 'reason', label: 'Lý do' }, { key: 'amount', label: 'Số tiền', type: 'money' }, STATUS_COL],
      [{ code: 'HT-08-04', order: 'SF9-26081190', reason: 'Khách hủy', amount: money(11500000), status: 'Đã hoàn' }, { code: 'HT-08-05', order: 'SF9-26081152', reason: 'Sai màu', amount: money(4500000), status: 'Đang xử lý' }],
      ['Duyệt hoàn tiền']
    ),
    mod('returns', 'Đổi trả', 'Yêu cầu đổi/trả.', 'solar:restart-bold-duotone',
      [{ label: 'Yêu cầu tháng', value: '6' }, { label: 'Tỷ lệ', value: '2.1%' }, { label: 'Đang thu hồi', value: '2' }, { label: 'Tái nhập', value: '4' }],
      [{ key: 'code', label: 'Mã YC' }, { key: 'product', label: 'Sản phẩm' }, { key: 'type', label: 'Loại' }, STATUS_COL],
      [{ code: 'DT-08-02', product: 'Sofa Pink Pop', type: 'Đổi màu', status: 'Đang thu hồi' }, { code: 'DT-08-03', product: 'Sofa Green Disco', type: 'Trả hàng', status: 'Đã tái nhập' }],
      ['Tạo yêu cầu']
    ),
  ],
};

// ----------------------------------------------------------------------
// CRM GROUP
// ----------------------------------------------------------------------
const CRM_GROUP: Sofa9AdminGroup = {
  slug: 'crm', name: 'CRM', icon: 'solar:users-group-rounded-bold-duotone',
  modules: [
    mod('customers', 'Khách hàng', 'Hồ sơ khách hàng.', 'solar:user-id-bold-duotone',
      [{ label: 'Khách hàng', value: '1.840' }, { label: 'VIP', value: '86' }, { label: 'Hoạt động', value: '1.420' }, { label: 'Chi tiêu TB', value: '8.2 tr' }],
      [{ key: 'name', label: 'Khách hàng' }, { key: 'phone', label: 'Điện thoại' }, { key: 'totalOrders', label: 'Số đơn', type: 'number' }, { key: 'totalSpent', label: 'Chi tiêu', type: 'money' }, STATUS_COL],
      [{ id: '1', name: 'Bảo Ngân', phone: '0901xxx', totalOrders: 3, totalSpent: money(37500000), status: 'VIP' }, { id: '2', name: 'Đức Anh', phone: '0902xxx', totalOrders: 2, totalSpent: money(27800000), status: 'Hoạt động' }, { id: '3', name: 'Mỹ Duyên', phone: '0903xxx', totalOrders: 1, totalSpent: money(11500000), status: 'Hoạt động' }],
      ['Quản lý đầy đủ']
    ),
    mod('leads', 'Leads', 'Yêu cầu tư vấn B2B.', 'solar:magnet-bold-duotone',
      [{ label: 'Yêu cầu', value: '42' }, { label: 'Mới', value: '12' }, { label: 'Đã báo giá', value: '8' }, { label: 'Thành công', value: '6' }],
      [{ key: 'companyName', label: 'Công ty' }, { key: 'contactName', label: 'Liên hệ' }, { key: 'projectType', label: 'Loại' }, STATUS_COL],
      [{ id: '1', companyName: 'Café Retro HN', contactName: 'Anh Tuấn', projectType: 'Café', status: 'Mới' }, { id: '2', companyName: 'Studio Color', contactName: 'Chị Lan', projectType: 'Studio', status: 'Đã báo giá' }],
      ['Quản lý đầy đủ']
    ),
    mod('contact-messages', 'Liên hệ', 'Tin nhắn từ form liên hệ.', 'solar:letter-unread-bold-duotone',
      [{ label: 'Tin nhắn', value: '86' }, { label: 'Mới', value: '18' }, { label: 'Đã phản hồi', value: '52' }, { label: 'Lưu trữ', value: '16' }],
      [{ key: 'name', label: 'Người gửi' }, { key: 'subject', label: 'Chủ đề' }, { key: 'phone', label: 'Điện thoại' }, STATUS_COL],
      [{ id: '1', name: 'Khách A', subject: 'Tư vấn sofa café', phone: '090xxx', status: 'Mới' }, { id: '2', name: 'Khách B', subject: 'Bảo hành velvet', phone: '091xxx', status: 'Đã phản hồi' }],
      ['Quản lý đầy đủ']
    ),
    mod('purchase-history', 'Lịch sử mua hàng', 'Dòng thời gian giao dịch.', 'solar:history-bold-duotone',
      [{ label: 'Giao dịch', value: '8.240' }, { label: 'Mua lại', value: '32%' }, { label: 'Chu kỳ', value: '12 tháng' }, { label: 'Đơn/khách', value: '1.4' }],
      [{ key: 'customer', label: 'Khách' }, { key: 'order', label: 'Đơn' }, { key: 'date', label: 'Ngày' }, { key: 'total', label: 'Giá trị', type: 'money' }, STATUS_COL],
      [{ customer: 'Bảo Ngân', order: 'SF9-26081201', date: '12/08/2026', total: money(12500000), status: 'Đang giao' }, { customer: 'Đức Anh', order: 'SF9-26081198', date: '11/08/2026', total: money(13900000), status: 'Hoàn tất' }]
    ),
    mod('care', 'Chăm sóc khách hàng', 'Ticket, gọi lại, khảo sát.', 'solar:chat-round-call-bold-duotone',
      [{ label: 'Ticket mở', value: '24' }, { label: 'Phản hồi TB', value: '38 phút' }, { label: 'CSAT', value: '4.8/5', trend: '+0.3' }, { label: 'Bảo hành', value: '8' }],
      [{ key: 'ticket', label: 'Ticket' }, { key: 'customer', label: 'Khách' }, { key: 'topic', label: 'Chủ đề' }, STATUS_COL],
      [{ ticket: 'TK-8021', customer: 'Bảo Ngân', topic: 'Đặt lịch giao', status: 'Đang xử lý' }, { ticket: 'TK-8018', customer: 'Đức Anh', topic: 'Bảo hành velvet', status: 'Đã đóng' }],
      ['Tạo ticket']
    ),
  ],
};

// ----------------------------------------------------------------------
// MARKETING GROUP
// ----------------------------------------------------------------------
const MARKETING_GROUP: Sofa9AdminGroup = {
  slug: 'marketing', name: 'Marketing', icon: 'solar:megaphone-bold-duotone',
  modules: [
    mod('promotions', 'Khuyến mãi', 'Chương trình khuyến mãi.', 'solar:gift-bold-duotone',
      [{ label: 'Chương trình', value: '8' }, { label: 'Đang áp dụng', value: '4' }, { label: 'Sắp diễn ra', value: '2' }, { label: 'Hết hạn', value: '2' }],
      [{ key: 'title', label: 'Chương trình' }, { key: 'discount', label: 'Ưu đãi' }, { key: 'validUntil', label: 'Đến hết' }, STATUS_COL],
      [{ id: '1', title: 'Flash Sale Hồng', discount: '30%', validUntil: '31/08/2026', status: 'Đang áp dụng' }, { id: '2', title: 'BST Velvet Mới', discount: '20%', validUntil: '10/09/2026', status: 'Đang áp dụng' }, { id: '3', title: 'Café Deal', discount: '15%', validUntil: '—', status: 'Sắp diễn ra' }],
      ['Thêm khuyến mãi'], { linked: true, publicHref: '/sofa9/promotions', crudEntityLabel: 'khuyến mãi', crudFields: [{ key: 'title', label: 'Tên chương trình', type: 'text', required: true }, { key: 'discount', label: 'Ưu đãi', type: 'text' }, { key: 'validUntil', label: 'Đến hết (dd/mm/yyyy)', type: 'text' }, { key: 'status', label: 'Trạng thái', type: 'select', options: [{ value: 'Đang áp dụng', label: 'Đang áp dụng' }, { value: 'Sắp diễn ra', label: 'Sắp diễn ra' }, { value: 'Hết hạn', label: 'Hết hạn' }] }] }
    ),
    mod('email', 'Email Marketing', 'Chiến dịch email.', 'solar:letter-bold-duotone',
      [{ label: 'Chiến dịch', value: '12' }, { label: 'Mở', value: '42%', trend: '+4%' }, { label: 'Click', value: '7.2%' }, { label: 'DT quy đổi', value: '420 tr' }],
      [{ key: 'campaign', label: 'Chiến dịch' }, { key: 'sent', label: 'Đã gửi', type: 'number' }, { key: 'open', label: 'Mở' }, STATUS_COL],
      [{ campaign: 'Sale tháng 8 – 30%', sent: 6480, open: '44%', status: 'Đã gửi' }, { campaign: 'BST Velvet mới', sent: 1840, open: '48%', status: 'Đã gửi' }, { campaign: 'Giỏ hàng bỏ quên', sent: 420, open: '54%', status: 'Đang chạy' }],
      ['Tạo chiến dịch']
    ),
    mod('sms', 'SMS Marketing', 'Tin nhắn thương hiệu.', 'solar:chat-square-code-bold-duotone',
      [{ label: 'Tin đã gửi', value: '24K' }, { label: 'Nhận', value: '98%' }, { label: 'Chi phí', value: '18 tr' }, { label: 'Brandname', value: 'SOFA9' }],
      [{ key: 'campaign', label: 'Chiến dịch' }, { key: 'sent', label: 'Đã gửi', type: 'number' }, { key: 'cost', label: 'Chi phí', type: 'money' }, STATUS_COL],
      [{ campaign: 'Flash sale cuối tuần', sent: 8400, cost: money(6800000), status: 'Đã gửi' }, { campaign: 'Nhắc lịch giao', sent: 240, cost: money(168000), status: 'Đang chạy' }],
      ['Tạo SMS']
    ),
    mod('push', 'Push Notification', 'Thông báo đẩy.', 'solar:bell-bing-bold-duotone',
      [{ label: 'Đăng ký', value: '14K' }, { label: 'Click', value: '5.2%' }, { label: 'Tháng', value: '12' }, { label: 'Hủy', value: '0.6%' }],
      [{ key: 'title', label: 'Thông báo' }, { key: 'reach', label: 'Tiếp cận', type: 'number' }, { key: 'ctr', label: 'CTR' }, STATUS_COL],
      [{ title: 'Giảm 30% sofa hồng', reach: 12800, ctr: '6.1%', status: 'Đã gửi' }, { title: 'SP bạn xem đã giảm', reach: 1820, ctr: '10.2%', status: 'Đang chạy' }],
      ['Tạo thông báo']
    ),
    mod('coupon', 'Coupon', 'Mã giảm giá.', 'solar:ticket-sale-bold-duotone',
      [{ label: 'Mã chạy', value: '8' }, { label: 'Lượt dùng', value: '1.240' }, { label: 'Giá trị', value: '286 tr' }, { label: 'Tỷ lệ', value: '38%' }],
      [{ key: 'code', label: 'Mã' }, { key: 'value', label: 'Ưu đãi' }, { key: 'used', label: 'Đã dùng', type: 'number' }, STATUS_COL],
      [{ code: 'RETRO30', value: 'Giảm 30%', used: 420, status: 'Đang chạy' }, { code: 'FREESHIP', value: 'Free giao', used: 680, status: 'Đang chạy' }, { code: 'AUG20', value: 'Giảm 20%', used: 86, status: 'Hết hạn' }],
      ['Tạo coupon']
    ),
    mod('affiliate', 'Affiliate', 'Cộng tác viên, hoa hồng.', 'solar:hand-money-bold-duotone',
      [{ label: 'CTV', value: '124' }, { label: 'Đơn', value: '186' }, { label: 'Hoa hồng', value: '142 tr' }, { label: 'Tỷ lệ', value: '5%' }],
      [{ key: 'partner', label: 'CTV' }, { key: 'channel', label: 'Kênh' }, { key: 'orders', label: 'Đơn', type: 'number' }, { key: 'commission', label: 'Hoa hồng', type: 'money' }, STATUS_COL],
      [{ partner: 'Retro Review', channel: 'YouTube', orders: 42, commission: money(48400000), status: 'Đang hợp tác' }, { partner: 'Color Blog', channel: 'Blog', orders: 28, commission: money(28200000), status: 'Đang hợp tác' }],
      ['Mời CTV']
    ),
  ],
};

// ----------------------------------------------------------------------
// ANALYTICS GROUP
// ----------------------------------------------------------------------
const ANALYTICS_GROUP: Sofa9AdminGroup = {
  slug: 'analytics', name: 'Analytics', icon: 'solar:chart-2-bold-duotone',
  modules: [
    mod('revenue', 'Doanh thu', 'Doanh thu theo kênh.', 'solar:dollar-minimalistic-bold-duotone',
      [{ label: 'DT tháng', value: '4.2 tỷ', trend: '+14%' }, { label: 'Lợi nhuận', value: '1.6 tỷ' }, { label: 'Đơn', value: '284' }, { label: 'AOV', value: '14.8 tr', trend: '+4%' }],
      [{ key: 'channel', label: 'Kênh' }, { key: 'orders', label: 'Đơn', type: 'number' }, { key: 'revenue', label: 'DT', type: 'money' }, { key: 'growth', label: 'Tăng' }],
      [{ channel: 'Website', orders: 124, revenue: money(1840000000), growth: '+18%' }, { channel: 'Showroom', orders: 86, revenue: money(1240000000), growth: '+8%' }, { channel: 'Đại lý', orders: 48, revenue: money(820000000), growth: '+12%' }, { channel: 'Sàn TMĐT', orders: 26, revenue: money(300000000), growth: '-2%' }]
    ),
    mod('best-sellers', 'SP bán chạy', 'Xếp hạng sản phẩm.', 'solar:medal-star-bold-duotone',
      [{ label: 'SP bán chạy', value: '24' }, { label: 'Top 10', value: '52%' }, { label: 'Không bán', value: '12' }, { label: 'Vòng tồn', value: '3.8' }],
      [{ key: 'product', label: 'Sản phẩm' }, { key: 'sold', label: 'Đã bán', type: 'number' }, { key: 'revenue', label: 'DT', type: 'money' }, { key: 'stock', label: 'Tồn', type: 'number' }],
      [{ product: 'Sofa Pink Pop', sold: 64, revenue: money(800000000), stock: 12 }, { product: 'Sofa Green Disco', sold: 52, revenue: money(722800000), stock: 0 }, { product: 'Sofa Velvet Groove', sold: 38, revenue: money(589000000), stock: 4 }]
    ),
    mod('traffic', 'Nguồn truy cập', 'Lưu lượng theo kênh.', 'solar:global-bold-duotone',
      [{ label: 'Phiên tháng', value: '184K', trend: '+12%' }, { label: 'Người mới', value: '72%' }, { label: 'Thời gian TB', value: '2:48' }, { label: 'Thoát', value: '44%' }],
      [{ key: 'source', label: 'Nguồn' }, { key: 'sessions', label: 'Phiên', type: 'number' }, { key: 'bounce', label: 'Thoát' }, { key: 'conversion', label: 'Chuyển đổi' }],
      [{ source: 'Organic', sessions: 82400, bounce: '36%', conversion: '2.8%' }, { source: 'Social', sessions: 48200, bounce: '52%', conversion: '1.4%' }, { source: 'Direct', sessions: 28400, bounce: '32%', conversion: '3.4%' }, { source: 'Email', sessions: 12400, bounce: '28%', conversion: '5.2%' }]
    ),
    mod('behavior', 'Hành vi khách hàng', 'Luồng xem, tìm kiếm, tương tác.', 'solar:cursor-bold-duotone',
      [{ label: 'Trang/phiên', value: '4.2' }, { label: 'Thêm giỏ', value: '9.2K' }, { label: 'Bỏ giỏ', value: '64%' }, { label: 'Xem 360°', value: '4.8K' }],
      [{ key: 'step', label: 'Bước' }, { key: 'users', label: 'Người', type: 'number' }, { key: 'drop', label: 'Rời' }, { key: 'time', label: 'TG TB' }],
      [{ step: 'Trang chủ', users: 184000, drop: '24%', time: '0:42' }, { step: 'Danh mục', users: 142000, drop: '34%', time: '1:12' }, { step: 'Chi tiết SP', users: 92000, drop: '48%', time: '2:18' }, { step: 'Giỏ hàng', users: 9200, drop: '64%', time: '0:18' }, { step: 'Thanh toán', users: 3300, drop: '—', time: '2:48' }]
    ),
    mod('conversion', 'Tỷ lệ chuyển đổi', 'Phễu chuyển đổi.', 'solar:filter-bold-duotone',
      [{ label: 'CR tổng', value: '1.82%', trend: '+0.4%' }, { label: 'CR mobile', value: '1.42%' }, { label: 'CR desktop', value: '2.64%' }, { label: 'CR tư vấn', value: '10.2%' }],
      [{ key: 'segment', label: 'Phân khúc' }, { key: 'sessions', label: 'Phiên', type: 'number' }, { key: 'orders', label: 'Đơn', type: 'number' }, { key: 'cr', label: 'CR' }],
      [{ segment: 'Mobile – Organic', sessions: 62400, orders: 886, cr: '1.42%' }, { segment: 'Desktop – Organic', sessions: 18400, orders: 486, cr: '2.64%' }, { segment: 'Email', sessions: 12400, orders: 620, cr: '5.00%' }, { segment: 'Tư vấn showroom', sessions: 2200, orders: 224, cr: '10.2%' }]
    ),
  ],
};

// ----------------------------------------------------------------------
// SEO GROUP
// ----------------------------------------------------------------------
const seoPage = (slug: string, name: string, sample: string) =>
  mod(slug, name, `Tối ưu SEO cho ${name.toLowerCase()}.`, 'solar:graph-up-bold-duotone',
    [{ label: 'URL', value: '32' }, { label: 'Điểm TB', value: '86/100' }, { label: 'Thiếu meta', value: '2' }, { label: 'Top 10', value: '18' }],
    [{ key: 'url', label: 'URL' }, { key: 'title', label: 'Meta title' }, { key: 'keyword', label: 'Từ khoá' }, { key: 'position', label: 'Hạng', type: 'number' }, STATUS_COL],
    [{ url: sample, title: `${name} – SOFA9`, keyword: 'sofa retro', position: 4, status: 'Tốt' }, { url: `${sample}/velvet`, title: 'Sofa velvet retro', keyword: 'sofa velvet', position: 8, status: 'Tốt' }, { url: `${sample}/pop-art`, title: '', keyword: 'sofa pop art', position: 16, status: 'Thiếu meta' }],
    ['Quét SEO', 'Xuất báo cáo']
  );

const SEO_GROUP: Sofa9AdminGroup = {
  slug: 'seo', name: 'SEO', icon: 'solar:graph-new-bold-duotone',
  modules: [
    seoPage('category', 'Trang danh mục', '/sofa9/products/category'),
    seoPage('product', 'Trang sản phẩm', '/sofa9/products'),
    seoPage('collection', 'Trang bộ sưu tập', '/sofa9/collections'),
    seoPage('project', 'Trang dự án', '/sofa9/projects'),
    seoPage('showroom', 'Trang showroom', '/sofa9/showrooms'),
    seoPage('blog', 'Trang blog', '/sofa9/blog'),
    seoPage('brand', 'Trang thương hiệu', '/sofa9/about'),
    mod('sitemap', 'Sitemap', 'Sơ đồ site XML.', 'solar:sitemap-bold-duotone',
      [{ label: 'URL', value: '842' }, { label: 'Index', value: '796' }, { label: 'Lỗi', value: '4' }, { label: 'Cập nhật', value: '12/08' }],
      [{ key: 'file', label: 'Tệp' }, { key: 'urls', label: 'URL', type: 'number' }, { key: 'indexed', label: 'Index', type: 'number' }, STATUS_COL],
      [{ file: 'sitemap-products.xml', urls: 240, indexed: 232, status: 'Hợp lệ' }, { file: 'sitemap-blog.xml', urls: 86, indexed: 82, status: 'Hợp lệ' }, { file: 'sitemap-pages.xml', urls: 28, indexed: 24, status: '4 URL lỗi' }],
      ['Tạo lại sitemap', 'Gửi Search Console']
    ),
    mod('robots', 'Robots', 'Quy tắc thu thập.', 'solar:shield-check-bold-duotone',
      [{ label: 'Quy tắc', value: '8' }, { label: 'Chặn', value: '4' }, { label: 'Bot', value: '3' }, { label: 'Cập nhật', value: '01/08' }],
      [{ key: 'agent', label: 'User-agent' }, { key: 'rule', label: 'Quy tắc' }, { key: 'path', label: 'Đường dẫn' }, STATUS_COL],
      [{ agent: '*', rule: 'Allow', path: '/', status: 'Hoạt động' }, { agent: '*', rule: 'Disallow', path: '/sofa9/admin', status: 'Hoạt động' }, { agent: 'Googlebot', rule: 'Allow', path: '/', status: 'Hoạt động' }],
      ['Sửa robots.txt']
    ),
    mod('schema', 'Schema', 'Dữ liệu có cấu trúc JSON-LD.', 'solar:code-square-bold-duotone',
      [{ label: 'Loại', value: '6' }, { label: 'URL', value: '642' }, { label: 'Cảnh báo', value: '2' }, { label: 'Lỗi', value: '0' }],
      [{ key: 'type', label: 'Loại' }, { key: 'scope', label: 'Áp dụng' }, { key: 'urls', label: 'URL', type: 'number' }, STATUS_COL],
      [{ type: 'Product', scope: 'SP', urls: 240, status: 'Hợp lệ' }, { type: 'Article', scope: 'Blog', urls: 86, status: '2 cảnh báo' }, { type: 'LocalBusiness', scope: 'Showroom', urls: 4, status: 'Hợp lệ' }, { type: 'FAQPage', scope: 'FAQ', urls: 1, status: 'Hợp lệ' }],
      ['Kiểm tra schema']
    ),
  ],
};

// ----------------------------------------------------------------------
// ACCESS GROUP
// ----------------------------------------------------------------------
const ACCESS_GROUP: Sofa9AdminGroup = {
  slug: 'access', name: 'Phân quyền', icon: 'solar:lock-keyhole-bold-duotone',
  modules: [
    mod('users', 'Người dùng', 'Tài khoản quản trị.', 'solar:user-bold-duotone',
      [{ label: 'Tài khoản', value: '18' }, { label: 'Hoạt động', value: '16' }, { label: '2FA', value: '12' }, { label: 'Khoá', value: '1' }],
      [{ key: 'name', label: 'Người dùng' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Vai trò' }, STATUS_COL],
      [{ name: 'Bảo Ngân', email: 'ngan@sofa9.vn', role: 'Quản trị', status: 'Hoạt động' }, { name: 'Đức Anh', email: 'anh@sofa9.vn', role: 'Bán hàng', status: 'Hoạt động' }, { name: 'Mỹ Duyên', email: 'duyen@sofa9.vn', role: 'Biên tập', status: 'Bị khoá' }],
      ['Mời người dùng']
    ),
    mod('roles', 'Vai trò', 'Nhóm vai trò.', 'solar:users-group-two-rounded-bold-duotone',
      [{ label: 'Vai trò', value: '5' }, { label: 'Tuỳ chỉnh', value: '2' }, { label: 'Người dùng', value: '18' }, { label: 'Mặc định', value: 'Nhân viên' }],
      [{ key: 'role', label: 'Vai trò' }, { key: 'users', label: 'Người', type: 'number' }, { key: 'scope', label: 'Phạm vi' }, STATUS_COL],
      [{ role: 'Quản trị', users: 2, scope: 'Toàn quyền', status: 'Hệ thống' }, { role: 'Bán hàng', users: 6, scope: 'Đơn, CRM', status: 'Hệ thống' }, { role: 'Biên tập', users: 4, scope: 'CMS, Blog', status: 'Tuỳ chỉnh' }, { role: 'CSKH', users: 6, scope: 'CRM, Hỗ trợ', status: 'Tuỳ chỉnh' }],
      ['Tạo vai trò']
    ),
    mod('permissions', 'Quyền hạn', 'Ma trận quyền.', 'solar:key-bold-duotone',
      [{ label: 'Module', value: '24' }, { label: 'Quyền', value: '96' }, { label: 'Nhạy cảm', value: '8' }, { label: 'Cần duyệt', value: '4' }],
      [{ key: 'module', label: 'Module' }, { key: 'action', label: 'Hành động' }, { key: 'roles', label: 'Vai trò' }, STATUS_COL],
      [{ module: 'Đơn hàng', action: 'Huỷ đơn', roles: 'Quản trị, Bán hàng', status: 'Cần phê duyệt' }, { module: 'Hoàn tiền', action: 'Duyệt', roles: 'Quản trị', status: 'Nhạy cảm' }, { module: 'CMS', action: 'Xuất bản', roles: 'Quản trị, Biên tập', status: 'Bình thường' }],
      ['Sửa ma trận']
    ),
    mod('audit-log', 'Nhật ký hệ thống', 'Lịch sử thao tác.', 'solar:clipboard-list-bold-duotone',
      [{ label: 'Sự kiện hôm nay', value: '642' }, { label: 'Đăng nhập sai', value: '4' }, { label: 'Đổi cấu hình', value: '3' }, { label: 'Lưu trữ', value: '180 ngày' }],
      [{ key: 'time', label: 'Thời gian' }, { key: 'user', label: 'Người' }, { key: 'action', label: 'Hành động' }, STATUS_COL],
      [{ time: '12/08 09:12', user: 'Bảo Ngân', action: 'Xuất bản trang chủ', status: 'Thành công' }, { time: '12/08 08:41', user: 'Đức Anh', action: 'Duyệt hoàn tiền', status: 'Thành công' }, { time: '12/08 07:58', user: 'unknown', action: 'Đăng nhập sai', status: 'Từ chối' }],
      ['Xuất nhật ký']
    ),
  ],
};

// ----------------------------------------------------------------------
export const SOFA9_ADMIN_GROUPS: Sofa9AdminGroup[] = [
  CMS_GROUP, PRODUCT_GROUP, WAREHOUSE_GROUP, ORDER_GROUP, CRM_GROUP, MARKETING_GROUP, ANALYTICS_GROUP, SEO_GROUP, ACCESS_GROUP,
];

export function findSofa9AdminModule(groupSlug?: string, moduleSlug?: string) {
  const group = SOFA9_ADMIN_GROUPS.find((g) => g.slug === groupSlug);
  if (!group) return null;
  const found = group.modules.find((m) => m.slug === moduleSlug) ?? group.modules[0];
  return { group, module: found };
}

export const SOFA9_ADMIN_KPIS = [
  { label: 'Tổng doanh thu', value: '4.2 tỷ', trend: '284 đơn', color: 'primary' as const },
  { label: 'Đơn hàng', value: '284', trend: '24 chờ xác nhận', color: 'info' as const },
  { label: 'Khách hàng', value: '1.840', trend: '86 VIP', color: 'success' as const },
  { label: 'Sản phẩm đang bán', value: '36', trend: '4 hết/nghỉ', color: 'warning' as const },
];

export const SOFA9_ADMIN_ACTIVITIES = [
  { text: 'Xuất bản bài blog "Retro Memphis: Hướng dẫn mix màu"', time: '09:12', tag: 'CMS' },
  { text: 'Duyệt hoàn tiền HT-08-04 cho đơn SF9-26081190', time: '08:41', tag: 'Đơn hàng' },
  { text: 'Thêm sản phẩm Sofa Pink Piano (Pop Art)', time: '08:15', tag: 'Sản phẩm' },
  { text: 'Tạo chiến dịch email "BST Velvet Mới"', time: '07:30', tag: 'Marketing' },
  { text: 'Cập nhật meta title cho /sofa9/products', time: '06:48', tag: 'SEO' },
];
