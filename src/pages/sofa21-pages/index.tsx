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
  if (path.startsWith('/sofa21/products/'))
    return {
      title: 'Chi tiết sản phẩm',
      path,
      parent: ALL_NODES.find((item) => item.path === '/sofa21/products'),
    };
  const last = path.split('/').filter(Boolean).at(-1) || 'support';
  const root = ALL_NODES.find((item) => path.startsWith(item.path) && item.path !== '/sofa21');
  return { title: titleCase(last), path, parent: root };
}

function descriptionFor(title: string, section: string) {
  if (section === 'Sản phẩm')
    return `Khám phá ${title.toLowerCase()} được chọn lọc theo công năng, chất liệu và phong cách. Mỗi mẫu sofa được thiết kế để phù hợp với không gian sống thực tế.`;
  if (section === 'Giới thiệu')
    return `${title} là một phần trong hành trình Sofa21 tạo nên những sản phẩm chỉn chu, bền đẹp và phù hợp với nhịp sống gia đình Việt.`;
  if (section === 'Dự án')
    return `Cùng nhìn lại những không gian Sofa21 đã đồng hành hoàn thiện, từ khâu lựa chọn sản phẩm đến tư vấn bố trí và bàn giao.`;
  if (section === 'Showroom')
    return `Trải nghiệm trực tiếp kiểu dáng, chất liệu và độ êm của sofa. Đội ngũ tư vấn giúp bạn lựa chọn giải pháp phù hợp với nhà mình.`;
  if (section === 'Dịch vụ')
    return `Từ ý tưởng ban đầu đến sản phẩm hoàn thiện, Sofa21 đồng hành bằng dịch vụ tư vấn, thiết kế và sản xuất linh hoạt.`;
  if (section === 'Blog')
    return `Góc chia sẻ Sofa21: kinh nghiệm chọn sofa, thông tin vật liệu và cảm hứng thiết kế giúp bạn chăm chút không gian sống.`;
  if (section.includes('Tài khoản') || section === 'Khu vực thành viên')
    return `Quản lý thông tin, đơn hàng và quyền lợi thành viên Sofa21 một cách thuận tiện, tập trung và an toàn.`;
  if (section === 'Hỗ trợ')
    return `Tìm câu trả lời, chính sách và hướng dẫn sử dụng dịch vụ. Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn.`;
  if (section === 'Đại lý B2B')
    return `Cùng phát triển thị trường với các giải pháp phân phối, báo giá dự án và sản xuất theo yêu cầu từ Sofa21.`;
  if (section === 'Khuyến mãi / Hậu mãi')
    return `Dịch vụ chăm sóc sofa minh bạch, giúp sản phẩm luôn bền đẹp và đồng hành cùng gia đình qua nhiều năm sử dụng.`;
  return `Tìm hiểu ${title.toLowerCase()} và nhận hỗ trợ trực tiếp từ đội ngũ Sofa21. Chúng tôi luôn sẵn sàng giúp bạn có trải nghiệm thuận tiện hơn.`;
}

function sectionOf(path: string) {
  const section = ALL_NODES.find((item) => item.path === path.split('/').slice(0, 3).join('/'));
  const root = ALL_NODES.find(
    (item) => item.children?.some((child) => path.startsWith(child.path)) || path === item.path
  );
  return root?.title || section?.title || 'Sofa21';
}

