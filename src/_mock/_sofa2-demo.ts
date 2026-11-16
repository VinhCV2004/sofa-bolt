import { getSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';
import { isSofa2DealerPolicyVisible } from 'src/sections/sofa2-admin/sofa2-dealer';

export type Sofa2DemoRole = 'admin' | 'dealer';

export type Sofa2DemoSession = {
  role: Sofa2DemoRole;
  email: string;
  name: string;
};

export type Sofa2DealerPortalData = {
  profile: Record<string, unknown>;
  policies: Record<string, unknown>[];
  quotes: Record<string, unknown>[];
  orders: Record<string, unknown>[];
  debts: Record<string, unknown>[];
  documents: Record<string, unknown>[];
};

const SESSION_KEY = 'sofa2-demo-session-v1';
const QUOTES_KEY = 'sofa2-demo-quotes-v1';

export function getSofa2DemoSession(): Sofa2DemoSession | null {
  if (typeof window === 'undefined') return null;

  const saved = window.localStorage.getItem(SESSION_KEY);
  if (!saved) return null;

  try {
    const session = JSON.parse(saved) as Partial<Sofa2DemoSession>;
    if (
      (session.role !== 'admin' && session.role !== 'dealer') ||
      typeof session.email !== 'string' ||
      typeof session.name !== 'string'
    ) {
      return null;
    }
    return session as Sofa2DemoSession;
  } catch {
    return null;
  }
}

export function setSofa2DemoSession(role: Sofa2DemoRole, email: string) {
  const normalizedEmail = email.trim() || (role === 'admin' ? 'admin@luxe-sofa.demo' : 'dealer@luxe-sofa.demo');
  const session: Sofa2DemoSession = {
    role,
    email: normalizedEmail,
    name: role === 'admin' ? 'Quản trị viên demo' : 'Đại lý demo LUXE',
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSofa2DemoSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getSofa2DemoAdminSession() {
  const session = getSofa2DemoSession();
  return session?.role === 'admin'
    ? { role: 'admin' as const, email: session.email, name: session.name }
    : null;
}

function getSavedQuotes() {
  if (typeof window === 'undefined') return [];
  const saved = window.localStorage.getItem(QUOTES_KEY);
  if (!saved) return [];

  try {
    const quotes = JSON.parse(saved) as unknown;
    return Array.isArray(quotes)
      ? quotes.filter(
          (quote): quote is Record<string, unknown> =>
            !!quote && typeof quote === 'object' && !Array.isArray(quote)
        )
      : [];
  } catch {
    return [];
  }
}

export function createSofa2MockQuote(
  details: Record<string, unknown>,
  kind: 'project' | 'dealer',
  dealerEmail = ''
) {
  const code = `LXQ-${Date.now()}`;
  const quote = {
    ...details,
    recordId: code,
    code,
    kind,
    dealerEmail,
    value: 0,
    status: 'Đã tiếp nhận',
    validUntil: 'Đang xử lý',
    submittedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(QUOTES_KEY, JSON.stringify([quote, ...getSavedQuotes()]));
  }

  return quote;
}

export function getSofa2DealerPortalData(session: Sofa2DemoSession): Sofa2DealerPortalData {
  const profile = getSofa2AdminRows('dealer', 'dashboard').find((row) =>
    String(row.email ?? '').trim().toLowerCase() === session.email.trim().toLowerCase() &&
    ['có', 'true', '1', 'yes'].includes(String(row.portalAccess ?? '').trim().toLowerCase()) &&
    String(row.status ?? '') !== 'Tạm ngưng'
  ) ?? {};
  const dealerId = String(profile.dealerId ?? '');
  const dealerName = String(profile.dealer ?? '');
  const related = (module: string) => getSofa2AdminRows('dealer', module).filter((row) => {
    if (dealerId && String(row.dealerId ?? '')) return String(row.dealerId) === dealerId;
    return String(row.dealer ?? '').trim().toLowerCase() === dealerName.trim().toLowerCase();
  });
  const level = String(profile.level ?? '');
  const rank = ['Đồng', 'Bạc', 'Vàng', 'Kim cương'].indexOf(level);
  const documents = getSofa2AdminRows('dealer', 'sales-docs').filter((row) => {
    if (String(row.status ?? '') !== 'Đã xuất bản') return false;
    const access = String(row.access ?? 'Tất cả đại lý');
    if (!access || access === 'Tất cả đại lý') return true;
    if (access === 'Đồng trở lên') return rank >= 0;
    if (access === 'Bạc trở lên') return rank >= 1;
    if (access === 'Vàng trở lên') return rank >= 2;
    if (access === 'Chỉ Kim cương') return rank === 3;
    return false;
  });

  return {
    profile,
    policies: getSofa2AdminRows('dealer', 'price-policy').filter((row) =>
      isSofa2DealerPolicyVisible(row) && ['Tất cả', level].includes(String(row.level ?? ''))
    ),
    quotes: related('quotes'),
    orders: related('dealer-orders'),
    debts: related('debts'),
    documents,
  };
}
