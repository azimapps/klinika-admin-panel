import 'src/global.css';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from 'src/lib/query';
import { I18nProvider } from 'src/locales/i18n-provider';
import { ThemeProvider } from 'src/theme/theme-provider';
import { LocalizationProvider } from 'src/locales/localization-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { defaultSettings } from 'src/components/settings/settings-config';
import { SettingsProvider } from 'src/components/settings/context/settings-provider';

import { AuthProvider } from 'src/auth/context/jwt/auth-provider';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  return (
    <I18nProvider>
      <LocalizationProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider defaultSettings={defaultSettings}>
            <ThemeProvider>
              <ProgressBar />
              <Snackbar />
              <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
          </SettingsProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}
