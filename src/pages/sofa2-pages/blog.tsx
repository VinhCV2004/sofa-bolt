import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';
import { Sofa2Section, Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { useCmsSeo, cmsBlogPostToUi, useCmsBlogPosts, useCmsBlogCategories } from 'src/sections/sofa2/sofa2-cms-client';

type UiPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
};

export default function Page() {
  const { seo } = useCmsSeo('/sofa2/blog');
  const { posts: cmsPosts, loading } = useCmsBlogPosts();
  const { categories } = useCmsBlogCategories();
  const posts = cmsPosts.map((post, index) => cmsBlogPostToUi(post, index) as UiPost);
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <Helmet>
        <title>{seo?.metaTitle || 'Blog nội thất - LUXE Sofa'}</title>
        {seo?.metaDescription && <meta name="description" content={seo.metaDescription} />}
        {seo?.canonical && <link rel="canonical" href={seo.canonical} />}
        <meta name="robots" content={seo?.indexable === false ? 'noindex, nofollow' : 'index, follow'} />
      </Helmet>

      <Sofa2PageHero
        overline="Blog"
        title="Blog LUXE Sofa"
        subtitle="Cẩm nang nội thất, mẹo bảo dưỡng sofa và xu hướng thiết kế từ đội ngũ chuyên gia."
        image={SOFA2_PAGE_IMAGES.blog1}
      />

      {featured && (
        <Sofa2Section py={{ xs: 8, md: 10 }}>
          <Container component={MotionViewport}>
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
              <Grid xs={12} md={7}>
                <Box
                  component={m.img}
                  variants={varFade({ distance: 24 }).inLeft}
                  src={featured.image}
                  alt={featured.title}
                  sx={{ width: 1, borderRadius: 2, aspectRatio: '16/10', objectFit: 'cover' }}
                />
              </Grid>
              <Grid xs={12} md={5}>
                <Stack spacing={2} component={m.div} variants={varFade({ distance: 24 }).inRight}>
                  <Chip label={featured.categoryLabel} size="small" color="primary" sx={{ width: 'fit-content' }} />
                  <Typography variant="h3">{featured.title}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{featured.excerpt}</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>{featured.author.charAt(0)}</Avatar>
                      <Typography variant="caption">{featured.author}</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>· {featured.date} · {featured.readTime}</Typography>
                  </Stack>
                  <Button component={RouterLink} href={`/sofa2/blog/${featured.slug || featured.id}`} variant="contained" sx={{ width: 'fit-content' }} endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
                    Đọc tiếp
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Sofa2Section>
      )}

      <Sofa2Section bg="grey">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: { xs: 4, md: 6 } }}>
          <Chip
            label="Tất cả"
            component={RouterLink}
            href="/sofa2/blog"
            clickable
            color="primary"
          />
          {categories.map((cat) => (
            <Chip
              key={cat.slug}
              label={cat.label}
              component={RouterLink}
              href={`/sofa2/blog/category/${cat.slug}`}
              clickable
              variant="soft"
            />
          ))}
        </Stack>
        {!loading && posts.length === 0 ? (
          <Typography color="text.secondary">Hiện chưa có bài viết được xuất bản.</Typography>
        ) : null}
        <Grid container spacing={3}>
          {rest.map((post) => (
            <Grid key={post.id} xs={12} sm={6} md={4}>
              <Stack
                component={m.div}
                variants={varFade({ distance: 24 }).inUp}
                spacing={0}
                sx={{ height: 1, borderRadius: 2, bgcolor: 'background.paper', overflow: 'hidden', boxShadow: (t) => t.customShadows.card, transition: (t) => t.transitions.create(['transform'], { duration: 300 }), '&:hover': { transform: 'translateY(-6px)' } }}
              >
                <Box component="img" src={post.image} alt={post.title} sx={{ width: 1, aspectRatio: '16/10', objectFit: 'cover' }} />
                <Stack spacing={1.5} sx={{ p: 3 }}>
                  <Chip label={post.categoryLabel} size="small" color="primary" variant="soft" sx={{ width: 'fit-content' }} />
                  <Typography variant="h6">{post.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{post.excerpt}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.disabled' }}>
                    <Iconify icon="solar:calendar-bold-duotone" width={16} />
                    <Typography variant="caption">{post.date}</Typography>
                    <Typography variant="caption">· {post.readTime}</Typography>
                  </Stack>
                  <Button component={RouterLink} href={`/sofa2/blog/${post.slug || post.id}`} size="small" sx={{ width: 'fit-content' }} endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>Đọc tiếp</Button>
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Sofa2Section>
    </>
  );
}
