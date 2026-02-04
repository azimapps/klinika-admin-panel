import type { LabelColor } from 'src/components/label';

import { useTranslate } from 'src/locales';

export enum level {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export const useLevelLabels = (): Record<level, string> => {
  const { t } = useTranslate('flash-card');
  return {
    [level.EASY]: t('enums.easy'),
    [level.MEDIUM]: t('enums.medium'),
    [level.HARD]: t('enums.hard'),
  };
};
export const LevelLabelsColors: Record<level, LabelColor> = {
  [level.EASY]: 'success',
  [level.MEDIUM]: 'warning',
  [level.HARD]: 'error',
};

export enum Language {
  EN = 'en',
  UZ = 'uz',
  RU = 'ru',
}

export const LanguageLabelsUz: Record<Language, string> = {
  [Language.EN]: 'Ingliz tili',
  [Language.UZ]: "O'zbek tili",
  [Language.RU]: 'Rus tili',
};

export const useLanguageLabels = (): Record<Language, string> => {
  const { t } = useTranslate('flash-card');

  return {
    [Language.EN]: t('enums.en'),
    [Language.UZ]: t('enums.uz'),
    [Language.RU]: t('enums.ru'),
  };
};

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export const StatusLabels: Record<Status, string> = {
  [Status.ACTIVE]: 'Faol',
  [Status.INACTIVE]: 'Nofaol',
  [Status.ARCHIVED]: 'Arxivlangan',
};

export const useStatusLabels = (): Record<Status, string> => {
  const { t } = useTranslate('flash-card');

  return {
    [Status.ACTIVE]: t('enums.active'),
    [Status.INACTIVE]: t('enums.inactive'),
    [Status.ARCHIVED]: t('enums.archive'),
  };
};

export const StatusLabelsColors: Record<Status, LabelColor> = {
  [Status.ACTIVE]: 'success',
  [Status.ARCHIVED]: 'warning',
  [Status.INACTIVE]: 'error',
};
