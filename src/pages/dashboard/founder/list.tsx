import { CONFIG } from 'src/global-config';

import { FounderListView } from 'src/module/founder/ui/founder-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Founders | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title> {metadata.title} </title>

            <FounderListView />
        </>
    );
}
