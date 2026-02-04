import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/lib/axios';

const upload = async ({ file }: { file: File }) => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.post('file-upload/temp', formData).then((f) => f.data);
};

export const useUploadImage = () => {
  const { mutateAsync: uploadAsync, isPending } = useMutation({
    mutationFn: upload,
  });

  return { uploadAsync, isPending };
};
