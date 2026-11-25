// SOFA21 — European / American atelier: quiet luxury, warm neutrals, olive and aged brass.
export const SOFA21_COLORS = {
  ink: '#292821',
  inkSoft: '#77756E',
  midnight: '#302F29',
  cobalt: '#737965',
  cobaltDeep: '#555B49',
  periwinkle: '#E9E6DE',
  persimmon: '#A96D53',
  persimmonDeep: '#80513D',
  butter: '#C4A36A',
  forest: '#737965',
  forestDeep: '#302F29',
  lime: '#C4A36A',
  clay: '#A96D53',
  sage: '#E9E6DE',
  cream: '#F3F0E9',
  paper: '#FDFBF7',
  line: 'rgba(41,40,33,.14)',
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
    category: 'SOFA GÓC · 4 CHỖ',
    price: '24.900.000₫',
    image: SOFA21_IMAGES.sofa,
    tag: 'Được yêu thích',
    swatches: ['#C8B49B', '#777B83', '#4B554B'],
  },
  {
    name: 'Nếp — Văng 3 chỗ',
    category: 'SOFA VĂNG · 3 CHỖ',
    price: '18.500.000₫',
    image: SOFA21_IMAGES.living,
    tag: 'Thiết kế mới',
    swatches: ['#D8C5AB', '#9B7F6A', '#B9BFC5'],
  },
  {
    name: 'An — Ghế thư giãn',
    category: 'GHẾ THƯ GIÃN · 1 CHỖ',
    price: '12.800.000₫',
    image: SOFA21_IMAGES.detail,
    tag: 'Tùy chỉnh riêng',
    swatches: ['#B9745A', '#D5CDAF', '#656C85'],
  },
];

export const SOFA21_CATEGORIES = [
  {
    title: 'Sofa góc',
    subtitle: 'Rộng rãi để sum vầy, thư thái mỗi ngày',
    image: SOFA21_IMAGES.sofa,
    href: '/sofa21/products/category/sofa-goc-chu-l',
    number: '01',
  },
  {
    title: 'Sofa văng',
    subtitle: 'Đường nét thanh lịch, linh hoạt với không gian',
    image: SOFA21_IMAGES.living,
    href: '/sofa21/products/category/sofa-vang',
    number: '02',
  },
  {
    title: 'Sofa thư giãn',
    subtitle: 'Một góc riêng để nghỉ ngơi và tái tạo năng lượng',
    image: SOFA21_IMAGES.detail,
    href: '/sofa21/products/category/sofa-thu-gian',
    number: '03',
  },
  {
    title: 'Sofa giường',
    subtitle: 'Công năng tinh gọn cho ngôi nhà hiện đại',
    image: SOFA21_IMAGES.room,
    href: '/sofa21/products/category/sofa-giuong',
    number: '04',
  },
];

export const SOFA21_STORIES = [
  {
    category: 'KHÔNG GIAN SỐNG',
    title: 'Căn hộ thành thị với điểm nhấn mang dấu ấn riêng',
    image: SOFA21_IMAGES.interior,
    href: '/sofa21/blog/category/interior-trends',
  },
  {
    category: 'CẨM NANG CHẤT LIỆU',
    title: 'Chọn chất liệu bọc sofa theo cách bạn sống',
    image: SOFA21_IMAGES.journal,
    href: '/sofa21/blog/category/materials',
  },
  {
    category: 'CẢM HỨNG THIẾT KẾ',
    title: 'Bảng màu trung tính ấm áp cho phòng khách',
    image: SOFA21_IMAGES.project,
    href: '/sofa21/blog/category/living-room-design',
  },
];
