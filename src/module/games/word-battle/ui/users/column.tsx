import type { TFunction } from 'i18next';

import { type GridColDef } from '@mui/x-data-grid';

import type { IUserStatsList } from '../../types/UserList';

interface Props {
  t: TFunction;
}

export const wordBattleUsersCol = ({ t }: Props): GridColDef<IUserStatsList>[] => [
  {
    headerName: t('users.name'),
    flex: 1,
    field: 'fullName',
  },
  {
    headerName: t('users.wordsCount'),
    flex: 1,
    field: 'wordsCount',
    align: 'center',
  },
  {
    headerName: t('users.stars'),
    flex: 1,
    field: 'stars',
  },
  {
    headerName: t('users.gems'),
    flex: 1,
    field: 'diamonds',
  },

  {
    headerName: t('users.streak'),
    flex: 1,
    field: 'streaksCount',
  },
  {
    headerName: t('users.gamesCount'),
    flex: 1,
    field: 'gamesCount',
  },
  {
    headerName: t('users.vicoties'),
    flex: 1,
    field: 'gamesWon',
  },
  {
    headerName: t('users.defeats'),
    flex: 1,
    field: 'gamesLost',
  },
];
