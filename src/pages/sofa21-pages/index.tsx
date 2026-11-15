import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { SOFA21_SITE_MAP, type Sofa21Node } from 'src/sections/sofa21/sofa21-content';
import { SOFA21_COLORS, SOFA21_IMAGES, SOFA21_PRODUCTS } from 'src/sections/sofa21/sofa21-data';

type LocatedNode = Sofa21Node & { parent?: Sofa21Node };

function flatten(nodes: Sofa21Node[], parent?: Sofa21Node): LocatedNode[] {
  return nodes.flatMap((item) => [{ ...item, parent }, ...flatten(item.children || [], item)]);
}

const ALL_NODES = flatten(SOFA21_SITE_MAP);
const normalize = (path: string) => path.replace(/\/+$/, '') || '/';
const titleCase = (slug: string) =>
  slug
    .split('-')
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : ''))
    .join(' ');

function resolvePage(pathname: string) {
  const path = normalize(pathname);
  const match = [...ALL_NODES]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) => normalize(item.path) === path);
  if (match) return match;
  if (path.startsWith('/sofa21/products/')) {
    return {
      title: 'Chi tiết sản phẩm',
      path,
      parent: ALL_NODES.find((item) => item.path === '/sofa21/products'),
    };
  }
  const last = path.split('/').filter(Boolean).at(-1) || 'support';
  const parent = SOFA21_SITE_MAP.find(
    (item) => path === item.path || path.startsWith(`${item.path}/`)
  );
  return { title: titleCase(last), path, parent };
}

function sectionOf(path: string) {
  return (
    SOFA21_SITE_MAP.find((item) => path === item.path || path.startsWith(`${item.path}/`))?.title ||
    'Sofa21'
  );
}

function descriptionFor(title: string, section: string) {
  if (section === 'Sản phẩm')
    return `Khám phá ${title.toLowerCase()} được chọn lọc theo công năng, chất liệu và phong cách — thiết kế để hợp với không gian sống thực tế.`;
  if (section === 'Giới thiệu')
    return `${title} là một phần trong hành trình Sofa21 tạo nên những sản phẩm chỉn chu, bền đẹp và phù hợp với nhịp sống gia đình Việt.`;
  if (section === 'Dự án')
    return `Cùng nhìn lại những không gian Sofa21 đã đồng hành hoàn thiện — từ lựa chọn sản phẩm đến tư vấn bố trí và bàn giao.`;
  if (section === 'Showroom')
    return `Trải nghiệm trực tiếp kiểu dáng, chất liệu và độ êm của sofa. Đội ngũ tư vấn giúp bạn tìm lựa chọn vừa vặn với nhà mình.`;
  if (section === 'Dịch vụ')
    return `Từ ý tưởng ban đầu đến sản phẩm hoàn thiện, Sofa21 đồng hành bằng dịch vụ tư vấn, thiết kế và sản xuất linh hoạt.`;
  if (section === 'Blog')
    return `Góc chia sẻ Sofa21: kinh nghiệm chọn sofa, thông tin vật liệu và cảm hứng thiết kế giúp bạn chăm chút không gian sống.`;
  if (section.includes('Tài khoản') || section === 'Khu vực thành viên')
    return `Quản lý thông tin, đơn hàng và quyền lợi thành viên Sofa21 thuận tiện, tập trung và an toàn.`;
  if (section === 'Hỗ trợ')
    return `Tìm câu trả lời, chính sách và hướng dẫn sử dụng dịch vụ. Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn.`;
  if (section === 'Đại lý B2B')
    return `Cùng phát triển thị trường với các giải pháp phân phối, báo giá dự án và sản xuất theo yêu cầu từ Sofa21.`;
  if (section === 'Khuyến mãi / Hậu mãi')
    return `Dịch vụ chăm sóc sofa minh bạch, giúp sản phẩm luôn bền đẹp và đồng hành cùng gia đình qua nhiều năm sử dụng.`;
  return `Tìm hiểu ${title.toLowerCase()} và nhận hỗ trợ trực tiếp từ đội ngũ Sofa21.`;
}

function heroImageFor(section: string, path: string) {
  if (path.includes('factory') || path.includes('process') || path.includes('production'))
    return SOFA21_IMAGES.factory;
  if (section === 'Sản phẩm') return SOFA21_IMAGES.sofa;
  if (section === 'Dự án') return SOFA21_IMAGES.project;
  if (section === 'Dịch vụ') return SOFA21_IMAGES.interior;
  if (section === 'Blog') return SOFA21_IMAGES.journal;
  return SOFA21_IMAGES.living;
}

