import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';

import { RouterLink } from 'src/routes/components';

import { getSofa2DemoAdminSession } from 'src/_mock/_sofa2-demo';

import { Iconify } from 'src/components/iconify';

import { isSofa2JobOpen } from 'src/sections/sofa2/sofa2-recruitment';

import { Sofa2AdminLayout } from './sofa2-admin-layout';
import { Sofa2AdminSeoGenerator } from './sofa2-admin-seo-generator';
import { Sofa2AdminDealerInsights } from './sofa2-admin-dealer-insights';
import { sofa2Today, sofa2Slugify, type Sofa2CmsField, type Sofa2CmsSchema } from '../sofa2-cms';
import {
  hasSofa2AdminPermission,
  type Sofa2AdminAccessSession,
} from '../sofa2-access-control';
import {
  type AdminRow,
  getSofa2AdminRows,
  useSofa2AdminRows,
  loadSofa2DealerRows,
  syncSofa2DealerRows,
} from '../sofa2-admin-store';

import type { Sofa2AdminGroup, Sofa2AdminModule } from '../sofa2-admin-data';

// ----------------------------------------------------------------------

const SURFACE = '#2A2A2A';

const statusColor = (value: string) => {
  const v = String(value).toLowerCase();
  if (/(xuất bản|đang chạy|tốt)/.test(v)) return 'success';
  if (/(nháp|chờ|cần cải thiện)/.test(v)) return 'warning';
  if (/(ẩn|hết hạn|thiếu)/.test(v)) return 'error';
  return 'default';
};

const asNumber = (value: unknown) => Number(String(value ?? '').replace(/[^\d.-]/g, '')) || 0;

