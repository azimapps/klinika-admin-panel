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
        subheader: 'Boshqaruv',
        items: [
          { title: t('statistics'), path: paths.dashboard.root, icon: ICONS.analytics },
          { title: t('categories'), path: paths.dashboard.category.list, icon: ICONS.category },
          { title: t('doctors'), path: paths.dashboard.doctor.list, icon: <Iconify icon="solar:heart-bold" width={24} /> },
          { title: t('advantages'), path: paths.dashboard.advantage.list, icon: <Iconify icon="solar:cup-star-bold" width={24} /> },
          { title: t('founders'), path: paths.dashboard.founder.list, icon: <Iconify icon="solar:user-id-bold" width={24} /> },
        ],
      },
      /*
      {
        subheader: 'Old Content (Commented)',
        items: [
          {
            title: 'Users',
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [{ title: 'List', path: paths.dashboard.user.list }],
          },
          {
            title: 'Word battle',
            path: paths.dashboard.games.wordBattle.root,
            icon: ICONS.wordBattle,
            children: [
              { title: 'List', path: paths.dashboard.games.wordBattle.list },
              { title: 'Create', path: paths.dashboard.games.wordBattle.create },
            ],
          },
          {
            title: 'Flash Card',
            path: paths.dashboard.games.flashCard.root,
            icon: ICONS.flashCard,
            children: [
              { title: 'List', path: paths.dashboard.games.flashCard.list },
              { title: 'Create', path: paths.dashboard.games.flashCard.create },
            ],
          },
        ],
      },
      */
    ],
    [t]
  );
};
