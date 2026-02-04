import { CONFIG } from 'src/global-config';

import { DatePickersView } from 'src/module/_examples/mui/date-pickers-view';

// ----------------------------------------------------------------------

const metadata = { title: `Date pickers | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <DatePickersView />
    </>
  );
}
