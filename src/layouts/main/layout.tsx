import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { allLangs } from 'src/locales';

import { Logo } from 'src/components/logo';

import { Sofa2EngagementTools } from 'src/sections/sofa2/sofa2-engagement-tools';
import {
  useCmsFooterMenus,
  useCmsHeaderNavigation,
} from 'src/sections/sofa2/sofa2-cms-client';
import { getSofa21CartCount, subscribeSofa21Cart } from 'src/sections/sofa21/sofa21-store';

import { Main } from './main';
import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { Footer, HomeFooter } from './footer';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { navData as mainNavData } from '../config-nav-main';
import { SignInButton } from '../components/sign-in-button';
import { SettingsButton } from '../components/settings-button';
import { LanguagePopover } from '../components/language-popover';

import type { NavMainProps } from './nav/types';

// ----------------------------------------------------------------------

const sofa21FooterMenus = [
  {
    headline: 'Khám phá',
    children: [
      { name: 'Sản phẩm', href: '/sofa21/products' },
      { name: 'Dự án', href: '/sofa21/projects' },
      { name: 'Showroom', href: '/sofa21/showrooms/list' },
    ],
  },
  {
    headline: 'Dịch vụ',
    children: [
      { name: 'Thiết kế theo yêu cầu', href: '/sofa21/services/design/custom-sofa' },
      { name: 'Chính sách bảo hành', href: '/sofa21/promotions/warranty' },
      { name: 'Câu hỏi thường gặp', href: '/sofa21/support/faq' },
    ],
  },
  {
    headline: 'Liên hệ',
    children: [
      { name: 'Đặt lịch showroom', href: '/sofa21/showrooms/visit' },
      { name: 'Tư vấn sản phẩm', href: '/sofa21/contact' },
      { name: 'Chính sách giao hàng', href: '/sofa21/support/shipping-policy' },
    ],
  },
];

export type MainLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
  data?: {
    nav?: NavMainProps['data'];
  };
};

export function MainLayout({ sx, data, children, header }: MainLayoutProps) {
  const theme = useTheme();

  const pathname = usePathname();

  const mobileNavOpen = useBoolean();

  const homePage = pathname === '/';

  const layoutQuery: Breakpoint = 'md';

  const isSofa2 = pathname === '/sofa2' || pathname.startsWith('/sofa2/');
  const isSofa21 = pathname.startsWith('/sofa21');
  const [sofa21CartCount, setSofa21CartCount] = useState(0);
  const navData = useCmsHeaderNavigation(data?.nav ?? mainNavData, isSofa2);
  const cmsFooterMenus = useCmsFooterMenus(isSofa2);

  useEffect(() => {
    if (!isSofa21) return undefined;

    const refreshCartCount = () => setSofa21CartCount(getSofa21CartCount());
    refreshCartCount();
    return subscribeSofa21Cart(refreshCartCount);
  }, [isSofa21]);

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {/* -- Nav mobile -- */}
                <MenuButton
                  onClick={mobileNavOpen.onTrue}
                  sx={{
                    mr: 1,
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}
                  open={mobileNavOpen.value}
                  onClose={mobileNavOpen.onFalse}
                />
                {/* -- Logo -- */}
                {isSofa21 ? (
                  <Box
                    component={RouterLink}
                    href="/sofa21"
                    sx={{ display: 'inline-flex', flexDirection: 'column', textDecoration: 'none', color: 'text.primary' }}
                  >
                    <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, letterSpacing: 1.5 }}>
                      SOFA21
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 9, letterSpacing: 2, color: 'text.secondary' }}>
                      ATELIER · NỘI THẤT
                    </Typography>
                  </Box>
                ) : (
                  <Logo />
                )}
              </>
            ),
            rightArea: (
              <>
                {/* -- Nav desktop -- */}
                <NavDesktop
                  data={navData}
                  sx={{
                    display: 'none',
                    [theme.breakpoints.up(layoutQuery)]: { mr: 2.5, display: 'flex' },
                  }}
                />
                <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
                  {/* -- Language popover -- */}
                  {!isSofa21 && <LanguagePopover data={allLangs} />}
                  {/* -- Settings button -- */}
                  {!isSofa21 && <SettingsButton />}

                  {/* -- Sign in button -- */}
                  <SignInButton label={isSofa21 ? 'Tài khoản' : 'Sign in'} />
                  {isSofa21 && (
                    <Button
                      component={RouterLink}
                      href="/sofa21/cart/items"
                      variant="outlined"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Giỏ hàng{sofa21CartCount ? ` (${sofa21CartCount})` : ''}
                    </Button>
                  )}
                  {/* -- Purchase button -- */}
                  {isSofa21 ? (
                    <Button
                      component={RouterLink}
                      href="/sofa21/showrooms/visit"
                      variant="contained"
                      sx={{
                        display: 'none',
                        [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
                        whiteSpace: 'nowrap',
                        bgcolor: '#302F29',
                        '&:hover': { bgcolor: '#80513D' },
                      }}
                    >
                      Đặt lịch
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      rel="noopener"
                      target="_blank"
                      href={paths.minimalStore}
                      sx={{
                        display: 'none',
                        [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
                      }}
                    >
                      Purchase
                    </Button>
                  )}
                </Box>
              </>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={
        homePage ? (
          <HomeFooter />
        ) : (
          <Footer
            layoutQuery={layoutQuery}
            customLinks={isSofa2 ? cmsFooterMenus : isSofa21 ? sofa21FooterMenus : undefined}
            description={
              isSofa2
                ? 'LUXE Sofa — thiết kế độc quyền, chế tác bền vững cho không gian sống Việt.'
                : isSofa21
                  ? 'Sofa21 Atelier — thiết kế sofa tinh giản, vật liệu chọn lọc và tư vấn tận tâm cho không gian sống Việt.'
                  : undefined
            }
            brandName={isSofa21 ? 'SOFA21' : undefined}
            brandHref="/sofa21"
          />
        )
      }
      /** **************************************
       * Style
       *************************************** */
      sx={sx}
    >
      <Main>{children}</Main>
      <Sofa2EngagementTools enabled={isSofa2} />
    </LayoutSection>
  );
}
