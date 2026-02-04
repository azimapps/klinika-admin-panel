import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, Grid, Button, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Form, RHFSelect, RHFTextField } from 'src/components/hook-form';

import { useUpdateSettings } from '../../hooks/useUpdateSettings';
import {
  picsWordSettingsScheme,
  type PicsWordSettingsFormType,
} from '../../service/settingsScheme';

interface Props {
  initialValue?: PicsWordSettingsFormType;
}

export const Settings = ({ initialValue }: Props) => {
  const { t } = useTranslate('pic-word');
  const { isPending, mutateAsync } = useUpdateSettings();
  const form = useForm<PicsWordSettingsFormType>({
    defaultValues: {
      maxTimePerPlayer: initialValue?.maxTimePerPlayer || 300,
      maxWordLength: initialValue?.maxWordLength || 50,
      gemsPerGameWin: initialValue?.gemsPerGameWin || 15,
      starsPerGameWin: initialValue?.starsPerGameWin || 3,
      minWordLength: initialValue?.minWordLength || 2,
      defaultLanguage: initialValue?.defaultLanguage || 'en',
      maxPlayers: initialValue?.maxPlayers || 2,
    },
    resolver: zodResolver(picsWordSettingsScheme),
  });

  const formSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values);
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('settings.title')}
        links={[
          { name: t('main'), href: paths.dashboard.root },
          { name: '4Pics 1Word', href: paths.dashboard.games.picsWord.root },
          { name: t('settings.settings') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3 }}>
        <Form methods={form} onSubmit={formSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="maxTimePerPlayer"
                label={t('settings.maxTimeForPlayer')}
                type="number"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="maxWordLength"
                label={t('settings.maxWordLength')}
                type="number"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="gemsPerGameWin"
                label={t('settings.diamondsToWin')}
                type="number"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="starsPerGameWin" label={t('settings.starsToWin')} type="number" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="minWordLength"
                label={t('settings.minWordLength')}
                type="number"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFSelect name="defaultLanguage" label={t('settings.defaultLanguage')}>
                <MenuItem value="en">{t('settings.english')}</MenuItem>
                <MenuItem value="ru">{t('settings.russian')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="maxPlayers" label={t('settings.maxPlayers')} type="number" />
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              gap={1}
            >
              <Button onClick={() => form.reset()} type="button" variant="outlined" color="inherit">
                {t('cancel')}
              </Button>
              <Button loading={isPending} type="submit" variant="contained" color="primary">
                {t('save')}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Card>
    </DashboardContent>
  );
};
