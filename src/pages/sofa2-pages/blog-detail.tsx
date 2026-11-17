import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useState, useEffect, type FormEvent } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { Sofa2Section, Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import {
  cmsBlogPostToUi,
  useCmsBlogAuthors,
  useCmsBlogComments,
  fetchBlogPostBySlug,
  type Sofa2CmsBlogPost,
  fetchPublishedBlogPosts,
  useCmsBlogSocialChannels,
} from 'src/sections/sofa2/sofa2-cms-client';

type UiPost = {
  id: string;
  title: string;
  slug: string;
  categoryLabel: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorId: string;
  date: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
};

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState<UiPost | null>(null);
  const [related, setRelated] = useState<UiPost[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentNotice, setCommentNotice] = useState('');
  const [shareNotice, setShareNotice] = useState('');
  const { authors } = useCmsBlogAuthors();
  const { comments, createComment } = useCmsBlogComments(post?.slug ?? '');
  const { channels } = useCmsBlogSocialChannels();

  useEffect(() => {
    let active = true;
    if (!id) return undefined;
    setPost(null);
    setRelated([]);
    setNotFound(false);
    setCommentNotice('');
    setShareNotice('');

    fetchBlogPostBySlug(id)
      .then((cmsPost: Sofa2CmsBlogPost | null) => {
        if (!active) return;
        if (!cmsPost) {
          setNotFound(true);
          return;
        }
        setPost({
          id: cmsPost.slug || cmsPost.id,
          title: cmsPost.title,
          slug: cmsPost.slug,
          categoryLabel: cmsPost.category,
          excerpt: cmsPost.excerpt,
          content: cmsPost.content,
          image: cmsPost.cover,
          author: cmsPost.author || 'LUXE Sofa',
          authorId: cmsPost.authorId,
          date: cmsPost.publishedAt || '',
          readTime: `${Math.max(3, Math.ceil(cmsPost.content.length / 600))} phút`,
          metaTitle: cmsPost.metaTitle || cmsPost.title,
          metaDescription: cmsPost.metaDescription || cmsPost.excerpt,
        });
        fetchPublishedBlogPosts().then((posts) => {
          if (active) {
            setRelated(posts.filter((item) => item.slug !== cmsPost.slug).slice(0, 3)
              .map((item, index) => cmsBlogPostToUi(item, index) as UiPost));
          }
        });
      })
      .catch(() => {
        if (active) setNotFound(true);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (!post) {
    if (notFound) {
      return (
        <>
          <Helmet><title>Không tìm thấy bài viết - LUXE Sofa</title></Helmet>
          <Container sx={{ py: { xs: 10, md: 16 }, textAlign: 'center' }}>
            <Stack spacing={3} alignItems="center">
              <Iconify icon="solar:question-circle-bold-duotone" width={80} sx={{ color: 'text.disabled' }} />
              <Typography variant="h3">Không tìm thấy bài viết</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Bài viết bạn tìm kiếm không tồn tại hoặc đã bị gỡ.</Typography>
              <Button component={RouterLink} href="/sofa2/blog" variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                Quay lại blog
              </Button>
            </Stack>
          </Container>
        </>
      );
    }
    return null;
  }

  const authorProfile = authors.find((author) => author.id === post.authorId || author.name === post.author);
  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = commentName.trim();
    const email = commentEmail.trim();
    const content = commentContent.trim();
    if (!name || !email || !content) return;
    createComment({
      id: `blog-comment-${Date.now().toString(36)}`,
      postSlug: post.slug,
      postTitle: post.title,
      name,
      email,
      content,
      status: 'Chờ duyệt',
      createdAt: new Date().toISOString().slice(0, 10),
      source: 'Website',
      approvedBy: '',
      reply: '',
    });
    setCommentName('');
    setCommentEmail('');
    setCommentContent('');
    setCommentNotice('Đã nhận bình luận. Nội dung sẽ hiển thị sau khi được quản trị viên duyệt.');
  };

  const handleShare = async (channel: (typeof channels)[number]) => {
    const pageUrl = window.location.href;
    if (channel.action === 'copy') {
      try {
        await navigator.clipboard.writeText(pageUrl);
        setShareNotice('Đã sao chép liên kết bài viết.');
      } catch {
        setShareNotice('Trình duyệt không cho phép sao chép liên kết.');
      }
      return;
    }
    const target = channel.urlTemplate
      .replaceAll('{url}', encodeURIComponent(pageUrl))
      .replaceAll('{title}', encodeURIComponent(post.title))
      .replaceAll('{image}', encodeURIComponent(post.image));
    try {
      const shareUrl = new URL(target);
      if (shareUrl.protocol !== 'https:') throw new Error('Invalid share URL');
      window.open(shareUrl.toString(), '_blank', 'noopener,noreferrer');
    } catch {
      setShareNotice('Liên kết chia sẻ chưa được cấu hình hợp lệ.');
    }
  };

  const paragraphs = post.content
    ? post.content.split('\n').filter((p) => p.trim())
    : ['Nội dung bài viết đang được cập nhật.'];

  return (
    <>
      <Helmet>
        <title>{post.metaTitle || `${post.title} - LUXE Sofa`}</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta property="og:image" content={post.image} />
      </Helmet>

      <Sofa2PageHero
        overline={post.categoryLabel}
        title={post.title}
        image={post.image}
      />

      <Sofa2Section py={{ xs: 4, md: 5 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={authorProfile?.avatar || undefined} sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>{post.author.charAt(0)}</Avatar>
            <Typography variant="subtitle2">{post.author}</Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>· {post.date} · {post.readTime} đọc</Typography>
        </Stack>
      </Sofa2Section>

      <Sofa2Section py={{ xs: 4, md: 8 }}>
        <Container component={MotionViewport} maxWidth="md">
          <Stack spacing={3} component={m.div} variants={varFade({ distance: 24 }).inUp}>
            {paragraphs.map((para, i) => (
              <Typography key={i} variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {para}
              </Typography>
            ))}
          </Stack>

          <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} sx={{ mt: 6, p: 4, borderRadius: 2, bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.04) }}>
            <Divider />
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={authorProfile?.avatar || undefined} sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>{post.author.charAt(0)}</Avatar>
              <Stack spacing={0.75}>
                <Typography variant="subtitle1">{post.author}</Typography>
                <Typography variant="body2" sx={{ color: 'primary.main' }}>{authorProfile?.role || 'Biên tập viên LUXE Sofa'}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{authorProfile?.bio || 'Chia sẻ kiến thức và cảm hứng về sofa, nội thất cùng LUXE Sofa.'}</Typography>
                <Stack direction="row" spacing={1}>
                  {[
                    { label: 'Facebook', href: authorProfile?.facebook },
                    { label: 'Instagram', href: authorProfile?.instagram },
                    { label: 'LinkedIn', href: authorProfile?.linkedin },
                  ].filter((link) => link.href).map((link) => (
                    <Button key={link.label} component="a" href={link.href} target="_blank" rel="noreferrer" size="small">{link.label}</Button>
                  ))}
                </Stack>
              </Stack>
            </Stack>
            <Divider />
          </Stack>

          <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2.5} sx={{ mt: 6 }}>
            <Typography variant="h5">Bình luận ({comments.length})</Typography>
            {comments.length ? comments.map((comment) => (
              <Stack key={comment.id} direction="row" spacing={2} sx={{ p: 2.5, borderRadius: 2, bgcolor: (t) => varAlpha(t.vars.palette.grey['500Channel'], 0.04) }}>
                <Avatar sx={{ width: 40, height: 40 }}>{comment.name.charAt(0).toUpperCase()}</Avatar>
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={1.5} alignItems="baseline" flexWrap="wrap">
                    <Typography variant="subtitle2">{comment.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>{comment.createdAt}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{comment.content}</Typography>
                  {comment.reply && <Typography variant="body2" sx={{ pl: 2, borderLeft: 2, borderColor: 'primary.main', color: 'text.secondary' }}>LUXE Sofa: {comment.reply}</Typography>}
                </Stack>
              </Stack>
            )) : <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chưa có bình luận được duyệt. Hãy là người đầu tiên chia sẻ ý kiến.</Typography>}
            <Divider />
            <Typography variant="h6">Để lại bình luận</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Bình luận sẽ được kiểm duyệt trước khi hiển thị công khai. Email của bạn không được đăng lên trang.</Typography>
            <Stack component="form" onSubmit={handleCommentSubmit} spacing={2}>
              <TextField label="Tên của bạn" value={commentName} onChange={(event) => setCommentName(event.target.value)} required inputProps={{ maxLength: 80 }} />
              <TextField label="Email" type="email" value={commentEmail} onChange={(event) => setCommentEmail(event.target.value)} required />
              <TextField label="Nội dung bình luận" value={commentContent} onChange={(event) => setCommentContent(event.target.value)} required multiline minRows={4} inputProps={{ maxLength: 1200 }} />
              <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>Gửi bình luận</Button>
              {commentNotice && <Typography role="status" variant="body2" sx={{ color: 'success.main' }}>{commentNotice}</Typography>}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 4 }}>
            <Typography variant="subtitle2">Chia sẻ:</Typography>
            {channels.map((channel) => (
              <Button key={channel.id} variant="outlined" size="small" onClick={() => handleShare(channel).catch(() => setShareNotice('Không thể chia sẻ bài viết.'))} startIcon={<Iconify icon={channel.icon} />}>
                {channel.label}
              </Button>
            ))}
            {shareNotice && <Typography role="status" variant="caption" sx={{ color: 'text.secondary' }}>{shareNotice}</Typography>}
          </Stack>
        </Container>
      </Sofa2Section>

      <Sofa2Section bg="grey">
        <Stack spacing={2} sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>Bài viết liên quan</Typography>
          <Typography variant="h2">Tiếp tục đọc</Typography>
        </Stack>
        <Grid container spacing={3}>
          {related.map((item) => (
            <Grid key={item.id} xs={12} sm={6} md={4}>
              <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={0} sx={{ height: 1, borderRadius: 2, bgcolor: 'background.paper', overflow: 'hidden', boxShadow: (t) => t.customShadows.card }}>
                <Box component="img" src={item.image} alt={item.title} sx={{ width: 1, aspectRatio: '16/10', objectFit: 'cover' }} />
                <Stack spacing={1} sx={{ p: 3 }}>
                  <Typography variant="overline" sx={{ color: 'primary.main' }}>{item.categoryLabel}</Typography>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.excerpt}</Typography>
                  <Button component={RouterLink} href={`/sofa2/blog/${item.slug || item.id}`} size="small" sx={{ width: 'fit-content' }} endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>Đọc tiếp</Button>
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Sofa2Section>
    </>
  );
}
