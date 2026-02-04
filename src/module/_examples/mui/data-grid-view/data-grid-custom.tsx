import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import { TextField, InputAdornment } from '@mui/material';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

interface IProps<T> extends Omit<React.ComponentProps<typeof DataGrid>, 'columns' | 'rows'> {
  data: T[];
  column: GridColDef[];
  loading?: boolean;
  search?: string;
  onSearchChange?: (e: string) => void;
  rowCount?: number;
  quickToolbar: boolean;
}

export function DataGridCustom<T>({
  data,
  column,
  loading,
  search,
  onSearchChange,
  rowCount,
  quickToolbar,
  ...props
}: IProps<T>) {
  const { t } = useTranslate('users');
  return (
    <Box position="relative" height={650}>
      {!quickToolbar && (
        <Box position="absolute" py={2} pl={2} zIndex={1}>
          <TextField
            type="search"
            placeholder={t('search')}
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      )}
      <DataGrid
        checkboxSelection
        disableRowSelectionOnClick
        rows={data as GridValidRowModel[]}
        columns={column}
        loading={loading}
        getRowId={(row) => row.id || crypto.randomUUID()}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[5, 10, 20, 50, 100, { value: -1, label: 'All' }]}
        slots={{
          toolbar: () => (
            <GridToolbarContainer>
              {quickToolbar && <GridToolbarQuickFilter />}
              <Box sx={{ flexGrow: 1 }} />
              <GridToolbarColumnsButton />
              <GridToolbarDensitySelector />
              <GridToolbarExport />
            </GridToolbarContainer>
          ),
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title="No results found" />,
        }}
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
          },
        }}
        sx={{
          [`& .${gridClasses.cell}`]: {
            alignItems: 'center',
            display: 'inline-flex',
            borderLeft: (theme) => `1px dashed ${theme.palette.divider}`,
          },
          '.MuiDataGrid-toolbarContainer': {
            height: '86px',
          },
        }}
        rowCount={rowCount}
        {...props}
      />
    </Box>
  );
}
