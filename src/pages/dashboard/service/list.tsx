import { CONFIG } from 'src/global-config';

import { ServiceListView } from 'src/module/service/ui/service-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Services - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title> {metadata.title}</title>

            <ServiceListView />
        </>
    );
}
