import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { varAlpha, textGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import {
  SOFA2_PRODUCTS,
  formatSofa2Price,
} from 'src/sections/sofa2/sofa2-pages-data';

// ----------------------------------------------------------------------

const getProjectVideoEmbedUrl = (raw: string) => {
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : '';
    }
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/?]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : '';
    }
    if (host === 'vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : '';
    }
  } catch {
    return '';
  }
  return '';
};

const GALLERY = [
  'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/164877/pexels-photo-164877.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default function Page() {
  const theme = useTheme();
  const { id = '' } = useParams();
  const projectRows = useSofa2AdminRows('cms', 'projects', { load: false }).rows;
  const projectRow = projectRows.find((row) => String(row.id ?? '') === id && String(row.status) === 'Đã xuất bản');
  const projectSeo = useSofa2AdminRows('seo', 'project', { load: false }).rows.find(
    (row) => String(row.url ?? '') === `/sofa2/projects/${id}`
  );
  const project = projectRow ? {
    id: String(projectRow.id ?? ''), name: String(projectRow.name ?? ''),
    type: String(projectRow.type ?? ''), typeLabel: String(projectRow.typeLabel ?? ''),
    location: String(projectRow.location ?? ''), year: String(projectRow.year ?? ''),
    description: String(projectRow.description ?? ''), image: String(projectRow.image ?? ''),
    gallery: String(projectRow.gallery ?? ''), scope: String(projectRow.scope ?? ''),
    productsUsed: String(projectRow.productsUsed ?? ''),
    videoUrl: String(projectRow.videoUrl ?? ''), videoCaption: String(projectRow.videoCaption ?? ''),
    showReview: String(projectRow.showReview ?? 'Không'),
    reviewQuote: String(projectRow.reviewQuote ?? ''), reviewName: String(projectRow.reviewName ?? ''),
    reviewRole: String(projectRow.reviewRole ?? ''), reviewRating: Number(projectRow.reviewRating ?? 0),
    reviewDate: String(projectRow.reviewDate ?? ''), reviewAvatar: String(projectRow.reviewAvatar ?? ''),
    completionStatus: String(projectRow.completionStatus ?? ''),
    indexable: String(projectRow.indexable ?? 'Có'),
    metaTitle: String(projectRow.metaTitle ?? ''), metaDescription: String(projectRow.metaDescription ?? ''),
  } : undefined;
  const projectIndexable = !['không', 'false', '0'].includes(String(project?.indexable ?? 'Có').toLowerCase())
    && !['không', 'false', '0'].includes(String(projectSeo?.indexable ?? 'Có').toLowerCase())
    && !['không', 'false', '0'].includes(String(projectSeo?.published ?? 'Có').toLowerCase());
  const projectCanonical = String(projectSeo?.canonical ?? '') || `https://luxesofa.vn/sofa2/projects/${id}`;

  if (!project) {
    return (
      <>
        <Helmet>
          <title>Không tìm thấy dự án - LUXE Sofa</title>
        </Helmet>
        <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', py: 20 }}>
          <Iconify
            icon="solar:file-remove-bold-duotone"
            width={72}
            sx={{ color: 'text.disabled' }}
          />
          <Typography variant="h4">Không tìm thấy dự án</Typography>
          <Button component={RouterLink} href="/sofa2/projects" variant="contained">
            Quay lại danh sách dự án
          </Button>
        </Stack>
      </>
    );
  }

  const galleryImages = project.gallery.split(/\r?\n/).map((line) => {
    const [src, ...caption] = line.split('|');
    return { src: src.trim(), caption: caption.join('|').trim() };
  }).filter((image) => image.src);
  const relatedProductNames = project.productsUsed.split(/\r?\n/).map((name) => name.trim()).filter(Boolean);
  const usedProducts = relatedProductNames
    .map((name) => SOFA2_PRODUCTS.find((product) => product.name.toLocaleLowerCase() === name.toLocaleLowerCase()))
    .filter((product): product is (typeof SOFA2_PRODUCTS)[number] => Boolean(product));
  const videoEmbedUrl = getProjectVideoEmbedUrl(project.videoUrl);
  const isVideoFile = /\.(mp4|webm)(?:[?#].*)?$/i.test(project.videoUrl);

  return (
    <>
      <Helmet>
        <title>{String(projectSeo?.title ?? '') || project.metaTitle || `${project.name} - LUXE Sofa`}</title>
        <meta name="description" content={String(projectSeo?.description ?? '') || project.metaDescription || project.description} />
        <meta name="robots" content={projectIndexable ? 'index, follow' : 'noindex, nofollow'} />
        <link rel="canonical" href={projectCanonical} />
        {projectIndexable && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              '@id': `${projectCanonical}#project`,
              name: project.name,
              description: project.description,
              image: project.image,
              url: projectCanonical,
              dateCreated: project.year,
              locationCreated: { '@type': 'Place', name: project.location },
              genre: project.typeLabel,
              creator: { '@type': 'Organization', name: 'LUXE Sofa' },
              about: { '@type': 'Product', name: 'Sofa nội thất LUXE Sofa' },
              ...(project.showReview === 'Có' && project.reviewQuote && project.reviewRating > 0 ? {
                review: {
                  '@type': 'Review',
                  reviewBody: project.reviewQuote,
                  author: { '@type': 'Person', name: project.reviewName || 'Khách hàng dự án' },
                  reviewRating: { '@type': 'Rating', ratingValue: project.reviewRating, bestRating: 5 },
                },
              } : {}),
            }).replace(/</g, '\\u003c')}
          </script>
        )}
      </Helmet>

      <Sofa2PageHero
        overline={project.typeLabel}
        title={project.name}
        subtitle={`${project.location} • ${project.year}`}
        image={project.image}
      />

      {/* Overview */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container component={MotionViewport}>
          <Grid container spacing={{ xs: 5, md: 8 }}>
            <Grid xs={12} md={7}>
              <Stack spacing={3} component={m.div} variants={varFade({ distance: 24 }).inLeft}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  Giới thiệu dự án
                </Typography>
                <Typography variant="h2">{project.name}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{project.description}</Typography>
                {project.scope && <Typography sx={{ color: 'text.secondary' }}>Quy mô thực hiện: {project.scope}.</Typography>}
                {project.completionStatus && <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tiến độ: {project.completionStatus}</Typography>}
              </Stack>
            </Grid>
            <Grid xs={12} md={5}>
              <Stack
                spacing={2}
                component={m.div}
                variants={varFade({ distance: 24 }).inRight}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: (t) => t.customShadows.card,
                }}
              >
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  Thông tin dự án
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Iconify icon="solar:bill-list-bold-duotone" sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      Loại hình
                    </Typography>
                    <Typography variant="body2">{project.typeLabel}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Iconify icon="solar:map-point-bold-duotone" sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      Địa điểm
                    </Typography>
                    <Typography variant="body2">{project.location}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Iconify icon="solar:calendar-bold-duotone" sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      Năm hoàn thành
                    </Typography>
                    <Typography variant="body2">{project.year}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {videoEmbedUrl || isVideoFile ? (
        <Box component="section" sx={{ py: { xs: 6, md: 9 } }}>
          <Container component={MotionViewport}>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>Video dự án</Typography>
              {project.videoCaption && <Typography variant="h4">{project.videoCaption}</Typography>}
            </Stack>
            <Box sx={{ maxWidth: 1000, mx: 'auto', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 3, bgcolor: 'common.black' }}>
              {videoEmbedUrl ? (
                <Box component="iframe" src={videoEmbedUrl} title={`Video dự án ${project.name}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" sx={{ width: 1, height: 1, border: 0 }} />
              ) : (
                <Box component="video" src={project.videoUrl} controls playsInline preload="metadata" sx={{ width: 1, height: 1 }} />
              )}
            </Box>
          </Container>
        </Box>
      ) : null}

      {/* Gallery */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.04),
        }}
      >
        <Container component={MotionViewport}>
          <Stack spacing={2} sx={{ mb: 5 }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Hình ảnh
            </Typography>
            <Typography variant="h3">
              Gallery
              <Box component="span" sx={{ opacity: 0.4 }}>
                {' '}
                dự án
              </Box>
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            {(galleryImages.length ? galleryImages : GALLERY.map((src) => ({ src, caption: '' }))).map((image, idx) => (
              <Grid key={`${image.src}-${idx}`} xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <Box
                    component={m.img}
                    variants={varFade({ distance: 24 }).inUp}
                    src={image.src}
                    alt={image.caption || `${project.name} — ảnh ${idx + 1}`}
                    sx={{ width: 1, borderRadius: 2, aspectRatio: '1/1', objectFit: 'cover' }}
                  />
                  {image.caption && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{image.caption}</Typography>}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Products used */}
      {usedProducts.length > 0 && <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container component={MotionViewport}>
          <Stack spacing={2} sx={{ mb: 5 }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Sản phẩm sử dụng
            </Typography>
            <Typography variant="h3">
              Sofa
              <Box
                component="span"
                sx={{
                  ...textGradient(
                    `135deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}`
                  ),
                }}
              >
                {' '}
                trong dự án
              </Box>
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            {usedProducts.map((p) => (
              <Grid key={p.id} xs={12} sm={6} md={4}>
                <Stack
                  component={m.div}
                  variants={varFade({ distance: 24 }).inUp}
                  sx={{
                    height: 1,
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    boxShadow: (t) => t.customShadows.card,
                  }}
                >
                  <Box
                    component="img"
                    src={p.image}
                    alt={p.name}
                    sx={{ width: 1, aspectRatio: '4/3', objectFit: 'cover' }}
                  />
                  <Stack spacing={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1">{p.name}</Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: 'primary.main', fontWeight: 'fontWeightBold' }}
                    >
                      {formatSofa2Price(p.price)}
                    </Typography>
                    <Button
                      component={RouterLink}
                      href={`/sofa2/products/${p.id}`}
                      size="small"
                      variant="outlined"
                    >
                      Xem chi tiết
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>}

      {/* Customer review */}
      {project.showReview === 'Có' && project.reviewQuote ? <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.04),
        }}
      >
        <Container component={MotionViewport}>
          <Stack
            spacing={3}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: (t) => t.customShadows.card,
              textAlign: 'center',
              maxWidth: 720,
              mx: 'auto',
            }}
            component={m.div}
            variants={varFade({ distance: 24 }).inUp}
          >
            <Avatar
              src={project.reviewAvatar || undefined}
              sx={{ width: 64, height: 64, mx: 'auto' }}
            >
              {project.reviewName.slice(0, 1)}
            </Avatar>
            <Rating value={Math.min(5, Math.max(0, project.reviewRating))} precision={0.1} readOnly sx={{ mx: 'auto' }} />
            <Typography variant="h6">&ldquo;{project.reviewQuote}&rdquo;</Typography>
            {(project.reviewName || project.reviewRole) && (
              <Typography sx={{ color: 'text.secondary' }}>
                {project.reviewName}{project.reviewRole ? ` — ${project.reviewRole}` : ''}
              </Typography>
            )}
            {project.reviewDate && <Typography variant="caption" sx={{ color: 'text.disabled' }}>{project.reviewDate}</Typography>}
          </Stack>
        </Container>
      </Box> : null}
    </>
  );
}
