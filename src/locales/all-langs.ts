// core (MUI)
import { enUS as enUSCore } from '@mui/material/locale';
// date pickers (MUI)
import { enUS as enUSDate } from '@mui/x-date-pickers/locales';
// data grid (MUI)
import { enUS as enUSDataGrid, ruRU as ruRUDataGrid } from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: {
        ...enUSCore.components,
        ...enUSDate.components,
        ...enUSDataGrid.components,
      },
    },
  },
  {
    value: 'ru',
    label: 'Russian',
    countryCode: 'RU',
    adapterLocale: 'ru',
    numberFormat: { code: 'ru-RU', currency: 'RUB' },
    systemValue: {
      components: {
        // Only data grid is available for ruRU
        ...ruRUDataGrid.components,
      },
    },
  },
  {
    value: 'uz',
    label: 'Uzbek',
    countryCode: 'UZ',
    adapterLocale: 'uz',
    numberFormat: { code: 'uz-UZ', currency: 'UZS' },
    systemValue: {
      // Fallback to English components for now, since MUI doesn’t offer uz localization
      components: {
        ...enUSCore.components,
        ...enUSDate.components,
        ...enUSDataGrid.components,
      },
    },
  },
];
