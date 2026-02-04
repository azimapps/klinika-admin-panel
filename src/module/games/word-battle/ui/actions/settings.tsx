import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, Grid, Button, MenuItem, CardActions } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Form, RHFSelect, RHFSwitch, RHFTextField } from 'src/components/hook-form';

import { useUpdateSettings } from '../../hooks/useUpdateSettings';
import { settingsSchema, type SettingsSchema } from '../../service/SettingsScheme';

interface Props {
  settings?: SettingsSchema;
}

export const Settings = ({ settings }: Props) => {
  const { t } = useTranslate('word-battle');
  const { isPending, mutateAsync } = useUpdateSettings();
  const form = useForm<SettingsSchema>({
    defaultValues: {
      maxTimePerPlayer: settings?.maxTimePerPlayer || 60,
      maxWordLength: settings?.maxWordLength || 10,
      gemsPerGameWin: settings?.gemsPerGameWin || 1,
      starsPerGameWin: settings?.starsPerGameWin || 1,
      minWordLength: settings?.minWordLength || 1,
      allowDuplicateWords: settings?.allowDuplicateWords || false,
      defaultLanguage: settings?.defaultLanguage || 'en',
      maxPlayers: settings?.maxPlayers || 2,
    },
    resolver: zodResolver(settingsSchema),
  });

  const formSubmit = form.handleSubmit(async (value: SettingsSchema) => {
    await mutateAsync(value);
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('settings.gameSettings')}
        links={[
          { name: t('settings.main'), href: paths.dashboard.root },
          { name: 'Word Battle', href: paths.dashboard.games.wordBattle.root },
          { name: t('settings.settings') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Form methods={form} onSubmit={formSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="maxTimePerPlayer" label={t('settings.maxTime')} type="number" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="maxWordLength"
                label={t('settings.maxWordLength')}
                type="number"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="gemsPerGameWin" label={t('settings.winApples')} type="number" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField name="starsPerGameWin" label={t('settings.winStars')} type="number" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="minWordLength"
                label={t('settings.minWordLength')}
                type="number"
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="maxPlayers"
                label={t('settings.maxPlayers')}
                type="number"
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <RHFSelect name="defaultLanguage" label={t('settings.mainLanguage')} disabled>
                <MenuItem value="en">{t('settings.en')}</MenuItem>
                <MenuItem value="ru">{t('settings.ru')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RHFSwitch
                disabled
                name="allowDuplicateWords"
                label={t('settings.allowDuplicates')}
              />
            </Grid>
          </Grid>
          <CardActions
            sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 1, p: 0 }}
          >
            <Button type="button" variant="outlined" color="inherit">
              {t('settings.cancel')}
            </Button>
            <Button loading={isPending} type="submit" variant="contained" color="primary">
              {t('settings.save')}
            </Button>
          </CardActions>
        </Form>
      </Card>
    </DashboardContent>
  );
};
