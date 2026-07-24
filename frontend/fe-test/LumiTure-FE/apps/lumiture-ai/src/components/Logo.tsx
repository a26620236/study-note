import Image from 'next/image';
import Link from 'next/link';

import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';

import { OVERVIEW_PATHS } from '@constants';

interface LogoProps {
  isBeta?: boolean;
  isColored?: boolean;
  variant?: 'horizontal' | 'vertical';
  width?: string | number;
  height?: string | number;
  sx?: SxProps;
  withLink?: boolean;
}

const Logo = ({
  isColored = true,
  variant = 'horizontal',
  width = 450,
  height = 80,
  sx,
  withLink = true,
}: LogoProps) => {
  const color = isColored ? 'colored' : 'achromatic';

  const LogoComponent = () => (
    <Stack sx={{ position: 'relative', width, height, ...sx }}>
      <Image src={`/images/logo/${color}_${variant}.svg`} fill priority alt="LumiTure.ai logo" />
    </Stack>
  );

  if (withLink) {
    return (
      <Link href={OVERVIEW_PATHS.overview.pathname}>
        <LogoComponent />
      </Link>
    );
  }

  return <LogoComponent />;
};

export default Logo;
