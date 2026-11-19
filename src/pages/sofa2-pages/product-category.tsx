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
import { formatSofa2Price } from 'src/sections/sofa2/sofa2-pages-data';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import {
  useSofa2CatalogProducts,
  useSofa2CatalogCategories,
  filterSofa2CatalogProducts,
} from 'src/sections/sofa2/sofa2-catalog-client';

// ----------------------------------------------------------------------

const FILTER_GROUPS = [
  { key: 'types', label: 'Loại sofa' },
  { key: 'styles', label: 'Phong cách' },
  { key: 'spaces', label: 'Không gian' },
  { key: 'sizes', label: 'Kích cỡ' },
  { key: 'prices', label: 'Mức giá' },
] as const;

export default function Page() {
  const { slug = '' } = useParams();
  const categorySeoRows = useSofa2AdminRows('seo', 'category', { load: false }).rows;
  const { products: allProducts } = useSofa2CatalogProducts();
  const categories = useSofa2CatalogCategories();
  const selectedCategory = Object.values(categories).flat().find((category) => category.slug === slug);
  const categorySeo = categorySeoRows.find((row) => String(row.url ?? '') === `/sofa2/products/category/${slug}`);
  const categoryIndexable = selectedCategory?.indexable !== false
    && !['không', 'false', '0'].includes(String(categorySeo?.indexable ?? 'Có').toLowerCase())
    && !['không', 'false', '0'].includes(String(categorySeo?.published ?? 'Có').toLowerCase());
  const categoryCanonical = String(categorySeo?.canonical ?? '') || `https://luxesofa.vn/sofa2/products/category/${slug}`;

  // find matching label across all filter groups
  const matchLabel = FILTER_GROUPS.reduce<string | null>((result, group) => {
    if (result) return result;
    const found = categories[group.key].find((c) => c.slug === slug);
    return found ? found.label : null;
  }, null);

  const products = filterSofa2CatalogProducts(allProducts, categories, slug);
  const label = matchLabel ?? 'Tất cả sản phẩm';

  return (
    <>
      <Helmet>
        <title>{String(categorySeo?.title ?? '') || selectedCategory?.metaTitle || `${label} - LUXE Sofa`}</title>
        {(String(categorySeo?.description ?? '') || selectedCategory?.metaDescription || selectedCategory?.description) && <meta name="description" content={String(categorySeo?.description ?? '') || selectedCategory?.metaDescription || selectedCategory?.description} />}
        <meta name="robots" content={categoryIndexable ? 'index, follow' : 'noindex, nofollow'} />
        <link rel="canonical" href={categoryCanonical} />
        {categoryIndexable && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: selectedCategory?.label ?? label,
              description: selectedCategory?.metaDescription || selectedCategory?.description || `${label} — danh mục sofa tại LUXE Sofa.`,
              url: categoryCanonical,
              isPartOf: { '@type': 'WebSite', name: 'LUXE Sofa', url: 'https://luxesofa.vn/sofa2' },
              breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://luxesofa.vn/sofa2' },
                  { '@type': 'ListItem', position: 2, name: 'Sản phẩm', item: 'https://luxesofa.vn/sofa2/products' },
                  { '@type': 'ListItem', position: 3, name: label, item: `https://luxesofa.vn/sofa2/products/category/${slug}` },
                ],
              },
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: products.length,
                itemListElement: products.map((product, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  url: `https://luxesofa.vn/sofa2/products/${product.id}`,
                  name: product.name,
                })),
              },
            }).replace(/</g, '\\u003c')}
          </script>
        )}
      </Helmet>

      <Sofa2PageHero
        overline="Danh mục"
        title={label}
        subtitle={selectedCategory?.description || `${products.length} mẫu sofa trong danh mục này.`}
        image={selectedCategory?.image || products[0]?.image || 'https://images.pexels.com/photos/276624/pexels-photo-276624.jpeg?auto=compress&cs=tinysrgb&w=1920'}
      />

      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container component={MotionViewport}>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* Sidebar */}
            <Grid xs={12} md={3}>
              <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 88 }, p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>Bộ lọc</Typography>
                {FILTER_GROUPS.map((group) => (
                  <Stack key={group.key} spacing={1}>
                    <Typography variant="subtitle2">{group.label}</Typography>
                    <Stack spacing={0.5}>
                      {categories[group.key].map((item) => (
                        <Button
                          key={item.slug}
                          component={RouterLink}
                          href={`/sofa2/products/category/${item.slug}`}
                          size="small"
                          sx={{ justifyContent: 'flex-start', color: item.slug === slug ? 'primary.main' : 'text.secondary', fontWeight: item.slug === slug ? 'fontWeightBold' : 'fontWeightRegular', textTransform: 'none', '&:hover': { color: 'primary.main', bgcolor: (t) => varAlpha(t.vars.palette.primary.mainChannel, 0.08) } }}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            {/* Products */}
            <Grid xs={12} md={9}>
              <Grid container spacing={3}>
                {!products.length && (
                  <Grid xs={12}>
                    <Typography color="text.secondary">Danh mục này hiện chưa có sản phẩm được xuất bản.</Typography>
                  </Grid>
                )}
                {products.map((product) => (
                  <Grid key={product.id} xs={12} sm={6} md={4}>
                    <Stack
                      component={m.div}
                      variants={varFade({ distance: 24 }).inUp}
                      sx={{ height: 1, borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <Box component="img" src={product.image} alt={product.name} sx={{ width: 1, aspectRatio: '4/3', objectFit: 'cover' }} />
                        {product.badge && (
                          <Box sx={{ position: 'absolute', top: 12, left: 12, px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 'primary.main', color: 'common.white' }}>
                            <Typography variant="caption" sx={{ fontWeight: 'fontWeightBold' }}>{product.badge}</Typography>
                          </Box>
                        )}
                      </Box>
                      <Stack spacing={1.5} sx={{ p: 2.5 }}>
                        <Typography variant="subtitle1">{product.name}</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Rating value={product.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>({product.reviews})</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'fontWeightBold' }}>{formatSofa2Price(product.price)}</Typography>
                          {product.oldPrice && (
                            <Typography variant="body2" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>{formatSofa2Price(product.oldPrice)}</Typography>
                          )}
                        </Stack>
                        <Button component={RouterLink} href={`/sofa2/products/${product.id}`} variant="outlined" size="small" startIcon={<Iconify icon="solar:eye-bold-duotone" />}>
                          Xem chi tiết
                        </Button>
                      </Stack>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
