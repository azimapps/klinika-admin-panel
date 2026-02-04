import { CONFIG } from 'src/global-config';

import { TextfieldView } from 'src/module/_examples/mui/textfield-view';

// ----------------------------------------------------------------------

const metadata = { title: `Textfield | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <TextfieldView />
    </>
  );
}
