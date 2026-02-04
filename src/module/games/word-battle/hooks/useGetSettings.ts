import { useQuery } from '@tanstack/react-query';

import { wbSettings } from '../api/word-battle-api';

export const useGetSettings = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['word-battle-settings'],
    queryFn: wbSettings.get,
  });

  return { data, isLoading, error };
};
