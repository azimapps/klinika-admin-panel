import * as z from 'zod';

export const createCategoryFormScheme = z.object({
  image: z
    .union([z.string(), z.instanceof(File)])
    .refine(
      (val) =>
        (typeof val === 'string' && val.trim() !== '') || (val instanceof File && val.size > 0),
      {
        message: 'Iltimos kategoriya uchun rasm tanlang',
      }
    ),
  topic: z.string({ required_error: 'Iltimos kategoriya nomini kiriting' }).min(1),
  words: z.array(z.string({ required_error: "Kamida bitta so'z kiriting" })).min(1),
});

export type CreateCategoryFormType = z.infer<typeof createCategoryFormScheme>;
export type EditCategory = Partial<CreateCategoryFormType>;
