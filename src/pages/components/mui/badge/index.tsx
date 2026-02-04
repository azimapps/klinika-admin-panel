import { CONFIG } from 'src/global-config';

import { BadgeView } from 'src/module/_examples/mui/badge-view';

// ----------------------------------------------------------------------

const metadata = { title: `Badge | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <BadgeView />
    </>
  );
}
