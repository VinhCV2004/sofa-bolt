import { useMemo } from 'react';

import { type AdminRow, useSofa2AdminRows } from 'src/sections/sofa2-admin/sofa2-admin-store';

import { SOFA2_PRODUCTS, SOFA2_PRODUCT_CATEGORIES } from './sofa2-pages-data';

export type Sofa2CatalogProduct = (typeof SOFA2_PRODUCTS)[number] & {
  sku: string;
  status: string;
  stock: number;
  available: boolean;
  variants: AdminRow[];
  metaTitle: string;
  metaDescription: string;
  indexable: boolean;
  images360: string[];
  videoUrl: string;
  videoCaption: string;
  frameMaterial: string;
  upholstery: string;
  cushion: string;
  weightKg: number;
  seatCount: number;
  features: string[];
  assembly: string;
  included: string;
  usageInstructions: string;
  careGuide: string;
  warrantyText: string;
  relatedProductIds: string[];
};

type CatalogCategory = {
  slug: string;
  label: string;
  metaTitle?: string;
  metaDescription?: string;
  indexable?: boolean;
};
type CatalogCategories = Record<'types' | 'styles' | 'spaces' | 'sizes' | 'prices', CatalogCategory[]>;

const slugify = (value: unknown) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const activeProduct = (row: AdminRow) => !['Bản nháp', 'Ngừng bán', 'Ẩn'].includes(String(row.status ?? ''));
const activePrice = (row: AdminRow) => {
  if (['Hết hiệu lực', 'Chờ bắt đầu'].includes(String(row.status ?? ''))) return false;
  const today = new Date().toISOString().slice(0, 10);
  const start = String(row.startDate ?? '').slice(0, 10);
  const end = String(row.endDate ?? '').slice(0, 10);
  return (!start || start <= today) && (!end || end >= today);
};
const enabled = (value: unknown) => !['không', 'false', '0'].includes(String(value ?? '').trim().toLowerCase());

const mapCategoryGroup = (parent: unknown): keyof CatalogCategories => {
  const value = String(parent ?? '').toLowerCase();
  if (value.includes('phong cách')) return 'styles';
  if (value.includes('không gian')) return 'spaces';
  if (value.includes('kích thước')) return 'sizes';
  if (value.includes('khoảng giá')) return 'prices';
  return 'types';
};

export function useSofa2CatalogCategories(): CatalogCategories {
  const { rows } = useSofa2AdminRows('catalog', 'categories');
  return useMemo(() => {
    const source: CatalogCategories = {
      types: SOFA2_PRODUCT_CATEGORIES.types,
      styles: SOFA2_PRODUCT_CATEGORIES.styles,
      spaces: SOFA2_PRODUCT_CATEGORIES.spaces,
      sizes: SOFA2_PRODUCT_CATEGORIES.sizes,
      prices: SOFA2_PRODUCT_CATEGORIES.prices,
    };
    const configuredRow = (category: CatalogCategory, group: keyof CatalogCategories) =>
      rows.find((row) => mapCategoryGroup(row.parent) === group && (
        String(row.slug ?? '').trim() === category.slug
        || String(row.name ?? '').trim().toLowerCase() === category.label.toLowerCase()
      ));
    const result = Object.fromEntries(
      (Object.keys(source) as (keyof CatalogCategories)[]).map((group) => [group,
        source[group].flatMap((category) => {
          const row = configuredRow(category, group);
          if (row && (row.status === 'Ẩn' || !enabled(row.showInFilter))) return [];
          return [{
            ...category,
            ...(row ? {
              slug: String(row.slug ?? category.slug),
              label: String(row.name ?? category.label),
              metaTitle: String(row.metaTitle ?? ''),
              metaDescription: String(row.metaDescription ?? row.description ?? ''),
              indexable: enabled(row.indexable),
            } : {}),
          }];
        }),
      ])
    ) as CatalogCategories;

    rows
      .filter((row) => row.status !== 'Ẩn' && enabled(row.showInFilter))
      .forEach((row) => {
        const group = mapCategoryGroup(row.parent);
        const label = String(row.name ?? '').trim();
        if (!label) return;
        const slug = String(row.slug ?? '').trim() || slugify(label);
        if (!result[group].some((item) => item.slug === slug || item.label.toLowerCase() === label.toLowerCase())) {
          result[group].push({
            slug,
            label,
            metaTitle: String(row.metaTitle ?? ''),
            metaDescription: String(row.metaDescription ?? row.description ?? ''),
            indexable: enabled(row.indexable),
          });
        }
      });
    (Object.keys(result) as (keyof CatalogCategories)[]).forEach((group) => {
      result[group].sort((a, b) => {
        const aOrder = Number(rows.find((row) => String(row.slug ?? '') === a.slug)?.order ?? 0) || Number.MAX_SAFE_INTEGER;
        const bOrder = Number(rows.find((row) => String(row.slug ?? '') === b.slug)?.order ?? 0) || Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
      });
    });
    return result;
  }, [rows]);
}

