import { CONFIG } from 'src/global-config';

import { DoctorScheduleView } from 'src/module/doctor/ui';


// ----------------------------------------------------------------------

const metadata = { title: `Doctor Schedule | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title> {metadata.title} </title>

            <DoctorScheduleView />
        </>
    );
}
