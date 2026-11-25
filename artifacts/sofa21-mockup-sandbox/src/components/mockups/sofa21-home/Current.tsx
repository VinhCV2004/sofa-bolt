import './_group.css';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { RouterLink } from './_Sofa21Primitives';

import { Iconify } from './_Sofa21Primitives';

import {
  SOFA21_COLORS,
  SOFA21_IMAGES,
  SOFA21_STORIES,
  SOFA21_PRODUCTS,
  SOFA21_CATEGORIES,
} from './_sofa21-data';

const reasons = [
  {
    number: '01',
    title: 'Ngồi là thấy khác',
    text: 'Tầng đệm nhiều lớp nâng đỡ êm mà không lún sâu — dễ chịu từ lần ngồi thử đầu tiên.',
    icon: 'solar:chair-2-bold-duotone',
  },
  {
    number: '02',
    title: 'Đo ni đóng giày',
    text: 'Chọn chiều dài, kiểu góc, màu vải và chi tiết chân ghế theo đúng căn phòng của bạn.',
    icon: 'solar:ruler-angular-bold-duotone',
  },
  {
    number: '03',
    title: 'Dùng lâu, chăm dễ',
    text: 'Vật liệu được chọn theo sinh hoạt thực tế, có hướng dẫn vệ sinh và hậu mãi rõ ràng.',
    icon: 'solar:shield-check-bold-duotone',
  },
];

const stages = [
  ['01', 'Lắng nghe', 'Nhà bạn thế nào? Ai sẽ dùng sofa mỗi ngày?'],
  ['02', 'Phác thảo', 'Chốt kích thước, kiểu dáng và bảng màu.'],
  ['03', 'Chế tác', 'Thợ lành nghề hoàn thiện từng chi tiết.'],
  ['04', 'Bàn giao', 'Giao lắp gọn gàng, hướng dẫn chăm sóc tận tay.'],
];

