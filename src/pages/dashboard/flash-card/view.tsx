import { useParams } from 'react-router';

import { CONFIG } from 'src/global-config';

import { FlashCardTopicView } from 'src/module/games/flash-cards/ui/topic-view/Table';

const meta = { title: `Flash Card | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const params = useParams() as { id: string };
  return (
    <>
      <title>{meta.title}</title>
      <FlashCardTopicView topicId={params.id} />
    </>
  );
}
