import type { NavItemBaseProps } from 'src/layouts/main/nav/types';

import { getSofa2AdminRows, useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';

import { SOFA2_BLOG_POSTS, SOFA2_PAGE_IMAGES } from './sofa2-pages-data';

export type Sofa2CmsBlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  excerpt: string;
  content: string;
  cover: string;
  tags: string[];
  status: string;
  views: number;
  author: string;
  authorId: string;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
};

export type Sofa2CmsBlogCategory = {
  id: string;
  slug: string;
  label: string;
  description: string;
  cover: string;
  status: string;
  order: number;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  indexable: boolean;
};

export type Sofa2CmsBlogAuthor = {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedin: string;
};

export type Sofa2CmsBlogComment = {
  id: string;
  postSlug: string;
  postTitle: string;
  name: string;
  content: string;
  createdAt: string;
  reply: string;
};

export type Sofa2CmsBlogSocialChannel = {
  id: string;
  channel: string;
  label: string;
  icon: string;
  action: 'share' | 'copy';
  urlTemplate: string;
  order: number;
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
  icon: string;
  videoUrl: string;
  ctaLabel: string;
  ctaLink: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  indexable: boolean;
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

const toDate = (value: unknown) => {
  const text = String(value ?? '').trim();
  if (!text) return null;
  const vi = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const date = vi
    ? new Date(Number(vi[3]), Number(vi[2]) - 1, Number(vi[1]))
    : new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isVisible = (row: Record<string, string | number>) => {
  if (!isPublished(row.status)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const starts = toDate(row.startAt);
  const ends = toDate(row.endAt);
  if (starts && starts > today) return false;
  if (ends) {
    ends.setHours(23, 59, 59, 999);
    if (ends < new Date()) return false;
  }
  return true;
};

const toPageBlock = (row: Record<string, string | number>, slug: string, index: number): Sofa2CmsPageBlock => ({
  id: String(row.id ?? index),
  slug,
  title: String(row.title ?? row.heading ?? ''),
  block: String(row.block ?? ''),
  type: String(row.type ?? 'Rich text'),
  heading: String(row.heading ?? ''),
  content: String(row.content ?? ''),
  image: String(row.image ?? ''),
  icon: String(row.icon ?? ''),
  videoUrl: String(row.videoUrl ?? ''),
  ctaLabel: String(row.ctaLabel ?? ''),
  ctaLink: String(row.ctaLink ?? ''),
  metaTitle: String(row.metaTitle ?? ''),
  metaDescription: String(row.metaDescription ?? ''),
  ogImage: String(row.ogImage ?? ''),
  indexable: String(row.indexable ?? 'Có') !== 'Không',
  status: String(row.status ?? ''),
  sortOrder: Number(row.order ?? index),
});

const toBanner = (row: Record<string, string | number>, index: number): Sofa2CmsBanner => ({
  id: String(row.id ?? index),
  name: String(row.name ?? ''),
  position: String(row.position ?? ''),
  imageDesktop: String(row.image ?? ''),
  imageMobile: String(row.imageMobile ?? ''),
  headline: String(row.headline ?? ''),
  ctaLink: String(row.ctaLink ?? ''),
  status: String(row.status ?? ''),
  sortOrder: Number(row.order ?? index),
});

const pageSlugForPath = (pagePath: string) => {
  const mapping: Record<string, string> = {
    '/sofa2': 'home',
    '/sofa2/about': 'about',
    '/sofa2/contact': 'contact',
    '/sofa2/policy': 'policy',
    '/sofa2/policy/terms': 'terms',
    '/sofa2/faq': 'faq',
  };
  if (pagePath.startsWith('/sofa2/pages/')) return 'static-pages';
  return mapping[pagePath] ?? 'home';
};

const seoFromRow = (row: Record<string, string | number> | undefined) => {
  if (!row) return null;
  return {
    metaTitle: String(row.metaTitle ?? row.title ?? ''),
    metaDescription: String(row.metaDescription ?? row.description ?? ''),
    keywords: String(row.keywords ?? ''),
    canonical: String(row.canonical ?? ''),
    ogImage: String(row.ogImage ?? ''),
    indexable: !['false', 'không'].includes(String(row.indexable ?? 'Có').toLocaleLowerCase()),
  };
};

const toBlogPost = (row: Record<string, string | number>): Sofa2CmsBlogPost => ({
  id: String(row.id ?? ''),
  title: String(row.title ?? ''),
  slug: String(row.slug ?? ''),
  category: String(row.category ?? ''),
  categorySlug: String(row.categorySlug ?? SOFA2_BLOG_POSTS.find((post) => post.slug === String(row.slug ?? ''))?.category ?? ''),
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
  authorId: String(row.authorId ?? ''),
  publishedAt: String(row.updated ?? ''),
  metaTitle: String(row.metaTitle ?? ''),
  metaDescription: String(row.metaDescription ?? ''),
});

const toBlogCategory = (row: Record<string, string | number>, index: number): Sofa2CmsBlogCategory => ({
  id: String(row.id ?? `category-${index}`),
  slug: String(row.slug ?? ''),
  label: String(row.label ?? ''),
  description: String(row.description ?? ''),
  cover: String(row.cover ?? ''),
  status: String(row.status ?? ''),
  order: Number(row.order ?? index),
  metaTitle: String(row.metaTitle ?? ''),
  metaDescription: String(row.metaDescription ?? ''),
  ogImage: String(row.ogImage ?? ''),
  indexable: !['false', 'không'].includes(String(row.indexable ?? 'Có').toLocaleLowerCase()),
});

export function useCmsBlogCategories() {
  const { rows, loading } = useSofa2AdminRows('cms', 'blog-categories');
  const categories = rows.map(toBlogCategory)
    .filter((category) => isPublished(category.status))
    .sort((a, b) => a.order - b.order);
  return { categories, loading };
}

export async function fetchPublishedBlogCategories(): Promise<Sofa2CmsBlogCategory[]> {
  const rows = getSofa2AdminRows('cms', 'blog-categories');
  return rows.map(toBlogCategory)
    .filter((category) => isPublished(category.status))
    .sort((a, b) => a.order - b.order);
}

const withCurrentBlogCategoryLabel = (post: Sofa2CmsBlogPost, categories: Sofa2CmsBlogCategory[]) => {
  const category = categories.find((item) => item.slug === post.categorySlug);
  return category ? { ...post, category: category.label } : post;
};

const getPublishedBlogPosts = (
  rows: Record<string, string | number>[],
  categories: Sofa2CmsBlogCategory[]
) => rows
  .filter((row) => isPublished(row.status))
  .map(toBlogPost)
  .filter((post) => categories.some((category) => category.slug === post.categorySlug))
  .map((post) => withCurrentBlogCategoryLabel(post, categories));

export function useCmsBlogPosts() {
  const { rows, loading } = useSofa2AdminRows('cms', 'blog');
  const { categories } = useCmsBlogCategories();
  const posts = getPublishedBlogPosts(rows, categories);
  return { posts, loading };
}

export async function fetchPublishedBlogPosts(): Promise<Sofa2CmsBlogPost[]> {
  const cmsRows = getSofa2AdminRows('cms', 'blog');
  if (!cmsRows.length) return [];
  const categories = await fetchPublishedBlogCategories();
  return getPublishedBlogPosts(cmsRows, categories);
}

export async function fetchBlogPostBySlug(slug: string): Promise<Sofa2CmsBlogPost | null> {
  const posts = await fetchPublishedBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

const toBlogAuthor = (row: Record<string, string | number>): Sofa2CmsBlogAuthor => ({
  id: String(row.id ?? ''),
  name: String(row.name ?? ''),
  slug: String(row.slug ?? ''),
  role: String(row.role ?? ''),
  bio: String(row.bio ?? ''),
  avatar: String(row.avatar ?? ''),
  email: String(row.email ?? ''),
  facebook: String(row.facebook ?? ''),
  instagram: String(row.instagram ?? ''),
  linkedin: String(row.linkedin ?? ''),
});

export function useCmsBlogAuthors() {
  const { rows, loading } = useSofa2AdminRows('cms', 'blog-authors');
  const authors = rows.filter((row) => isPublished(row.status)).map(toBlogAuthor);
  return { authors, loading };
}

export async function fetchPublishedBlogAuthors(): Promise<Sofa2CmsBlogAuthor[]> {
  return getSofa2AdminRows('cms', 'blog-authors')
    .filter((row) => isPublished(row.status))
    .map(toBlogAuthor);
}

export function useCmsBlogComments(postSlug: string) {
  const { rows, loading, createRow } = useSofa2AdminRows('cms', 'blog-comments');
  const comments = rows
    .filter((row) => String(row.postSlug ?? '') === postSlug && String(row.status ?? '') === 'Đã duyệt')
    .map((row): Sofa2CmsBlogComment => ({
      id: String(row.id ?? ''),
      postSlug: String(row.postSlug ?? ''),
      postTitle: String(row.postTitle ?? ''),
      name: String(row.name ?? ''),
      content: String(row.content ?? ''),
      createdAt: String(row.createdAt ?? ''),
      reply: String(row.reply ?? ''),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { comments, loading, createComment: createRow };
}

export function useCmsBlogSocialChannels() {
  const { rows, loading } = useSofa2AdminRows('cms', 'blog-social');
  const channels = rows
    .filter((row) => isPublished(row.status)
      && ['có', 'true', 'yes', '1'].includes(String(row.enabled ?? '').trim().toLocaleLowerCase()))
    .map((row): Sofa2CmsBlogSocialChannel => ({
      id: String(row.id ?? ''),
      channel: String(row.channel ?? ''),
      label: String(row.label ?? ''),
      icon: String(row.icon ?? ''),
      action: String(row.action ?? 'share') === 'copy' ? 'copy' : 'share',
      urlTemplate: String(row.urlTemplate ?? ''),
      order: Number(row.order ?? 0),
    }))
    .sort((a, b) => a.order - b.order);
  return { channels, loading };
}

export async function fetchPublishedPageBlocks(slug: string): Promise<Sofa2CmsPageBlock[]> {
  return getSofa2AdminRows('cms', slug)
    .filter((row) => isVisible(row))
    .map((row, index) => toPageBlock(row, slug, index))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

const matchesBannerPosition = (rowPosition: unknown, requested?: string) => {
  if (!requested) return true;
  const actual = String(rowPosition ?? '').trim().toLocaleLowerCase();
  if (requested === 'home') return ['home', 'trang chủ'].includes(actual);
  return actual === requested.trim().toLocaleLowerCase();
};

export async function fetchPublishedBanners(position?: string): Promise<Sofa2CmsBanner[]> {
  return getSofa2AdminRows('cms', 'banner')
    .filter((row) => isVisible(row) && matchesBannerPosition(row.position, position))
    .map(toBanner)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function fetchPublishedSeo(pagePath: string) {
  const seoRow = getSofa2AdminRows('cms', 'seo').find(
    (row) => String(row.page ?? row.pagePath ?? '') === pagePath && row.status !== 'Tắt'
  );
  const pageRows = getSofa2AdminRows('cms', pageSlugForPath(pagePath));
  const pageRow = pageSlugForPath(pagePath) === 'static-pages'
    ? pageRows.find((row) => String(row.slug ?? '').endsWith(pagePath.slice('/sofa2/pages/'.length)))
    : pageRows.find((row) => row.status !== 'Tạm ẩn' && row.status !== 'Bản nháp' && (row.metaTitle || row.metaDescription));
  const separateSeoData = seoFromRow(seoRow);
  const pageSeoData = seoFromRow(pageRow);
  return separateSeoData?.metaTitle || separateSeoData?.metaDescription || separateSeoData?.keywords
    ? separateSeoData
    : pageSeoData;
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
    category: post.categorySlug,
    categoryLabel: post.category,
    authorId: post.authorId,
    excerpt: post.excerpt,
    content: post.content,
    image: post.cover || fallbackImages[index % fallbackImages.length],
    author: post.author || 'LUXE Sofa',
    date: post.publishedAt || '',
    readTime: `${Math.max(3, Math.ceil(post.content.length / 600))} phút`,
    metaTitle: post.metaTitle || post.title,
    metaDescription: post.metaDescription || post.excerpt,
  };
}

export function useFallbackBlogPosts() {
  return SOFA2_BLOG_POSTS;
}

export function useCmsPageBlocks(slug: string) {
  const { rows, loading } = useSofa2AdminRows('cms', slug);
  const blocks = rows
    .filter((row) => isVisible(row))
    .map((row, index) => toPageBlock(row, slug, index))
    .sort((left, right) => left.sortOrder - right.sortOrder);
  return { blocks, loading };
}

export function useCmsSliderSlides(page: string) {
  const { rows, loading } = useSofa2AdminRows('cms', 'slider');
  const slider = rows.find((row) => row.page === page && isPublished(row.status));
  const slides = String(slider?.slidesData ?? '')
    .split(/\r?\n/)
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([title, image]) => !!title && !!image)
    .map(([title, image, link]) => ({ title, image, link: link || '' }))
    .filter((slide) => isSafePublicUrl(slide.image) && (!slide.link || isSafePublicUrl(slide.link)));
  return { slides, loading };
}

const isSafePublicUrl = (value: string) =>
  (value.startsWith('/') && !value.startsWith('//')) || /^https?:\/\//i.test(value);

export function useCmsBanners(position?: string) {
  const { rows, loading } = useSofa2AdminRows('cms', 'banner');
  const banners = rows
    .filter((row) => isVisible(row) && matchesBannerPosition(row.position, position))
    .map(toBanner)
    .sort((left, right) => left.sortOrder - right.sortOrder);
  return { banners, loading };
}

export function useCmsSeo(pagePath: string) {
  const { rows: seoRows } = useSofa2AdminRows('cms', 'seo');
  const pageSlug = pageSlugForPath(pagePath);
  const { rows: pageRows } = useSofa2AdminRows('cms', pageSlug);
  const separateSeo = seoRows.find(
    (row) => String(row.page ?? row.pagePath ?? '') === pagePath && row.status !== 'Tắt'
  );
  const pageData = pageSlug === 'static-pages'
    ? pageRows.find((row) => String(row.slug ?? '').endsWith(pagePath.slice('/sofa2/pages/'.length)))
    : pageRows.find((row) => row.status !== 'Tạm ẩn' && row.status !== 'Bản nháp' && (row.metaTitle || row.metaDescription));
  const separateSeoData = seoFromRow(separateSeo);
  const pageSeoData = seoFromRow(pageData);
  const hasSeparateMeta = !!(
    separateSeoData?.metaTitle || separateSeoData?.metaDescription || separateSeoData?.keywords
  );
  return { seo: hasSeparateMeta ? separateSeoData : pageSeoData, loading: false };
}

export function useCmsStaticPage(slug: string) {
  const { rows, loading } = useSofa2AdminRows('cms', 'static-pages');
  const requested = slug.replace(/^\/+|\/+$/g, '');
  const page = rows.find((row) => {
    const storedSlug = String(row.slug ?? '').replace(/^\/+|\/+$/g, '');
    return storedSlug === requested || storedSlug.endsWith(`/${requested}`);
  });
  return { page: page && isVisible(page) ? page : null, loading };
}

export function useCmsFooterMenus(enabled: boolean) {
  const { rows } = useSofa2AdminRows('cms', 'menu', { load: enabled });
  if (!enabled) return [];
  return rows
    .filter((row) => row.position === 'Footer' && isPublished(row.status) && String(row.structure ?? '').trim())
    .map((row) => ({
      headline: String(row.menu ?? 'Liên kết'),
      children: String(row.structure ?? '')
        .split(/\r?\n/)
        .map((line) => line.split('|').map((part) => part.trim()))
        .filter(([title, path]) => !!title && !!path && (/^\/sofa2(?:\/|$|#)/.test(path) || /^https?:\/\//i.test(path)))
        .map(([name, href]) => ({ name, href })),
    }))
    .filter((menu) => menu.children.length > 0);
}

export function useCmsHeaderNavigation(fallback: NavItemBaseProps[], enabled: boolean) {
  const { rows } = useSofa2AdminRows('cms', 'menu', { load: enabled });
  if (!enabled) return fallback;
  const menu = rows.find(
    (row) => row.position === 'Header' && isPublished(row.status) && String(row.structure ?? '').trim()
  );
  if (!menu) return fallback;

  const entries = String(menu.structure ?? '')
    .split(/\r?\n/)
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([title, path]) => !!title && !!path && (/^\/sofa2(?:\/|$|#)/.test(path) || /^https?:\/\//i.test(path)))
    .map(([title, path, parentName]) => ({
      node: { title, path } as NavItemBaseProps,
      parentName: String(parentName ?? '').toLocaleLowerCase(),
    }));
  const nodes = new Map(entries.map((entry) => [entry.node.title.toLocaleLowerCase(), entry.node]));
  const parents: NavItemBaseProps[] = [];
  entries.forEach(({ node, parentName }) => {
    const parent = parentName ? nodes.get(parentName) : undefined;
    if (parent && parent !== node) {
      if (!Array.isArray(parent.children)) parent.children = [];
      (parent.children as NavItemBaseProps[]).push(node);
    } else {
      parents.push(node);
    }
  });
  return parents.length ? parents : fallback;
}
