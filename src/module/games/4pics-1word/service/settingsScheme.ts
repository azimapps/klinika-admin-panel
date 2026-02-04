import { z } from 'zod';

export const picsWordSettingsScheme = z.object({
  maxTimePerPlayer: z
    .number({
      required_error: 'Har bir o‘yinchiga ajratilgan maksimal vaqt kiritilishi shart',
    })
    .min(1, 'Minimal vaqt 1 soniyadan kam bo‘lishi mumkin emas'),

  maxWordLength: z
    .number({
      required_error: 'So‘zning maksimal uzunligi ko‘rsatilishi kerak',
    })
    .min(1, 'So‘z uzunligi 1 dan katta bo‘lishi kerak'),

  gemsPerGameWin: z
    .number({
      required_error: 'G‘alaba uchun beriladigan gemlar soni ko‘rsatilishi kerak',
    })
    .min(0, 'Gemlar soni manfiy bo‘lishi mumkin emas'),

  starsPerGameWin: z
    .number({
      required_error: 'G‘alaba uchun yulduzlar soni ko‘rsatilishi kerak',
    })
    .min(0, 'Yulduzlar soni manfiy bo‘lishi mumkin emas'),

  minWordLength: z
    .number({
      required_error: 'Minimal so‘z uzunligi kiritilishi shart',
    })
    .min(1, 'Minimal so‘z uzunligi 1 dan katta bo‘lishi kerak'),

  defaultLanguage: z
    .string({
      required_error: 'Standart til ko‘rsatilishi kerak',
    })
    .min(2, 'Til kodi juda qisqa'),

  maxPlayers: z
    .number({
      required_error: 'O‘yindagi maksimal o‘yinchilar soni ko‘rsatilishi kerak',
    })
    .min(1, 'Kamida 1 o‘yinchi bo‘lishi kerak'),
});

export type PicsWordSettingsFormType = z.infer<typeof picsWordSettingsScheme>;
