// SOFA2 ADMIN — Lược đồ chi tiết cho module Sản phẩm
// Mỗi trang (Danh mục, Sản phẩm, Thuộc tính, Biến thể, Kho hàng, Giá bán) gắn với
// trang tương ứng trên website khách hàng /sofa2/products và dùng chung form CMS.
// ----------------------------------------------------------------------

import { SOFA2_PRODUCT_CATEGORIES } from 'src/sections/sofa2/sofa2-pages-data';

import type { Sofa2CmsField, Sofa2CmsSchema, Sofa2CmsFieldType } from './sofa2-cms';

const f = (
  key: string,
  label: string,
  type: Sofa2CmsFieldType,
  group: Sofa2CmsField['group'],
  extra: Partial<Sofa2CmsField> = {}
): Sofa2CmsField => ({ key, label, type, group, ...extra });

const labels = (list: { label: string }[] = []) => list.map((x) => x.label);

const TYPE_NAMES = labels(SOFA2_PRODUCT_CATEGORIES.types);
const STYLE_NAMES = labels(SOFA2_PRODUCT_CATEGORIES.styles);
const SPACE_NAMES = labels(SOFA2_PRODUCT_CATEGORIES.spaces);

const WAREHOUSES = ['Kho TP.HCM', 'Kho Hà Nội', 'Kho Bình Dương', 'Showroom Q.1', 'Showroom Tây Hồ'];

const seo = (path: string): Sofa2CmsField[] => [
  f('slug', 'Đường dẫn', 'text', 'seo', { placeholder: `${path}/ten-trang`, helper: 'Để trống sẽ tự sinh từ tên.' }),
  f('metaTitle', 'Meta title', 'text', 'seo', { maxLength: 60 }),
  f('metaDescription', 'Meta description', 'textarea', 'seo', { maxLength: 160, multiline: 3 }),
  f('indexable', 'Cho phép Google lập chỉ mục', 'switch', 'seo'),
];

