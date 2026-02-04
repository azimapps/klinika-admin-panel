import { CONFIG } from 'src/global-config';

import { QuestionList } from 'src/module/games/4pics-1word/ui/question-list/Table';

const meta = { title: `4Pics 1Word | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{meta.title}</title>
      <QuestionList />
    </>
  );
}
