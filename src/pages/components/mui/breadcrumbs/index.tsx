import { CONFIG } from 'src/global-config';

import { BreadcrumbsView } from 'src/module/_examples/mui/breadcrumbs-view';

// ----------------------------------------------------------------------

const metadata = { title: `Breadcrumbs | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <BreadcrumbsView />
    </>
  );
}
