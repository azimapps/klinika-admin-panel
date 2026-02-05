import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  user: icon('ic-user'),
  analytics: icon('ic-analytics'),
  category: <Iconify icon="solar:list-bold" width={24} />,
  wordBattle: icon('ic-wb'),
  flashCard: icon('ic-flash-card'),
  picWord: icon('ic-pic'),
  oddOneOut: icon('ic-odd'),
};

// ----------------------------------------------------------------------

export const useNavData = (): NavSectionProps['data'] => {
  const { t } = useTranslate('navbar');

  return useMemo(
    () => [
      {
        subheader: t('allInformation'),
        items: [
          { title: t('statistics'), path: paths.dashboard.root, icon: ICONS.analytics },
          { title: t('categories'), path: paths.dashboard.category.list, icon: ICONS.category },
          { title: t('users'), path: paths.dashboard.user.list, icon: ICONS.user },
        ],
      },
    ],
    [t]
  );
};
