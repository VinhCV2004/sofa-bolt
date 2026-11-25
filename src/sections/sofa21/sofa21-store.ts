export type Sofa21CartLine = {
  slug: string;
  quantity: number;
  color: string;
};

const CART_KEY = 'sofa21.cart.v1';
const WISHLIST_KEY = 'sofa21.wishlist.v1';
const COMPARE_KEY = 'sofa21.compare.v1';
const CART_EVENT = 'sofa21-cart-updated';
const LIST_EVENT = 'sofa21-list-updated';

function readStringList(key: string): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function writeStringList(key: string, values: string[]): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(key, JSON.stringify([...new Set(values)]));
    window.dispatchEvent(new Event(LIST_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function getSofa21Cart(): Sofa21CartLine[] {
  if (typeof window === 'undefined') return [];

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(value)) return [];

    return value.filter(
      (item): item is Sofa21CartLine =>
        typeof item?.slug === 'string' &&
        typeof item?.quantity === 'number' &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0 &&
        typeof item?.color === 'string'
    );
  } catch {
    return [];
  }
}

export function saveSofa21Cart(lines: Sofa21CartLine[]): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
    window.dispatchEvent(new Event(CART_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function addSofa21CartLine(slug: string, color: string, quantity = 1): boolean {
  const lines = getSofa21Cart();
  const existing = lines.find((line) => line.slug === slug && line.color === color);

  if (existing) {
    existing.quantity += quantity;
  } else {
    lines.push({ slug, color, quantity });
  }

  return saveSofa21Cart(lines);
}

export function updateSofa21CartLine(
  slug: string,
  color: string,
  quantity: number
): boolean {
  const lines = getSofa21Cart()
    .map((line) =>
      line.slug === slug && line.color === color ? { ...line, quantity } : line
    )
    .filter((line) => line.quantity > 0);

  return saveSofa21Cart(lines);
}

export function removeSofa21CartLine(slug: string, color: string): boolean {
  return saveSofa21Cart(
    getSofa21Cart().filter((line) => line.slug !== slug || line.color !== color)
  );
}

export function getSofa21CartCount(): number {
  return getSofa21Cart().reduce((total, line) => total + line.quantity, 0);
}

export function subscribeSofa21Cart(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  window.addEventListener(CART_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function getSofa21Wishlist(): string[] {
  return readStringList(WISHLIST_KEY);
}

export function toggleSofa21Wishlist(slug: string): boolean {
  const wishlist = getSofa21Wishlist();
  return writeStringList(
    WISHLIST_KEY,
    wishlist.includes(slug) ? wishlist.filter((item) => item !== slug) : [...wishlist, slug]
  );
}

export function subscribeSofa21Lists(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  window.addEventListener(LIST_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(LIST_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function getSofa21CompareList(): string[] {
  return readStringList(COMPARE_KEY);
}

export function setSofa21CompareList(slugs: string[]): boolean {
  return writeStringList(COMPARE_KEY, slugs.slice(0, 3));
}
