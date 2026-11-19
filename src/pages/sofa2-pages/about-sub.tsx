import { useMemo } from 'react';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { varAlpha, textGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SOFA2_MILESTONES } from 'src/sections/sofa2/sofa2-data';
import { Sofa2PageHero } from 'src/sections/sofa2/sofa2-page-hero';
import { useCmsPageBlocks } from 'src/sections/sofa2/sofa2-cms-client';
import { SOFA2_PAGE_IMAGES } from 'src/sections/sofa2/sofa2-pages-data';

// ----------------------------------------------------------------------

const SECTION_META: Record<string, { title: string; overline: string; image: string; helmet: string }> = {
  history: { title: 'Lịch sử phát triển', overline: 'Hành trình 12 năm', image: SOFA2_PAGE_IMAGES.aboutHero, helmet: 'Lịch sử - LUXE Sofa' },
  vision: { title: 'Tầm nhìn & Sứ mệnh', overline: 'Định hướng tương lai', image: SOFA2_PAGE_IMAGES.workshop, helmet: 'Tầm nhìn - LUXE Sofa' },
  values: { title: 'Giá trị cốt lõi', overline: 'Triết lý thương hiệu', image: SOFA2_PAGE_IMAGES.workshop, helmet: 'Giá trị - LUXE Sofa' },
  factory: { title: 'Nhà máy chế tác', overline: 'Năng lực sản xuất', image: SOFA2_PAGE_IMAGES.factory, helmet: 'Nhà máy - LUXE Sofa' },
  process: { title: 'Quy trình chế tác', overline: 'Từ ý tưởng đến sản phẩm', image: SOFA2_PAGE_IMAGES.factory, helmet: 'Quy trình - LUXE Sofa' },
  technology: { title: 'Công nghệ ứng dụng', overline: 'Đổi mới không ngừng', image: SOFA2_PAGE_IMAGES.technology, helmet: 'Công nghệ - LUXE Sofa' },
  certifications: { title: 'Chứng nhận chất lượng', overline: 'Tiêu chuẩn quốc tế', image: SOFA2_PAGE_IMAGES.factory, helmet: 'Chứng nhận - LUXE Sofa' },
  team: { title: 'Đội ngũ nghệ nhân', overline: 'Những con người tạo nên LUXE', image: SOFA2_PAGE_IMAGES.team, helmet: 'Đội ngũ - LUXE Sofa' },
  partners: { title: 'Đối tác của LUXE Sofa', overline: 'Mạng lưới hợp tác', image: SOFA2_PAGE_IMAGES.cta, helmet: 'Đối tác - LUXE Sofa' },
  gallery: { title: 'Thư viện ảnh', overline: 'Khoảnh khắc chế tác', image: SOFA2_PAGE_IMAGES.workshop, helmet: 'Thư viện ảnh - LUXE Sofa' },
  video: { title: 'Video hoạt động', overline: 'Hình ảnh động', image: SOFA2_PAGE_IMAGES.technology, helmet: 'Video - LUXE Sofa' },
};

const VALUES = [
  { icon: 'solar:pallete2-bold-duotone', title: 'Thiết kế độc quyền', desc: 'Mỗi mẫu sofa là thiết kế riêng, không trùng lặp trên thị trường.' },
  { icon: 'solar:leaf-bold-duotone', title: 'Gỗ FSC bền vững', desc: 'Khung gỗ sồi chứng nhận FSC, thân thiện môi trường.' },
  { icon: 'solar:bed-bold-duotone', title: 'Đệm Memory Foam', desc: 'Công nghệ đệm Đức ôm cơ thể, giữ form vượt thời gian.' },
];

const VISION = [
  { icon: 'solar:eye-bold-duotone', title: 'Tầm nhìn', desc: 'Trở thành thương hiệu sofa cao cấp số 1 Đông Nam Á vào năm 2030.' },
  { icon: 'solar:rocket-bold-duotone', title: 'Sứ mệnh', desc: 'Mang đến không gian sống sang trọng và bền vững cho mọi gia đình Việt.' },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Thiết kế', desc: 'Đội ngũ thiết kế phác thảo 3D theo yêu cầu khách hàng.' },
  { step: '02', title: 'Chọn vật liệu', desc: 'Tuyển chọn gỗ sồi FSC, da bò và vải linen cao cấp.' },
  { step: '03', title: 'Chế tác khung', desc: 'Nghệ nhân gia công khung gỗ bằng tay, độ chính xác mm.' },
  { step: '04', title: 'May bọc', desc: 'May đệm, bọc da/vải thủ công với từng đường kim.' },
  { step: '05', title: 'Kiểm tra', desc: 'Kiểm tra chất lượng 12 tiêu chuẩn trước khi xuất xưởng.' },
];

