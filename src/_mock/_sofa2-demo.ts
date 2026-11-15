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
  const profile = {
    dealer: session.name,
    level: 'Vàng',
    target: 300000000,
    achieved: 186000000,
  };

  return {
    profile,
    policies: [
      {
        recordId: 'DEMO-POLICY-GOLD',
        name: 'Chính sách đại lý Vàng - Demo',
        level: 'Vàng',
        discount: 30,
        minRevenue: 150000000,
        bonus: 3,
        paymentTerm: 30,
        terms: 'Dữ liệu minh họa lưu trên thiết bị hiện tại.',
        startDate: '01/01/2026',
        endDate: '31/12/2026',
      },
    ],
    quotes: getSavedQuotes().filter(
      (quote) => quote.kind === 'dealer' && quote.dealerEmail === session.email
    ),
    orders: [
      {
        recordId: 'DEMO-ORDER-001',
        code: 'LX-DH-26001',
        products: 'Sofa Oslo 3 Chỗ × 4',
        orderDate: '15/10/2026',
        deliveryDate: '30/10/2026',
        total: 58000000,
        status: 'Đang xử lý',
      },
    ],
    debts: [
      {
        recordId: 'DEMO-DEBT-001',
        invoices: 'INV-DEMO-001',
        limit: 100000000,
        balance: 18000000,
        paid: 42000000,
        dueDate: '15/11/2026',
        status: 'Trong hạn',
      },
    ],
    documents: [
      {
        recordId: 'DEMO-DOC-001',
        title: 'Catalogue LUXE Sofa',
        type: 'Catalogue',
        description: 'Tài liệu giới thiệu bộ sưu tập sofa.',
        fileUrl: '',
      },
      {
        recordId: 'DEMO-DOC-002',
        title: 'Bảng giá đại lý',
        type: 'Bảng giá',
        description: 'Bảng giá minh họa dành cho tài khoản demo.',
        fileUrl: '',
      },
    ],
  };
}
