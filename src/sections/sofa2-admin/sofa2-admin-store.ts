import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

import { sofa2Slugify } from './sofa2-cms';
import { SOFA2_ADMIN_GROUPS } from './sofa2-admin-data';

// ----------------------------------------------------------------------
// Kho CRUD dùng chung cho khu quản trị Sofa2; dữ liệu mặc định khởi tạo từ SOFA2_ADMIN_GROUPS.
// Riêng module access được lưu browser-local để giữ thay đổi giữa các lần tải (chỉ phục vụ demo).
// ----------------------------------------------------------------------

export type AdminRow = Record<string, string | number>;

type Store = Record<string, AdminRow[]>;

const key = (group: string, module: string) => {
  if (group === 'hr' && ['job-detail', 'recruitment-tracking'].includes(module)) {
    return 'hr/recruitment';
  }
  if (group === 'shopping') {
    if (['account', 'profile'].includes(module)) return 'customer/profiles';
    if (module === 'my-orders') return 'customer/customer-orders';
    if (module === 'warranty') return 'customer/warranties';
    if (module === 'tracking') return 'shop/tracking';
    if (module === 'wishlist') return 'shop/wishlist';
  }
  return `${group}/${module}`;
};

const store: Store = {};
const savedSeoRows = new Map<string, AdminRow[]>();
const seoWriteQueues = new Map<string, Promise<AdminRow[]>>();
const seoWriteRevisions = new Map<string, number>();

const STORAGE_KEY = 'sofa2-admin-rows-v1';
const ACCESS_STORAGE_KEY = 'sofa2-access-demo-v1';
const ACCESS_MODULES = ['users', 'roles', 'permissions', 'audit-log'] as const;
const ACCESS_AUDIT_LIMIT = 500;
let accessSnapshotHydrated = false;

function hydrateAccessSnapshot() {
  if (accessSnapshotHydrated) return;
  accessSnapshotHydrated = true;
  if (typeof window === 'undefined') return;
  try {
    const saved = window.localStorage.getItem(ACCESS_STORAGE_KEY);
    if (!saved) return;
    const snapshot = JSON.parse(saved) as Record<string, unknown>;
    ACCESS_MODULES.forEach((module) => {
      const moduleKey = key('access', module);
      const rows = snapshot[moduleKey];
      if (Array.isArray(rows)) {
        store[moduleKey] = rows.filter(
          (row): row is AdminRow => !!row && typeof row === 'object' && !Array.isArray(row)
        );
      }
    });
  } catch {
    // Ignore malformed browser-only demo data and keep the seeded defaults.
  }
}

function persistAccessSnapshot() {
  if (typeof window === 'undefined') return;
  try {
    const snapshot = Object.fromEntries(
      ACCESS_MODULES.map((module) => [key('access', module), store[key('access', module)] ?? []])
    );
    window.localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // The browser demo remains usable if storage is disabled or full.
  }
}

function appendAccessAudit(moduleSlug: string, action: string, row: AdminRow, before?: AdminRow) {
  if (moduleSlug === 'audit-log') return;
  hydrateAccessSnapshot();
  const timestamp = new Date();
  const auditKey = key('access', 'audit-log');
  const auditRows = store[auditKey] ?? [];
  const title = String(row.name ?? row.role ?? row.module ?? row.email ?? row.action ?? 'Bản ghi');
  const detail = before
    ? `Trước: ${JSON.stringify(before)} | Sau: ${JSON.stringify(row)}`
    : JSON.stringify(row);
  store[key('access', 'audit-log')] = [
    {
      time: timestamp.toISOString(),
      user: 'Quản trị viên demo',
      type: 'Thay đổi phân quyền',
      module: moduleSlug,
      action,
      target: title,
      detail: detail.slice(0, 2000),
      ip: 'Không khả dụng trong demo',
      device: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 160) : 'Không xác định',
      location: 'Không xác định',
      handled: 'false',
      status: 'Thành công',
    },
    ...auditRows,
  ].slice(0, ACCESS_AUDIT_LIMIT);
  persistAccessSnapshot();
  emit();
}

SOFA2_ADMIN_GROUPS.forEach((group) => {
  group.modules.forEach((module) => {
    if (group.slug === 'hr' && ['job-detail', 'recruitment-tracking'].includes(module.slug)) return;
    if (
      group.slug === 'shopping' &&
      ['account', 'profile', 'my-orders', 'warranty', 'tracking'].includes(module.slug)
    ) {
      return;
    }
    store[key(group.slug, module.slug)] = module.rows.map((row, index) => ({
      ...row,
      ...(group.slug === 'cms' && !row.id ? { id: `cms-${module.slug}-${index + 1}` } : {}),
    }));
  });
});

// Khôi phục dữ liệu đã lưu (giữ thay đổi sau khi tải lại trang, dùng chung với trang khách)
try {
  const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (saved) {
    const savedRows = JSON.parse(saved) as Store;
    Object.entries(savedRows).forEach(([storeKey, rows]) => {
      store[storeKey] = storeKey.startsWith('cms/')
        ? (rows ?? []).map((row, index) => ({
            ...row,
            id: String(row.id ?? `cms-${storeKey.slice(4)}-${index + 1}`),
          }))
        : rows;
    });
  } else {
    const addressesKey = key('shopping', 'addresses');
    const wishlistKey = key('shop', 'wishlist');
    const transactionsKey = key('shopping', 'transactions');
    const customerId = 'KH-1001';
    const customer = 'Nguyễn Minh Anh';

    if (
      !(store[addressesKey] ?? []).some(
        (row) =>
          String(row.customerId ?? '') === customerId ||
          String(row.customer ?? '') === customer
      )
    ) {
      store[addressesKey] = [
        {
          addressId: 'ADDR-KH-1001-1',
          customerId,
          customer,
          label: 'Nhà',
          recipient: customer,
          phone: '0901 234 567',
          address: '123 Nguyễn Trãi',
          ward: 'Thanh Xuân',
          district: 'Thanh Xuân',
          city: 'Hà Nội',
          zipCode: '',
          deliveryType: 'Giao tận nhà',
          deliveryNote: '',
          isDefault: 'true',
          status: 'Mặc định',
        },
        ...(store[addressesKey] ?? []),
      ];
    }

    if (
      !(store[wishlistKey] ?? []).some(
        (row) =>
          String(row.customerId ?? '') === customerId ||
          String(row.customer ?? '') === customer
      )
    ) {
      store[wishlistKey] = [
        ...['Sofa Oslo 3 Chỗ', 'Sofa Berlin Góc', 'Sofa Copenhagen', 'Sofa Tokyo Đơn'].map(
          (product, index) => ({
            customerId,
            customer,
            product,
            added: `2026-10-${String(20 - index).padStart(2, '0')}`,
            notify: 'Có',
            status: 'Đang lưu',
          })
        ),
        ...(store[wishlistKey] ?? []),
      ];
    }

    if (
      !(store[transactionsKey] ?? []).some(
        (row) =>
          String(row.customerId ?? '') === customerId ||
          String(row.customer ?? '') === customer
      )
    ) {
      store[transactionsKey] = [
        {
          txnId: 'GD-KH1001-01',
          customerId,
          customer,
          order: 'LX-26091502',
          method: 'VNPay QR',
          amount: 25900000,
          date: '2026-09-15',
          status: 'Thành công',
        },
        {
          txnId: 'GD-KH1001-02',
          customerId,
          customer,
          order: 'LX-26091011',
          method: 'Chuyển khoản',
          amount: 11550000,
          date: '2026-09-10',
          status: 'Thành công',
        },
        ...(store[transactionsKey] ?? []),
      ];
    }
  }
} catch {
  /* bỏ qua */
}

