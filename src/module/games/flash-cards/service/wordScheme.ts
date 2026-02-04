import { z } from 'zod';

export const wordSchema = z.object({
  text: z.string().min(1, {
    message: 'Matn majburiy',
  }),
  audio: z.union([
    z.custom<File>((file) => file instanceof File, { message: 'Iltimos audio yuklang' }),
    z.string().min(1, { message: 'Audio topilmadi' }),
  ]),

  isActive: z.string().min(1, { message: 'Holat (isActive) majburiy' }),
  translation: z.string().min(1, { message: 'Tarjima majburiy' }),
  image: z.union([
    z.custom<File>((file) => file instanceof File, { message: 'Iltimos rasm yuklang' }),
    z.string().min(1, { message: 'Rasm topilmadi' }),
  ]).optional().nullable(),
});

export type WordCreateFormType = z.infer<typeof wordSchema>;
export type WordEditFormType = Partial<WordCreateFormType>;
export type WordCreateFormTypeWithBooleanIsActive = Omit<WordCreateFormType, 'isActive'> & {
  isActive: boolean;
};
