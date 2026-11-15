import { Iconify } from 'src/components/iconify';

export type Sofa21Node = {
  title: string;
  path: string;
  icon?: string;
  children?: Sofa21Node[];
};

const node = (title: string, path: string, children?: Sofa21Node[]): Sofa21Node => ({
  title,
  path,
  children,
});
const list = (base: string, entries: [string, string][]): Sofa21Node[] =>
  entries.map(([title, slug]) => node(title, `${base}/${slug}`));

export const SOFA21_SITE_MAP: Sofa21Node[] = [
  {
    title: 'Giới thiệu',
    path: '/sofa21/about',
    icon: 'solar:info-circle-bold-duotone',
    children: [
      node('Giới thiệu công ty', '/sofa21/about'),
      ...list('/sofa21/about', [
        ['Lịch sử hình thành', 'history'],
        ['Tầm nhìn & sứ mệnh', 'vision'],
        ['Giá trị cốt lõi', 'values'],
        ['Nhà máy sản xuất', 'factory'],
        ['Quy trình sản xuất', 'process'],
        ['Công nghệ sản xuất', 'technology'],
        ['Chứng nhận chất lượng', 'certifications'],
        ['Đội ngũ nhân sự', 'team'],
        ['Đối tác', 'partners'],
        ['Hình ảnh công ty', 'gallery'],
        ['Video giới thiệu', 'video'],
      ]),
    ],
  },
  {
    title: 'Sản phẩm',
    path: '/sofa21/products',
    icon: 'solar:armchair-bold-duotone',
    children: [
      node('Danh mục', '/sofa21/products/category', [
        node(
          'Sofa phòng khách',
          '/sofa21/products/category/sofa-phong-khach',
          list('/sofa21/products/category', [
            ['Sofa góc chữ L', 'sofa-goc-chu-l'],
            ['Sofa chữ U', 'sofa-chu-u'],
            ['Sofa văng', 'sofa-vang'],
            ['Sofa đơn', 'sofa-don'],
            ['Sofa băng dài', 'sofa-bang-dai'],
            ['Sofa giường', 'sofa-giuong'],
            ['Sofa thông minh', 'sofa-thong-minh'],
            ['Sofa thư giãn', 'sofa-thu-gian'],
            ['Sofa recliner', 'sofa-recliner'],
            ['Sofa da', 'sofa-da'],
            ['Sofa nỉ', 'sofa-ni'],
            ['Sofa vải', 'sofa-vai'],
            ['Sofa gỗ', 'sofa-go'],
          ])
        ),
        node(
          'Theo phong cách',
          '/sofa21/products/category/style',
          list('/sofa21/products/category', [
            ['Hiện đại', 'hien-dai'],
            ['Tân cổ điển', 'tan-co-dien'],
            ['Bắc Âu', 'bac-au'],
            ['Luxury', 'luxury'],
            ['Minimalist', 'minimalist'],
            ['Indochine', 'indochine'],
            ['Châu Âu', 'chau-au'],
          ])
        ),
        node(
          'Theo không gian',
          '/sofa21/products/category/space',
          list('/sofa21/products/category', [
            ['Căn hộ', 'can-ho'],
            ['Nhà phố', 'nha-pho'],
            ['Biệt thự', 'biet-thu'],
            ['Văn phòng', 'van-phong'],
            ['Khách sạn', 'khach-san'],
            ['Resort', 'resort'],
            ['Nhà hàng', 'nha-hang'],
            ['Cafe', 'cafe'],
          ])
        ),
        node(
          'Theo kích thước',
          '/sofa21/products/category/size',
          list('/sofa21/products/category', [
            ['Sofa nhỏ', 'sofa-nho'],
            ['Sofa trung', 'sofa-trung'],
            ['Sofa lớn', 'sofa-lon'],
          ])
        ),
        node(
          'Theo giá',
          '/sofa21/products/category/price',
          list('/sofa21/products/category', [
            ['Dưới 10 triệu', 'duoi-10-trieu'],
            ['10-20 triệu', '10-20-trieu'],
            ['20-50 triệu', '20-50-trieu'],
            ['Trên 50 triệu', 'tren-50-trieu'],
          ])
        ),
      ]),
      node(
        'Chi tiết sản phẩm',
        '/sofa21/products/detail',
        list('/sofa21/products/detail', [
          ['Thông tin sản phẩm', 'information'],
          ['Hình ảnh 360°', '360-view'],
          ['Video sản phẩm', 'video'],
          ['Thông số kỹ thuật', 'specifications'],
          ['Chất liệu', 'materials'],
          ['Kích thước', 'dimensions'],
          ['Màu sắc', 'colors'],
          ['Tùy chọn cấu hình', 'configuration'],
          ['Hướng dẫn sử dụng', 'user-guide'],
          ['Hướng dẫn bảo quản', 'care-guide'],
          ['Sản phẩm liên quan', 'related'],
          ['Đánh giá khách hàng', 'reviews'],
          ['Hỏi đáp sản phẩm', 'questions'],
        ])
      ),
      node(
        'Bộ sưu tập',
        '/sofa21/collections',
        list('/sofa21/collections', [
          ['Bộ sưu tập mới', 'new'],
          ['Bộ sưu tập nổi bật', 'featured'],
          ['Bộ sưu tập theo mùa', 'seasonal'],
          ['Bộ sưu tập Luxury', 'luxury'],
          ['Bộ sưu tập Bestseller', 'bestseller'],
        ])
      ),
    ],
  },
  {
    title: 'Dự án',
    path: '/sofa21/projects',
    icon: 'solar:buildings-bold-duotone',
    children: [
      node(
        'Portfolio',
        '/sofa21/projects/portfolio',
        list('/sofa21/projects/category', [
          ['Dự án căn hộ', 'apartment'],
          ['Dự án biệt thự', 'villa'],
          ['Dự án khách sạn', 'hotel'],
          ['Dự án resort', 'resort'],
          ['Dự án văn phòng', 'office'],
          ['Dự án showroom', 'showroom'],
        ])
      ),
      node(
        'Chi tiết dự án',
        '/sofa21/projects/detail',
        list('/sofa21/projects/detail', [
          ['Album ảnh', 'gallery'],
          ['Video', 'video'],
          ['Mô tả dự án', 'description'],
          ['Sản phẩm sử dụng', 'products'],
          ['Đánh giá khách hàng', 'reviews'],
        ])
      ),
    ],
  },
  {
    title: 'Showroom',
    path: '/sofa21/showrooms',
    icon: 'solar:map-point-bold-duotone',
    children: [
      ...list('/sofa21/showrooms', [
        ['Danh sách showroom', 'list'],
        ['Bản đồ showroom', 'map'],
        ['Chi tiết showroom', 'detail'],
        ['Lịch mở cửa', 'hours'],
        ['Hình ảnh showroom', 'gallery'],
        ['Đặt lịch tham quan', 'visit'],
        ['Đặt lịch tư vấn', 'consult'],
      ]),
    ],
  },
  {
    title: 'Dịch vụ',
    path: '/sofa21/services',
    icon: 'solar:settings-bold-duotone',
    children: [
      node(
        'Thiết kế nội thất',
        '/sofa21/services/design',
        list('/sofa21/services/design', [
          ['Thiết kế sofa theo yêu cầu', 'custom-sofa'],
          ['Thiết kế 3D', '3d-design'],
          ['Tư vấn bố trí nội thất', 'space-planning'],
        ])
      ),
      node(
        'Dịch vụ sản xuất',
        '/sofa21/services/production',
        list('/sofa21/services/production', [
          ['Gia công sofa', 'crafting'],
          ['Sofa OEM', 'oem'],
          ['Sofa ODM', 'odm'],
          ['Đặt hàng theo dự án', 'project-orders'],
        ])
      ),
    ],
  },
  {
    title: 'Blog',
    path: '/sofa21/blog',
    icon: 'solar:pen-bold-duotone',
    children: [
      node(
        'Chuyên mục',
        '/sofa21/blog/categories',
        list('/sofa21/blog/category', [
          ['Tin công ty', 'company-news'],
          ['Tin khuyến mãi', 'promotions'],
          ['Kinh nghiệm chọn sofa', 'choosing-sofa'],
          ['Xu hướng nội thất', 'interior-trends'],
          ['Kiến thức vật liệu', 'materials'],
          ['Phong thủy nội thất', 'feng-shui'],
          ['Hướng dẫn vệ sinh sofa', 'cleaning-guide'],
          ['Hướng dẫn bảo quản', 'care-guide'],
          ['Thiết kế phòng khách', 'living-room-design'],
        ])
      ),
      node(
        'Chi tiết bài viết',
        '/sofa21/blog/article',
        list('/sofa21/blog/article', [
          ['Bài viết', 'content'],
          ['Tác giả', 'author'],
          ['Bình luận', 'comments'],
          ['Chia sẻ mạng xã hội', 'share'],
        ])
      ),
    ],
  },
  {
    title: 'Khuyến mãi / Hậu mãi',
    path: '/sofa21/promotions',
    icon: 'solar:gift-bold-duotone',
    children: list('/sofa21/promotions', [
      ['Bảo hành', 'warranty'],
      ['Bảo trì', 'maintenance'],
      ['Sửa chữa', 'repair'],
      ['Vệ sinh sofa', 'cleaning'],
      ['Đổi trả hàng', 'returns'],
    ]),
  },
  {
    title: 'Tuyển dụng',
    path: '/sofa21/careers',
    icon: 'solar:case-bold-duotone',
    children: list('/sofa21/careers', [
      ['Danh sách tuyển dụng', 'openings'],
      ['Chi tiết vị trí', 'position'],
      ['Nộp CV', 'apply'],
      ['Hồ sơ ứng viên', 'profile'],
      ['Theo dõi tuyển dụng', 'tracking'],
    ]),
  },
  { title: 'Liên hệ', path: '/sofa21/contact', icon: 'solar:phone-bold-duotone' },
  {
    title: 'Tài khoản khách hàng',
    path: '/sofa21/account',
    icon: 'solar:user-bold-duotone',
    children: list('/sofa21/account', [
      ['Đăng ký', 'register'],
      ['Đăng nhập', 'login'],
      ['Quên mật khẩu', 'forgot-password'],
      ['Hồ sơ cá nhân', 'profile'],
      ['Địa chỉ giao hàng', 'addresses'],
      ['Đơn hàng của tôi', 'orders'],
      ['Yêu thích', 'wishlist'],
      ['Lịch sử giao dịch', 'history'],
      ['Phiếu bảo hành', 'warranty'],
    ]),
  },
  {
    title: 'Đại lý B2B',
    path: '/sofa21/b2b',
    icon: 'solar:hand-shake-bold-duotone',
    children: list('/sofa21/b2b', [
      ['Giới thiệu hợp tác', 'partnership'],
      ['Đại lý phân phối', 'distributor'],
      ['Nhà phân phối', 'wholesale'],
      ['Đăng ký đại lý', 'register'],
      ['Báo giá dự án', 'quote'],
      ['Yêu cầu sản xuất OEM', 'oem'],
      ['Đối tác thi công', 'contractor'],
      ['Chính sách đại lý', 'policy'],
    ]),
  },
  {
    title: 'Giỏ hàng',
    path: '/sofa21/cart',
    icon: 'solar:cart-large-2-bold-duotone',
    children: [
      node('Giỏ hàng', '/sofa21/cart/items'),
      node('Thanh toán', '/sofa21/checkout'),
      node('Thanh toán thành công', '/sofa21/checkout/success'),
      node('Theo dõi đơn hàng', '/sofa21/orders/tracking'),
      node('Tài khoản khách hàng', '/sofa21/account'),
      node('Hồ sơ cá nhân', '/sofa21/account/profile'),
      node('Địa chỉ giao hàng', '/sofa21/account/addresses'),
      node('Đơn hàng của tôi', '/sofa21/account/orders'),
      node('Yêu thích', '/sofa21/account/wishlist'),
      node('Lịch sử giao dịch', '/sofa21/account/history'),
      node('Phiếu bảo hành', '/sofa21/account/warranty'),
    ],
  },
  {
    title: 'Mua hàng',
    path: '/sofa21/shop',
    icon: 'solar:bag-bold-duotone',
    children: list('/sofa21', [
      ['Danh sách sản phẩm', 'products'],
      ['Tìm kiếm sản phẩm', 'search'],
      ['So sánh sản phẩm', 'compare'],
      ['Wishlist', 'account/wishlist'],
      ['Giỏ hàng', 'cart'],
      ['Thanh toán', 'checkout'],
      ['Thanh toán thành công', 'checkout/success'],
      ['Theo dõi đơn hàng', 'orders/tracking'],
    ]),
  },
  {
    title: 'Hỗ trợ',
    path: '/sofa21/support',
    icon: 'solar:question-circle-bold-duotone',
    children: list('/sofa21/support', [
      ['FAQ', 'faq'],
      ['Trung tâm trợ giúp', 'center'],
      ['Chat trực tuyến', 'chat'],
      ['Gửi ticket hỗ trợ', 'ticket'],
      ['Hướng dẫn mua hàng', 'buying-guide'],
      ['Hướng dẫn thanh toán', 'payment-guide'],
      ['Chính sách giao hàng', 'shipping-policy'],
      ['Chính sách bảo hành', 'warranty-policy'],
      ['Chính sách đổi trả', 'returns-policy'],
    ]),
  },
  {
    title: 'Khu vực thành viên',
    path: '/sofa21/member',
    icon: 'solar:users-group-rounded-bold-duotone',
    children: [
      node(
        'Khách hàng',
        '/sofa21/member/customer',
        list('/sofa21/member/customer', [
          ['Dashboard', 'dashboard'],
          ['Hồ sơ', 'profile'],
          ['Đơn hàng', 'orders'],
          ['Phiếu bảo hành', 'warranty'],
          ['Điểm tích lũy', 'points'],
          ['Voucher', 'vouchers'],
          ['Khiếu nại', 'complaints'],
        ])
      ),
      node(
        'Đại lý',
        '/sofa21/member/dealer',
        list('/sofa21/member/dealer', [
          ['Dashboard đại lý', 'dashboard'],
          ['Chính sách giá', 'pricing'],
          ['Báo giá', 'quotes'],
          ['Đơn hàng đại lý', 'orders'],
          ['Công nợ', 'debt'],
          ['Tài liệu bán hàng', 'sales-materials'],
        ])
      ),
    ],
  },
];