// Keep every seeded/client order searchable from the public order-tracking page.
const customerOrders = store[key('customer', 'customer-orders')] ?? [];
const customerProfiles = store[key('customer', 'profiles')] ?? [];
const trackingKey = key('shop', 'tracking');
const trackedCodes = new Set((store[trackingKey] ?? []).map((row) => String(row.code ?? '')));
const missingTrackingRows = customerOrders
  .filter((order) => !trackedCodes.has(String(order.code ?? '')))
  .map((order) => {
    const profile = customerProfiles.find(
      (row) => String(row.customerId ?? '') === String(order.customerId ?? '')
    );
    const orderStatus = String(order.status ?? 'Chờ xác nhận');
    const step = orderStatus === 'Đang giao' ? 'Giao hàng'
      : ['Đã giao', 'Hoàn thành'].includes(orderStatus) ? 'Hoàn tất'
        : orderStatus === 'Đang sản xuất' ? 'Sản xuất'
          : orderStatus === 'Đang xử lý' ? 'Xác nhận' : 'Đặt hàng';
    const status = orderStatus === 'Hoàn thành' ? 'Đã giao'
      : ['Yêu cầu huỷ', 'Đổi trả'].includes(orderStatus) ? 'Đang xử lý' : orderStatus;
    return {
      code: String(order.code ?? ''),
      customer: String(order.customer ?? profile?.name ?? ''),
      phone: String(order.phone ?? profile?.phone ?? ''),
      address: String(order.address ?? profile?.address ?? ''),
      items: String(order.product ?? ''),
      total: Number(order.total ?? 0),
      step,
      carrier: 'Đội xe LUXE',
      trackingNo: '',
      eta: '',
      status,
      updated: String(order.orderDate ?? ''),
    };
  });
store[trackingKey] = [...(store[trackingKey] ?? []), ...missingTrackingRows];

const defaultRecruitmentRows =
  SOFA2_ADMIN_GROUPS.find((group) => group.slug === 'hr')?.modules.find((module) => module.slug === 'recruitment')?.rows ?? [];
store[key('hr', 'recruitment')] = (store[key('hr', 'recruitment')] ?? []).map((row, index) => ({
  ...(defaultRecruitmentRows[index] ?? {}),
  ...row,
  jobId: String(row.jobId || defaultRecruitmentRows[index]?.jobId || `JOB-IMPORT-${index + 1}`),
  legacyId: String(row.legacyId || defaultRecruitmentRows[index]?.legacyId || index + 1),
}));

(['submit-cv', 'applicant-profile'] as const).forEach((module) => {
  const defaultRows =
    SOFA2_ADMIN_GROUPS.find((group) => group.slug === 'hr')?.modules.find((item) => item.slug === module)?.rows ?? [];
  const rowKey = key('hr', module);
  store[rowKey] = (store[rowKey] ?? []).map((row, index) => {
    const name = String(module === 'submit-cv' ? row.applicant : row.name).trim().toLowerCase();
    const seed = defaultRows.find((candidate) =>
      String(module === 'submit-cv' ? candidate.applicant : candidate.name).trim().toLowerCase() === name
    );
    return {
      ...(seed ?? {}),
      ...row,
      applicationId: String(row.applicationId || seed?.applicationId || `APP-IMPORT-${index + 1}`),
    };
  });
});

function adjustRecruitmentApplicants(application: AdminRow, change: number) {
  const jobId = String(application.jobId ?? '');
  const jobTitle = String(application.job ?? application.appliedJob ?? '');
  const status = String(application.status ?? '');
  const screeningPassed = String(application.screeningResult ?? '') === 'Qua'
    || ['Phỏng vấn', 'Thử việc', 'Trúng tuyển'].includes(status);
  const offered = ['Có', 'true', 'yes', '1'].includes(String(application.offerSent ?? '').toLowerCase())
    || ['Thử việc', 'Trúng tuyển'].includes(status);
  const metrics = {
    applicants: 1,
    screeningPassed: screeningPassed ? 1 : 0,
    interviewing: status === 'Phỏng vấn' ? 1 : 0,
    offered: offered ? 1 : 0,
    hired: status === 'Trúng tuyển' ? 1 : 0,
    rejected: status === 'Không đạt' ? 1 : 0,
  };
  const jobsKey = key('hr', 'recruitment');
  store[jobsKey] = (store[jobsKey] ?? []).map((job) => {
    const matches = jobId
      ? String(job.jobId ?? '') === jobId
      : String(job.title ?? '') === jobTitle;
    if (!matches) return job;
    const next = { ...job };
    Object.entries(metrics).forEach(([field, amount]) => {
      next[field] = Math.max(0, Number(job[field] || 0) + change * amount);
    });
    return next;
  });
}

function removeLinkedApplications(sourceModule: 'submit-cv' | 'applicant-profile', removed: AdminRow[]) {
  const targetModule = sourceModule === 'submit-cv' ? 'applicant-profile' : 'submit-cv';
  const targetKey = key('hr', targetModule);
  const ids = new Set(removed.map((row) => String(row.applicationId ?? '')).filter(Boolean));
  const targetRows = store[targetKey] ?? [];
  if (sourceModule === 'submit-cv') {
    removed.forEach((row) => adjustRecruitmentApplicants(row, -1));
  } else {
    targetRows.filter((row) => ids.has(String(row.applicationId ?? ''))).forEach((row) => adjustRecruitmentApplicants(row, -1));
  }
  store[targetKey] = targetRows.filter((row) => !ids.has(String(row.applicationId ?? '')));
}

const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      Object.assign(store, JSON.parse(event.newValue) as Store);
      listeners.forEach((listener) => listener());
    } catch {
      /* ignore invalid data from another tab */
    }
  });
}

const emit = () => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* bỏ qua */
  }
  listeners.forEach((l) => l());
};

/** Đọc nhanh dữ liệu một module (không cần hook) */
export const getSofa2AdminRows = (groupSlug: string, moduleSlug: string) =>
  store[key(groupSlug, moduleSlug)] ?? [];

