import { CONFIG } from 'src/global-config';

import { FlashCardTopicForm } from 'src/module/games/flash-cards/ui/actions/form';

const meta = { title: `Flash Card | Dashboard - ${CONFIG.appName}` };
export default function Page() {
  return (
    <>
      <title>{meta.title}</title>
      <FlashCardTopicForm />
    </>
  );
}
