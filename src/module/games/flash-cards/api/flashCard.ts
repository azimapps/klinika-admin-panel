import type { IParams } from 'src/types/params';

import axiosInstance from 'src/lib/axios';

import type { IAudioSearchRes } from '../../4pics-1word/types/Questions';
import type { IEditTopicFormType, ICreateTopicFormType } from '../service/scheme';
import type { WordCreateFormTypeWithBooleanIsActive } from '../service/wordScheme';
import type { CategoryEditFormType, CategoryCreateFormType } from '../service/categroy';

export const flashCard = {
  getTopics: (params: IParams) =>
    axiosInstance.get('flashcards/topics/all', { params }).then((res) => res.data),
  deleteTopic: (id: string) =>
    axiosInstance.delete(`flashcards/topic/delete/${id}`).then((res) => res),
  updateTopic: (id: string, values: IEditTopicFormType) =>
    axiosInstance.put(`flashcards/topic/update/${id}`, values).then((res) => res),
  createTopic: (values: ICreateTopicFormType) =>
    axiosInstance.post('flashcards/topic/create', values).then((res) => res),
  getSingleTopic: (id: string) =>
    axiosInstance.get(`flashcards/topics/${id}`).then((res) => res.data),
};

export const flashCardWord = {
  getWord: (id: string) =>
    axiosInstance.get(`flashcards/topic-words/${id}`).then((res) => res.data),
  deleteWord: (id: string) =>
    axiosInstance.delete(`flashcards/topic-word/delete/${id}`).then((res) => res),
  createWord: (values: WordCreateFormTypeWithBooleanIsActive & { topic: string }) =>
    axiosInstance.post('flashcards/topic-word/create', values).then((res) => res),
  updateWord: (id: string, value: Partial<WordCreateFormTypeWithBooleanIsActive>) =>
    axiosInstance.put(`flashcards/topic-word/update/${id}`, value).then((res) => res),
};

export const bulkUpload = {
  uploadJson: (dataJson: FormData) =>
    axiosInstance.post('flashcards/topic-word/create/bulk', dataJson, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  uploadAudio: (files: FormData) =>
    axiosInstance
      .post('file-upload/bulk', files, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res),
  audioSearch: (name?: string) =>
    axiosInstance
      .get<{ data: IAudioSearchRes[] }>(`file-upload/search`, { params: { name } })
      .then((res) => res.data),
};

export const flashCardCategory = {
  create: (values: CategoryCreateFormType) =>
    axiosInstance.post('flashcards/admin/category/create', values).then((res) => res),
  update: (id: string, values: CategoryEditFormType) =>
    axiosInstance.put(`flashcards/admin/category/update/${id}`, values).then((res) => res),
  delete: (id: string) =>
    axiosInstance.delete(`flashcards/admin/category/delete/${id}`).then((res) => res),
  get: () => axiosInstance.get('flashcards/admin/categories').then((res) => res.data),
};