export async function loadSofa2SeoRows(moduleSlug: string, defaults: AdminRow[]) {
  const k = key('seo', moduleSlug);
  const rows = (store[k] ?? defaults).map((row) => ({ ...row }));
  store[k] = rows;
  emit();
  return rows;
}

export async function syncSofa2SeoRows(moduleSlug: string, rows: AdminRow[]) {
  const k = key('seo', moduleSlug);
  const nextRows = rows.map((row) => ({ ...row }));
  store[k] = nextRows;
  emit();
  return nextRows;
}

// ----------------------------------------------------------------------
// CMS mock data is stored alongside other admin rows in browser localStorage.
// ----------------------------------------------------------------------

const CMS_TABLE_MAP: Record<string, string> = {
  home: 'sofa2_cms_pages',
  about: 'sofa2_cms_pages',
  contact: 'sofa2_cms_pages',
  policy: 'sofa2_cms_pages',
  terms: 'sofa2_cms_pages',
  faq: 'sofa2_cms_pages',
  blog: 'sofa2_cms_posts',
  menu: 'sofa2_cms_menus',
  banner: 'sofa2_cms_banners',
  slider: 'sofa2_cms_sliders',
  seo: 'sofa2_cms_seo',
  'static-pages': 'sofa2_cms_static_pages',
};

const STATUS_VN_TO_EN: Record<string, string> = {
  'Đã xuất bản': 'published',
  'Đang chạy': 'published',
  'Bản nháp': 'draft',
  'Tạm ẩn': 'hidden',
  'Hết hạn': 'expired',
  'Chờ duyệt': 'pending',
  'Tốt': 'published',
  'Cần cải thiện': 'draft',
  'Thiếu meta': 'draft',
};

const STATUS_EN_TO_VN: Record<string, string> = {
  published: 'Đã xuất bản',
  draft: 'Bản nháp',
  hidden: 'Tạm ẩn',
  expired: 'Hết hạn',
  pending: 'Chờ duyệt',
  active: 'Đang chạy',
};

const dateToVn = (raw: unknown): string => {
  if (!raw) return '';
  const d = new Date(String(raw));
  if (Number.isNaN(d.getTime())) return String(raw);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const vnDateToIso = (raw: unknown): string | null => {
  const s = String(raw ?? '').trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s;
  return null;
};

const PAGE_MODULES = ['home', 'about', 'contact', 'policy', 'terms', 'faq'];

/** Chuyển một hàng DB (snake_case, status tiếng Anh) sang admin row (camelCase, status tiếng Việt) */
function cmsDbToAdminRow(moduleSlug: string, row: Record<string, unknown>): AdminRow {
  if (moduleSlug === 'blog') {
    return {
      id: String(row.id ?? ''),
      title: String(row.title ?? ''),
      slug: String(row.slug ?? ''),
      category: String(row.category ?? ''),
      excerpt: String(row.excerpt ?? ''),
      content: String(row.content ?? ''),
      cover: String(row.cover ?? ''),
      tags: Array.isArray(row.tags) ? (row.tags as string[]).join(', ') : String(row.tags ?? ''),
      status: STATUS_EN_TO_VN[String(row.status ?? 'draft')] ?? 'Bản nháp',
      views: Number(row.views ?? 0),
      updated: dateToVn(row.published_at),
      author: String(row.author ?? ''),
      metaTitle: String(row.meta_title ?? ''),
      metaDescription: String(row.meta_description ?? ''),
      ogImage: String(row.og_image ?? ''),
      indexable: row.indexable === false ? 'Không' : 'Có',
    };
  }
  if (PAGE_MODULES.includes(moduleSlug)) {
    return {
      id: String(row.id ?? ''),
      block: String(row.block ?? ''),
      type: String(row.type ?? 'Rich text'),
      heading: String(row.heading ?? ''),
      content: String(row.content ?? ''),
      image: String(row.image ?? ''),
      ctaLabel: String(row.cta_label ?? ''),
      ctaLink: String(row.cta_link ?? ''),
      status: STATUS_EN_TO_VN[String(row.status ?? 'draft')] ?? 'Bản nháp',
      order: Number(row.sort_order ?? 0),
      updated: dateToVn(row.updated_at ?? row.created_at),
      author: String(row.author ?? ''),
      metaTitle: String(row.meta_title ?? ''),
      metaDescription: String(row.meta_description ?? ''),
      ogImage: String(row.og_image ?? ''),
      indexable: row.indexable === false ? 'Không' : 'Có',
    };
  }
  if (moduleSlug === 'menu') {
    return {
      id: String(row.id ?? ''),
      menu: String(row.menu ?? row.name ?? ''),
      position: String(row.position ?? ''),
      items: Number(row.items ?? 0),
      structure: String(row.structure ?? ''),
      depth: Number(row.depth ?? 3),
      status: STATUS_EN_TO_VN[String(row.status ?? 'draft')] ?? 'Bản nháp',
      order: Number(row.sort_order ?? 0),
      updated: dateToVn(row.updated_at ?? row.created_at),
      author: String(row.author ?? ''),
    };
  }
  if (moduleSlug === 'banner') {
    return {
      id: String(row.id ?? ''),
      name: String(row.name ?? ''),
      position: String(row.position ?? ''),
      image: String(row.image_desktop ?? ''),
      imageMobile: String(row.image_mobile ?? ''),
      headline: String(row.headline ?? ''),
      ctaLink: String(row.cta_link ?? ''),
      schedule: String(row.schedule ?? ''),
      status: STATUS_EN_TO_VN[String(row.status ?? 'draft')] ?? 'Bản nháp',
      order: Number(row.sort_order ?? 0),
      updated: dateToVn(row.updated_at ?? row.created_at),
    };
  }
  if (moduleSlug === 'slider') {
    return {
      id: String(row.id ?? ''),
      name: String(row.name ?? ''),
      page: String(row.page ?? 'Trang chủ'),
      slides: Number(row.slides ?? 0),
      slidesData: String(row.slides_data ?? ''),
      interval: Number(row.interval ?? 5),
      autoplay: row.autoplay === false ? 'Không' : 'Có',
      status: STATUS_EN_TO_VN[String(row.status ?? 'draft')] ?? 'Bản nháp',
      order: Number(row.sort_order ?? 0),
      updated: dateToVn(row.updated_at ?? row.created_at),
      author: String(row.author ?? ''),
    };
  }
  if (moduleSlug === 'seo') {
    const title = String(row.meta_title ?? '');
    return {
      id: String(row.id ?? ''),
      page: String(row.page_path ?? ''),
      title,
      description: String(row.meta_description ?? ''),
      keywords: String(row.keywords ?? ''),
      canonical: String(row.canonical ?? ''),
      ogImage: String(row.og_image ?? ''),
      length: title.length,
      status: title ? 'Tốt' : 'Thiếu meta',
      indexable: row.indexable === false ? 'Không' : 'Có',
    };
  }
  // static-pages
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    slug: String(row.slug ?? ''),
    template: String(row.template ?? 'Một cột'),
    content: String(row.content ?? ''),
    cover: String(row.cover ?? ''),
    status: STATUS_EN_TO_VN[String(row.status ?? 'draft')] ?? 'Bản nháp',
    order: Number(row.sort_order ?? 0),
    updated: dateToVn(row.updated_at ?? row.created_at),
    author: String(row.author ?? ''),
    metaTitle: String(row.meta_title ?? ''),
    metaDescription: String(row.meta_description ?? ''),
    ogImage: String(row.og_image ?? ''),
    indexable: row.indexable === false ? 'Không' : 'Có',
  };
}

