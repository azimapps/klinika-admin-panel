import { CONFIG } from 'src/global-config';

import { ChipView } from 'src/module/_examples/mui/chip-view';

// ----------------------------------------------------------------------

const metadata = { title: `Chip | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ChipView />
    </>
  );
}
