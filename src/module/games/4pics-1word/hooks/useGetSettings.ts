import { useQuery } from '@tanstack/react-query';

import { settings } from '../api/picsWord';

export const useGetSettings = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pics-word-settings'],
    queryFn: settings.get,
  });

  return { data, isLoading, error };
};
