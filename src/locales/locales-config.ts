// ----------------------------------------------------------------------

export const fallbackLng = 'uz';
export const languages = ['ru', 'uz'];
export const defaultNS = 'common';

export type LanguageValue = (typeof languages)[number];

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages: Record<
  LanguageValue,
  { success: string; error: string; loading: string }
> = {
  ru: {
    success: 'Язык был изменён!',
    error: 'Ошибка при смене языка!',
    loading: 'Загрузка...',
  },
  uz: {
    success: 'Til muvaffaqiyatli o‘zgartirildi!',
    error: 'Tilni o‘zgartirishda xatolik yuz berdi!',
    loading: 'Yuklanmoqda...',
  },
};
