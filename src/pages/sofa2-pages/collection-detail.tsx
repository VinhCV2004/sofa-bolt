import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import { SOFA2_PRODUCTS, formatSofa2Price } from 'src/sections/sofa2/sofa2-pages-data';

// ----------------------------------------------------------------------

export default function Page() {
  const { slug = '' } = useParams();
  const { rows } = useSofa2AdminRows('cms', 'collections', { load: false });
  const row = rows.find((item) => String(item.slug ?? '') === slug && String(item.status) === 'Đã xuất bản');
  const collection = row ? {
    id: String(row.id ?? ''), slug: String(row.slug ?? ''), name: String(row.name ?? ''),
    collectionType: String(row.collectionType ?? 'Bộ sưu tập'), description: String(row.description ?? ''),
    intro: String(row.intro ?? ''), image: String(row.image ?? ''), imageAlt: String(row.imageAlt ?? row.name ?? ''),
    productIds: String(row.productIds ?? '').split(/\r?\n/).map((id) => id.trim()).filter(Boolean),
    seasonLabel: String(row.seasonLabel ?? ''), count: Number(row.count ?? 0),
    ctaLabel: String(row.ctaLabel ?? 'Khám phá sản phẩm'), ctaLink: String(row.ctaLink ?? '/sofa2/products'),
    metaTitle: String(row.metaTitle ?? ''), metaDescription: String(row.metaDescription ?? ''),
    indexable: String(row.indexable ?? 'Có'),
  } : undefined;
  const products = collection ? SOFA2_PRODUCTS.filter((product) => collection.productIds.includes(String(product.id))) : [];
  const canonical = `https://luxesofa.vn/sofa2/collections/${slug}`;
  const indexable = Boolean(collection && !['không', 'false', '0'].includes(collection.indexable.toLowerCase()));

  if (!collection) {
    return (
      <>
        <Helmet><title>Không tìm thấy bộ sưu tập - LUXE Sofa</title></Helmet>
        <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', py: 20 }}>
          <Iconify icon="solar:file-remove-bold-duotone" width={72} sx={{ color: 'text.disabled' }} />
          <Typography variant="h4">Không tìm thấy bộ sưu tập</Typography>
          <Button component={RouterLink} href="/sofa2/collections" variant="contained">Quay lại bộ sưu tập</Button>
        </Stack>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{collection.metaTitle || `${collection.name} - LUXE Sofa`}</title>
        <meta name="description" content={collection.metaDescription || collection.description} />
        <meta name="robots" content={indexable ? 'index, follow' : 'noindex, nofollow'} />
        <link rel="canonical" href={canonical} />
        {indexable && <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'CollectionPage', name: collection.name,
          description: collection.description, image: collection.image, url: canonical,
          mainEntity: { '@type': 'ItemList', numberOfItems: products.length, itemListElement: products.map((product, index) => ({
            '@type': 'ListItem', position: index + 1, name: product.name, url: `https://luxesofa.vn/sofa2/products/${product.id}`,
          })) },
        }).replace(/</g, '\\u003c')}</script>}
      </Helmet>

      <Sofa2PageHero overline={collection.seasonLabel || collection.collectionType} title={collection.name} subtitle={collection.description} image={collection.image} />

      {/* Intro */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container component={MotionViewport}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            <Grid xs={12} md={6}>
              <Box component={m.img} variants={varFade({ distance: 24 }).inLeft} src={collection.image} alt={collection.imageAlt} sx={{ width: 1, borderRadius: 2, aspectRatio: '4/3', objectFit: 'cover' }} />
            </Grid>
            <Grid xs={12} md={6}>
              <Stack spacing={3} component={m.div} variants={varFade({ distance: 24 }).inRight}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>{collection.collectionType}{collection.seasonLabel ? ` · ${collection.seasonLabel}` : ''}</Typography>
                <Typography variant="h2">{collection.name}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{collection.description}</Typography>
                {collection.intro && <Typography sx={{ color: 'text.secondary' }}>{collection.intro}</Typography>}
                <Button component={RouterLink} href={collection.ctaLink} variant="contained" size="large" startIcon={<Iconify icon="solar:bag-bold-duotone" />}>
                  {collection.ctaLabel}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Products */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.04) }}>
        <Container component={MotionViewport}>
          <Stack spacing={2} sx={{ mb: 5 }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>Sản phẩm trong bộ sưu tập</Typography>
            <Typography variant="h3">{products.length} mẫu sofa</Typography>
          </Stack>
          <Grid container spacing={3}>
            {products.length === 0 && <Grid xs={12}><Typography sx={{ color: 'text.secondary' }}>Chưa có sản phẩm đang bán trong bộ sưu tập này.</Typography></Grid>}
            {products.map((product) => (
              <Grid key={product.id} xs={12} sm={6} md={3}>
                <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} sx={{ height: 1, borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  <Box component="img" src={product.image} alt={product.name} sx={{ width: 1, aspectRatio: '4/3', objectFit: 'cover' }} />
                  <Stack spacing={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle2">{product.name}</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Rating value={product.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>({product.reviews})</Typography>
                    </Stack>
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'fontWeightBold' }}>{formatSofa2Price(product.price)}</Typography>
                    <Button component={RouterLink} href={`/sofa2/products/${product.id}`} size="small" variant="outlined">Xem chi tiết</Button>
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
