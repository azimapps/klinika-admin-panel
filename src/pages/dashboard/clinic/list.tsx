import { CONFIG } from 'src/global-config';

import { ClinicListView } from 'src/module/clinic/ui/clinic-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Clinics - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title> {metadata.title}</title>

            <ClinicListView />
        </>
    );
}
