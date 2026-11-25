import { useMemo, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { SOFA21_COLORS, SOFA21_PRODUCTS, type Sofa21Product } from './sofa21-data';
import {
  type Sofa21CartLine,
  updateSofa21CartLine,
  toggleSofa21Wishlist,
  subscribeSofa21Lists,
  subscribeSofa21Cart,
  setSofa21CompareList,
  removeSofa21CartLine,
  getSofa21Wishlist,
  getSofa21CompareList,
  getSofa21Cart,
  addSofa21CartLine,
} from './sofa21-store';

type Feedback = { severity: 'success' | 'error' | 'info'; message: string } | null;

const paperSx = {
  bgcolor: SOFA21_COLORS.paper,
  border: `1px solid ${SOFA21_COLORS.line}`,
  boxShadow: 'none',
};

function money(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function categoryFromPath(pathname: string) {
  if (pathname.includes('sofa-goc')) return 'goc';
  if (pathname.includes('sofa-vang')) return 'vang';
  if (pathname.includes('sofa-thu-gian')) return 'thu-gian';
  return 'all';
}

function styleFromPath(pathname: string) {
  if (pathname.includes('hien-dai')) return 'Hiện đại';
  if (pathname.includes('bac-au')) return 'Bắc Âu';
  if (pathname.includes('luxury')) return 'Luxury';
  if (pathname.includes('minimalist')) return 'Minimalist';
  return 'all';
}

function spaceFromPath(pathname: string) {
  const spaces = ['Căn hộ', 'Nhà phố', 'Biệt thự', 'Văn phòng', 'Khách sạn', 'Resort', 'Nhà hàng', 'Cafe'];
  return spaces.find((item) =>
    pathname.includes(
      item
        .toLocaleLowerCase('vi')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replaceAll(' ', '-')
    )
  ) || 'all';
}

function sizeFromPath(pathname: string) {
  if (pathname.includes('sofa-nho')) return 'small';
  if (pathname.includes('sofa-trung')) return 'medium';
  if (pathname.includes('sofa-lon')) return 'large';
  return 'all';
}

function priceFromPath(pathname: string) {
  if (pathname.includes('duoi-10-trieu')) return 'under-10';
  if (pathname.includes('10-20-trieu')) return '10-20';
  if (pathname.includes('20-50-trieu')) return '20-50';
  if (pathname.includes('tren-50-trieu')) return 'over-50';
  return 'all';
}

function ProductCard({
  product,
  wishlist,
  compareList,
  onWishlist,
  onCompare,
  showCompare = true,
}: {
  product: Sofa21Product;
  wishlist: string[];
  compareList: string[];
  onWishlist: (slug: string) => void;
  onCompare: (slug: string) => void;
  showCompare?: boolean;
}) {
  const saved = wishlist.includes(product.slug);
  const comparing = compareList.includes(product.slug);

  return (
    <Card sx={{ ...paperSx, height: 1, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: SOFA21_COLORS.cream }}>
        <Box
          component={RouterLink}
          href={`/sofa21/products/item/${product.slug}`}
          sx={{ display: 'block', lineHeight: 0 }}
        >
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            loading="lazy"
            sx={{
              width: 1,
              height: { xs: 260, md: 330 },
              objectFit: 'cover',
              transition: 'transform .45s',
              '&:hover': { transform: 'scale(1.035)' },
            }}
          />
        </Box>
        <Chip
          label={product.tag}
          size="small"
          sx={{
            position: 'absolute',
            top: 14,
            left: 14,
            bgcolor: SOFA21_COLORS.paper,
            color: SOFA21_COLORS.ink,
            fontWeight: 700,
          }}
        />
        <IconButton
          aria-label={saved ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
          onClick={() => onWishlist(product.slug)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(253,251,247,.94)',
            color: saved ? SOFA21_COLORS.persimmon : SOFA21_COLORS.ink,
            '&:hover': { bgcolor: 'common.white' },
          }}
        >
          <Iconify icon={saved ? 'solar:heart-bold' : 'solar:heart-linear'} />
        </IconButton>
      </Box>

      <Stack spacing={1.2} sx={{ p: 2.2 }}>
        <Typography variant="caption" sx={{ color: SOFA21_COLORS.inkSoft, letterSpacing: 1 }}>
          {product.category}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
          <Typography
            component={RouterLink}
            href={`/sofa21/products/item/${product.slug}`}
            variant="h6"
            sx={{ color: SOFA21_COLORS.ink, fontWeight: 800, textDecoration: 'none' }}
          >
            {product.name}
          </Typography>
          <Typography sx={{ color: SOFA21_COLORS.persimmonDeep, fontWeight: 800, whiteSpace: 'nowrap' }}>
            {product.price}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: SOFA21_COLORS.inkSoft, lineHeight: 1.65 }}>
          {product.dimensions}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Stack direction="row" spacing={0.7} alignItems="center">
            {product.swatches.map((color) => (
              <Box
                key={color}
                title={color}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: color,
                  border: '1px solid rgba(0,0,0,.16)',
                }}
              />
            ))}
            <Typography variant="caption" sx={{ color: SOFA21_COLORS.inkSoft, ml: 0.5 }}>
              {product.swatches.length} màu gợi ý
            </Typography>
          </Stack>
          {showCompare && (
            <Button
              size="small"
              onClick={() => onCompare(product.slug)}
              color={comparing ? 'primary' : 'inherit'}
              sx={{ minWidth: 0, color: comparing ? SOFA21_COLORS.persimmonDeep : SOFA21_COLORS.inkSoft }}
            >
              {comparing ? 'Đã chọn' : 'So sánh'}
            </Button>
          )}
        </Stack>
        <Button
          component={RouterLink}
          href={`/sofa21/products/item/${product.slug}`}
          variant="contained"
          endIcon={<Iconify icon="solar:arrow-right-linear" />}
          sx={{
            mt: 0.5,
            bgcolor: SOFA21_COLORS.midnight,
            color: 'common.white',
            '&:hover': { bgcolor: SOFA21_COLORS.persimmonDeep },
          }}
        >
          Xem chi tiết
        </Button>
      </Stack>
    </Card>
  );
}

