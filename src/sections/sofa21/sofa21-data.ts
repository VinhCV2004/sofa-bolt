// SOFA21 — contemporary Vietnamese living: cobalt, persimmon, butter yellow and warm paper.
export const SOFA21_COLORS = {
  ink: '#191B2B',
  inkSoft: '#656779',
  midnight: '#20213B',
  cobalt: '#4D5FEA',
  cobaltDeep: '#3545C7',
  periwinkle: '#DDE2FF',
  persimmon: '#F07858',
  persimmonDeep: '#D95D40',
  butter: '#F4D36F',
  // Compatibility aliases used by the existing shared page components.
  forest: '#4D5FEA',
  forestDeep: '#20213B',
  lime: '#F4D36F',
  clay: '#F07858',
  sage: '#DDE2FF',
  cream: '#F8F5EF',
  paper: '#FFFEFB',
  line: 'rgba(25,27,43,.12)',
};

export const SOFA21_IMAGES = {
  hero: 'https://images.pexels.com/photos/4846097/pexels-photo-4846097.jpeg?auto=compress&cs=tinysrgb&w=1920',
  living:
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
  sofa: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1000',
  room: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1000',
  detail:
    'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1000',
  factory:
    'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=1200',
  interior:
    'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=1100',
  interior2:
    'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1100',
  project:
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200',
  journal:
    'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=900',
};

export const SOFA21_PRODUCTS = [
  {
    name: 'Mây — Góc chữ L',
    category: 'Sofa góc · 4 chỗ',
    price: '24.900.000₫',
    image: SOFA21_IMAGES.sofa,
    tag: 'Bán chạy',
    swatches: ['#C8B49B', '#777B83', '#4B554B'],
  },
  {
    name: 'Nếp — Văng 3 chỗ',
    category: 'Sofa văng · 3 chỗ',
    price: '18.500.000₫',
    image: SOFA21_IMAGES.living,
    tag: 'Mẫu mới',
    swatches: ['#D8C5AB', '#9B7F6A', '#B9BFC5'],
  },
  {
    name: 'An — Ghế thư giãn',
    category: 'Armchair · 1 chỗ',
    price: '12.800.000₫',
    image: SOFA21_IMAGES.detail,
    tag: 'Đặt theo màu',
    swatches: ['#B9745A', '#D5CDAF', '#656C85'],
  },
];

export const SOFA21_CATEGORIES = [
  {
    title: 'Sofa góc',
    subtitle: 'Thêm chỗ cho những cuộc trò chuyện dài',
    image: SOFA21_IMAGES.sofa,
    href: '/sofa21/products/category/sofa-goc-chu-l',
    number: '01',
  },
  {
    title: 'Sofa văng',
    subtitle: 'Gọn gàng, linh hoạt, luôn hợp gu',
    image: SOFA21_IMAGES.living,
    href: '/sofa21/products/category/sofa-vang',
    number: '02',
  },
  {
    title: 'Sofa thư giãn',
    subtitle: 'Góc riêng để chậm lại một chút',
    image: SOFA21_IMAGES.detail,
    href: '/sofa21/products/category/sofa-thu-gian',
    number: '03',
  },
  {
    title: 'Sofa giường',
    subtitle: 'Một thiết kế, thêm nhiều công năng',
    image: SOFA21_IMAGES.room,
    href: '/sofa21/products/category/sofa-giuong',
    number: '04',
  },
];

export const SOFA21_STORIES = [
  {
    category: 'GÓC NHÀ ĐẸP',
    title: 'Căn hộ 68m² và chiếc sofa làm căn phòng rộng hơn',
    image: SOFA21_IMAGES.interior,
    href: '/sofa21/blog/category/interior-trends',
  },
  {
    category: 'CHẤT LIỆU',
    title: 'Chọn vải bọc sofa: đẹp thôi chưa đủ',
    image: SOFA21_IMAGES.journal,
    href: '/sofa21/blog/category/materials',
  },
  {
    category: 'CẢM HỨNG',
    title: 'Bảng màu ấm cho những ngày muốn ở nhà',
    image: SOFA21_IMAGES.project,
    href: '/sofa21/blog/category/living-room-design',
  },
];
