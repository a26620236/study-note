import { SvgIcon, type SvgIconProps } from '@mui/material';

export const Microsoft = (props: SvgIconProps) => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#a)">
      <path fill="#F24F23" d="M2.52 2.52h9.576v9.575H2.52" />
      <path fill="#7EBA03" d="M13.23 2.52v9.575h9.45V2.52" />
      <path fill="#3CA4EF" d="M2.52 13.23h9.576v9.45H2.52" />
      <path fill="#F9BA00" d="M13.23 13.23h9.45v9.45h-9.45" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h25.2v25.2H0z" />
      </clipPath>
    </defs>
  </SvgIcon>
);
