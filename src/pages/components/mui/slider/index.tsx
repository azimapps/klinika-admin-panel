import { CONFIG } from 'src/global-config';

import { SliderView } from 'src/module/_examples/mui/slider-view';

// ----------------------------------------------------------------------

const metadata = { title: `Slider | MUI - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <SliderView />
    </>
  );
}
