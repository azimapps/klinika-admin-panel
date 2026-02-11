import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  user: icon('ic-user'),
  analytics: icon('ic-analytics'),
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
          { title: t('categories'), path: paths.dashboard.category.list, icon: ICONS.analytics },
          { title: t('doctors'), path: paths.dashboard.doctor.list, icon: ICONS.user },
          { title: t('services'), path: paths.dashboard.service.list, icon: ICONS.analytics },
          { title: t('advantages'), path: paths.dashboard.advantage.list, icon: ICONS.analytics },
          { title: t('clinics'), path: paths.dashboard.clinic.list, icon: ICONS.analytics },
          { title: t('faqs'), path: paths.dashboard.faq.list, icon: ICONS.analytics },
          { title: t('founders'), path: paths.dashboard.founder.list, icon: ICONS.user },
          { title: t('tips'), path: paths.dashboard.tip.list, icon: ICONS.analytics },
        ],
      },
    ],
    [t]
  );
};
