import { CONFIG } from 'src/global-config';

import { AdvantageListView } from 'src/module/advantage/ui/advantage-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Advantages | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title> {metadata.title} </title>

            <AdvantageListView />
        </>
    );
}
