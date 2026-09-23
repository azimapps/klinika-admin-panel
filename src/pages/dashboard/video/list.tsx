import { CONFIG } from 'src/global-config';

import { VideoListView } from 'src/module/video/ui/video-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Videolar - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <VideoListView />
    </>
  );
}
