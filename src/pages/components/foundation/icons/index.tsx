import { CONFIG } from 'src/global-config';

import { IconsView } from 'src/module/_examples/foundation/icons-view';

// ----------------------------------------------------------------------

const metadata = { title: `Icons | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <IconsView />
    </>
  );
}
