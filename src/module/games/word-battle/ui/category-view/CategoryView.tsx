import { Navigate } from 'react-router';
import { useMemo, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Card, Chip, Button, TextField, LinearProgress } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { WordAdd } from '../actions/wordAdd';
import { WordEdit } from '../actions/wordEdit';
import { useDeleteWord } from '../../hooks/useDeleteWord';
import { useGetWordsList } from '../../hooks/useGetWordsList';

export const CategoryView = ({ id }: { id: string }) => {
  const { t } = useTranslate('word-battle');
  const { data, isLoading, error } = useGetWordsList(id);
  const openEditWord = useBoolean();
  const openAddWord = useBoolean();
  const [searchWord, setSearchWord] = useState<string>('');
  const [editableWord, setEditableWord] = useState<string>();
  const { isDeleting, onDeleteWord } = useDeleteWord(id);

  const searchedWords =
    useMemo(
      () => data?.words.filter((el) => el.includes(searchWord)) || [],
      [data?.words, searchWord]
    ) || [];

  if (error) return <Navigate to="/error/500" />;
  if (isLoading) return <LinearProgress />;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`${data?.category.name} ${t('innerTable.words')} (${searchedWords.length} ${t('innerTable.word')})`}
        links={[
          { name: t('main'), href: paths.dashboard.root },
          { name: 'Word Battle', href: paths.dashboard.games.wordBattle.root },
          { name: data?.category.name, href: paths.dashboard.games.wordBattle.list },
          { name: t('innerTable.words') },
        ]}
        action={
          <>
            <TextField
              size="small"
              label={t('innerTable.searchWord')}
              onChange={(e) => setSearchWord(e.target.value)}
            />
            <Button
              onClick={openAddWord.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('add')}
            </Button>
          </>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {searchedWords.map((word: string) => (
          <Chip
            key={crypto.randomUUID()}
            label={word}
            color="primary"
            variant="outlined"
            loading={isDeleting}
            onDelete={async () => await onDeleteWord([word])}
            component={Button}
            onClick={() => {
              openEditWord.onTrue();
              setEditableWord(word);
            }}
          />
        ))}
      </Card>
      {editableWord && (
        <WordEdit
          open={openEditWord.value}
          onClose={openEditWord.onFalse}
          word={editableWord}
          id={id}
        />
      )}
      <WordAdd open={openAddWord.value} onClose={openAddWord.onFalse} id={id} />
    </DashboardContent>
  );
};
