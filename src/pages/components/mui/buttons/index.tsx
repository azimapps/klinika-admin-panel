import { CONFIG } from 'src/global-config';

import { ButtonView } from 'src/module/_examples/mui/button-view';

// ----------------------------------------------------------------------

const metadata = { title: `Button | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ButtonView />
    </>
  );
}
