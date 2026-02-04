import { CONFIG } from 'src/global-config';

import { OddOneOutQuestionsList } from 'src/module/games/odd-one-out/ui/table/Table';

const meta = {
  title: `Odd One Out | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <title>{meta.title}</title>
      <OddOneOutQuestionsList />
    </>
  );
}
