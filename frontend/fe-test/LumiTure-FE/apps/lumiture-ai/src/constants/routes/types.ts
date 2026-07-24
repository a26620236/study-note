import type { ReactElement } from 'react';

import type { MaterialSymbol } from 'material-symbols';

export type PathsType = Record<
  string,
  {
    key: string;
    isBeta?: boolean;
    name: string;
    pathname: string;
    icon: MaterialSymbol | ReactElement | null;
    defaultParams?: Record<string, string>;
  }
>;
