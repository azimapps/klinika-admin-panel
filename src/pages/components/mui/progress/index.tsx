import { CONFIG } from 'src/global-config';

import { ProgressView } from 'src/module/_examples/mui/progress-view';

// ----------------------------------------------------------------------

const metadata = { title: `Progress | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ProgressView />
    </>
  );
}
