import { Navigate, useParams } from 'react-router';

import { LinearProgress } from '@mui/material';

import { CONFIG } from 'src/global-config';

import { FlashCardTopicForm } from 'src/module/games/flash-cards/ui/actions/form';
import { useGetSingleTopic } from 'src/module/games/flash-cards/hooks/useGetSingleTopic';

const meta = { title: `Flash Card | Dashboard - ${CONFIG.appName}` };
export default function Page() {
  const params = useParams() as { id: string };
  const { data, isLoading, error } = useGetSingleTopic(params.id);
  if (error) return <Navigate to="/error/500" />;
  if (isLoading) return <LinearProgress />;
  return (
    <>
      <title>{meta.title}</title>
      <FlashCardTopicForm initialValue={data.data} id={params.id} />
    </>
  );
}
