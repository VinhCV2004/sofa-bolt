// SOFA2 ADMIN — Module Hỗ trợ khách hàng
// Bao phủ FAQ, bài hướng dẫn, chat/ticket và trang Liên hệ (thông tin, mạng xã hội, hộp thư).
// Client /sofa2/support và /sofa2/contact đọc cùng kho dữ liệu; biểu mẫu ghi nhận về admin.
// ----------------------------------------------------------------------

import { SOFA2_FAQS, SOFA2_SHOWROOMS } from 'src/sections/sofa2/sofa2-pages-data';

import type { Sofa2CmsField, Sofa2CmsSchema, Sofa2CmsFieldType } from './sofa2-cms';
import type { Sofa2AdminGroup, Sofa2AdminColumn, Sofa2AdminModule } from './sofa2-admin-data';

const f = (
  key: string,
  label: string,
  type: Sofa2CmsFieldType,
  group: Sofa2CmsField['group'],
  extra: Partial<Sofa2CmsField> = {}
): Sofa2CmsField => ({ key, label, type, group, ...extra });

const schema = (
  entity: string,
  titleKey: string,
  statusOptions: string[],
  fields: Sofa2CmsField[],
  clientPath = '/sofa2/support',
  statusToggle = true,
  defaultStatus = statusOptions[1] ?? statusOptions[0]
): Sofa2CmsSchema => ({
  clientPath,
  entity,
  titleKey,
  statusKey: 'status',
  statusOptions,
  defaultStatus,
  publishLabel: statusOptions[0],
  statusToggle,
  fields: [
    ...fields,
    f('status', 'Trạng thái', 'select', 'display', { required: true, options: statusOptions }),
  ],
});

const mod = (
  slug: string,
  name: string,
  description: string,
  icon: string,
  stats: Sofa2AdminModule['stats'],
  columns: Sofa2AdminColumn[],
  rows: Record<string, string | number>[]
): Sofa2AdminModule => ({ slug, name, description, icon, stats, columns, rows });

const S: Sofa2AdminColumn = { key: 'status', label: 'Trạng thái', type: 'status' };

export const SOFA2_SUPPORT_CATEGORIES = [
  'Đặt hàng & thanh toán',
  'Giao hàng & lắp đặt',
  'Bảo hành & sửa chữa',
  'Đổi trả & hoàn tiền',
  'Chất liệu & bảo quản',
  'Tài khoản',
];

const PUBLISHED = ['Đã xuất bản', 'Bản nháp', 'Tạm ẩn'];
const TICKET_STATUSES = ['Đã giải quyết', 'Mới', 'Đang xử lý', 'Chờ khách phản hồi', 'Đã đóng'];

/** Href cho kênh liên hệ được giới hạn để tránh scheme tuỳ ý từ dữ liệu CMS/localStorage. */
export const isSofa2SupportHref = (value: unknown) => {
  const href = String(value ?? '').trim();
  if (!href || href === '#chat') return true;
  if (href.startsWith('/') && !href.startsWith('//')) return true;
  if (/^tel:[+\d\s().-]+$/i.test(href)) return true;
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(href)) return true;
  try {
    return ['http:', 'https:'].includes(new URL(href).protocol);
  } catch {
    return false;
  }
};
const PRIORITIES = ['Thấp', 'Trung bình', 'Cao', 'Khẩn cấp'];
const AGENTS = ['Hà My (CSKH)', 'Quốc Đạt (Kỹ thuật)', 'Thanh Tâm (Kho vận)', 'Chưa phân công'];

/** Trang bài viết hướng dẫn / chính sách — cùng cấu trúc, trang khách hiển thị dạng accordion */
const ARTICLE_SLUGS = [
  'guide-buying',
  'guide-payment',
  'policy-shipping',
  'policy-warranty',
  'policy-return',
] as const;

const articleCols: Sofa2AdminColumn[] = [
  { key: 'title', label: 'Tiêu đề mục' },
  { key: 'order', label: 'Thứ tự', type: 'number' },
  { key: 'updated', label: 'Cập nhật' },
  S,
];

const article = (title: string, order: number, body: string, updated = '10/10/2026') => ({
  title,
  order,
  body,
  updated,
  status: 'Đã xuất bản',
});

