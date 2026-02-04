import { CONFIG } from 'src/global-config';

import { WordBattleCategoryList } from 'src/module/games/word-battle/ui/categories/Table';

// ----------------------------------------------------------------------

const metadata = { title: `Word Battle | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <WordBattleCategoryList />
    </>
  );
}
