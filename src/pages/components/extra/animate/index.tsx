import { CONFIG } from 'src/global-config';

import { AnimateView } from 'src/module/_examples/extra/animate-view';

// ----------------------------------------------------------------------

const metadata = { title: `Animate | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <AnimateView />
    </>
  );
}
