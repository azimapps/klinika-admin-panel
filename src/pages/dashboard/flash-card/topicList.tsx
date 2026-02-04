import { CONFIG } from 'src/global-config';

import { FlashCardTopics } from 'src/module/games/flash-cards/ui/topics/Table';

const meta = {
  title: `Flash Card | Dashboard - ${CONFIG.appName}`,
};
export default function Page() {
  return (
    <>
      <title>{meta.title}</title>
      <FlashCardTopics />
    </>
  );
}
