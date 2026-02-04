import { CONFIG } from 'src/global-config';

import { CategoryCreateForm } from 'src/module/games/word-battle/ui/actions/form';

const metadata = { title: `Word Battle | Dashboard - ${CONFIG.appName}` };
export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <CategoryCreateForm />
    </>
  );
}
