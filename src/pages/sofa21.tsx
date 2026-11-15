import { Helmet } from 'react-helmet-async';

import { Sofa21View } from 'src/sections/sofa21/view/sofa21-view';

export default function Sofa21Page() {
  return (
    <>
      <Helmet>
        <title>Sofa21 — Sofa dành cho không gian sống của bạn</title>
        <meta
          name="description"
          content="Khám phá sofa Sofa21: thiết kế phù hợp không gian sống, chất liệu tuyển chọn và dịch vụ tư vấn, giao lắp tận tâm."
        />
      </Helmet>
      <Sofa21View />
    </>
  );
}
