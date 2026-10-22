import { CONFIG } from 'src/global-config';

import { StaffListView } from 'src/module/staff/ui';

// ----------------------------------------------------------------------

const metadata = { title: `Staff | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <StaffListView />
    </>
  );
}
