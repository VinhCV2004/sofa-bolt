import Box from '@mui/material/Box';

import { useParams } from 'src/routes/hooks';

import { EmptyContent } from 'src/components/empty-content';

import {
  Sofa11AdminLayout,
  Sofa11AdminHeading,
  Sofa11AdminKpis,
  Sofa11AdminTable,
} from '../sofa11-admin-layout';
import { findSofa11AdminGroup, findSofa11AdminSection } from '../sofa11-admin-config';

// ----------------------------------------------------------------------

export function Sofa11AdminModuleView() {
  const params = useParams();
  const group = findSofa11AdminGroup(params.group);
  const section = findSofa11AdminSection(params.group, params.module);

  if (!group) {
    return (
      <Sofa11AdminLayout>
        <EmptyContent title="Không tìm thấy nhóm quản trị" />
      </Sofa11AdminLayout>
    );
  }

  if (params.module && !section) {
    return (
      <Sofa11AdminLayout>
        <EmptyContent title="Không tìm thấy trang quản trị" />
      </Sofa11AdminLayout>
    );
  }

  if (section) {
    return (
      <Sofa11AdminLayout>
        <Sofa11AdminHeading
          title={section.name}
          description={section.desc}
          breadcrumb={[{ name: 'Admin' }, { name: group.name }, { name: section.name }]}
        />
        <Sofa11AdminKpis items={section.kpis} />
        <Sofa11AdminTable columns={section.columns} rows={section.rows} />
      </Sofa11AdminLayout>
    );
  }

  return (
    <Sofa11AdminLayout>
      <Sofa11AdminHeading
        title={group.name}
        description={group.desc}
        breadcrumb={[{ name: 'Admin' }, { name: group.name }]}
      />
      <Sofa11AdminKpis
        items={[
          { label: 'Số trang', value: String(group.sections.length) },
          { label: 'Nhóm', value: group.name },
        ]}
      />
      {group.sections.map((sec) => (
        <Box key={sec.slug} sx={{ mb: 4 }}>
          <Sofa11AdminHeading
            title={sec.name}
            description={sec.desc}
            breadcrumb={[{ name: group.name }, { name: sec.name }]}
          />
          <Sofa11AdminKpis items={sec.kpis} />
          <Sofa11AdminTable columns={sec.columns} rows={sec.rows} />
        </Box>
      ))}
    </Sofa11AdminLayout>
  );
}


