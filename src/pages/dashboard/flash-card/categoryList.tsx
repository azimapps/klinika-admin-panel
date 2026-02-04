import { CONFIG } from 'src/global-config';

import { FlashCardCategoryList } from 'src/module/games/flash-cards/ui/categoryList/Table';

export default function Page() {
  return (
    <>
      <title>Flash Card | Dashboard - {CONFIG.appName}</title>
      <FlashCardCategoryList />
    </>
  );
}
