import { CONFIG } from 'src/global-config';

import { ConsultationRequestListView } from 'src/module/consultation-request/ui/consultation-request-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `So'rovlar - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <ConsultationRequestListView />
    </>
  );
}
