import * as z from 'zod';

export const questionScheme = z.object({
  answer: z.string().min(1, { message: 'Javobni kiriting' }),
  images: z
    .array(z.union([z.string(), z.instanceof(File)]))
    .min(4, 'Kamida 4 ta rasm yuklang')
    .max(4, 'Maksimal 4 ta rasm yuklang'),
});

export type QuestionFormType = z.infer<typeof questionScheme>;
