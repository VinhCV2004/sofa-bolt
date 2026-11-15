import { Helmet } from 'react-helmet-async';

import { Sofa2View } from 'src/sections/sofa2/view';
import { useCmsSeo } from 'src/sections/sofa2/sofa2-cms-client';

// ----------------------------------------------------------------------

const metadata = {
  title: 'LUXE Sofa — Sofa thiết kế độc quyền | Scandinavian, Industrial, Mid-Century',
  description:
    'LUXE Sofa — Sofa thiết kế độc quyền 3 phong cách. Công nghệ đệm Đức, gỗ sồi FSC, da bò Ý. 80+ mẫu, bảo hành 10 năm, trả góp 0%.',
};

export default function Page() {
  const { seo } = useCmsSeo('/sofa2');

  return (
    <>
      <Helmet>
        <title>{seo?.metaTitle || metadata.title}</title>
        <meta name="description" content={seo?.metaDescription || metadata.description} />
        {seo?.keywords && <meta name="keywords" content={seo.keywords} />}
        {seo?.canonical && <link rel="canonical" href={seo.canonical} />}
        <meta name="robots" content={seo?.indexable === false ? 'noindex, nofollow' : 'index, follow'} />
        {seo?.ogImage && <meta property="og:image" content={seo.ogImage} />}
      </Helmet>

      <Sofa2View />
    </>
  );
}