/** Chuyển một admin row sang payload DB (snake_case, status tiếng Anh) */
function cmsAdminToDbRow(moduleSlug: string, row: AdminRow): Record<string, unknown> {
  const statusEn = STATUS_VN_TO_EN[String(row.status ?? '')] ?? 'draft';
  const order = Number(row.order ?? 0);
  const updated = vnDateToIso(row.updated) ?? new Date().toISOString().slice(0, 10);
  const indexable = row.indexable !== 'Không';

  if (moduleSlug === 'blog') {
    return {
      title: String(row.title ?? ''),
      slug: String(row.slug ?? sofa2Slugify(String(row.title ?? ''))),
      category: String(row.category ?? ''),
      excerpt: String(row.excerpt ?? ''),
      content: String(row.content ?? ''),
      cover: String(row.cover ?? ''),
      tags: String(row.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
      status: statusEn,
      views: Number(row.views ?? 0),
      author: String(row.author ?? ''),
      published_at: statusEn === 'published' ? updated : null,
      meta_title: String(row.metaTitle ?? ''),
      meta_description: String(row.metaDescription ?? ''),
      og_image: String(row.ogImage ?? ''),
      indexable,
    };
  }
  if (PAGE_MODULES.includes(moduleSlug)) {
    return {
      slug: moduleSlug,
      block: String(row.block ?? ''),
      type: String(row.type ?? 'Rich text'),
      heading: String(row.heading ?? ''),
      content: String(row.content ?? ''),
      image: String(row.image ?? ''),
      cta_label: String(row.ctaLabel ?? ''),
      cta_link: String(row.ctaLink ?? ''),
      status: statusEn,
      sort_order: order,
      author: String(row.author ?? ''),
      meta_title: String(row.metaTitle ?? ''),
      meta_description: String(row.metaDescription ?? ''),
      og_image: String(row.ogImage ?? ''),
      indexable,
    };
  }
  if (moduleSlug === 'menu') {
    return {
      menu: String(row.menu ?? ''),
      position: String(row.position ?? 'Header'),
      items: Number(row.items ?? 0),
      structure: String(row.structure ?? ''),
      depth: Number(row.depth ?? 3),
      status: statusEn,
      sort_order: order,
      author: String(row.author ?? ''),
    };
  }
  if (moduleSlug === 'banner') {
    return {
      name: String(row.name ?? ''),
      position: String(row.position ?? ''),
      image_desktop: String(row.image ?? ''),
      image_mobile: String(row.imageMobile ?? ''),
      headline: String(row.headline ?? ''),
      cta_link: String(row.ctaLink ?? ''),
      schedule: String(row.schedule ?? ''),
      status: statusEn,
      sort_order: order,
    };
  }
  if (moduleSlug === 'slider') {
    return {
      name: String(row.name ?? ''),
      page: String(row.page ?? 'Trang chủ'),
      slides: Number(row.slides ?? 0),
      slides_data: String(row.slidesData ?? ''),
      interval: Number(row.interval ?? 5),
      autoplay: row.autoplay !== 'Không',
      status: statusEn,
      sort_order: order,
      author: String(row.author ?? ''),
    };
  }
  if (moduleSlug === 'seo') {
    const title = String(row.title ?? '');
    return {
      page_path: String(row.page ?? ''),
      meta_title: title,
      meta_description: String(row.description ?? ''),
      keywords: String(row.keywords ?? ''),
      canonical: String(row.canonical ?? ''),
      og_image: String(row.ogImage ?? ''),
      indexable,
    };
  }
  // static-pages
  return {
    title: String(row.title ?? ''),
    slug: String(row.slug ?? sofa2Slugify(String(row.title ?? ''))),
    template: String(row.template ?? 'Một cột'),
    content: String(row.content ?? ''),
    cover: String(row.cover ?? ''),
    status: statusEn,
    sort_order: order,
    author: String(row.author ?? ''),
    meta_title: String(row.metaTitle ?? ''),
    meta_description: String(row.metaDescription ?? ''),
    og_image: String(row.ogImage ?? ''),
    indexable,
  };
}

const cmsWriteQueues = new Map<string, Promise<AdminRow[]>>();
const cmsWriteRevisions = new Map<string, number>();
const savedCmsRows = new Map<string, AdminRow[]>();

export async function loadSofa2CmsRows(moduleSlug: string, defaults: AdminRow[]): Promise<AdminRow[]> {
  const k = key('cms', moduleSlug);
  const rows = (store[k] ?? defaults).map((row) => ({ ...row }));
  store[k] = rows;
  emit();
  return rows;
}

export async function syncSofa2CmsRow(
  moduleSlug: string,
  _mode: 'create' | 'update' | 'delete',
  _row: AdminRow,
  _index: number
): Promise<AdminRow[]> {
  const k = key('cms', moduleSlug);
  return (store[k] ?? []).map((item) => ({ ...item }));
}

const DEALER_MIGRATION_KEY = 'sofa2-dealer-row-migration-v2';
let dealerRowsMigrated = false;

function migrateSofa2DealerRows() {
  if (dealerRowsMigrated || typeof window === 'undefined') return;
  dealerRowsMigrated = true;
  try {
    if (window.localStorage.getItem(DEALER_MIGRATION_KEY)) return;
  } catch {
    // Continue with the in-memory demo snapshot if localStorage is unavailable.
  }

  const dealerGroup = SOFA2_ADMIN_GROUPS.find((group) => group.slug === 'dealer');
  if (!dealerGroup) return;
  const defaultsByModule = new Map(dealerGroup.modules.map((module) => [module.slug, module.rows]));
  const identityKeys: Record<string, string> = {
    dashboard: 'dealer',
    'price-policy': 'name',
    quotes: 'code',
    'dealer-orders': 'code',
    debts: 'dealer',
    'sales-docs': 'title',
  };
  const migrated: Record<string, AdminRow[]> = {};

  dealerGroup.modules.forEach((module) => {
    const moduleKey = key('dealer', module.slug);
    const currentRows = store[moduleKey] ?? module.rows;
    const defaultRows = defaultsByModule.get(module.slug) ?? [];
    const identityKey = identityKeys[module.slug];
    migrated[module.slug] = currentRows.map((row) => {
      const identity = String(row[identityKey] ?? '').trim().toLowerCase();
      const seed = defaultRows.find((item) =>
        String(item[identityKey] ?? '').trim().toLowerCase() === identity
      );
      const result: AdminRow = { ...(seed ?? {}), ...row };
      if (seed) {
        Object.entries(seed).forEach(([field, value]) => {
          if (result[field] === undefined || result[field] === null) result[field] = value;
        });
      }
      return result;
    });
  });

  const dealerProfiles = migrated.dashboard ?? [];
  const profileByName = new Map(dealerProfiles.map((row) => [
    String(row.dealer ?? '').trim().toLowerCase(), row,
  ]));
  Object.entries(migrated).forEach(([moduleSlug, rows]) => {
    if (moduleSlug === 'dashboard' || moduleSlug === 'price-policy' || moduleSlug === 'sales-docs') return;
    migrated[moduleSlug] = rows.map((row) => {
      const profile = profileByName.get(String(row.dealer ?? '').trim().toLowerCase());
      const next = { ...row };
      if (profile && !String(next.dealerId ?? '').trim()) next.dealerId = String(profile.dealerId ?? '');
      if (moduleSlug === 'quotes' && profile && !String(next.dealerEmail ?? '').trim()) {
        next.dealerEmail = String(profile.email ?? '');
      }
      return next;
    });
  });

  const dashboard = migrated.dashboard ?? [];
  const oldDefaultAccount = dashboard.find((row) =>
    String(row.dealer ?? '') === 'Nội thất Việt' && !String(row.email ?? '').trim()
  );
  if (oldDefaultAccount) {
    const seed = (defaultsByModule.get('dashboard') ?? []).find((row) => String(row.dealerId) === 'DL-1001');
    if (seed) {
      oldDefaultAccount.email = seed.email;
      oldDefaultAccount.portalAccess = seed.portalAccess;
      oldDefaultAccount.dealerId = seed.dealerId;
    }
  }

  Object.entries(migrated).forEach(([moduleSlug, rows]) => {
    store[key('dealer', moduleSlug)] = rows;
  });
  try {
    window.localStorage.setItem(DEALER_MIGRATION_KEY, 'done');
  } catch {
    // The migration still applies in memory for this browser session.
  }
  emit();
}

export async function loadSofa2DealerRows(moduleSlug: string, defaults: AdminRow[]) {
  migrateSofa2DealerRows();
  if (moduleSlug !== 'dashboard') {
    const dashboard = SOFA2_ADMIN_GROUPS.find((group) => group.slug === 'dealer')
      ?.modules.find((module) => module.slug === 'dashboard');
    if (dashboard) await loadSofa2DealerRows('dashboard', dashboard.rows);
  }

  const k = key('dealer', moduleSlug);
  store[k] = (store[k] ?? defaults).map((row) => ({ ...row }));
  emit();
}

export async function syncSofa2DealerRows(moduleSlug: string, rows: AdminRow[]) {
  store[key('dealer', moduleSlug)] = rows.map((row) => ({ ...row }));
  emit();
}

export async function loadSofa2AccessRows(moduleSlug: string) {
  hydrateAccessSnapshot();
  const k = key('access', moduleSlug);
  const defaults =
    SOFA2_ADMIN_GROUPS.find((group) => group.slug === 'access')?.modules.find(
      (module) => module.slug === moduleSlug
    )?.rows ?? [];
  store[k] = (store[k] ?? defaults).map((row) => ({ ...row }));
  emit();
}

export async function syncSofa2AccessRows(moduleSlug: string, rows: AdminRow[]) {
  hydrateAccessSnapshot();
  store[key('access', moduleSlug)] = rows.map((row) => ({ ...row }));
  persistAccessSnapshot();
  emit();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function useSofa2AdminRows(
  groupSlug: string,
  moduleSlug: string,
  options: { load?: boolean } = {}
) {
  const k = key(groupSlug, moduleSlug);
  const isSeoModule = groupSlug === 'seo';
  const isCmsModule = groupSlug === 'cms';
  const isAccessModule = groupSlug === 'access';
  const isDealerModule = groupSlug === 'dealer';
  const shouldLoad = (isSeoModule || isCmsModule || isAccessModule || isDealerModule) && options.load !== false;
  const [loading, setLoading] = useState(shouldLoad);
  const [error, setError] = useState('');
  const [pendingWrites, setPendingWrites] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);

  const rows = useSyncExternalStore(
    subscribe,
    () => store[k] ?? EMPTY,
    () => store[k] ?? EMPTY
  );

  useEffect(() => {
    if (!shouldLoad) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError('');

    const dealerDefaults = SOFA2_ADMIN_GROUPS.find((group) => group.slug === 'dealer')
      ?.modules.find((module) => module.slug === moduleSlug)?.rows ?? [];
    const loader = isCmsModule
      ? loadSofa2CmsRows(moduleSlug, store[k] ?? [])
      : isAccessModule
        ? loadSofa2AccessRows(moduleSlug)
        : isDealerModule
          ? loadSofa2DealerRows(moduleSlug, dealerDefaults)
          : loadSofa2SeoRows(moduleSlug, store[k] ?? []);

    loader
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : isCmsModule
                ? 'Không tải được dữ liệu CMS.'
                : isAccessModule
                  ? 'Không tải được dữ liệu phân quyền.'
                  : isDealerModule
                    ? 'Không tải được dữ liệu đại lý.'
                    : 'Không tải được dữ liệu SEO.'
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [shouldLoad, isCmsModule, isAccessModule, isDealerModule, k, moduleSlug, reloadToken]);

  const persistCmsRow = useCallback(
    (mode: 'create' | 'update' | 'delete', row: AdminRow, index: number, previousRows: AdminRow[]) => {
      if (!isCmsModule) return;
      const revision = (cmsWriteRevisions.get(k) ?? 0) + 1;
      cmsWriteRevisions.set(k, revision);
      setPendingWrites((count) => count + 1);
      setError('');

      syncSofa2CmsRow(moduleSlug, mode, row, index)
        .then((savedRows) => {
          if (cmsWriteRevisions.get(k) === revision) {
            store[k] = savedRows;
            emit();
          }
        })
        .catch((saveError: unknown) => {
          if (cmsWriteRevisions.get(k) === revision) {
            store[k] = (savedCmsRows.get(k) ?? previousRows).map((r) => ({ ...r }));
            emit();
            setError(saveError instanceof Error ? saveError.message : 'Không lưu được dữ liệu CMS.');
          }
        })
        .finally(() => setPendingWrites((count) => Math.max(0, count - 1)));
    },
    [isCmsModule, k, moduleSlug]
  );

  const persistSeoRows = useCallback(
    (nextRows: AdminRow[], previousRows: AdminRow[]) => {
      if (!isSeoModule) return;
      const revision = (seoWriteRevisions.get(k) ?? 0) + 1;
      seoWriteRevisions.set(k, revision);
      setPendingWrites((count) => count + 1);
      setError('');

      syncSofa2SeoRows(moduleSlug, nextRows)
        .then((savedRows) => {
          savedSeoRows.set(k, savedRows.map((row) => ({ ...row })));
          if (seoWriteRevisions.get(k) === revision) {
            store[k] = savedRows;
            emit();
          }
        })
        .catch((saveError: unknown) => {
          if (seoWriteRevisions.get(k) === revision) {
            store[k] = (savedSeoRows.get(k) ?? previousRows).map((row) => ({ ...row }));
            emit();
            setError(saveError instanceof Error ? saveError.message : 'Không lưu được dữ liệu SEO.');
          }
        })
        .finally(() => setPendingWrites((count) => Math.max(0, count - 1)));
    },
    [isSeoModule, k, moduleSlug]
  );

  const persistAccessRows = useCallback(
    (nextRows: AdminRow[], previousRows: AdminRow[]) => {
      if (!isAccessModule) return;
      setPendingWrites((count) => count + 1);
      setError('');

      syncSofa2AccessRows(moduleSlug, nextRows)
        .catch((saveError: unknown) => {
          store[k] = previousRows;
          emit();
          setError(saveError instanceof Error ? saveError.message : 'Không lưu được dữ liệu phân quyền.');
        })
        .finally(() => setPendingWrites((count) => Math.max(0, count - 1)));
    },
    [isAccessModule, k, moduleSlug]
  );

  const createRow = useCallback(
    (row: AdminRow) => {
      const nextRow = { ...row };
      if (isCmsModule && !nextRow.id) {
        const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
        nextRow.id = `cms-${moduleSlug}-${id}`;
      }
      if (k === key('hr', 'recruitment') && !nextRow.jobId) {
        nextRow.jobId = `JOB-${Date.now().toString(36).toUpperCase()}`;
      }
      if ((k === key('hr', 'submit-cv') || k === key('hr', 'applicant-profile')) && !nextRow.applicationId) {
        nextRow.applicationId = `APP-${Date.now().toString(36).toUpperCase()}`;
      }
      const previousRows = store[k] ?? [];
      if (k === key('shop', 'tracking') && String(nextRow.code ?? '')) {
        const trackingIndex = previousRows.findIndex(
          (tracking) => String(tracking.code ?? '') === String(nextRow.code)
        );
        store[k] = trackingIndex >= 0
          ? previousRows.map((tracking, index) => index === trackingIndex ? { ...tracking, ...nextRow } : tracking)
          : [nextRow, ...previousRows];
      } else {
        store[k] = [nextRow, ...previousRows];
      }
      if (k === key('customer', 'customer-orders')) {
        const orderTrackingKey = key('shop', 'tracking');
        const code = String(nextRow.code ?? '');
        const trackingRows = store[orderTrackingKey] ?? [];
        if (code && !trackingRows.some((tracking) => String(tracking.code ?? '') === code)) {
          store[orderTrackingKey] = [{
            code,
            customer: String(nextRow.customer ?? ''),
            phone: String(nextRow.phone ?? ''),
            address: String(nextRow.address ?? ''),
            items: String(nextRow.product ?? ''),
            total: Number(nextRow.total ?? 0),
            step: 'Đặt hàng',
            carrier: 'Chưa phân công',
            trackingNo: '',
            eta: '',
            status: ['Hoàn thành'].includes(String(nextRow.status)) ? 'Đã giao'
              : ['Yêu cầu huỷ', 'Đổi trả'].includes(String(nextRow.status)) ? 'Đang xử lý'
                : String(nextRow.status ?? 'Chờ xác nhận'),
            updated: String(nextRow.orderDate ?? ''),
          }, ...trackingRows];
        }
      }
      if (k === key('hr', 'submit-cv')) {
        const jobId = String(nextRow.jobId ?? '');
        const jobTitle = String(nextRow.job ?? '');
        adjustRecruitmentApplicants(nextRow, 1);
        const profilesKey = key('hr', 'applicant-profile');
        const applicationId = String(nextRow.applicationId ?? '');
        const profiles = store[profilesKey] ?? [];
        const profileIndex = profiles.findIndex((candidate) => String(candidate.applicationId ?? '') === applicationId);
        const profile: AdminRow = {
          ...(profileIndex >= 0 ? profiles[profileIndex] : {}),
          applicationId,
          jobId,
          name: String(nextRow.applicant ?? ''),
          email: String(nextRow.email ?? ''),
          phone: String(nextRow.phone ?? ''),
          appliedJob: jobTitle,
          appliedDate: String(nextRow.submittedDate ?? ''),
          source: String(nextRow.source ?? 'Website'),
          expectedSalary: Number(nextRow.expectedSalary ?? 0),
          availableDate: String(nextRow.availableDate ?? ''),
          coverLetter: String(nextRow.coverLetter ?? ''),
          cvUrl: String(nextRow.cvUrl ?? ''),
          cvFileName: String(nextRow.cvFileName ?? ''),
          interviewRound: String(profiles[profileIndex]?.interviewRound ?? 'Sàng lọc CV'),
          status: String(nextRow.status ?? 'Mới'),
          note: String(profiles[profileIndex]?.note ?? ''),
        };
        store[profilesKey] = profileIndex >= 0
          ? profiles.map((candidate, index) => index === profileIndex ? profile : candidate)
          : [profile, ...profiles];
      }
      if (k === key('hr', 'applicant-profile')) {
        const applicationsKey = key('hr', 'submit-cv');
        const applicationId = String(nextRow.applicationId ?? '');
        const applications = store[applicationsKey] ?? [];
        const existingIndex = applications.findIndex((application) => String(application.applicationId ?? '') === applicationId);
        const existing = existingIndex >= 0 ? applications[existingIndex] : undefined;
        const profileRow: AdminRow = existing ? {
          ...nextRow,
          jobId: String(existing.jobId ?? nextRow.jobId ?? ''),
          appliedJob: String(existing.job ?? nextRow.appliedJob ?? ''),
          appliedDate: String(existing.submittedDate ?? nextRow.appliedDate ?? ''),
          source: String(existing.source ?? nextRow.source ?? 'Website'),
          status: String(existing.status ?? nextRow.status ?? 'Mới'),
          cvUrl: String(existing.cvUrl ?? nextRow.cvUrl ?? ''),
          cvFileName: String(existing.cvFileName ?? nextRow.cvFileName ?? ''),
          expectedSalary: Number(existing.expectedSalary ?? nextRow.expectedSalary ?? 0),
          availableDate: String(existing.availableDate ?? nextRow.availableDate ?? ''),
          coverLetter: String(existing.coverLetter ?? nextRow.coverLetter ?? ''),
        } : nextRow;
        store[k] = [profileRow, ...previousRows];
        const jobId = String(profileRow.jobId ?? '');
        const job = (store[key('hr', 'recruitment')] ?? []).find((item) => String(item.jobId ?? '') === jobId);
        const appliedJob = String(profileRow.appliedJob ?? '');
        const jobTitle = String(job?.title ?? (appliedJob && appliedJob !== 'Ứng tuyển vị trí phù hợp' ? appliedJob : existing?.job ?? 'Ứng tuyển vị trí phù hợp'));
        const mirroredApplication: AdminRow = {
          ...(existing ?? {}),
          applicationId,
          jobId,
          applicant: String(profileRow.name ?? existing?.applicant ?? ''),
          email: String(profileRow.email ?? existing?.email ?? ''),
          phone: String(profileRow.phone ?? existing?.phone ?? ''),
          job: jobTitle,
          source: String(profileRow.source ?? existing?.source ?? 'Website'),
          submittedDate: String(profileRow.appliedDate ?? existing?.submittedDate ?? ''),
          cvUrl: String(profileRow.cvUrl ?? existing?.cvUrl ?? ''),
          cvFileName: String(profileRow.cvFileName ?? existing?.cvFileName ?? ''),
          expectedSalary: Number(profileRow.expectedSalary ?? existing?.expectedSalary ?? 0),
          availableDate: String(profileRow.availableDate ?? existing?.availableDate ?? ''),
          coverLetter: String(profileRow.coverLetter ?? existing?.coverLetter ?? ''),
          offerSent: String(profileRow.offerSent ?? existing?.offerSent ?? 'Không'),
          screeningResult: String(existing?.screeningResult ?? 'Chưa sàng lọc'),
          status: String(profileRow.status ?? existing?.status ?? 'Mới'),
        };
        if (existingIndex >= 0) {
          store[applicationsKey] = applications.map((application, index) => index === existingIndex ? mirroredApplication : application);
        } else {
          store[applicationsKey] = [mirroredApplication, ...applications];
          adjustRecruitmentApplicants(mirroredApplication, 1);
        }
      }
      emit();
      persistSeoRows(store[k], previousRows);
      persistAccessRows(store[k], previousRows);
      if (isAccessModule && moduleSlug !== 'audit-log') appendAccessAudit(moduleSlug, 'Tạo bản ghi', nextRow);
      if (isCmsModule) persistCmsRow('create', nextRow, 0, previousRows);
    },
    [k, persistSeoRows, persistAccessRows, isAccessModule, isCmsModule, moduleSlug, persistCmsRow]
  );

  const updateRow = useCallback(
    (index: number, row: AdminRow) => {
      const next = [...(store[k] ?? [])];
      const previousRows = next.map((item) => ({ ...item }));
      const previous = next[index];
      next[index] = { ...row };
      store[k] = next;
      if (k === key('shop', 'tracking') && previous) {
        const orderKey = key('customer', 'customer-orders');
        const code = String(row.code ?? '');
        const status = String(row.status ?? '');
        const step = String(row.step ?? '');
        const orderStatus = ['Đã giao', 'Hoàn tất'].includes(status) || step === 'Hoàn tất' ? 'Đã giao'
          : status === 'Đã huỷ' ? 'Đã huỷ'
            : status === 'Đang giao' || step === 'Giao hàng' ? 'Đang giao'
              : status === 'Đang sản xuất' || step === 'Sản xuất' ? 'Đang sản xuất'
                : status === 'Chờ xác nhận' || step === 'Đặt hàng' ? 'Chờ xác nhận' : 'Đang xử lý';
        store[orderKey] = (store[orderKey] ?? []).map((order) =>
          String(order.code ?? '') === code ? { ...order, status: orderStatus } : order
        );
      }
      if (k === key('customer', 'customer-orders') && previous) {
        const orderTrackingKey = key('shop', 'tracking');
        const code = String(row.code ?? '');
        const status = String(row.status ?? '');
        const step = status === 'Đang giao' ? 'Giao hàng'
          : ['Đã giao', 'Hoàn thành'].includes(status) ? 'Hoàn tất'
            : status === 'Đang sản xuất' ? 'Sản xuất'
              : status === 'Đang xử lý' ? 'Xác nhận' : 'Đặt hàng';
        const trackingRows = store[orderTrackingKey] ?? [];
        const hasTracking = trackingRows.some((tracking) => String(tracking.code ?? '') === code);
        store[orderTrackingKey] = hasTracking
          ? trackingRows.map((tracking) => String(tracking.code ?? '') === code
              ? { ...tracking, customer: row.customer, phone: row.phone, address: row.address, items: row.product, total: row.total, step, status: status === 'Hoàn thành' ? 'Đã giao'
                : ['Yêu cầu huỷ', 'Đổi trả'].includes(status) ? 'Đang xử lý' : status }
              : tracking)
          : [{ code, customer: row.customer, phone: row.phone, address: row.address, items: row.product, total: row.total, step, status: status === 'Hoàn thành' ? 'Đã giao' : ['Yêu cầu huỷ', 'Đổi trả'].includes(status) ? 'Đang xử lý' : status, carrier: 'Chưa phân công', trackingNo: '', eta: '' }, ...trackingRows];
      }
      if (k === key('hr', 'recruitment') && previous) {
        const jobId = String(row.jobId ?? '');
        const title = String(row.title ?? '');
        if (jobId && title !== String(previous.title ?? '')) {
          const applicationsKey = key('hr', 'submit-cv');
          const profilesKey = key('hr', 'applicant-profile');
          store[applicationsKey] = (store[applicationsKey] ?? []).map((application) =>
            String(application.jobId ?? '') === jobId ? { ...application, job: title } : application
          );
          store[profilesKey] = (store[profilesKey] ?? []).map((profile) =>
            String(profile.jobId ?? '') === jobId ? { ...profile, appliedJob: title } : profile
          );
        }
      }
      if (k === key('customer', 'profiles') && previous && String(previous.name) !== String(row.name)) {
        const customerId = String(row.customerId ?? '');
        ['dashboard', 'customer-orders', 'warranties', 'points', 'vouchers', 'complaints'].forEach((module) => {
          const childKey = key('customer', module);
          store[childKey] = (store[childKey] ?? []).map((child) =>
            String(child.customerId ?? '') === customerId ? { ...child, customer: String(row.name ?? '') } : child
          );
        });
      }
      if (
        k === key('hr', 'submit-cv') ||
        k === key('hr', 'applicant-profile')
      ) {
        const applicationId = String(row.applicationId ?? '');
        if (applicationId) {
          const sourceModule = k === key('hr', 'submit-cv') ? 'submit-cv' : 'applicant-profile';
          const targetModule = sourceModule === 'submit-cv' ? 'applicant-profile' : 'submit-cv';
          const targetKey = key('hr', targetModule);
          const targetRows = store[targetKey] ?? [];
          const hasTarget = targetRows.some((candidate) => String(candidate.applicationId ?? '') === applicationId);
          store[targetKey] = targetRows.map((candidate) => {
            if (String(candidate.applicationId ?? '') !== applicationId) return candidate;
            const shared = {
              email: row.email,
              phone: row.phone,
              status: row.status,
            };
            return sourceModule === 'submit-cv'
              ? { ...candidate, ...shared, name: row.applicant, appliedJob: row.job, appliedDate: row.submittedDate, jobId: row.jobId, source: row.source, expectedSalary: row.expectedSalary, availableDate: row.availableDate, coverLetter: row.coverLetter, offerSent: row.offerSent ?? candidate.offerSent, cvUrl: row.cvUrl, cvFileName: row.cvFileName }
              : { ...candidate, ...shared, applicant: row.name, job: row.appliedJob, submittedDate: row.appliedDate, jobId: row.jobId, source: row.source, expectedSalary: row.expectedSalary, availableDate: row.availableDate, coverLetter: row.coverLetter, offerSent: row.offerSent ?? candidate.offerSent, cvUrl: row.cvUrl, cvFileName: row.cvFileName };
          });
          if (!hasTarget && sourceModule === 'submit-cv') {
            store[targetKey] = [{
              applicationId,
              jobId: String(row.jobId ?? ''),
              name: String(row.applicant ?? ''),
              email: String(row.email ?? ''),
              phone: String(row.phone ?? ''),
              appliedJob: String(row.job ?? 'Ứng tuyển vị trí phù hợp'),
              appliedDate: String(row.submittedDate ?? ''),
              source: String(row.source ?? 'Website'),
              cvUrl: String(row.cvUrl ?? ''),
              cvFileName: String(row.cvFileName ?? ''),
              interviewRound: 'Sàng lọc CV',
              status: String(row.status ?? 'Mới'),
              note: '',
            }, ...targetRows];
          }
          if (hasTarget && sourceModule === 'applicant-profile' && previous
            && ['jobId', 'status', 'screeningResult', 'offerSent'].some((field) => String(previous[field] ?? '') !== String(row[field] ?? ''))) {
            adjustRecruitmentApplicants(previous, -1);
            adjustRecruitmentApplicants(row, 1);
          }
          if (!hasTarget && sourceModule === 'applicant-profile') {
            const mirroredApplication: AdminRow = {
              applicationId,
              jobId: String(row.jobId ?? ''),
              applicant: String(row.name ?? ''),
              email: String(row.email ?? ''),
              phone: String(row.phone ?? ''),
              job: String(row.appliedJob ?? 'Ứng tuyển vị trí phù hợp'),
              source: String(row.source ?? 'Website'),
              submittedDate: String(row.appliedDate ?? ''),
              cvUrl: String(row.cvUrl ?? ''),
              cvFileName: String(row.cvFileName ?? ''),
              screeningResult: 'Chưa sàng lọc',
              status: String(row.status ?? 'Mới'),
            };
            store[targetKey] = [mirroredApplication, ...targetRows];
            adjustRecruitmentApplicants(mirroredApplication, 1);
          }
        }
      }
      if (k === key('hr', 'submit-cv') && previous
        && ['jobId', 'status', 'screeningResult', 'offerSent'].some((field) => String(previous[field] ?? '') !== String(row[field] ?? ''))) {
        adjustRecruitmentApplicants(previous, -1);
        adjustRecruitmentApplicants(row, 1);
      }
      emit();
      persistSeoRows(next, previousRows);
      persistAccessRows(next, previousRows);
      if (isAccessModule && moduleSlug !== 'audit-log') appendAccessAudit(moduleSlug, 'Cập nhật bản ghi', row, previous);
      if (isCmsModule) persistCmsRow('update', row, index, previousRows);
    },
    [k, persistSeoRows, persistAccessRows, isAccessModule, isCmsModule, moduleSlug, persistCmsRow]
  );

  const deleteRow = useCallback(
    (index: number) => {
      const currentRows = store[k] ?? [];
      const previousRows = currentRows.map((item) => ({ ...item }));
      const removed = currentRows[index];
      store[k] = currentRows.filter((_, i) => i !== index);
      if (removed && (k === key('hr', 'submit-cv') || k === key('hr', 'applicant-profile'))) {
        removeLinkedApplications(k === key('hr', 'submit-cv') ? 'submit-cv' : 'applicant-profile', [removed]);
      }
      emit();
      persistSeoRows(store[k], previousRows);
      persistAccessRows(store[k], previousRows);
      if (isAccessModule && moduleSlug !== 'audit-log' && removed) appendAccessAudit(moduleSlug, 'Xoá bản ghi', removed);
      if (isCmsModule && removed) persistCmsRow('delete', removed, index, previousRows);
    },
    [k, persistSeoRows, persistAccessRows, isAccessModule, isCmsModule, moduleSlug, persistCmsRow]
  );

  const deleteRows = useCallback(
    (indexes: number[]) => {
      const set = new Set(indexes);
      const currentRows = store[k] ?? [];
      const previousRows = currentRows.map((item) => ({ ...item }));
      const removed = currentRows.filter((_, i) => set.has(i));
      store[k] = currentRows.filter((_, i) => !set.has(i));
      if (k === key('hr', 'submit-cv') || k === key('hr', 'applicant-profile')) {
        removeLinkedApplications(k === key('hr', 'submit-cv') ? 'submit-cv' : 'applicant-profile', removed);
      }
      emit();
      persistSeoRows(store[k], previousRows);
      persistAccessRows(store[k], previousRows);
      if (isAccessModule && moduleSlug !== 'audit-log') {
        removed.forEach((row) => appendAccessAudit(moduleSlug, 'Xoá bản ghi', row));
      }
      if (isCmsModule) {
        removed.forEach((r) => persistCmsRow('delete', r, -1, previousRows));
      }
    },
    [k, persistSeoRows, persistAccessRows, isAccessModule, isCmsModule, moduleSlug, persistCmsRow]
  );

  const resetRows = useCallback(
    (initial: AdminRow[]) => {
      const previousRows = (store[k] ?? []).map((row) => ({ ...row }));
      store[k] = initial.map((row) => ({ ...row }));
      emit();
      persistSeoRows(store[k], previousRows);
      persistAccessRows(store[k], previousRows);
    },
    [k, persistSeoRows, persistAccessRows]
  );

  return {
    rows,
    createRow,
    updateRow,
    deleteRow,
    deleteRows,
    resetRows,
    loading,
    saving: pendingWrites > 0,
    error,
    retry: () => setReloadToken((token) => token + 1),
  };
}

const EMPTY: AdminRow[] = [];
