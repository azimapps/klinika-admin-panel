import { useParams } from 'react-router';

import { CONFIG } from 'src/global-config';

import { CategoryView } from 'src/module/games/word-battle/ui/category-view/CategoryView';

const title = `Word Battle | Dashboard - ${CONFIG.appName}`;
export default function Page() {
  console.log();
  const params = useParams() as { id: string };

  return (
    <>
      <title>{title}</title>
      <CategoryView id={params.id} />
    </>
  );
}