const testimonials = [
  {
    quote:
      'Tư vấn rất kỹ phần kích thước. Sofa vừa khít phòng khách, màu lên thực tế còn đẹp hơn ảnh.',
    name: 'Minh Anh',
    location: 'Căn hộ, Thảo Điền',
  },
  {
    quote:
      'Nhà có hai bé nên mình ưu tiên dễ vệ sinh. Sau ba tháng dùng, cả nhà đều mê chiếc sofa mới.',
    name: 'Quốc Bảo',
    location: 'Nhà phố, Bình Thạnh',
  },
  {
    quote:
      'Được xem vải và ngồi thử ở showroom trước khi đặt. Trải nghiệm mua hàng nhẹ nhàng, rõ ràng.',
    name: 'Thu Hà',
    location: 'Căn hộ, Hà Nội',
  },
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

const sectionLabelSx = { color: SOFA21_COLORS.persimmonDeep, letterSpacing: 2.2, fontWeight: 600 };
const headingSx = {
  color: SOFA21_COLORS.ink,
  fontWeight: 500,
  fontFamily: 'Georgia, "Times New Roman", serif',
  letterSpacing: '-.035em',
  lineHeight: 1.12,
};

function SectionHeading({
  eyebrow,
  title,
  note,
  light = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  note?: string;
  light?: boolean;
}) {
  return (
    <Stack spacing={1.6} sx={{ maxWidth: 760, mb: { xs: 4, md: 6 } }}>
      <Typography
        variant="overline"
        sx={{
          ...sectionLabelSx,
          color: light ? SOFA21_COLORS.butter : SOFA21_COLORS.persimmonDeep,
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        variant="h2"
        sx={{
          ...headingSx,
          color: light ? 'common.white' : SOFA21_COLORS.ink,
          fontSize: { xs: 36, md: 60 },
        }}
      >
        {title}
      </Typography>
      {note && (
        <Typography
          sx={{
            maxWidth: 600,
            color: light ? 'rgba(255,255,255,.7)' : SOFA21_COLORS.inkSoft,
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.8,
          }}
        >
          {note}
        </Typography>
      )}
    </Stack>
  );
}

export function Sofa21View() {
  return (
    <Box sx={{ bgcolor: SOFA21_COLORS.cream, color: SOFA21_COLORS.ink, overflow: 'hidden' }}>
      {/* 01 / Art-directed hero */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          minHeight: { xs: 700, md: 760 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          bgcolor: SOFA21_COLORS.midnight,
          mt: 'calc(var(--layout-header-desktop-height) * -1)',
          pt: 'var(--layout-header-desktop-height)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(90deg, rgba(25,27,43,.94) 0%, rgba(25,27,43,.78) 47%, rgba(25,27,43,.12) 100%), url(${SOFA21_IMAGES.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 56%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 1,
            height: '42%',
            right: { xs: '6%', md: '9%' },
            top: '34%',
            bgcolor: 'rgba(196,163,106,.52)',
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 1, py: { xs: 9, md: 12 } }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid xs={12} md={8}>
              <Stack spacing={3} sx={{ maxWidth: 760, color: 'common.white' }}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box sx={{ width: 34, height: 2, bgcolor: SOFA21_COLORS.butter }} />
                  <Typography
                    variant="overline"
                    sx={{ color: SOFA21_COLORS.butter, letterSpacing: 3 }}
                  >
                    SOFA21 ATELIER · NỘI THẤT ĐƯƠNG ĐẠI
                  </Typography>
                </Stack>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: 48, sm: 66, md: 88 },
                    lineHeight: 1.02,
                    fontWeight: 500,
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    letterSpacing: '-.045em',
                  }}
                >
                  Một nơi,
                  <br />
                  <Box component="span" sx={{ color: SOFA21_COLORS.butter, fontStyle: 'italic' }}>
                    để trở về.
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 540,
                    color: 'rgba(255,255,255,.78)',
                    lineHeight: 1.8,
                    fontSize: { xs: 17, md: 19 },
                  }}
                >
                  Sofa21 kết hợp phom dáng vượt thời gian, vật liệu được tuyển chọn và sự thoải mái
                  tinh tế — được tạo nên để thuộc về không gian của bạn.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
                  <Button
                    component={RouterLink}
                    href="/sofa21/products"
                    variant="contained"
                    size="large"
                    endIcon={<Iconify icon="solar:arrow-right-linear" />}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 1.5,
                      bgcolor: SOFA21_COLORS.persimmon,
                      color: 'common.white',
                      '&:hover': { bgcolor: SOFA21_COLORS.persimmonDeep },
                    }}
                  >
                    Tìm chiếc sofa của bạn
                  </Button>
                  <Button
                    component={RouterLink}
                    href="/sofa21/showrooms/visit"
                    variant="outlined"
                    size="large"
                    startIcon={<Iconify icon="solar:map-point-bold-duotone" />}
                    sx={{
                      borderRadius: 1.5,
                      borderColor: 'rgba(255,255,255,.5)',
                      color: 'common.white',
                    }}
                  >
                    Đến showroom
                  </Button>
                </Stack>
                <Stack direction="row" spacing={3} sx={{ pt: 3 }}>
                  {[
                    ['8.000+', 'ngôi nhà đồng hành'],
                    ['4.9/5', 'điểm hài lòng'],
                    ['05 năm', 'bảo hành khung'],
                  ].map(([value, label]) => (
                    <Box key={label}>
                      <Typography
                        variant="h5"
                        sx={{ color: SOFA21_COLORS.butter, fontWeight: 800 }}
                      >
                        {value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.62)' }}>
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={4}
              sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}
            >
              <Box
                sx={{
                  width: 270,
                  p: 1.2,
                  bgcolor: 'rgba(253,251,247,.96)',
                  borderRadius: 1.5,
                  boxShadow: '0 30px 70px rgba(0,0,0,.22)',
                }}
              >
                <Box
                  component="img"
                  src={SOFA21_IMAGES.detail}
                  alt="Chất liệu sofa Sofa21"
                  sx={{
                    width: 1,
                    height: 286,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
                <Typography
                  sx={{
                    pt: 1.5,
                    textAlign: 'center',
                    fontSize: 12,
                    letterSpacing: 1.2,
                    color: SOFA21_COLORS.ink,
                  }}
                >
                  CHẠM · THỬ · CHỌN
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            right: 30,
            bottom: 30,
            color: 'rgba(255,255,255,.6)',
            writingMode: 'vertical-rl',
            letterSpacing: 2,
            fontSize: 11,
          }}
        >
          THIẾT KẾ BỞI BẠN, HOÀN THIỆN CÙNG SOFA21
        </Box>
      </Box>

      {/* 02 / Moving brand ticker */}
      <Box component="section" sx={{ py: 2.3, overflow: 'hidden', bgcolor: SOFA21_COLORS.butter }}>
        <Box
          sx={{
            display: 'flex',
            width: 'max-content',
            animation: 'sofa21Ticker 32s linear infinite',
            '@keyframes sofa21Ticker': {
              from: { transform: 'translateX(0)' },
              to: { transform: 'translateX(-50%)' },
            },
            '&:hover': { animationPlayState: 'paused' },
          }}
        >
          {Array.from({ length: 2 }).map((_, repeat) => (
            <Stack key={repeat} direction="row" alignItems="center" spacing={4} sx={{ px: 2 }}>
              {[
                'CHẾ TÁC TINH XẢO',
                'VẬT LIỆU TUYỂN CHỌN',
                'THIẾT KẾ VƯỢT THỜI GIAN',
                'SỐNG CÓ CHỦ ĐÍCH',
                'SOFA21 ATELIER',
              ].map((word) => (
                <Stack key={`${repeat}-${word}`} direction="row" spacing={3} alignItems="center">
                  <Typography
                    sx={{
                      fontWeight: 850,
                      letterSpacing: 2,
                      whiteSpace: 'nowrap',
                      color: SOFA21_COLORS.midnight,
                    }}
                  >
                    {word}
                  </Typography>
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      bgcolor: SOFA21_COLORS.persimmon,
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          ))}
        </Box>
      </Box>

      {/* 03 / Category editorials */}
      <Box component="section" sx={{ py: { xs: 9, md: 14 } }}>
        <Container>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ md: 'end' }}
            spacing={2}
          >
            <SectionHeading
              eyebrow="CHỌN THEO CÁCH BẠN SỐNG"
              title={
                <>
                  Đường nét chuẩn mực.
                  <br />
                  Cảm giác riêng biệt.
                </>
              }
              note="Từ những buổi tụ họp đông vui đến một góc đọc sách thật riêng — bắt đầu từ nhu cầu của bạn."
            />
            <Button
              component={RouterLink}
              href="/sofa21/products"
              endIcon={<Iconify icon="solar:arrow-right-linear" />}
              sx={{ mb: { md: 6 }, color: SOFA21_COLORS.cobalt }}
            >
              Xem tất cả kiểu dáng
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {SOFA21_CATEGORIES.map((category, index) => (
              <Grid key={category.number} xs={12} sm={6} md={index === 0 || index === 3 ? 7 : 5}>
                <Box
                  component={RouterLink}
                  href={category.href}
                  sx={{
                    position: 'relative',
                    display: 'block',
                    height: { xs: 330, md: 430 },
                    overflow: 'hidden',
                    textDecoration: 'none',
                    borderRadius: 1.5,
                    bgcolor: SOFA21_COLORS.midnight,
                    '&:hover img': { transform: 'scale(1.06)' },
                  }}
                >
                  <Box
                    component="img"
                    src={category.image}
                    alt={category.title}
                    sx={{
                      width: 1,
                      height: 1,
                      objectFit: 'cover',
                      opacity: 0.82,
                      transition: 'transform .7s',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(0deg, rgba(25,27,43,.78), transparent 70%)',
                    }}
                  />
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: 22,
                      left: 24,
                      color: 'white',
                      fontSize: 12,
                      letterSpacing: 2,
                    }}
                  >
                    {category.number} / SOFA21 EDIT
                  </Typography>
                  <Box
                    sx={{ position: 'absolute', bottom: 24, left: 26, right: 26, color: 'white' }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-.04em' }}>
                      {category.title}
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: 'rgba(255,255,255,.76)' }}>
                      {category.subtitle}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 28,
                      right: 24,
                      width: 42,
                      height: 42,
                      display: { xs: 'none', sm: 'grid' },
                      placeItems: 'center',
                      bgcolor: SOFA21_COLORS.butter,
                      color: SOFA21_COLORS.ink,
                      borderRadius: '50%',
                    }}
                  >
                    <Iconify icon="solar:arrow-right-up-linear" width={20} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 04 / Product drop */}
      <Box component="section" sx={{ py: { xs: 9, md: 13 }, bgcolor: SOFA21_COLORS.paper }}>
        <Container>
          <SectionHeading
            eyebrow="SOFA21 SELECTED"
            title="Những thiết kế vượt thời gian."
            note="Thiết kế được yêu thích bởi phom dáng, cảm giác ngồi và những lựa chọn cá nhân hóa."
          />
          <Grid container spacing={3}>
            {SOFA21_PRODUCTS.map((product, index) => (
              <Grid key={product.name} xs={12} sm={6} md={4}>
                <Card
                  component={RouterLink}
                  href="/sofa21/products"
                  sx={{
                    display: 'block',
                    height: 1,
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    textDecoration: 'none',
                    color: SOFA21_COLORS.ink,
                    '&:hover .product-photo': { transform: 'scale(1.045)' },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 1.5,
                      bgcolor: SOFA21_COLORS.cream,
                    }}
                  >
                    <Box
                      className="product-photo"
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        display: 'block',
                        width: 1,
                        height: { xs: 300, md: 390 },
                        objectFit: 'cover',
                        transition: 'transform .55s',
                      }}
                    />
                    <Chip
                      label={product.tag}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        bgcolor: SOFA21_COLORS.butter,
                        fontWeight: 750,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 15,
                        right: 15,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(255,254,251,.9)',
                        color: SOFA21_COLORS.ink,
                      }}
                    >
                      <Iconify icon="solar:arrow-right-up-linear" />
                    </Box>
                  </Box>
                  <Stack spacing={1} sx={{ pt: 2.2 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: SOFA21_COLORS.inkSoft, letterSpacing: 1 }}
                    >
                      {product.category.toUpperCase()}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Typography variant="h6" sx={{ fontWeight: 750 }}>
                        {product.name}
                      </Typography>
                      <Typography
                        sx={{ color: SOFA21_COLORS.cobalt, fontWeight: 800, whiteSpace: 'nowrap' }}
                      >
                        {product.price}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.7}>
                      {product.swatches.map((color) => (
                        <Box
                          key={color}
                          sx={{
                            width: 13,
                            height: 13,
                            borderRadius: '50%',
                            bgcolor: color,
                            border: '1px solid rgba(0,0,0,.1)',
                          }}
                        />
                      ))}
                      <Typography variant="caption" sx={{ ml: 1, color: SOFA21_COLORS.inkSoft }}>
                        + 12 màu vải
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 05 / Why the details matter */}
      <Box
        component="section"
        sx={{ py: { xs: 9, md: 14 }, position: 'relative', overflow: 'hidden' }}
      >
        <Container>
          <Grid container spacing={5} alignItems="center">
            <Grid xs={12} md={5}>
              <SectionHeading
                eyebrow="THIẾT KẾ CÓ LÝ DO"
                title={
                  <>
                    Tỉ mỉ trong từng nét.
                    <br />
                    Thoải mái qua năm tháng.
                  </>
                }
                note="Mỗi chi tiết bắt đầu từ một câu hỏi đơn giản: điều gì sẽ khiến căn phòng dễ sống hơn?"
              />
              <Button
                component={RouterLink}
                href="/sofa21/about"
                endIcon={<Iconify icon="solar:arrow-right-linear" />}
                sx={{ color: SOFA21_COLORS.cobalt }}
              >
                Tìm hiểu về Sofa21
              </Button>
            </Grid>
            <Grid xs={12} md={7}>
              <Stack spacing={1.5}>
                {reasons.map((reason) => (
                  <Box
                    key={reason.number}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '46px 1fr', md: '64px 48px 1fr' },
                      gap: { xs: 1.5, md: 2 },
                      alignItems: 'center',
                      p: { xs: 2, md: 2.5 },
                      borderBottom: `1px solid ${SOFA21_COLORS.line}`,
                      '&:hover': { bgcolor: SOFA21_COLORS.paper, borderRadius: 1.5 },
                    }}
                  >
                    <Typography sx={{ color: SOFA21_COLORS.persimmon, fontWeight: 800 }}>
                      {reason.number}
                    </Typography>
                    <Iconify
                      icon={reason.icon}
                      width={28}
                      sx={{ color: SOFA21_COLORS.cobalt, display: { xs: 'none', md: 'block' } }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 750 }}>
                        {reason.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          maxWidth: 560,
                          color: SOFA21_COLORS.inkSoft,
                          lineHeight: 1.7,
                        }}
                      >
                        {reason.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 06 / Personalization */}
      <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: SOFA21_COLORS.periwinkle }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid xs={12} md={5}>
              <Typography
                variant="overline"
                sx={{ ...sectionLabelSx, color: SOFA21_COLORS.cobaltDeep }}
              >
                SOFA CỦA BẠN, LUẬT CỦA BẠN
              </Typography>
              <Typography variant="h2" sx={{ ...headingSx, mt: 1.5, fontSize: { xs: 38, md: 58 } }}>
                Chọn vải.
                <br />
                Chọn màu.
                <br />
                <Box component="span" sx={{ color: SOFA21_COLORS.cobalt }}>
                  Đúng phong cách bạn.
                </Box>
              </Typography>
              <Typography sx={{ my: 2.5, color: SOFA21_COLORS.inkSoft, lineHeight: 1.8 }}>
                Hơn 40 mẫu vải và da, nhiều sắc độ, nhiều kiểu chân ghế. Đội ngũ thiết kế giúp bạn
                nhìn thấy tổng thể trước khi chốt.
              </Typography>
              <Button
                component={RouterLink}
                href="/sofa21/services/design/custom-sofa"
                variant="contained"
                endIcon={<Iconify icon="solar:arrow-right-linear" />}
                sx={{ bgcolor: SOFA21_COLORS.cobalt, borderRadius: 1.5, px: 2.5 }}
              >
                Bắt đầu tùy chỉnh
              </Button>
            </Grid>
            <Grid xs={12} md={7}>
              <Box sx={{ position: 'relative', minHeight: { xs: 350, md: 490 } }}>
                <Box
                  component="img"
                  src={SOFA21_IMAGES.room}
                  alt="Sofa thiết kế trong phòng khách"
                  sx={{
                    width: '78%',
                    height: { xs: 310, md: 450 },
                    objectFit: 'cover',
                    borderRadius: 1.5,
                    ml: 'auto',
                  }}
                />
                <Stack
                  direction="row"
                  spacing={-1.2}
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 12, md: 22 },
                    left: 0,
                    p: 1.5,
                    bgcolor: SOFA21_COLORS.paper,
                    borderRadius: 99,
                    boxShadow: '0 15px 40px rgba(41,40,33,.10)',
                  }}
                >
                  {['#E0CDB4', '#B46E57', '#4C526F', '#D8B94E', '#82917E', '#D7D9E3'].map(
                    (color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 37,
                          height: 37,
                          borderRadius: '50%',
                          bgcolor: color,
                          border: `3px solid ${SOFA21_COLORS.paper}`,
                        }}
                      />
                    )
                  )}
                  <Typography sx={{ alignSelf: 'center', pl: 2, pr: 1, fontWeight: 750 }}>
                    40+ lựa chọn
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 18,
                    left: 4,
                    width: 112,
                    height: 112,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    bgcolor: SOFA21_COLORS.persimmon,
                    color: 'white',
                    textAlign: 'center',
                    transform: 'rotate(-9deg)',
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2 }}>
                    MADE
                    <br />
                    FOR
                    <br />
                    YOUR HOME
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 07 / How it is made */}
      <Box component="section" sx={{ py: { xs: 9, md: 14 } }}>
        <Container>
          <SectionHeading
            eyebrow="TỪ Ý TƯỞNG ĐẾN PHÒNG KHÁCH"
            title="Bốn bước, một chiếc sofa thật vừa."
            note="Rõ ràng trong từng bước — bạn luôn biết sản phẩm đang ở đâu trong hành trình."
          />
          <Grid container spacing={0}>
            {stages.map(([number, title, text], index) => (
              <Grid key={number} xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    minHeight: 210,
                    borderTop: `2px solid ${index === 0 ? SOFA21_COLORS.persimmon : SOFA21_COLORS.line}`,
                    position: 'relative',
                  }}
                >
                  <Typography
                    sx={{
                      color: SOFA21_COLORS.cobalt,
                      fontSize: 40,
                      fontWeight: 850,
                      letterSpacing: '-.06em',
                    }}
                  >
                    {number}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 800 }}>
                    {title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: SOFA21_COLORS.inkSoft, lineHeight: 1.7 }}
                  >
                    {text}
                  </Typography>
                  {index < stages.length - 1 && (
                    <Iconify
                      icon="solar:arrow-right-linear"
                      width={22}
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute',
                        top: 22,
                        right: 8,
                        color: SOFA21_COLORS.persimmon,
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box
            component="img"
            src={SOFA21_IMAGES.factory}
            alt="Quy trình chế tác sofa"
            sx={{
              mt: 2,
              width: 1,
              height: { xs: 250, md: 400 },
              objectFit: 'cover',
              borderRadius: 1.5,
            }}
          />
        </Container>
      </Box>

      {/* 08 / Materials */}
      <Box
        component="section"
        sx={{ py: { xs: 9, md: 13 }, bgcolor: SOFA21_COLORS.midnight, color: 'white' }}
      >
        <Container>
          <Grid container spacing={5} alignItems="center">
            <Grid xs={12} md={5}>
              <SectionHeading
                light
                eyebrow="CHẠM LÀ BIẾT"
                title={
                  <>
                    Vật liệu
                    <br />
                    cũng có tính cách.
                  </>
                }
                note="Mềm mại, thoáng mát hay dễ lau sạch — chọn bề mặt hợp nhịp sống của gia đình."
              />
              <Button
                component={RouterLink}
                href="/sofa21/products/detail/materials"
                endIcon={<Iconify icon="solar:arrow-right-linear" />}
                sx={{ color: SOFA21_COLORS.butter, px: 0 }}
              >
                Khám phá vật liệu
              </Button>
            </Grid>
            <Grid xs={12} md={7}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {[
                  ['VẢI DỆT', 'Thoáng, nhiều màu, thân thiện mỗi ngày', '#E5C9AA'],
                  ['DA', 'Càng dùng càng lên sắc riêng', '#B8755C'],
                  ['BOUCLE', 'Bề mặt nổi, cảm giác ấm áp', '#DAD9D0'],
                  ['NHUNG', 'Mịn tay, sắc độ sâu và sang', '#65708D'],
                ].map(([title, text, color], index) => (
                  <Box
                    key={title}
                    sx={{
                      p: { xs: 2, md: 3 },
                      minHeight: { xs: 150, md: 190 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      bgcolor: index === 1 ? SOFA21_COLORS.cobalt : 'rgba(255,255,255,.07)',
                      border: '1px solid rgba(255,255,255,.12)',
                      borderRadius: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        bgcolor: color,
                        boxShadow: `0 0 0 7px ${color}22`,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: SOFA21_COLORS.butter, letterSpacing: 2 }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.6, color: 'rgba(255,255,255,.75)', lineHeight: 1.6 }}
                      >
                        {text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 09 / Project inspiration */}
      <Box component="section" sx={{ py: { xs: 9, md: 14 } }}>
        <Container>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ md: 'end' }}
            spacing={2}
          >
            <SectionHeading
              eyebrow="NHÀ THẬT · CẢM HỨNG THẬT"
              title="Không gian mang dấu ấn riêng."
              note="Một vài không gian được Sofa21 đồng hành từ lúc chọn sofa đến ngày hoàn thiện."
            />
            <Button
              component={RouterLink}
              href="/sofa21/projects"
              endIcon={<Iconify icon="solar:arrow-right-linear" />}
              sx={{ mb: { md: 6 }, color: SOFA21_COLORS.cobalt }}
            >
              Xem dự án
            </Button>
          </Stack>
          <Grid container spacing={2}>
            <Grid xs={12} md={7}>
              <Box
                component={RouterLink}
                href="/sofa21/projects"
                sx={{
                  position: 'relative',
                  display: 'block',
                  height: { xs: 340, md: 520 },
                  overflow: 'hidden',
                  borderRadius: 1.5,
                  textDecoration: 'none',
                  '&:hover img': { transform: 'scale(1.04)' },
                }}
              >
                <Box
                  component="img"
                  src={SOFA21_IMAGES.project}
                  alt="Dự án phòng khách Sofa21"
                  sx={{ width: 1, height: 1, objectFit: 'cover', transition: 'transform .7s' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(0deg,rgba(25,27,43,.8),transparent 65%)',
                  }}
                />
                <Box sx={{ position: 'absolute', left: 24, bottom: 24, color: 'white' }}>
                  <Typography variant="overline" sx={{ color: SOFA21_COLORS.butter }}>
                    CĂN HỘ · THẢO ĐIỀN
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Nắng ở lại phòng khách
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid xs={12} md={5}>
              <Stack spacing={2} sx={{ height: 1 }}>
                <Box
                  component="img"
                  src={SOFA21_IMAGES.interior}
                  alt="Không gian nội thất Sofa21"
                  sx={{
                    width: 1,
                    height: { xs: 230, md: 250 },
                    objectFit: 'cover',
                    borderRadius: 1.5,
                  }}
                />
                <Box sx={{ flex: 1, p: 3, bgcolor: SOFA21_COLORS.butter, borderRadius: 2 }}>
                  <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                    BẠN ĐANG LÀM NHÀ?
                  </Typography>
                  <Typography variant="h5" sx={{ my: 1, fontWeight: 800 }}>
                    Lên moodboard cùng Sofa21.
                  </Typography>
                  <Button
                    component={RouterLink}
                    href="/sofa21/services/design/space-planning"
                    endIcon={<Iconify icon="solar:arrow-right-linear" />}
                    sx={{ color: SOFA21_COLORS.ink, px: 0 }}
                  >
                    Nhận tư vấn bố trí
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 10 / Social proof */}
      <Box component="section" sx={{ py: { xs: 9, md: 13 }, bgcolor: SOFA21_COLORS.paper }}>
        <Container>
          <SectionHeading
            eyebrow="LỜI KỂ TỪ NHỮNG NGÔI NHÀ"
            title="Sự hài lòng, qua lời kể."
            note="Điều vui nhất là khi khách hàng gửi lại ảnh chiếc sofa trong căn nhà của họ."
          />
          <Grid container spacing={2}>
            {testimonials.map((review, index) => (
              <Grid key={review.name} xs={12} md={4}>
                <Card
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    height: 1,
                    bgcolor: index === 1 ? SOFA21_COLORS.periwinkle : SOFA21_COLORS.cream,
                    borderRadius: 1.5,
                    boxShadow: 'none',
                  }}
                >
                  <Stack direction="row" spacing={0.4} sx={{ color: SOFA21_COLORS.persimmon }}>
                    <Iconify icon="solar:star-bold" />
                    <Iconify icon="solar:star-bold" />
                    <Iconify icon="solar:star-bold" />
                    <Iconify icon="solar:star-bold" />
                    <Iconify icon="solar:star-bold" />
                  </Stack>
                  <Typography
                    sx={{ minHeight: 126, mt: 2, lineHeight: 1.85, color: SOFA21_COLORS.ink }}
                  >
                    &ldquo;{review.quote}&rdquo;
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '50%',
                        bgcolor: index === 1 ? SOFA21_COLORS.cobalt : SOFA21_COLORS.butter,
                        color: index === 1 ? 'white' : SOFA21_COLORS.ink,
                        fontWeight: 800,
                      }}
                    >
                      {review.name[0]}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        {review.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: SOFA21_COLORS.inkSoft }}>
                        {review.location}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 11 / Journal */}
      <Box component="section" sx={{ py: { xs: 9, md: 13 } }}>
        <Container>
          <Stack direction="row" justifyContent="space-between" alignItems="end" sx={{ mb: 5 }}>
            <SectionHeading
              eyebrow="JOURNAL 21"
              title="Tạp chí không gian sống."
              note="Ý tưởng, kiến thức và mẹo nhỏ làm không gian sống vui hơn."
            />
            <Button
              component={RouterLink}
              href="/sofa21/blog"
              endIcon={<Iconify icon="solar:arrow-right-linear" />}
              sx={{
                mb: 6,
                color: SOFA21_COLORS.cobalt,
                display: { xs: 'none', sm: 'inline-flex' },
              }}
            >
              Đọc thêm
            </Button>
          </Stack>
          <Grid container spacing={2.5}>
            {SOFA21_STORIES.map((story, index) => (
              <Grid key={story.title} xs={12} sm={6} md={4}>
                <Box
                  component={RouterLink}
                  href={story.href}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: SOFA21_COLORS.ink,
                    '&:hover img': { transform: 'scale(1.04)' },
                  }}
                >
                  <Box sx={{ overflow: 'hidden', borderRadius: 1.5 }}>
                    <Box
                      component="img"
                      src={story.image}
                      alt={story.title}
                      sx={{
                        width: 1,
                        height: { xs: 230, md: 270 },
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform .5s',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="overline"
                    sx={{
                      display: 'block',
                      mt: 2,
                      color: SOFA21_COLORS.persimmonDeep,
                      letterSpacing: 2,
                    }}
                  >
                    {story.category}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ mt: 0.5, maxWidth: 370, fontWeight: 750, lineHeight: 1.4 }}
                  >
                    {story.title}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 1, color: SOFA21_COLORS.cobalt }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>
                      ĐỌC BÀI
                    </Typography>
                    <Iconify icon="solar:arrow-right-linear" width={17} />
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 12 / FAQ */}
      <Box component="section" sx={{ py: { xs: 9, md: 12 }, bgcolor: SOFA21_COLORS.periwinkle }}>
        <Container>
          <Grid container spacing={5}>
            <Grid xs={12} md={4}>
              <SectionHeading
                eyebrow="HỎI NHANH · ĐÁP THẬT"
                title="Bạn đang băn khoăn?"
                note="Một vài câu hỏi thường gặp trước khi chọn sofa."
              />
              <Button
                component={RouterLink}
                href="/sofa21/support/faq"
                endIcon={<Iconify icon="solar:arrow-right-linear" />}
                sx={{ color: SOFA21_COLORS.cobalt, px: 0 }}
              >
                Xem trung tâm hỗ trợ
              </Button>
            </Grid>
            <Grid xs={12} md={8}>
              <Stack spacing={1.2}>
                {faqs.map(([question, answer]) => (
                  <Box
                    key={question}
                    component="details"
                    sx={{
                      p: 2.5,
                      bgcolor: SOFA21_COLORS.paper,
                      borderRadius: 2,
                      '&[open] summary': { color: SOFA21_COLORS.cobalt },
                    }}
                  >
                    <Box
                      component="summary"
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 750,
                        listStyle: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                        '&::-webkit-details-marker': { display: 'none' },
                      }}
                    >
                      {question}
                      <Iconify icon="solar:add-circle-linear" width={20} />
                    </Box>
                    <Typography sx={{ pt: 1.5, color: SOFA21_COLORS.inkSoft, lineHeight: 1.8 }}>
                      {answer}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 13 / Showroom invitation and closing CTA */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: SOFA21_COLORS.persimmon }}>
        <Container>
          <Grid container alignItems="center" spacing={4}>
            <Grid xs={12} md={7}>
              <Typography
                variant="overline"
                sx={{ color: 'rgba(255,255,255,.78)', letterSpacing: 2.5 }}
              >
                CÓ THỂ CHỌN TRÊN MÀN HÌNH. CŨNG CÓ THỂ NGỒI THỬ.
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  mt: 1.5,
                  color: 'white',
                  fontWeight: 850,
                  letterSpacing: '-.05em',
                  fontSize: { xs: 40, md: 64 },
                }}
              >
                Ghé thăm không gian Sofa21.
              </Typography>
              <Typography
                sx={{ mt: 1.5, maxWidth: 580, color: 'rgba(255,255,255,.84)', lineHeight: 1.8 }}
              >
                Chạm vào chất liệu, ngồi thử kiểu dáng và tìm chiếc sofa hợp với nhà bạn — cùng một
                ly cà phê tại showroom Sofa21.
              </Typography>
            </Grid>
            <Grid xs={12} md={5} sx={{ textAlign: { md: 'right' } }}>
              <Button
                component={RouterLink}
                href="/sofa21/showrooms/visit"
                size="large"
                endIcon={<Iconify icon="solar:arrow-up-right-linear" />}
                sx={{
                  px: 3.5,
                  py: 1.6,
                  borderRadius: 1.5,
                  bgcolor: SOFA21_COLORS.paper,
                  color: SOFA21_COLORS.ink,
                  fontWeight: 800,
                  '&:hover': { bgcolor: SOFA21_COLORS.butter },
                }}
              >
                Đặt lịch ghé thăm
              </Button>
              <Typography sx={{ mt: 2, color: 'rgba(255,255,255,.8)', fontSize: 13 }}>
                Hoặc gọi chúng tôi · 1900 21 21 21
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}


export function Current() {
  return <Sofa21View />;
}
