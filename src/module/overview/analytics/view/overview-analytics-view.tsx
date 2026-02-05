import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Welcome to Klinika Admin Panel 👋
      </Typography>

      <Typography variant="body1">
        This is your fresh start. You can begin building your clinic management system here.
      </Typography>
    </DashboardContent>
  );
}