function toClientProduct(
  row: AdminRow,
  index: number,
  variants: AdminRow[],
  inventory: AdminRow[],
  pricing: AdminRow[],
  categories: AdminRow[]
): Sofa2CatalogProduct {
  const fallback = SOFA2_PRODUCTS.find(
    (product) => product.id === String(row.id ?? '') || product.name === String(row.name ?? '')
  ) ?? SOFA2_PRODUCTS[index % SOFA2_PRODUCTS.length];
  const sku = String(row.sku ?? '');
  const categoryName = String(row.category ?? fallback.category);
  const matchedCategory = categories.find((item) => {
    const parent = String(item.parent ?? '').toLowerCase();
    const isProductType = !['phong cách', 'không gian', 'kích thước', 'khoảng giá'].some((label) => parent.includes(label));
    return isProductType && String(item.name ?? '').trim().toLowerCase() === categoryName.trim().toLowerCase();
  });
  const typeByLabel = SOFA2_PRODUCT_CATEGORIES.types.find((item) =>
    item.label.toLowerCase() === categoryName.toLowerCase() || item.slug === categoryName
  );
  const category = String(matchedCategory?.slug ?? typeByLabel?.slug ?? slugify(categoryName));
  const styleName = String(row.style ?? fallback.style);
  const matchedStyle = categories.find((item) =>
    String(item.name ?? '').trim().toLowerCase() === styleName.trim().toLowerCase()
    && String(item.parent ?? '').toLowerCase().includes('phong cách')
  );
  const styleByLabel = SOFA2_PRODUCT_CATEGORIES.styles.find((item) =>
    item.label.toLowerCase() === styleName.toLowerCase() || item.slug === styleName
  );
  const style = String(matchedStyle?.slug ?? styleByLabel?.slug ?? slugify(styleName));
  const rawVariants = variants.filter((variant) =>
    String(variant.status ?? '') !== 'Ngừng bán'
    && (String(variant.product ?? '').trim().toLowerCase() === String(row.name ?? '').trim().toLowerCase()
      || String(variant.product ?? '').trim().toLowerCase() === sku.toLowerCase())
  );
  const linkedVariants: AdminRow[] = rawVariants.map((variant) => {
    const variantSku = String(variant.sku ?? '');
    const stockRows = inventory.filter((entry) => String(entry.sku ?? '').toLowerCase() === variantSku.toLowerCase());
    const variantPricing = pricing.find((entry) => String(entry.sku ?? '').toLowerCase() === variantSku.toLowerCase() && activePrice(entry));
    return {
      ...variant,
      stock: stockRows.length
        ? stockRows.reduce((sum, entry) => sum + Math.max(0, Number(entry.stock ?? 0) - Number(entry.reserved ?? 0)), 0)
        : Number(variant.stock ?? 0),
      price: Number(variantPricing?.sale ?? variant.price ?? row.price ?? fallback.price),
      image: String(variant.image ?? row.image ?? fallback.image),
    };
  });
  const inventoryRows = inventory.filter((entry) =>
    [sku, ...linkedVariants.map((variant) => String(variant.sku ?? ''))].includes(String(entry.sku ?? ''))
  );
  const stock = inventoryRows.length
    ? inventoryRows.reduce((sum, entry) => sum + Math.max(0, Number(entry.stock ?? 0) - Number(entry.reserved ?? 0)), 0)
    : linkedVariants.length
      ? linkedVariants.reduce((sum, variant) => sum + Math.max(0, Number(variant.stock ?? 0)), 0)
      : Number(row.stock ?? 0);
  const priceRow = pricing.find((item) => String(item.sku ?? '').toLowerCase() === sku.toLowerCase() && activePrice(item));
  const regularPrice = Number(priceRow?.list ?? row.compareAt ?? fallback.oldPrice ?? row.price ?? fallback.price);
  const salePrice = Number(priceRow?.sale ?? row.price ?? fallback.price);
  const image = String(row.image ?? fallback.image);
  const gallery = String(row.gallery ?? '').split(/[\r\n,]+/).map((item) => item.trim()).filter(Boolean);
  const colors = linkedVariants.length
    ? Array.from(new Set(linkedVariants.map((variant) => String(variant.option ?? '').split('/')[1]?.trim()).filter(Boolean)))
    : fallback.colors;
  const status = String(row.status ?? 'Đang bán');
  const rawSpace = String(row.space ?? '').trim();
  const matchedSpace = categories.find((item) =>
    String(item.name ?? '').trim().toLowerCase() === rawSpace.toLowerCase()
    && String(item.parent ?? '').toLowerCase().includes('không gian')
  );
  const spaceMatch = SOFA2_PRODUCT_CATEGORIES.spaces.find((item) =>
    item.label.toLowerCase() === rawSpace.toLowerCase() || item.slug === rawSpace
  );
  const description = String(row.description ?? fallback.description);

  return {
    ...fallback,
    id: String(row.id ?? sku ?? fallback.id),
    name: String(row.name ?? fallback.name),
    slug: String(row.slug ?? fallback.slug ?? slugify(row.name)),
    category,
    style,
    price: salePrice,
    oldPrice: regularPrice > salePrice ? regularPrice : undefined,
    image,
    images: gallery.length ? gallery : [image],
    images360: String(row.images360 ?? '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
    videoUrl: String(row.videoUrl ?? ''),
    videoCaption: String(row.videoCaption ?? ''),
    frameMaterial: String(row.frameMaterial ?? ''),
    upholstery: String(row.upholstery ?? ''),
    cushion: String(row.cushion ?? ''),
    weightKg: Number(row.weightKg ?? 0),
    seatCount: Number(row.seatCount ?? 0),
    features: String(row.features ?? '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
    assembly: String(row.assembly ?? ''),
    included: String(row.included ?? ''),
    usageInstructions: String(row.usageInstructions ?? ''),
    careGuide: String(row.careGuide ?? ''),
    warrantyText: String(row.warrantyText ?? ''),
    relatedProductIds: String(row.relatedProductIds ?? '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
    material: String(row.material ?? fallback.material),
    size: String(row.dimensions ?? fallback.size),
    colors: String(row.colors ?? '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean).length
      ? String(row.colors).split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
      : colors.length ? colors : fallback.colors,
    badge: status === 'Hết hàng' || stock <= 0
      ? 'Hết hàng'
      : regularPrice > salePrice
        ? `-${Math.round((1 - salePrice / regularPrice) * 100)}%`
        : String(row.isNew) === 'Có'
          ? 'Mới'
          : fallback.badge?.startsWith('-') ? undefined : fallback.badge,
    description,
    sku,
    status,
    stock,
    available: activeProduct(row) && status !== 'Hết hàng' && stock > 0,
    variants: linkedVariants,
    metaTitle: String(row.metaTitle ?? ''),
    metaDescription: String(row.metaDescription ?? row.shortDescription ?? description),
    indexable: !['không', 'false', '0'].includes(String(row.indexable ?? 'Có').toLowerCase()),
    ...(matchedSpace ? { space: String(matchedSpace.slug ?? slugify(rawSpace)) } : spaceMatch ? { space: spaceMatch.slug } : rawSpace ? { space: slugify(rawSpace) } : {}),
  } as Sofa2CatalogProduct;
}

export function useSofa2CatalogProducts() {
  const productsState = useSofa2AdminRows('catalog', 'products');
  const variantsState = useSofa2AdminRows('catalog', 'variants');
  const inventoryState = useSofa2AdminRows('catalog', 'inventory');
  const pricingState = useSofa2AdminRows('catalog', 'pricing');
  const categoriesState = useSofa2AdminRows('catalog', 'categories');

  const products = useMemo(() => productsState.rows
    .filter(activeProduct)
    .map((row, index) => toClientProduct(
      row,
      index,
      variantsState.rows,
      inventoryState.rows,
      pricingState.rows,
      categoriesState.rows
    )), [productsState.rows, variantsState.rows, inventoryState.rows, pricingState.rows, categoriesState.rows]);

  return { products, loading: productsState.loading };
}

export function findSofa2CatalogProduct(products: Sofa2CatalogProduct[], key: string) {
  return products.find((product) => product.id === key || product.slug === key) ?? null;
}

export function filterSofa2CatalogProducts(
  products: Sofa2CatalogProduct[],
  categories: CatalogCategories,
  slug: string
) {
  const group = (Object.keys(categories) as (keyof CatalogCategories)[]).find((key) =>
    categories[key].some((item) => item.slug === slug)
  );
  if (!group) return [];
  if (group === 'prices') {
    if (slug === 'duoi-10-trieu') return products.filter((product) => product.price < 10_000_000);
    if (slug === '10-20-trieu') return products.filter((product) => product.price >= 10_000_000 && product.price < 20_000_000);
    if (slug === '20-50-trieu') return products.filter((product) => product.price >= 20_000_000 && product.price < 50_000_000);
    return products.filter((product) => product.price >= 50_000_000);
  }
  return products.filter((product) => {
    if (group === 'sizes') {
      const longSide = Number(String(product.size).match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
      if (slug === 'sofa-nho') return longSide > 0 && longSide <= 140;
      if (slug === 'sofa-trung') return longSide > 140 && longSide <= 220;
      if (slug === 'sofa-lon') return longSide > 220;
      return slugify(product.size) === slug;
    }
    const candidate = group === 'types'
      ? product.category
      : group === 'styles'
        ? product.style
        : String((product as any).space ?? '');
    return candidate === slug;
  });
}
