// SOFA2 ADMIN — Module Tài khoản khách hàng, dùng chung dữ liệu với các trang client /sofa2.
// Bao phủ hồ sơ, đăng ký/đăng nhập/đặt lại mật khẩu, địa chỉ, đơn hàng, wishlist,
// giao dịch, bảo hành, điểm, voucher và khiếu nại.
// ----------------------------------------------------------------------

import { SOFA2_PRODUCTS as CLIENT_PRODUCTS } from 'src/sections/sofa2/sofa2-pages-data';

import type { Sofa2CmsField, Sofa2CmsSchema, Sofa2CmsFieldType } from './sofa2-cms';
import type { Sofa2AdminGroup, Sofa2AdminColumn, Sofa2AdminModule } from './sofa2-admin-data';

type Row = Record<string, string | number>;

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
  defaultStatus = statusOptions[0],
  clientPath = '/sofa2/account'
): Sofa2CmsSchema => ({
  clientPath,
  entity,
  titleKey,
  statusKey: 'status',
  statusOptions,
  defaultStatus,
  statusToggle: false,
  fields: fields.some((field) => field.key === 'status')
    ? fields
    : [...fields, f('status', 'Trạng thái', 'select', 'display', { required: true, options: statusOptions })],
});

const mod = (
  slug: string,
  name: string,
  description: string,
  icon: string,
  stats: Sofa2AdminModule['stats'],
  columns: Sofa2AdminColumn[],
  rows: Row[]
): Sofa2AdminModule => ({ slug, name, description, icon, stats, columns, rows });

const S: Sofa2AdminColumn = { key: 'status', label: 'Trạng thái', type: 'status' };

// ---- Danh mục dùng chung --------------------------------------------
export const SOFA2_DEMO_CUSTOMER_ID = 'KH-1001';
export const SOFA2_DEMO_CUSTOMER_NAME = 'Nguyễn Minh Anh';

export const sofa2LocalDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function isSofa2CustomerPointAvailable(
  row: Record<string, unknown>,
  today = sofa2LocalDateKey()
) {
  const expiry = String(row.expiry ?? '').slice(0, 10);
  return String(row.status ?? '') === 'Đã ghi nhận' && (!expiry || expiry >= today);
}

