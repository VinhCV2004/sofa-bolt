import { getSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';

import { SOFA2_BLOG_POSTS, SOFA2_PAGE_IMAGES } from './sofa2-pages-data';

export type Sofa2CmsBlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  cover: string;
  tags: string[];
  status: string;
  views: number;
  author: string;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
};

export type Sofa2CmsPageBlock = {
  id: string;
  slug: string;
  title: string;
  block: string;
  type: string;
  heading: string;
  content: string;
  image: string;
  ctaLabel: string;
  ctaLink: string;
  status: string;
  sortOrder: number;
};

export type Sofa2CmsBanner = {
  id: string;
  name: string;
  position: string;
  imageDesktop: string;
  imageMobile: string;
  headline: string;
  ctaLink: string;
  status: string;
  sortOrder: number;
};

const isPublished = (status: unknown) =>
  ['published', 'đã xuất bản', 'đang chạy'].includes(String(status ?? '').trim().toLowerCase());

const FALLBACK_BLOG_POSTS: Sofa2CmsBlogPost[] = SOFA2_BLOG_POSTS.map((post) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  category: post.categoryLabel,
  excerpt: post.excerpt,
  content: post.content,
  cover: post.image,
  tags: [],
  status: 'published',
  views: 0,
  author: post.author,
  publishedAt: post.date,
  metaTitle: post.title,
  metaDescription: post.excerpt,
}));

export async function fetchPublishedBlogPosts(): Promise<Sofa2CmsBlogPost[]> {
  const rows = getSofa2AdminRows('cms', 'blog').filter((row) => isPublished(row.status));
  if (!rows.length) return FALLBACK_BLOG_POSTS;

  return rows.map((row) => ({
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    slug: String(row.slug ?? ''),
    category: String(row.category ?? ''),
    excerpt: String(row.excerpt ?? ''),
    content: String(row.content ?? ''),
    cover: String(row.cover ?? ''),
    tags: String(row.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    status: String(row.status ?? ''),
    views: Number(row.views ?? 0),
    author: String(row.author ?? ''),
    publishedAt: String(row.updated ?? ''),
    metaTitle: String(row.metaTitle ?? ''),
    metaDescription: String(row.metaDescription ?? ''),
  }));
}

export async function fetchBlogPostBySlug(slug: string): Promise<Sofa2CmsBlogPost | null> {
  const posts = await fetchPublishedBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function fetchPublishedPageBlocks(slug: string): Promise<Sofa2CmsPageBlock[]> {
  return getSofa2AdminRows('cms', slug)
    .filter((row) => isPublished(row.status))
    .map((row, index) => ({
      id: String(row.id ?? index),
      slug,
      title: String(row.title ?? row.heading ?? ''),
      block: String(row.block ?? ''),
      type: String(row.type ?? 'Rich text'),
      heading: String(row.heading ?? ''),
      content: String(row.content ?? ''),
      image: String(row.image ?? ''),
      ctaLabel: String(row.ctaLabel ?? ''),
      ctaLink: String(row.ctaLink ?? ''),
      status: String(row.status ?? ''),
      sortOrder: Number(row.order ?? index),
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function fetchPublishedBanners(position?: string): Promise<Sofa2CmsBanner[]> {
  return getSofa2AdminRows('cms', 'banner')
    .filter((row) => isPublished(row.status) && (!position || row.position === position))
    .map((row, index) => ({
      id: String(row.id ?? index),
      name: String(row.name ?? ''),
      position: String(row.position ?? ''),
      imageDesktop: String(row.image ?? ''),
      imageMobile: String(row.imageMobile ?? ''),
      headline: String(row.headline ?? ''),
      ctaLink: String(row.ctaLink ?? ''),
      status: String(row.status ?? ''),
      sortOrder: Number(row.order ?? index),
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function fetchPublishedSeo(pagePath: string) {
  const row = getSofa2AdminRows('cms', 'seo').find(
    (item) => String(item.page ?? item.pagePath ?? '') === pagePath && isPublished(item.status)
  );
  if (!row) return null;

  return {
    metaTitle: String(row.title ?? ''),
    metaDescription: String(row.description ?? ''),
    keywords: String(row.keywords ?? ''),
    canonical: String(row.canonical ?? ''),
    ogImage: String(row.ogImage ?? ''),
    indexable: String(row.indexable ?? 'Có') !== 'Không',
  };
}

export function cmsBlogPostToUi(post: Sofa2CmsBlogPost, index: number) {
  const fallbackImages = [
    SOFA2_PAGE_IMAGES.blog1,
    SOFA2_PAGE_IMAGES.blog2,
    SOFA2_PAGE_IMAGES.blog3,
    SOFA2_PAGE_IMAGES.blog4,
    SOFA2_PAGE_IMAGES.blog5,
    SOFA2_PAGE_IMAGES.blog6,
  ];

  return {
    id: post.slug || post.id,
    title: post.title,
    slug: post.slug,
    category: post.slug,
    categoryLabel: post.category,
    excerpt: post.excerpt,
    content: post.content,
    image: post.cover || fallbackImages[index % fallbackImages.length],
    author: post.author || 'LUXE Sofa',
    date: post.publishedAt || '',
    readTime: `${Math.max(3, Math.ceil(post.content.length / 600))} phút`,
  };
}

export function useFallbackBlogPosts() {
  return SOFA2_BLOG_POSTS;
}

export function useCmsPageBlocks(slug: string) {
  return { blocks: getSofa2AdminRows('cms', slug).map((row, index) => ({
    id: String(row.id ?? index),
    slug,
    title: String(row.title ?? row.heading ?? ''),
    block: String(row.block ?? ''),
    type: String(row.type ?? 'Rich text'),
    heading: String(row.heading ?? ''),
    content: String(row.content ?? ''),
    image: String(row.image ?? ''),
    ctaLabel: String(row.ctaLabel ?? ''),
    ctaLink: String(row.ctaLink ?? ''),
    status: String(row.status ?? ''),
    sortOrder: Number(row.order ?? index),
  })).filter((block) => isPublished(block.status)), loading: false };
}

export function useCmsBanners(position?: string) {
  const banners = getSofa2AdminRows('cms', 'banner')
    .filter((row) => isPublished(row.status) && (!position || row.position === position))
    .map((row, index) => ({
      id: String(row.id ?? index),
      name: String(row.name ?? ''),
      position: String(row.position ?? ''),
      imageDesktop: String(row.image ?? ''),
      imageMobile: String(row.imageMobile ?? ''),
      headline: String(row.headline ?? ''),
      ctaLink: String(row.ctaLink ?? ''),
      status: String(row.status ?? ''),
      sortOrder: Number(row.order ?? index),
    }));
  return { banners, loading: false };
}

export function useCmsSeo(pagePath: string) {
  const row = getSofa2AdminRows('cms', 'seo').find(
    (item) => String(item.page ?? item.pagePath ?? '') === pagePath && isPublished(item.status)
  );
  const seo = row
    ? {
        metaTitle: String(row.title ?? ''),
        metaDescription: String(row.description ?? ''),
        keywords: String(row.keywords ?? ''),
        canonical: String(row.canonical ?? ''),
        ogImage: String(row.ogImage ?? ''),
        indexable: String(row.indexable ?? 'Có') !== 'Không',
      }
    : null;
  return { seo, loading: false };
}
