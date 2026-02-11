import { CONFIG } from 'src/global-config';

import { NotificationListView } from 'src/module/notification/ui/notification-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Notifications | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <NotificationListView />
        </>
    );
}
