// SOFA2 ADMIN — Lược đồ chi tiết cho module CMS
// Mỗi trang CMS được mô tả bằng: đường dẫn client tương ứng, nhãn bản ghi,
// nhóm trường dữ liệu (nội dung / hiển thị / SEO) để sinh form thêm-sửa đầy đủ.
// ----------------------------------------------------------------------

export type Sofa2CmsFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'date'
  | 'url'
  | 'switch';

export type Sofa2CmsField = {
  key: string;
  label: string;
  type: Sofa2CmsFieldType;
  group: 'content' | 'display' | 'seo';
  options?: string[];
  helper?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  multiline?: number;
  placeholder?: string;
};

export type Sofa2CmsSchema = {
  /** Đường dẫn trang tương ứng trên website khách hàng */
  clientPath: string;
  /** Tên gọi một bản ghi, dùng cho tiêu đề dialog và thông báo */
  entity: string;
  /** Khoá hiển thị làm tiêu đề bản ghi */
  titleKey: string;
  /** Khoá trạng thái xuất bản */
  statusKey: string;
  /** Các trạng thái hợp lệ */
  statusOptions: string[];
  fields: Sofa2CmsField[];
  /** Nhãn cho hành động "xuất bản" (mặc định: "Xuất bản") */
  publishLabel?: string;
  /** Trạng thái mặc định khi tạo mới (mặc định: trạng thái thứ 2 hoặc "Bản nháp") */
  defaultStatus?: string;
  /** Ẩn thẻ "trang tương ứng" — dùng cho module không có trang client trực tiếp */
  hideClientLink?: boolean;
  /** Ẩn công tắc trạng thái khi trạng thái biểu thị tiến trình nghiệp vụ, không phải xuất bản */
  statusToggle?: boolean;
  /** Nhãn hiển thị cho giá trị đã lưu (mặc định: giữ nguyên giá trị) */
  valueLabel?: (value: string) => string;
};

// ----------------------------------------------------------------------

const PUBLISH_STATES = ['Đã xuất bản', 'Bản nháp', 'Tạm ẩn'];

const f = (
  key: string,
  label: string,
  type: Sofa2CmsFieldType,
  group: Sofa2CmsField['group'],
  extra: Partial<Sofa2CmsField> = {}
): Sofa2CmsField => ({ key, label, type, group, ...extra });

/** Bộ trường SEO dùng chung cho mọi trang CMS */
const seoFields: Sofa2CmsField[] = [
  f('metaTitle', 'Meta title', 'text', 'seo', {
    maxLength: 60,
    helper: 'Tối đa 60 ký tự để hiển thị đủ trên Google.',
  }),
  f('metaDescription', 'Meta description', 'textarea', 'seo', {
    maxLength: 160,
    multiline: 3,
    helper: 'Tối đa 160 ký tự, chứa từ khoá chính.',
  }),
  f('ogImage', 'Ảnh chia sẻ (OG image)', 'url', 'seo', {
    placeholder: 'https://...',
  }),
  f('indexable', 'Cho phép Google lập chỉ mục', 'switch', 'seo'),
];

/** Bộ trường hiển thị dùng chung */
const displayFields = (statusOptions = PUBLISH_STATES): Sofa2CmsField[] => [
  f('status', 'Trạng thái', 'select', 'display', { options: statusOptions, required: true }),
  f('order', 'Thứ tự hiển thị', 'number', 'display', { helper: 'Số nhỏ hiển thị trước.' }),
  f('updated', 'Cập nhật', 'date', 'display'),
  f('author', 'Người phụ trách', 'text', 'display'),
];

/** Lược đồ cho các trang nội dung dạng khối (trang chủ, giới thiệu, liên hệ...) */
const pageSchema = (clientPath: string): Sofa2CmsSchema => ({
  clientPath,
  entity: 'khối nội dung',
  titleKey: 'block',
  statusKey: 'status',
  statusOptions: PUBLISH_STATES,
  fields: [
    f('block', 'Tên khối nội dung', 'text', 'content', { required: true }),
    f('type', 'Loại khối', 'select', 'content', {
      required: true,
      options: [
        'Banner',
        'Rich text',
        'Danh sách SP',
        'Slider',
        'Bộ sưu tập',
        'Form liên hệ',
        'Bản đồ',
        'Câu hỏi thường gặp',
        'Video',
      ],
    }),
    f('heading', 'Tiêu đề hiển thị', 'text', 'content'),
    f('content', 'Nội dung', 'textarea', 'content', { multiline: 5 }),
    f('image', 'Ảnh minh hoạ', 'url', 'content', { placeholder: 'https://...' }),
    f('ctaLabel', 'Nhãn nút hành động', 'text', 'content'),
    f('ctaLink', 'Liên kết nút', 'url', 'content', { placeholder: `${clientPath}` }),
    ...displayFields(),
    ...seoFields,
  ],
});

