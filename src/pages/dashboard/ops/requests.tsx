import { CONFIG } from 'src/global-config';

import { OpsRequestListView } from 'src/module/ops/ui';

// ----------------------------------------------------------------------

const metadata = { title: `Operator panel | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <OpsRequestListView />
    </>
  );
}
