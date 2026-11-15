import { Helmet } from 'react-helmet-async';
import { useParams, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { sofa2Visible } from 'src/sections/sofa2-admin/sofa2-support';
import { SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';
import { useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import { Sofa2Section, Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import {
  useCmsSeo,
  useCmsPageBlocks,
  useCmsStaticPage,
} from 'src/sections/sofa2/sofa2-cms-client';

const PAGE_TITLES: Record<string, string> = {
  policy: 'Chính sách LUXE Sofa',
  terms: 'Điều khoản sử dụng',
  faq: 'Câu hỏi thường gặp',
};

const PAGE_IMAGES: Record<string, string> = {
  policy: SOFA2_PAGE_IMAGES.contact,
  terms: SOFA2_PAGE_IMAGES.aboutHero,
  faq: SOFA2_PAGE_IMAGES.blog1,
};

export default function Sofa2CmsContentPage() {
  const location = useLocation();
  const { slug = '' } = useParams();
  const isDynamicPage = location.pathname.startsWith('/sofa2/pages/');
  const pageSlug = isDynamicPage
    ? 'static-pages'
    : location.pathname === '/sofa2/policy/terms'
      ? 'terms'
      : location.pathname === '/sofa2/faq'
        ? 'faq'
        : 'policy';
  const { blocks, loading } = useCmsPageBlocks(isDynamicPage ? 'static-pages' : pageSlug);
  const { seo } = useCmsSeo(location.pathname);
  const { page: staticPage, loading: staticPageLoading } = useCmsStaticPage(slug);
  const supportFaq = useSofa2AdminRows('support', 'faq');
  const visibleSupportFaqs = sofa2Visible(supportFaq.rows);
  const pageTitle = isDynamicPage
    ? String(staticPage?.title ?? 'Trang không khả dụng')
    : PAGE_TITLES[pageSlug];
  const pageContent = isDynamicPage
    ? String(staticPage?.content ?? '')
    : '';
  const pageCover = isDynamicPage ? String(staticPage?.cover ?? '') : PAGE_IMAGES[pageSlug];
  const pageMetaTitle = isDynamicPage ? String(staticPage?.metaTitle ?? '') : '';
  const pageMetaDescription = isDynamicPage ? String(staticPage?.metaDescription ?? '') : '';
  const visibleBlocks = isDynamicPage ? [] : blocks;
  const notFound = isDynamicPage && !staticPage && !staticPageLoading;

  return (
    <>
      <Helmet>
        <title>{seo?.metaTitle || pageMetaTitle || pageTitle}</title>
        {(seo?.metaDescription || pageMetaDescription) && (
          <meta name="description" content={seo?.metaDescription || pageMetaDescription} />
        )}
        <meta name="robots" content={seo?.indexable === false ? 'noindex, nofollow' : 'index, follow'} />
        {seo?.canonical && <link rel="canonical" href={seo.canonical} />}
        {(seo?.ogImage || pageCover) && <meta property="og:image" content={seo?.ogImage || pageCover} />}
      </Helmet>

      <Sofa2PageHero
        overline={isDynamicPage ? 'Nội dung' : 'LUXE Sofa'}
        title={pageTitle}
        subtitle={notFound ? 'Trang có thể đã bị gỡ hoặc chưa được xuất bản.' : ''}
        image={pageCover || SOFA2_PAGE_IMAGES.aboutHero}
      />

      <Sofa2Section>
        <Box sx={{ maxWidth: 960, mx: 'auto' }}>
          {loading || staticPageLoading || (pageSlug === 'faq' && supportFaq.loading) ? (
            <Typography color="text.secondary">Đang tải nội dung…</Typography>
          ) : notFound ? (
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h5">Không tìm thấy trang</Typography>
              <Button component={RouterLink} href="/sofa2" variant="contained">
                Về trang chủ
              </Button>
            </Stack>
          ) : isDynamicPage ? (
            <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.9 }}>{pageContent}</Typography>
          ) : pageSlug === 'faq' ? (
            visibleSupportFaqs.length ? (
              <Stack spacing={1.5}>
                {visibleSupportFaqs.map((faq, index) => (
                  <Accordion key={`${String(faq.question ?? '')}-${index}`} disableGutters>
                    <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-bold" />}>
                      <Typography variant="h6">{String(faq.question ?? '')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                        {String(faq.answer ?? '')}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">Chưa có câu hỏi thường gặp được xuất bản.</Typography>
            )
          ) : visibleBlocks.length ? (
            <Stack spacing={2.5}>
              {visibleBlocks.map((block) =>
                block.type === 'Câu hỏi thường gặp' ? (
                  <Accordion key={block.id} disableGutters>
                    <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-bold" />}>
                      <Typography variant="h6">{block.block || block.heading || block.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                        {block.content}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ) : (
                  <Box key={block.id} component="article" sx={{ py: 2 }}>
                    <Typography variant="h4" sx={{ mb: 1.5 }}>
                      {block.heading || block.block || block.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.9 }}>
                      {block.content}
                    </Typography>
                    {block.image && (
                      <Box
                        component="img"
                        src={block.image}
                        alt={block.heading || block.block}
                        loading="lazy"
                        sx={{ display: 'block', maxWidth: 1, maxHeight: 520, mt: 3, borderRadius: 2, objectFit: 'cover' }}
                      />
                    )}
                    {block.ctaLink && block.ctaLabel && (
                      <Button component={RouterLink} href={block.ctaLink} sx={{ mt: 2 }}>
                        {block.ctaLabel}
                      </Button>
                    )}
                  </Box>
                )
              )}
            </Stack>
          ) : (
            <Typography color="text.secondary">Nội dung trang hiện chưa được xuất bản.</Typography>
          )}
        </Box>
      </Sofa2Section>
    </>
  );
}
