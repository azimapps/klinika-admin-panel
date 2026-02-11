import { CONFIG } from 'src/global-config';

import { TipListView } from 'src/module/tip/ui/tip-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Maslahatlar - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title> {metadata.title}</title>

            <TipListView />
        </>
    );
}
