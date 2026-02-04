import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/lib/axios';

const upload = async ({ file }: { file: File }) => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.post('file-upload', formData).then((f) => f.data);
};

export const useUploadFile = () => {
  const { mutateAsync: uploadAsync, isPending } = useMutation({
    mutationFn: upload,
  });

  return { uploadAsync, isPending };
};
