import { useState } from 'react';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { varAlpha, textGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { formatSofa2Price } from 'src/sections/sofa2/sofa2-pages-data';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import { findSofa2CatalogProduct, useSofa2CatalogProducts } from 'src/sections/sofa2/sofa2-catalog-client';
import {
  SOFA2_PORTAL_CUSTOMER_ID,
  SOFA2_PORTAL_CUSTOMER_NAME,
} from 'src/sections/sofa2/sofa2-customer-portal';
import {
  addSofa2CartLine,
  makeSofa2CartRow,
  parseSofa2CartItems,
} from 'src/sections/sofa2/sofa2-commerce-store';

// ----------------------------------------------------------------------

const COLOR_SWATCH: Record<string, string> = {
  'Be': '#d9c5a0',
  'Xám': '#9e9e9e',
  'Nâu': '#6d4c3f',
  'Đen': '#222',
  'Trắng': '#f5f5f5',
  'Nâu đậm': '#4e342e',
  'Xám đậm': '#555',
  'Xanh navy': '#1a237e',
};

const TABS = [
  { value: 'info', label: 'Thông tin sản phẩm' },
  { value: 'specs', label: 'Thông số kỹ thuật' },
  { value: 'care', label: 'Hướng dẫn bảo quản' },
];

export default function Page() {
  const theme = useTheme();
  const { id = '' } = useParams();
  const { products } = useSofa2CatalogProducts();
  const productSeoRows = useSofa2AdminRows('seo', 'product', { load: false }).rows;
  const productReviewRows = useSofa2AdminRows('catalog', 'product-reviews').rows;
  const productQuestionRows = useSofa2AdminRows('catalog', 'product-questions').rows;
  const [tab, setTab] = useState('info');
  const [selectedImage, setSelectedImage] = useState(0);
  const [show360, setShow360] = useState(false);
  const [selectedVariantSku, setSelectedVariantSku] = useState('');
  const [added, setAdded] = useState(false);
  const cartStore = useSofa2AdminRows('shopping', 'cart');
  const profileStore = useSofa2AdminRows('customer', 'profiles');
  const profile = profileStore.rows.find(
    (row) => String(row.customerId) === SOFA2_PORTAL_CUSTOMER_ID
  );

  const product = findSofa2CatalogProduct(products, id);
  const productSeo = productSeoRows.find((row) => String(row.url ?? '') === `/sofa2/products/${product?.id ?? id}`);
  const productIndexable = Boolean(product?.indexable)
    && !['không', 'false', '0'].includes(String(productSeo?.indexable ?? 'Có').toLowerCase())
    && !['không', 'false', '0'].includes(String(productSeo?.published ?? 'Có').toLowerCase());
  const productCanonical = String(productSeo?.canonical ?? '') || `https://luxesofa.vn/sofa2/products/${product?.id ?? id}`;
  const selectedVariant = product?.variants.find((variant) => String(variant.sku ?? '') === selectedVariantSku);
  const variantUnavailable = selectedVariant ? Number(selectedVariant.stock ?? 0) <= 0 : false;

  if (!product) {
    return (
      <>
        <Helmet><title>Không tìm thấy sản phẩm - LUXE Sofa</title></Helmet>
        <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', py: 20 }}>
          <Iconify icon="solar:cart-cross-bold-duotone" width={72} sx={{ color: 'text.disabled' }} />
          <Typography variant="h4">Không tìm thấy sản phẩm</Typography>
          <Button component={RouterLink} href="/sofa2/products" variant="contained">Quay lại danh sách</Button>
        </Stack>
      </>
    );
  }

  const matchesProduct = (row: Record<string, unknown>) => {
    const linkedProduct = String(row.product ?? '').trim().toLowerCase();
    return linkedProduct === product.name.toLowerCase() || linkedProduct === product.sku.toLowerCase() || linkedProduct === product.id.toLowerCase();
  };
  const reviews = productReviewRows.filter((row) => matchesProduct(row) && String(row.status) === 'Đã xuất bản');
  const questions = productQuestionRows.filter((row) => matchesProduct(row) && String(row.status) === 'Đã xuất bản');
  const averageRating = reviews.length
    ? reviews.reduce((sum, row) => sum + Number(row.rating ?? 0), 0) / reviews.length
    : product.rating;

  const related = product.relatedProductIds.length
    ? product.relatedProductIds.map((relatedId) => products.find((item) => item.id === relatedId || item.slug === relatedId || item.sku === relatedId || item.name === relatedId)).filter((item): item is NonNullable<typeof item> => Boolean(item) && item?.id !== product.id).slice(0, 4)
    : products.filter((p) => p.id !== product.id && (p.category === product.category || p.style === product.style)).slice(0, 4);
  const images = product.images?.length ? product.images : [product.image];
  const { videoUrl } = product;
  const videoEmbedUrl = /youtu\.be\//i.test(videoUrl)
    ? `https://www.youtube-nocookie.com/embed/${videoUrl.split(/youtu\.be\//i)[1]?.split(/[?&]/)[0]}`
    : /youtube\.com\/watch/i.test(videoUrl)
      ? `https://www.youtube-nocookie.com/embed/${videoUrl.match(/[?&]v=([^&]+)/i)?.[1] ?? ''}`
      : /vimeo\.com\//i.test(videoUrl)
        ? `https://player.vimeo.com/video/${videoUrl.split(/vimeo\.com\//i)[1]?.split(/[?&]/)[0]}`
        : '';
  const addToCart = () => {
    const cartIndex = cartStore.rows.findIndex(
      (row) => String(row.customerId) === SOFA2_PORTAL_CUSTOMER_ID
    );
    const existing = cartIndex >= 0 ? cartStore.rows[cartIndex] : undefined;
    if (!product.available || variantUnavailable) return;
    const nextItems = addSofa2CartLine(parseSofa2CartItems(existing?.items), {
      id: String(selectedVariant?.sku ?? product.id),
      name: selectedVariant ? `${product.name} — ${selectedVariant.option}` : product.name,
      price: Number(selectedVariant?.price ?? product.price),
      image: String(selectedVariant?.image ?? product.image),
      material: product.material,
      qty: 1,
    });
    const updated = makeSofa2CartRow(
      nextItems,
      {
        customerId: SOFA2_PORTAL_CUSTOMER_ID,
        name: String(profile?.name || SOFA2_PORTAL_CUSTOMER_NAME),
        phone: String(profile?.phone ?? ''),
        email: String(profile?.email ?? ''),
      },
      existing
    );
    if (cartIndex < 0) cartStore.createRow(updated);
    else cartStore.updateRow(cartIndex, updated);
    setAdded(true);
  };

  return (
    <>
      <Helmet>
        <title>{String(productSeo?.title ?? '') || product.metaTitle || `${product.name} - LUXE Sofa`}</title>
        <meta name="description" content={String(productSeo?.description ?? '') || product.metaDescription || product.description} />
        <meta name="robots" content={productIndexable ? 'index, follow' : 'noindex, nofollow'} />
        <link rel="canonical" href={productCanonical} />
        {productIndexable && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              '@id': `${productCanonical}#product`,
              name: product.name,
              description: product.description,
              image: images,
              sku: product.sku,
              material: product.material,
              color: product.colors,
              url: productCanonical,
              brand: { '@type': 'Brand', name: 'LUXE Sofa' },
              aggregateRating: reviews.length > 0 ? {
                '@type': 'AggregateRating',
                ratingValue: averageRating,
                reviewCount: reviews.length,
              } : undefined,
              offers: {
                '@type': 'Offer',
                url: productCanonical,
                priceCurrency: 'VND',
                price: Number(selectedVariant?.price ?? product.price),
                availability: product.available && !variantUnavailable
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition',
                seller: { '@type': 'Organization', name: 'LUXE Sofa' },
              },
            }).replace(/</g, '\\u003c')}
          </script>
        )}
      </Helmet>

      <Sofa2PageHero overline="Chi tiết sản phẩm" title={product.name} subtitle={product.description} image={product.image} />

      {/* Overview */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container component={MotionViewport}>
          <Grid container spacing={{ xs: 5, md: 8 }}>
            {/* Gallery */}
            <Grid xs={12} md={6}>
              <Stack spacing={2} component={m.div} variants={varFade({ distance: 24 }).inLeft}>
                <Box component="img" src={show360 && product.images360.length ? product.images360[selectedImage % product.images360.length] : images[selectedImage % images.length]} alt={product.name} sx={{ width: 1, borderRadius: 2, aspectRatio: '4/3', objectFit: 'cover' }} />
                {(product.images360.length > 0 || images.length > 1) && (
                  <Stack direction="row" spacing={1}>
                    {product.images360.length > 0 && <Button size="small" variant={show360 ? 'contained' : 'outlined'} onClick={() => { setShow360(true); setSelectedImage(0); }}>Xem ảnh 360°</Button>}
                    {images.length > 0 && <Button size="small" variant={!show360 ? 'contained' : 'outlined'} onClick={() => { setShow360(false); setSelectedImage(0); }}>Thư viện ảnh</Button>}
                    {show360 && <><Button size="small" onClick={() => setSelectedImage((index) => (index - 1 + product.images360.length) % product.images360.length)}>Góc trước</Button><Button size="small" onClick={() => setSelectedImage((index) => (index + 1) % product.images360.length)}>Góc tiếp</Button></>}
                  </Stack>
                )}
                {!show360 && <Stack direction="row" spacing={1.5}>
                  {images.map((src, idx) => (
                    <Box
                      key={idx}
                      component="img"
                      src={src}
                      alt={`${product.name} ${idx + 1}`}
                      onClick={() => setSelectedImage(idx)}
                      sx={{ width: 80, height: 60, borderRadius: 1, objectFit: 'cover', cursor: 'pointer', border: (t) => `2px solid ${idx === selectedImage ? t.vars.palette.primary.main : 'transparent'}` }}
                    />
                  ))}
                </Stack>}
              </Stack>
            </Grid>

            {/* Info */}
            <Grid xs={12} md={6}>
              <Stack spacing={3} component={m.div} variants={varFade({ distance: 24 }).inRight}>
                <Typography variant="h2">{product.name}</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating value={averageRating} precision={0.1} readOnly />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{averageRating.toFixed(1)} ({reviews.length || product.reviews} đánh giá)</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'fontWeightBold' }}>{formatSofa2Price(Number(selectedVariant?.price ?? product.price))}</Typography>
                  {product.oldPrice && (
                    <Typography variant="h6" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>{formatSofa2Price(product.oldPrice)}</Typography>
                  )}
                </Stack>
                <Typography sx={{ color: 'text.secondary' }}>{product.description}</Typography>

                {/* Colors */}
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Màu sắc</Typography>
                  <Stack direction="row" spacing={1.5}>
                    {(product.colors ?? []).map((color) => {
                      const variant = product.variants.find((item) => String(item.option ?? '').toLowerCase().includes(color.toLowerCase()));
                      return (
                        <Box
                          key={color}
                          title={color}
                          onClick={() => setSelectedVariantSku(String(variant?.sku ?? ''))}
                          sx={{ width: 28, height: 28, borderRadius: '50%', border: (t) => `2px solid ${selectedVariant?.sku === variant?.sku ? t.vars.palette.primary.main : t.vars.palette.divider}`, bgcolor: COLOR_SWATCH[color] ?? '#ccc', cursor: 'pointer' }}
                        />
                      );
                    })}
                  </Stack>
                </Stack>
                {product.variants.length > 0 && (
                  <TextField
                    select
                    fullWidth
                    label="Phiên bản sản phẩm"
                    value={selectedVariantSku}
                    onChange={(event) => setSelectedVariantSku(event.target.value)}
                  >
                    <MenuItem value="">Chọn sau / mặc định</MenuItem>
                    {product.variants.map((variant) => (
                      <MenuItem key={String(variant.sku)} value={String(variant.sku)}>
                        {String(variant.option ?? variant.sku)} — {formatSofa2Price(Number(variant.price ?? product.price))} — tồn {Number(variant.stock ?? 0)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                <Typography color={product.available && !variantUnavailable ? 'success.main' : 'error.main'} variant="body2">
                  {variantUnavailable || !product.available ? 'Sản phẩm hiện đã hết hàng.' : `Còn ${selectedVariant ? Number(selectedVariant.stock ?? 0) : product.stock} sản phẩm có thể đặt.`}
                </Typography>

                {/* Add to cart */}
                <Stack direction="row" spacing={2}>
                  <Button
                    size="large"
                    variant="contained"
                    color={added ? 'success' : 'primary'}
                    startIcon={<Iconify icon={added ? 'solar:check-circle-bold-duotone' : 'solar:cart-bold-duotone'} />}
                    onClick={addToCart}
                    disabled={!product.available || variantUnavailable}
                  >
                    {added ? 'Đã thêm vào giỏ' : !product.available || variantUnavailable ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </Button>
                  <Button component={RouterLink} href="/sofa2/showrooms" size="large" variant="outlined" startIcon={<Iconify icon="solar:phone-bold-duotone" />}>
                    Tư vấn miễn phí
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {videoUrl && (
        <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
          <Container>
            <Stack spacing={2}>
              <Typography variant="h4">Video sản phẩm</Typography>
              {product.videoCaption && <Typography color="text.secondary">{product.videoCaption}</Typography>}
              {/\.(mp4|webm)(\?.*)?$/i.test(videoUrl)
                ? <Box component="video" src={videoUrl} controls sx={{ width: 1, maxHeight: 640, borderRadius: 2, bgcolor: 'common.black' }} />
                : videoEmbedUrl && <Box component="iframe" src={videoEmbedUrl} title={product.videoCaption || `Video ${product.name}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen sx={{ width: 1, aspectRatio: '16/9', border: 0, borderRadius: 2 }} />}
            </Stack>
          </Container>
        </Box>
      )}

      {/* Tabs: specs / care */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.04) }}>
        <Container component={MotionViewport}>
          <Stack spacing={4}>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: (t) => `1px solid ${t.vars.palette.divider}` }}>
              {TABS.map((t) => <Tab key={t.value} value={t.value} label={t.label} />)}
            </Tabs>

            {tab === 'info' && (
              <Stack spacing={2} component={m.div} variants={varFade({ distance: 24 }).inUp}>
                <Typography variant="h5">Thông tin sản phẩm</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{product.description}</Typography>
                {product.features.length > 0 && <Stack component="ul" spacing={1} sx={{ pl: 3, m: 0 }}>{product.features.map((feature) => <Typography component="li" key={feature} sx={{ color: 'text.secondary' }}>{feature}</Typography>)}</Stack>}
                {product.assembly && <><Typography variant="subtitle1">Lắp đặt</Typography><Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>{product.assembly}</Typography></>}
                {product.included && <><Typography variant="subtitle1">Đi kèm</Typography><Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>{product.included}</Typography></>}
                {product.warrantyText && <><Typography variant="subtitle1">Bảo hành</Typography><Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>{product.warrantyText}</Typography></>}
                {!product.features.length && !product.assembly && !product.included && !product.warrantyText && <Typography sx={{ color: 'text.secondary' }}>Liên hệ LUXE Sofa để được tư vấn chi tiết về sản phẩm.</Typography>}
              </Stack>
            )}

            {tab === 'specs' && (
              <Stack spacing={2} component={m.div} variants={varFade({ distance: 24 }).inUp}>
                <Typography variant="h5">Thông số kỹ thuật</Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                  <Stack sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper', flex: '1 1 200px' }}>
                    <Typography variant="overline" sx={{ color: 'text.disabled' }}>Chất liệu</Typography>
                    <Typography>{product.material}</Typography>
                  </Stack>
                  <Stack sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper', flex: '1 1 200px' }}>
                    <Typography variant="overline" sx={{ color: 'text.disabled' }}>Kích thước</Typography>
                    <Typography>{product.size}</Typography>
                  </Stack>
                  {product.frameMaterial && <Stack sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper', flex: '1 1 200px' }}><Typography variant="overline" sx={{ color: 'text.disabled' }}>Vật liệu khung</Typography><Typography>{product.frameMaterial}</Typography></Stack>}
                  {product.upholstery && <Stack sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper', flex: '1 1 200px' }}><Typography variant="overline" sx={{ color: 'text.disabled' }}>Vật liệu bọc</Typography><Typography>{product.upholstery}</Typography></Stack>}
                  {product.cushion && <Stack sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper', flex: '1 1 200px' }}><Typography variant="overline" sx={{ color: 'text.disabled' }}>Cấu tạo đệm</Typography><Typography>{product.cushion}</Typography></Stack>}
                  {product.weightKg > 0 && <Stack sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper', flex: '1 1 200px' }}><Typography variant="overline" sx={{ color: 'text.disabled' }}>Khối lượng</Typography><Typography>{product.weightKg} kg</Typography></Stack>}
                  {product.seatCount > 0 && <Stack sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper', flex: '1 1 200px' }}><Typography variant="overline" sx={{ color: 'text.disabled' }}>Số chỗ ngồi</Typography><Typography>{product.seatCount}</Typography></Stack>}
                </Stack>
              </Stack>
            )}

            {tab === 'care' && (
              <Stack spacing={2} component={m.div} variants={varFade({ distance: 24 }).inUp}>
                <Typography variant="h5">Hướng dẫn bảo quản</Typography>
                {product.usageInstructions && <><Typography variant="subtitle1">Sử dụng</Typography><Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>{product.usageInstructions}</Typography></>}
                {product.careGuide && <Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>{product.careGuide}</Typography>}
                {!product.usageInstructions && !product.careGuide && <Typography sx={{ color: 'text.secondary' }}>Vui lòng liên hệ LUXE Sofa để được hướng dẫn sử dụng và bảo quản phù hợp với chất liệu sản phẩm.</Typography>}
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Reviews placeholder */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container component={MotionViewport}>
          <Stack spacing={3}>
            <Typography variant="h3">
              Đánh giá
              <Box component="span" sx={{ opacity: 0.4 }}> từ khách hàng</Box>
            </Typography>
            {reviews.length ? reviews.map((review, index) => (
              <Stack key={`${review.customer}-${index}`} spacing={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                <Stack direction="row" spacing={1} alignItems="center"><Rating value={Number(review.rating ?? 0)} readOnly size="small" /><Typography variant="subtitle2">{String(review.customer ?? 'Khách hàng')}</Typography><Typography variant="caption" color="text.secondary">{String(review.date ?? '')}</Typography></Stack>
                {review.title && <Typography variant="subtitle1">{String(review.title)}</Typography>}
                <Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>{String(review.content ?? '')}</Typography>
              </Stack>
            )) : <Stack spacing={2} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card, textAlign: 'center' }}>
              <Iconify icon="solar:chat-square-like-bold-duotone" width={40} sx={{ color: 'text.disabled', mx: 'auto' }} />
              <Typography sx={{ color: 'text.secondary' }}>Chưa có đánh giá được xuất bản cho sản phẩm này.</Typography>
            </Stack>}
          </Stack>
        </Container>
      </Box>

      {/* Q&A placeholder */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.04) }}>
        <Container component={MotionViewport}>
          <Stack spacing={3}>
            <Typography variant="h3">
              Hỏi & Đáp
            </Typography>
            {questions.length ? questions.map((item, index) => (
              <Stack key={`${item.customer}-${index}`} spacing={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                <Typography variant="subtitle1">Hỏi: {String(item.question ?? '')}</Typography>
                <Typography variant="caption" color="text.secondary">{String(item.customer ?? 'Khách hàng')} · {String(item.date ?? '')}</Typography>
                {item.answer && <Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>Trả lời: {String(item.answer)}</Typography>}
                {item.answeredBy && <Typography variant="caption" color="text.secondary">{String(item.answeredBy)}</Typography>}
              </Stack>
            )) : <Stack spacing={2} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card, textAlign: 'center' }}>
              <Iconify icon="solar:question-circle-bold-duotone" width={40} sx={{ color: 'text.disabled', mx: 'auto' }} />
              <Typography sx={{ color: 'text.secondary' }}>Chưa có câu hỏi được xuất bản cho sản phẩm này.</Typography>
            </Stack>}
          </Stack>
        </Container>
      </Box>

      {/* Related */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container component={MotionViewport}>
          <Stack spacing={2} sx={{ mb: 5 }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>Gợi ý cho bạn</Typography>
            <Typography variant="h2">
              Sản phẩm
              <Box component="span" sx={{ ...textGradient(`135deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}`) }}> liên quan</Box>
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            {related.map((p) => (
              <Grid key={p.id} xs={12} sm={6} md={3}>
                <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} sx={{ height: 1, borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  <Box component="img" src={p.image} alt={p.name} sx={{ width: 1, aspectRatio: '4/3', objectFit: 'cover' }} />
                  <Stack spacing={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle2">{p.name}</Typography>
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'fontWeightBold' }}>{formatSofa2Price(p.price)}</Typography>
                    <Button component={RouterLink} href={`/sofa2/products/${p.id}`} size="small" variant="outlined">Xem chi tiết</Button>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
