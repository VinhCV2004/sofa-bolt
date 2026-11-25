import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react';
import {
  SOFA21_CATEGORIES,
  SOFA21_IMAGES,
  SOFA21_PRODUCTS,
  SOFA21_STORIES,
} from './_sofa21-data';
import './_group.css';

const reasons = [
  {
    number: '01',
    title: 'Ngồi là thấy khác',
    text: 'Tầng đệm nhiều lớp nâng đỡ êm mà không lún sâu — dễ chịu từ lần ngồi thử đầu tiên.',
  },
  {
    number: '02',
    title: 'Đo ni đóng giày',
    text: 'Chọn chiều dài, kiểu góc, màu vải và chi tiết chân ghế theo đúng căn phòng của bạn.',
  },
  {
    number: '03',
    title: 'Dùng lâu, chăm dễ',
    text: 'Vật liệu được chọn theo sinh hoạt thực tế, có hướng dẫn vệ sinh và hậu mãi rõ ràng.',
  },
];

const stages = [
  ['01', 'Lắng nghe', 'Nhà bạn thế nào? Ai sẽ dùng sofa mỗi ngày?'],
  ['02', 'Phác thảo', 'Chốt kích thước, kiểu dáng và bảng màu.'],
  ['03', 'Chế tác', 'Thợ lành nghề hoàn thiện từng chi tiết.'],
  ['04', 'Bàn giao', 'Giao lắp gọn gàng, hướng dẫn chăm sóc tận tay.'],
];

const faqs = [
  [
    'Có thể đặt sofa theo kích thước riêng không?',
    'Có. Đội ngũ tư vấn sẽ xem mặt bằng và đề xuất kích thước, cấu hình phù hợp trước khi xác nhận đơn.',
  ],
  [
    'Làm sao chọn được chất liệu bọc phù hợp?',
    'Bạn có thể so sánh mẫu vải, da tại showroom hoặc nhận tư vấn dựa trên tần suất sử dụng, trẻ nhỏ và thú cưng trong nhà.',
  ],
  [
    'Sofa được giao và lắp đặt như thế nào?',
    'Nhân viên liên hệ hẹn khung giờ, vận chuyển và lắp đặt tại nhà; sau đó hướng dẫn bạn sử dụng và chăm sóc sản phẩm.',
  ],
];

const navItems = [
  { label: 'Sofa', href: '/sofa21/products', chevron: true },
  { label: 'Không gian', href: '/sofa21/projects' },
  { label: 'Showroom', href: '/sofa21/showrooms/visit' },
  { label: 'Dịch vụ', href: '/sofa21/services' },
  { label: 'Tạp chí', href: '/sofa21/blog' },
];

