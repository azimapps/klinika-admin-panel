import * as z from 'zod';

export const settingsSchema = z.object({
  maxTimePerPlayer: z.coerce
    .number()
    .min(60, { message: "O'yinchi uchun vaqt kamida 60 soniya bo'lishi kerak" })
    .max(3600, {
      message: "O'yinchi uchun vaqt 3600 soniyadan oshmasligi kerak",
    })
    .optional(),

  maxWordLength: z.coerce
    .number()
    .min(1, { message: "Maksimal so'z uzunligi kamida 1 bo'lishi kerak" })
    .max(50, { message: "Maksimal so'z uzunligi 50 dan oshmasligi kerak" })
    .optional(),

  gemsPerGameWin: z.coerce
    .number()
    .min(1, { message: "G'alaba uchun kamida 1 tanga berilishi kerak" })
    .max(50, { message: "G'alaba uchun 50 tadan ko'p tanga berilmaydi" })
    .optional(),

  starsPerGameWin: z.coerce
    .number()
    .min(1, { message: "G'alaba uchun kamida 1 yulduz berilishi kerak" })
    .max(50, { message: "G'alaba uchun 50 tadan ko'p yulduz berilmaydi" })
    .optional(),

  minWordLength: z.coerce
    .number()
    .min(1, { message: "Minimal so'z uzunligi kamida 1 bo'lishi kerak" })
    .optional(),

  topics: z.array(z.string(), { message: "Mavzular massiv bo'lishi kerak" }).optional(),

  allowDuplicateWords: z
    .boolean({
      message: "Takroriy so'zlarga ruxsat berish boolean qiymat bo'lishi kerak",
    })
    .optional(),

  defaultLanguage: z.string({ message: "Tillar qatori matn shaklida bo'lishi kerak" }).optional(),

  maxPlayers: z.coerce
    .number()
    .min(2, { message: "Minimal o'yinchi soni 2 bo'lishi kerak" })
    .max(10, { message: "Maksimal o'yinchi soni 10 dan oshmasligi kerak" })
    .optional(),
});

export type SettingsSchema = z.infer<typeof settingsSchema>;
