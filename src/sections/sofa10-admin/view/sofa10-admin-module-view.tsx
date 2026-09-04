import Box from '@mui/material/Box';

import { useParams } from 'src/routes/hooks';

import { EmptyContent } from 'src/components/empty-content';

import {
  Sofa10AdminLayout,
  Sofa10AdminHeading,
  Sofa10AdminKpis,
  Sofa10AdminTable,
} from '../sofa10-admin-layout';
import { findSofa10AdminGroup, findSofa10AdminSection } from '../sofa10-admin-config';

// ----------------------------------------------------------------------

export function Sofa10AdminModuleView() {
  const params = useParams();
  const group = findSofa10AdminGroup(params.group);
  const section = findSofa10AdminSection(params.group, params.module);

  if (!group) {
    return (
      <Sofa10AdminLayout>
        <EmptyContent title="Không tìm thấy nhóm quản trị" />
      </Sofa10AdminLayout>
    );
  }

  if (params.module && !section) {
    return (
      <Sofa10AdminLayout>
        <EmptyContent title="Không tìm thấy trang quản trị" />
      </Sofa10AdminLayout>
    );
  }

  if (section) {
    return (
      <Sofa10AdminLayout>
        <Sofa10AdminHeading
          title={section.name}
          description={section.desc}
          breadcrumb={[{ name: 'Admin' }, { name: group.name }, { name: section.name }]}
        />
        <Sofa10AdminKpis items={section.kpis} />
        <Sofa10AdminTable columns={section.columns} rows={section.rows} />
      </Sofa10AdminLayout>
    );
  }

  return (
    <Sofa10AdminLayout>
      <Sofa10AdminHeading
        title={group.name}
        description={group.desc}
        breadcrumb={[{ name: 'Admin' }, { name: group.name }]}
      />
      <Sofa10AdminKpis
        items={[
          { label: 'Số trang', value: String(group.sections.length) },
          { label: 'Nhóm', value: group.name },
        ]}
      />
      {group.sections.map((sec) => (
        <Box key={sec.slug} sx={{ mb: 4 }}>
          <Sofa10AdminHeading
            title={sec.name}
            description={sec.desc}
            breadcrumb={[{ name: group.name }, { name: sec.name }]}
          />
          <Sofa10AdminKpis items={sec.kpis} />
          <Sofa10AdminTable columns={sec.columns} rows={sec.rows} />
        </Box>
      ))}
    </Sofa10AdminLayout>
  );
}


