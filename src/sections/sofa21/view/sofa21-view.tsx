import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { SOFA21_COLORS, SOFA21_IMAGES, SOFA21_PRODUCTS } from '../sofa21-data';

const features = [
  {
    icon: 'solar:hand-stars-bold-duotone',
    title: 'Thiết kế có chủ đích',
    text: 'Tỷ lệ cân đối, đường nét tinh giản, dễ hòa vào nhịp sống của mỗi gia đình.',
  },
  {
    icon: 'solar:layers-bold-duotone',
    title: 'Vật liệu được tuyển chọn',
    text: 'Khung vững chắc, đệm nâng đỡ tốt và chất liệu bọc phù hợp nhu cầu sử dụng.',
  },
  {
    icon: 'solar:shield-check-bold-duotone',
    title: 'Đồng hành dài lâu',
    text: 'Tư vấn, giao lắp và chăm sóc sau mua rõ ràng trong suốt quá trình sử dụng.',
  },
];

export function Sofa21View() {
  return (
    <Box sx={{ bgcolor: SOFA21_COLORS.cream, color: SOFA21_COLORS.ink, overflow: 'hidden' }}>
      <Box
        component="section"
        sx={{
          minHeight: { xs: 700, md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          mt: 'calc(var(--layout-header-desktop-height) * -1)',
          pt: 'var(--layout-header-desktop-height)',
          backgroundImage: `linear-gradient(90deg, rgba(18,35,29,.82) 0%, rgba(18,35,29,.55) 48%, rgba(18,35,29,.08) 100%), url(${SOFA21_IMAGES.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 14 } }}>
          <Stack spacing={3} sx={{ maxWidth: 700, color: 'common.white' }}>
            <Typography variant="overline" sx={{ color: SOFA21_COLORS.lime, letterSpacing: 3 }}>
              SOFA21 · SỐNG ĐẸP THEO CÁCH RIÊNG
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 48, md: 82 },
                lineHeight: 1.04,
                fontWeight: 700,
                letterSpacing: '-.045em',
              }}
            >
              Một chiếc sofa.
              <br />
              <Box component="span" sx={{ color: SOFA21_COLORS.lime }}>
                Muôn cách
              </Box>{' '}
              trở về.
            </Typography>
            <Typography
              sx={{
                maxWidth: 570,
                fontSize: { xs: 17, md: 20 },
                lineHeight: 1.8,
                color: 'rgba(255,255,255,.82)',
              }}
            >
              Sofa được thiết kế để vừa vặn với không gian, thói quen và những khoảnh khắc sum vầy
              của gia đình Việt.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
              <Button
                component={RouterLink}
                href="/sofa21/products"
                variant="contained"
                size="large"
                endIcon={<Iconify icon="solar:arrow-right-linear" />}
                sx={{
                  bgcolor: SOFA21_COLORS.lime,
                  color: SOFA21_COLORS.ink,
                  '&:hover': { bgcolor: '#e2edc2' },
                }}
              >
                Khám phá sản phẩm
              </Button>
              <Button
                component={RouterLink}
                href="/sofa21/showrooms/visit"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,.6)',
                  color: 'common.white',
                  '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,.08)' },
                }}
              >
                Ghé showroom
              </Button>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ pt: { xs: 3, md: 6 } }}>
              {[
                ['12+', 'năm kinh nghiệm'],
                ['8.000+', 'không gian hoàn thiện'],
                ['05', 'năm bảo hành khung'],
              ].map(([value, label]) => (
                <Box key={label}>
                  <Typography variant="h4" sx={{ color: SOFA21_COLORS.lime, fontWeight: 700 }}>
                    {value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.7)' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            right: { md: '8%' },
            bottom: { md: 48 },
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1.5,
            color: 'white',
          }}
        >
          <Box sx={{ width: 54, height: 1, bgcolor: SOFA21_COLORS.lime }} />
          <Typography variant="caption" sx={{ letterSpacing: 2 }}>
            THIẾT KẾ · SẢN XUẤT · LẮP ĐẶT
          </Typography>
        </Box>
      </Box>

      <Container component="section" sx={{ py: { xs: 9, md: 14 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid xs={12} md={5}>
            <Typography variant="overline" sx={{ color: SOFA21_COLORS.forest, letterSpacing: 2 }}>
              KHÔNG GIAN CỦA BẠN, CÂU CHUYỆN CỦA BẠN
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontWeight: 650,
                letterSpacing: '-.035em',
                fontSize: { xs: 36, md: 54 },
              }}
            >
              Đẹp từ cảm giác
              <br />
              ngồi xuống.
            </Typography>
            <Typography sx={{ color: SOFA21_COLORS.inkSoft, lineHeight: 1.9, mb: 3 }}>
              Chúng tôi tin chiếc sofa tốt không chỉ đẹp trong ảnh. Nó cần nâng đỡ đúng, bền bỉ với
              sinh hoạt hàng ngày và khiến bạn muốn nán lại lâu hơn trong chính ngôi nhà mình.
            </Typography>
            <Button
              component={RouterLink}
              href="/sofa21/about"
              endIcon={<Iconify icon="solar:arrow-right-linear" />}
              sx={{ color: SOFA21_COLORS.forest, px: 0 }}
            >
              Câu chuyện Sofa21
            </Button>
          </Grid>
          <Grid xs={12} md={7}>
            <Box
              component="img"
              src={SOFA21_IMAGES.living}
              alt="Không gian phòng khách Sofa21"
              sx={{
                display: 'block',
                width: 1,
                height: { xs: 330, md: 520 },
                objectFit: 'cover',
                borderRadius: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>

      <Box component="section" sx={{ py: { xs: 9, md: 13 }, bgcolor: SOFA21_COLORS.paper }}>
        <Container>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ md: 'end' }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 5 }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: SOFA21_COLORS.clay, letterSpacing: 2 }}>
                ĐƯỢC YÊU THÍCH
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  mt: 1,
                  fontWeight: 650,
                  letterSpacing: '-.035em',
                  fontSize: { xs: 36, md: 52 },
                }}
              >
                Những thiết kế nổi bật
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              href="/sofa21/products"
              endIcon={<Iconify icon="solar:arrow-right-linear" />}
              sx={{ color: SOFA21_COLORS.forest }}
            >
              Xem tất cả sản phẩm
            </Button>
          </Stack>
          <Grid container spacing={3}>
            {SOFA21_PRODUCTS.map((product) => (
              <Grid key={product.name} xs={12} sm={6} md={4}>
                <Card
                  component={RouterLink}
                  href="/sofa21/products"
                  sx={{
                    display: 'block',
                    height: 1,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    borderRadius: 2.5,
                    boxShadow: 'none',
                    bgcolor: 'transparent',
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2.5 }}>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        display: 'block',
                        width: 1,
                        height: { xs: 300, md: 370 },
                        objectFit: 'cover',
                        transition: 'transform .5s',
                        '&:hover': { transform: 'scale(1.04)' },
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        px: 1.5,
                        py: 0.7,
                        bgcolor: SOFA21_COLORS.lime,
                        borderRadius: 10,
                        color: SOFA21_COLORS.ink,
                        fontSize: 12,
                      }}
                    >
                      {product.tag}
                    </Box>
                  </Box>
                  <Stack spacing={0.75} sx={{ pt: 2.2 }}>
                    <Typography variant="caption" sx={{ color: SOFA21_COLORS.inkSoft }}>
                      {product.category}
                    </Typography>
                    <Typography variant="h6" sx={{ color: SOFA21_COLORS.ink, fontWeight: 650 }}>
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
        </Container>
      </Box>

      <Container component="section" sx={{ py: { xs: 9, md: 13 } }}>
        <Grid container spacing={2}>
          {features.map((feature, i) => (
            <Grid key={feature.title} xs={12} md={4}>
              <Stack
                spacing={2}
                sx={{
                  height: 1,
                  p: { xs: 3, md: 4 },
                  border: `1px solid ${SOFA21_COLORS.line}`,
                  borderRadius: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    color: SOFA21_COLORS.forest,
                    bgcolor: i === 1 ? 'rgba(200,135,104,.14)' : 'rgba(168,185,166,.3)',
                  }}
                >
                  <Iconify icon={feature.icon} width={24} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 650 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: SOFA21_COLORS.inkSoft, lineHeight: 1.8 }}>
                  {feature.text}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        component="section"
        sx={{ bgcolor: SOFA21_COLORS.forestDeep, color: 'common.white', py: { xs: 8, md: 11 } }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid xs={12} md={7}>
              <Typography variant="overline" sx={{ color: SOFA21_COLORS.lime, letterSpacing: 2 }}>
                CÙNG BẮT ĐẦU
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  mt: 1,
                  fontWeight: 650,
                  letterSpacing: '-.03em',
                  fontSize: { xs: 36, md: 54 },
                }}
              >
                Tìm chiếc sofa
                <br />
                dành cho nhà bạn.
              </Typography>
            </Grid>
            <Grid xs={12} md={5}>
              <Typography sx={{ color: 'rgba(255,255,255,.74)', lineHeight: 1.8, mb: 3 }}>
                Đội ngũ Sofa21 sẵn sàng tư vấn kích thước, chất liệu và cấu hình phù hợp.
              </Typography>
              <Button
                component={RouterLink}
                href="/sofa21/contact"
                variant="contained"
                endIcon={<Iconify icon="solar:arrow-right-linear" />}
                sx={{
                  bgcolor: SOFA21_COLORS.lime,
                  color: SOFA21_COLORS.ink,
                  '&:hover': { bgcolor: '#e2edc2' },
                }}
              >
                Nhận tư vấn
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
