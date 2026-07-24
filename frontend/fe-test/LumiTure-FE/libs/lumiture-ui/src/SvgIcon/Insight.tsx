import { SvgIcon, useTheme, type SvgIconProps } from '@mui/material';

import { SvgLinearGradient, type SvgLinearGradientProps } from './SvgLinearGradient';

interface InsightProps extends SvgLinearGradientProps, SvgIconProps {}

const GRADIENT_ID = 'insight-gradient';

export const Insight = ({ id, gradient, coordinates, ...props }: InsightProps) => {
  const theme = useTheme();
  return (
    <SvgIcon viewBox="0 0 24 25" {...props}>
      {gradient && (
        <SvgLinearGradient id={id || GRADIENT_ID} gradient={gradient} coordinates={coordinates} />
      )}
      <path
        fill={gradient ? `url(#${GRADIENT_ID})` : theme.palette.primary.main}
        d="M3.1 18.1a2.122 2.122 0 0 1-1.562-.638A2.122 2.122 0 0 1 .9 15.9c0-.6.217-1.112.65-1.537.434-.425.95-.638 1.55-.638h.288a.7.7 0 0 1 .262.05l4.225-4.2a.91.91 0 0 1-.05-.288V9c0-.6.213-1.113.638-1.538A2.095 2.095 0 0 1 10 6.825c.6 0 1.113.212 1.538.637.425.425.637.938.637 1.538 0 .067-.016.25-.05.55l2.325 2.325c.1-.033.192-.05.275-.05h.563a.7.7 0 0 1 .262.05l3.225-3.225a.702.702 0 0 1-.05-.263V8.1c0-.6.213-1.117.638-1.55.425-.433.937-.65 1.537-.65.617 0 1.138.212 1.563.637.425.425.637.946.637 1.563 0 .6-.216 1.112-.65 1.537-.433.425-.95.638-1.55.638h-.287a.702.702 0 0 1-.263-.05l-3.225 3.225a.7.7 0 0 1 .05.262V14c0 .6-.212 1.113-.637 1.538a2.098 2.098 0 0 1-1.538.637c-.6 0-1.112-.212-1.537-.637A2.096 2.096 0 0 1 12.825 14v-.288c0-.091.017-.187.05-.287l-2.3-2.3a.908.908 0 0 1-.287.05H10c-.066 0-.25-.017-.55-.05L5.225 15.35c.034.1.05.192.05.275v.275c0 .6-.212 1.117-.637 1.55-.425.433-.938.65-1.538.65ZM4 8.125l-.675-1.45L1.875 6l1.45-.675L4 3.875l.675 1.45L6.125 6l-1.45.675L4 8.125Zm11-.9-1.025-2.2L11.775 4l2.2-1.025L15 .775l1.025 2.2L18.225 4l-2.2 1.025L15 7.225Z"
      />
    </SvgIcon>
  );
};