export function Sofa21Catalog({ pathname = '/sofa21/products' }: { pathname?: string }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(() => categoryFromPath(pathname));
  const [style, setStyle] = useState(() => styleFromPath(pathname));
  const [space, setSpace] = useState(() => spaceFromPath(pathname));
  const [size, setSize] = useState(() => sizeFromPath(pathname));
  const [priceBand, setPriceBand] = useState(() => priceFromPath(pathname));
  const [sort, setSort] = useState('featured');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    setWishlist(getSofa21Wishlist());
    setCompareList(getSofa21CompareList());
  }, []);

  const products = useMemo(() => {
    const normalizedSearch = normalizeSearchText(search.trim());
    const filtered = SOFA21_PRODUCTS.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        normalizeSearchText(`${product.name} ${product.category} ${product.material}`).includes(
          normalizedSearch
        );
      const matchesCategory = category === 'all' || product.categorySlug === category;
      const matchesStyle = style === 'all' || product.styles.includes(style);
      const matchesSpace = space === 'all' || product.spaces.includes(space);
      const matchesSize = size === 'all' || product.size === size;
      const matchesPrice =
        priceBand === 'all' ||
        (priceBand === 'under-10' && product.priceValue < 10000000) ||
        (priceBand === '10-20' &&
          product.priceValue >= 10000000 &&
          product.priceValue < 20000000) ||
        (priceBand === '20-50' &&
          product.priceValue >= 20000000 &&
          product.priceValue <= 50000000) ||
        (priceBand === 'over-50' && product.priceValue > 50000000);

      return matchesSearch && matchesCategory && matchesStyle && matchesSpace && matchesSize && matchesPrice;
    });

    if (sort === 'price-low') return filtered.sort((a, b) => a.priceValue - b.priceValue);
    if (sort === 'price-high') return filtered.sort((a, b) => b.priceValue - a.priceValue);
    return filtered;
  }, [category, priceBand, search, size, sort, space, style]);

  const handleWishlist = (slug: string) => {
    if (!toggleSofa21Wishlist(slug)) {
      setFeedback({ severity: 'error', message: 'Trình duyệt không thể lưu danh sách yêu thích.' });
      return;
    }
    setWishlist(getSofa21Wishlist());
    setFeedback(null);
  };

  const handleCompare = (slug: string) => {
    const next = compareList.includes(slug)
      ? compareList.filter((item) => item !== slug)
      : [...compareList, slug];

    if (next.length > 3) {
      setFeedback({ severity: 'info', message: 'Bạn chỉ có thể so sánh tối đa 3 sản phẩm.' });
      return;
    }
    if (!setSofa21CompareList(next)) {
      setFeedback({ severity: 'error', message: 'Trình duyệt không thể lưu danh sách so sánh.' });
      return;
    }
    setCompareList(next);
    setFeedback(null);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setStyle('all');
    setSpace('all');
    setSize('all');
    setPriceBand('all');
    setSort('featured');
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ md: 'end' }}
        spacing={1.5}
      >
        <Box>
          <Typography variant="overline" sx={{ color: SOFA21_COLORS.persimmonDeep, letterSpacing: 2 }}>
            BỘ SƯU TẬP SOFA21
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-.04em' }}>
            Tìm chiếc sofa hợp nhà
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          href="/sofa21/compare"
          endIcon={<Iconify icon="solar:scale-linear" />}
          sx={{ color: SOFA21_COLORS.persimmonDeep }}
        >
          So sánh ({compareList.length}/3)
        </Button>
      </Stack>

      <Card sx={{ ...paperSx, p: { xs: 1.5, md: 2 }, borderRadius: 2 }}>
        <Grid container spacing={1.5}>
          <Grid xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Tìm theo tên hoặc chất liệu"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="solar:magnifer-linear" width={19} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid xs={6} md={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Kiểu sofa"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <MenuItem value="all">Tất cả kiểu</MenuItem>
              <MenuItem value="goc">Sofa góc</MenuItem>
              <MenuItem value="vang">Sofa văng</MenuItem>
              <MenuItem value="thu-gian">Ghế thư giãn</MenuItem>
            </TextField>
          </Grid>
          <Grid xs={6} md={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Phong cách"
              value={style}
              onChange={(event) => setStyle(event.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {['Hiện đại', 'Bắc Âu', 'Minimalist', 'Luxury'].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={6} md={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Khoảng giá"
              value={priceBand}
              onChange={(event) => setPriceBand(event.target.value)}
            >
              <MenuItem value="all">Mọi mức giá</MenuItem>
              <MenuItem value="under-10">Dưới 10 triệu</MenuItem>
              <MenuItem value="10-20">10–20 triệu</MenuItem>
              <MenuItem value="20-50">20–50 triệu</MenuItem>
              <MenuItem value="over-50">Trên 50 triệu</MenuItem>
            </TextField>
          </Grid>
          <Grid xs={6} md={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Không gian"
              value={space}
              onChange={(event) => setSpace(event.target.value)}
            >
              <MenuItem value="all">Mọi không gian</MenuItem>
              {['Căn hộ', 'Nhà phố', 'Biệt thự', 'Văn phòng'].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={6} md={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Kích thước"
              value={size}
              onChange={(event) => setSize(event.target.value)}
            >
              <MenuItem value="all">Mọi kích thước</MenuItem>
              <MenuItem value="small">Sofa nhỏ</MenuItem>
              <MenuItem value="medium">Sofa trung</MenuItem>
              <MenuItem value="large">Sofa lớn</MenuItem>
            </TextField>
          </Grid>
          <Grid xs={6} md={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Sắp xếp"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <MenuItem value="featured">Nổi bật</MenuItem>
              <MenuItem value="price-low">Giá thấp đến cao</MenuItem>
              <MenuItem value="price-high">Giá cao đến thấp</MenuItem>
            </TextField>
          </Grid>
          <Grid xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ color: SOFA21_COLORS.inkSoft }}>
                Hiển thị {products.length} / {SOFA21_PRODUCTS.length} mẫu trong bộ sưu tập
              </Typography>
              <Button size="small" onClick={clearFilters} sx={{ color: SOFA21_COLORS.persimmonDeep }}>
                Xóa bộ lọc
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      {feedback && (
        <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {products.length ? (
        <Grid container spacing={2.5}>
          {products.map((product) => (
            <Grid key={product.slug} xs={12} sm={6} md={4}>
              <ProductCard
                product={product}
                wishlist={wishlist}
                compareList={compareList}
                onWishlist={handleWishlist}
                onCompare={handleCompare}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ ...paperSx, p: 5, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Chưa có mẫu phù hợp
          </Typography>
          <Typography sx={{ mt: 1, color: SOFA21_COLORS.inkSoft }}>
            Thử đổi từ khóa hoặc nới bộ lọc để xem thêm sản phẩm.
          </Typography>
          <Button onClick={clearFilters} sx={{ mt: 2, color: SOFA21_COLORS.persimmonDeep }}>
            Xóa bộ lọc
          </Button>
        </Card>
      )}
    </Stack>
  );
}

export function Sofa21ProductDetail({ slug }: { slug: string }) {
  const product = SOFA21_PRODUCTS.find((item) => item.slug === slug);
  const [color, setColor] = useState(product?.swatches[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!product) return undefined;
    setColor(product.swatches[0] || '');
    setQuantity(1);
    setSaved(getSofa21Wishlist().includes(product.slug));
    return subscribeSofa21Lists(() => setSaved(getSofa21Wishlist().includes(product.slug)));
  }, [product]);

  if (!product) {
    return (
      <Alert severity="warning">
        Không tìm thấy sản phẩm này. Hãy quay lại{' '}
        <Button component={RouterLink} href="/sofa21/products" size="small">
          danh mục sản phẩm
        </Button>
        .
      </Alert>
    );
  }

  const addToCart = () => {
    if (!addSofa21CartLine(product.slug, color, quantity)) {
      setFeedback({ severity: 'error', message: 'Không thể lưu giỏ hàng trên trình duyệt này.' });
      return;
    }
    setFeedback({ severity: 'success', message: 'Đã thêm sản phẩm vào giỏ hàng trên thiết bị này.' });
  };

  const toggleWishlist = () => {
    if (!toggleSofa21Wishlist(product.slug)) {
      setFeedback({ severity: 'error', message: 'Không thể lưu danh sách yêu thích.' });
      return;
    }
    setSaved(getSofa21Wishlist().includes(product.slug));
  };

  return (
    <Grid container spacing={{ xs: 3, md: 5 }}>
      <Grid xs={12} md={6}>
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          sx={{
            width: 1,
            height: { xs: 340, md: 560 },
            objectFit: 'cover',
            borderRadius: 2,
            bgcolor: SOFA21_COLORS.cream,
          }}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Stack spacing={2.4}>
          <Chip label={product.tag} size="small" sx={{ alignSelf: 'flex-start', bgcolor: SOFA21_COLORS.butter }} />
          <Typography variant="overline" sx={{ color: SOFA21_COLORS.persimmonDeep, letterSpacing: 2 }}>
            {product.category}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 600, fontFamily: 'Georgia, serif', lineHeight: 1.1 }}>
            {product.name}
          </Typography>
          <Typography variant="h4" sx={{ color: SOFA21_COLORS.persimmonDeep, fontWeight: 800 }}>
            {product.price}
          </Typography>
          <Typography sx={{ color: SOFA21_COLORS.inkSoft, lineHeight: 1.8 }}>
            {product.description}
          </Typography>

          <Divider />
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>
              Chọn màu vải
            </Typography>
            <Stack direction="row" spacing={1}>
              {product.swatches.map((swatch) => (
                <IconButton
                  key={swatch}
                  aria-label={`Chọn màu ${swatch}`}
                  onClick={() => setColor(swatch)}
                  sx={{
                    p: 0.4,
                    border: color === swatch ? `2px solid ${SOFA21_COLORS.persimmon}` : '2px solid transparent',
                  }}
                >
                  <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: swatch }} />
                </IconButton>
              ))}
            </Stack>
          </Box>

          <Stack direction="row" alignItems="center" spacing={1.3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Số lượng
            </Typography>
            <Button
              aria-label="Giảm số lượng"
              variant="outlined"
              size="small"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              −
            </Button>
            <Typography sx={{ minWidth: 22, textAlign: 'center' }}>{quantity}</Typography>
            <Button
              aria-label="Tăng số lượng"
              variant="outlined"
              size="small"
              onClick={() => setQuantity((current) => current + 1)}
            >
              +
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
            <Button
              variant="contained"
              onClick={addToCart}
              startIcon={<Iconify icon="solar:cart-large-2-bold-duotone" />}
              sx={{ px: 3, bgcolor: SOFA21_COLORS.midnight, '&:hover': { bgcolor: SOFA21_COLORS.persimmonDeep } }}
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="outlined"
              onClick={toggleWishlist}
              startIcon={<Iconify icon={saved ? 'solar:heart-bold' : 'solar:heart-linear'} />}
            >
              {saved ? 'Đã yêu thích' : 'Lưu yêu thích'}
            </Button>
            <Button component={RouterLink} href="/sofa21/cart/items" variant="text">
              Xem giỏ hàng
            </Button>
          </Stack>

          {feedback && (
            <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>
              {feedback.message}
            </Alert>
          )}

          <Card sx={{ ...paperSx, p: 2.2, borderRadius: 2 }}>
            <Stack spacing={1.2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Thông tin sản phẩm
              </Typography>
              <Typography variant="body2">Kích thước: {product.dimensions}</Typography>
              <Typography variant="body2">Chất liệu: {product.material}</Typography>
              {product.highlights.map((highlight) => (
                <Stack key={highlight} direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:check-circle-bold" color={SOFA21_COLORS.forest} width={18} />
                  <Typography variant="body2">{highlight}</Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
          <Typography variant="caption" sx={{ color: SOFA21_COLORS.inkSoft }}>
            Màu sắc và giá trong bản xem thử mang tính tham khảo; xác nhận cấu hình cùng chuyên viên trước khi đặt.
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}

export function Sofa21Cart() {
  const [cart, setCart] = useState<Sofa21CartLine[]>([]);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    setCart(getSofa21Cart());
    return subscribeSofa21Cart(() => setCart(getSofa21Cart()));
  }, []);

  const lines = cart
    .map((line) => ({
      ...line,
      product: SOFA21_PRODUCTS.find((product) => product.slug === line.slug),
    }))
    .filter((line): line is Sofa21CartLine & { product: Sofa21Product } => Boolean(line.product));
  const total = lines.reduce((sum, line) => sum + line.product.priceValue * line.quantity, 0);

  const changeQuantity = (line: Sofa21CartLine, quantity: number) => {
    if (!updateSofa21CartLine(line.slug, line.color, quantity)) {
      setStorageError(true);
      return;
    }
    setCart(getSofa21Cart());
    setStorageError(false);
  };

  const removeLine = (line: Sofa21CartLine) => {
    if (!removeSofa21CartLine(line.slug, line.color)) {
      setStorageError(true);
      return;
    }
    setCart(getSofa21Cart());
    setStorageError(false);
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="overline" sx={{ color: SOFA21_COLORS.persimmonDeep, letterSpacing: 2 }}>
          GIỎ HÀNG CỦA BẠN
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-.04em' }}>
          Kiểm tra lựa chọn
        </Typography>
      </Box>

      <Alert severity="info">
        Giỏ hàng hiện được lưu trên trình duyệt này để xem thử. Chưa có hệ thống nhận đơn hoặc thanh toán trực tuyến phía máy chủ.
      </Alert>
      {storageError && (
        <Alert severity="error">Không thể cập nhật giỏ hàng. Hãy kiểm tra cài đặt lưu trữ của trình duyệt.</Alert>
      )}

      {!lines.length ? (
        <Card sx={{ ...paperSx, p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Giỏ hàng đang trống
          </Typography>
          <Typography sx={{ mt: 1, color: SOFA21_COLORS.inkSoft }}>
            Khám phá các mẫu sofa và thêm lựa chọn bạn yêu thích.
          </Typography>
          <Button component={RouterLink} href="/sofa21/products" variant="contained" sx={{ mt: 2.5 }}>
            Xem sản phẩm
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          <Grid xs={12} md={8}>
            <Stack spacing={1.5}>
              {lines.map((line) => (
                <Card key={`${line.slug}-${line.color}`} sx={{ ...paperSx, p: 2, borderRadius: 2 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <Box
                      component="img"
                      src={line.product.image}
                      alt={line.product.name}
                      sx={{ width: { xs: 1, sm: 130 }, height: 115, objectFit: 'cover', borderRadius: 1.5 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        component={RouterLink}
                        href={`/sofa21/products/item/${line.product.slug}`}
                        variant="h6"
                        sx={{ fontWeight: 800, color: SOFA21_COLORS.ink, textDecoration: 'none' }}
                      >
                        {line.product.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <Box sx={{ width: 15, height: 15, borderRadius: '50%', bgcolor: line.color, border: '1px solid #aaa' }} />
                        <Typography variant="body2" sx={{ color: SOFA21_COLORS.inkSoft }}>
                          Màu đã chọn: {line.color}
                        </Typography>
                      </Stack>
                      <Typography sx={{ mt: 0.5, color: SOFA21_COLORS.persimmonDeep, fontWeight: 800 }}>
                        {line.product.price}
                      </Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconButton aria-label="Giảm số lượng" onClick={() => changeQuantity(line, line.quantity - 1)}>
                        <Iconify icon="solar:minus-circle-linear" />
                      </IconButton>
                      <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{line.quantity}</Typography>
                      <IconButton aria-label="Tăng số lượng" onClick={() => changeQuantity(line, line.quantity + 1)}>
                        <Iconify icon="solar:add-circle-linear" />
                      </IconButton>
                      <IconButton aria-label="Xóa sản phẩm" onClick={() => removeLine(line)}>
                        <Iconify icon="solar:trash-bin-trash-linear" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Grid>
          <Grid xs={12} md={4}>
            <Card sx={{ ...paperSx, p: 2.5, borderRadius: 2 }}>
              <Stack spacing={1.8}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Tạm tính
                </Typography>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Số lượng</Typography>
                  <Typography variant="body2">{lines.reduce((sum, line) => sum + line.quantity, 0)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Tổng tham khảo
                  </Typography>
                  <Typography sx={{ color: SOFA21_COLORS.persimmonDeep, fontWeight: 800 }}>
                    {money(total)}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: SOFA21_COLORS.inkSoft }}>
                  Phí giao hàng và cấu hình cuối cùng được xác nhận sau khi tư vấn.
                </Typography>
                <Button component={RouterLink} href="/sofa21/contact" variant="contained" fullWidth>
                  Liên hệ xác nhận đơn
                </Button>
                <Button component={RouterLink} href="/sofa21/products" fullWidth>
                  Tiếp tục chọn sofa
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}

export function Sofa21Wishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setWishlist(getSofa21Wishlist());
    return subscribeSofa21Lists(() => setWishlist(getSofa21Wishlist()));
  }, []);

  const products = SOFA21_PRODUCTS.filter((product) => wishlist.includes(product.slug));
  const compareList = getSofa21CompareList();

  const remove = (slug: string) => {
    toggleSofa21Wishlist(slug);
    setWishlist(getSofa21Wishlist());
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="overline" sx={{ color: SOFA21_COLORS.persimmonDeep, letterSpacing: 2 }}>
          ĐÃ LƯU
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-.04em' }}>
          Sản phẩm yêu thích
        </Typography>
      </Box>
      {products.length ? (
        <Grid container spacing={2.5}>
          {products.map((product) => (
            <Grid key={product.slug} xs={12} sm={6} md={4}>
              <ProductCard
                product={product}
                wishlist={wishlist}
                compareList={compareList}
                onWishlist={remove}
                onCompare={() => undefined}
                showCompare={false}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ ...paperSx, p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Chưa lưu sản phẩm nào
          </Typography>
          <Button component={RouterLink} href="/sofa21/products" variant="contained" sx={{ mt: 2 }}>
            Khám phá sản phẩm
          </Button>
        </Card>
      )}
    </Stack>
  );
}

export function Sofa21Compare() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(getSofa21CompareList());
    return subscribeSofa21Lists(() => setSlugs(getSofa21CompareList()));
  }, []);

  const products = SOFA21_PRODUCTS.filter((product) => slugs.includes(product.slug));

  const remove = (slug: string) => {
    const next = slugs.filter((item) => item !== slug);
    setSofa21CompareList(next);
    setSlugs(next);
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="overline" sx={{ color: SOFA21_COLORS.persimmonDeep, letterSpacing: 2 }}>
          SO SÁNH LỰA CHỌN
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-.04em' }}>
          Chọn mẫu phù hợp
        </Typography>
      </Box>
      {products.length < 2 ? (
        <Alert severity="info">
          Chọn ít nhất hai mẫu ở{' '}
          <Button component={RouterLink} href="/sofa21/products" size="small">
            danh mục sản phẩm
          </Button>{' '}
          để so sánh. Tối đa ba mẫu mỗi lần.
        </Alert>
      ) : (
        <Card sx={{ ...paperSx, p: { xs: 1.5, md: 2.5 }, borderRadius: 2, overflowX: 'auto' }}>
          <Box sx={{ minWidth: 680, display: 'grid', gridTemplateColumns: `150px repeat(${products.length}, 1fr)` }}>
            {[
              ['Sản phẩm', (product: Sofa21Product) => product.name],
              ['Giá tham khảo', (product: Sofa21Product) => product.price],
              ['Kiểu dáng', (product: Sofa21Product) => product.category],
              ['Kích thước', (product: Sofa21Product) => product.dimensions],
              ['Chất liệu', (product: Sofa21Product) => product.material],
              ['Phong cách', (product: Sofa21Product) => product.styles.join(', ')],
              ['Không gian', (product: Sofa21Product) => product.spaces.join(', ')],
            ].flatMap(([label, getValue]) => [
              <Box key={`${label}-label`} sx={{ p: 1.5, borderBottom: `1px solid ${SOFA21_COLORS.line}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {label as string}
                </Typography>
              </Box>,
              ...products.map((product) => (
                <Box key={`${label}-${product.slug}`} sx={{ p: 1.5, borderBottom: `1px solid ${SOFA21_COLORS.line}` }}>
                  <Typography variant="body2">
                    {(getValue as (item: Sofa21Product) => string)(product)}
                  </Typography>
                  {label === 'Sản phẩm' && (
                    <Button size="small" onClick={() => remove(product.slug)} sx={{ mt: 0.6, px: 0 }}>
                      Bỏ so sánh
                    </Button>
                  )}
                </Box>
              )),
            ])}
          </Box>
        </Card>
      )}
    </Stack>
  );
}

export function Sofa21CheckoutNotice() {
  return (
    <Card sx={{ ...paperSx, p: { xs: 3, md: 5 }, borderRadius: 2 }}>
      <Stack spacing={2} alignItems="flex-start">
        <Chip label="Chưa kết nối thanh toán trực tuyến" color="warning" />
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Hãy xác nhận đơn cùng Sofa21
        </Typography>
        <Typography sx={{ color: SOFA21_COLORS.inkSoft, lineHeight: 1.8 }}>
          Dự án hiện chưa có dịch vụ phía máy chủ để nhận đơn, tính phí giao hàng hoặc xử lý thanh toán. Giỏ hàng chỉ được lưu trên trình duyệt này; vui lòng liên hệ để nhân viên kiểm tra cấu hình và báo giá trước khi đặt.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button component={RouterLink} href="/sofa21/contact" variant="contained">
            Liên hệ tư vấn
          </Button>
          <Button component={RouterLink} href="/sofa21/cart/items">
            Quay lại giỏ hàng
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
