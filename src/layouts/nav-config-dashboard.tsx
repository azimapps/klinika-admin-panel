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

const iconify = (name: string) => (
  <Iconify icon={name as any} width={24} />
);

const ICONS = {
  user: icon('ic-user'),
  analytics: icon('ic-analytics'),
  statistics: iconify('solar:file-text-bold'),
  categories: iconify('solar:bill-list-bold'),
  doctors: iconify('solar:medical-kit-bold'),
  schedule: iconify('solar:calendar-date-bold'),
  services: iconify('solar:settings-bold-duotone'),
  advantages: iconify('solar:cup-star-bold'),
  clinics: iconify('solar:shield-check-bold'),
  faq: iconify('solar:chat-round-dots-bold'),
  founders: iconify('solar:users-group-rounded-bold-duotone'),
  tips: iconify('solar:notes-bold-duotone'),
  notifications: iconify('solar:bell-bing-bold-duotone'),
  clients: iconify('solar:user-rounded-bold'),
};

// ----------------------------------------------------------------------

export const useNavData = (): NavSectionProps['data'] => {
  const { t } = useTranslate('navbar');

  return useMemo(
    () => [
      {
        subheader: 'Boshqaruv',
        items: [
          { title: t('statistics'), path: paths.dashboard.root, icon: ICONS.statistics },
          { title: t('categories'), path: paths.dashboard.category.list, icon: ICONS.categories },
          { title: t('doctors'), path: paths.dashboard.doctor.list, icon: ICONS.doctors },
          { title: t('schedule'), path: paths.dashboard.doctor.schedule, icon: ICONS.schedule },
          { title: t('services'), path: paths.dashboard.service.list, icon: ICONS.services },
          { title: t('advantages'), path: paths.dashboard.advantage.list, icon: ICONS.advantages },
          { title: t('clinics'), path: paths.dashboard.clinic.list, icon: ICONS.clinics },
          { title: t('faqs'), path: paths.dashboard.faq.list, icon: ICONS.faq },
          { title: t('founders'), path: paths.dashboard.founder.list, icon: ICONS.founders },
          { title: t('tips'), path: paths.dashboard.tip.list, icon: ICONS.tips },
          { title: t('notifications'), path: paths.dashboard.notification.list, icon: ICONS.notifications },
          { title: t('clients'), path: paths.dashboard.client.list, icon: ICONS.clients },
        ],
      },
    ],
    [t]
  );
};
