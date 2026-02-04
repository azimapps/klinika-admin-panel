import { CONFIG } from 'src/global-config';

import { PaginationView } from 'src/module/_examples/mui/pagination-view';

// ----------------------------------------------------------------------

const metadata = { title: `Pagination | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <PaginationView />
    </>
  );
}
