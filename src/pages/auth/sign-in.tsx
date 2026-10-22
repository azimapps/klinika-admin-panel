import { CONFIG } from 'src/global-config';

import { CenteredSignInViewStaff } from 'src/auth/view/centered-sign-in-view-staff';

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <CenteredSignInViewStaff />
    </>
  );
}