const TECH = [
  { icon: 'solar:cpu-bold-duotone', title: 'Cắt CNC', desc: 'Máy cắt CNC độ chính xác 0.1mm cho khung gỗ.' },
  { icon: 'solar:bed-bold-duotone', title: 'Memory Foam', desc: 'Công nghệ đệm Đức ôm cơ thể, giảm áp lực cột sống.' },
  { icon: 'solar:battery-charge-bold-duotone', title: 'Recliner điện', desc: 'Cơ chế recliner Nhật Bản, 3 tư thế ngả, massage lưng.' },
  { icon: 'solar:wi-fi-router-bold-duotone', title: 'Sofa thông minh', desc: 'Tích hợp USB, loa Bluetooth và ngăn chứa thông minh.' },
];

const CERTS = [
  { icon: 'solar:leaf-bold-duotone', title: 'FSC', desc: 'Chứng nhận quản lý rừng bền vững.' },
  { icon: 'solar:shield-check-bold-duotone', title: 'ISO 9001', desc: 'Quản lý chất lượng quốc tế.' },
  { icon: 'solar:medal-ribbon-bold-duotone', title: 'CE', desc: 'Tiêu chuẩn an toàn Châu Âu.' },
  { icon: 'solar:hand-stars-bold-duotone', title: 'EcoLabel', desc: 'Nhãn sinh thái thân thiện môi trường.' },
];

const TEAM = [
  { name: 'Nguyễn Minh Anh', role: 'Giám đốc sáng tạo', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'Trần Hoàng Long', role: 'Trưởng xưởng chế tác', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Lê Thu Hà', role: 'Trưởng phòng thiết kế', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
  { name: 'Phạm Quốc Bảo', role: 'Quản lý chất lượng', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
];

const PARTNERS = ['Vingroup', 'Vinpearl', 'Marriott', 'InterContinental', 'BMW', 'Sun Group'];

const GALLERY = [SOFA2_PAGE_IMAGES.workshop, SOFA2_PAGE_IMAGES.factory, SOFA2_PAGE_IMAGES.technology, SOFA2_PAGE_IMAGES.team, SOFA2_PAGE_IMAGES.product1, SOFA2_PAGE_IMAGES.product7, SOFA2_PAGE_IMAGES.cta, SOFA2_PAGE_IMAGES.contact];

const companyVideoEmbed = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    const youtubeId = url.hostname.endsWith('youtu.be')
      ? url.pathname.split('/').filter(Boolean)[0]
      : url.hostname.includes('youtube.com')
        ? url.searchParams.get('v') || url.pathname.match(/\/embed\/([^/]+)/)?.[1]
        : '';
    if (youtubeId && /^[\w-]{6,20}$/.test(youtubeId)) return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
    const vimeoId = url.hostname.includes('vimeo.com') ? url.pathname.match(/\/(\d+)\/?$/)?.[1] : '';
    if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
    return '';
  } catch {
    return '';
  }
};

