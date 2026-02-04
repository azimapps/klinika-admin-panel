import { Navigate } from 'react-router';

import { LinearProgress } from '@mui/material';

import { CONFIG } from 'src/global-config';

import { Settings } from 'src/module/games/4pics-1word/ui/actions/setting';
import { useGetSettings } from 'src/module/games/4pics-1word/hooks/useGetSettings';

const meta = { title: `4Pics 1Word | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { data, isLoading, error } = useGetSettings();
  if (error) return <Navigate to="/error/500" />;
  if (isLoading) return <LinearProgress />;
  console.log(data);
  return (
    <>
      <title>{meta.title}</title>
      <Settings initialValue={data?.game} />
    </>
  );
}
