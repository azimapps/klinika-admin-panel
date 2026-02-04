import { CONFIG } from 'src/global-config';

import { CenteredSignInViewPhone } from 'src/auth/view/centered-sign-in-view-phone';

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <CenteredSignInViewPhone />
    </>
  );
}
