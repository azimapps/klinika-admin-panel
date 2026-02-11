
import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales';

import { ClientListView } from 'src/module/client/ui/client-list-view';

// ----------------------------------------------------------------------

export default function ClientListPage() {
    const { t } = useTranslate('client');

    const metadata = { title: `${t('list')} | Client - ${CONFIG.appName}` };

    return (
        <>
            <title>{metadata.title}</title>

            <ClientListView />
        </>
    );
}
