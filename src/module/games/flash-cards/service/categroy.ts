import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, {
    message: 'Nomi majburiy',
  }),
  status: z.string().min(1, {
    message: 'Holat majburiy',
  }),
  description: z.string().min(1, {
    message: 'Matn majburiy',
  }),
  order: z.number().min(1, {
    message: 'Order majburiy',
  }),
  image: z.union([
    z.custom<File>((file) => file instanceof File, { message: 'Iltimos rasm yuklang' }),
    z.string().min(1, { message: 'Rasm topilmadi' }),
  ]),
});

export type CategoryCreateFormType = z.infer<typeof categorySchema>;
export type CategoryEditFormType = Partial<CategoryCreateFormType>;
