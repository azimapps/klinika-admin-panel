import { CONFIG } from 'src/global-config';

import { ShadowsView } from 'src/module/_examples/foundation/shadows-view';

// ----------------------------------------------------------------------

const metadata = { title: `Shadows | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ShadowsView />
    </>
  );
}