/** Shared browser-side validation for the account profile forms and admin CRUD. */
export function validateSofa2CustomerProfile(
  candidate: Record<string, unknown>,
  profiles: Record<string, unknown>[],
  currentCustomerId?: string
) {
  const errors: Record<string, string> = {};
  const name = String(candidate.name ?? '').trim();
  const email = String(candidate.email ?? '').trim().toLowerCase();
  const phone = String(candidate.phone ?? '').replace(/\D/g, '');
  const birthday = String(candidate.birthday ?? '').slice(0, 10);

  if (!name) errors.name = 'Vui lòng nhập họ tên.';
  else if (name.length > 80) errors.name = 'Họ tên tối đa 80 ký tự.';
  if (!email) errors.email = 'Vui lòng nhập email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email không hợp lệ.';
  else if (profiles.some((profile) =>
    String(profile.customerId ?? '') !== String(currentCustomerId ?? '') &&
    String(profile.email ?? '').trim().toLowerCase() === email
  )) errors.email = 'Email này đã được dùng cho hồ sơ khác.';

  if (!phone) errors.phone = 'Vui lòng nhập số điện thoại.';
  else if (phone.length < 9 || phone.length > 15) errors.phone = 'Số điện thoại cần có từ 9 đến 15 chữ số.';
  else if (profiles.some((profile) =>
    String(profile.customerId ?? '') !== String(currentCustomerId ?? '') &&
    String(profile.phone ?? '').replace(/\D/g, '') === phone
  )) errors.phone = 'Số điện thoại này đã được dùng cho hồ sơ khác.';

  if (birthday) {
    const birthDate = new Date(`${birthday}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(birthDate.getTime())) errors.birthday = 'Ngày sinh không hợp lệ.';
    else if (birthDate > today) errors.birthday = 'Ngày sinh không thể nằm trong tương lai.';
  }
  return errors;
}

const TIERS = ['Thành viên', 'Bạc', 'Vàng', 'Kim cương'];
const CITIES = ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Bình Dương', 'Hải Phòng', 'Cần Thơ'];
const STAFF = ['Minh Anh', 'Thu Hà', 'Hoàng Long', 'Quốc Bảo', 'Chưa gán'];
const STYLES = ['Hiện đại', 'Tối giản', 'Bắc Âu', 'Cổ điển', 'Indochine'];
const PAYMENTS = ['COD', 'Chuyển khoản', 'Thẻ tín dụng', 'Thẻ Visa/Master', 'Ví điện tử', 'Ví MoMo', 'VNPay', 'VNPay QR', 'Trả góp 0%', 'Trả góp'];
const PRODUCTS = ['Sofa góc Milano', 'Sofa da Verona', 'Sofa băng Oslo', 'Ghế thư giãn Luna', 'Sofa nỉ Kyoto', 'Bàn trà Marble'];
export const SOFA2_CUSTOMER_COMPLAINT_TYPES = ['Sản phẩm', 'Giao hàng', 'Lắp đặt', 'Dịch vụ', 'Thanh toán', 'Khác', 'Sản phẩm lỗi', 'Giao hàng trễ', 'Sai màu/kích thước', 'Thái độ nhân viên'];
const NAMES = [SOFA2_DEMO_CUSTOMER_NAME, 'Trần Minh Khoa', 'Lê Hoàng Yến', 'Phạm Quốc Huy', 'Võ Ngọc Hân', 'Đặng Gia Bảo', 'Bùi Thanh Tâm', 'Hồ Mỹ Linh', 'Ngô Đức Thắng', 'Đỗ Phương Anh', 'Nguyễn Thùy Dương', 'Đỗ Anh Tuấn', 'Phan Ngọc Hà', 'Vũ Hoàng Nam', 'Trương Bảo Ngọc', 'Lý Gia Phúc', 'Mai Thanh Vy', 'Đặng Quốc Việt', 'Cao Minh Châu', 'Tạ Minh Trang'];
const CUSTOMER_IDS = NAMES.map((_, i) => `KH-${1001 + i}`);
const customerEmail = (i: number) => `khach${i + 1}@gmail.com`;
const customerPhone = (i: number) => `09${String(12345678 + i * 1111).slice(0, 8)}`;
const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];
const day = (i: number, m = 9) => `2026-${String(m).padStart(2, '0')}-${String((i * 3) % 27 + 1).padStart(2, '0')}`;
const recentDay = (daysAgo: number) => {
  const date = new Date(Date.UTC(2026, 10, 15 - daysAgo));
  return date.toISOString().slice(0, 10);
};
const code = (p: string, i: number) => `${p}${String(1001 + i)}`;
const gen = (n: number, fn: (i: number) => Row) => Array.from({ length: n }, (_, i) => ({ id: `r${i + 1}`, ...fn(i) }));

const ST = {
  dashboard: ['Hoạt động', 'Cần chăm sóc', 'Không hoạt động', 'Đã khoá'],
  profile: ['Đã xác minh', 'Chưa xác minh', 'Đã khoá'],
  order: ['Chờ xác nhận', 'Đang xử lý', 'Đang sản xuất', 'Đang giao', 'Đã giao', 'Hoàn thành', 'Đã huỷ'],
  warranty: ['Còn hiệu lực', 'Tiếp nhận', 'Đang kiểm tra', 'Đang sửa chữa', 'Hoàn tất', 'Hết hạn', 'Từ chối'],
  points: ['Đã ghi nhận', 'Chờ duyệt', 'Đã huỷ'],
  voucher: ['Đang phát hành', 'Bản nháp', 'Tạm dừng', 'Hết hạn', 'Đã nhận', 'Đã sử dụng'],
  complaint: ['Mới', 'Đang xử lý', 'Chờ khách phản hồi', 'Đã giải quyết', 'Đóng'],
};

/** Shared order ledger: downstream warranty, points and complaint mock rows reference these codes. */
const CUSTOMER_PROFILE_ROWS = gen(NAMES.length, (i) => ({
  customerId: CUSTOMER_IDS[i],
  name: NAMES[i],
  phone: customerPhone(i),
  email: customerEmail(i),
  avatar: '',
  birthday: `199${i % 10}-0${(i % 9) + 1}-15`,
  gender: i % 2 ? 'Nam' : 'Nữ',
  address: `${12 + i * 3} ${pick(['Nguyễn Trãi', 'Lê Lợi', 'Bạch Đằng', 'Hai Bà Trưng', 'Điện Biên Phủ'], i)}`,
  city: pick(CITIES, i),
  style: pick(STYLES, i),
  emailOptIn: i % 3 ? 'Có' : 'Không',
  smsOptIn: i % 4 ? 'Có' : 'Không',
  emailVerified: i % 7 === 6 ? 'Không' : 'Có',
  lastLogin: recentDay((i * 3) % 30),
  failedAttempts: i === 17 ? 8 : i % 4,
  lockUntil: i === 17 ? '2026-11-30' : '',
  status: pick(ST.profile, i === 17 ? 2 : i % 7 === 6 ? 1 : 0),
}));

const CUSTOMER_ORDER_ROWS = gen(30, (i) => {
  const customerIndex = i % CUSTOMER_IDS.length;
  const total = 12_900_000 + i * 2_300_000;
  return {
    code: code('DH', i),
    customerId: CUSTOMER_IDS[customerIndex],
    customer: NAMES[customerIndex],
    phone: customerPhone(customerIndex),
    email: customerEmail(customerIndex),
    product: pick(PRODUCTS, i),
    address: `${20 + i} Lê Lợi, ${pick(CITIES, customerIndex)}`,
    total,
    payment: pick(PAYMENTS, i),
    points: Math.floor(total / 100_000),
    voucher: i % 4 === 0 ? 'WELCOME500' : '',
    orderDate: day(i),
    status: pick(ST.order, i),
  };
});

// ----------------------------------------------------------------------
export const SOFA2_CUSTOMER_GROUP: Sofa2AdminGroup = {
  slug: 'customer',
  name: 'Khách hàng',
  icon: 'solar:users-group-rounded-bold-duotone',
  modules: [
    mod('dashboard', 'Dashboard', 'Tổng quan từng khách hàng: hạng, số đơn, chi tiêu, người chăm sóc.', 'solar:widget-2-bold-duotone',
      [{ label: 'Khách hàng', value: '2.846', trend: '+6%' }, { label: 'Hoạt động 30 ngày', value: '1.112' }, { label: 'Chi tiêu TB', value: '18,4tr' }, { label: 'Quay lại mua', value: '34%' }],
      [{ key: 'customerId', label: 'Mã khách' }, { key: 'name', label: 'Khách hàng' }, { key: 'tier', label: 'Hạng' }, { key: 'orders', label: 'Đơn', type: 'number' }, { key: 'spent', label: 'Tổng chi', type: 'money' }, { key: 'staff', label: 'Chăm sóc' }, S],
      gen(NAMES.length, (i) => ({ customerId: CUSTOMER_IDS[i], name: NAMES[i], tier: pick(TIERS, i + 1), orders: (i % 6) + 1, spent: 8_500_000 * ((i % 6) + 1), lastOrder: day(i), staff: pick(STAFF, i), note: '', status: pick(ST.dashboard, i === 17 ? 3 : i % 5 === 4 ? 2 : i % 3 === 2 ? 1 : 0) }))),
    mod('accounts', 'Tài khoản truy cập', 'Trạng thái tài khoản, xác minh email, hoạt động đăng nhập và khóa/mở tài khoản.', 'solar:shield-user-bold-duotone',
      [{ label: 'Tài khoản', value: '2.846' }, { label: 'Đã xác minh email', value: '91%' }, { label: 'Đăng nhập 30 ngày', value: '1.112' }, { label: 'Bị khóa', value: '4' }],
      [{ key: 'customerId', label: 'Mã khách' }, { key: 'name', label: 'Khách hàng' }, { key: 'email', label: 'Email' }, { key: 'emailVerified', label: 'Email xác minh' }, { key: 'lastLogin', label: 'Đăng nhập gần nhất' }, { key: 'failedAttempts', label: 'Lần lỗi', type: 'number' }, { key: 'lockUntil', label: 'Khóa đến' }, S],
      CUSTOMER_PROFILE_ROWS),
    mod('profiles', 'Hồ sơ cá nhân', 'Thông tin cá nhân, địa chỉ giao hàng và tuỳ chọn nhận tin của khách.', 'solar:user-id-bold-duotone',
      [{ label: 'Hồ sơ', value: '2.846' }, { label: 'Đã xác minh', value: '91%' }, { label: 'Nhận email', value: '64%' }, { label: 'Nhận Zalo/SMS', value: '72%' }],
      [{ key: 'customerId', label: 'Mã khách' }, { key: 'name', label: 'Họ tên' }, { key: 'phone', label: 'Điện thoại' }, { key: 'email', label: 'Email' }, { key: 'city', label: 'Tỉnh/thành' }, { key: 'emailVerified', label: 'Email xác minh' }, { key: 'lastLogin', label: 'Đăng nhập gần nhất' }, S],
      CUSTOMER_PROFILE_ROWS),
    mod('customer-orders', 'Đơn hàng', 'Đơn mua của khách, hiển thị trong mục "Đơn hàng của tôi".', 'solar:bag-4-bold-duotone',
      [{ label: 'Đơn tháng', value: '468', trend: '+14%' }, { label: 'Giá trị TB', value: '21,6tr' }, { label: 'Đang giao', value: '37' }, { label: 'Tỷ lệ huỷ', value: '2,1%' }],
      [{ key: 'code', label: 'Mã đơn' }, { key: 'customer', label: 'Khách hàng' }, { key: 'product', label: 'Sản phẩm' }, { key: 'total', label: 'Tổng tiền', type: 'money' }, { key: 'payment', label: 'Thanh toán' }, S],
      CUSTOMER_ORDER_ROWS),
    mod('warranties', 'Phiếu bảo hành', 'Phiếu bảo hành điện tử theo serial, lịch hẹn kỹ thuật viên.', 'solar:shield-check-bold-duotone',
      [{ label: 'Phiếu hiệu lực', value: '1.932' }, { label: 'Yêu cầu mở', value: '24' }, { label: 'Xử lý TB', value: '2,4 ngày' }, { label: 'Hài lòng', value: '94%' }],
      [{ key: 'code', label: 'Mã phiếu' }, { key: 'customer', label: 'Khách hàng' }, { key: 'product', label: 'Sản phẩm' }, { key: 'serial', label: 'Serial' }, { key: 'expiry', label: 'Hết hạn' }, S],
      gen(14, (i) => {
        const customerIndex = i % CUSTOMER_IDS.length;
        return { code: code('BH', i), customerId: CUSTOMER_IDS[customerIndex], customer: NAMES[customerIndex], product: pick(PRODUCTS, i), serial: `LX26${String(5000 + i * 37)}`, orderCode: code('DH', i), issue: i === 0 ? '' : pick(['Bong da tay vịn', 'Lún đệm ngồi', 'Kêu khung', 'Rách đường may'], i), purchaseDate: day(i, 3), expiry: day(i, 3).replace('2026', '2031'), technician: pick(STAFF, i + 1), appointment: day(i, 10), status: pick(ST.warranty, i) };
      })),
    mod('points', 'Điểm tích lũy', 'Số dư điểm, lịch sử cộng/đổi và hạn dùng theo hạng thành viên.', 'solar:star-rings-bold-duotone',
      [{ label: 'Điểm lưu hành', value: '1,28tr' }, { label: 'Đã đổi tháng', value: '86.400' }, { label: 'Sắp hết hạn', value: '42.100' }, { label: 'Tỷ lệ đổi', value: '27%' }],
      [{ key: 'customer', label: 'Khách hàng' }, { key: 'reason', label: 'Lý do' }, { key: 'points', label: 'Điểm (+/−)', type: 'number' }, { key: 'date', label: 'Ngày' }, S],
      [
        { customerId: CUSTOMER_IDS[0], customer: NAMES[0], reason: 'Tích điểm đơn hàng DH1001', points: 129, date: day(0), expiry: '2027-09-01', orderCode: 'DH1001', status: 'Đã ghi nhận' },
        { customerId: CUSTOMER_IDS[0], customer: NAMES[0], reason: 'Tích điểm đơn hàng DH1021', points: 589, date: day(20), expiry: '2027-10-01', orderCode: 'DH1021', status: 'Đã ghi nhận' },
        { customerId: CUSTOMER_IDS[0], customer: NAMES[0], reason: 'Đánh giá sản phẩm DH1001', points: 200, date: '2026-10-02', expiry: '2027-10-02', orderCode: 'DH1001', status: 'Đã ghi nhận' },
        { customerId: CUSTOMER_IDS[0], customer: NAMES[0], reason: 'Thưởng sinh nhật thành viên', points: 500, date: '2026-10-15', expiry: '2027-10-15', status: 'Đã ghi nhận' },
        { customerId: CUSTOMER_IDS[0], customer: NAMES[0], reason: 'Đổi voucher POINT1000', points: -1000, date: '2026-10-20', expiry: '', status: 'Đã ghi nhận' },
        { customerId: CUSTOMER_IDS[1], customer: NAMES[1], reason: 'Điểm thưởng sắp hết hạn', points: 350, date: '2025-10-20', expiry: '2026-10-20', status: 'Đã ghi nhận' },
        { customerId: CUSTOMER_IDS[2], customer: NAMES[2], reason: 'Điểm chờ xác nhận đơn DH1003', points: 240, date: '2026-10-11', expiry: '2027-10-11', status: 'Chờ duyệt' },
        { customerId: CUSTOMER_IDS[3], customer: NAMES[3], reason: 'Giao dịch điểm bị huỷ', points: 100, date: '2026-10-12', expiry: '2027-10-12', status: 'Đã huỷ' },
        ...gen(36, (i) => {
          const customerIndex = (i % (CUSTOMER_IDS.length - 1)) + 1;
          const isRedemption = i % 5 === 0;
          const status = i % 13 === 0 ? 'Chờ duyệt' : i % 17 === 0 ? 'Đã huỷ' : 'Đã ghi nhận';
          return { customerId: CUSTOMER_IDS[customerIndex], customer: NAMES[customerIndex], reason: isRedemption ? `Đổi voucher ${pick(['BDAY10', 'FREESHIP', 'BACK2SOFA'], i)}` : pick(['Tích điểm đơn hàng', 'Đánh giá sản phẩm', 'Thưởng sinh nhật'], i), points: isRedemption ? -(100 + (i % 4) * 50) : 80 + (i % 9) * 45, date: day(i, 10), expiry: isRedemption ? '' : i % 7 === 0 ? '2026-10-20' : day(i, 12).replace('2026', '2027'), status };
        }),
      ]),
    mod('vouchers', 'Voucher', 'Mã giảm giá phát cho khách: chào mừng, sinh nhật, VIP, đổi điểm.', 'solar:ticket-sale-bold-duotone',
      [{ label: 'Voucher đang chạy', value: '12' }, { label: 'Đã phát', value: '5.840' }, { label: 'Đã dùng', value: '1.902' }, { label: 'Doanh thu gắn mã', value: '1,9 tỷ' }],
      [{ key: 'code', label: 'Mã' }, { key: 'customer', label: 'Khách nhận' }, { key: 'campaign', label: 'Chiến dịch' }, { key: 'value', label: 'Giá trị' }, { key: 'minOrder', label: 'Đơn tối thiểu', type: 'money' }, { key: 'endDate', label: 'Hết hạn' }, S],
      [
        ...[
          ['WELCOME500', 'Chào mừng', '500.000đ', 5_000_000, 0],
        ['BDAY10', 'Sinh nhật', '10%', 3_000_000, 0],
        ['VIPGOLD15', 'VIP', '15%', 15_000_000, 0],
        ['POINT1000', 'Đổi điểm', '1.000.000đ', 10_000_000, 0],
        ['FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí ship', 2_000_000, 0],
        ['BACK2SOFA', 'Khách quay lại', '7%', 8_000_000, 2],
        ['TET2027', 'Tết', '12%', 12_000_000, 1],
        ['SUMMER25', 'Mùa hè', '5%', 4_000_000, 3],
      ].map(([c, camp, v, min, s], i) => ({ id: `r${i + 1}`, code: c, customerId: 'Tất cả thành viên', customer: 'Tất cả thành viên', campaign: camp, value: v, minOrder: min, quantity: 500, pointsCost: camp === 'Đổi điểm' ? 1000 : 0, startDate: day(i, 9), endDate: day(i, 12), status: ST.voucher[Number(s)] })) as Row[],
      { code: 'BDAY10', customerId: CUSTOMER_IDS[0], customer: NAMES[0], campaign: 'Sinh nhật', value: '10%', minOrder: 3_000_000, quantity: 1, pointsCost: 0, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Đã nhận' },
      { code: 'POINT1000', customerId: CUSTOMER_IDS[0], customer: NAMES[0], campaign: 'Đổi điểm', value: '1.000.000đ', minOrder: 10_000_000, quantity: 1, pointsCost: 1000, startDate: '2026-09-01', endDate: '2027-01-15', status: 'Đã sử dụng' },
      { code: 'WELCOME500', customerId: CUSTOMER_IDS[1], customer: NAMES[1], campaign: 'Chào mừng', value: '500.000đ', minOrder: 5_000_000, quantity: 1, pointsCost: 0, startDate: '2026-09-01', endDate: '2026-10-15', status: 'Hết hạn' },
      ]),
    mod('complaints', 'Khiếu nại', 'Tiếp nhận và xử lý khiếu nại, theo dõi hạn xử lý và bồi thường.', 'solar:chat-round-dots-bold-duotone',
      [{ label: 'Đang mở', value: '18' }, { label: 'Quá hạn', value: '2' }, { label: 'Phản hồi TB', value: '3,2 giờ' }, { label: 'Giải quyết lần đầu', value: '78%' }],
      [{ key: 'code', label: 'Mã' }, { key: 'customer', label: 'Khách hàng' }, { key: 'type', label: 'Loại' }, { key: 'priority', label: 'Ưu tiên' }, { key: 'owner', label: 'Phụ trách' }, S],
      gen(16, (i) => {
        const customerIndex = i % CUSTOMER_IDS.length;
        return { code: code('KN', i), customerId: CUSTOMER_IDS[customerIndex], customer: NAMES[customerIndex], type: pick(SOFA2_CUSTOMER_COMPLAINT_TYPES, i), orderCode: code('DH', i), subject: pick(['Giao hàng chậm', 'Sản phẩm cần kiểm tra', 'Yêu cầu hỗ trợ đơn hàng', 'Sai thông tin thanh toán'], i), content: 'Khách phản ánh vấn đề cần được kiểm tra và phản hồi.', resolution: i % 4 === 3 ? 'Đã liên hệ khách và thống nhất phương án xử lý.' : '', priority: pick(['Cao', 'Trung bình', 'Thấp'], i), owner: pick(STAFF, i), deadline: day(i, 10), compensate: i % 3 ? 'false' : 'true', created: day(i), status: pick(ST.complaint, i) };
      })),
    mod('addresses', 'Địa chỉ giao hàng', 'Sổ địa chỉ nhiều người nhận, đặt địa chỉ mặc định và ghi chú giao hàng cho khách.', 'solar:map-point-bold-duotone',
      [{ label: 'Địa chỉ đang lưu', value: '5.120' }, { label: 'Địa chỉ mặc định', value: '2.846' }, { label: 'Ngoài vùng giao', value: '84' }, { label: 'Cập nhật tháng', value: '126' }],
      [{ key: 'customerId', label: 'Mã khách' }, { key: 'customer', label: 'Khách hàng' }, { key: 'label', label: 'Nhãn' }, { key: 'recipient', label: 'Người nhận' }, { key: 'phone', label: 'Điện thoại' }, { key: 'city', label: 'Tỉnh/thành' }, { key: 'isDefault', label: 'Mặc định' }, S],
      gen(30, (i) => {
        const customerIndex = i % CUSTOMER_IDS.length;
        const isDefault = i < CUSTOMER_IDS.length;
        const suffix = Math.floor(i / CUSTOMER_IDS.length) + 1;
        const city = pick(CITIES, customerIndex);
        const district = pick(['Quận 1', 'Quận 3', 'Cầu Giấy', 'Thanh Xuân', 'Hải Châu', 'Ninh Kiều'], i);
        const addressStatus = isDefault
          ? 'Mặc định'
          : i === 21 ? 'Ngoài vùng giao' : i === 25 ? 'Tạm ẩn' : i === 28 ? 'Đã xác minh' : 'Phụ';
        return {
          addressId: `ADDR-${CUSTOMER_IDS[customerIndex]}-${String(suffix).padStart(2, '0')}`,
          customerId: CUSTOMER_IDS[customerIndex],
          customer: NAMES[customerIndex],
          label: isDefault ? 'Nhà' : pick(['Văn phòng', 'Nhà người thân', 'Cửa hàng'], i),
          recipient: isDefault ? NAMES[customerIndex] : pick(NAMES, customerIndex + 3),
          phone: customerPhone(isDefault ? customerIndex : (customerIndex + 1) % NAMES.length),
          address: `${12 + i * 3} ${pick(['Nguyễn Trãi', 'Lê Lợi', 'Bạch Đằng', 'Hai Bà Trưng', 'Điện Biên Phủ'], i)}`,
          ward: pick(['Bến Nghé', 'Thượng Đình', 'Thạch Thang', 'Bến Thành', 'An Khánh'], i),
          district,
          city,
          zipCode: pick(['700000', '100000', '550000', '820000', '180000'], customerIndex),
          deliveryType: pick(['Giao tận nhà', 'Giao giờ hành chính', 'Nhận tại cửa hàng'], i),
          deliveryNote: i % 4 === 0 ? 'Gọi trước 15 phút khi giao.' : '',
          isDefault: isDefault ? 'Có' : 'Không',
          status: addressStatus,
        };
      })),
    mod('wishlist', 'Yêu thích', 'Danh sách sản phẩm khách lưu; theo dõi thông báo giá và chuyển đổi sang giỏ hàng.', 'solar:heart-bold-duotone',
      [{ label: 'Lượt lưu sản phẩm', value: '2.846' }, { label: 'Khách có wishlist', value: '934' }, { label: 'Thông báo giá bật', value: '682' }, { label: 'Tỷ lệ chuyển đơn', value: '14%' }],
      [{ key: 'customer', label: 'Khách hàng' }, { key: 'product', label: 'Sản phẩm' }, { key: 'added', label: 'Ngày lưu' }, { key: 'notify', label: 'Báo giảm giá' }, S],
      gen(40, (i) => {
        const customerIndex = i % CUSTOMER_IDS.length;
        const product = pick(CLIENT_PRODUCTS, i * 7 + customerIndex);
        const status = i % 13 === 12 ? 'Đã bỏ' : i % 7 === 6 ? 'Đã mua' : 'Đang lưu';
        return {
          customerId: CUSTOMER_IDS[customerIndex],
          customer: NAMES[customerIndex],
          productId: product.id,
          product: product.name,
          added: recentDay((i * 2) % 60),
          notify: i % 3 === 0 ? 'Có' : 'Không',
          notifyStock: i % 4 === 0 ? 'Có' : 'Không',
          status,
        };
      })),
    mod('transactions', 'Lịch sử giao dịch', 'Đối soát thanh toán, hoàn tiền và phương thức giao dịch trong cổng tài khoản khách.', 'solar:wallet-money-bold-duotone',
      [{ label: 'Giao dịch tháng', value: '1.032' }, { label: 'Thanh toán thành công', value: '986' }, { label: 'Đang xử lý/hoàn tiền', value: '41' }, { label: 'Lỗi cổng thanh toán', value: '5' }],
      [{ key: 'txnId', label: 'Mã giao dịch' }, { key: 'customer', label: 'Khách hàng' }, { key: 'order', label: 'Mã đơn' }, { key: 'method', label: 'Phương thức' }, { key: 'amount', label: 'Số tiền', type: 'money' }, { key: 'date', label: 'Ngày giao dịch' }, { key: 'reference', label: 'Mã đối soát' }, S],
      gen(CUSTOMER_ORDER_ROWS.length, (i) => {
        const order: Row = CUSTOMER_ORDER_ROWS[i];
        const statuses = ['Thành công', 'Thành công', 'Đang xử lý', 'Thất bại', 'Hoàn tiền', 'Đã hoàn'];
        const status = pick(statuses, i);
        return {
          txnId: `GD-${order.customerId}-${String(i + 1).padStart(3, '0')}`,
          customerId: order.customerId,
          customer: order.customer,
          order: order.code,
          method: order.payment,
          amount: order.total,
          date: recentDay((i * 3) % 75),
          reference: status === 'Thất bại' ? '' : `DEMO-${String(2611000 + i)}`,
          note: status === 'Thành công' ? 'Đã đối soát với đơn hàng.'
            : status === 'Đang xử lý' ? 'Đang chờ cổng thanh toán xác nhận.'
              : status === 'Thất bại' ? 'Thanh toán không thành công; chưa ghi nhận tiền.'
                : status === 'Hoàn tiền' ? 'Đã khởi tạo yêu cầu hoàn tiền.'
                  : 'Đã hoàn tiền về phương thức thanh toán ban đầu.',
          status,
        };
      })),
    mod('registrations', 'Đăng ký tài khoản', 'Hồ sơ đăng ký website chờ xác minh, duyệt hoặc từ chối; không lưu mật khẩu.', 'solar:user-plus-bold-duotone',
      [{ label: 'Chờ xác minh', value: '18' }, { label: 'Đăng ký tháng', value: '124' }, { label: 'Đã duyệt', value: '96' }, { label: 'Từ chối / trùng', value: '10' }],
      [{ key: 'requestId', label: 'Mã đăng ký' }, { key: 'name', label: 'Họ tên' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Điện thoại' }, { key: 'source', label: 'Nguồn' }, { key: 'consent', label: 'Đồng ý điều khoản' }, { key: 'customerId', label: 'Mã khách đã tạo' }, { key: 'createdAt', label: 'Ngày gửi' }, S],
      gen(20, (i) => {
        const statuses = ['Chờ xác minh', 'Đang xem xét', 'Đã duyệt', 'Từ chối', 'Đã huỷ'];
        const status = pick(statuses, i);
        const isLead = status === 'Chờ xác minh' || status === 'Đang xem xét';
        const email = isLead ? `dangky${String(i + 1).padStart(2, '0')}@example.test` : customerEmail(i);
        const reviewed = !isLead && status !== 'Đã huỷ';
        return {
          requestId: `REG-2611-${String(i + 1).padStart(3, '0')}`,
          name: isLead ? `${NAMES[i]} (đăng ký mới)` : NAMES[i],
          email,
          phone: customerPhone(i),
          source: pick(['Website', 'Landing page', 'Cửa hàng', 'Khác'], i),
          consent: i % 9 === 8 ? 'Không' : 'Có',
          customerId: status === 'Đã duyệt' ? CUSTOMER_IDS[i] : '',
          createdAt: recentDay((i * 2) % 21),
          reviewedBy: reviewed ? pick(STAFF, i) : '',
          reviewedAt: reviewed ? recentDay(Math.max(0, (i * 2) % 21 - 1)) : '',
          note: status === 'Chờ xác minh' ? 'Chờ xác minh email; chưa tạo hồ sơ truy cập.'
            : status === 'Đang xem xét' ? 'Đang kiểm tra thông tin đăng ký.'
              : status === 'Đã duyệt' ? 'Đã duyệt; liên kết hồ sơ khách hàng tương ứng.'
                : status === 'Từ chối' ? (i % 2 ? 'Thông tin không đầy đủ.' : 'Email đã thuộc hồ sơ hiện có.')
                  : 'Người đăng ký đã yêu cầu huỷ.',
          status,
        };
      })),
    mod('login-activity', 'Lịch sử đăng nhập', 'Theo dõi sự kiện đăng nhập ở mức demo; chỉ lưu email, kết quả và thiết bị, tuyệt đối không lưu mật khẩu.', 'solar:shield-user-bold-duotone',
      [{ label: 'Sự kiện 7 ngày', value: '428' }, { label: 'Thành công', value: '392' }, { label: 'Thất bại', value: '31' }, { label: 'Tài khoản khóa', value: '5' }],
      [{ key: 'eventId', label: 'Mã sự kiện' }, { key: 'email', label: 'Email' }, { key: 'occurredAt', label: 'Thời gian' }, { key: 'result', label: 'Kết quả' }, { key: 'device', label: 'Thiết bị' }, { key: 'ip', label: 'IP' }, S],
      gen(30, (i) => {
        const isUnknown = i % 7 === 0;
        const isLocked = i % 11 === 0;
        const customerIndex = isLocked ? 17 : i % CUSTOMER_IDS.length;
        const email = isUnknown ? `unknown${i + 1}@example.test` : customerEmail(customerIndex);
        const needsReview = isUnknown || isLocked;
        const status = i > 24 ? 'Đã lưu trữ' : needsReview ? 'Cần rà soát' : 'Demo';
        return {
          eventId: `AUTH-2611-${String(1100 - i).padStart(4, '0')}`,
          email,
          occurredAt: `${recentDay((i * 2) % 14)}T${String(8 + (i % 12)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00+07:00`,
          result: isUnknown ? 'Không tìm thấy tài khoản (demo)'
            : isLocked ? 'Tài khoản đã khóa (demo)'
              : 'Đã ghi nhận demo — chưa xác thực',
          device: pick(['Chrome / Windows', 'Safari / iOS', 'Chrome / Android', 'Firefox / macOS', 'Edge / Windows'], i),
          ip: 'Không khả dụng trong demo',
          note: isLocked ? 'Tài khoản đang bị khóa; không có xác thực mật khẩu trong demo.' : 'Mật khẩu và token không được lưu.',
          status,
        };
      })),
    mod('password-resets', 'Yêu cầu đặt lại mật khẩu', 'Danh sách yêu cầu quên mật khẩu; không lưu token hoặc mật khẩu, trạng thái xử lý được cập nhật thủ công.', 'solar:lock-keyhole-bold-duotone',
      [{ label: 'Mới tiếp nhận', value: '7' }, { label: 'Đã gửi hướng dẫn', value: '18' }, { label: 'Hoàn tất', value: '104' }, { label: 'Hết hạn', value: '3' }],
      [{ key: 'requestId', label: 'Mã yêu cầu' }, { key: 'email', label: 'Email' }, { key: 'requestedAt', label: 'Ngày yêu cầu' }, { key: 'processedBy', label: 'Người xử lý' }, { key: 'note', label: 'Ghi chú' }, S],
      gen(18, (i) => {
        const statuses = ['Tiếp nhận', 'Đã gửi hướng dẫn', 'Hoàn tất', 'Hết hạn', 'Từ chối'];
        const status = pick(statuses, i);
        const processed = status !== 'Tiếp nhận';
        return {
          requestId: `PWD-2611-${String(20 - i).padStart(3, '0')}`,
          email: customerEmail(i % CUSTOMER_IDS.length),
          requestedAt: `${recentDay((i * 3) % 30)}T${String(9 + (i % 10)).padStart(2, '0')}:${String((i * 11) % 60).padStart(2, '0')}:00+07:00`,
          processedBy: processed ? pick(STAFF, i + 1) : '',
          note: status === 'Tiếp nhận' ? 'Yêu cầu demo mới; chưa gửi email thực.'
            : status === 'Đã gửi hướng dẫn' ? 'Đã hướng dẫn khách qua kênh chăm sóc; không phát hành token trong demo.'
              : status === 'Hoàn tất' ? 'Đã hoàn tất quy trình demo; không thay đổi mật khẩu thật.'
                : status === 'Hết hạn' ? 'Yêu cầu quá thời hạn xử lý demo.'
                  : 'Không thể xác minh yêu cầu; đã từ chối trong dữ liệu demo.',
          status,
        };
      })),
  ],
};

// ----------------------------------------------------------------------
const SEO_NOTE = f('note', 'Ghi chú nội bộ', 'textarea', 'seo', { maxLength: 500 });

export const SOFA2_CUSTOMER_SCHEMAS: Record<string, Sofa2CmsSchema> = {
  dashboard: schema('khách hàng', 'name', ST.dashboard, [
    f('customerId', 'Mã khách hàng', 'text', 'content', { required: true }),
    f('name', 'Khách hàng', 'text', 'content', { required: true, maxLength: 80 }),
    f('tier', 'Hạng thành viên', 'select', 'content', { options: TIERS, required: true }),
    f('orders', 'Số đơn', 'number', 'content'),
    f('spent', 'Tổng chi tiêu (đ)', 'number', 'content'),
    f('lastOrder', 'Đơn gần nhất', 'date', 'display'),
    f('staff', 'Nhân viên chăm sóc', 'select', 'display', { options: STAFF }),
    SEO_NOTE,
  ]),
  accounts: schema('tài khoản khách hàng', 'customerId', ST.profile, [
    f('customerId', 'Mã khách hàng', 'text', 'content', { required: true, placeholder: 'KH-1###' }),
    f('name', 'Họ tên', 'text', 'content', { required: true, maxLength: 80 }),
    f('email', 'Email đăng nhập', 'text', 'content', { required: true }),
    f('phone', 'Số điện thoại', 'text', 'content', { required: true, maxLength: 15 }),
    f('emailVerified', 'Email đã xác minh', 'switch', 'display'),
    f('lastLogin', 'Đăng nhập gần nhất', 'date', 'display'),
    f('failedAttempts', 'Số lần đăng nhập chưa xác thực', 'number', 'display'),
    f('lockUntil', 'Khóa đến ngày', 'date', 'display'),
  ], ST.profile[1], '/sofa2/login'),
  profiles: schema('hồ sơ', 'name', ST.profile, [
    f('customerId', 'Mã khách hàng', 'text', 'content', { required: true }),
    f('name', 'Họ tên', 'text', 'content', { required: true, maxLength: 80 }),
    f('phone', 'Điện thoại', 'text', 'content', { required: true, maxLength: 15 }),
    f('email', 'Email', 'text', 'content', { required: true }),
    f('avatar', 'Ảnh đại diện', 'url', 'content'),
    f('birthday', 'Ngày sinh', 'date', 'content'),
    f('gender', 'Giới tính', 'select', 'content', { options: ['Nữ', 'Nam', 'Khác'] }),
    f('address', 'Địa chỉ giao hàng', 'textarea', 'content'),
    f('city', 'Tỉnh/thành', 'select', 'content', { options: CITIES }),
    f('style', 'Phong cách yêu thích', 'select', 'display', { options: STYLES }),
    f('emailOptIn', 'Nhận email khuyến mãi', 'switch', 'display'),
    f('smsOptIn', 'Nhận SMS/Zalo', 'switch', 'display'),
    f('emailVerified', 'Email đã xác minh', 'switch', 'display'),
    f('lastLogin', 'Đăng nhập gần nhất', 'date', 'display'),
    f('failedAttempts', 'Số lần đăng nhập demo', 'number', 'display'),
    f('lockUntil', 'Khóa đến ngày', 'date', 'display'),
    f('status', 'Trạng thái hồ sơ', 'select', 'display', { options: ST.profile }),
  ], ST.profile[1], '/sofa2/profile'),
  'customer-orders': schema('đơn hàng', 'code', ST.order, [
    f('code', 'Mã đơn', 'text', 'content', { required: true, placeholder: 'DH1001' }),
    f('customerId', 'Mã khách hàng', 'text', 'content', { required: true, placeholder: 'KH-1001' }),
    f('customer', 'Khách hàng', 'text', 'content', { required: true }),
    f('phone', 'Số điện thoại', 'text', 'content'),
    f('email', 'Email', 'text', 'content'),
    f('product', 'Sản phẩm', 'textarea', 'content', { required: true, multiline: 2 }),
    f('items', 'Chi tiết sản phẩm (JSON)', 'textarea', 'seo', { multiline: 3 }),
    f('address', 'Địa chỉ giao', 'textarea', 'content'),
    f('total', 'Tổng tiền (đ)', 'number', 'content', { required: true }),
    f('payment', 'Thanh toán', 'select', 'display', { options: PAYMENTS }),
    f('orderDate', 'Ngày đặt', 'date', 'display'),
    f('points', 'Điểm được cộng', 'number', 'display'),
    f('voucher', 'Voucher đã dùng', 'text', 'display'),
    f('note', 'Ghi chú đơn hàng', 'textarea', 'seo', { multiline: 2 }),
  ], ST.order[0], '/sofa2/my-orders'),
  warranties: schema('phiếu bảo hành', 'code', ST.warranty, [
    f('code', 'Mã phiếu', 'text', 'content', { required: true }),
    f('customerId', 'Mã khách hàng', 'text', 'content', { required: true, placeholder: 'KH-1001' }),
    f('customer', 'Khách hàng', 'text', 'content', { required: true }),
    f('product', 'Sản phẩm', 'select', 'content', { options: PRODUCTS }),
    f('serial', 'Số serial', 'text', 'content', { required: true }),
    f('orderCode', 'Mã đơn mua', 'text', 'content'),
    f('issue', 'Mô tả lỗi', 'textarea', 'content', ),
    f('purchaseDate', 'Ngày mua', 'date', 'display'),
    f('expiry', 'Hết hạn bảo hành', 'date', 'display'),
    f('technician', 'Kỹ thuật viên', 'select', 'display', { options: STAFF }),
    f('appointment', 'Lịch hẹn', 'date', 'display'),
  ], ST.warranty[0], '/sofa2/warranty'),
  points: schema('giao dịch điểm', 'reason', ST.points, [
    f('customerId', 'Mã khách hàng', 'text', 'content', { required: true, placeholder: 'KH-1001' }),
    f('customer', 'Khách hàng', 'text', 'content', { required: true }),
    f('points', 'Điểm cộng / trừ', 'number', 'content', { required: true }),
    f('date', 'Ngày giao dịch', 'date', 'display'),
    f('expiry', 'Hạn dùng', 'date', 'display'),
    f('reason', 'Lý do điều chỉnh', 'textarea', 'seo', { helper: 'Bắt buộc ghi khi cộng/trừ điểm thủ công' }),
  ], ST.points[0], '/sofa2/points'),
  vouchers: schema('voucher', 'code', ST.voucher, [
    f('code', 'Mã voucher', 'text', 'content', { required: true, maxLength: 20, helper: 'Viết hoa, không dấu' }),
    f('customerId', 'Mã khách nhận', 'text', 'content', { placeholder: 'Tất cả thành viên hoặc mã KH-1001' }),
    f('customer', 'Khách nhận', 'text', 'content', { helper: 'Để trống hoặc “Tất cả thành viên” để phát hành chung.' }),
    f('campaign', 'Chiến dịch', 'select', 'content', { options: ['Chào mừng', 'Sinh nhật', 'VIP', 'Đổi điểm', 'Khách quay lại', 'Miễn phí vận chuyển', 'Tết', 'Mùa hè'] }),
    f('value', 'Giá trị giảm', 'text', 'content', { required: true, placeholder: '10% hoặc 500.000đ' }),
    f('minOrder', 'Đơn tối thiểu (đ)', 'number', 'content'),
    f('quantity', 'Số lượng phát hành', 'number', 'content'),
    f('pointsCost', 'Điểm cần để đổi', 'number', 'display'),
    f('startDate', 'Bắt đầu', 'date', 'display'),
    f('endDate', 'Hết hạn', 'date', 'display'),
  ], ST.voucher[1], '/sofa2/vouchers'),
  addresses: schema('địa chỉ giao hàng', 'addressId', ['Mặc định', 'Phụ', 'Đã xác minh', 'Ngoài vùng giao', 'Tạm ẩn'], [
    f('addressId', 'Mã địa chỉ', 'text', 'content', { required: true }),
    f('customerId', 'Mã khách hàng', 'text', 'content', { required: true }),
    f('customer', 'Khách hàng', 'text', 'content', { required: true }),
    f('label', 'Nhãn địa chỉ', 'text', 'content', { required: true, placeholder: 'Nhà / Văn phòng' }),
    f('recipient', 'Người nhận', 'text', 'content', { required: true }),
    f('phone', 'Điện thoại nhận hàng', 'text', 'content', { required: true }),
    f('address', 'Địa chỉ chi tiết', 'textarea', 'content', { required: true, multiline: 2 }),
    f('ward', 'Phường / xã', 'text', 'content'),
    f('district', 'Quận / huyện', 'text', 'content'),
    f('city', 'Tỉnh / thành phố', 'select', 'content', { options: CITIES }),
    f('zipCode', 'Mã bưu chính', 'text', 'content'),
    f('deliveryType', 'Hình thức giao', 'select', 'content', { options: ['Giao tận nhà', 'Giao giờ hành chính', 'Nhận tại cửa hàng'] }),
    f('deliveryNote', 'Ghi chú giao hàng', 'textarea', 'content', { multiline: 2 }),
    f('isDefault', 'Địa chỉ mặc định', 'switch', 'display'),
  ], 'Phụ', '/sofa2/addresses'),
  wishlist: schema('sản phẩm yêu thích', 'product', ['Đang lưu', 'Đã mua', 'Đã bỏ'], [
    f('customerId', 'Mã khách hàng', 'text', 'content', { required: true }),
    f('customer', 'Khách hàng', 'text', 'content', { required: true }),
    f('productId', 'Mã sản phẩm', 'text', 'content'),
    f('product', 'Sản phẩm', 'select', 'content', { required: true, options: CLIENT_PRODUCTS.map((product) => product.name) }),
    f('added', 'Ngày lưu', 'date', 'display'),
    f('notify', 'Thông báo giảm giá', 'select', 'display', { options: ['Có', 'Không'] }),
  ], 'Đang lưu', '/sofa2/wishlist'),
  transactions: schema('giao dịch thanh toán', 'txnId', ['Thành công', 'Đang xử lý', 'Thất bại', 'Hoàn tiền', 'Đã hoàn'], [
    f('txnId', 'Mã giao dịch', 'text', 'content', { required: true }),
    f('customerId', 'Mã khách hàng', 'text', 'content', { required: true }),
    f('customer', 'Khách hàng', 'text', 'content', { required: true }),
    f('order', 'Mã đơn hàng', 'text', 'content', { required: true }),
    f('method', 'Phương thức thanh toán', 'select', 'content', { required: true, options: PAYMENTS }),
    f('amount', 'Số tiền (₫)', 'number', 'content', { required: true }),
    f('date', 'Ngày giao dịch', 'date', 'display'),
    f('reference', 'Mã tham chiếu cổng thanh toán', 'text', 'display'),
    f('note', 'Ghi chú đối soát / hoàn tiền', 'textarea', 'display', { multiline: 2 }),
  ], 'Đang xử lý', '/sofa2/transactions'),
  registrations: schema('yêu cầu đăng ký tài khoản', 'requestId', ['Chờ xác minh', 'Đang xem xét', 'Đã duyệt', 'Từ chối', 'Đã huỷ'], [
    f('requestId', 'Mã yêu cầu', 'text', 'content', { required: true }),
    f('name', 'Họ tên', 'text', 'content', { required: true, maxLength: 80 }),
    f('email', 'Email', 'text', 'content', { required: true }),
    f('phone', 'Số điện thoại', 'text', 'content', { required: true }),
    f('customerId', 'Mã hồ sơ sau khi duyệt', 'text', 'display', { helper: 'Để trống khi chưa tạo hồ sơ.' }),
    f('source', 'Nguồn đăng ký', 'select', 'display', { options: ['Website', 'Landing page', 'Cửa hàng', 'Khác'] }),
    f('consent', 'Đồng ý điều khoản', 'switch', 'display'),
    f('createdAt', 'Ngày gửi', 'date', 'display'),
    f('reviewedBy', 'Người xét duyệt', 'text', 'display'),
    f('reviewedAt', 'Ngày xét duyệt', 'date', 'display'),
    f('note', 'Ghi chú xét duyệt', 'textarea', 'display', { multiline: 3 }),
  ], 'Chờ xác minh', '/sofa2/register'),
  'login-activity': schema('sự kiện đăng nhập', 'eventId', ['Demo', 'Cần rà soát', 'Đã lưu trữ'], [
    f('eventId', 'Mã sự kiện', 'text', 'content', { required: true }),
    f('email', 'Email đăng nhập', 'text', 'content', { required: true }),
    f('occurredAt', 'Thời gian', 'text', 'display'),
    f('result', 'Kết quả', 'text', 'display'),
    f('device', 'Thiết bị / trình duyệt', 'text', 'display'),
    f('ip', 'Địa chỉ IP', 'text', 'display'),
    f('note', 'Ghi chú an toàn', 'textarea', 'display', { multiline: 2 }),
  ], 'Demo', '/sofa2/login'),
  'password-resets': schema('yêu cầu đặt lại mật khẩu', 'requestId', ['Tiếp nhận', 'Đã gửi hướng dẫn', 'Hoàn tất', 'Hết hạn', 'Từ chối'], [
    f('requestId', 'Mã yêu cầu', 'text', 'content', { required: true }),
    f('email', 'Email tài khoản', 'text', 'content', { required: true }),
    f('requestedAt', 'Thời gian yêu cầu', 'text', 'display'),
    f('processedBy', 'Người xử lý', 'text', 'display'),
    f('note', 'Ghi chú xử lý', 'textarea', 'display', { multiline: 2, helper: 'Không lưu token đặt lại hoặc mật khẩu.' }),
  ], 'Tiếp nhận', '/sofa2/forgot-password'),
  complaints: schema('khiếu nại', 'code', ST.complaint, [
    f('code', 'Mã khiếu nại', 'text', 'content', { required: true }),
    f('customerId', 'Mã khách hàng', 'text', 'content', { required: true, placeholder: 'KH-1001' }),
    f('customer', 'Khách hàng', 'text', 'content', { required: true }),
    f('type', 'Loại vấn đề', 'select', 'content', { options: SOFA2_CUSTOMER_COMPLAINT_TYPES }),
    f('orderCode', 'Mã đơn liên quan', 'text', 'content'),
    f('subject', 'Tiêu đề', 'text', 'content', { required: true, maxLength: 120 }),
    f('content', 'Nội dung', 'textarea', 'content', { required: true }),
    f('created', 'Ngày tiếp nhận', 'date', 'display'),
    f('resolution', 'Hướng xử lý', 'textarea', 'content', ),
    f('priority', 'Ưu tiên', 'select', 'display', { options: ['Cao', 'Trung bình', 'Thấp'] }),
    f('owner', 'Người phụ trách', 'select', 'display', { options: STAFF }),
    f('deadline', 'Hạn xử lý', 'date', 'display'),
    f('compensate', 'Bồi thường bằng voucher', 'switch', 'display'),
  ], ST.complaint[0], '/sofa2/complaints'),
};

export function getSofa2CustomerSchema(moduleSlug?: string) {
  return moduleSlug ? SOFA2_CUSTOMER_SCHEMAS[moduleSlug] : undefined;
}
