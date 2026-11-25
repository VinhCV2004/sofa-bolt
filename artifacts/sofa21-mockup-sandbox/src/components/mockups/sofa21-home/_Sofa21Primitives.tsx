import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { Icon } from '@iconify/react';

type RouterLinkProps = ComponentPropsWithoutRef<'a'>;

export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(function RouterLink(
  props,
  ref
) {
  return <a ref={ref} {...props} />;
});

type IconifyProps = { icon: string; width?: number; className?: string; sx?: SxProps<Theme> };

export function Iconify({ icon, width = 20, className, sx }: IconifyProps) {
  const IconComponent = Icon as React.ElementType;
  const baseSx = { width, height: width, flexShrink: 0, display: 'inline-flex' };
  const mergedSx: SxProps<Theme> = Array.isArray(sx) ? [baseSx, ...sx] : [baseSx, sx];

  return <Box component={IconComponent} icon={icon} className={className} sx={mergedSx} />;
}