const CONTACT_INQUIRY_STATUSES = ['Mới tiếp nhận', 'Đang xử lý', 'Chờ khách phản hồi', 'Đã phản hồi', 'Đã đóng', 'Spam'];
const contactTimestamp = (daysAgo: number, hour: number, minute: number) => {
  const date = new Date(Date.UTC(2026, 10, 15 - daysAgo));
  return `${date.toISOString().slice(0, 10)}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+07:00`;
};
const CONTACT_INQUIRY_ROWS = [
  { inquiryId: 'CT-261115-001', name: 'Nguyễn Minh Anh', email: 'minhanh@example.test', phone: '0901234567', subject: 'Tư vấn sofa góc cho căn hộ', message: 'Phòng khách rộng khoảng 4 x 5m, mong được tư vấn kích thước và chất liệu.', receivedAt: '2026-11-15T09:24:00+07:00', source: 'Trang Liên hệ', assignedTo: AGENTS[0], reply: '', repliedAt: '', internalNote: '', status: 'Mới tiếp nhận' },
  { inquiryId: 'CT-261114-002', name: 'Trần Hải Nam', email: '', phone: '0912345678', subject: 'Đặt lịch xem sofa tại showroom', message: 'Tôi muốn ghé showroom Hà Nội chiều thứ Bảy.', receivedAt: '2026-11-14T15:10:00+07:00', source: 'Trang Liên hệ', assignedTo: AGENTS[3], reply: 'Đã gọi xác nhận khung giờ 15:00.', repliedAt: '2026-11-14T16:00:00+07:00', internalNote: 'Khách quan tâm dòng Oslo.', status: 'Đã phản hồi' },
  { inquiryId: 'CT-261113-003', name: 'Lê Thu Hà', email: 'thuha@example.test', phone: '0987654321', subject: 'Báo giá sofa theo kích thước', message: 'Xin báo giá mẫu sofa băng dài 2,4m, bọc vải màu kem.', receivedAt: '2026-11-13T11:35:00+07:00', source: 'Trang Liên hệ', assignedTo: AGENTS[0], reply: '', repliedAt: '', internalNote: 'Cần gửi báo giá trước cuối ngày.', status: 'Đang xử lý' },
  { inquiryId: 'CT-261112-004', name: 'Phạm Quốc Huy', email: 'quochuy@example.test', phone: '', subject: 'Hợp tác dự án căn hộ', message: 'Đề nghị bộ phận dự án liên hệ để trao đổi số lượng và tiến độ.', receivedAt: '2026-11-12T08:42:00+07:00', source: 'Trang Liên hệ', assignedTo: AGENTS[3], reply: 'Đã chuyển thông tin cho bộ phận dự án.', repliedAt: '2026-11-12T10:05:00+07:00', internalNote: '', status: 'Chờ khách phản hồi' },
  { inquiryId: 'CT-261110-005', name: 'Võ Ngọc Hân', email: 'han@example.test', phone: '0934567890', subject: 'Chính sách bảo hành khung gỗ', message: 'Muốn biết thời hạn và cách đăng ký bảo hành.', receivedAt: '2026-11-10T14:22:00+07:00', source: 'Trang Hỗ trợ', assignedTo: AGENTS[1], reply: 'Đã gửi liên kết chính sách và hướng dẫn tra cứu phiếu.', repliedAt: '2026-11-10T15:10:00+07:00', internalNote: '', status: 'Đã đóng' },
  { inquiryId: 'CT-261109-006', name: 'Khách truy cập', email: '', phone: '', subject: 'Tin nhắn thử nghiệm', message: 'Bản ghi mẫu đã được đánh dấu spam.', receivedAt: '2026-11-09T18:00:00+07:00', source: 'Trang Liên hệ', assignedTo: AGENTS[3], reply: '', repliedAt: '', internalNote: 'Không có thông tin liên hệ hợp lệ.', status: 'Spam' },
  ...Array.from({ length: 24 }, (_, index) => {
    const status = CONTACT_INQUIRY_STATUSES[index % CONTACT_INQUIRY_STATUSES.length];
    const daysAgo = index + 1;
    const hasReply = ['Chờ khách phản hồi', 'Đã phản hồi', 'Đã đóng'].includes(status);
    const isSpam = status === 'Spam';
    const receivedAt = contactTimestamp(daysAgo, 8 + (index % 10), (index * 7) % 60);
    const name = ['Đỗ Phương Anh', 'Ngô Đức Thắng', 'Trương Bảo Ngọc', 'Lý Gia Phúc', 'Mai Thanh Vy', 'Cao Minh Châu', 'Tạ Minh Trang', 'Vũ Hoàng Nam'][index % 8];
    const email = isSpam || index % 3 === 0 ? '' : `lienhe${String(index + 1).padStart(2, '0')}@example.test`;
    const phone = isSpam || (index % 3 === 1) ? '' : `09${String(87654321 - index * 7919).slice(0, 8)}`;
    return {
      inquiryId: `CT-${receivedAt.slice(2, 4)}${receivedAt.slice(5, 7)}${receivedAt.slice(8, 10)}-${String(index + 1).padStart(3, '0')}`,
      name: isSpam ? 'Khách truy cập' : name,
      email,
      phone,
      subject: ['Tư vấn chất liệu sofa', 'Xin báo giá sản phẩm', 'Đặt lịch showroom', 'Hỏi phí giao hàng', 'Tra cứu bảo hành', 'Hợp tác dự án'][index % 6],
      message: isSpam ? 'Nội dung quảng cáo không liên quan.' : 'Khách gửi yêu cầu tư vấn; cần xác nhận thông tin và liên hệ lại.',
      receivedAt,
      source: ['Trang Liên hệ', 'Trang Hỗ trợ', 'Trang Sản phẩm', 'Trang Showroom'][index % 4],
      assignedTo: AGENTS[index % AGENTS.length],
      reply: hasReply ? 'Đã liên hệ khách và gửi hướng dẫn phù hợp.' : '',
      repliedAt: hasReply ? contactTimestamp(daysAgo, 19 + (index % 4), (index * 11) % 60) : '',
      internalNote: isSpam ? 'Đánh dấu spam; không phản hồi.' : index % 4 === 0 ? 'Ưu tiên gọi lại trong giờ hành chính.' : '',
      status,
    };
  }),
];
const contactStatusCount = (status: string) => CONTACT_INQUIRY_ROWS.filter((row) => row.status === status).length;

// ----------------------------------------------------------------------

