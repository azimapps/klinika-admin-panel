import type { IQuestionsListRes } from 'src/module/games/4pics-1word/types/Questions';

import { useMemo } from 'react';
import { useParams } from 'react-router';

import { CONFIG } from 'src/global-config';
import { queryClient } from 'src/lib/query';

import { FormQuestions } from 'src/module/games/4pics-1word/ui/actions/form';

const meta = { title: `4Pics 1Word | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const params = useParams() as { id: string };
  const questionsFromQuery = queryClient.getQueriesData({
    queryKey: ['pics-word-questions'],
  });
  const updatingQuestion = useMemo(() => {
    if (!questionsFromQuery) return null;
    const lastQueryData = questionsFromQuery.at(-1);
    const data = (lastQueryData?.[1] as { data: IQuestionsListRes[] }) || undefined;
    return data.data.find((el: IQuestionsListRes) => el._id === params.id) || null;
  }, [params.id, questionsFromQuery]);
  return (
    <>
      <title>{meta.title}</title>
      <FormQuestions initialValue={updatingQuestion} />
    </>
  );
}