const categoryIntro = [
  {
    label: 'Tư vấn chọn kích thước',
    icon: 'solar:ruler-angular-bold-duotone',
    text: 'Đo đạc lối đi và khoảng cách sử dụng để chọn tỷ lệ ghế vừa vặn.',
  },
  {
    label: 'Chọn chất liệu phù hợp',
    icon: 'solar:layers-bold-duotone',
    text: 'Cân nhắc tần suất sử dụng, gia đình có trẻ nhỏ và cách vệ sinh.',
  },
  {
    label: 'Xem thử tại showroom',
    icon: 'solar:map-point-bold-duotone',
    text: 'Ngồi thử, chạm chất liệu và nhận gợi ý phối màu tại cửa hàng.',
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
        <Box
          component="section"
          sx={{
            py: { xs: 7, md: 10 },
            color: 'common.white',
            backgroundImage: `linear-gradient(105deg, rgba(24,53,43,.94), rgba(37,72,59,.78) 55%, rgba(37,72,59,.5)), url(${SOFA21_IMAGES.living})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Container>
            <Stack spacing={2.5} sx={{ maxWidth: 820 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify
                  icon="solar:leaf-bold-duotone"
                  width={20}
                  sx={{ color: SOFA21_COLORS.lime }}
                />
                <Typography variant="overline" sx={{ letterSpacing: 2, color: SOFA21_COLORS.lime }}>
                  {section.toUpperCase()}
                </Typography>
              </Stack>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 40, md: 64 },
                  lineHeight: 1.1,
                  fontWeight: 700,
                  letterSpacing: '-.04em',
                }}
              >
                {current.title}
              </Typography>
              <Typography
                sx={{
                  maxWidth: 680,
                  fontSize: { xs: 16, md: 19 },
                  lineHeight: 1.8,
                  color: 'rgba(255,255,255,.8)',
                }}
              >
                {descriptionFor(current.title, section)}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" useFlexGap>
                <Button
                  component={RouterLink}
                  href="/sofa21"
                  size="small"
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
                      bgcolor: 'rgba(255,255,255,.14)',
                      border: '1px solid rgba(255,255,255,.18)',
                    }}
                  />
                ))}
              </Stack>
            </Stack>
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
                    sx={{ color: SOFA21_COLORS.clay, letterSpacing: 2 }}
                  >
                    KHÁM PHÁ THEO NHU CẦU
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      mt: 0.5,
                      fontWeight: 650,
                      letterSpacing: '-.03em',
                      fontSize: { xs: 28, md: 38 },
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
              <Grid container spacing={2.25}>
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
                        p: 2.75,
                        height: 1,
                        minHeight: 176,
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        color: SOFA21_COLORS.ink,
                        borderRadius: 2.5,
                        bgcolor: SOFA21_COLORS.paper,
                        border: `1px solid ${SOFA21_COLORS.line}`,
                        boxShadow: 'none',
                        transition: 'all .25s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: SOFA21_COLORS.sage,
                          boxShadow: '0 14px 35px rgba(24,53,43,.09)',
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2.5 }}
                      >
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor:
                              index % 3 === 0 ? 'rgba(168,185,166,.35)' : 'rgba(200,135,104,.13)',
                            color: SOFA21_COLORS.forest,
                            borderRadius: 1.5,
                          }}
                        >
                          <Iconify
                            icon={
                              item.icon ||
                              (isProduct
                                ? 'solar:armchair-bold-duotone'
                                : 'solar:arrow-right-up-linear')
                            }
                            width={22}
                          />
                        </Box>
                        <Iconify
                          icon="solar:arrow-right-up-linear"
                          width={20}
                          sx={{ color: SOFA21_COLORS.inkSoft }}
                        />
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 650, mb: 0.8 }}>
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: SOFA21_COLORS.inkSoft, lineHeight: 1.7 }}
                      >
                        {descriptionFor(item.title, section)}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {isProduct && (
            <Box sx={{ mt: children.length ? 8 : 0 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="end"
                spacing={2}
                sx={{ mb: 3 }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: SOFA21_COLORS.clay, letterSpacing: 2 }}
                  >
                    GỢI Ý TỪ SOFA21
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      mt: 0.5,
                      fontWeight: 650,
                      letterSpacing: '-.03em',
                      fontSize: { xs: 28, md: 38 },
                    }}
                  >
                    Sản phẩm được yêu thích
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  href="/sofa21/compare"
                  sx={{ color: SOFA21_COLORS.forest }}
                >
                  So sánh sản phẩm
                </Button>
              </Stack>
              <Grid container spacing={3}>
                {SOFA21_PRODUCTS.map((product) => (
                  <Grid key={product.name} xs={12} sm={6} md={4}>
                    <Card
                      component={RouterLink}
                      href="/sofa21/products/detail/information"
                      sx={{
                        display: 'block',
                        textDecoration: 'none',
                        color: SOFA21_COLORS.ink,
                        bgcolor: SOFA21_COLORS.paper,
                        boxShadow: 'none',
                        borderRadius: 2.5,
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          width: 1,
                          height: { xs: 270, md: 320 },
                          objectFit: 'cover',
                          borderRadius: 2.5,
                        }}
                      />
                      <Stack spacing={0.6} sx={{ pt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {product.category}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 650 }}>
                          {product.name}
                        </Typography>
                        <Typography sx={{ color: SOFA21_COLORS.forest, fontWeight: 700 }}>
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
            <Grid container spacing={4} sx={{ mt: 1 }}>
              <Grid xs={12} md={7}>
                <Box
                  sx={{
                    p: { xs: 3, md: 5 },
                    bgcolor: SOFA21_COLORS.paper,
                    border: `1px solid ${SOFA21_COLORS.line}`,
                    borderRadius: 2.5,
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{ color: SOFA21_COLORS.clay, letterSpacing: 2 }}
                  >
                    SOFA21 · TẬN TÂM TỪ TƯ VẤN
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1.5, mb: 2, fontWeight: 650 }}>
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
                          bgcolor: SOFA21_COLORS.forest,
                          '&:hover': { bgcolor: SOFA21_COLORS.forestDeep },
                        }}
                      >
                        Gửi yêu cầu
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Grid>
              <Grid xs={12} md={5}>
                <Stack spacing={2}>
                  {categoryIntro.map((item) => (
                    <Card
                      key={item.label}
                      sx={{
                        p: 2.5,
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                        bgcolor: 'rgba(255,254,250,.72)',
                        border: `1px solid ${SOFA21_COLORS.line}`,
                        borderRadius: 2,
                        boxShadow: 'none',
                      }}
                    >
                      <Iconify
                        icon={item.icon}
                        width={24}
                        sx={{ mt: 0.4, color: SOFA21_COLORS.forest }}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 650 }}>
                          {item.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 0.5, color: SOFA21_COLORS.inkSoft, lineHeight: 1.7 }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          )}

          <Box
            sx={{
              mt: 8,
              p: { xs: 3, md: 4 },
              borderRadius: 2.5,
              bgcolor: SOFA21_COLORS.forestDeep,
              color: 'common.white',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid xs={12} md={8}>
                <Typography variant="h5" sx={{ fontWeight: 650 }}>
                  Bạn cần một gợi ý phù hợp hơn?
                </Typography>
                <Typography sx={{ mt: 0.8, color: 'rgba(255,255,255,.72)' }}>
                  Chia sẻ không gian và nhu cầu của bạn, chuyên viên Sofa21 sẽ liên hệ tư vấn.
                </Typography>
              </Grid>
              <Grid xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                <Button
                  component={RouterLink}
                  href={current.path.includes('/contact') ? '/sofa21/showrooms' : '/sofa21/contact'}
                  variant="contained"
                  endIcon={<Iconify icon="solar:arrow-right-linear" />}
                  sx={{
                    bgcolor: SOFA21_COLORS.lime,
                    color: SOFA21_COLORS.ink,
                    '&:hover': { bgcolor: '#e2edc2' },
                  }}
                >
                  {actionLabel}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
