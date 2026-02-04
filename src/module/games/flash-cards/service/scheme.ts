import * as z from 'zod';

import { level, Status, Language } from './enums';

export const CreateTopicSchema = z.object({
  topic: z.string().min(1, { message: 'Topic is required' }),
  image: z.union([
    z.string().url({ message: 'Image must be a valid URL string' }),
    z.instanceof(File, { message: 'Image must be a File object' }),
  ]),
  description: z.string().min(1, { message: 'Description is required' }),
  difficultyLevel: z.nativeEnum(level, {
    errorMap: () => ({ message: 'Invalid difficulty level' }),
  }),
  language: z.nativeEnum(Language, { errorMap: () => ({ message: 'Language is requred' }) }),
  translation: z.nativeEnum(Language, { errorMap: () => ({ message: 'Translation is requred' }) }),
  status: z.nativeEnum(Status, {
    errorMap: () => ({ message: 'Invalid status value' }),
  }),
  category: z.string().min(1, { message: 'Category is required' }),
  color1: z.string().min(1, { message: 'Color 1 is required' }),
  color2: z.string().min(1, { message: 'Color 2 is required' }),
  topicColor: z.string().min(1, { message: 'Topic Color is required' }),
});

export type ICreateTopicFormType = z.infer<typeof CreateTopicSchema>;
export type IEditTopicFormType = Partial<ICreateTopicFormType>;