const ArrowLink = ({
  href,
  children,
  dark = false,
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <a
    href={href}
    className={`group inline-flex items-center gap-3 border-b pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
      dark
        ? 'border-[#c9a56d]/60 text-[#f1e8d8] hover:text-[#d7b778]'
        : 'border-[#a3634d]/45 text-[#344036] hover:text-[#a3634d]'
    }`}
  >
    {children}
    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  </a>
);

export function Sofa21Redesign() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-[#f5f1e8] text-[#292c24] antialiased">
      <style>{`
        @keyframes sofa21-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sofa21-rise { animation: sofa21-rise .75s cubic-bezier(.2,.7,.25,1) both; }
        .sofa21-rise-delay { animation-delay: .13s; }
        .sofa21-rise-late { animation-delay: .24s; }
        .sofa21-image { transition: transform .8s cubic-bezier(.2,.7,.25,1); }
        .sofa21-image-wrap:hover .sofa21-image { transform: scale(1.035); }
        @media (prefers-reduced-motion: reduce) {
          .sofa21-rise, .sofa21-image { animation: none; transition: none; }
        }
      `}</style>

      <div className="flex items-center justify-center gap-3 bg-[#30392e] px-4 py-2 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-[#eee5d4] sm:text-[10px]">
        <span className="hidden h-px w-7 bg-[#c6a16a] sm:block" />
        Một nơi, để trở về
        <span className="text-[#c6a16a]">·</span>
        <a href="/sofa21/showrooms/visit" className="underline decoration-[#c6a16a]/70 underline-offset-4 hover:text-white">
          Ghé thăm showroom
        </a>
        <span className="hidden h-px w-7 bg-[#c6a16a] sm:block" />
      </div>

      <header className="relative z-30 border-b border-[#34392e]/10 bg-[#f5f1e8]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10 lg:px-14">
          <a href="/sofa21" className="flex items-center gap-3" aria-label="Sofa21 — Trang chủ">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#a3634d]/40 font-serif text-[17px] leading-none text-[#a3634d]">
              s.
            </span>
            <span className="leading-none">
              <span className="block font-serif text-[21px] tracking-[0.04em]">SOFA21</span>
              <span className="mt-1 block text-[8px] uppercase tracking-[0.27em] text-[#74756b]">
                Furniture atelier
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Điều hướng chính">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group inline-flex items-center gap-1 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[#45483d] transition-colors hover:text-[#a3634d]"
              >
                {item.label}
                {item.chevron && <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover:translate-y-0.5" />}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 text-[#41453a] md:flex">
            <a href="/sofa21/products" aria-label="Tìm kiếm sofa" className="transition-colors hover:text-[#a3634d]">
              <Search className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </a>
            <a href="/sofa21/account" aria-label="Tài khoản khách hàng" className="transition-colors hover:text-[#a3634d]">
              <UserRound className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </a>
            <a href="/sofa21/cart" aria-label="Giỏ hàng" className="transition-colors hover:text-[#a3634d]">
              <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </a>
            <a
              href="/sofa21/showrooms/visit"
              className="ml-1 hidden border border-[#727866] px-4 py-[11px] text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-[#30392e] hover:text-[#f5f1e8] xl:block"
            >
              Đặt lịch ghé thăm
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            className="grid h-10 w-10 place-items-center border border-[#34392e]/15 text-[#30392e] md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute left-0 right-0 top-full z-40 border-t border-[#34392e]/10 bg-[#f5f1e8] px-6 pb-7 pt-3 shadow-[0_18px_35px_rgba(37,39,31,.12)] md:hidden">
            <nav className="flex flex-col" aria-label="Điều hướng di động">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-[#34392e]/10 py-4 font-serif text-[21px]"
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4 text-[#a3634d]" />
                </a>
              ))}
              <div className="flex gap-6 pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#67695f]">
                <a href="/sofa21/support">Hỗ trợ</a>
                <a href="/sofa21/account">Tài khoản</a>
                <a href="/sofa21/b2b/dealers">Đối tác</a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[650px] max-w-[1600px] grid-cols-1 lg:min-h-[690px] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative z-10 flex items-center px-6 py-16 sm:px-10 lg:px-14 xl:px-20">
            <div className="max-w-[570px]">
              <p className="sofa21-rise flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#a3634d]">
                <span className="h-px w-8 bg-[#a3634d]" />
                SOFA21 ATELIER · NỘI THẤT ĐƯƠNG ĐẠI
              </p>
              <h1 className="sofa21-rise sofa21-rise-delay mt-7 font-serif text-[clamp(3.35rem,7.6vw,6.6rem)] leading-[.93] tracking-[-.055em] text-[#30392e]">
                Một nơi,
                <br />
                <em className="font-normal text-[#a3634d]">để trở về.</em>
              </h1>
              <p className="sofa21-rise sofa21-rise-late mt-7 max-w-[430px] text-[14px] leading-[1.9] text-[#66685e] sm:text-[15px]">
                Phom dáng vượt thời gian, vật liệu được tuyển chọn và sự thoải mái tinh tế — được tạo nên để thuộc về không gian của bạn.
              </p>
              <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <a
                  href="/sofa21/products"
                  className="group inline-flex items-center gap-5 bg-[#a3634d] px-6 py-[17px] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fffaf1] transition-colors hover:bg-[#804b3a]"
                >
                  Tìm chiếc sofa của bạn
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a href="/sofa21/showrooms/visit" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#40463a] transition-colors hover:text-[#a3634d]">
                  Đến showroom <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="mt-14 flex items-center gap-4 text-[9px] uppercase tracking-[0.16em] text-[#77786e]">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-[#b1a68f]">
                  <ArrowDown className="h-3.5 w-3.5" />
                </span>
                Kéo xuống để khám phá
              </div>
            </div>
          </div>
          <div className="sofa21-image-wrap relative min-h-[390px] overflow-hidden bg-[#d6cbb9] lg:min-h-0">
            <img
              className="sofa21-image absolute inset-0 h-full w-full object-cover object-center"
              src={SOFA21_IMAGES.hero}
              alt="Không gian phòng khách với sofa ấm áp"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#20271d]/35 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.18em] text-white sm:bottom-9 sm:left-9">
              <span className="h-px w-7 bg-[#d0ad74]" />
              Sống chậm, sống có chủ đích
            </div>
            <div className="absolute bottom-0 right-0 hidden h-[110px] w-[110px] translate-x-1/3 translate-y-1/3 rounded-full border border-[#e4d5b7]/60 lg:block" />
          </div>
        </section>

        <section className="border-y border-[#4f5548]/10 bg-[#e9e4d8]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-[#4f5548]/15 px-5 py-5 sm:grid-cols-4 sm:px-10 lg:px-14">
            {[
              ['01', 'Chọn phom dáng'],
              ['02', 'Tuyển chọn vật liệu'],
              ['03', 'Cá nhân hóa'],
              ['04', 'Chăm sóc sau mua'],
            ].map(([n, title]) => (
              <div key={n} className="flex items-center gap-3 px-3 py-2 first:pl-0 sm:px-5 lg:px-8">
                <span className="font-serif text-[13px] italic text-[#a3634d]">{n}</span>
                <span className="text-[8px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-[#565a4e] sm:text-[9px]">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-20 sm:px-10 sm:py-28 lg:px-14 lg:py-32">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[710px]">
                <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a3634d]">Chọn theo cách bạn sống</p>
                <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] tracking-[-.045em] text-[#30392e]">
                  Đường nét chuẩn mực.
                  <br />
                  <em className="font-normal text-[#a3634d]">Cảm giác riêng biệt.</em>
                </h2>
                <p className="mt-5 max-w-[510px] text-[13px] leading-[1.85] text-[#6b6c62]">
                  Từ những buổi tụ họp đông vui đến một góc đọc sách thật riêng — bắt đầu từ nhu cầu của bạn.
                </p>
              </div>
              <ArrowLink href="/sofa21/products">Khám phá mọi kiểu dáng</ArrowLink>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
              {SOFA21_CATEGORIES.map((category, index) => (
                <a
                  key={category.number}
                  href={category.href}
                  className={`sofa21-image-wrap group relative block min-h-[320px] overflow-hidden bg-[#b9b09f] md:min-h-[390px] ${
                    index === 0 ? 'md:col-span-7' : index === 1 ? 'md:col-span-5' : index === 2 ? 'md:col-span-5' : 'md:col-span-7'
                  }`}
                >
                  <img className="sofa21-image absolute inset-0 h-full w-full object-cover" src={category.image} alt={category.title} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#20261f]/75 via-[#20261f]/5 to-[#20261f]/10 transition-opacity group-hover:from-[#20261f]/85" />
                  <span className="absolute left-6 top-6 text-[9px] font-medium tracking-[0.2em] text-white/75">{category.number} / SOFA21 EDIT</span>
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
                    <div>
                      <h3 className="font-serif text-[34px] leading-tight tracking-[-.03em] text-white sm:text-[42px]">{category.title}</h3>
                      <p className="mt-2 max-w-[370px] text-[11px] leading-relaxed text-white/75 sm:text-[12px]">{category.subtitle}</p>
                    </div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eee5d4] text-[#33392f] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                      <ArrowUpRight className="h-[18px] w-[18px]" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#ebe6dc] px-5 py-20 sm:px-10 sm:py-28 lg:px-14">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
              <div>
                <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a3634d]">SOFA21 SELECTED</p>
                <h2 className="font-serif text-[clamp(2.6rem,5vw,4.5rem)] leading-[1.03] tracking-[-.045em] text-[#30392e]">
                  Những thiết kế
                  <br className="hidden sm:block" /> vượt thời gian.
                </h2>
              </div>
              <div className="flex max-w-[560px] flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-[340px] text-[12px] leading-[1.85] text-[#6b6c62]">
                  Được yêu thích bởi phom dáng, cảm giác ngồi và những lựa chọn cá nhân hóa.
                </p>
                <ArrowLink href="/sofa21/products">Xem bộ sưu tập</ArrowLink>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7">
              {SOFA21_PRODUCTS.map((product, index) => (
                <a key={product.name} href="/sofa21/products" className={`group ${index === 1 ? 'sm:translate-y-8 lg:translate-y-10' : ''}`}>
                  <div className="sofa21-image-wrap relative aspect-[.91] overflow-hidden bg-[#d7d0c3]">
                    <img className="sofa21-image absolute inset-0 h-full w-full object-cover" src={product.image} alt={product.name} loading="lazy" />
                    <span className="absolute left-4 top-4 bg-[#f5f1e8] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.13em] text-[#53584b]">
                      {product.tag}
                    </span>
                    <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-[#f5f1e8] text-[#353b31] transition-colors group-hover:bg-[#a3634d] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="pt-5">
                    <p className="text-[8px] font-semibold tracking-[0.16em] text-[#858579]">{product.category}</p>
                    <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-serif text-[25px] leading-tight tracking-[-.02em] text-[#30392e]">{product.name}</h3>
                      <span className="pt-1 text-[11px] font-medium text-[#8f5b45]">{product.price}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {product.swatches.map((color) => (
                        <span key={color} className="h-[13px] w-[13px] rounded-full border border-black/10" style={{ backgroundColor: color }} />
                      ))}
                      <span className="ml-1 text-[9px] text-[#77786e]">Màu vải tham khảo</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-10 sm:py-28 lg:px-14 lg:py-32">
          <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
            <div>
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a3634d]">Thiết kế có lý do</p>
              <h2 className="font-serif text-[clamp(2.7rem,5vw,4.6rem)] leading-[1.02] tracking-[-.05em] text-[#30392e]">
                Tỉ mỉ trong từng nét.
                <br />
                <em className="font-normal text-[#a3634d]">Thoải mái qua năm tháng.</em>
              </h2>
              <p className="mt-6 max-w-[440px] text-[13px] leading-[1.9] text-[#6b6c62]">
                Mỗi chi tiết bắt đầu từ một câu hỏi đơn giản: điều gì sẽ khiến căn phòng dễ sống hơn?
              </p>
              <div className="mt-7">
                <ArrowLink href="/sofa21/about">Tìm hiểu về Sofa21</ArrowLink>
              </div>
              <div className="mt-12 border-t border-[#4f5548]/15">
                {reasons.map((reason) => (
                  <div key={reason.number} className="grid grid-cols-[42px_1fr] gap-3 border-b border-[#4f5548]/15 py-5 sm:grid-cols-[52px_1fr] sm:gap-5">
                    <span className="font-serif text-[14px] italic text-[#a3634d]">{reason.number}</span>
                    <div>
                      <h3 className="font-serif text-[20px] text-[#30392e]">{reason.title}</h3>
                      <p className="mt-1.5 max-w-[500px] text-[11px] leading-[1.8] text-[#73746a]">{reason.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sofa21-image-wrap relative min-h-[460px] overflow-hidden bg-[#d3c7b6] sm:min-h-[620px]">
              <img className="sofa21-image absolute inset-0 h-full w-full object-cover" src={SOFA21_IMAGES.factory} alt="Bàn tay người thợ đang hoàn thiện nội thất" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#21271e]/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 max-w-[280px] border-l border-[#d4b37b] pl-4 text-white sm:bottom-9 sm:left-9">
                <p className="font-serif text-[24px] leading-tight">Một chiếc sofa bắt đầu từ những điều nhỏ.</p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-white/70">Từ bản phác thảo đến căn phòng của bạn</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#30392e] px-5 py-20 text-[#f3eddf] sm:px-10 sm:py-24 lg:px-14">
          <div className="pointer-events-none absolute -right-24 top-1/2 h-[470px] w-[470px] -translate-y-1/2 rounded-full border border-[#d1b37f]/15 sm:-right-12" />
          <div className="pointer-events-none absolute -right-4 top-1/2 h-[330px] w-[330px] -translate-y-1/2 rounded-full border border-[#d1b37f]/15" />
          <div className="relative mx-auto max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
              <div className="max-w-[500px]">
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#c7a675]">Được tạo nên cho không gian của bạn</p>
                <h2 className="font-serif text-[clamp(2.8rem,5vw,4.7rem)] leading-[1.02] tracking-[-.045em]">
                  Chọn vải.
                  <br />
                  Chọn màu.
                  <br />
                  <em className="font-normal text-[#d4b986]">Chọn cảm giác.</em>
                </h2>
                <p className="mt-6 max-w-[420px] text-[12px] leading-[1.9] text-[#e5dfd1]/70">
                  Chọn chiều dài, kiểu góc, màu vải và chi tiết chân ghế theo đúng căn phòng của bạn. Đội ngũ thiết kế cùng bạn nhìn thấy tổng thể trước khi chốt.
                </p>
                <div className="mt-8">
                  <ArrowLink href="/sofa21/services/design/custom-sofa" dark>Bắt đầu tùy chỉnh</ArrowLink>
                </div>
              </div>
              <div className="relative min-h-[400px] sm:min-h-[500px]">
                <div className="sofa21-image-wrap absolute inset-0 overflow-hidden">
                  <img className="sofa21-image absolute inset-0 h-full w-full object-cover" src={SOFA21_IMAGES.room} alt="Sofa trong một không gian sống được cá nhân hóa" loading="lazy" />
                  <div className="absolute inset-0 bg-[#272d23]/15" />
                </div>
                <div className="absolute -bottom-4 left-3 flex max-w-[calc(100%-24px)] items-center gap-3 bg-[#f5f1e8] px-4 py-4 shadow-[0_15px_40px_rgba(0,0,0,.15)] sm:bottom-6 sm:left-[-35px] sm:gap-4 sm:px-6">
                  <div className="flex -space-x-2">
                    {['#c8b49b', '#777b83', '#4b554b', '#b9745a', '#d5cdaf'].map((color) => (
                      <span key={color} className="h-8 w-8 rounded-full border-[3px] border-[#f5f1e8] sm:h-9 sm:w-9" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#4c5146]">Chọn màu vải theo gu riêng</span>
                </div>
                <span className="absolute right-4 top-4 border border-white/60 px-3 py-2 text-[8px] font-medium uppercase tracking-[0.16em] text-white sm:right-6 sm:top-6">Tùy chỉnh cùng Sofa21</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eee9df] px-5 py-20 sm:px-10 sm:py-28 lg:px-14">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a3634d]">Từ ý tưởng đến nhà bạn</p>
                <h2 className="font-serif text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.03] tracking-[-.045em] text-[#30392e]">Một hành trình, cùng nhau.</h2>
              </div>
              <p className="max-w-[355px] text-[12px] leading-[1.85] text-[#707168]">Từng bước rõ ràng để chiếc sofa thật sự vừa vặn với nếp sống của bạn.</p>
            </div>
            <div className="grid grid-cols-1 border-y border-[#56604e]/20 sm:grid-cols-2 lg:grid-cols-4">
              {stages.map(([number, title, text], index) => (
                <div key={number} className={`relative py-7 sm:px-5 lg:px-7 lg:py-9 ${index > 0 ? 'border-t border-[#56604e]/20 sm:border-t-0 lg:border-l' : ''} ${index === 2 ? 'sm:border-l-0 lg:border-l' : ''}`}>
                  <span className="font-serif text-[14px] italic text-[#a3634d]">{number}</span>
                  <h3 className="mt-5 font-serif text-[26px] text-[#30392e]">{title}</h3>
                  <p className="mt-2 max-w-[245px] text-[11px] leading-[1.8] text-[#74756a]">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <ArrowLink href="/sofa21/services">Tìm hiểu các dịch vụ</ArrowLink>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-10 sm:py-28 lg:px-14">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a3634d]">Góc nhìn Sofa21</p>
                <h2 className="font-serif text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.03] tracking-[-.045em] text-[#30392e]">Những câu chuyện ở lại.</h2>
              </div>
              <ArrowLink href="/sofa21/blog">Đọc tạp chí</ArrowLink>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
              {SOFA21_STORIES.map((story, index) => (
                <a
                  key={story.title}
                  href={story.href}
                  className={`group ${index === 0 ? 'md:col-span-6' : 'md:col-span-3'}`}
                >
                  <div className={`sofa21-image-wrap relative overflow-hidden bg-[#d4cbbc] ${index === 0 ? 'aspect-[1.28]' : 'aspect-[.9]'}`}>
                    <img className="sofa21-image absolute inset-0 h-full w-full object-cover" src={story.image} alt={story.title} loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#242a21]/55 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-4 left-4 grid h-9 w-9 place-items-center rounded-full bg-[#f5f1e8] text-[#3c4338] transition-colors group-hover:bg-[#a3634d] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="pt-4">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.17em] text-[#a3634d]">{story.category}</p>
                    <h3 className="mt-2 max-w-[450px] font-serif text-[21px] leading-[1.25] text-[#30392e] transition-colors group-hover:text-[#a3634d] sm:text-[24px]">{story.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#505647]/15 bg-[#e9e4d8] px-5 py-16 sm:px-10 sm:py-20 lg:px-14">
          <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a3634d]">Bạn đang cân nhắc?</p>
              <h2 className="font-serif text-[clamp(2.6rem,4vw,3.8rem)] leading-[1.04] tracking-[-.04em] text-[#30392e]">Bắt đầu bằng một câu hỏi.</h2>
              <p className="mt-5 max-w-[380px] text-[12px] leading-[1.85] text-[#6f7067]">Chúng tôi sẵn lòng cùng bạn tìm lời giải phù hợp với căn phòng và cách sống của gia đình.</p>
              <div className="mt-7">
                <ArrowLink href="/sofa21/support">Trung tâm hỗ trợ</ArrowLink>
              </div>
            </div>
            <div className="border-t border-[#505647]/20">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group border-b border-[#505647]/20">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-serif text-[17px] text-[#30392e] marker:hidden sm:text-[19px]">
                    {question}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#56604e]/25 text-[#a3634d] transition-transform group-open:rotate-45">
                      <span className="text-[20px] font-light leading-none">+</span>
                    </span>
                  </summary>
                  <p className="max-w-[650px] pb-6 pr-12 text-[11px] leading-[1.9] text-[#707168]">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#a3634d] px-5 py-14 text-[#fbf4e7] sm:px-10 sm:py-16 lg:px-14">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-[720px]">
              <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.21em] text-[#f1d7b3]">Chạm · Thử · Chọn</p>
              <h2 className="font-serif text-[clamp(2.2rem,4vw,3.7rem)] leading-[1.05] tracking-[-.04em]">Gặp sofa trong không gian thật.</h2>
              <p className="mt-3 max-w-[520px] text-[11px] leading-[1.85] text-[#fbf4e7]/75">Ghé showroom, ngồi thử và cùng đội ngũ Sofa21 chọn cấu hình dành cho bạn.</p>
            </div>
            <a href="/sofa21/showrooms/visit" className="group inline-flex shrink-0 items-center justify-center gap-4 border border-[#f7ead6]/70 px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-[#f7ead6] hover:text-[#8d563f]">
              Tìm showroom gần bạn <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-[#30392e] px-5 pb-8 pt-14 text-[#f3eddf] sm:px-10 sm:pt-16 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-11 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_.8fr_.8fr_.8fr]">
            <div>
              <a href="/sofa21" className="inline-flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d1b37f]/60 font-serif text-[17px] text-[#d1b37f]">s.</span>
                <span>
                  <span className="block font-serif text-[21px] tracking-[0.04em]">SOFA21</span>
                  <span className="mt-1 block text-[8px] uppercase tracking-[0.27em] text-white/55">Furniture atelier</span>
                </span>
              </a>
              <p className="mt-5 max-w-[300px] text-[11px] leading-[1.85] text-white/60">
                Nội thất đương đại, được tạo nên từ sự chỉn chu và thấu hiểu nếp sống Việt.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-[8px] font-semibold uppercase tracking-[0.19em] text-[#d1b37f]">Khám phá</h3>
              <div className="flex flex-col gap-3 text-[11px] text-white/70">
                <a className="hover:text-white" href="/sofa21/products">Sản phẩm</a>
                <a className="hover:text-white" href="/sofa21/projects">Dự án</a>
                <a className="hover:text-white" href="/sofa21/blog">Tạp chí</a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-[8px] font-semibold uppercase tracking-[0.19em] text-[#d1b37f]">Đồng hành</h3>
              <div className="flex flex-col gap-3 text-[11px] text-white/70">
                <a className="hover:text-white" href="/sofa21/services">Dịch vụ</a>
                <a className="hover:text-white" href="/sofa21/showrooms/visit">Showroom</a>
                <a className="hover:text-white" href="/sofa21/support">Hỗ trợ khách hàng</a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-[8px] font-semibold uppercase tracking-[0.19em] text-[#d1b37f]">Kết nối</h3>
              <div className="flex flex-col gap-3 text-[11px] text-white/70">
                <a className="hover:text-white" href="/sofa21/account">Tài khoản của bạn</a>
                <a className="hover:text-white" href="/sofa21/b2b/dealers">Đối tác & đại lý</a>
                <a className="hover:text-white" href="/sofa21/contact">Liên hệ</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-6 text-[8px] uppercase tracking-[0.14em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <span>© SOFA21 · NỘI THẤT ĐƯƠNG ĐẠI</span>
            <div className="flex gap-5">
              <a className="hover:text-white" href="/sofa21/policies/privacy">Chính sách riêng tư</a>
              <a className="hover:text-white" href="/sofa21/policies/terms">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