export const sofa21PagesNavData = [
  {
    title: 'Trang chủ',
    path: '/sofa21',
    icon: <Iconify width={22} icon="solar:home-2-bold-duotone" />,
  },
  ...SOFA21_SITE_MAP.map((item) => ({
    title: item.title,
    path: item.path,
    icon: <Iconify width={22} icon={item.icon || 'solar:folder-bold-duotone'} />,
    ...(item.children ? { children: item.children.map(toNavItem) } : {}),
  })),
];

function toNavItem(item: Sofa21Node): any {
  return {
    title: item.title,
    path: item.path,
    ...(item.children?.length ? { children: item.children.map(toNavItem) } : {}),
  };
}

export const sofa21NavData = [
  {
    title: 'Trang chủ',
    path: '/sofa21',
    icon: <Iconify width={22} icon="solar:home-2-bold-duotone" />,
  },
  {
    title: 'Sản phẩm',
    path: '/sofa21/products',
    icon: <Iconify width={22} icon="solar:armchair-bold-duotone" />,
  },
  {
    title: 'Bộ sưu tập',
    path: '/sofa21/collections',
    icon: <Iconify width={22} icon="solar:layers-bold-duotone" />,
  },
  {
    title: 'Dự án',
    path: '/sofa21/projects',
    icon: <Iconify width={22} icon="solar:buildings-bold-duotone" />,
  },
  {
    title: 'Showroom',
    path: '/sofa21/showrooms',
    icon: <Iconify width={22} icon="solar:map-point-bold-duotone" />,
  },
  {
    title: 'Giới thiệu',
    path: '/sofa21/about',
    icon: <Iconify width={22} icon="solar:info-circle-bold-duotone" />,
  },
  {
    title: 'Liên hệ',
    path: '/sofa21/contact',
    icon: <Iconify width={22} icon="solar:phone-bold-duotone" />,
  },
];
