import { CONFIG } from 'src/global-config';

import { AlertView } from 'src/module/_examples/mui/alert-view';

// ----------------------------------------------------------------------

const metadata = { title: `Alert | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <AlertView />
    </>
  );
}