export const SOFA2_SUPPORT_GROUP: Sofa2AdminGroup = {
  slug: 'support',
  name: 'Hỗ trợ khách hàng',
  icon: 'solar:help-bold-duotone',
  modules: [
    mod('faq', 'FAQ', 'Câu hỏi thường gặp hiển thị trên trang Hỗ trợ — sắp xếp, phân loại, ẩn/hiện.', 'solar:question-circle-bold-duotone',
      [{ label: 'Câu hỏi', value: String(SOFA2_FAQS.length + 2) }, { label: 'Lượt xem', value: '12,4k' }, { label: 'Hữu ích', value: '91%' }, { label: 'Giảm ticket', value: '-18%' }],
      [{ key: 'question', label: 'Câu hỏi' }, { key: 'category', label: 'Danh mục' }, { key: 'order', label: 'Thứ tự', type: 'number' }, S],
      [
        ...SOFA2_FAQS.map((q, i) => ({ question: q.question, answer: q.answer, category: SOFA2_SUPPORT_CATEGORIES[i % 6], order: i + 1, status: 'Đã xuất bản' })),
        { question: 'Tôi có thể trả góp không?', answer: 'Có, trả góp 0% qua thẻ tín dụng 6–12 tháng cho đơn từ 10 triệu.', category: 'Đặt hàng & thanh toán', order: 20, status: 'Bản nháp' },
        { question: 'Tôi kiểm tra trạng thái đơn hàng ở đâu?', answer: 'Đăng nhập tài khoản, mở mục Đơn hàng của tôi và chọn mã đơn cần tra cứu. Nếu đặt hàng không đăng nhập, hãy liên hệ hotline kèm số điện thoại nhận hàng.', category: 'Giao hàng & lắp đặt', order: 7, status: 'Đã xuất bản' },
      ]),
    mod('help-center', 'Trung tâm trợ giúp', 'Bài viết kiến thức theo danh mục — tìm kiếm, gắn thẻ, theo dõi hiệu quả.', 'solar:book-bookmark-bold-duotone',
      [{ label: 'Bài viết mẫu', value: '11' }, { label: 'Danh mục', value: String(SOFA2_SUPPORT_CATEGORIES.length) }, { label: 'Lượt đọc', value: '8,2k' }, { label: 'Đánh giá TB', value: '4,6/5' }],
      [{ key: 'title', label: 'Bài viết' }, { key: 'category', label: 'Danh mục' }, { key: 'views', label: 'Lượt đọc', type: 'number' }, { key: 'updated', label: 'Cập nhật' }, S],
      [
        { title: 'Cách vệ sinh sofa vải đúng cách', category: 'Chất liệu & bảo quản', summary: 'Hút bụi hằng tuần, dùng khăn ẩm với dung dịch trung tính.', body: 'Hút bụi bề mặt và khe ghế mỗi tuần bằng đầu hút mềm. Khi có vết bẩn, thấm nhẹ bằng khăn trắng hơi ẩm, không chà xát mạnh. Thử dung dịch vệ sinh ở vùng khuất trước khi sử dụng trên toàn bộ bề mặt. Để sofa khô tự nhiên, tránh dùng nhiệt trực tiếp.', tags: 'vệ sinh, vải', views: 2140, updated: '08/10/2026', status: 'Đã xuất bản' },
        { title: 'Bảo dưỡng sofa da thật', category: 'Chất liệu & bảo quản', summary: 'Dưỡng da 3–6 tháng/lần, tránh nắng trực tiếp.', body: 'Lau bụi thường xuyên bằng khăn mềm khô. Dùng dung dịch chuyên dụng cho da thật và dưỡng định kỳ 3–6 tháng một lần. Không đặt sofa dưới nắng gắt hoặc gần nguồn nhiệt; xử lý chất lỏng bằng cách thấm nhẹ ngay khi vừa đổ.', tags: 'da, bảo dưỡng', views: 1780, updated: '01/10/2026', status: 'Đã xuất bản' },
        { title: 'Đổi mật khẩu tài khoản', category: 'Tài khoản', summary: 'Vào Tài khoản → Hồ sơ → Đổi mật khẩu.', body: 'Đăng nhập, mở mục Hồ sơ cá nhân và chọn Đổi mật khẩu. Nhập mật khẩu hiện tại, mật khẩu mới đủ mạnh và xác nhận để hoàn tất. Nếu không truy cập được tài khoản, hãy dùng chức năng Quên mật khẩu hoặc gửi ticket cho bộ phận hỗ trợ.', tags: 'tài khoản', views: 320, updated: '20/09/2026', status: 'Bản nháp' },
        { title: 'Theo dõi lịch giao và lắp đặt', category: 'Giao hàng & lắp đặt', summary: 'Tra cứu trạng thái giao hàng và cách đổi khung giờ hẹn.', body: 'Sau khi đơn được bàn giao cho đơn vị vận chuyển, khách nhận tin nhắn có mã theo dõi. Có thể đổi lịch trước tối thiểu 24 giờ bằng cách trả lời tin nhắn xác nhận hoặc gửi ticket kèm mã đơn. Kỹ thuật viên gọi trước khi đến lắp đặt.', tags: 'giao hàng, lắp đặt, lịch hẹn', views: 940, updated: '12/10/2026', status: 'Đã xuất bản' },
        { title: 'Kiểm tra sofa trước khi ký nhận', category: 'Giao hàng & lắp đặt', summary: 'Danh sách kiểm tra nhanh sản phẩm và phụ kiện khi nhận.', body: 'Kiểm tra bao bì, màu sắc, kích thước và số lượng kiện hàng trước khi ký biên bản. Chụp ảnh ngay nếu có vết trầy, thiếu phụ kiện hoặc sai mẫu. Nhân viên lắp đặt sẽ hướng dẫn cách sử dụng và bàn giao phiếu bảo hành điện tử.', tags: 'nhận hàng, kiểm tra', views: 760, updated: '11/10/2026', status: 'Đã xuất bản' },
        { title: 'Cách tra cứu phiếu bảo hành điện tử', category: 'Bảo hành & sửa chữa', summary: 'Tra cứu theo mã phiếu hoặc số serial trên tài khoản.', body: 'Đăng nhập tài khoản, vào mục Bảo hành và nhập mã phiếu hoặc serial sản phẩm. Phiếu hiển thị ngày mua, hạng mục được bảo hành và hạn bảo hành. Nếu chưa thấy phiếu sau 48 giờ, gửi ảnh hoá đơn và serial qua ticket hỗ trợ.', tags: 'bảo hành, serial', views: 680, updated: '10/10/2026', status: 'Đã xuất bản' },
        { title: 'Gửi yêu cầu sửa chữa tại nhà', category: 'Bảo hành & sửa chữa', summary: 'Chuẩn bị ảnh/video, mã phiếu và mô tả tình trạng sản phẩm.', body: 'Tạo ticket mới, chọn Bảo hành & sửa chữa, nhập mã phiếu và mô tả hiện tượng. Đính kèm ảnh hoặc video khu vực cần kiểm tra. Bộ phận kỹ thuật xác nhận tiếp nhận trong một ngày làm việc và đề xuất lịch hẹn phù hợp.', tags: 'sửa chữa, ticket', views: 520, updated: '09/10/2026', status: 'Đã xuất bản' },
        { title: 'Điều kiện đổi màu hoặc đổi mẫu', category: 'Đổi trả & hoàn tiền', summary: 'Thời hạn yêu cầu và các trường hợp không áp dụng đổi mẫu.', body: 'Với sản phẩm có sẵn, liên hệ trong vòng 7 ngày kể từ ngày nhận hàng; sản phẩm cần còn nguyên trạng, đầy đủ phụ kiện. Sofa đặt theo kích thước hoặc màu riêng không áp dụng đổi mẫu, trừ lỗi sản xuất. Gửi mã đơn và ảnh hiện trạng để được hướng dẫn.', tags: 'đổi trả, màu sắc', views: 410, updated: '07/10/2026', status: 'Đã xuất bản' },
        { title: 'Thời gian hoàn tiền sau khi xác nhận', category: 'Đổi trả & hoàn tiền', summary: 'Thời gian phụ thuộc phương thức thanh toán ban đầu.', body: 'Sau khi yêu cầu hoàn tiền được duyệt và hàng được kiểm tra, khoản tiền sẽ được hoàn về phương thức thanh toán ban đầu. Thời gian xử lý thường từ 5 đến 7 ngày làm việc; ngân hàng có thể cần thêm thời gian để ghi nhận giao dịch.', tags: 'hoàn tiền, thanh toán', views: 390, updated: '06/10/2026', status: 'Đã xuất bản' },
        { title: 'Chọn chất liệu phù hợp gia đình có thú cưng', category: 'Chất liệu & bảo quản', summary: 'Ưu tiên bề mặt dệt chặt, dễ hút bụi và vệ sinh.', body: 'Vải dệt chặt hoặc da phủ bảo vệ thường dễ vệ sinh hơn với gia đình có thú cưng. Nên chọn màu trung tính, dùng khăn phủ ở khu vực thú cưng thường nằm và hút bụi định kỳ. Đội tư vấn có thể gửi mẫu vật liệu để kiểm tra trước khi đặt.', tags: 'chất liệu, thú cưng', views: 830, updated: '04/10/2026', status: 'Đã xuất bản' },
        { title: 'Cách cập nhật địa chỉ nhận hàng', category: 'Tài khoản', summary: 'Sửa địa chỉ trong Hồ sơ trước khi đơn chuyển sang giao hàng.', body: 'Vào Tài khoản → Sổ địa chỉ để thêm hoặc cập nhật địa chỉ mặc định. Nếu đơn đã xác nhận, gửi ticket hoặc gọi hotline với mã đơn để nhân viên kiểm tra khả năng thay đổi trước khi bàn giao vận chuyển.', tags: 'tài khoản, địa chỉ', views: 290, updated: '02/10/2026', status: 'Đã xuất bản' },
      ]),
    mod('live-chat', 'Chat trực tuyến', 'Phiên chat với khách, kịch bản trả lời nhanh và phân công tư vấn viên.', 'solar:chat-round-dots-bold-duotone',
      [{ label: 'Phiên hôm nay', value: '46' }, { label: 'Phản hồi TB', value: '42 giây' }, { label: 'Hài lòng', value: '94%' }, { label: 'Chờ', value: '3' }],
      [{ key: 'customer', label: 'Khách' }, { key: 'topic', label: 'Chủ đề' }, { key: 'agent', label: 'Tư vấn viên' }, { key: 'started', label: 'Bắt đầu' }, S],
      [
        { customer: 'Nguyễn Minh Anh', contact: '0901234567', topic: 'Tư vấn kích thước sofa góc', agent: AGENTS[0], started: '15/10/2026 09:12', transcript: 'Khách hỏi sofa góc cho phòng 4x5m…', status: 'Đang chat' },
        { customer: 'Khách vãng lai', contact: '', topic: 'Phí giao hàng Đà Nẵng', agent: AGENTS[3], started: '15/10/2026 09:40', transcript: '', status: 'Chờ' },
        { customer: 'Lê Thu Hà', contact: 'ha@example.com', topic: 'Đổi màu vải', agent: AGENTS[0], started: '14/10/2026 16:05', transcript: 'Đã hướng dẫn đổi màu trước khi sản xuất.', status: 'Đã kết thúc' },
        { customer: 'Phạm Ngọc Lan', contact: 'lan@example.com', topic: 'So sánh da PU và da thật', agent: AGENTS[0], started: '15/10/2026 10:03', transcript: 'Đã gửi bảng so sánh chất liệu và chính sách bảo hành.', reply: 'Tư vấn viên gửi link hai mẫu khách đang quan tâm.', status: 'Đã kết thúc' },
        { customer: 'Trần Hải Nam', contact: '0909000102', topic: 'Kiểm tra tình trạng đơn DH1012', agent: AGENTS[2], started: '15/10/2026 10:17', transcript: 'Khách hỏi thời gian xuất kho.', reply: 'Kho xác nhận đang đóng gói, dự kiến giao ngày 18/10.', status: 'Đã kết thúc' },
        { customer: 'Khách vãng lai', contact: '', topic: 'Tư vấn sofa căn hộ 65m2', agent: AGENTS[3], started: '15/10/2026 10:24', transcript: '', reply: '', status: 'Chờ' },
        { customer: 'Nguyễn Thùy Dương', contact: 'duong@example.com', topic: 'Đặt lịch xem mẫu tại showroom', agent: AGENTS[0], started: '15/10/2026 10:31', transcript: 'Khách muốn xem sofa Oslo và Berlin cuối tuần.', reply: '', status: 'Đang chat' },
        { customer: 'Đặng Gia Bảo', contact: '0909000104', topic: 'Hỏi chính sách bảo hành khung', agent: AGENTS[1], started: '15/10/2026 10:35', transcript: 'Đã giải thích thời hạn bảo hành theo hạng mục.', reply: '', status: 'Đang chat' },
        { customer: 'Hồ Mỹ Linh', contact: 'linh@example.com', topic: 'Thanh toán chuyển khoản', agent: AGENTS[3], started: '14/10/2026 14:42', transcript: '', reply: '', status: 'Bỏ lỡ' },
      ]),
    mod('tickets', 'Ticket hỗ trợ', 'Yêu cầu khách gửi từ trang Hỗ trợ — phân công, ưu tiên, SLA, phản hồi.', 'solar:ticket-bold-duotone',
      [{ label: 'Mở', value: '12' }, { label: 'Quá SLA', value: '2', trend: '-1' }, { label: 'Xử lý TB', value: '6,5 giờ' }, { label: 'Đã giải quyết', value: '87%' }],
      [{ key: 'code', label: 'Mã' }, { key: 'subject', label: 'Chủ đề' }, { key: 'category', label: 'Danh mục' }, { key: 'priority', label: 'Ưu tiên' }, { key: 'agent', label: 'Phụ trách' }, S],
      [
        { code: 'TK-1024', customer: 'Trần Quốc Bảo', contact: '0912000111', subject: 'Sofa bị lệch chân sau lắp đặt', category: 'Bảo hành & sửa chữa', priority: 'Cao', agent: AGENTS[1], created: '13/10/2026', message: 'Chân trái phía sau bị cập kênh.', reply: 'Kỹ thuật sẽ qua kiểm tra 16/10.', status: 'Đang xử lý' },
        { code: 'TK-1023', customer: 'Phạm Gia Huy', contact: 'huy@example.com', subject: 'Hỏi lịch giao hàng', category: 'Giao hàng & lắp đặt', priority: 'Trung bình', agent: AGENTS[2], created: '12/10/2026', message: 'Đơn SF-2291 khi nào giao?', reply: 'Giao 17/10, khung 9–11h.', status: 'Đã giải quyết' },
        { code: 'TK-1022', customer: 'Võ Ngọc Lan', contact: '0938777666', subject: 'Muốn đổi sang màu xám', category: 'Đổi trả & hoàn tiền', priority: 'Thấp', agent: AGENTS[3], created: '12/10/2026', message: '', reply: '', status: 'Mới' },
        { code: 'TK-1021', customer: 'Nguyễn Thùy Dương', contact: 'duong@example.com', subject: 'Thiếu phụ kiện lắp chân sofa', category: 'Giao hàng & lắp đặt', priority: 'Cao', agent: AGENTS[2], created: '11/10/2026', message: 'Thiếu bộ ốc vít trong kiện hàng.', reply: 'Kho đã tạo lệnh gửi bổ sung, mã vận chuyển sẽ cập nhật trong ngày.', status: 'Chờ khách phản hồi' },
        { code: 'TK-1020', customer: 'Đặng Gia Bảo', contact: '0909000104', subject: 'Xin hướng dẫn vệ sinh vết bẩn', category: 'Chất liệu & bảo quản', priority: 'Thấp', agent: AGENTS[0], created: '11/10/2026', message: 'Vết cà phê trên vải màu be.', reply: 'Đã gửi hướng dẫn thấm bằng khăn trắng và dung dịch trung tính.', status: 'Đã giải quyết' },
        { code: 'TK-1019', customer: 'Hồ Mỹ Linh', contact: 'linh@example.com', subject: 'Chưa nhận được email xác nhận đơn', category: 'Đặt hàng & thanh toán', priority: 'Trung bình', agent: AGENTS[0], created: '10/10/2026', message: 'Đặt đơn qua website nhưng chưa thấy email.', reply: 'Đã xác nhận email có lỗi chính tả và gửi lại thông tin đơn.', status: 'Đã giải quyết' },
        { code: 'TK-1018', customer: 'Ngô Đức Thắng', contact: '0909000106', subject: 'Tra cứu hạn bảo hành', category: 'Bảo hành & sửa chữa', priority: 'Trung bình', agent: AGENTS[1], created: '10/10/2026', message: 'Mã serial LX26-5037.', reply: '', status: 'Đang xử lý' },
        { code: 'TK-1017', customer: 'Đỗ Phương Anh', contact: 'anh@example.com', subject: 'Yêu cầu xuất hoá đơn VAT', category: 'Đặt hàng & thanh toán', priority: 'Thấp', agent: AGENTS[0], created: '09/10/2026', message: 'Bổ sung thông tin công ty vào hoá đơn.', reply: 'Đã chuyển kế toán phát hành hoá đơn điều chỉnh.', status: 'Đã đóng' },
        { code: 'TK-1016', customer: 'Phan Ngọc Hà', contact: '0909000108', subject: 'Đổi địa chỉ trước khi giao', category: 'Giao hàng & lắp đặt', priority: 'Cao', agent: AGENTS[2], created: '09/10/2026', message: 'Đơn DH1016 cần giao sang địa chỉ mới.', reply: 'Đơn đã được cập nhật địa chỉ trước khi xuất kho.', status: 'Đã giải quyết' },
        { code: 'TK-1015', customer: 'Vũ Hoàng Nam', contact: 'nam@example.com', subject: 'Yêu cầu kiểm tra tiếng kêu khung', category: 'Bảo hành & sửa chữa', priority: 'Khẩn cấp', agent: AGENTS[1], created: '08/10/2026', message: 'Khung phát tiếng kêu khi ngồi.', reply: 'Đã lên lịch kỹ thuật kiểm tra tại nhà ngày 16/10.', status: 'Đang xử lý' },
        { code: 'TK-1014', customer: 'Trương Bảo Ngọc', contact: '0909000110', subject: 'Hoàn tiền phí vận chuyển', category: 'Đổi trả & hoàn tiền', priority: 'Trung bình', agent: AGENTS[0], created: '07/10/2026', message: 'Đơn được xác nhận miễn phí giao nhưng đã thu phí.', reply: '', status: 'Mới' },
        { code: 'TK-1013', customer: 'Lý Gia Phúc', contact: 'phuc@example.com', subject: 'Tư vấn kích thước sofa văng', category: 'Chất liệu & bảo quản', priority: 'Thấp', agent: AGENTS[3], created: '06/10/2026', message: 'Cần sofa cho phòng khách rộng 3,2m.', reply: 'Đã gửi bảng kích thước và link sản phẩm phù hợp.', status: 'Đã đóng' },
      ]),
    mod('guide-buying', 'Hướng dẫn mua hàng', 'Các bước đặt hàng hiển thị trên trang Hỗ trợ.', 'solar:cart-check-bold-duotone',
      [{ label: 'Bước', value: '4' }, { label: 'Lượt xem', value: '3,1k' }], articleCols,
      [
        article('Bước 1: Chọn sản phẩm', 1, 'Duyệt danh mục, chọn kích thước, màu và chất liệu, rồi bấm "Thêm vào giỏ".'),
        article('Bước 2: Kiểm tra giỏ hàng', 2, 'Kiểm tra số lượng, áp mã giảm giá và bấm "Thanh toán".'),
        article('Bước 3: Nhập thông tin giao hàng', 3, 'Điền người nhận, địa chỉ và chọn thời gian giao mong muốn.'),
        article('Bước 4: Thanh toán & xác nhận', 4, 'Chọn phương thức thanh toán; bạn sẽ nhận email xác nhận kèm mã đơn.'),
      ]),
    mod('guide-payment', 'Hướng dẫn thanh toán', 'Hướng dẫn từng phương thức thanh toán.', 'solar:card-transfer-bold-duotone',
      [{ label: 'Phương thức', value: '4' }], articleCols,
      [
        article('Thanh toán khi nhận hàng (COD)', 1, 'Thanh toán tiền mặt cho nhân viên giao hàng, áp dụng đơn dưới 50 triệu.'),
        article('Chuyển khoản ngân hàng', 2, 'Chuyển khoản theo thông tin trong email, ghi rõ mã đơn ở nội dung.'),
        article('Thẻ & ví điện tử', 3, 'Hỗ trợ Visa/Master, MoMo, VNPay — thanh toán an toàn qua cổng mã hoá.'),
        article('Trả góp 0%', 4, 'Trả góp 6–12 tháng qua thẻ tín dụng cho đơn từ 10 triệu.'),
      ]),
    mod('policy-shipping', 'Chính sách giao hàng', 'Thời gian, phí và phạm vi giao hàng, lắp đặt.', 'solar:delivery-bold-duotone',
      [{ label: 'Mục', value: '3' }], articleCols,
      [
        article('Thời gian giao hàng', 1, 'Hàng có sẵn 2–5 ngày; sofa thiết kế riêng 10–20 ngày.'),
        article('Phí giao hàng', 2, 'Miễn phí nội thành Hà Nội, TP.HCM, Đà Nẵng; tỉnh khác tính theo khoảng cách.'),
        article('Lắp đặt tại nhà', 3, 'Kỹ thuật viên lắp đặt miễn phí và thu dọn bao bì sau khi giao.'),
      ]),
    mod('policy-warranty', 'Chính sách bảo hành', 'Thời hạn, phạm vi và quy trình bảo hành.', 'solar:shield-check-bold-duotone',
      [{ label: 'Mục', value: '3' }], articleCols,
      [
        article('Thời hạn bảo hành', 1, 'Khung gỗ 10 năm, đệm mút 5 năm, vải/da 2 năm.'),
        article('Trường hợp không bảo hành', 2, 'Hư hỏng do sử dụng sai cách, thú cưng, hoá chất hoặc thiên tai.'),
        article('Quy trình yêu cầu bảo hành', 3, 'Gửi ticket kèm ảnh và số phiếu bảo hành; kỹ thuật phản hồi trong 24h.'),
      ]),
    mod('policy-return', 'Chính sách đổi trả', 'Điều kiện, thời hạn và hoàn tiền.', 'solar:refresh-circle-bold-duotone',
      [{ label: 'Mục', value: '3' }], articleCols,
      [
        article('Thời hạn đổi trả', 1, 'Đổi trả trong 7 ngày với hàng có sẵn còn nguyên trạng.'),
        article('Sản phẩm thiết kế riêng', 2, 'Không áp dụng đổi trả, trừ khi lỗi do nhà sản xuất.'),
        article('Hoàn tiền', 3, 'Hoàn tiền trong 5–7 ngày làm việc theo phương thức thanh toán ban đầu.'),
      ]),
    mod('contact-inquiries', 'Tin nhắn liên hệ', 'Tiếp nhận và xử lý biểu mẫu từ trang Liên hệ; phân công, phản hồi, lưu lịch sử.', 'solar:letter-unread-bold-duotone',
      [
        { label: 'Tổng mẫu', value: String(CONTACT_INQUIRY_ROWS.length) },
        { label: 'Mới tiếp nhận', value: String(contactStatusCount('Mới tiếp nhận')) },
        { label: 'Đang xử lý', value: String(contactStatusCount('Đang xử lý')) },
        { label: 'Chờ khách phản hồi', value: String(contactStatusCount('Chờ khách phản hồi')) },
        { label: 'Đã phản hồi', value: String(contactStatusCount('Đã phản hồi')) },
        { label: 'Đã đóng / spam', value: String(contactStatusCount('Đã đóng') + contactStatusCount('Spam')) },
      ],
      [{ key: 'inquiryId', label: 'Mã liên hệ' }, { key: 'name', label: 'Người gửi' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Điện thoại' }, { key: 'subject', label: 'Chủ đề' }, { key: 'receivedAt', label: 'Tiếp nhận' }, { key: 'source', label: 'Nguồn' }, { key: 'assignedTo', label: 'Phụ trách' }, S],
      CONTACT_INQUIRY_ROWS),
    mod('contact-info', 'Địa điểm & giờ làm việc', 'Quản lý địa chỉ, giờ mở cửa từng showroom và liên kết bản đồ trên /sofa2/contact; hotline/email lấy từ Kênh liên hệ.', 'solar:map-point-wave-bold-duotone',
      [
        { label: 'Showroom đang hiển thị', value: String(SOFA2_SHOWROOMS.length) },
        { label: 'Đã cấu hình bản đồ', value: String(SOFA2_SHOWROOMS.length) },
      ],
      [{ key: 'label', label: 'Loại thông tin' }, { key: 'value', label: 'Nội dung' }, { key: 'sub', label: 'Mô tả' }, { key: 'order', label: 'Thứ tự', type: 'number' }, S],
      SOFA2_SHOWROOMS.map((showroom, index) => ({
        label: `Địa chỉ showroom ${showroom.name.replace('LUXE Sofa ', '')}`,
        value: showroom.address,
        sub: `${showroom.name} · ${showroom.phone} · Mở cửa ${showroom.hours}`,
        icon: 'solar:map-point-bold-duotone',
        href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(showroom.address)}`,
        order: index + 1,
        status: 'Đang hiển thị',
      }))),
    mod('contact-socials', 'Mạng xã hội Liên hệ', 'Quản lý liên kết Facebook, Instagram, YouTube, Zalo hiển thị cuối trang Liên hệ.', 'solar:share-bold-duotone',
      [{ label: 'Đang bật', value: '4' }, { label: 'Kênh mạng xã hội', value: '4' }],
      [{ key: 'title', label: 'Mạng xã hội' }, { key: 'href', label: 'Liên kết' }, { key: 'order', label: 'Thứ tự', type: 'number' }, S],
      [
        { title: 'Facebook', href: 'https://www.facebook.com/luxesofa.vn', icon: 'solar:facebook-bold-duotone', order: 1, status: 'Đang hiển thị' },
        { title: 'Instagram', href: 'https://www.instagram.com/luxesofa.vn/', icon: 'solar:instagram-bold-duotone', order: 2, status: 'Đang hiển thị' },
        { title: 'YouTube', href: 'https://www.youtube.com/@luxesofa', icon: 'solar:youtube-bold-duotone', order: 3, status: 'Đang hiển thị' },
        { title: 'Zalo', href: 'https://zalo.me/0900686868', icon: 'solar:chat-bold-duotone', order: 4, status: 'Đang hiển thị' },
      ]),
    mod('channels', 'Kênh liên hệ', 'Hotline và email dùng chung giữa trang Hỗ trợ và Liên hệ; chat/Zalo hiển thị ở trang Hỗ trợ.', 'solar:phone-calling-bold-duotone',
      [{ label: 'Kênh bật', value: '3' }],
      [{ key: 'title', label: 'Kênh' }, { key: 'value', label: 'Thông tin' }, { key: 'order', label: 'Thứ tự', type: 'number' }, S],
      [
        { title: 'Hotline', value: '1900 6868', href: 'tel:19006868', sub: 'Gọi ngay 8:00 - 20:00', icon: 'solar:phone-bold-duotone', order: 1, status: 'Đang bật' },
        { title: 'Email', value: 'support@sofa2.vn', href: 'mailto:support@sofa2.vn', sub: 'Phản hồi trong 24h', icon: 'solar:letter-bold-duotone', order: 2, status: 'Đang bật' },
        { title: 'Chat trực tuyến', value: 'Chat với tư vấn viên', href: '#chat', sub: 'Hỗ trợ trực tiếp trên web', icon: 'solar:chat-round-dots-bold-duotone', order: 3, status: 'Đang bật' },
        { title: 'Zalo OA', value: 'Sofa2 Official', sub: 'Nhắn tin 24/7', icon: 'solar:chat-round-bold-duotone', order: 4, status: 'Tạm tắt' },
      ]),
  ],
};

// ----------------------------------------------------------------------

const articleSchema = (entity: string, clientPath = '/sofa2/support#guides') =>
  schema(entity, 'title', PUBLISHED, [
    f('title', 'Tiêu đề mục', 'text', 'content', { required: true, maxLength: 120 }),
    f('body', 'Nội dung', 'textarea', 'content', { required: true, multiline: 5 }),
    f('order', 'Thứ tự hiển thị', 'number', 'display'),
    f('updated', 'Ngày cập nhật', 'text', 'display'),
  ], clientPath);

export const SOFA2_SUPPORT_SCHEMAS: Record<string, Sofa2CmsSchema> = {
  faq: schema('câu hỏi', 'question', PUBLISHED, [
    f('question', 'Câu hỏi', 'text', 'content', { required: true, maxLength: 160 }),
    f('answer', 'Câu trả lời', 'textarea', 'content', { required: true, multiline: 4 }),
    f('category', 'Danh mục', 'select', 'display', { options: SOFA2_SUPPORT_CATEGORIES }),
    f('order', 'Thứ tự hiển thị', 'number', 'display'),
  ], '/sofa2/faq'),
  'help-center': schema('bài viết', 'title', PUBLISHED, [
    f('title', 'Tiêu đề', 'text', 'content', { required: true }),
    f('summary', 'Mô tả ngắn', 'textarea', 'content', { required: true, multiline: 3 }),
    f('body', 'Nội dung hướng dẫn', 'textarea', 'content', { required: true, multiline: 7 }),
    f('category', 'Danh mục', 'select', 'display', { options: SOFA2_SUPPORT_CATEGORIES }),
    f('tags', 'Thẻ', 'text', 'seo'),
    f('views', 'Lượt đọc', 'number', 'display'),
    f('updated', 'Cập nhật', 'text', 'display'),
  ], '/sofa2/support#help-center'),
  'live-chat': schema('phiên chat', 'customer', ['Đang chat', 'Chờ', 'Đã kết thúc', 'Bỏ lỡ'], [
    f('customer', 'Khách', 'text', 'content', { required: true }),
    f('contact', 'Liên hệ', 'text', 'content'),
    f('topic', 'Chủ đề', 'text', 'content'),
    f('transcript', 'Nội dung trao đổi', 'textarea', 'content', { multiline: 4 }),
    f('reply', 'Phản hồi của tư vấn viên', 'textarea', 'content', { multiline: 3 }),
    f('agent', 'Tư vấn viên', 'select', 'display', { options: AGENTS }),
    f('started', 'Bắt đầu', 'text', 'display'),
  ], '/sofa2/support#chat', false),
  tickets: schema('ticket', 'subject', TICKET_STATUSES, [
    f('code', 'Mã ticket', 'text', 'content', { required: true }),
    f('customer', 'Khách hàng', 'text', 'content', { required: true }),
    f('contact', 'Điện thoại / Email', 'text', 'content'),
    f('subject', 'Chủ đề', 'text', 'content', { required: true }),
    f('message', 'Mô tả của khách', 'textarea', 'content', { multiline: 3 }),
    f('reply', 'Phản hồi', 'textarea', 'content', { multiline: 3 }),
    f('category', 'Danh mục', 'select', 'display', { options: SOFA2_SUPPORT_CATEGORIES }),
    f('priority', 'Ưu tiên', 'select', 'display', { options: PRIORITIES }),
    f('agent', 'Phụ trách', 'select', 'display', { options: AGENTS }),
    f('created', 'Ngày tạo', 'text', 'display'),
  ], '/sofa2/support#ticket', false),
  ...Object.fromEntries(ARTICLE_SLUGS.map((s) => [s, articleSchema('mục')])),
  'contact-inquiries': schema('tin nhắn liên hệ', 'subject', ['Mới tiếp nhận', 'Đang xử lý', 'Chờ khách phản hồi', 'Đã phản hồi', 'Đã đóng', 'Spam'], [
    f('inquiryId', 'Mã liên hệ', 'text', 'content', { required: true, maxLength: 40 }),
    f('name', 'Họ tên người gửi', 'text', 'content', { required: true, maxLength: 80 }),
    f('email', 'Email', 'text', 'content'),
    f('phone', 'Điện thoại', 'text', 'content'),
    f('subject', 'Chủ đề', 'text', 'content', { required: true, maxLength: 120 }),
    f('message', 'Nội dung', 'textarea', 'content', { required: true, multiline: 5 }),
    f('receivedAt', 'Thời gian tiếp nhận', 'text', 'display'),
    f('source', 'Nguồn gửi', 'text', 'display'),
    f('assignedTo', 'Người phụ trách', 'select', 'display', { options: AGENTS }),
    f('reply', 'Nội dung phản hồi', 'textarea', 'display', { multiline: 4 }),
    f('repliedAt', 'Thời gian phản hồi', 'text', 'display'),
    f('internalNote', 'Ghi chú nội bộ', 'textarea', 'display', { multiline: 3 }),
  ], '/sofa2/contact#contact-form', false, 'Mới tiếp nhận'),
  'contact-info': schema('thông tin liên hệ', 'label', ['Đang hiển thị', 'Tạm ẩn'], [
    f('label', 'Loại thông tin', 'text', 'content', { required: true, maxLength: 40 }),
    f('value', 'Nội dung hiển thị', 'text', 'content', { required: true, maxLength: 180 }),
    f('sub', 'Mô tả ngắn', 'text', 'content', { maxLength: 120 }),
    f('icon', 'Biểu tượng Iconify', 'text', 'display'),
    f('href', 'Liên kết (tel:, mailto:, URL)', 'text', 'display'),
    f('order', 'Thứ tự hiển thị', 'number', 'display'),
  ], '/sofa2/contact', true),
  'contact-socials': schema('liên kết mạng xã hội', 'title', ['Đang hiển thị', 'Tạm ẩn'], [
    f('title', 'Tên mạng xã hội', 'text', 'content', { required: true, maxLength: 40 }),
    f('href', 'URL mạng xã hội', 'url', 'content', { required: true }),
    f('icon', 'Biểu tượng Iconify', 'text', 'display'),
    f('order', 'Thứ tự hiển thị', 'number', 'display'),
  ], '/sofa2/contact', true),
  channels: schema('kênh', 'title', ['Đang bật', 'Tạm tắt'], [
    f('title', 'Tên kênh', 'text', 'content', { required: true }),
    f('value', 'Thông tin hiển thị', 'text', 'content', { required: true }),
    f('href', 'Liên kết (tel:, mailto:, URL hoặc #chat)', 'text', 'display'),
    f('sub', 'Mô tả ngắn', 'text', 'content'),
    f('icon', 'Biểu tượng (Iconify)', 'text', 'display'),
    f('order', 'Thứ tự', 'number', 'display'),
  ], '/sofa2/support#contact-options'),
};

export function getSofa2SupportSchema(moduleSlug?: string) {
  return moduleSlug ? SOFA2_SUPPORT_SCHEMAS[moduleSlug] : undefined;
}

/** Các nhóm bài hiển thị trên trang khách */
export const SOFA2_SUPPORT_ARTICLE_TABS: { slug: (typeof ARTICLE_SLUGS)[number]; label: string }[] = [
  { slug: 'guide-buying', label: 'Hướng dẫn mua hàng' },
  { slug: 'guide-payment', label: 'Hướng dẫn thanh toán' },
  { slug: 'policy-shipping', label: 'Chính sách giao hàng' },
  { slug: 'policy-warranty', label: 'Chính sách bảo hành' },
  { slug: 'policy-return', label: 'Chính sách đổi trả' },
];

/** Sắp xếp + lọc bản ghi đã xuất bản để hiển thị cho khách */
export const sofa2Visible = (rows: Record<string, string | number>[], on = 'Đã xuất bản') =>
  rows.filter((r) => r.status === on).sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