const quickTips = [
  {
    label: 'Đúng kích thước',
    text: 'Đo lối đi, khoảng cách ngồi và phần diện tích cần chừa quanh ghế.',
    icon: 'solar:ruler-angular-bold-duotone',
  },
  {
    label: 'Đúng chất liệu',
    text: 'Chọn theo thói quen sử dụng, trẻ nhỏ, thú cưng và thời gian vệ sinh.',
    icon: 'solar:layers-bold-duotone',
  },
  {
    label: 'Đúng cảm giác',
    text: 'Ngồi thử, tựa lưng, duỗi chân — cảm giác thoải mái rất riêng.',
    icon: 'solar:chair-2-bold-duotone',
  },
];

export default function Sofa21Pages() {
  const { pathname } = useLocation();
  const current = resolvePage(pathname);
  const section = sectionOf(current.path);
  const children = current.children || [];
  const crumb = current.path.split('/').filter(Boolean).slice(1);
  const isProduct = current.path.includes('/products');
  const needsForm =
    /contact|visit|consult|register|quote|ticket|apply|forgot-password|chat|oem/.test(current.path);
  const image = heroImageFor(section, current.path);
  const actionLabel =
    current.path.includes('account') || current.path.includes('member')
      ? 'Mở tài khoản'
      : current.path.includes('cart') || current.path.includes('checkout')
        ? 'Tiếp tục mua sắm'
        : 'Nhận tư vấn miễn phí';

  return (
    <>
      <Helmet>
        <title>{current.title} — Sofa21</title>
        <meta
          name="description"
          content={`${current.title} — Sofa21. Tư vấn sofa và giải pháp nội thất cho không gian sống.`}
        />
      </Helmet>
      <Box sx={{ bgcolor: SOFA21_COLORS.cream, minHeight: '70vh', pb: { xs: 8, md: 12 } }}>
        {/* Editorial cover keeps the same vivid Sofa21 art direction on every route. */}
        <Box
          component="section"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: SOFA21_COLORS.midnight,
            color: 'common.white',
            py: { xs: 7, md: 10 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(100deg, rgba(48,47,41,.96) 0%, rgba(48,47,41,.84) 50%, rgba(48,47,41,.22) 100%), url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 300,
              height: 300,
              top: -150,
              right: { xs: -120, md: '8%' },
              border: `1px solid ${SOFA21_COLORS.butter}77`,
              borderRadius: '50%',
              boxShadow: `0 0 0 34px ${SOFA21_COLORS.butter}12, 0 0 0 72px ${SOFA21_COLORS.butter}0a`,
            }}
          />
          <Container sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid xs={12} md={8}>
                <Stack spacing={2.2} sx={{ maxWidth: 750 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 28, height: 2, bgcolor: SOFA21_COLORS.persimmon }} />
                    <Typography
                      variant="overline"
                      sx={{ letterSpacing: 2.5, color: SOFA21_COLORS.butter }}
                    >
                      {section.toUpperCase()} · SOFA21
                    </Typography>
                  </Stack>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: { xs: 40, md: 66 },
                      lineHeight: 1.02,
                      fontWeight: 500,
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      letterSpacing: '-.035em',
                    }}
                  >
                    {current.title}
                  </Typography>
                  <Typography
                    sx={{
                      maxWidth: 660,
                      fontSize: { xs: 16, md: 19 },
                      lineHeight: 1.8,
                      color: 'rgba(255,255,255,.77)',
                    }}
                  >
                    {descriptionFor(current.title, section)}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    alignItems="center"
                    useFlexGap
                    sx={{ pt: 0.5 }}
                  >
                    <Button
                      component={RouterLink}
                      href="/sofa21"
                      size="small"
                      startIcon={<Iconify icon="solar:home-2-bold-duotone" />}
                      sx={{ color: 'rgba(255,255,255,.8)', minWidth: 0 }}
                    >
                      Trang chủ
                    </Button>
                    {crumb.map((part, index) => (
                      <Chip
                        key={`${part}-${index}`}
                        label={titleCase(part)}
                        size="small"
                        sx={{
                          color: 'white',
                          bgcolor: 'rgba(255,255,255,.12)',
                          border: '1px solid rgba(255,255,255,.2)',
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Grid>
              <Grid xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 285,
                    ml: 'auto',
                    p: 1.2,
                    bgcolor: 'rgba(253,251,247,.96)',
                    borderRadius: 1.5,
                    boxShadow: '0 24px 55px rgba(0,0,0,.2)',
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={current.title}
                    sx={{
                      width: 1,
                      height: 290,
                      objectFit: 'cover',
                      borderRadius: 0.75,
                    }}
                  />
                  <Typography
                    sx={{
                      py: 1.1,
                      textAlign: 'center',
                      color: SOFA21_COLORS.ink,
                      fontSize: 11,
                      letterSpacing: 2,
                    }}
                  >
                    CHẠM · THỬ · CHỌN
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Container sx={{ pt: { xs: 5, md: 8 } }}>
          {children.length > 0 && (
            <>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ md: 'end' }}
                spacing={2}
                sx={{ mb: 3.5 }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: SOFA21_COLORS.persimmonDeep, letterSpacing: 2 }}
                  >
                    KHÁM PHÁ THEO NHU CẦU
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      mt: 0.5,
                      fontWeight: 800,
                      letterSpacing: '-.04em',
                      fontSize: { xs: 30, md: 44 },
                    }}
                  >
                    {children.length > 8 ? 'Các nội dung nổi bật' : 'Nội dung liên quan'}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ maxWidth: 420, color: SOFA21_COLORS.inkSoft, lineHeight: 1.8 }}
                >
                  Chọn một nội dung để xem thông tin chi tiết và các lựa chọn phù hợp.
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {children.map((item, index) => (
                  <Grid
                    key={`${item.title}-${item.path}`}
                    xs={12}
                    sm={6}
                    md={children.length > 8 ? 3 : 4}
                  >
                    <Card
                      component={RouterLink}
                      href={item.path}
                      sx={{
                        p: 2.5,
                        height: 1,
                        minHeight: 185,
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        color: SOFA21_COLORS.ink,
                        borderRadius: 1.25,
                        bgcolor: index % 4 === 1 ? SOFA21_COLORS.periwinkle : SOFA21_COLORS.paper,
                        border: `1px solid ${SOFA21_COLORS.line}`,
                        boxShadow: 'none',
                        transition: 'transform .25s, box-shadow .25s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 16px 32px rgba(41,40,33,.10)',
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2.2 }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: index % 3 === 0 ? SOFA21_COLORS.butter : 'rgba(77,95,234,.12)',
                            color: SOFA21_COLORS.cobalt,
                            borderRadius: '50%',
                          }}
                        >
                          <Iconify
                            icon={
                              item.icon ||
                              (isProduct
                                ? 'solar:armchair-bold-duotone'
                                : 'solar:stars-bold-duotone')
                            }
                            width={22}
                          />
                        </Box>
                        <Typography
                          sx={{ fontSize: 12, fontWeight: 800, color: SOFA21_COLORS.persimmon }}
                        >{`${String(index + 1).padStart(2, '0')}`}</Typography>
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.7 }}>
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: SOFA21_COLORS.inkSoft, lineHeight: 1.65 }}
                      >
                        {descriptionFor(item.title, section)}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.8}
                        alignItems="center"
                        sx={{ mt: 'auto', pt: 1.5, color: SOFA21_COLORS.cobalt }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
                          KHÁM PHÁ
                        </Typography>
                        <Iconify icon="solar:arrow-right-linear" width={17} />
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {isProduct && (
            <Box sx={{ mt: children.length ? 9 : 1 }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ md: 'end' }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: SOFA21_COLORS.persimmonDeep, letterSpacing: 2 }}
                  >
                    SOFA21 SELECTED
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      mt: 0.5,
                      fontWeight: 800,
                      letterSpacing: '-.04em',
                      fontSize: { xs: 30, md: 44 },
                    }}
                  >
                    Sản phẩm được yêu thích
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  href="/sofa21/compare"
                  endIcon={<Iconify icon="solar:arrow-right-linear" />}
                  sx={{ color: SOFA21_COLORS.cobalt }}
                >
                  So sánh sản phẩm
                </Button>
              </Stack>
              <Grid container spacing={2.5}>
                {SOFA21_PRODUCTS.map((product, index) => (
                  <Grid key={product.name} xs={12} sm={6} md={4}>
                    <Card
                      component={RouterLink}
                      href="/sofa21/products/detail/information"
                      sx={{
                        display: 'block',
                        p: 1.3,
                        textDecoration: 'none',
                        color: SOFA21_COLORS.ink,
                        bgcolor: SOFA21_COLORS.paper,
                        boxShadow: 'none',
                        borderRadius: index === 1 ? '80px 80px 16px 16px' : 2.5,
                        transition: 'transform .25s',
                        '&:hover': { transform: 'translateY(-5px)' },
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          width: 1,
                          height: { xs: 250, md: 310 },
                          objectFit: 'cover',
                          borderRadius: index === 1 ? '80px 80px 12px 12px' : 2,
                        }}
                      />
                      <Stack spacing={0.5} sx={{ px: 1, pt: 1.5, pb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {product.category}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {product.name}
                        </Typography>
                        <Typography sx={{ color: SOFA21_COLORS.cobalt, fontWeight: 800 }}>
                          {product.price}
                        </Typography>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {!children.length && !isProduct && (
            <Grid container spacing={3.5} sx={{ mt: { xs: 3, md: 5 } }}>
              <Grid xs={12} md={7}>
                <Box
                  sx={{
                    p: { xs: 3, md: 4.5 },
                    bgcolor: SOFA21_COLORS.paper,
                    border: `1px solid ${SOFA21_COLORS.line}`,
                    borderRadius: '16px 80px 16px 16px',
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{ color: SOFA21_COLORS.persimmonDeep, letterSpacing: 2 }}
                  >
                    SOFA21 · TẬN TÂM TỪ TƯ VẤN
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ mt: 1.5, mb: 2, fontWeight: 800, letterSpacing: '-.035em' }}
                  >
                    Giải pháp phù hợp bắt đầu từ nhu cầu thật.
                  </Typography>
                  <Typography sx={{ color: SOFA21_COLORS.inkSoft, lineHeight: 1.9 }}>
                    Mỗi gia đình có một cách sinh hoạt riêng. Sofa21 giúp bạn cân nhắc diện tích,
                    kiểu dáng, chất liệu và ngân sách để chọn được phương án phù hợp. Bạn có thể
                    trao đổi với chuyên viên hoặc ghé showroom để trải nghiệm trực tiếp.
                  </Typography>
                  {needsForm && (
                    <Stack
                      component="form"
                      spacing={2}
                      sx={{ mt: 3 }}
                      onSubmit={(event) => event.preventDefault()}
                    >
                      <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                          <TextField fullWidth label="Họ và tên" size="small" />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField fullWidth label="Số điện thoại" size="small" />
                        </Grid>
                        <Grid xs={12}>
                          <TextField
                            fullWidth
                            label="Nội dung cần hỗ trợ"
                            multiline
                            minRows={3}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          alignSelf: 'flex-start',
                          px: 2.5,
                          borderRadius: 1.25,
                          bgcolor: SOFA21_COLORS.cobalt,
                          '&:hover': { bgcolor: SOFA21_COLORS.cobaltDeep },
                        }}
                      >
                        Gửi yêu cầu
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Grid>
              <Grid xs={12} md={5}>
                <Stack spacing={1.5}>
                  {quickTips.map((tip, index) => (
                    <Card
                      key={tip.label}
                      sx={{
                        p: 2.2,
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                        bgcolor: index === 1 ? SOFA21_COLORS.periwinkle : SOFA21_COLORS.paper,
                        border: `1px solid ${SOFA21_COLORS.line}`,
                        borderRadius: 2.5,
                        boxShadow: 'none',
                      }}
                    >
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          flex: '0 0 auto',
                          display: 'grid',
                          placeItems: 'center',
                          color: SOFA21_COLORS.cobalt,
                          bgcolor: SOFA21_COLORS.butter,
                          borderRadius: '50%',
                        }}
                      >
                        <Iconify icon={tip.icon} width={22} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {tip.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 0.45, color: SOFA21_COLORS.inkSoft, lineHeight: 1.65 }}
                        >
                          {tip.text}
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          )}

          {/* A secondary discovery band makes category and detail pages feel authored, not empty templates. */}
          <Box
            sx={{
              mt: 8,
              overflow: 'hidden',
              bgcolor: SOFA21_COLORS.midnight,
              color: 'white',
              borderRadius: 1.5,
            }}
          >
            <Grid container alignItems="stretch">
              <Grid xs={12} md={7} sx={{ p: { xs: 3, md: 4.5 } }}>
                <Typography
                  variant="overline"
                  sx={{ color: SOFA21_COLORS.butter, letterSpacing: 2 }}
                >
                  BẠN CẦN MỘT GỢI Ý RIÊNG?
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, letterSpacing: '-.035em' }}>
                  Cùng tìm chiếc sofa đúng nhà.
                </Typography>
                <Typography sx={{ mt: 1, color: 'rgba(255,255,255,.72)', lineHeight: 1.8 }}>
                  Chia sẻ không gian, ngân sách và thói quen sử dụng — chuyên viên Sofa21 sẽ gợi ý
                  phương án phù hợp.
                </Typography>
                <Button
                  component={RouterLink}
                  href={current.path.includes('/contact') ? '/sofa21/showrooms' : '/sofa21/contact'}
                  variant="contained"
                  endIcon={<Iconify icon="solar:arrow-right-linear" />}
                  sx={{
                    mt: 2.5,
                    px: 2.5,
                    borderRadius: 1.25,
                    bgcolor: SOFA21_COLORS.persimmon,
                    color: 'white',
                    '&:hover': { bgcolor: SOFA21_COLORS.persimmonDeep },
                  }}
                >
                  {actionLabel}
                </Button>
              </Grid>
              <Grid xs={12} md={5}>
                <Box
                  component="img"
                  src={image}
                  alt="Không gian Sofa21"
                  sx={{
                    display: 'block',
                    width: 1,
                    height: { xs: 220, md: '100%' },
                    minHeight: { md: 260 },
                    objectFit: 'cover',
                    clipPath: { md: 'ellipse(95% 110% at 100% 50%)' },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
