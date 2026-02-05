import { CONFIG } from 'src/global-config';

import { CategoryListView } from 'src/module/category/ui/category-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Categories - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title> {metadata.title}</title>

            <CategoryListView />
        </>
    );
}
