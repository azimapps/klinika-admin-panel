import { CONFIG } from 'src/global-config';

import { DoctorListView } from 'src/module/doctor/ui/doctor-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Doctors | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title> {metadata.title} </title>

            <DoctorListView />
        </>
    );
}