const compactMoney = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)} tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} tr`;
  return `${Math.round(value).toLocaleString('vi-VN')} ₫`;
};

const getDate = (value: unknown) => {
  const raw = String(value ?? '').trim();
  const localized = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (localized) return new Date(Number(localized[3]), Number(localized[2]) - 1, Number(localized[1]));
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isPortalEnabled = (value: unknown) =>
  value === true || ['có', 'yes', 'true', '1'].includes(String(value ?? '').trim().toLowerCase());

const canonicalCmsSlug = (moduleSlug: string, value: unknown, title: unknown) => {
  const input = String(value ?? '').trim();
  if (moduleSlug === 'blog') {
    const bare = input.replace(/^\/?sofa2\/blog\//i, '').replace(/^\/+|\/+$/g, '');
    return sofa2Slugify(bare || String(title ?? ''));
  }
  const bare = input
    .replace(/^\/?sofa2\/pages\//i, '')
    .replace(/^\/?sofa2\//i, '')
    .replace(/^\/+|\/+$/g, '');
  return `/sofa2/pages/${sofa2Slugify(bare || String(title ?? ''))}`;
};

const toDateInput = (value: unknown) => {
  const text = String(value ?? '').trim();
  const vi = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (vi) return `${vi[3]}-${vi[2].padStart(2, '0')}-${vi[1].padStart(2, '0')}`;
  return text.slice(0, 10);
};

const isSafeCmsUrl = (value: unknown, absoluteOnly = false) => {
  const text = String(value ?? '').trim();
  if (!text) return true;
  if (!absoluteOnly && text.startsWith('/') && !text.startsWith('//')) return true;
  try {
    return ['http:', 'https:'].includes(new URL(text).protocol);
  } catch {
    return false;
  }
};

const parseCmsMenuStructure = (value: unknown) =>
  String(value ?? '')
    .split(/\r?\n/)
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([title, path]) => !!title || !!path)
    .map(([title = '', path = '', parent = '']) => ({ title, path, parent }));

const GROUP_LABEL: Record<Sofa2CmsField['group'], string> = {
  content: 'Nội dung',
  display: 'Hiển thị & lịch',
  seo: 'SEO & chia sẻ',
};

type FormState = { open: boolean; mode: 'create' | 'edit'; index: number; values: AdminRow };

type Props = { group: Sofa2AdminGroup; module: Sofa2AdminModule; schema: Sofa2CmsSchema };

export function Sofa2AdminCmsView({ group, module, schema }: Props) {
  const isAppendOnly = module.slug === 'audit-log';
  const {
    rows,
    createRow,
    updateRow,
    deleteRow,
    deleteRows,
    resetRows,
    loading: rowsLoading,
    saving: rowsSaving,
    error: rowsError,
    retry: retryRows,
  } = useSofa2AdminRows(group.slug, module.slug);
  const { rows: accessUsers } = useSofa2AdminRows('access', 'users', {
    load: group.slug === 'access' && module.slug === 'roles',
  });
  const { rows: accessRoles } = useSofa2AdminRows('access', 'roles', {
    load: group.slug === 'access' && module.slug === 'users',
  });
  const { rows: catalogProducts } = useSofa2AdminRows('catalog', 'products', {
    load: group.slug === 'catalog' && module.slug === 'categories',
  });

  const [dealerLoading, setDealerLoading] = useState(group.slug === 'dealer');
  const [accessSaveStarted, setAccessSaveStarted] = useState(false);
  const [accessSession] = useState<Sofa2AdminAccessSession | null>(() =>
    getSofa2DemoAdminSession()
  );
  const isAdmin = accessSession?.role === 'admin';
  const canCreate = !isAppendOnly && hasSofa2AdminPermission(accessSession, group.slug, 'Tạo mới');
  const canEdit = !isAppendOnly && hasSofa2AdminPermission(accessSession, group.slug, 'Sửa');
  const canDelete = !isAppendOnly && hasSofa2AdminPermission(accessSession, group.slug, 'Xoá');
  const canPublish = !isAppendOnly && hasSofa2AdminPermission(accessSession, group.slug, 'Xuất bản');
  const canExport = hasSofa2AdminPermission(accessSession, group.slug, 'Xuất dữ liệu');

  useEffect(() => {
    if (group.slug !== 'access') return;
    if (rowsSaving) {
      setAccessSaveStarted(true);
    } else if (accessSaveStarted) {
      setToast(rowsError ? `Không lưu được: ${rowsError}` : 'Đã lưu thay đổi phân quyền trong trình duyệt.');
      setAccessSaveStarted(false);
    }
  }, [accessSaveStarted, group.slug, rowsError, rowsSaving]);

  useEffect(() => {
    if (group.slug !== 'dealer') return undefined;
    let active = true;
    setDealerLoading(true);
    loadSofa2DealerRows(module.slug, module.rows)
      .catch(() => {
        if (active) setToast('Không tải được dữ liệu đại lý demo.');
      })
      .finally(() => {
        if (active) setDealerLoading(false);
      });
    return () => {
      active = false;
    };
  }, [group.slug, module.slug, module.rows]);

  const syncDealerModule = async () => {
    if (group.slug !== 'dealer') return true;
    try {
      await syncSofa2DealerRows(module.slug, getSofa2AdminRows(group.slug, module.slug));
      return true;
    } catch {
      return false;
    }
  };

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [toast, setToast] = useState('');
  const [detail, setDetail] = useState<AdminRow | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<{ open: boolean; index: number | null }>({
    open: false,
    index: null,
  });
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [form, setForm] = useState<FormState>({
    open: false,
    mode: 'create',
    index: -1,
    values: {},
  });

  const { titleKey, statusKey, statusOptions, clientPath, entity } = schema;
  const fields =
    group.slug === 'access' && module.slug === 'users'
      ? schema.fields.map((field) =>
          field.key === 'role'
            ? {
                ...field,
                options: accessRoles
                  .filter((role) => role.status !== 'Ngưng dùng' && role.status !== 'Hệ thống')
                  .map((role) => String(role.role ?? '')),
              }
            : field
        )
      : schema.fields;

  const publishLabel = schema.publishLabel ?? 'Xuất bản';
  const defaultDraft = schema.defaultStatus ?? (statusOptions.includes('Bản nháp') ? 'Bản nháp' : statusOptions[1] ?? 'Bản nháp');
  const published = statusOptions[0];
  const hideClientLink = schema.hideClientLink ?? false;
  const showStatusToggle = schema.statusToggle !== false;
  const linkedRecruitmentDeleteNote =
    group.slug === 'hr' && ['submit-cv', 'applicant-profile'].includes(module.slug)
      ? ' Hồ sơ và đơn ứng tuyển có cùng mã sẽ bị xoá cùng nhau; bộ đếm hồ sơ của vị trí cũng được cập nhật.'
      : '';

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: rows.length };
    statusOptions.forEach((s) => {
      map[s] = rows.filter((r) => String(r[statusKey]) === s).length;
    });
    return map;
  }, [rows, statusKey, statusOptions]);

  const filtered = rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => (tab === 'all' ? true : String(row[statusKey]) === tab))
    .filter(({ row }) =>
      search
        ? Object.values(row).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
        : true
    );

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ----------------------------------------------------------------------

  const emptyValues = () => {
    const values: AdminRow = {};
    fields.forEach((field) => {
      if (field.type === 'number') values[field.key] = 0;
      else if (field.type === 'switch')
        values[field.key] = ['dealer', 'customer', 'hr'].includes(group.slug) ? 'Không' : 'Có';
      else if (field.key === statusKey) values[field.key] = defaultDraft;
      else if (field.type === 'date') values[field.key] = ['updated', 'submittedDate', 'appliedDate'].includes(field.key) ? sofa2Today() : '';
      else if (group.slug === 'hr' && ['job', 'appliedJob'].includes(field.key)) values[field.key] = 'Ứng tuyển vị trí phù hợp';
      else if (group.slug === 'hr' && field.key === 'source') values[field.key] = 'Website';
      else values[field.key] = '';
    });
    return values;
  };

  const openCreate = () => {
    if (!canCreate) return;
    setErrors({});
    setForm({ open: true, mode: 'create', index: -1, values: emptyValues() });
  };

  const openEdit = (index: number) => {
    if (!canEdit) return;
    setErrors({});
    const existing = rows[index];
    const categoryProductCount = module.slug === 'categories'
      ? catalogProducts.filter((product) => String(product.category ?? '').toLowerCase() === String(existing.name ?? '').toLowerCase()).length
      : undefined;
    setForm({
      open: true,
      mode: 'edit',
      index,
      values: { ...emptyValues(), ...existing, ...(categoryProductCount !== undefined ? { products: categoryProductCount } : {}) },
    });
  };

  const setValue = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, values: { ...prev.values, [key]: value } }));

  const validate = () => {
    const next: Record<string, string> = {};
    fields.forEach((field) => {
      const value = String(form.values[field.key] ?? '').trim();
      const willAutoSlug =
        group.slug === 'cms' &&
        field.key === 'slug' &&
        ['blog', 'static-pages'].includes(module.slug) &&
        !!String(form.values[titleKey] ?? '').trim();
      if (field.required && !value && !willAutoSlug) next[field.key] = 'Trường bắt buộc';
      else if (field.maxLength && value.length > field.maxLength)
        next[field.key] = `Tối đa ${field.maxLength} ký tự (hiện ${value.length})`;
    });
    if (group.slug === 'customer') {
      const uniqueValue = (key: string, message = 'Giá trị này đã tồn tại.') => {
        const candidate = String(form.values[key] ?? '').trim().toLowerCase();
        if (candidate && rows.some((row, index) =>
          !(form.mode === 'edit' && index === form.index) &&
          String(row[key] ?? '').trim().toLowerCase() === candidate
        )) next[key] = message;
      };
      if (['dashboard', 'profiles'].includes(module.slug)) uniqueValue('customerId', 'Mã khách hàng đã được sử dụng.');
      if (['customer-orders', 'warranties', 'complaints'].includes(module.slug)) uniqueValue('code', 'Mã này đã được sử dụng.');
      if (module.slug === 'warranties') uniqueValue('serial', 'Serial đã được đăng ký bảo hành.');

      const profiles = getSofa2AdminRows('customer', 'profiles');
      const customerId = String(form.values.customerId ?? '').trim();
      const profile = profiles.find((item) => String(item.customerId ?? '') === customerId);
      if (form.mode === 'edit' && ['customer-orders', 'warranties', 'points', 'complaints'].includes(module.slug)
        && customerId !== String(rows[form.index]?.customerId ?? '')) {
        next.customerId = 'Không thể chuyển giao dịch sang hồ sơ khách khác sau khi tạo.';
      }
      if (module.slug === 'customer-orders' && form.mode === 'edit'
        && String(form.values.code ?? '') !== String(rows[form.index]?.code ?? '')) {
        const oldCode = String(rows[form.index]?.code ?? '');
        const isLinked = getSofa2AdminRows('customer', 'warranties').some((item) => String(item.orderCode ?? '') === oldCode)
          || getSofa2AdminRows('customer', 'complaints').some((item) => String(item.orderCode ?? '') === oldCode)
          || getSofa2AdminRows('shopping', 'transactions').some((item) => String(item.order ?? '') === oldCode);
        if (isLinked) next.code = 'Không thể đổi mã đơn đã được liên kết với bảo hành, khiếu nại hoặc thanh toán.';
      }
      if (!['dashboard', 'profiles'].includes(module.slug) && module.slug !== 'vouchers' && customerId && !profile) {
        next.customerId = 'Mã khách hàng chưa có hồ sơ.';
      }
      if (module.slug === 'vouchers' && customerId && customerId !== 'Tất cả thành viên' && !profile) {
        next.customerId = 'Chỉ phát voucher cho khách hàng đã có hồ sơ hoặc chọn tất cả thành viên.';
      }
      if (profile && String(form.values.customer ?? '').trim() && String(form.values.customer).trim() !== String(profile.name ?? '').trim()) {
        next.customer = 'Tên khách hàng không khớp với mã hồ sơ đã chọn.';
      }
      if (module.slug === 'profiles') {
        const email = String(form.values.email ?? '').trim().toLowerCase();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Vui lòng nhập email hợp lệ.';
        if (email && rows.some((row, index) => !(form.mode === 'edit' && index === form.index)
          && String(row.email ?? '').trim().toLowerCase() === email)) next.email = 'Email này đã thuộc hồ sơ khách hàng khác.';
        const phone = String(form.values.phone ?? '').replace(/\D/g, '');
        if (phone && (phone.length < 9 || phone.length > 15)) next.phone = 'Số điện thoại cần có từ 9 đến 15 chữ số.';
        if (phone && rows.some((row, index) => !(form.mode === 'edit' && index === form.index)
          && String(row.phone ?? '').replace(/\D/g, '') === phone)) next.phone = 'Số điện thoại này đã thuộc hồ sơ khác.';
        const birthday = toDateInput(form.values.birthday);
        if (birthday && birthday > new Date().toISOString().slice(0, 10)) next.birthday = 'Ngày sinh không thể nằm trong tương lai.';
        if (form.mode === 'edit' && String(form.values.customerId) !== String(rows[form.index]?.customerId)) {
          next.customerId = 'Không thể đổi mã khách hàng sau khi tạo vì các giao dịch đang liên kết mã này.';
        }
      }
      if (module.slug === 'customer-orders') {
        if (Number(form.values.total) <= 0) next.total = 'Tổng tiền đơn hàng phải lớn hơn 0.';
        if (Number(form.values.points) < 0) next.points = 'Điểm thưởng không thể âm; dùng giao dịch điểm riêng để trừ điểm.';
        const date = toDateInput(form.values.orderDate);
        if (date && date > new Date().toISOString().slice(0, 10)) next.orderDate = 'Ngày đặt không thể nằm trong tương lai.';
      }
      if (module.slug === 'warranties') {
        const purchase = toDateInput(form.values.purchaseDate);
        const expiry = toDateInput(form.values.expiry);
        if (purchase && expiry && expiry < purchase) next.expiry = 'Ngày hết hạn phải sau ngày mua.';
      }
      if (module.slug === 'points') {
        const points = Number(form.values.points);
        if (!Number.isInteger(points) || points === 0) next.points = 'Điểm phải là số nguyên khác 0.';
        if (!String(form.values.reason ?? '').trim()) next.reason = 'Cần ghi rõ lý do cộng/trừ điểm.';
        if (points < 0 && String(form.values.status) === 'Đã ghi nhận') {
          const balance = rows.reduce((total, row, index) => {
            if (form.mode === 'edit' && index === form.index) return total;
            if (String(row.customerId ?? '') !== customerId || String(row.status) !== 'Đã ghi nhận') return total;
            const expiry = toDateInput(row.expiry);
            return expiry && expiry < new Date().toISOString().slice(0, 10) ? total : total + Number(row.points || 0);
          }, 0);
          if (Math.abs(points) > balance) next.points = `Số dư khả dụng chỉ còn ${balance.toLocaleString('vi-VN')} điểm.`;
        }
      }
      if (module.slug === 'vouchers') {
        const code = String(form.values.code ?? '').trim().toUpperCase();
        const recipient = String(form.values.customerId ?? '').trim().toLowerCase();
        if (code && !/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(code)) next.code = 'Mã chỉ gồm chữ in hoa, số và dấu gạch nối.';
        if (code && rows.some((row, index) => !(form.mode === 'edit' && index === form.index)
          && String(row.code ?? '').trim().toLowerCase() === code.toLowerCase()
          && String(row.customerId ?? '').trim().toLowerCase() === recipient)) next.code = 'Mã voucher đã tồn tại cho khách này.';
        const value = String(form.values.value ?? '').trim();
        const percentage = value.match(/^(\d+(?:[.,]\d+)?)\s*%$/);
        const amount = value.replace(/[^\d]/g, '');
        if (!percentage && !amount && !/miễn phí\s*(ship|vận chuyển)/i.test(value)) next.value = 'Nhập mức giảm như 10%, 500.000đ hoặc Miễn phí ship.';
        if (percentage && (Number(percentage[1].replace(',', '.')) <= 0 || Number(percentage[1].replace(',', '.')) > 100)) next.value = 'Phần trăm giảm phải lớn hơn 0 và không quá 100%.';
        if (Number(form.values.minOrder) < 0) next.minOrder = 'Đơn tối thiểu không thể âm.';
        if (Number(form.values.quantity) < 0) next.quantity = 'Số lượng không thể âm.';
        if (Number(form.values.pointsCost) < 0) next.pointsCost = 'Điểm đổi không thể âm.';
        const start = toDateInput(form.values.startDate);
        const end = toDateInput(form.values.endDate);
        if (start && end && end < start) next.endDate = 'Ngày hết hạn phải bằng hoặc sau ngày bắt đầu.';
      }
      if (module.slug === 'complaints') {
        const orderCode = String(form.values.orderCode ?? '').trim();
        if (orderCode) {
          const order = getSofa2AdminRows('customer', 'customer-orders').find((item) => String(item.code ?? '') === orderCode);
          if (!order || String(order.customerId ?? '') !== customerId) next.orderCode = 'Đơn liên quan không thuộc khách hàng đã chọn.';
        }
      }
    }
    if (group.slug === 'hr') {
      const uniqueKey =
        ['recruitment', 'job-detail', 'recruitment-tracking'].includes(module.slug)
          ? 'jobId'
          : ['submit-cv', 'applicant-profile'].includes(module.slug)
            ? 'applicationId'
            : undefined;
      if (uniqueKey) {
        const candidate = String(form.values[uniqueKey] ?? '').trim().toLowerCase();
        const duplicate = candidate && rows.some((row, index) =>
          !(form.mode === 'edit' && index === form.index) &&
          String(row[uniqueKey] ?? '').trim().toLowerCase() === candidate
        );
        if (duplicate) next[uniqueKey] = 'Mã này đã được sử dụng.';
        if (
          form.mode === 'edit' &&
          String(form.values[uniqueKey] ?? '') !== String(rows[form.index]?.[uniqueKey] ?? '')
        ) {
          next[uniqueKey] = 'Không thể đổi mã sau khi tạo vì mã này liên kết với hồ sơ tuyển dụng.';
        }
      }

      if (['submit-cv', 'applicant-profile'].includes(module.slug)) {
        const email = String(form.values.email ?? '').trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          next.email = 'Vui lòng nhập email hợp lệ.';
        }
        const phone = String(form.values.phone ?? '').replace(/\D/g, '');
        if (phone && (phone.length < 9 || phone.length > 15)) {
          next.phone = 'Số điện thoại cần có từ 9 đến 15 chữ số.';
        }
        const urlFields = module.slug === 'applicant-profile' ? ['cvUrl', 'portfolioUrl'] : ['cvUrl'];
        urlFields.forEach((key) => {
          const url = String(form.values[key] ?? '').trim();
          if (!url) return;
          try {
            const parsed = new URL(url);
            if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('invalid protocol');
          } catch {
            next[key] = 'Vui lòng nhập đường dẫn bắt đầu bằng http:// hoặc https://.';
          }
        });
        const emailKey = email.trim().toLowerCase();
        const jobId = String(form.values.jobId ?? '').trim();
        const duplicateApplication = emailKey && rows.some((row, index) =>
          !(form.mode === 'edit' && index === form.index)
          && String(row.email ?? '').trim().toLowerCase() === emailKey
          && String(row.jobId ?? '') === jobId
        );
        if (duplicateApplication) next.email = 'Ứng viên này đã có hồ sơ cho vị trí đã chọn.';
        if (jobId && !getSofa2AdminRows('hr', 'recruitment').some((job) => String(job.jobId ?? '') === jobId)) {
          next.jobId = 'Mã vị trí không tồn tại trong danh sách tuyển dụng.';
        }
        if (form.mode === 'edit' && jobId !== String(rows[form.index]?.jobId ?? '')) {
          next.jobId = 'Không thể đổi vị trí sau khi nhận hồ sơ; hãy tạo đơn ứng tuyển mới để giữ đúng lịch sử.';
        }
        if (Number(form.values.expectedSalary) < 0) next.expectedSalary = 'Mức lương mong muốn không thể âm.';
      }

      if (['recruitment', 'job-detail', 'recruitment-tracking'].includes(module.slug)) {
        const salaryMin = Number(form.values.salaryMin) || 0;
        const salaryMax = Number(form.values.salaryMax) || 0;
        const quantity = Number(form.values.quantity);
        if (salaryMin < 0) next.salaryMin = 'Mức lương không thể âm.';
        if (salaryMax < 0) next.salaryMax = 'Mức lương không thể âm.';
        if (salaryMin && salaryMax && salaryMax < salaryMin) {
          next.salaryMax = 'Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu.';
        }
        if (!Number.isInteger(quantity) || quantity < 1) next.quantity = 'Số lượng cần tuyển phải là số nguyên lớn hơn 0.';
        ['applicants', 'hired', 'screeningPassed', 'interviewing', 'offered', 'rejected', 'views', 'daysOpen', 'cost'].forEach((key) => {
          const metric = Number(form.values[key] ?? 0);
          if (metric < 0) next[key] = 'Giá trị không thể âm.';
          if (key !== 'cost' && !Number.isInteger(metric)) next[key] = 'Giá trị cần là số nguyên.';
        });
        if (Number(form.values.hired) > quantity) next.hired = 'Số đã tuyển không thể vượt chỉ tiêu.';
        const contactEmail = String(form.values.contactEmail ?? '').trim();
        if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) next.contactEmail = 'Email liên hệ không hợp lệ.';
        const contactPhone = String(form.values.contactPhone ?? '').replace(/\D/g, '');
        if (contactPhone && (contactPhone.length < 9 || contactPhone.length > 15)) next.contactPhone = 'Số liên hệ cần có từ 9 đến 15 chữ số.';
        const deadline = toDateInput(form.values.deadline);
        const previous = form.mode === 'edit' ? rows[form.index] : undefined;
        const becomingOpen = String(form.values.status) === 'Đang tuyển'
          && (!previous || String(previous.status) !== 'Đang tuyển' || deadline !== toDateInput(previous.deadline));
        if (becomingOpen && !String(form.values.description ?? '').trim()) next.description = 'Cần có mô tả công việc trước khi đăng tuyển.';
        if (becomingOpen && !String(form.values.requirements ?? '').trim()) next.requirements = 'Cần nêu yêu cầu ứng tuyển trước khi đăng tuyển.';
        if (becomingOpen && !deadline) next.deadline = 'Cần chọn hạn nộp trước khi mở vị trí.';
        else if (becomingOpen && deadline < new Date().toISOString().slice(0, 10)) {
          next.deadline = 'Không thể mở vị trí có hạn nộp đã qua.';
        }
      }

      if (module.slug === 'applicant-profile') {
        ['experience', 'currentSalary', 'expectedSalary', 'interviewScore'].forEach((key) => {
          const value = String(form.values[key] ?? '').trim();
          if (value && Number(value) < 0) next[key] = 'Giá trị không thể âm.';
        });
        const birthday = toDateInput(form.values.birthday);
        if (birthday && birthday > new Date().toISOString().slice(0, 10)) next.birthday = 'Ngày sinh không thể nằm trong tương lai.';
        const score = Number(form.values.interviewScore);
        if (Number.isFinite(score) && (score < 0 || score > 10)) {
          next.interviewScore = 'Điểm phỏng vấn phải nằm trong khoảng 0–10.';
        }
      }
    }
    if (group.slug === 'dealer') {
      const uniqueKeyByModule: Record<string, string> = {
        dashboard: 'dealer',
        'price-policy': 'name',
        quotes: 'code',
        'dealer-orders': 'code',
        'sales-docs': 'title',
      };
      const uniqueKey = uniqueKeyByModule[module.slug];
      if (uniqueKey) {
        const candidate = String(form.values[uniqueKey] ?? '').trim().toLowerCase();
        const duplicate = candidate && rows.some(
          (row, index) =>
            !(form.mode === 'edit' && index === form.index) &&
            String(row[uniqueKey] ?? '').trim().toLowerCase() === candidate
        );
        if (duplicate) next[uniqueKey] = 'Giá trị này đã tồn tại.';
      }

      if (module.slug === 'dashboard') {
        const email = String(form.values.email ?? '').trim().toLowerCase();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          next.email = 'Vui lòng nhập email hợp lệ.';
        }
        const duplicateEmail =
          email &&
          rows.some(
            (row, index) =>
              !(form.mode === 'edit' && index === form.index) &&
              String(row.email ?? '').trim().toLowerCase() === email
          );
        if (duplicateEmail) next.email = 'Email này đã được gán cho đại lý khác.';
        if (String(form.values.portalAccess) === 'Có' && !email) {
          next.email = 'Cần email đăng nhập trước khi bật quyền cổng đại lý.';
        }
      }
    }
    if (group.slug === 'access') {
      if (module.slug === 'users') {
        const email = String(form.values.email ?? '').trim().toLowerCase();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          next.email = 'Vui lòng nhập email hợp lệ.';
        }
        if (
          email &&
          rows.some(
            (row, index) =>
              !(form.mode === 'edit' && index === form.index) &&
              String(row.email ?? '').trim().toLowerCase() === email
          )
        ) {
          next.email = 'Email này đã được thêm vào hệ thống.';
        }
        const phone = String(form.values.phone ?? '').replace(/\D/g, '');
        if (phone && (phone.length < 9 || phone.length > 15)) {
          next.phone = 'Số điện thoại cần có từ 9 đến 15 chữ số.';
        }
        const role = String(form.values.role ?? '').trim();
        const previousRole = form.mode === 'edit' ? String(rows[form.index]?.role ?? '') : '';
        if (
          role &&
          role.toLocaleLowerCase() !== previousRole.trim().toLocaleLowerCase() &&
          !accessRoles.some(
            (item) =>
              item.status !== 'Ngưng dùng' &&
              item.status !== 'Hệ thống' &&
              String(item.role ?? '').trim() === role
          )
        ) {
          next.role = 'Hãy chọn một vai trò đang hoạt động.';
        }
      }
      if (module.slug === 'roles') {
        const name = String(form.values.role ?? '').trim().toLowerCase();
        const code = String(form.values.code ?? '').trim().toLowerCase();
        if (
          name &&
          rows.some(
            (row, index) =>
              !(form.mode === 'edit' && index === form.index) &&
              String(row.role ?? '').trim().toLowerCase() === name
          )
        ) {
          next.role = 'Tên vai trò này đã tồn tại.';
        }
        if (code && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(code)) {
          next.code = 'Mã vai trò chỉ gồm chữ thường, số và dấu gạch nối.';
        }
        if (
          code &&
          rows.some(
            (row, index) =>
              !(form.mode === 'edit' && index === form.index) &&
              String(row.code ?? '').trim().toLowerCase() === code
          )
        ) {
          next.code = 'Mã vai trò này đã tồn tại.';
        }
        const editingRole = form.mode === 'edit' ? rows[form.index] : undefined;
        const oldRoleName = String(editingRole?.role ?? '').trim().toLocaleLowerCase();
        const isAssigned = accessUsers.some((user) =>
          [user.role, ...String(user.extraRoles ?? '').split(',')].some(
            (assignedRole) => String(assignedRole ?? '').trim().toLocaleLowerCase() === oldRoleName
          )
        );
        if (isAssigned && name !== oldRoleName) {
          next.role = 'Không thể đổi tên vai trò đang được gán cho người dùng.';
        }
      }
      if (module.slug === 'permissions') {
        const moduleName = String(form.values.module ?? '').trim().toLowerCase();
        const action = String(form.values.action ?? '').trim().toLowerCase();
        if (
          moduleName &&
          action &&
          rows.some(
            (row, index) =>
              !(form.mode === 'edit' && index === form.index) &&
              String(row.module ?? '').trim().toLowerCase() === moduleName &&
              String(row.action ?? '').trim().toLowerCase() === action
          )
        ) {
          next.action = 'Module và hành động này đã có trong ma trận.';
        }
      }
    }
    if (group.slug === 'catalog') {
      const unique = (key: string, message = 'Giá trị này đã tồn tại.') => {
        const candidate = String(form.values[key] ?? '').trim().toLowerCase();
        if (candidate && rows.some((row, index) =>
          !(form.mode === 'edit' && index === form.index) &&
          String(row[key] ?? '').trim().toLowerCase() === candidate
        )) next[key] = message;
      };
      const products = getSofa2AdminRows('catalog', 'products');
      const categories = getSofa2AdminRows('catalog', 'categories');
      const variants = getSofa2AdminRows('catalog', 'variants');
      const product = products.find((row) =>
        String(row.name ?? '').trim().toLowerCase() === String(form.values.product ?? '').trim().toLowerCase()
        || String(row.sku ?? '').trim().toLowerCase() === String(form.values.product ?? '').trim().toLowerCase()
      );

      if (module.slug === 'categories') {
        unique('name', 'Tên danh mục đã tồn tại.');
        const slug = sofa2Slugify(String(form.values.slug || form.values.name));
        if (categories.some((row, index) => !(form.mode === 'edit' && index === form.index)
          && sofa2Slugify(String(row.slug || row.name)) === slug)) next.slug = 'Slug danh mục đã được sử dụng.';
        const original = form.mode === 'edit' ? rows[form.index] : undefined;
        if (original && String(original.name ?? '') !== String(form.values.name ?? '')
          && products.some((row) => String(row.category ?? '').toLowerCase() === String(original.name ?? '').toLowerCase())) {
          next.name = 'Danh mục đang được sản phẩm sử dụng; hãy chuyển sản phẩm sang danh mục khác trước khi đổi tên.';
        }
        if (String(form.values.image ?? '').trim() && !isSafeCmsUrl(form.values.image)) next.image = 'Ảnh cần là URL http(s) hoặc đường dẫn nội bộ an toàn.';
      }
      if (module.slug === 'products') {
        unique('sku', 'Mã SKU đã được sử dụng.');
        unique('name', 'Tên sản phẩm đã tồn tại.');
        const previousSku = form.mode === 'edit' ? String(rows[form.index]?.sku ?? '') : '';
        const previousName = form.mode === 'edit' ? String(rows[form.index]?.name ?? '') : '';
        const nextSku = String(form.values.sku ?? '').trim();
        if (previousName && previousName !== String(form.values.name ?? '') && variants.some((variant) =>
          String(variant.product ?? '').trim().toLowerCase() === previousName.trim().toLowerCase()
        )) next.name = 'Không thể đổi tên sản phẩm khi biến thể đang tham chiếu sản phẩm này.';
        if (previousSku && previousSku !== nextSku) {
          const linked = [...variants, ...getSofa2AdminRows('catalog', 'inventory'), ...getSofa2AdminRows('catalog', 'pricing')]
            .some((row) => String(row.sku ?? '').toLowerCase() === previousSku.toLowerCase());
          if (linked) next.sku = 'Không thể đổi SKU khi đã có biến thể, tồn kho hoặc bảng giá liên kết.';
        }
        const sku = String(form.values.sku ?? '').trim();
        if (sku && !/^[A-Za-z0-9][A-Za-z0-9._-]{2,39}$/.test(sku)) next.sku = 'SKU cần dài 3–40 ký tự, chỉ gồm chữ, số, dấu chấm, gạch ngang hoặc gạch dưới.';
        if (Number(form.values.price) <= 0) next.price = 'Giá bán phải lớn hơn 0.';
        if (Number(form.values.compareAt) > 0 && Number(form.values.compareAt) < Number(form.values.price)) next.compareAt = 'Giá niêm yết phải bằng hoặc cao hơn giá bán.';
        if (String(form.values.image ?? '').trim() && !isSafeCmsUrl(form.values.image)) next.image = 'Ảnh cần là URL http(s) hoặc đường dẫn nội bộ an toàn.';
        const gallery = String(form.values.gallery ?? '').split(',').map((item) => item.trim()).filter(Boolean);
        if (gallery.some((image) => !isSafeCmsUrl(image))) next.gallery = 'Mọi ảnh trong thư viện phải là URL http(s) hoặc đường dẫn nội bộ an toàn.';
      }
      if (module.slug === 'attributes') {
        unique('name', 'Tên thuộc tính đã tồn tại.');
        const code = sofa2Slugify(String(form.values.code || form.values.name));
        if (rows.some((row, index) => !(form.mode === 'edit' && index === form.index)
          && sofa2Slugify(String(row.code || row.name)) === code)) next.code = 'Mã thuộc tính đã được sử dụng.';
        if (!String(form.values.valueList ?? '').split(',').map((item) => item.trim()).filter(Boolean).length) next.valueList = 'Hãy nhập ít nhất một giá trị thuộc tính.';
      }
      if (module.slug === 'variants') {
        unique('sku', 'SKU biến thể đã được sử dụng.');
        if (!product) next.product = 'Hãy chọn một sản phẩm đang tồn tại.';
        if (!String(form.values.option ?? '').trim()) next.option = 'Hãy mô tả tổ hợp thuộc tính của biến thể.';
        if (Number(form.values.stock) < 0) next.stock = 'Tồn kho không thể âm.';
        if (Number(form.values.price) <= 0) next.price = 'Giá biến thể phải lớn hơn 0.';
      }
      if (module.slug === 'inventory') {
        const sku = String(form.values.sku ?? '').trim().toLowerCase();
        const duplicate = rows.some((row, index) => !(form.mode === 'edit' && index === form.index)
          && String(row.sku ?? '').trim().toLowerCase() === sku
          && String(row.warehouse ?? '').trim().toLowerCase() === String(form.values.warehouse ?? '').trim().toLowerCase());
        if (duplicate) next.warehouse = 'SKU này đã có dòng tồn kho tại kho đã chọn.';
        if (Number(form.values.stock) < 0 || Number(form.values.reserved) < 0) next.stock = 'Tồn kho và số lượng giữ không thể âm.';
        if (Number(form.values.reserved) > Number(form.values.stock)) next.reserved = 'Số lượng đang giữ không thể lớn hơn tồn thực tế.';
        if (Number(form.values.minStock) < 0) next.minStock = 'Ngưỡng cảnh báo không thể âm.';
        const validSku = products.some((row) => String(row.sku ?? '').toLowerCase() === sku)
          || variants.some((row) => String(row.sku ?? '').toLowerCase() === sku);
        if (sku && !validSku) next.sku = 'SKU phải thuộc một sản phẩm hoặc biến thể đã tạo.';
      }
      if (module.slug === 'pricing') {
        const sku = String(form.values.sku ?? '').trim().toLowerCase();
        const priceList = String(form.values.priceList ?? '').trim().toLowerCase();
        if (rows.some((row, index) => !(form.mode === 'edit' && index === form.index)
          && String(row.sku ?? '').trim().toLowerCase() === sku
          && String(row.priceList ?? '').trim().toLowerCase() === priceList)) next.priceList = 'SKU này đã có bảng giá cùng loại.';
        if (Number(form.values.list) <= 0 || Number(form.values.sale) <= 0) next.sale = 'Giá niêm yết và giá bán phải lớn hơn 0.';
        if (Number(form.values.sale) > Number(form.values.list)) next.sale = 'Giá bán không thể cao hơn giá niêm yết.';
        const validSku = products.some((row) => String(row.sku ?? '').toLowerCase() === sku)
          || variants.some((row) => String(row.sku ?? '').toLowerCase() === sku);
        if (sku && !validSku) next.sku = 'SKU phải thuộc một sản phẩm hoặc biến thể đã tạo.';
        const start = toDateInput(form.values.startDate);
        const end = toDateInput(form.values.endDate);
        if (start && end && end < start) next.endDate = 'Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.';
      }
    }
    if (group.slug === 'cms') {
      const isBlog = module.slug === 'blog';
      const isStatic = module.slug === 'static-pages';
      const candidateSlug = isBlog || isStatic
        ? canonicalCmsSlug(module.slug, form.values.slug, form.values[titleKey])
        : '';
      if ((isBlog || isStatic) && candidateSlug) {
        const duplicate = rows.some((row, index) => {
          if (form.mode === 'edit' && index === form.index) return false;
          return canonicalCmsSlug(module.slug, row.slug, row[titleKey]) === candidateSlug;
        });
        if (duplicate) next.slug = 'Đường dẫn này đã tồn tại; hãy chọn slug khác.';
      }
      if (module.slug === 'seo') {
        const path = String(form.values.page ?? '').trim().replace(/\/+$/, '').toLowerCase() || '/';
        if (!path.startsWith('/sofa2')) next.page = 'Đường dẫn SEO phải thuộc website /sofa2.';
        if (rows.some((row, index) =>
          !(form.mode === 'edit' && index === form.index) &&
          String(row.page ?? '').trim().replace(/\/+$/, '').toLowerCase() === path
        )) next.page = 'Đường dẫn này đã có cấu hình SEO.';
        if (!isSafeCmsUrl(form.values.canonical, true)) {
          next.canonical = 'Canonical phải là URL tuyệt đối bắt đầu bằng http:// hoặc https://.';
        }
      }
      if (['menu', 'banner', 'slider'].includes(module.slug)) {
        const nameKey = module.slug === 'menu' ? 'menu' : 'name';
        const name = String(form.values[nameKey] ?? '').trim().toLocaleLowerCase();
        const position = String(form.values.position ?? '').trim().toLocaleLowerCase();
        if (name && rows.some((row, index) =>
          !(form.mode === 'edit' && index === form.index) &&
          String(row[nameKey] ?? '').trim().toLocaleLowerCase() === name &&
          (module.slug !== 'menu' && module.slug !== 'banner' || String(row.position ?? '').trim().toLocaleLowerCase() === position)
        )) next[nameKey] = 'Tên bản ghi đã được dùng trong vị trí này.';
      }
      if (module.slug === 'menu') {
        const menuItems = parseCmsMenuStructure(form.values.structure);
        const menuNames = new Set(menuItems.map((item) => item.title.toLocaleLowerCase()));
        if (menuItems.some((item) => !item.title || !item.path || !isSafeCmsUrl(item.path))) {
          next.structure = 'Mỗi dòng cần có tên mục và URL an toàn (đường dẫn / hoặc http/https).';
        }
        if (menuItems.some((item) => item.title && !item.path)) {
          next.structure = 'Mỗi mục menu cần có đường dẫn.';
        }
        if (menuItems.some((item) => item.parent && !menuNames.has(item.parent.toLocaleLowerCase()))) {
          next.structure = 'Mục cha phải trùng tên một mục khác trong cùng menu.';
        }
        const parentByName = new Map(menuItems.map((item) => [item.title.toLocaleLowerCase(), item.parent.toLocaleLowerCase()]));
        const hasCycle = menuItems.some((item) => {
          const visited = new Set([item.title.toLocaleLowerCase()]);
          let parent = item.parent.toLocaleLowerCase();
          while (parent && parentByName.has(parent)) {
            if (visited.has(parent)) return true;
            visited.add(parent);
            parent = parentByName.get(parent) ?? '';
          }
          return false;
        });
        if (hasCycle) next.structure = 'Cấu trúc mục cha không được tạo vòng lặp.';
        if (menuItems.length > 100) next.structure = 'Mỗi menu tối đa 100 liên kết.';
      }
      if (['home', 'about', 'contact', 'policy', 'terms', 'faq'].includes(module.slug)) {
        const blockName = String(form.values.block ?? '').trim().toLocaleLowerCase();
        if (blockName && rows.some((row, index) =>
          !(form.mode === 'edit' && index === form.index) &&
          String(row.block ?? '').trim().toLocaleLowerCase() === blockName
        )) next.block = 'Mã khối này đã tồn tại trên trang.';
      }
      ['image', 'imageMobile', 'cover', 'ogImage', 'ctaLink'].forEach((key) => {
        if (!isSafeCmsUrl(form.values[key])) next[key] = 'Chỉ hỗ trợ URL http(s) hoặc đường dẫn nội bộ bắt đầu bằng /.';
      });
      const startAt = toDateInput(form.values.startAt);
      const endAt = toDateInput(form.values.endAt);
      if (startAt && endAt && endAt < startAt) next.endAt = 'Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.';
      if (module.slug === 'slider' && Number(form.values.interval) < 1) {
        next.interval = 'Thời gian chuyển slide tối thiểu là 1 giây.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitForm = async () => {
    if (!(form.mode === 'create' ? canCreate : canEdit)) {
      setToast('Tài khoản chưa được cấp quyền thực hiện thao tác này.');
      return;
    }
    if (!validate()) return;

    const clean: AdminRow = { ...form.values };
    fields.forEach((field) => {
      if (field.type === 'number') clean[field.key] = Number(clean[field.key]) || 0;
      else clean[field.key] = String(clean[field.key] ?? '').trim();
    });
    if (group.slug === 'access' && module.slug === 'users') {
      clean.email = String(clean.email ?? '').toLowerCase();
    }
    if (group.slug === 'cms' && ['blog', 'static-pages'].includes(module.slug)) {
      clean.slug = canonicalCmsSlug(module.slug, clean.slug, clean[titleKey]);
    }
    if (group.slug === 'cms' && module.slug === 'seo') {
      clean.page = `/${String(clean.page ?? '').trim().replace(/^\/+/, '').replace(/\/+$/, '')}`;
      clean.length = String(clean.title ?? '').length;
      const titleLength = Number(clean.length);
      const descriptionLength = String(clean.description ?? '').length;
      clean.status = !titleLength
        ? 'Thiếu meta'
        : titleLength <= 60 && descriptionLength > 0 && descriptionLength <= 160
          ? 'Tốt'
          : 'Cần cải thiện';
    }
    if (group.slug === 'cms' && module.slug === 'menu') {
      const items = parseCmsMenuStructure(clean.structure);
      clean.items = items.length;
      const parentByName = new Map(items.map((item) => [item.title.toLocaleLowerCase(), item.parent.toLocaleLowerCase()]));
      clean.depth = items.reduce((max, item) => {
        let depth = 1;
        let parent = item.parent.toLocaleLowerCase();
        const visited = new Set<string>();
        while (parent && parentByName.has(parent) && !visited.has(parent)) {
          visited.add(parent);
          depth += 1;
          parent = parentByName.get(parent) ?? '';
        }
        return Math.max(max, depth);
      }, 1);
    }
    if (group.slug === 'cms' && module.slug === 'slider') {
      const slideCount = String(clean.slidesData ?? '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean).length;
      if (slideCount) clean.slides = slideCount;
    }
    if (group.slug === 'catalog') {
      const makeId = () => typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      if (['categories', 'products'].includes(module.slug)) {
        const title = String(clean[module.slug === 'products' ? 'name' : 'name'] ?? '');
        clean.slug = sofa2Slugify(String(clean.slug || title));
      }
      if (module.slug === 'categories') {
        clean.products = getSofa2AdminRows('catalog', 'products').filter(
          (row) => String(row.category ?? '').toLowerCase() === String(clean.name ?? '').toLowerCase()
        ).length;
      }
      if (module.slug === 'products' && form.mode === 'create' && !clean.id) {
        clean.id = `sp-${makeId()}`;
      }
      if (module.slug === 'attributes') {
        clean.code = sofa2Slugify(String(clean.code || clean.name));
        clean.values = String(clean.valueList ?? '').split(',').map((item) => item.trim()).filter(Boolean).length;
      }
      if (module.slug === 'inventory') {
        const available = Number(clean.stock) - Number(clean.reserved);
        clean.status = available <= 0 ? 'Hết hàng' : available <= Number(clean.minStock) ? 'Sắp hết' : 'Đủ hàng';
      }
      if (module.slug === 'variants' && Number(clean.stock) <= 0) clean.status = 'Hết hàng';
      if (module.slug === 'pricing') {
        const today = new Date().toISOString().slice(0, 10);
        const starts = toDateInput(clean.startDate);
        const ends = toDateInput(clean.endDate);
        clean.status = clean.status === 'Hết hiệu lực' || (ends && ends < today)
          ? 'Hết hiệu lực'
          : starts && starts > today
            ? 'Chờ bắt đầu'
            : Number(clean.sale) < Number(clean.list) ? 'Đang giảm' : 'Giá gốc';
      }
    }
    if (group.slug === 'access' && module.slug === 'roles' && !String(clean.code ?? '').trim()) {
      clean.code = sofa2Slugify(String(clean.role ?? ''));
    }
    if (
      group.slug === 'hr' &&
      ['recruitment', 'job-detail', 'recruitment-tracking'].includes(module.slug) &&
      !String(clean.jobId ?? '').trim()
    ) {
      clean.jobId = `JOB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    }
    if (group.slug === 'hr' && ['submit-cv', 'applicant-profile'].includes(module.slug) && !String(clean.applicationId ?? '').trim()) {
      clean.applicationId = `APP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    }
    if (group.slug === 'hr') {
      const today = sofa2Today();
      if (['recruitment', 'job-detail', 'recruitment-tracking'].includes(module.slug)) {
        if (String(clean.status) === 'Đang tuyển') {
          clean.postedDate = String(clean.postedDate ?? '') || today;
          clean.closedDate = '';
        } else if (['Đã đóng', 'Đã đủ người'].includes(String(clean.status)) && fields.some((field) => field.key === 'closedDate')) {
          clean.closedDate = String(clean.closedDate ?? '') || today;
        }
      }
      if (module.slug === 'submit-cv') {
        clean.email = String(clean.email ?? '').toLowerCase();
        clean.screeningResult = String(clean.screeningResult ?? '') || 'Chưa sàng lọc';
        const job = getSofa2AdminRows('hr', 'recruitment')
          .find((item) => String(item.jobId ?? '') === String(clean.jobId ?? ''));
        clean.job = job ? String(job.title ?? '') : 'Ứng tuyển vị trí phù hợp';
      }
      if (module.slug === 'applicant-profile') {
        clean.email = String(clean.email ?? '').toLowerCase();
        clean.interviewRound = String(clean.interviewRound ?? '') || 'Sàng lọc CV';
        const job = getSofa2AdminRows('hr', 'recruitment')
          .find((item) => String(item.jobId ?? '') === String(clean.jobId ?? ''));
        clean.appliedJob = job ? String(job.title ?? '') : 'Ứng tuyển vị trí phù hợp';
      }
    }
    if (fields.some((x) => x.key === 'updated')) clean.updated = sofa2Today();
    if (group.slug === 'dealer' && module.slug === 'dashboard' && form.mode === 'edit') {
      clean.dealerId = rows[form.index]?.dealerId ?? '';
    }

    if (form.mode === 'create') {
      createRow(clean);
    } else {
      updateRow(form.index, clean);
    }
    const synced = await syncDealerModule();
    setToast(
      synced
        ? form.mode === 'create'
          ? `Đã thêm ${entity} mới.`
          : `Đã cập nhật ${entity}.`
        : 'Đã lưu thay đổi trên trình duyệt demo.'
    );
    setForm((prev) => ({ ...prev, open: false }));
  };

  const togglePublish = async (index: number) => {
    if (!canPublish) return;
    const row = rows[index];
    const isPublished = String(row[statusKey]) === published;
    const next = isPublished ? statusOptions[1] ?? 'Bản nháp' : published;
    if (group.slug === 'hr' && ['recruitment', 'job-detail', 'recruitment-tracking'].includes(module.slug) && next === 'Đang tuyển') {
      const deadline = toDateInput(row.deadline);
      if (!deadline || deadline < sofa2Today()) {
        setToast('Không thể mở vị trí: cần đặt hạn nộp hôm nay hoặc muộn hơn.');
        return;
      }
      if (!String(row.description ?? '').trim() || !String(row.requirements ?? '').trim()) {
        setToast('Không thể mở vị trí: hãy bổ sung mô tả và yêu cầu trong Chi tiết vị trí.');
        return;
      }
    }
    const nextRow: AdminRow = { ...row, [statusKey]: next, ...(row.updated ? { updated: sofa2Today() } : {}) };
    if (group.slug === 'hr' && ['recruitment', 'job-detail', 'recruitment-tracking'].includes(module.slug)) {
      if (next === 'Đang tuyển') {
        nextRow.postedDate = String(row.postedDate ?? '') || sofa2Today();
        nextRow.closedDate = '';
      } else if (['Đã đóng', 'Đã đủ người'].includes(String(next)) && fields.some((field) => field.key === 'closedDate')) {
        nextRow.closedDate = sofa2Today();
      }
    }
    updateRow(index, nextRow);
    const synced = await syncDealerModule();
    setToast(
      synced
        ? isPublished
          ? `Đã gỡ ${publishLabel.toLowerCase()} ${entity}.`
          : `Đã ${publishLabel.toLowerCase()} ${entity}.`
        : 'Đã lưu thay đổi trên trình duyệt demo.'
    );
  };

  const duplicateRow = async (index: number) => {
    if (!canCreate) return;
    if (group.slug === 'hr' && ['submit-cv', 'applicant-profile'].includes(module.slug)) {
      setToast('Không thể nhân bản hồ sơ ứng viên; hãy tạo hồ sơ mới để tránh trùng thông tin và mã theo dõi.');
      return;
    }
    const row = rows[index];
    const copy: AdminRow = {
      ...row,
      [titleKey]: `${row[titleKey]} (bản sao)`,
      [statusKey]: statusOptions[1] ?? 'Bản nháp',
    };
    if (group.slug === 'hr' && ['recruitment', 'job-detail', 'recruitment-tracking'].includes(module.slug)) {
      copy.jobId = `JOB-COPY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      delete copy.legacyId;
      copy.status = 'Tạm dừng';
      copy.deadline = '';
      copy.postedDate = '';
      copy.closedDate = '';
      ['views', 'applicants', 'hired', 'screeningPassed', 'interviewing', 'offered', 'rejected', 'daysOpen', 'cost'].forEach((key) => { copy[key] = 0; });
    }
    if (group.slug === 'dealer' && module.slug === 'dashboard') {
      delete copy.dealerId;
      copy.email = '';
      copy.portalAccess = 'Không';
    }
    if (group.slug === 'cms') delete copy.id;
    if (copy.slug) {
      copy.slug =
        group.slug === 'cms'
          ? `${sofa2Slugify(String(row[titleKey]))}-${Date.now().toString(36)}`
          : `${sofa2Slugify(String(row[titleKey]))}-copy`;
    }
    createRow(copy);
    const synced = await syncDealerModule();
    setToast(synced ? `Đã nhân bản ${entity}.` : 'Đã lưu thay đổi trên trình duyệt demo.');
  };

  const catalogDeleteBlockReason = (row: AdminRow) => {
    if (group.slug === 'hr' && ['recruitment', 'job-detail', 'recruitment-tracking'].includes(module.slug)) {
      const jobId = String(row.jobId ?? '');
      const hasApplications = ['submit-cv', 'applicant-profile'].some((moduleName) =>
        getSofa2AdminRows('hr', moduleName).some((application) => String(application.jobId ?? '') === jobId)
      );
      if (hasApplications) return 'Vị trí có hồ sơ ứng viên liên kết; hãy chuyển trạng thái sang Đã đóng thay vì xoá để giữ lịch sử.';
    }
    if (group.slug === 'customer') {
      const customerId = String(row.customerId ?? '');
      const linked = (moduleName: string, predicate: (item: AdminRow) => boolean) =>
        getSofa2AdminRows('customer', moduleName).some(predicate);
      if (module.slug === 'dashboard') return 'Dashboard là bản tổng hợp khách hàng; hãy quản lý hồ sơ tại mục Hồ sơ.';
      if (module.slug === 'profiles' && ['customer-orders', 'warranties', 'points', 'complaints', 'vouchers'].some((name) =>
        linked(name, (item) => String(item.customerId ?? '') === customerId)
      )) return 'Khách hàng còn giao dịch liên kết; hãy lưu trữ hồ sơ thay vì xoá.';
      if (module.slug === 'customer-orders' && (
        linked('warranties', (item) => String(item.orderCode ?? '') === String(row.code ?? ''))
        || getSofa2AdminRows('shopping', 'transactions').some((item) => String(item.order ?? '') === String(row.code ?? ''))
      )) return 'Đơn hàng có giao dịch thanh toán hoặc phiếu bảo hành liên kết; hãy cập nhật trạng thái thay vì xoá.';
      if (module.slug === 'points' && String(row.status) === 'Đã ghi nhận') return 'Giao dịch điểm đã ghi nhận; hãy tạo giao dịch điều chỉnh thay vì xoá lịch sử.';
      return '';
    }
    if (group.slug !== 'catalog') return '';
    const linked = (moduleName: string, predicate: (item: AdminRow) => boolean) =>
      getSofa2AdminRows('catalog', moduleName).some(predicate);
    if (module.slug === 'categories' && linked('products', (item) =>
      String(item.category ?? '').toLowerCase() === String(row.name ?? '').toLowerCase()
    )) return 'Danh mục đang được sản phẩm sử dụng.';
    if (module.slug === 'products' && linked('variants', (item) =>
      String(item.product ?? '').toLowerCase() === String(row.name ?? '').toLowerCase()
      || String(item.product ?? '').toLowerCase() === String(row.sku ?? '').toLowerCase()
    )) return 'Sản phẩm đang có biến thể; hãy xử lý biến thể trước.';
    if (module.slug === 'products' && ['inventory', 'pricing'].some((name) => linked(name, (item) =>
      String(item.sku ?? '').toLowerCase() === String(row.sku ?? '').toLowerCase()
    ))) return 'Sản phẩm đang có tồn kho hoặc bảng giá liên kết.';
    if (module.slug === 'variants' && ['inventory', 'pricing'].some((name) => linked(name, (item) =>
      String(item.sku ?? '').toLowerCase() === String(row.sku ?? '').toLowerCase()
    ))) return 'Biến thể đang có tồn kho hoặc bảng giá liên kết.';
    return '';
  };

  const doDelete = async () => {
    if (!canDelete) {
      setConfirm({ open: false, index: null });
      setToast('Tài khoản chưa được cấp quyền xoá.');
      return;
    }
    if (confirm.index !== null) {
      const reason = catalogDeleteBlockReason(rows[confirm.index]);
      if (reason) {
        setToast(reason);
        setConfirm({ open: false, index: null });
        return;
      }
      deleteRow(confirm.index);
      setSelected([]);
      const synced = await syncDealerModule();
      setToast(synced ? `Đã xoá ${entity}.` : 'Đã xoá dữ liệu trong trình duyệt demo.');
    }
    setConfirm({ open: false, index: null });
  };

  const doBulkDelete = async () => {
    if (!canDelete) {
      setBulkConfirm(false);
      setToast('Tài khoản chưa được cấp quyền xoá.');
      return;
    }
    const removable = selected.filter((index) => !catalogDeleteBlockReason(rows[index]));
    const skipped = selected.length - removable.length;
    if (!removable.length) {
      setBulkConfirm(false);
      setToast(group.slug === 'customer'
        ? 'Không thể xoá các bản ghi đã được dùng; hãy cập nhật trạng thái hoặc lưu trữ thay vì xoá lịch sử.'
        : group.slug === 'hr'
          ? 'Không thể xoá vị trí đã có ứng viên; hãy đóng vị trí để giữ lại lịch sử tuyển dụng.'
          : 'Không thể xoá: một số bản ghi còn liên kết với sản phẩm, tồn kho hoặc bảng giá.');
      return;
    }
    const deletedCount = removable.length;
    deleteRows(removable);
    setSelected([]);
    setBulkConfirm(false);
    const synced = await syncDealerModule();
    setToast(
      skipped
        ? `Đã xoá ${deletedCount} ${entity}; bỏ qua ${skipped} bản ghi đang được liên kết.`
        : synced
          ? `Đã xoá ${deletedCount} ${entity}.`
          : 'Đã xoá dữ liệu trong trình duyệt demo.'
    );
  };

  const bulkPublish = async () => {
    if (!canPublish) return;
    const isHrJobs = group.slug === 'hr' && ['recruitment', 'job-detail', 'recruitment-tracking'].includes(module.slug);
    const publishable = selected.filter((index) => {
      if (!isHrJobs) return true;
      const row = rows[index];
      const deadline = toDateInput(row?.deadline);
      return !!deadline && deadline >= sofa2Today()
        && !!String(row?.description ?? '').trim()
        && !!String(row?.requirements ?? '').trim();
    });
    const skipped = selected.length - publishable.length;
    publishable.slice().sort((a, b) => a - b).forEach((index) => {
      const row = rows[index];
      const nextRow: AdminRow = { ...row, [statusKey]: published };
      if (isHrJobs) {
        nextRow.postedDate = String(row.postedDate ?? '') || sofa2Today();
        nextRow.closedDate = '';
      }
      updateRow(index, nextRow);
    });
    const synced = await syncDealerModule();
    setToast(skipped
      ? `Đã cập nhật ${publishable.length} ${entity}; bỏ qua ${skipped} vị trí chưa đủ hạn nộp, mô tả hoặc yêu cầu.`
      : synced
        ? `Đã ${publishLabel.toLowerCase()} ${selected.length} ${entity}.`
        : 'Đã lưu thay đổi trên trình duyệt demo.');
    setSelected([]);
  };

  const toggleSelect = (index: number) =>
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );

  const isSystemAccessRole = (row: AdminRow) =>
    group.slug === 'access' && module.slug === 'roles' && row.status === 'Hệ thống';
  const isProtectedAccessRole = (row: AdminRow) => {
    if (group.slug !== 'access' || module.slug !== 'roles') return false;
    const roleName = String(row.role ?? '').trim().toLocaleLowerCase();
    return (
      isSystemAccessRole(row) ||
      accessUsers.some((user) => {
        const assigned = [user.role, ...String(user.extraRoles ?? '').split(',')];
        return assigned.some((role) => String(role ?? '').trim().toLocaleLowerCase() === roleName);
      })
    );
  };
  const selectablePaged = paged.filter(({ row }) => !isProtectedAccessRole(row));
  const allOnPage =
    selectablePaged.length > 0 && selectablePaged.every(({ index }) => selected.includes(index));

  const exportCsv = () => {
    if (!canExport && !isAdmin) {
      setToast('Tài khoản chưa được cấp quyền xuất dữ liệu.');
      return;
    }
    const keys = fields.map((x) => x.key);
    const header = fields.map((x) => x.label).join(',');
    const body = filtered
      .map(({ row }) => keys.map((k) => `"${String(row[k] ?? '')}"`).join(','))
      .join('\n');
    const blob = new Blob([`\ufeff${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cms-${module.slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('Đã xuất dữ liệu CSV.');
  };

  // ----------------------------------------------------------------------

  const renderField = (field: Sofa2CmsField) => {
    const value = form.values[field.key] ?? '';
    const error = errors[field.key];
    const isCustomerLookup = group.slug === 'customer'
      && !['dashboard', 'profiles'].includes(module.slug)
      && ['customerId', 'customer', 'orderCode'].includes(field.key);
    const isHrJobLookup = group.slug === 'hr'
      && ['submit-cv', 'applicant-profile'].includes(module.slug)
      && field.key === 'jobId';
    const fieldOptions = (() => {
      if (field.key === 'dealer' && group.slug === 'dealer') {
        return Array.from(
          new Set(
            [
              ...getSofa2AdminRows('dealer', 'dashboard').map((row) =>
                String(row.dealer ?? '').trim()
              ),
              ...(field.options ?? []),
              String(value).trim(),
            ].filter(Boolean)
          )
        );
      }
      if (field.key === 'role' && group.slug === 'access' && module.slug === 'users') {
        const activeRoles = getSofa2AdminRows('access', 'roles')
          .filter((row) => String(row.status) !== 'Ngưng dùng')
          .map((row) => String(row.role ?? '').trim())
          .filter(Boolean);
        return Array.from(new Set([...activeRoles, String(value).trim()])).filter(Boolean);
      }
      if (isHrJobLookup) {
        const jobs = getSofa2AdminRows('hr', 'recruitment');
        return Array.from(new Set([
          ...jobs.map((job) => String(job.jobId ?? '').trim()),
          String(value).trim(),
        ])).filter(Boolean);
      }
      if (group.slug === 'customer') {
        const profiles = getSofa2AdminRows('customer', 'profiles');
        if (field.key === 'customerId') {
          const ids = profiles.map((row) => String(row.customerId ?? '').trim()).filter(Boolean);
          if (module.slug === 'vouchers') ids.unshift('Tất cả thành viên');
          return Array.from(new Set([...ids, String(value).trim()])).filter(Boolean);
        }
        if (field.key === 'customer') {
          const names = profiles.map((row) => String(row.name ?? '').trim()).filter(Boolean);
          if (module.slug === 'vouchers') names.unshift('Tất cả thành viên');
          return Array.from(new Set([...names, String(value).trim()])).filter(Boolean);
        }
        if (field.key === 'orderCode') {
          const customerId = String(form.values.customerId ?? '');
          const codes = getSofa2AdminRows('customer', 'customer-orders')
            .filter((row) => !customerId || String(row.customerId ?? '') === customerId)
            .map((row) => String(row.code ?? '').trim()).filter(Boolean);
          return Array.from(new Set([...codes, String(value).trim()])).filter(Boolean);
        }
      }
      if (group.slug === 'catalog') {
        const products = getSofa2AdminRows('catalog', 'products');
        const categories = getSofa2AdminRows('catalog', 'categories');
        const variants = getSofa2AdminRows('catalog', 'variants');
        if (field.key === 'category') {
          return Array.from(new Set([
            ...(field.options ?? []),
            ...categories.filter((row) => row.status !== 'Ẩn').map((row) => String(row.name ?? '').trim()),
            String(value).trim(),
          ])).filter(Boolean);
        }
        if (field.key === 'product') {
          return Array.from(new Set([
            ...products.filter((row) => !['Bản nháp', 'Ngừng bán'].includes(String(row.status))).map((row) => String(row.name ?? '').trim()),
            String(value).trim(),
          ])).filter(Boolean);
        }
        if (field.key === 'sku') {
          return Array.from(new Set([
            ...products.map((row) => String(row.sku ?? '').trim()),
            ...variants.map((row) => String(row.sku ?? '').trim()),
            String(value).trim(),
          ])).filter(Boolean);
        }
      }
      return field.options ?? [];
    })();

    if (field.type === 'switch') {
      return (
        <FormControlLabel
          key={field.key}
          control={
            <Switch
              checked={isPortalEnabled(value)}
              onChange={(e) => setValue(field.key, e.target.checked ? 'Có' : 'Không')}
            />
          }
          label={field.label}
        />
      );
    }

    return (
      <TextField
        key={field.key}
        fullWidth
        select={field.type === 'select' || isCustomerLookup || isHrJobLookup}
        multiline={field.type === 'textarea'}
        minRows={field.multiline}
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        label={field.label}
        disabled={field.disabled || (isHrJobLookup && form.mode === 'edit')}
        value={field.type === 'date' ? toDateInput(value) : value}
        error={!!error}
        placeholder={field.placeholder}
        helperText={
          error ??
          (field.maxLength
            ? `${String(value).length}/${field.maxLength} ký tự${field.helper ? ` — ${field.helper}` : ''}`
            : isHrJobLookup
              ? form.mode === 'edit'
                ? 'Vị trí đã khóa để giữ nguyên lịch sử hồ sơ.'
                : 'Chọn vị trí ứng tuyển; để trống cho hồ sơ tự do.'
              : field.helper)
        }
        SelectProps={isHrJobLookup ? { displayEmpty: true } : undefined}
        onChange={(e) => {
          const nextValue = e.target.value;
          setValue(field.key, nextValue);
          if (isHrJobLookup) {
            const job = getSofa2AdminRows('hr', 'recruitment')
              .find((item) => String(item.jobId ?? '') === String(nextValue));
            const title = String(job?.title ?? 'Ứng tuyển vị trí phù hợp');
            setValue(module.slug === 'submit-cv' ? 'job' : 'appliedJob', title);
          }
          if (group.slug === 'customer' && field.key === 'customerId') {
            const profile = getSofa2AdminRows('customer', 'profiles')
              .find((item) => String(item.customerId ?? '') === String(nextValue));
            if (profile) setValue('customer', String(profile.name ?? ''));
            else if (nextValue === 'Tất cả thành viên') setValue('customer', 'Tất cả thành viên');
          }
          if (group.slug === 'customer' && field.key === 'customer') {
            const profile = getSofa2AdminRows('customer', 'profiles')
              .find((item) => String(item.name ?? '') === String(nextValue));
            if (profile) setValue('customerId', String(profile.customerId ?? ''));
            else if (nextValue === 'Tất cả thành viên') setValue('customerId', 'Tất cả thành viên');
          }
        }}
        onBlur={() => {
          if (
            field.key === 'slug' &&
            !String(value).trim() &&
            group.slug === 'cms' &&
            ['blog', 'static-pages'].includes(module.slug)
          ) {
            setValue('slug', canonicalCmsSlug(module.slug, '', form.values[titleKey]));
          }
        }}
      >
        {isHrJobLookup && <MenuItem value="">Ứng tuyển tự do / chưa gắn vị trí</MenuItem>}
        {fieldOptions.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const groupedFields = (g: Sofa2CmsField['group']) => fields.filter((x) => x.group === g);
  const dashboardStats = useMemo(() => {
    if (group.slug === 'dealer') {
      const sum = (field: string, items = rows) =>
        items.reduce((total, row) => total + asNumber(row[field]), 0);
      const countStatus = (status: string) =>
        rows.filter((row) => String(row.status) === status).length;
      const endDateWithinDays = (days: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const limit = new Date(today);
        limit.setDate(limit.getDate() + days);
        return rows.filter((row) => {
          const endDate = getDate(row.endDate);
          return (
            String(row.status) === 'Đang áp dụng' &&
            endDate !== null &&
            endDate >= today &&
            endDate <= limit
          );
        }).length;
      };
      const activePolicies = rows.filter((row) => String(row.status) === 'Đang áp dụng');
      const statsByModule: Record<string, typeof module.stats> = {
        dashboard: [
          { label: 'Đại lý trong hệ thống', value: rows.length.toLocaleString('vi-VN') },
          {
            label: 'Cổng đại lý đã bật',
            value: rows.filter((row) => isPortalEnabled(row.portalAccess)).length.toLocaleString('vi-VN'),
          },
          { label: 'Doanh số tháng', value: compactMoney(sum('achieved')) },
          { label: 'Đang tạm ngưng', value: countStatus('Tạm ngưng').toLocaleString('vi-VN') },
        ],
        'price-policy': [
          { label: 'Chính sách đang áp dụng', value: activePolicies.length.toLocaleString('vi-VN') },
          {
            label: 'Chiết khấu trung bình',
            value: `${activePolicies.length ? Math.round(sum('discount', activePolicies) / activePolicies.length) : 0}%`,
          },
          { label: 'Sắp hết hạn 30 ngày', value: endDateWithinDays(30).toLocaleString('vi-VN') },
          { label: 'Bản nháp', value: countStatus('Bản nháp').toLocaleString('vi-VN') },
        ],
        quotes: [
          {
            label: 'Chờ xử lý',
            value: (countStatus('Chờ xử lý') + countStatus('Chờ phản hồi')).toLocaleString('vi-VN'),
          },
          { label: 'Đã gửi', value: countStatus('Đã gửi').toLocaleString('vi-VN') },
          {
            label: 'Tỷ lệ chốt',
            value: `${rows.length ? Math.round((countStatus('Đã chốt') / rows.length) * 100) : 0}%`,
          },
          { label: 'Giá trị báo giá', value: compactMoney(sum('value')) },
        ],
        'dealer-orders': [
          { label: 'Tổng đơn hàng', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Đang giao', value: countStatus('Đang giao').toLocaleString('vi-VN') },
          { label: 'Chờ xác nhận', value: countStatus('Chờ xác nhận').toLocaleString('vi-VN') },
          { label: 'Tổng giá trị đơn', value: compactMoney(sum('total')) },
        ],
        debts: [
          { label: 'Tổng dư nợ', value: compactMoney(sum('balance')) },
          {
            label: 'Dư nợ quá hạn',
            value: compactMoney(
              sum('balance', rows.filter((row) => String(row.status) === 'Quá hạn'))
            ),
          },
          { label: 'Sắp đến hạn', value: countStatus('Sắp đến hạn').toLocaleString('vi-VN') },
          { label: 'Tổng hạn mức', value: compactMoney(sum('limit')) },
        ],
        'sales-docs': [
          { label: 'Đã xuất bản', value: countStatus('Đã xuất bản').toLocaleString('vi-VN') },
          { label: 'Lượt tải', value: sum('downloads').toLocaleString('vi-VN') },
          {
            label: 'Tài liệu giới hạn',
            value: rows.filter((row) => row.access !== 'Tất cả đại lý').length.toLocaleString('vi-VN'),
          },
          { label: 'Bản nháp', value: countStatus('Bản nháp').toLocaleString('vi-VN') },
        ],
      };
      return statsByModule[module.slug] ?? module.stats;
    }

    if (group.slug === 'cms') {
      const publishedCount = rows.filter((row) => ['Đã xuất bản', 'Đang chạy', 'Tốt'].includes(String(row.status))).length;
      const draftCount = rows.filter((row) => ['Bản nháp', 'Chờ duyệt', 'Cần cải thiện', 'Thiếu meta'].includes(String(row.status))).length;
      const lastUpdated = rows.map((row) => getDate(row.updated)).filter((date): date is Date => !!date).sort((a, b) => b.getTime() - a.getTime())[0]?.toLocaleDateString('vi-VN') ?? '—';
      if (['home', 'about', 'contact', 'policy', 'terms', 'faq'].includes(module.slug)) {
        return [
          { label: 'Khối nội dung', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Đang hiển thị', value: publishedCount.toLocaleString('vi-VN') },
          { label: 'Bản nháp / chờ duyệt', value: draftCount.toLocaleString('vi-VN') },
          { label: 'Cập nhật gần nhất', value: lastUpdated },
        ];
      }
      if (module.slug === 'blog') {
        return [
          { label: 'Bài viết', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Đã xuất bản', value: publishedCount.toLocaleString('vi-VN') },
          { label: 'Chờ duyệt / nháp', value: rows.filter((row) => ['Chờ duyệt', 'Bản nháp'].includes(String(row.status))).length.toLocaleString('vi-VN') },
          { label: 'Lượt đọc', value: rows.reduce((sum, row) => sum + asNumber(row.views), 0).toLocaleString('vi-VN') },
        ];
      }
      if (module.slug === 'menu') {
        return [
          { label: 'Menu', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Đang xuất bản', value: publishedCount.toLocaleString('vi-VN') },
          { label: 'Tổng mục điều hướng', value: rows.reduce((sum, row) => sum + asNumber(row.items), 0).toLocaleString('vi-VN') },
          { label: 'Vị trí sử dụng', value: new Set(rows.map((row) => String(row.position))).size.toLocaleString('vi-VN') },
        ];
      }
      if (module.slug === 'banner') {
        return [
          { label: 'Tổng banner', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Đang chạy', value: rows.filter((row) => row.status === 'Đang chạy').length.toLocaleString('vi-VN') },
          { label: 'Hết hạn', value: rows.filter((row) => row.status === 'Hết hạn').length.toLocaleString('vi-VN') },
          { label: 'Vị trí', value: new Set(rows.map((row) => String(row.position))).size.toLocaleString('vi-VN') },
        ];
      }
      if (module.slug === 'slider') {
        return [
          { label: 'Slider', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Slide', value: rows.reduce((sum, row) => sum + asNumber(row.slides), 0).toLocaleString('vi-VN') },
          { label: 'Đã xuất bản', value: publishedCount.toLocaleString('vi-VN') },
          { label: 'Cập nhật gần nhất', value: lastUpdated },
        ];
      }
      if (module.slug === 'seo') {
        return [
          { label: 'Trang có cấu hình', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Tốt', value: rows.filter((row) => row.status === 'Tốt').length.toLocaleString('vi-VN') },
          { label: 'Cần cải thiện', value: rows.filter((row) => row.status === 'Cần cải thiện').length.toLocaleString('vi-VN') },
          { label: 'Thiếu meta', value: rows.filter((row) => row.status === 'Thiếu meta').length.toLocaleString('vi-VN') },
        ];
      }
      if (module.slug === 'static-pages') {
        return [
          { label: 'Trang tĩnh', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Đã xuất bản', value: publishedCount.toLocaleString('vi-VN') },
          { label: 'Bản nháp', value: draftCount.toLocaleString('vi-VN') },
          { label: 'Cập nhật gần nhất', value: lastUpdated },
        ];
      }
    }

    if (group.slug === 'access') {
      if (module.slug === 'users') {
        return [
          { label: 'Tài khoản', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Đang hoạt động', value: rows.filter((row) => row.status === 'Hoạt động').length.toLocaleString('vi-VN') },
          { label: 'Chờ kích hoạt', value: rows.filter((row) => row.status === 'Chờ kích hoạt').length.toLocaleString('vi-VN') },
          { label: 'Bị khoá', value: rows.filter((row) => row.status === 'Bị khoá').length.toLocaleString('vi-VN') },
        ];
      }
      if (module.slug === 'roles') {
        return [
          { label: 'Vai trò', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Vai trò tuỳ chỉnh', value: rows.filter((row) => row.status === 'Tuỳ chỉnh').length.toLocaleString('vi-VN') },
          {
            label: 'Người dùng gán',
            value: accessUsers.filter((user) =>
              [user.role, ...String(user.extraRoles ?? '').split(',')].some((assigned) =>
                rows.some((role) => String(role.role ?? '').toLocaleLowerCase() === String(assigned ?? '').trim().toLocaleLowerCase())
              )
            ).length.toLocaleString('vi-VN'),
          },
          { label: 'Đang sử dụng', value: rows.filter((row) => row.status !== 'Ngưng dùng').length.toLocaleString('vi-VN') },
        ];
      }
      if (module.slug === 'permissions') {
        const active = rows.filter((row) => row.status !== 'Tắt');
        return [
          { label: 'Module có quyền', value: new Set(active.map((row) => String(row.module))).size.toLocaleString('vi-VN') },
          { label: 'Quyền đang bật', value: active.length.toLocaleString('vi-VN') },
          { label: 'Quyền nhạy cảm', value: rows.filter((row) => row.status === 'Nhạy cảm').length.toLocaleString('vi-VN') },
          { label: 'Cần phê duyệt', value: rows.filter((row) => row.status === 'Cần phê duyệt').length.toLocaleString('vi-VN') },
        ];
      }
      if (module.slug === 'audit-log') {
        const today = new Date().toISOString().slice(0, 10);
        return [
          { label: 'Sự kiện đang lưu', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Sự kiện hôm nay', value: rows.filter((row) => String(row.time).startsWith(today)).length.toLocaleString('vi-VN') },
          { label: 'Thay đổi quyền', value: rows.filter((row) => row.type === 'Thay đổi phân quyền').length.toLocaleString('vi-VN') },
          { label: 'Giới hạn hiển thị', value: '500' },
        ];
      }
    }

    if (group.slug === 'catalog') {
      const sum = (key: string, items = rows) => items.reduce((total, row) => total + asNumber(row[key]), 0);
      if (module.slug === 'categories') {
        const products = getSofa2AdminRows('catalog', 'products');
        return [
          { label: 'Danh mục', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Danh mục đang hiển thị', value: rows.filter((row) => row.status !== 'Ẩn').length.toLocaleString('vi-VN') },
          { label: 'Sản phẩm đã gán', value: products.filter((product) => rows.some((category) => String(category.name).toLowerCase() === String(product.category).toLowerCase())).length.toLocaleString('vi-VN') },
          { label: 'Ẩn', value: rows.filter((row) => row.status === 'Ẩn').length.toLocaleString('vi-VN') },
        ];
      }
      if (module.slug === 'products') return [
        { label: 'Tổng sản phẩm', value: rows.length.toLocaleString('vi-VN') },
        { label: 'Đang bán', value: rows.filter((row) => row.status === 'Đang bán').length.toLocaleString('vi-VN') },
        { label: 'Hết hàng', value: rows.filter((row) => row.status === 'Hết hàng').length.toLocaleString('vi-VN') },
        { label: 'Bản nháp / ngừng bán', value: rows.filter((row) => ['Bản nháp', 'Ngừng bán'].includes(String(row.status))).length.toLocaleString('vi-VN') },
      ];
      if (module.slug === 'attributes') return [
        { label: 'Nhóm thuộc tính', value: rows.length.toLocaleString('vi-VN') },
        { label: 'Giá trị cấu hình', value: sum('values').toLocaleString('vi-VN') },
        { label: 'Đang hoạt động', value: rows.filter((row) => row.status === 'Hoạt động').length.toLocaleString('vi-VN') },
        { label: 'Dùng cho biến thể', value: rows.filter((row) => String(row.usage).includes('Biến thể')).length.toLocaleString('vi-VN') },
      ];
      if (module.slug === 'variants') return [
        { label: 'Biến thể', value: rows.length.toLocaleString('vi-VN') },
        { label: 'Có tồn kho', value: rows.filter((row) => asNumber(row.stock) > 0).length.toLocaleString('vi-VN') },
        { label: 'Tổng số lượng', value: sum('stock').toLocaleString('vi-VN') },
        { label: 'Hết hàng', value: rows.filter((row) => asNumber(row.stock) <= 0).length.toLocaleString('vi-VN') },
      ];
      if (module.slug === 'inventory') return [
        { label: 'Dòng tồn kho', value: rows.length.toLocaleString('vi-VN') },
        { label: 'Tồn khả dụng', value: rows.reduce((total, row) => total + Math.max(0, asNumber(row.stock) - asNumber(row.reserved)), 0).toLocaleString('vi-VN') },
        { label: 'Sắp hết', value: rows.filter((row) => row.status === 'Sắp hết').length.toLocaleString('vi-VN') },
        { label: 'Hết hàng', value: rows.filter((row) => row.status === 'Hết hàng').length.toLocaleString('vi-VN') },
      ];
      if (module.slug === 'pricing') {
        const averageDiscount = rows.length
          ? rows.reduce((total, row) => total + Math.max(0, (asNumber(row.list) - asNumber(row.sale)) / Math.max(1, asNumber(row.list)) * 100), 0) / rows.length
          : 0;
        return [
          { label: 'Bảng giá / SKU', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Đang khuyến mãi', value: rows.filter((row) => row.status === 'Đang giảm').length.toLocaleString('vi-VN') },
          { label: 'Giá gốc', value: rows.filter((row) => row.status === 'Giá gốc').length.toLocaleString('vi-VN') },
          { label: 'Giảm trung bình', value: `${Math.round(averageDiscount)}%` },
        ];
      }
    }

    if (group.slug !== 'hr') return module.stats;

    const sum = (key: string, items = rows) =>
      items.reduce((total, row) => total + (Number(row[key]) || 0), 0);
    const average = (key: string, items = rows) =>
      items.length ? sum(key, items) / items.length : 0;
    const count = (predicate: (row: AdminRow) => boolean) => rows.filter(predicate).length;
    const openJobs = rows.filter(isSofa2JobOpen);
    const totalApplicants = sum('applicants');
    const hired = sum('hired');
    const formatCount = (value: number) => Math.round(value).toLocaleString('vi-VN');

    const statsByModule: Record<string, typeof module.stats> = {
      recruitment: [
        { label: 'Vị trí đang tuyển', value: formatCount(openJobs.length) },
        { label: 'Chỉ tiêu còn mở', value: formatCount(sum('quantity', openJobs)) },
        { label: 'Hồ sơ nhận', value: formatCount(totalApplicants) },
        { label: 'Đã nhận việc', value: formatCount(hired) },
      ],
      'job-detail': [
        { label: 'Vị trí đã đăng', value: formatCount(rows.length) },
        { label: 'Lượt xem tin', value: formatCount(sum('views')) },
        { label: 'Hồ sơ/vị trí', value: formatCount(average('applicants')) },
        { label: 'Ngày mở TB', value: `${Math.round(average('daysOpen'))} ngày` },
      ],
      'submit-cv': [
        { label: 'Tổng hồ sơ', value: formatCount(rows.length) },
        { label: 'Mới chưa xử lý', value: formatCount(count((row) => String(row.status) === 'Mới')) },
        { label: 'Đang tuyển chọn', value: formatCount(count((row) => ['Đang sàng lọc', 'Phỏng vấn', 'Thử việc'].includes(String(row.status)))) },
        { label: 'Trúng tuyển', value: formatCount(count((row) => String(row.status) === 'Trúng tuyển')) },
      ],
      'applicant-profile': [
        { label: 'Tổng ứng viên', value: formatCount(rows.length) },
        { label: 'Đang phỏng vấn', value: formatCount(count((row) => String(row.status) === 'Phỏng vấn')) },
        { label: 'Thử việc / offer', value: formatCount(count((row) => ['Thử việc', 'Trúng tuyển'].includes(String(row.status)))) },
        { label: 'Đã nhận việc', value: formatCount(count((row) => String(row.status) === 'Trúng tuyển')) },
      ],
      'recruitment-tracking': [
        { label: 'Vị trí đang tuyển', value: formatCount(openJobs.length) },
        { label: 'Ngày mở TB', value: `${Math.round(average('daysOpen', openJobs))} ngày` },
        { label: 'Chi phí TB/vị trí', value: `${(average('cost', rows) / 1000000).toFixed(1)} tr` },
        { label: 'Tỷ lệ trúng tuyển', value: `${totalApplicants ? Math.round((hired / totalApplicants) * 100) : 0}%` },
      ],
    };

    return statsByModule[module.slug] ?? module.stats;
  }, [accessUsers, group.slug, module, rows]);

  return (
    <>
      <Helmet>
        <title>{`${module.name} | CMS - Quản trị LUXE Sofa`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Sofa2AdminLayout
        activeGroup={group.slug}
        activeModule={module.slug}
        breadcrumb={[group.name, module.name]}
        title={module.name}
        subtitle={module.description}
      >
        {group.slug === 'cms' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Dữ liệu CMS hiện lưu trên trình duyệt để đồng bộ tức thời với các component Sofa2 cùng thiết bị. Trạng thái nháp không hiển thị cho khách; nội dung xuất bản, menu, banner, SEO và trang tĩnh sẽ được website đọc từ cùng store localStorage này. Muốn vận hành nhiều thiết bị hoặc xuất bản an toàn cần API/CMS server-side.
          </Alert>
        )}
        {group.slug === 'catalog' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Danh mục, sản phẩm, biến thể, tồn kho và bảng giá đang lưu bằng localStorage trên trình duyệt này; thay đổi đồng bộ với cửa hàng khách hàng cùng trình duyệt. Đây là dữ liệu demo, chưa có API, đồng bộ nhiều thiết bị hay kiểm soát tồn kho giao dịch phía máy chủ.
          </Alert>
        )}
        {group.slug === 'access' && rowsLoading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Đang tải cấu hình phân quyền demo…
          </Alert>
        )}
        {group.slug === 'access' && rowsError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={retryRows}>
                Thử lại
              </Button>
            }
          >
            {rowsError}
          </Alert>
        )}
        {group.slug === 'access' && rowsSaving && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Đang lưu thay đổi phân quyền…
          </Alert>
        )}
        {group.slug === 'access' && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Phân quyền hiện lưu cục bộ trên trình duyệt để phục vụ demo, chưa kết nối API xác thực hoặc cơ sở dữ liệu bảo mật. Không dùng dữ liệu này để cấp quyền thật; email người dùng chưa được xác minh.
          </Alert>
        )}
        {group.slug === 'access' && module.slug === 'audit-log' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Nhật ký được tạo tự động khi thêm, sửa hoặc xoá người dùng, vai trò và quyền. Danh sách chỉ cho phép xem/xuất, giới hạn 500 sự kiện gần nhất; dữ liệu nhật ký demo có thể bị sửa từ trình duyệt và không thay thế audit log phía máy chủ.
          </Alert>
        )}
        {group.slug === 'access' && module.slug === 'permissions' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Ma trận quyền lưu cấu hình theo module, hành động và vai trò; hiện chưa được nối vào danh tính đăng nhập thật. Không dùng các dòng này để cấp quyền vận hành; hành động phê duyệt vẫn cần quy trình độc lập phía máy chủ.
          </Alert>
        )}
        {group.slug === 'dealer' && dealerLoading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Đang tải dữ liệu đại lý demo…
          </Alert>
        )}
        <Grid container spacing={3}>
          {dashboardStats.map((stat) => (
            <Grid key={stat.label} xs={6} md={3}>
              <Card sx={{ p: 2.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={1}>
                  <Typography variant="h4" sx={{ color: SURFACE }}>
                    {stat.value}
                  </Typography>
                  {stat.trend && (
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                      {stat.trend}
                    </Typography>
                  )}
                </Stack>
              </Card>
            </Grid>
          ))}

          {group.slug === 'dealer' && module.slug === 'dashboard' && (
            <Grid xs={12}>
              <Sofa2AdminDealerInsights moduleSlug={module.slug} rows={rows} />
            </Grid>
          )}

          {!hideClientLink && (
            <Grid xs={12}>
              <Card sx={{ p: 2.5 }}>
                <Stack
                  spacing={1.5}
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems={{ md: 'center' }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2">Trang tương ứng trên website</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {clientPath}
                    </Typography>
                  </Stack>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    component={RouterLink}
                    href={clientPath}
                    target="_blank"
                    startIcon={<Iconify icon="solar:eye-bold-duotone" />}
                  >
                    Xem trang khách hàng
                  </Button>
                </Stack>
              </Card>
            </Grid>
          )}

          {module.slug === 'seo' && (
            <Grid xs={12}>
              <Sofa2AdminSeoGenerator moduleSlug={module.slug} moduleName={module.name} />
            </Grid>
          )}

          <Grid xs={12}>
            <Card>
              <Tabs
                value={tab}
                onChange={(_, next) => {
                  setTab(next);
                  setPage(0);
                }}
                sx={{ px: 2.5, boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha('#919EAB', 0.08)}` }}
              >
                <Tab value="all" label={`Tất cả (${counts.all})`} />
                {statusOptions.map((s) => (
                  <Tab key={s} value={s} label={`${schema.valueLabel?.(s) ?? s} (${counts[s] ?? 0})`} />
                ))}
              </Tabs>

              <Stack
                spacing={2}
                sx={{ p: 2.5 }}
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ md: 'center' }}
              >
                <TextField
                  size="small"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  placeholder={`Tìm ${entity}...`}
                  sx={{ flex: 1, maxWidth: { md: 360 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" width={18} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {!!selected.length && !isAppendOnly && (
                    <>
                      {showStatusToggle && canPublish && (
                        <Button
                          size="small"
                          color="success"
                          variant="outlined"
                          onClick={bulkPublish}
                          startIcon={<Iconify icon="solar:cloud-upload-bold-duotone" />}
                        >
                          {publishLabel} ({selected.length})
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => setBulkConfirm(true)}
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold-duotone" />}
                        >
                          Xoá ({selected.length})
                        </Button>
                      )}
                    </>
                  )}
                  {isAdmin && group.slug !== 'hr' && group.slug !== 'access' && !isAppendOnly && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        resetRows(module.rows);
                        setSelected([]);
                        syncDealerModule().then((synced) =>
                          setToast(
                            synced
                              ? 'Đã khôi phục dữ liệu gốc.'
                              : 'Đã khôi phục dữ liệu trên trình duyệt demo.'
                          )
                        );
                      }}
                      startIcon={<Iconify icon="solar:refresh-bold-duotone" />}
                    >
                      Khôi phục
                    </Button>
                  )}
                  {canExport && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={exportCsv}
                      startIcon={<Iconify icon="solar:export-bold-duotone" />}
                    >
                      {isAppendOnly ? 'Xuất nhật ký CSV' : 'Xuất CSV'}
                    </Button>
                  )}
                  {!isAppendOnly && canCreate && (
                    <Button
                      size="small"
                      variant="contained"
                      color="inherit"
                      onClick={openCreate}
                      sx={{ bgcolor: SURFACE, '&:hover': { bgcolor: alpha(SURFACE, 0.85) } }}
                      startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                      {module.actions?.[0] ?? 'Thêm mới'}
                    </Button>
                  )}
                </Stack>
              </Stack>

              <TableContainer sx={{ borderTop: `1px solid ${alpha('#919EAB', 0.16)}` }}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      {!isAppendOnly && (canDelete || canPublish) && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={allOnPage}
                            disabled={!selectablePaged.length}
                            onChange={() =>
                              setSelected(allOnPage ? [] : selectablePaged.map(({ index }) => index))
                            }
                          />
                        </TableCell>
                      )}
                      {module.columns.map((col) => (
                        <TableCell key={col.key}>{col.label}</TableCell>
                      ))}
                        {showStatusToggle && canPublish && (
                          <TableCell align="center">{publishLabel}</TableCell>
                        )}
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paged.map(({ row, index }) => (
                      <TableRow key={index} hover selected={selected.includes(index)}>
                        {!isAppendOnly && (canDelete || canPublish) && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selected.includes(index)}
                              disabled={isProtectedAccessRole(row)}
                              onChange={() => toggleSelect(index)}
                            />
                          </TableCell>
                        )}
                        {module.columns.map((col) => {
                          const roleName = String(row.role ?? '').trim().toLocaleLowerCase();
                          const assignedCount = accessUsers.filter((user) =>
                            [user.role, ...String(user.extraRoles ?? '').split(',')].some(
                              (assigned) => String(assigned ?? '').trim().toLocaleLowerCase() === roleName
                            )
                          ).length;
                          const value =
                            group.slug === 'access' && module.slug === 'roles' && col.key === 'users'
                              ? assignedCount
                              : group.slug === 'catalog' && module.slug === 'categories' && col.key === 'products'
                                ? catalogProducts.filter((product) => String(product.category ?? '').toLowerCase() === String(row.name ?? '').toLowerCase()).length
                                : row[col.key] ?? '—';
                          return (
                            <TableCell key={col.key}>
                              {col.type === 'status' ? (
                                <Chip
                                  size="small"
                                  label={schema.valueLabel?.(String(value)) ?? String(value)}
                                  color={statusColor(String(value)) as any}
                                />
                              ) : col.key === 'cvUrl' && /^https?:\/\//i.test(String(value)) ? (
                                <Typography
                                  component="a"
                                  href={String(value)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  variant="body2"
                                  sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                >
                                  Mở CV / Portfolio
                                </Typography>
                              ) : (
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: col.key === titleKey ? 600 : 400 }}
                                >
                                  {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
                                </Typography>
                              )}
                            </TableCell>
                          );
                        })}
                        {showStatusToggle && canPublish && (
                          <TableCell align="center">
                            <Switch
                              size="small"
                              checked={String(row[statusKey]) === published}
                              onChange={() => togglePublish(index)}
                            />
                          </TableCell>
                        )}
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            {group.slug === 'cms' && (
                              <Tooltip title={
                                ['Đã xuất bản', 'Đang chạy', 'Tốt'].includes(String(row[statusKey]))
                                  ? 'Mở trang đã xuất bản trên website'
                                  : 'Chỉ có thể xem trước nội dung đã xuất bản'
                              }>
                                <IconButton
                                  size="small"
                                  disabled={!['Đã xuất bản', 'Đang chạy', 'Tốt'].includes(String(row[statusKey]))}
                                  component={RouterLink}
                                  href={
                                    module.slug === 'blog'
                                      ? `/sofa2/blog/${String(row.slug ?? '')}`
                                      : module.slug === 'static-pages'
                                        ? canonicalCmsSlug('static-pages', row.slug, row.title)
                                        : clientPath
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Iconify icon="solar:link-circle-bold-duotone" width={18} />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Xem chi tiết">
                              <IconButton size="small" onClick={() => setDetail(row)}>
                                <Iconify icon="solar:eye-bold-duotone" width={18} />
                              </IconButton>
                            </Tooltip>
                            {!isAppendOnly && !isSystemAccessRole(row) && (canEdit || canCreate || canDelete) && (
                              <>
                                {canEdit && (
                                  <Tooltip title="Sửa">
                                    <IconButton size="small" onClick={() => openEdit(index)}>
                                      <Iconify icon="solar:pen-bold-duotone" width={18} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {canCreate && (
                                  <Tooltip title="Nhân bản">
                                    <IconButton size="small" onClick={() => duplicateRow(index)}>
                                      <Iconify icon="solar:copy-bold-duotone" width={18} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {canDelete && !isProtectedAccessRole(row) && (
                                  <Tooltip title="Xoá">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => setConfirm({ open: true, index })}
                                    >
                                      <Iconify icon="solar:trash-bin-trash-bold-duotone" width={18} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!filtered.length && (
                      <TableRow>
                          <TableCell
                            colSpan={
                              module.columns.length +
                              Number(showStatusToggle && canPublish) +
                              1 +
                              Number(!isAppendOnly && (canDelete || canPublish))
                            }
                            align="center"
                            sx={{ py: 6 }}
                          >
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Chưa có {entity} nào phù hợp.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider />

              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, next) => setPage(next)}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                labelRowsPerPage="Số dòng:"
              />
            </Card>
          </Grid>
        </Grid>
      </Sofa2AdminLayout>

      {/* Form thêm / sửa chi tiết */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={form.open}
        onClose={() => setForm((prev) => ({ ...prev, open: false }))}
      >
        <DialogTitle>
          {form.mode === 'create'
            ? `Thêm ${entity} — ${module.name}`
            : `Chỉnh sửa ${entity} — ${module.name}`}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {(['content', 'display', 'seo'] as const).map((g) => {
              const list = groupedFields(g);
              if (!list.length) return null;
              return (
                <Stack key={g} spacing={2}>
                  <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                    {GROUP_LABEL[g]}
                  </Typography>
                  <Grid container spacing={2}>
                    {list.map((field) => (
                      <Grid
                        key={field.key}
                        xs={12}
                        md={field.type === 'textarea' || field.type === 'switch' ? 12 : 6}
                      >
                        {renderField(field)}
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setForm((prev) => ({ ...prev, open: false }))}>
            Huỷ
          </Button>
          {statusOptions.includes('Bản nháp') && (
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => {
                setValue(statusKey, 'Bản nháp');
                setTimeout(submitForm, 0);
              }}
            >
              Lưu nháp
            </Button>
          )}
          <Button
            variant="contained"
            color="inherit"
            onClick={submitForm}
            sx={{ bgcolor: SURFACE, '&:hover': { bgcolor: alpha(SURFACE, 0.85) } }}
          >
            {form.mode === 'create' ? 'Thêm mới' : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Xem chi tiết */}
      <Dialog fullWidth maxWidth="sm" open={!!detail} onClose={() => setDetail(null)}>
        <DialogTitle>{`Chi tiết ${entity}`}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {fields.map((field) => (
              <Stack key={field.key} direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {field.label}
                </Typography>
                <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                  {String(detail?.[field.key] ?? '—') || '—'}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setDetail(null)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Xác nhận xoá */}
      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, index: null })}>
        <DialogTitle>{`Xoá ${entity}?`}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {group.slug === 'dealer' && module.slug === 'dashboard'
              ? 'Hồ sơ sẽ bị xoá và quyền truy cập cổng đại lý bị thu hồi. Các báo giá, đơn hàng và công nợ đã lưu vẫn được giữ nhưng sẽ không còn liên kết với hồ sơ này. Khôi phục chỉ nạp lại dữ liệu mẫu ban đầu.'
              : `${linkedRecruitmentDeleteNote} Bản ghi sẽ bị xoá khỏi ${module.name.toLowerCase()}. Khôi phục chỉ nạp lại dữ liệu mẫu ban đầu, không hoàn tác bản ghi đã xoá.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setConfirm({ open: false, index: null })}>
            Huỷ
          </Button>
          <Button color="error" variant="contained" onClick={doDelete}>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>

      {/* Xác nhận xoá hàng loạt */}
      <Dialog open={bulkConfirm} onClose={() => setBulkConfirm(false)}>
        <DialogTitle>{`Xoá ${selected.length} ${entity}?`}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {group.slug === 'dealer' && module.slug === 'dashboard'
              ? `Bạn đang xoá ${selected.length} hồ sơ đại lý. Quyền truy cập cổng sẽ bị thu hồi; báo giá, đơn hàng và công nợ được giữ lại nhưng không còn liên kết với hồ sơ. Khôi phục chỉ nạp lại dữ liệu mẫu ban đầu.`
              : `${linkedRecruitmentDeleteNote} Các bản ghi đã chọn sẽ bị xoá khỏi ${module.name.toLowerCase()}. Khôi phục chỉ nạp lại dữ liệu mẫu ban đầu, không hoàn tác các bản ghi đã xoá.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setBulkConfirm(false)}>
            Huỷ
          </Button>
          <Button color="error" variant="contained" onClick={doBulkDelete}>
            Xoá {selected.length}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!toast}
        message={toast}
        autoHideDuration={2600}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
