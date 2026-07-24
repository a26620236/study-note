/* Mapping HTML tags
  {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p', // global setting
    body2: 'p',
    inherit: 'p',
  };
*/

export const typography = {
  fontSize: 14,
  fontFamily: ['Noto Sans', ' Arial', 'sans-serif'].join(','),

  // body1: GLOBAL DEFAULT
  body1: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '24.5px',
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '24.5px',
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '24.5px',
  },

  h1: {
    fontWeight: 700,
    fontSize: 48,
    lineHeight: '60px',
  },
  h2: {
    fontWeight: 700,
    fontSize: 36,
    lineHeight: '54px',
  },
  h3: {
    fontWeight: 700,
    fontSize: 24,
    lineHeight: '36px',
  },
  h4: {
    fontWeight: 700,
    fontSize: 20,
    lineHeight: '30px',
  },
  h5: {
    fontWeight: 700,
    fontSize: 18,
    lineHeight: '27px',
  },
  h6: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: '24px',
  },
  subtitle: {
    fontWeight: 500,
    fontSize: 18,
    lineHeight: '27px',
  },

  // caption
  caption: {
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '18px',
  },
  captionMedium: {
    fontWeight: 500,
    fontSize: 12,
    lineHeight: '18px',
  },
  captionBold: {
    fontWeight: 700,
    fontSize: 12,
    lineHeight: '18px',
  },

  // buttonRegular
  buttonRegular0: {
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '18px',
  },
  buttonRegular1: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '21px',
  },
  buttonRegular2: {
    fontWeight: 400,
    fontSize: 16,
    lineHeight: '24px',
  },

  // buttonMedium
  buttonMedium0: {
    fontWeight: 500,
    fontSize: 12,
    lineHeight: '18px',
  },
  buttonMedium1: {
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '21px',
  },
  buttonMedium2: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: '24px',
  },

  // buttonBold
  buttonBold0: {
    fontWeight: 700,
    fontSize: 12,
    lineHeight: '18px',
  },
  buttonBold1: {
    fontWeight: 700,
    fontSize: 14,
    lineHeight: '21px',
  },
  buttonBold2: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: '24px',
  },

  // link
  link: {
    fontWeight: 400,
    fontSize: 12,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  // linkMedium: {
  //   fontWeight: 500,
  //   fontSize: 12,
  //   cursor: 'pointer',
  //   textDecoration: 'underline',
  // },
  linkBold: {
    fontWeight: 700,
    fontSize: 12,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
} as const;