// ----------------------------------------------------------------------

export const SOFA2_CMS_SCHEMAS: Record<string, Sofa2CmsSchema> = {
  home: pageSchema('/sofa2'),
  about: pageSchema('/sofa2/about'),
  contact: pageSchema('/sofa2/contact'),
  policy: pageSchema('/sofa2/policy'),
  terms: pageSchema('/sofa2/policy/terms'),
  faq: pageSchema('/sofa2/faq'),

  promotions: {
    clientPath: '/sofa2/promotions',
    entity: 'chiến dịch khuyến mãi',
    titleKey: 'title',
    statusKey: 'status',
    statusOptions: ['Đang chạy', 'Bản nháp', 'Tạm dừng', 'Hết hạn'],
    defaultStatus: 'Bản nháp',
    fields: [
      f('title', 'Tên chiến dịch', 'text', 'content', { required: true, maxLength: 100 }),
      f('code', 'Mã ưu đãi', 'text', 'content', { required: true, maxLength: 32, helper: 'Dùng chữ in hoa, số hoặc dấu gạch ngang; phải duy nhất.' }),
      f('headline', 'Tiêu đề hiển thị', 'text', 'content', { required: true, maxLength: 100 }),
      f('offerText', 'Quyền lợi ngắn', 'text', 'content', { required: true, placeholder: 'Giảm 20%, Tặng dịch vụ...' }),
      f('discountType', 'Loại ưu đãi', 'select', 'content', { required: true, options: ['Phần trăm', 'Số tiền', 'Quà tặng / dịch vụ', 'Quyền lợi'] }),
      f('discountValue', 'Giá trị ưu đãi', 'number', 'content', { helper: 'Phần trăm nhập 0–100; số tiền nhập theo đồng.' }),
      f('description', 'Mô tả chiến dịch', 'textarea', 'content', { required: true, multiline: 4 }),
      f('scope', 'Phạm vi áp dụng', 'select', 'content', { required: true, options: ['Toàn bộ sản phẩm', 'Sản phẩm', 'Bộ sưu tập', 'Dịch vụ bảo hành', 'Dịch vụ bảo trì', 'Dịch vụ sửa chữa', 'Dịch vụ vệ sinh', 'Chính sách đổi trả', 'Sản phẩm chọn lọc'] }),
      f('productScope', 'Sản phẩm / dịch vụ áp dụng', 'text', 'content'),
      f('audience', 'Đối tượng khách hàng', 'text', 'content'),
      f('channels', 'Kênh áp dụng', 'text', 'content'),
      f('minOrder', 'Giá trị đơn tối thiểu (đ)', 'number', 'content'),
      f('maxDiscount', 'Mức giảm tối đa (đ)', 'number', 'content'),
      f('stockLimit', 'Số lượt tối đa', 'number', 'display'),
      f('usedCount', 'Số lượt đã dùng', 'number', 'display'),
      f('impressions', 'Lượt hiển thị', 'number', 'display'),
      f('clicks', 'Lượt nhấp', 'number', 'display'),
      f('orders', 'Đơn hàng quy đổi', 'number', 'display'),
      f('revenue', 'Doanh thu quy đổi (đ)', 'number', 'display'),
      f('budget', 'Ngân sách dự kiến (đ)', 'number', 'display'),
      f('startAt', 'Bắt đầu', 'date', 'display', { required: true }),
      f('endAt', 'Kết thúc', 'date', 'display', { required: true }),
      f('terms', 'Điều kiện / điều khoản (mỗi dòng một điều)', 'textarea', 'content', { multiline: 5 }),
      f('image', 'Ảnh chiến dịch', 'url', 'content'),
      f('ctaLabel', 'Nhãn nút', 'text', 'content'),
      f('ctaLink', 'Liên kết đích nội bộ', 'text', 'content', { placeholder: '/sofa2/promotions/maintenance' }),
      f('order', 'Thứ tự ưu tiên', 'number', 'display'),
      f('status', 'Trạng thái', 'select', 'display', { required: true, options: ['Đang chạy', 'Bản nháp', 'Tạm dừng', 'Hết hạn'] }),
      f('updated', 'Ngày cập nhật', 'date', 'display'),
    ],
  },

  'promotion-services': {
    clientPath: '/sofa2/promotions',
    entity: 'trang dịch vụ / ưu đãi',
    titleKey: 'title',
    statusKey: 'status',
    statusOptions: PUBLISH_STATES,
    defaultStatus: 'Bản nháp',
    fields: [
      f('title', 'Tên trang dịch vụ', 'text', 'content', { required: true, maxLength: 80 }),
      f('slug', 'Đường dẫn dịch vụ', 'text', 'content', { required: true, placeholder: 'warranty', helper: 'Chỉ dùng chữ thường, số và dấu gạch ngang; URL client là /sofa2/promotions/{slug}.' }),
      f('icon', 'Icon', 'text', 'content', { placeholder: 'solar:shield-check-bold-duotone' }),
      f('description', 'Mô tả ngắn', 'textarea', 'content', { required: true, multiline: 3, maxLength: 240 }),
      f('detail', 'Nội dung chi tiết', 'textarea', 'content', { multiline: 5 }),
      f('image', 'Ảnh hero', 'url', 'content', { placeholder: 'https://...' }),
      f('included', 'Quyền lợi / nội dung bao gồm (mỗi dòng một ý)', 'textarea', 'content', { multiline: 5 }),
      f('steps', 'Quy trình (mỗi dòng: Tên bước | Mô tả)', 'textarea', 'content', { multiline: 5, helper: 'Tối đa 4 bước; dùng dấu | để phân tách tên và mô tả.' }),
      f('plans', 'Gói dịch vụ (mỗi dòng: Tên | Giá | Chu kỳ | Quyền lợi; phân cách |)', 'textarea', 'content', { multiline: 5, helper: 'Tuỳ chọn; quyền lợi trong một gói phân cách bằng dấu chấm phẩy.' }),
      f('faq', 'Câu hỏi thường gặp (mỗi dòng: Câu hỏi | Trả lời)', 'textarea', 'content', { multiline: 4 }),
      f('order', 'Thứ tự hiển thị', 'number', 'display', { helper: 'Số nhỏ hiển thị trước.' }),
      f('status', 'Trạng thái xuất bản', 'select', 'display', { required: true, options: PUBLISH_STATES }),
      f('updated', 'Ngày cập nhật', 'date', 'display'),
      f('author', 'Người phụ trách', 'text', 'display'),
      f('metaTitle', 'Meta title', 'text', 'seo', { maxLength: 60 }),
      f('metaDescription', 'Meta description', 'textarea', 'seo', { maxLength: 160, multiline: 3 }),
    ],
  },

  projects: {
    clientPath: '/sofa2/projects',
    entity: 'dự án portfolio',
    titleKey: 'name',
    statusKey: 'status',
    statusOptions: PUBLISH_STATES,
    defaultStatus: 'Bản nháp',
    fields: [
      f('name', 'Tên dự án', 'text', 'content', { required: true, maxLength: 120 }),
      f('typeLabel', 'Danh mục dự án', 'select', 'content', { required: true, options: ['Dự án căn hộ', 'Dự án biệt thự', 'Dự án khách sạn', 'Dự án resort', 'Dự án văn phòng', 'Dự án showroom'] }),
      f('location', 'Địa điểm', 'text', 'content', { required: true, maxLength: 120 }),
      f('year', 'Năm hoàn thành', 'number', 'content', { required: true, helper: 'Nhập năm từ 2000 đến năm hiện tại + 5.' }),
      f('description', 'Mô tả dự án', 'textarea', 'content', { required: true, multiline: 5, maxLength: 1600 }),
      f('scope', 'Quy mô / phạm vi', 'text', 'content', { maxLength: 180, placeholder: '120 căn hộ cao cấp' }),
      f('image', 'Ảnh đại diện', 'url', 'content', { required: true, placeholder: 'https://...' }),
      f('gallery', 'Album ảnh (mỗi dòng: URL | chú thích)', 'textarea', 'content', { required: true, multiline: 8, helper: 'Ảnh đầu tiên là ảnh cover; nhập URL, có thể thêm chú thích sau dấu |.' }),
      f('productsUsed', 'Sản phẩm sử dụng (mỗi dòng một tên)', 'textarea', 'content', { multiline: 4, helper: 'Dùng tên sản phẩm chính xác để tự liên kết tới danh mục Sofa2.' }),
      f('videoUrl', 'Video dự án (YouTube, Vimeo hoặc MP4/WebM)', 'url', 'content', { placeholder: 'https://youtu.be/...', helper: 'Không bắt buộc; chỉ hiển thị video từ YouTube, Vimeo hoặc file MP4/WebM.' }),
      f('videoCaption', 'Chú thích video', 'textarea', 'content', { multiline: 2, maxLength: 240 }),
      f('showReview', 'Hiển thị đánh giá khách hàng', 'switch', 'display'),
      f('reviewQuote', 'Nội dung đánh giá', 'textarea', 'content', { multiline: 4, maxLength: 800 }),
      f('reviewName', 'Người đánh giá', 'text', 'content', { maxLength: 100 }),
      f('reviewRole', 'Chức danh / đơn vị', 'text', 'content', { maxLength: 140 }),
      f('reviewRating', 'Số sao (1–5)', 'number', 'content', { helper: 'Chấp nhận từ 1 đến 5 sao.' }),
      f('reviewDate', 'Ngày nhận đánh giá', 'date', 'content'),
      f('reviewAvatar', 'Ảnh đại diện người đánh giá', 'url', 'content'),
      f('completionStatus', 'Tiến độ dự án', 'select', 'display', { required: true, options: ['Đang triển khai', 'Đã hoàn thành', 'Tạm dừng'] }),
      f('featured', 'Đánh dấu dự án nổi bật', 'switch', 'display'),
      f('order', 'Thứ tự hiển thị', 'number', 'display', { helper: 'Số nhỏ hiển thị trước.' }),
      f('status', 'Trạng thái xuất bản', 'select', 'display', { required: true, options: PUBLISH_STATES }),
      f('updated', 'Ngày cập nhật', 'date', 'display'),
      f('author', 'Người phụ trách', 'text', 'display'),
      f('metaTitle', 'Meta title', 'text', 'seo', { maxLength: 60 }),
      f('metaDescription', 'Meta description', 'textarea', 'seo', { maxLength: 160, multiline: 3 }),
      f('ogImage', 'Ảnh chia sẻ', 'url', 'seo'),
      f('indexable', 'Cho phép Google lập chỉ mục', 'switch', 'seo'),
    ],
  },

  showrooms: {
    clientPath: '/sofa2/showrooms',
    entity: 'showroom',
    titleKey: 'name',
    statusKey: 'status',
    statusOptions: PUBLISH_STATES,
    defaultStatus: 'Bản nháp',
    fields: [
      f('code', 'Mã showroom', 'text', 'content', { required: true, maxLength: 16, placeholder: 'HN01' }),
      f('name', 'Tên showroom', 'text', 'content', { required: true, maxLength: 100 }),
      f('slug', 'Slug', 'text', 'content', { required: true, placeholder: 'ha-noi', helper: 'Dùng cho liên kết chia sẻ; ID hiện tại vẫn giữ nguyên để tương thích URL cũ.' }),
      f('city', 'Tỉnh / thành phố', 'text', 'content', { required: true }),
      f('district', 'Quận / huyện', 'text', 'content'),
      f('address', 'Địa chỉ đầy đủ', 'textarea', 'content', { required: true, multiline: 2, maxLength: 240 }),
      f('phone', 'Điện thoại', 'text', 'content', { required: true }),
      f('email', 'Email showroom', 'text', 'content'),
      f('description', 'Giới thiệu showroom', 'textarea', 'content', { required: true, multiline: 4, maxLength: 1200 }),
      f('image', 'Ảnh cover', 'url', 'content', { required: true }),
      f('gallery', 'Thư viện ảnh (mỗi dòng một URL)', 'textarea', 'content', { required: true, multiline: 6, helper: 'Dùng URL ảnh; dòng đầu có thể là ảnh mặt tiền.' }),
      f('hours', 'Giờ mở cửa tóm tắt', 'text', 'content', { required: true, placeholder: '08:00–20:00' }),
      f('openingHours', 'Lịch mở cửa theo ngày (mỗi dòng: Ngày | Giờ)', 'textarea', 'content', { required: true, multiline: 7, helper: 'Ví dụ: Thứ 2–Thứ 6 | 08:00–20:00.' }),
      f('holidayHours', 'Lịch ngày lễ / thông báo nghỉ', 'textarea', 'content', { multiline: 3 }),
      f('appointmentSlots', 'Khung giờ đặt lịch (mỗi dòng một khung)', 'textarea', 'content', { required: true, multiline: 5 }),
      f('services', 'Dịch vụ tại showroom (mỗi dòng một dịch vụ)', 'textarea', 'content', { multiline: 5 }),
      f('amenities', 'Tiện ích (mỗi dòng một tiện ích)', 'textarea', 'content', { multiline: 5 }),
      f('parking', 'Thông tin gửi xe', 'textarea', 'content', { multiline: 2 }),
      f('lat', 'Vĩ độ', 'number', 'content', { required: true, helper: 'Tọa độ thập phân để hiển thị bản đồ.' }),
      f('lng', 'Kinh độ', 'number', 'content', { required: true }),
      f('directionsUrl', 'Liên kết chỉ đường', 'url', 'content'),
      f('bookingEnabled', 'Cho phép đặt lịch online', 'switch', 'display'),
      f('order', 'Thứ tự hiển thị', 'number', 'display'),
      f('status', 'Trạng thái xuất bản', 'select', 'display', { required: true, options: PUBLISH_STATES }),
      f('updated', 'Ngày cập nhật', 'date', 'display'),
      f('author', 'Người phụ trách', 'text', 'display'),
      f('metaTitle', 'Meta title', 'text', 'seo', { maxLength: 60 }),
      f('metaDescription', 'Meta description', 'textarea', 'seo', { maxLength: 160, multiline: 3 }),
      f('ogImage', 'Ảnh chia sẻ', 'url', 'seo'),
      f('indexable', 'Cho phép Google lập chỉ mục', 'switch', 'seo'),
    ],
  },

  'showroom-bookings': {
    clientPath: '/sofa2/showrooms/visit',
    entity: 'lịch hẹn showroom',
    titleKey: 'bookingCode',
    statusKey: 'status',
    statusOptions: ['Chờ xác nhận', 'Đã xác nhận', 'Hoàn thành', 'Đã huỷ', 'Không đến'],
    defaultStatus: 'Chờ xác nhận',
    statusToggle: false,
    fields: [
      f('bookingCode', 'Mã lịch hẹn', 'text', 'content', { helper: 'Tự sinh nếu để trống.' }),
      f('customerName', 'Khách hàng', 'text', 'content', { required: true, maxLength: 100 }),
      f('phone', 'Số điện thoại', 'text', 'content', { required: true }),
      f('email', 'Email', 'text', 'content'),
      f('showroom', 'Showroom', 'select', 'content', { required: true }),
      f('purpose', 'Mục đích', 'select', 'content', { required: true, options: ['Tham quan showroom', 'Tư vấn nội thất'] }),
      f('appointmentDate', 'Ngày hẹn', 'date', 'content', { required: true }),
      f('appointmentTime', 'Khung giờ', 'select', 'content', { required: true }),
      f('guests', 'Số khách', 'number', 'content'),
      f('interest', 'Nhu cầu quan tâm', 'text', 'content'),
      f('notes', 'Ghi chú của khách', 'textarea', 'content', { multiline: 3 }),
      f('status', 'Trạng thái xử lý', 'select', 'display', { required: true, options: ['Chờ xác nhận', 'Đã xác nhận', 'Hoàn thành', 'Đã huỷ', 'Không đến'] }),
      f('assignedTo', 'Nhân viên phụ trách', 'text', 'display'),
      f('internalNote', 'Ghi chú nội bộ', 'textarea', 'display', { multiline: 3 }),
      f('source', 'Nguồn đặt lịch', 'select', 'display', { options: ['Website', 'Điện thoại', 'Tại showroom', 'Khác'] }),
      f('createdAt', 'Thời điểm gửi', 'date', 'display'),
      f('updated', 'Cập nhật trạng thái', 'date', 'display'),
    ],
  },

  'service-catalog': {
    clientPath: '/sofa2/services',
    entity: 'trang dịch vụ',
    titleKey: 'title',
    statusKey: 'status',
    statusOptions: PUBLISH_STATES,
    defaultStatus: 'Bản nháp',
    fields: [
      f('serviceGroup', 'Nhóm dịch vụ', 'select', 'content', { required: true, options: ['Thiết kế nội thất', 'Dịch vụ sản xuất'] }),
      f('title', 'Tên dịch vụ', 'text', 'content', { required: true, maxLength: 100 }),
      f('slug', 'Slug trang chi tiết', 'text', 'content', { required: true, placeholder: 'custom', helper: 'Đường dẫn là /sofa2/services/{nhóm}/{slug}.' }),
      f('icon', 'Iconify icon', 'text', 'content', { placeholder: 'solar:pen-new-round-bold-duotone' }),
      f('description', 'Mô tả ngắn', 'textarea', 'content', { required: true, multiline: 3, maxLength: 240 }),
      f('detail', 'Nội dung chi tiết', 'textarea', 'content', { required: true, multiline: 6, maxLength: 3000 }),
      f('targetAudience', 'Phù hợp với', 'textarea', 'content', { multiline: 3, maxLength: 500 }),
      f('deliverables', 'Kết quả bàn giao (mỗi dòng một ý)', 'textarea', 'content', { multiline: 4, maxLength: 800 }),
      f('duration', 'Thời gian dự kiến', 'text', 'content', { maxLength: 120 }),
      f('investment', 'Chi phí tham khảo', 'text', 'content', { maxLength: 160, helper: 'Nêu mức giá tham khảo hoặc ghi rõ báo giá theo yêu cầu.' }),
      f('features', 'Điểm nổi bật (mỗi dòng một ý)', 'textarea', 'content', { multiline: 6, maxLength: 1200 }),
      f('steps', 'Quy trình (mỗi dòng: Tên bước | Mô tả)', 'textarea', 'content', { multiline: 6, helper: 'Phân cách tên và mô tả bằng dấu |.' }),
      f('faq', 'Câu hỏi thường gặp (mỗi dòng: Câu hỏi | Trả lời)', 'textarea', 'content', { multiline: 5, maxLength: 1600, helper: 'Phân cách câu hỏi và câu trả lời bằng dấu |.' }),
      f('image', 'Ảnh đại diện / hero', 'url', 'content'),
      f('ctaLabel', 'Nhãn nút liên hệ', 'text', 'content'),
      f('ctaLink', 'Đường dẫn nút liên hệ', 'text', 'content', { placeholder: '/sofa2/contact?service=...' }),
      f('order', 'Thứ tự trong nhóm', 'number', 'display'),
      f('status', 'Trạng thái xuất bản', 'select', 'display', { required: true, options: PUBLISH_STATES }),
      f('updated', 'Ngày cập nhật', 'date', 'display'),
      f('author', 'Người phụ trách', 'text', 'display'),
      f('metaTitle', 'Meta title', 'text', 'seo', { maxLength: 60 }),
      f('metaDescription', 'Meta description', 'textarea', 'seo', { maxLength: 160, multiline: 3 }),
      f('ogImage', 'Ảnh chia sẻ', 'url', 'seo'),
      f('indexable', 'Cho phép Google lập chỉ mục', 'switch', 'seo'),
    ],
  },

  'blog-categories': {
    clientPath: '/sofa2/blog',
    entity: 'chuyên mục blog',
    titleKey: 'label',
    statusKey: 'status',
    statusOptions: PUBLISH_STATES,
    defaultStatus: 'Bản nháp',
    fields: [
      f('label', 'Tên chuyên mục', 'text', 'content', { required: true, maxLength: 80 }),
      f('slug', 'Đường dẫn danh mục', 'text', 'content', { required: true, placeholder: 'kinh-nghiem-chon-sofa', helper: 'Chỉ dùng chữ thường, số và dấu gạch ngang.' }),
      f('description', 'Mô tả danh mục', 'textarea', 'content', { multiline: 3, maxLength: 240 }),
      f('cover', 'Ảnh đại diện danh mục', 'url', 'content', { placeholder: 'https://...' }),
      f('order', 'Thứ tự hiển thị', 'number', 'display'),
      f('status', 'Trạng thái', 'select', 'display', { required: true, options: PUBLISH_STATES }),
      f('updated', 'Cập nhật', 'date', 'display'),
      f('metaTitle', 'Meta title', 'text', 'seo', { maxLength: 60 }),
      f('metaDescription', 'Meta description', 'textarea', 'seo', { maxLength: 160, multiline: 3 }),
      f('ogImage', 'Ảnh chia sẻ', 'url', 'seo'),
      f('indexable', 'Cho phép Google lập chỉ mục', 'switch', 'seo'),
    ],
  },

  'blog-authors': {
    clientPath: '/sofa2/blog',
    entity: 'tác giả blog',
    titleKey: 'name',
    statusKey: 'status',
    statusOptions: PUBLISH_STATES,
    defaultStatus: 'Bản nháp',
    fields: [
      f('name', 'Họ tên tác giả', 'text', 'content', { required: true, maxLength: 80 }),
      f('slug', 'Slug tác giả', 'text', 'content', { required: true, placeholder: 'nguyen-van-a' }),
      f('role', 'Chức danh / chuyên môn', 'text', 'content', { required: true, maxLength: 100 }),
      f('bio', 'Giới thiệu tác giả', 'textarea', 'content', { required: true, multiline: 4, maxLength: 500 }),
      f('avatar', 'Ảnh đại diện', 'url', 'content'),
      f('email', 'Email liên hệ (nội bộ)', 'text', 'content'),
      f('facebook', 'Facebook', 'url', 'content'),
      f('instagram', 'Instagram', 'url', 'content'),
      f('linkedin', 'LinkedIn', 'url', 'content'),
      f('status', 'Trạng thái hiển thị', 'select', 'display', { required: true, options: PUBLISH_STATES }),
      f('updated', 'Cập nhật hồ sơ', 'date', 'display'),
    ],
  },

  'blog-comments': {
    clientPath: '/sofa2/blog/:slug',
    entity: 'bình luận blog',
    titleKey: 'name',
    statusKey: 'status',
    statusOptions: ['Đã duyệt', 'Chờ duyệt', 'Từ chối', 'Spam'],
    defaultStatus: 'Chờ duyệt',
    publishLabel: 'Duyệt bình luận',
    fields: [
      f('postTitle', 'Bài viết', 'select', 'content', { required: true, options: [] }),
      f('name', 'Tên người bình luận', 'text', 'content', { required: true, maxLength: 80 }),
      f('email', 'Email (nội bộ)', 'text', 'content', { required: true }),
      f('content', 'Nội dung bình luận', 'textarea', 'content', { required: true, multiline: 5, maxLength: 1200 }),
      f('status', 'Kiểm duyệt', 'select', 'display', { required: true, options: ['Đã duyệt', 'Chờ duyệt', 'Từ chối', 'Spam'] }),
      f('createdAt', 'Ngày gửi', 'date', 'display'),
      f('approvedBy', 'Người duyệt', 'text', 'display'),
      f('reply', 'Phản hồi của quản trị viên', 'textarea', 'content', { multiline: 3, maxLength: 800 }),
      f('source', 'Nguồn gửi', 'text', 'display'),
    ],
  },

  'blog-social': {
    clientPath: '/sofa2/blog/:slug',
    entity: 'kênh chia sẻ mạng xã hội',
    titleKey: 'label',
    statusKey: 'status',
    statusOptions: PUBLISH_STATES,
    defaultStatus: 'Đã xuất bản',
    fields: [
      f('label', 'Tên hiển thị', 'text', 'content', { required: true, maxLength: 40 }),
      f('channel', 'Mã kênh duy nhất', 'text', 'content', { required: true, placeholder: 'facebook' }),
      f('icon', 'Iconify icon', 'text', 'content', { required: true, placeholder: 'eva:facebook-fill' }),
      f('action', 'Hành động', 'select', 'content', { required: true, options: ['share', 'copy'] }),
      f('urlTemplate', 'URL chia sẻ', 'text', 'content', { helper: 'Có thể dùng {url}, {title}, {image}; action=copy không cần URL.' }),
      f('enabled', 'Hiển thị trên client', 'switch', 'display'),
      f('order', 'Thứ tự hiển thị', 'number', 'display'),
      f('status', 'Trạng thái', 'select', 'display', { required: true, options: PUBLISH_STATES }),
      f('updated', 'Cập nhật', 'date', 'display'),
    ],
  },

  blog: {
    clientPath: '/sofa2/blog',
    entity: 'bài viết',
    titleKey: 'title',
    statusKey: 'status',
    statusOptions: ['Đã xuất bản', 'Chờ duyệt', 'Bản nháp', 'Tạm ẩn'],
    fields: [
      f('title', 'Tiêu đề bài viết', 'text', 'content', { required: true }),
      f('slug', 'Đường dẫn', 'text', 'content', {
        required: true,
        placeholder: '/sofa2/blog/ten-bai-viet',
        helper: 'Tự tạo từ tiêu đề nếu để trống; đường dẫn phải duy nhất.',
      }),
      f('category', 'Chuyên mục', 'select', 'content', {
        required: true,
        options: ['Tin công ty', 'Tin khuyến mãi', 'Kinh nghiệm chọn sofa', 'Xu hướng nội thất', 'Kiến thức vật liệu', 'Phong thủy nội thất', 'Hướng dẫn vệ sinh sofa', 'Hướng dẫn bảo quản', 'Thiết kế phòng khách'],
      }),
      f('excerpt', 'Mô tả ngắn', 'textarea', 'content', { multiline: 3, maxLength: 200 }),
      f('content', 'Nội dung bài viết', 'textarea', 'content', { multiline: 6 }),
      f('cover', 'Ảnh bìa', 'url', 'content'),
      f('tags', 'Thẻ (cách nhau dấu phẩy)', 'text', 'content'),
      f('status', 'Trạng thái', 'select', 'display', {
        required: true,
        options: ['Đã xuất bản', 'Chờ duyệt', 'Bản nháp', 'Tạm ẩn'],
      }),
      f('views', 'Lượt đọc', 'number', 'display'),
      f('updated', 'Ngày đăng', 'date', 'display'),
      f('author', 'Tác giả', 'select', 'display', { required: true, options: [] }),
      ...seoFields,
    ],
  },

  menu: {
    clientPath: '/sofa2',
    entity: 'menu',
    titleKey: 'menu',
    statusKey: 'status',
    statusOptions: PUBLISH_STATES,
    fields: [
      f('menu', 'Tên menu', 'text', 'content', { required: true }),
      f('position', 'Vị trí', 'select', 'content', {
        required: true,
        options: ['Header', 'Footer', 'Mobile', 'Sidebar', 'Mega menu'],
      }),
      f('items', 'Số mục', 'number', 'content', { disabled: true, helper: 'Tự đếm từ cấu trúc bên dưới.' }),
      f('structure', 'Danh sách mục (mỗi dòng: Tên | đường dẫn | mục cha)', 'textarea', 'content', {
        multiline: 8,
        placeholder: 'Trang chủ | /sofa2\nSản phẩm | /sofa2/products\nSofa góc | /sofa2/products/category/sofa-goc | Sản phẩm',
        helper: 'Cột mục cha không bắt buộc; chỉ chấp nhận đường dẫn nội bộ /sofa2 hoặc http/https.',
      }),
      f('depth', 'Số cấp tối đa', 'number', 'display', { disabled: true, helper: 'Tự tính theo mục cha đã khai báo.' }),
      ...displayFields(),
    ],
  },

  banner: {
    clientPath: '/sofa2',
    entity: 'banner',
    titleKey: 'name',
    statusKey: 'status',
    statusOptions: ['Đang chạy', 'Bản nháp', 'Tạm ẩn', 'Hết hạn'],
    fields: [
      f('name', 'Tên banner', 'text', 'content', { required: true }),
      f('position', 'Vị trí hiển thị', 'select', 'content', {
        required: true,
        options: ['Top bar', 'Trang chủ', 'Danh mục', 'Chi tiết SP', 'Giỏ hàng', 'Popup'],
      }),
      f('image', 'Ảnh banner (desktop)', 'url', 'content'),
      f('imageMobile', 'Ảnh banner (mobile)', 'url', 'content'),
      f('headline', 'Dòng tiêu đề', 'text', 'content'),
      f('ctaLink', 'Liên kết khi bấm', 'url', 'content', { placeholder: '/sofa2/promotions' }),
        f('schedule', 'Ghi chú lịch chạy', 'text', 'content', { placeholder: 'Chiến dịch tháng 9' }),
      f('startAt', 'Bắt đầu hiển thị', 'date', 'display', { helper: 'Để trống để hiển thị ngay khi xuất bản.' }),
      f('endAt', 'Kết thúc hiển thị', 'date', 'display', { helper: 'Để trống nếu không giới hạn ngày kết thúc.' }),
      f('status', 'Trạng thái', 'select', 'display', {
        required: true,
        options: ['Đang chạy', 'Bản nháp', 'Tạm ẩn', 'Hết hạn'],
      }),
      f('order', 'Thứ tự hiển thị', 'number', 'display'),
      f('updated', 'Cập nhật', 'date', 'display'),
    ],
  },

  slider: {
    clientPath: '/sofa2',
    entity: 'slider',
    titleKey: 'name',
    statusKey: 'status',
    statusOptions: PUBLISH_STATES,
    fields: [
      f('name', 'Tên slider', 'text', 'content', { required: true }),
      f('page', 'Trang áp dụng', 'select', 'content', {
        required: true,
        options: ['Trang chủ', 'Bộ sưu tập', 'Showroom', 'Danh mục', 'Dự án'],
      }),
      f('slides', 'Số slide', 'number', 'content'),
      f('slidesData', 'Danh sách slide (mỗi dòng: Tiêu đề | ảnh | liên kết)', 'textarea', 'content', {
        multiline: 5,
      }),
      f('interval', 'Thời gian chuyển (giây)', 'number', 'display'),
      f('autoplay', 'Tự động chạy', 'switch', 'display'),
      ...displayFields(),
    ],
  },

  seo: {
    clientPath: '/sofa2',
    entity: 'cấu hình SEO',
    titleKey: 'page',
    statusKey: 'status',
    statusOptions: ['Tốt', 'Cần cải thiện', 'Thiếu meta'],
    statusToggle: false,
    fields: [
      f('page', 'Đường dẫn trang', 'text', 'content', { required: true, placeholder: '/sofa2/about' }),
      f('title', 'Meta title', 'text', 'content', { required: true, maxLength: 60 }),
      f('description', 'Meta description', 'textarea', 'content', { multiline: 3, maxLength: 160 }),
      f('keywords', 'Từ khoá mục tiêu', 'text', 'content'),
      f('canonical', 'Canonical URL', 'url', 'content'),
      f('ogImage', 'Ảnh chia sẻ', 'url', 'content'),
      f('length', 'Độ dài title', 'number', 'display'),
      f('status', 'Đánh giá', 'select', 'display', {
        required: true,
        disabled: true,
        options: ['Tốt', 'Cần cải thiện', 'Thiếu meta'],
        helper: 'Tự tính theo độ dài title và description khi lưu.',
      }),
      f('indexable', 'Cho phép lập chỉ mục', 'switch', 'display'),
    ],
  },

  'static-pages': {
    clientPath: '/sofa2/pages',
    entity: 'trang tĩnh',
    titleKey: 'title',
    statusKey: 'status',
    statusOptions: PUBLISH_STATES,
    fields: [
      f('title', 'Tiêu đề trang', 'text', 'content', { required: true }),
      f('slug', 'Đường dẫn', 'text', 'content', {
        required: true,
        placeholder: '/sofa2/pages/huong-dan-do',
        helper: 'Trang tĩnh được hiển thị tại /sofa2/pages/{slug}; slug phải duy nhất.'
      }),
      f('template', 'Bố cục', 'select', 'content', {
        options: ['Một cột', 'Có mục lục', 'Landing page', 'Câu hỏi thường gặp'],
      }),
      f('content', 'Nội dung', 'textarea', 'content', { multiline: 6 }),
      f('cover', 'Ảnh đại diện', 'url', 'content'),
      ...displayFields(),
      ...seoFields,
    ],
  },
};

// ----------------------------------------------------------------------

export function getSofa2CmsSchema(moduleSlug?: string): Sofa2CmsSchema | undefined {
  return moduleSlug ? SOFA2_CMS_SCHEMAS[moduleSlug] : undefined;
}

/** Tạo slug thân thiện URL từ tiêu đề tiếng Việt */
export function sofa2Slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Ngày hôm nay theo định dạng dd/mm/yyyy dùng trong dữ liệu mẫu */
export function sofa2Today() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
