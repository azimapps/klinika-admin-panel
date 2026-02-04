import { CONFIG } from 'src/global-config';

import { CenteredSignInView } from 'src/auth/view/centered-sign-in-view';

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <CenteredSignInView />
    </>
  );
}
