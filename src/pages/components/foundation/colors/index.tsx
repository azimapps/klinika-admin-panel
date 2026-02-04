import { CONFIG } from 'src/global-config';

import { ColorsView } from 'src/module/_examples/foundation/colors-view';

// ----------------------------------------------------------------------

const metadata = { title: `Colors | Foundations - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ColorsView />
    </>
  );
}