export default function Page() {
  const theme = useTheme();
  const { section = '' } = useParams();
  const { blocks: aboutBlocks } = useCmsPageBlocks('about');
  const isCmsManaged = aboutBlocks.some((block) => block.type === 'About page');
  const pageBlock = aboutBlocks.find((block) => block.block === `page-${section}` && block.type === 'About page');
  const sectionRows = useMemo(() => aboutBlocks.filter((block) => block.block.startsWith(`${section}-`) && block.type !== 'About page'), [aboutBlocks, section]);
  const meta = pageBlock ? {
    title: pageBlock.heading,
    overline: pageBlock.title || 'Về LUXE Sofa',
    image: pageBlock.image || SOFA2_PAGE_IMAGES.aboutHero,
    helmet: pageBlock.metaTitle || `${pageBlock.heading} | LUXE Sofa`,
  } : SECTION_META[section] ?? {
    title: 'Không tìm thấy trang',
    overline: 'Lỗi',
    image: SOFA2_PAGE_IMAGES.aboutHero,
    helmet: 'Không tìm thấy - LUXE Sofa',
  };
  const pageExists = !isCmsManaged || Boolean(pageBlock);

  const content = useMemo(() => {
    const blocksOf = (type: string) => sectionRows.filter((block) => block.type === type);
    if (!pageExists) {
      return (
        <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', py: 10 }}>
          <Iconify icon="solar:file-remove-bold-duotone" width={64} sx={{ color: 'text.disabled' }} />
          <Typography variant="h4">Trang giới thiệu chưa được xuất bản</Typography>
          <Button component={RouterLink} href="/sofa2/about" variant="contained">Quay lại Giới thiệu</Button>
        </Stack>
      );
    }
    switch (section) {
      case 'history':
        return (
          <Stack spacing={4} component={MotionViewport}>
            {(blocksOf('Milestone').length ? blocksOf('Milestone').map((block) => ({ id: block.id, year: block.title, title: block.heading, description: block.content })) : SOFA2_MILESTONES.map((item) => ({ ...item, id: item.year }))).map((item) => (
              <Grid key={item.id} container spacing={4} alignItems="center" component={m.div} variants={varFade({ distance: 24 }).inUp}>
                <Grid xs={12} sm={3}>
                  <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 'fontWeightBold' }}>{item.year}</Typography>
                </Grid>
                <Grid xs={12} sm={9}>
                  <Stack spacing={0.5}>
                    <Typography variant="h5">{item.title}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            ))}
          </Stack>
        );
      case 'vision':
        return (
          <Grid container spacing={3} component={MotionViewport}>
            {(blocksOf('Vision').length || blocksOf('Mission').length
              ? [...blocksOf('Vision'), ...blocksOf('Mission')].map((block) => ({ id: block.id, title: block.heading, desc: block.content, icon: block.icon || 'solar:star-bold-duotone' }))
              : VISION.map((item) => ({ ...item, id: item.title }))).map((item) => (
              <Grid key={item.id} xs={12} md={6}>
                <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} sx={{ p: 4, height: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />
                  <Typography variant="h5">{item.title}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{item.desc}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        );
      case 'values':
        return (
          <Grid container spacing={3} component={MotionViewport}>
            {(blocksOf('Core value').length
              ? blocksOf('Core value').map((block) => ({ id: block.id, title: block.heading, desc: block.content, icon: block.icon || 'solar:star-bold-duotone' }))
              : VALUES.map((item) => ({ ...item, id: item.title }))).map((item) => (
              <Grid key={item.id} xs={12} md={4}>
                <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} sx={{ p: 4, height: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  <Box sx={{ width: 56, height: 56, display: 'flex', borderRadius: 1.5, alignItems: 'center', justifyContent: 'center', bgcolor: (t) => varAlpha(t.vars.palette.primary.mainChannel, 0.08), color: 'primary.main' }}>
                    <Iconify icon={item.icon} width={28} />
                  </Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.desc}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        );
      case 'factory':
        return (
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center" component={MotionViewport}>
            <Grid xs={12} md={6}>
              <Box component={m.div} variants={varFade({ distance: 24 }).inLeft}>
                <Box component="img" src={blocksOf('Factory')[0]?.image || meta.image || SOFA2_PAGE_IMAGES.factory} alt={blocksOf('Factory')[0]?.heading || 'Nhà máy'} sx={{ width: 1, borderRadius: 2, aspectRatio: '4/3', objectFit: 'cover' }} />
              </Box>
            </Grid>
            <Grid xs={12} md={6}>
              <Stack spacing={3} component={m.div} variants={varFade({ distance: 24 }).inRight}>
                <Typography variant="h3">{blocksOf('Factory')[0]?.heading || 'Nhà máy 5000m² tại Bình Dương'}</Typography>
                <Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>{blocksOf('Factory')[0]?.content || 'Nhà máy LUXE Sofa được trang bị dây chuyền sản xuất hiện đại kết hợp chế tác thủ công. Khu vực sản xuất được chia thành các phân xưởng chuyên biệt: chế tác gỗ, may bọc, lắp ráp và kiểm tra chất lượng.'}</Typography>
              </Stack>
            </Grid>
          </Grid>
        );
      case 'process':
        return (
          <Grid container spacing={3} component={MotionViewport}>
            {(blocksOf('Process step').length
              ? blocksOf('Process step').map((block) => ({ id: block.id, step: block.title, title: block.heading, desc: block.content }))
              : PROCESS_STEPS.map((item) => ({ ...item, id: item.step }))).map((item) => (
              <Grid key={item.id} xs={12} sm={6} md={4}>
                <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} sx={{ p: 4, height: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  <Typography variant="h2" sx={{ ...textGradient(`135deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}`), opacity: 0.5 }}>{item.step}</Typography>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.desc}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        );
      case 'technology':
        return (
          <Grid container spacing={3} component={MotionViewport}>
            {(blocksOf('Technology').length
              ? blocksOf('Technology').map((block) => ({ id: block.id, title: block.heading, desc: block.content, icon: block.icon || 'solar:cpu-bold-duotone' }))
              : TECH.map((item) => ({ ...item, id: item.title }))).map((item) => (
              <Grid key={item.id} xs={12} sm={6} md={3}>
                <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} sx={{ p: 4, height: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  <Box sx={{ width: 56, height: 56, display: 'flex', borderRadius: 1.5, alignItems: 'center', justifyContent: 'center', bgcolor: (t) => varAlpha(t.vars.palette.primary.mainChannel, 0.08), color: 'primary.main' }}>
                    <Iconify icon={item.icon} width={28} />
                  </Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.desc}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        );
      case 'certifications':
        return (
          <Grid container spacing={3} component={MotionViewport}>
            {(blocksOf('Certificate').length
              ? blocksOf('Certificate').map((block) => ({ id: block.id, title: block.heading, desc: block.content, icon: block.icon || 'solar:medal-ribbon-bold-duotone' }))
              : CERTS.map((item) => ({ ...item, id: item.title }))).map((item) => (
              <Grid key={item.id} xs={12} sm={6} md={3}>
                <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} alignItems="center" sx={{ p: 4, height: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card, textAlign: 'center' }}>
                  <Box sx={{ width: 72, height: 72, display: 'flex', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', bgcolor: (t) => varAlpha(t.vars.palette.primary.mainChannel, 0.08), color: 'primary.main' }}>
                    <Iconify icon={item.icon} width={36} />
                  </Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.desc}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        );
      case 'team':
        return (
          <Grid container spacing={3} component={MotionViewport}>
            {(blocksOf('Team member').length
              ? blocksOf('Team member').map((block) => ({ id: block.id, name: block.heading, role: block.title, avatar: block.image, bio: block.content }))
              : TEAM.map((member) => ({ ...member, id: member.name, bio: '' }))).map((member) => (
              <Grid key={member.id} xs={12} sm={6} md={3}>
                <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} spacing={2} alignItems="center" sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  <Avatar src={member.avatar} alt={member.name} sx={{ width: 96, height: 96 }} />
                  <Typography variant="h6">{member.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{member.role}</Typography>
                  {!!member.bio && <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>{member.bio}</Typography>}
                </Stack>
              </Grid>
            ))}
          </Grid>
        );
      case 'partners':
        return (
          <Grid container spacing={3} component={MotionViewport}>
            {(blocksOf('Partner').length
              ? blocksOf('Partner').map((block) => ({ id: block.id, name: block.heading, description: block.content }))
              : PARTNERS.map((name) => ({ id: name, name, description: '' }))).map((partner) => (
              <Grid key={partner.id} xs={6} sm={4} md={2}>
                <Stack component={m.div} variants={varFade({ distance: 24 }).inUp} alignItems="center" justifyContent="center" sx={{ p: 4, height: 120, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  <Typography variant="h6" sx={{ fontWeight: 'fontWeightBold', opacity: 0.6 }}>{partner.name}</Typography>
                  {!!partner.description && <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>{partner.description}</Typography>}
                </Stack>
              </Grid>
            ))}
          </Grid>
        );
      case 'gallery':
        return (
          <Grid container spacing={2} component={MotionViewport}>
            {(blocksOf('Gallery image').length
              ? blocksOf('Gallery image').map((block) => ({ id: block.id, image: block.image, title: block.heading }))
              : GALLERY.map((image, index) => ({ id: String(index), image, title: `Gallery ${index + 1}` }))).map((item) => (
              <Grid key={item.id} xs={6} sm={4} md={3}>
                <Box component={m.img} variants={varFade({ distance: 24 }).inUp} src={item.image} alt={item.title} sx={{ width: 1, borderRadius: 2, aspectRatio: '1/1', objectFit: 'cover' }} />
              </Grid>
            ))}
          </Grid>
        );
      case 'video':
        return (
          <Grid container spacing={3} component={MotionViewport}>
            {(blocksOf('Video').length
              ? blocksOf('Video').map((block) => ({ id: block.id, title: block.heading, description: block.content, image: block.image, url: block.videoUrl }))
              : [SOFA2_PAGE_IMAGES.technology, SOFA2_PAGE_IMAGES.factory, SOFA2_PAGE_IMAGES.workshop].map((image, index) => ({ id: String(index), title: `Video ${index + 1}`, description: '', image, url: '' }))).map((item) => {
                const embedUrl = companyVideoEmbed(item.url);
                const directVideo = /^https?:\/\/.+\.(mp4|webm)(\?.*)?$/i.test(item.url);
                return (
                  <Grid key={item.id} xs={12} md={6}>
                    <Stack spacing={1.5}>
                      <Box component={m.div} variants={varFade({ distance: 24 }).inUp} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', aspectRatio: '16/9', bgcolor: 'grey.900' }}>
                        {embedUrl ? (
                          <Box component="iframe" src={embedUrl} title={item.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen sx={{ width: 1, height: 1, border: 0 }} />
                        ) : directVideo ? (
                          <Box component="video" src={item.url} poster={item.image} controls preload="metadata" sx={{ width: 1, height: 1, objectFit: 'cover' }} />
                        ) : (
                          <>
                            <Box component="img" src={item.image || meta.image} alt={item.title} sx={{ width: 1, height: 1, objectFit: 'cover' }} />
                            <Stack alignItems="center" justifyContent="center" sx={{ position: 'absolute', inset: 0, bgcolor: varAlpha(theme.vars.palette.common.blackChannel, 0.45), color: 'common.white' }}>
                              <Iconify icon="solar:play-bold" width={48} />
                              {!item.url && <Typography variant="caption" sx={{ mt: 1 }}>Video chưa được gắn liên kết</Typography>}
                              {!!item.url && <Typography variant="caption" sx={{ mt: 1 }}>URL video chưa được hỗ trợ</Typography>}
                            </Stack>
                          </>
                        )}
                      </Box>
                      <Typography variant="h6">{item.title}</Typography>
                      {!!item.description && <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.description}</Typography>}
                    </Stack>
                  </Grid>
                );
              })}
          </Grid>
        );
      default:
        return sectionRows.length ? (
          <Grid container spacing={3} component={MotionViewport}>
            {sectionRows.map((block) => (
              <Grid key={block.id} xs={12} md={block.image ? 6 : 12}>
                <Stack spacing={2} sx={{ p: 3, height: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: (t) => t.customShadows.card }}>
                  {block.image && <Box component="img" src={block.image} alt={block.heading} sx={{ width: 1, borderRadius: 1.5, maxHeight: 420, objectFit: 'cover' }} />}
                  <Typography variant="h5">{block.heading}</Typography>
                  <Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>{block.content}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', py: 10 }}>
            <Iconify icon="solar:file-remove-bold-duotone" width={64} sx={{ color: 'text.disabled' }} />
            <Typography variant="h4">Trang không tồn tại</Typography>
            <Button component={RouterLink} href="/sofa2/about" variant="contained">Quay lại trang Giới thiệu</Button>
          </Stack>
        );
    }
  }, [meta.image, pageExists, section, sectionRows, theme]);

  return (
    <>
      <Helmet>
        <title>{pageBlock?.metaTitle || meta.helmet}</title>
        {pageBlock?.metaDescription && <meta name="description" content={pageBlock.metaDescription} />}
        <meta name="robots" content={pageExists && (!pageBlock || pageBlock.indexable) ? 'index, follow' : 'noindex, nofollow'} />
        <link rel="canonical" href={`https://luxesofa.vn/sofa2/about/${section}`} />
      </Helmet>

      {pageExists && <Sofa2PageHero
        overline={meta.overline}
        title={meta.title}
        image={meta.image}
      />}

      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container>{content}</Container>
      </Box>
    </>
  );
}
