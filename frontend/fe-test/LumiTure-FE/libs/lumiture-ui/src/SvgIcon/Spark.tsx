import { SvgIcon, useTheme, type SvgIconProps } from '@mui/material';

import { SvgLinearGradient, type SvgLinearGradientProps } from './SvgLinearGradient';

interface SparkProps extends SvgLinearGradientProps, SvgIconProps {}

const GRADIENT_ID = 'spark-gradient';

export const Spark = ({ id, gradient, coordinates, ...props }: SparkProps) => {
  const theme = useTheme();
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      {gradient && (
        <SvgLinearGradient id={id || GRADIENT_ID} gradient={gradient} coordinates={coordinates} />
      )}
      <path
        fill={gradient ? `url(#${GRADIENT_ID})` : theme.palette.primary.main}
        d="M8.622 16.03a1.397 1.397 0 0 0 2.083-.58l.66-2.006a3.277 3.277 0 0 1 2.071-2.072l1.918-.623a1.38 1.38 0 0 0 .674-.51 1.388 1.388 0 0 0-.728-2.134l-1.898-.617a3.274 3.274 0 0 1-2.074-2.07l-.624-1.917a1.39 1.39 0 0 0-.509-.672 1.419 1.419 0 0 0-1.61 0c-.24.169-.42.408-.515.685l-.63 1.942a3.272 3.272 0 0 1-2.022 2.031l-1.92.622a1.394 1.394 0 0 0 .017 2.634l1.9.618c.615.206 1.156.59 1.556 1.102.228.294.403.624.52.977l.623 1.915c.096.272.274.508.51.674m8.352 5.212c.175.123.383.19.597.189.212 0 .42-.065.593-.186.178-.127.312-.307.382-.515l.319-.98a1.38 1.38 0 0 1 .872-.874l1-.324a1.04 1.04 0 0 0 .69-.975 1.028 1.028 0 0 0-.724-.983l-.98-.317a1.377 1.377 0 0 1-.875-.872l-.326-.997a1.028 1.028 0 0 0-1.949.014l-.32.982a1.382 1.382 0 0 1-.852.872l-1 .324a1.04 1.04 0 0 0-.69.976 1.029 1.029 0 0 0 .705.975l.98.32a1.376 1.376 0 0 1 .874.876l.325.997c.071.201.203.376.377.499"
      />
    </SvgIcon>
  );
};
