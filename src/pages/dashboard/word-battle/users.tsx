import { CONFIG } from 'src/global-config';

import { WordBattleUsersList } from 'src/module/games/word-battle/ui/users/Table';

const title = `Word Battle | Dashboard - ${CONFIG.appName}`;

export default function Page() {
  return (
    <>
      <title>{title}</title>
      <WordBattleUsersList />
    </>
  );
}
