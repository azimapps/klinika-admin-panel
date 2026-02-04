import { useQuery } from '@tanstack/react-query';

import { flashCard } from '../api/flashCard';

export const useGetSingleTopic = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['flash-card-single-topic', id],
    queryFn: () => flashCard.getSingleTopic(id),
  });

  return { data, isLoading, error };
};
