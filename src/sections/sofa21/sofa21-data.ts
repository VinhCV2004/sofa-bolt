// SOFA21 — quiet luxury with warm neutrals, olive and aged brass.
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

export type Sofa21Product = {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: string;
  priceValue: number;
  image: string;
  tag: string;
  swatches: string[];
  styles: string[];
  spaces: string[];
  size: 'small' | 'medium' | 'large';
  dimensions: string;
  material: string;
  description: string;
  highlights: string[];
};

export const SOFA21_PRODUCTS: Sofa21Product[] = [
  {
    slug: 'may-sofa-goc-chu-l',
    name: 'Mây — Góc chữ L',
    category: 'SOFA GÓC · 4 CHỖ',
    categorySlug: 'goc',
    price: '24.900.000₫',
    priceValue: 24900000,
    image: SOFA21_IMAGES.sofa,
    tag: 'Được yêu thích',
    swatches: ['#C8B49B', '#777B83', '#4B554B'],
    styles: ['Hiện đại', 'Bắc Âu'],
    spaces: ['Căn hộ', 'Nhà phố'],
    size: 'large',
    dimensions: '280 × 165 × 82 cm',
    material: 'Vải dệt kháng bám bẩn, khung gỗ tự nhiên',
    description: 'Thiết kế góc chữ L rộng rãi, phù hợp cho những buổi sum họp và phòng khách gia đình.',
    highlights: ['Đổi chiều góc theo mặt bằng', 'Đệm ngồi nhiều lớp', 'Có thể chọn màu vải'],
  },
  {
    slug: 'nep-sofa-vang-3-cho',
    name: 'Nếp — Văng 3 chỗ',
    category: 'SOFA VĂNG · 3 CHỖ',
    categorySlug: 'vang',
    price: '18.500.000₫',
    priceValue: 18500000,
    image: SOFA21_IMAGES.living,
    tag: 'Thiết kế mới',
    swatches: ['#D8C5AB', '#9B7F6A', '#B9BFC5'],
    styles: ['Minimalist', 'Bắc Âu'],
    spaces: ['Căn hộ', 'Nhà phố', 'Văn phòng'],
    size: 'medium',
    dimensions: '218 × 90 × 82 cm',
    material: 'Vải bouclé, khung gỗ sấy',
    description: 'Phom dáng thanh thoát giúp tối ưu diện tích mà vẫn đủ chỗ cho gia đình và khách ghé chơi.',
    highlights: ['Phom gọn cho không gian vừa', 'Vỏ bọc dễ vệ sinh', 'Nhiều lựa chọn màu'],
  },
  {
    slug: 'an-ghe-thu-gian',
    name: 'An — Ghế thư giãn',
    category: 'GHẾ THƯ GIÃN · 1 CHỖ',
    categorySlug: 'thu-gian',
    price: '12.800.000₫',
    priceValue: 12800000,
    image: SOFA21_IMAGES.detail,
    tag: 'Tùy chỉnh riêng',
    swatches: ['#B9745A', '#D5CDAF', '#656C85'],
    styles: ['Hiện đại', 'Luxury'],
    spaces: ['Căn hộ', 'Nhà phố', 'Biệt thự'],
    size: 'small',
    dimensions: '92 × 96 × 88 cm',
    material: 'Da công nghiệp cao cấp, chân kim loại sơn tĩnh điện',
    description: 'Một chỗ ngồi thư thái cho góc đọc sách, phòng ngủ hoặc điểm nhấn riêng trong phòng khách.',
    highlights: ['Đệm tựa ôm lưng', 'Kích thước linh hoạt', 'Có thể phối cùng sofa văng'],
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
