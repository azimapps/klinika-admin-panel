import { CONFIG } from 'src/global-config';

import { TimelineView } from 'src/module/_examples/mui/timeline-view';

// ----------------------------------------------------------------------

const metadata = { title: `Timeline | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <TimelineView />
    </>
  );
}