export const SOFA2_CATALOG_SCHEMAS: Record<string, Sofa2CmsSchema> = {
  categories: {
    clientPath: '/sofa2/products/category',
    entity: 'danh mục',
    titleKey: 'name',
    statusKey: 'status',
    statusOptions: ['Hiển thị', 'Ẩn'],
    defaultStatus: 'Hiển thị',
    statusToggle: false,
    fields: [
      f('name', 'Tên danh mục', 'text', 'content', { required: true }),
      f('parent', 'Danh mục cha', 'select', 'content', {
        required: true,
        options: ['Phong cách', 'Theo kiểu dáng', 'Không gian', 'Kích thước', 'Khoảng giá'],
      }),
      f('description', 'Mô tả danh mục', 'textarea', 'content', { multiline: 4 }),
      f('image', 'Ảnh đại diện', 'url', 'content', { placeholder: 'https://...' }),
      f('products', 'Số sản phẩm', 'number', 'display', { disabled: true, helper: 'Tự đếm sản phẩm được gán danh mục này.' }),
      f('minPrice', 'Giá từ (₫, bao gồm)', 'number', 'display', { helper: 'Chỉ dùng cho nhóm Khoảng giá. Giá bán đúng bằng ngưỡng này được tính vào trang.' }),
      f('maxPrice', 'Giá đến (₫, không bao gồm)', 'number', 'display', { helper: 'Chỉ dùng cho nhóm Khoảng giá. Để trống hoặc nhập 0 nếu không giới hạn; giá bằng ngưỡng này thuộc khoảng kế tiếp.' }),
      f('minSizeCm', 'Chiều dài tối thiểu (cm)', 'number', 'display', { helper: 'Chỉ dùng cho nhóm Kích thước; ngưỡng bao gồm.' }),
      f('maxSizeCm', 'Chiều dài tối đa (cm)', 'number', 'display', { helper: 'Chỉ dùng cho nhóm Kích thước; ngưỡng tối đa không bao gồm.' }),
      f('status', 'Trạng thái', 'select', 'display', { required: true, options: ['Hiển thị', 'Ẩn'] }),
      f('order', 'Thứ tự hiển thị', 'number', 'display'),
      f('showInMenu', 'Hiện trên menu', 'switch', 'display'),
      f('showInFilter', 'Dùng làm bộ lọc', 'switch', 'display'),
      ...seo('/sofa2/products/category'),
    ],
  },

  products: {
    clientPath: '/sofa2/products',
    entity: 'sản phẩm',
    titleKey: 'name',
    statusKey: 'status',
    statusOptions: ['Đang bán', 'Hết hàng', 'Bản nháp', 'Ngừng bán'],
    defaultStatus: 'Bản nháp',
    statusToggle: false,
    fields: [
      f('name', 'Tên sản phẩm', 'text', 'content', { required: true }),
      f('sku', 'Mã SKU', 'text', 'content', { required: true, placeholder: 'LX-XXX-00' }),
      f('category', 'Danh mục sản phẩm', 'select', 'content', { required: true, options: TYPE_NAMES }),
      f('style', 'Phong cách', 'select', 'content', { options: STYLE_NAMES }),
      f('space', 'Không gian chính', 'select', 'content', { options: SPACE_NAMES }),
      f('additionalSpaces', 'Không gian phù hợp khác (mỗi dòng một nhóm)', 'textarea', 'content', { multiline: 4, helper: 'Mỗi dòng nhập đúng tên nhóm Không gian đang hoạt động, ví dụ Café hoặc Nhà hàng. Sản phẩm có thể xuất hiện trên nhiều trang không gian.' }),
      f('material', 'Chất liệu', 'text', 'content', { placeholder: 'Vải linen, khung gỗ sồi FSC' }),
      f('dimensions', 'Kích thước (Dài x Rộng x Cao, cm)', 'text', 'content', { required: true, placeholder: '220 x 90 x 80', helper: 'Nhập số đo theo thứ tự dài x rộng x cao; số đo đầu tiên dùng để xếp Sofa nhỏ / trung / lớn.' }),
      f('shortDescription', 'Mô tả ngắn', 'textarea', 'content', { multiline: 2, maxLength: 200 }),
      f('description', 'Mô tả chi tiết', 'textarea', 'content', { multiline: 6 }),
      f('image', 'Ảnh chính', 'url', 'content', { placeholder: 'https://...' }),
      f('gallery', 'Album ảnh sản phẩm (mỗi dòng một URL)', 'textarea', 'content', { multiline: 5, helper: 'Mỗi URL là một ảnh bổ sung, theo thứ tự sẽ hiển thị trong thư viện.' }),
      f('images360', 'Ảnh xoay 360° (mỗi dòng một khung hình)', 'textarea', 'content', { multiline: 6, helper: 'Thêm các khung ảnh đã chụp quanh sản phẩm theo thứ tự góc xoay.' }),
      f('videoUrl', 'Video sản phẩm (YouTube, Vimeo hoặc MP4/WebM)', 'url', 'content', { placeholder: 'https://youtu.be/...', helper: 'Không bắt buộc; chỉ nhận liên kết video an toàn.' }),
      f('videoCaption', 'Chú thích video', 'text', 'content', { maxLength: 180 }),
      f('colors', 'Màu sắc (mỗi dòng một màu)', 'textarea', 'content', { multiline: 4 }),
      f('frameMaterial', 'Vật liệu khung', 'text', 'content', { maxLength: 160 }),
      f('upholstery', 'Vật liệu bọc / hoàn thiện', 'text', 'content', { maxLength: 180 }),
      f('cushion', 'Cấu tạo đệm', 'text', 'content', { maxLength: 180 }),
      f('weightKg', 'Khối lượng (kg)', 'number', 'content'),
      f('seatCount', 'Số chỗ ngồi', 'number', 'content'),
      f('features', 'Đặc điểm nổi bật (mỗi dòng một ý)', 'textarea', 'content', { multiline: 6 }),
      f('assembly', 'Hướng dẫn lắp đặt', 'textarea', 'content', { multiline: 4 }),
      f('included', 'Phụ kiện / sản phẩm đi kèm', 'textarea', 'content', { multiline: 3 }),
      f('usageInstructions', 'Hướng dẫn sử dụng', 'textarea', 'content', { multiline: 5 }),
      f('careGuide', 'Hướng dẫn bảo quản', 'textarea', 'content', { multiline: 6 }),
      f('warrantyText', 'Chi tiết bảo hành', 'textarea', 'content', { multiline: 3 }),
      f('relatedProductIds', 'Sản phẩm liên quan (mỗi dòng một ID)', 'textarea', 'content', { multiline: 4, helper: 'Nhập ID, SKU hoặc slug của sản phẩm Sofa2; để trống sẽ gợi ý theo danh mục/phong cách.' }),
      f('price', 'Giá bán (₫)', 'number', 'display', { required: true }),
      f('compareAt', 'Giá niêm yết (₫)', 'number', 'display'),
      f('warranty', 'Bảo hành (tháng)', 'number', 'display'),
      f('status', 'Trạng thái', 'select', 'display', {
        required: true,
        options: ['Đang bán', 'Hết hàng', 'Bản nháp', 'Ngừng bán'],
      }),
      f('featured', 'Sản phẩm nổi bật', 'switch', 'display'),
      f('isNew', 'Gắn nhãn "Mới"', 'switch', 'display'),
      f('launchDate', 'Ngày mở bán', 'date', 'display'),
      ...seo('/sofa2/products'),
    ],
  },

  'product-reviews': {
    clientPath: '/sofa2/products', entity: 'đánh giá', titleKey: 'customer', statusKey: 'status',
    statusOptions: ['Đã xuất bản', 'Chờ duyệt', 'Ẩn'], defaultStatus: 'Chờ duyệt', statusToggle: false,
    fields: [
      f('product', 'Sản phẩm', 'select', 'content', { required: true }),
      f('customer', 'Khách hàng', 'text', 'content', { required: true }),
      f('rating', 'Số sao (1–5)', 'number', 'content', { required: true }),
      f('title', 'Tiêu đề', 'text', 'content'),
      f('content', 'Nội dung đánh giá', 'textarea', 'content', { required: true, multiline: 5 }),
      f('date', 'Ngày đánh giá', 'date', 'display'),
      f('status', 'Trạng thái kiểm duyệt', 'select', 'display', { required: true, options: ['Đã xuất bản', 'Chờ duyệt', 'Ẩn'] }),
    ],
  },

  'product-questions': {
    clientPath: '/sofa2/products', entity: 'câu hỏi', titleKey: 'question', statusKey: 'status',
    statusOptions: ['Đã xuất bản', 'Chờ duyệt', 'Ẩn'], defaultStatus: 'Chờ duyệt', statusToggle: false,
    fields: [
      f('product', 'Sản phẩm', 'select', 'content', { required: true }),
      f('customer', 'Người hỏi', 'text', 'content', { required: true }),
      f('question', 'Câu hỏi', 'textarea', 'content', { required: true, multiline: 3 }),
      f('answer', 'Trả lời', 'textarea', 'content', { multiline: 4 }),
      f('answeredBy', 'Người trả lời', 'text', 'content'),
      f('date', 'Ngày gửi', 'date', 'display'),
      f('status', 'Trạng thái kiểm duyệt', 'select', 'display', { required: true, options: ['Đã xuất bản', 'Chờ duyệt', 'Ẩn'] }),
    ],
  },

  attributes: {
    clientPath: '/sofa2/products',
    entity: 'thuộc tính',
    titleKey: 'name',
    statusKey: 'status',
    statusOptions: ['Hoạt động', 'Tạm ẩn'],
    defaultStatus: 'Hoạt động',
    statusToggle: false,
    fields: [
      f('name', 'Tên thuộc tính', 'text', 'content', { required: true }),
      f('code', 'Mã thuộc tính', 'text', 'content', { placeholder: 'color' }),
      f('displayType', 'Kiểu hiển thị', 'select', 'content', {
        options: ['Ô màu', 'Nút chọn', 'Danh sách thả', 'Ảnh minh hoạ'],
      }),
      f('valueList', 'Danh sách giá trị (cách nhau dấu phẩy)', 'textarea', 'content', {
        multiline: 3,
        placeholder: 'Beige, Grey, Brown',
      }),
      f('values', 'Số giá trị', 'number', 'display'),
      f('usage', 'Áp dụng', 'select', 'display', {
        required: true,
        options: ['Biến thể + Bộ lọc', 'Biến thể', 'Bộ lọc', 'Tuỳ chọn'],
      }),
      f('status', 'Trạng thái', 'select', 'display', { required: true, options: ['Hoạt động', 'Tạm ẩn'] }),
      f('required', 'Bắt buộc chọn khi mua', 'switch', 'display'),
    ],
  },

  variants: {
    clientPath: '/sofa2/products',
    entity: 'biến thể',
    titleKey: 'sku',
    statusKey: 'status',
    statusOptions: ['Đang bán', 'Hết hàng', 'Ngừng bán'],
    defaultStatus: 'Đang bán',
    statusToggle: false,
    fields: [
      f('sku', 'SKU biến thể', 'text', 'content', { required: true }),
      f('product', 'Sản phẩm gốc', 'select', 'content', { required: true }),
      f('option', 'Tuỳ chọn (Chất liệu / Màu / Kích thước)', 'text', 'content', {
        required: true,
        placeholder: 'Linen / Beige / 3 chỗ',
      }),
      f('image', 'Ảnh biến thể', 'url', 'content'),
      f('barcode', 'Mã vạch', 'text', 'content'),
      f('stock', 'Tồn kho', 'number', 'display', { required: true }),
      f('price', 'Giá (₫)', 'number', 'display', { required: true }),
      f('weight', 'Khối lượng (kg)', 'number', 'display'),
      f('status', 'Trạng thái', 'select', 'display', {
        required: true,
        options: ['Đang bán', 'Hết hàng', 'Ngừng bán'],
      }),
      f('isDefault', 'Biến thể mặc định', 'switch', 'display'),
    ],
  },

  inventory: {
    clientPath: '/sofa2/products',
    entity: 'dòng tồn kho',
    titleKey: 'sku',
    statusKey: 'status',
    statusOptions: ['Đủ hàng', 'Sắp hết', 'Hết hàng'],
    defaultStatus: 'Đủ hàng',
    statusToggle: false,
    fields: [
      f('sku', 'SKU', 'select', 'content', { required: true }),
      f('warehouse', 'Kho', 'select', 'content', { required: true, options: WAREHOUSES }),
      f('location', 'Vị trí kệ', 'text', 'content', { placeholder: 'A-03-2' }),
      f('note', 'Ghi chú nhập/xuất', 'textarea', 'content', { multiline: 3 }),
      f('stock', 'Tồn thực tế', 'number', 'display', { required: true }),
      f('reserved', 'Đang giữ cho đơn', 'number', 'display'),
      f('minStock', 'Ngưỡng cảnh báo', 'number', 'display', { helper: 'Dưới mức này chuyển "Sắp hết".' }),
      f('status', 'Trạng thái', 'select', 'display', {
        required: true,
        options: ['Đủ hàng', 'Sắp hết', 'Hết hàng'],
      }),
      f('updated', 'Kiểm kê lần cuối', 'date', 'display'),
    ],
  },

  pricing: {
    clientPath: '/sofa2/promotions',
    entity: 'bảng giá',
    titleKey: 'sku',
    statusKey: 'status',
    statusOptions: ['Đang giảm', 'Giá gốc', 'Chờ bắt đầu', 'Hết hiệu lực'],
    defaultStatus: 'Giá gốc',
    statusToggle: false,
    fields: [
      f('sku', 'SKU', 'select', 'content', { required: true }),
      f('priceList', 'Bảng giá', 'select', 'content', {
        options: ['Bán lẻ', 'Đại lý cấp 1', 'Đại lý cấp 2', 'Dự án', 'Flash sale'],
      }),
      f('note', 'Ghi chú', 'textarea', 'content', { multiline: 2 }),
      f('list', 'Giá niêm yết (₫)', 'number', 'display', { required: true }),
      f('sale', 'Giá bán (₫)', 'number', 'display', { required: true }),
      f('dealer', 'Giá đại lý (₫)', 'number', 'display'),
      f('startDate', 'Bắt đầu', 'date', 'display'),
      f('endDate', 'Kết thúc', 'date', 'display'),
      f('status', 'Trạng thái', 'select', 'display', {
        required: true,
        options: ['Đang giảm', 'Giá gốc', 'Chờ bắt đầu', 'Hết hiệu lực'],
      }),
      f('showBadge', 'Hiện nhãn % giảm trên web', 'switch', 'display'),
    ],
  },
};

export function getSofa2CatalogSchema(moduleSlug?: string) {
  return moduleSlug ? SOFA2_CATALOG_SCHEMAS[moduleSlug] : undefined;
}
