import { Navigate } from 'react-router';

import { LinearProgress } from '@mui/material';

import { CONFIG } from 'src/global-config';

import { Settings } from 'src/module/games/word-battle/ui/actions/settings';
import { useGetSettings } from 'src/module/games/word-battle/hooks/useGetSettings';

// ----------------------------------------------------------------------

const metadata = { title: `Word Battle | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { data, error, isLoading } = useGetSettings();
  if (error) return <Navigate to="/error/500" />;
  if (isLoading) return <LinearProgress />;
  return (
    <>
      <title>{metadata.title}</title>

      <Settings settings={data.game} />
    </>
  );
}
