import { CONFIG } from 'src/global-config';

import { UtilitiesView } from 'src/module/_examples/extra/utilities-view';

// ----------------------------------------------------------------------

const metadata = { title: `Utilities | Components - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <UtilitiesView />
    </>
  );
}
