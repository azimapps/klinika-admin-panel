import type { TFunction } from 'i18next';
import type { Theme } from '@mui/material/styles';
import type { IAudioSearchRes } from 'src/module/games/4pics-1word/types/Questions';

import { memo, useMemo } from 'react';

import { type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Switch, Skeleton, TextField, Autocomplete } from '@mui/material';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { InstagramAudioPlayer } from 'src/components/audio-player';

import type { ITopicWord } from '../../types/WordList';

interface IProps {
  onEdit: (row: ITopicWord) => void;
  onDelete: (id: string) => void;
  onAudioSelect: (rowId: string, audioUrl: string) => void;
  theme: Theme;
  t: TFunction;
  isUpdatingAudio: boolean;
  onUpdateStatus: (id: string, isActive: boolean) => void;
}

// Memoized components for better performance
const StatusCell = memo(
  ({
    row,
    isUpdatingAudio,
    onUpdateStatus,
  }: {
    row: ITopicWord;
    isUpdatingAudio: boolean;
    onUpdateStatus: (id: string, isActive: boolean) => void;
  }) => {
    if (isUpdatingAudio) {
      return <Skeleton variant="text" width="100%" height={40} />;
    }
    return (
      <Switch checked={row.isActive} onChange={(e) => onUpdateStatus(row.id, e.target.checked)} />
    );
  }
);

const AudioCell = memo(
  ({
    row,
    isUpdatingAudio,
    audioOptions,
    isAudioLoading,
    onAudioSelect,
    search,
    handleSearchChange,
  }: {
    row: ITopicWord;
    isUpdatingAudio: boolean;
    audioOptions: IAudioSearchRes[];
    isAudioLoading: boolean;
    onAudioSelect: (rowId: string, audioUrl: string) => void;
    search: string | undefined;
    handleSearchChange: (value?: string) => void;
  }) => {
    if (row.audio && row.audio.trim() !== '') {
      return <InstagramAudioPlayer audioUrl={row.audio} />;
    }

    if (isUpdatingAudio) {
      return <Skeleton variant="text" width="100%" height={40} />;
    }

    return (
      <Box sx={{ width: '100%', mt: 1.5 }}>
        <Autocomplete
          fullWidth
          size="small"
          options={audioOptions || []}
          loading={isAudioLoading}
          getOptionLabel={(option: any) => option.name}
          value={undefined}
          onChange={(_, newValue) => {
            if (newValue) {
              onAudioSelect(row.id, newValue.url);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search audio"
              variant="outlined"
              onChange={(e) => handleSearchChange(e.target.value || undefined)}
              value={search}
            />
          )}
          renderOption={(props, option: IAudioSearchRes) => (
            <Box component="li" {...props}>
              {option.name}
            </Box>
          )}
        />
      </Box>
    );
  }
);

// Helper function to create action items
const createActionItems = (
  row: ITopicWord,
  theme: Theme,
  t: TFunction,
  onEdit: (row: ITopicWord) => void,
  onDelete: (id: string) => void
) => [
  <GridActionsCellItem
    key="edit"
    showInMenu
    icon={<Iconify icon="solar:pen-bold" color={theme.palette.success.dark} />}
    label={t('edit')}
    sx={{ color: theme.palette.success.dark }}
    onClick={() => onEdit(row)}
  />,
  <GridActionsCellItem
    key="delete"
    showInMenu
    icon={<Iconify icon="solar:trash-bin-trash-bold" color={theme.palette.error.dark} />}
    label={t('delete')}
    sx={{ color: theme.palette.error.dark }}
    onClick={() => onDelete(row.id)}
  />,
];

export const useFlashCardTopicWordColumn = ({
  onEdit,
  onDelete,
  onAudioSelect,
  theme,
  t,
  search,
  handleSearchChange,
  audioOptions,
  isAudioLoading,
  isUpdatingAudio,
  onUpdateStatus,
}: IProps & {
  search: string | undefined;
  handleSearchChange: (value?: string) => void;
  audioOptions: IAudioSearchRes[];
  isAudioLoading: boolean;
}): GridColDef<ITopicWord>[] =>
  useMemo(
    () => [
      {
        headerName: t('table.image'),
        field: 'image',
        flex: 1,
        renderCell: ({ row }) => (
          <Image
            src={row.image}
            alt={`${row.topic}.image`}
            sx={{ width: '50px', height: '50px', borderRadius: '5px' }}
          />
        ),
      },
      {
        headerName: t('innerTable.wordT'),
        field: 'text',
        flex: 1,
      },
      {
        headerName: t('innerTable.translate'),
        field: 'translation',
        flex: 1,
      },
      {
        headerName: t('innerTable.status'),
        field: 'isActive',
        flex: 1,
        renderCell: ({ row }) => (
          <StatusCell row={row} isUpdatingAudio={isUpdatingAudio} onUpdateStatus={onUpdateStatus} />
        ),
      },
      {
        headerName: t('innerTable.audio'),
        field: 'audio',
        flex: 1,
        renderCell: ({ row }) => (
          <AudioCell
            row={row}
            isUpdatingAudio={isUpdatingAudio}
            audioOptions={audioOptions}
            isAudioLoading={isAudioLoading}
            onAudioSelect={onAudioSelect}
            search={search}
            handleSearchChange={handleSearchChange}
          />
        ),
      },
      {
        field: 'action',
        type: 'actions',
        getActions: ({ row }) => createActionItems(row, theme, t, onEdit, onDelete),
      },
    ],
    [
      t,
      isUpdatingAudio,
      onUpdateStatus,
      audioOptions,
      isAudioLoading,
      onAudioSelect,
      search,
      handleSearchChange,
      theme,
      onEdit,
      onDelete,
    ]
  );
