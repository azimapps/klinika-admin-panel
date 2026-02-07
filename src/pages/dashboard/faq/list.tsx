import { CONFIG } from 'src/global-config';

import { FAQListView } from 'src/module/faq/ui/faq-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `FAQs - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title> {metadata.title}</title>

            <FAQListView />
        </>
    );
}
