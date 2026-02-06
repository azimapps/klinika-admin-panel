import type { TextFieldProps } from '@mui/material/TextField';
import type { Value, Country } from 'react-phone-number-input/input';

import { useState, useCallback } from 'react';
import { parsePhoneNumber } from 'react-phone-number-input';
import PhoneNumberInput from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';

import { countries } from 'src/assets/data/countries';

import { Iconify } from '../iconify';
import { CountryListPopover } from './list-popover';

import type { PhoneInputProps } from './types';

// ----------------------------------------------------------------------

export function PhoneInput({
  sx,
  size,
  value,
  label,
  onChange,
  placeholder,
  disableSelect,
  variant = 'outlined',
  country: inputCountryCode,
  ...other
}: PhoneInputProps) {
  const [searchCountry, setSearchCountry] = useState('');

  const currentCountryCode = getCountryCode(value, inputCountryCode);

  const hasLabel = !!label;

  const cleanValue = value ? value.replace(/[\s-]+/g, '') : '';

  const handleClear = useCallback(() => {
    onChange('' as Value);
  }, [onChange]);

  const handleSearchCountry = (inputValue: string) => {
    setSearchCountry(inputValue);
  };

  const handleClickCountry = useCallback(
    (inputValue: Country) => {
      // Logic from similar components: manually selecting a country can just clear the value 
      // or we can try to append the dial code. For now, let's keep it simple.
      onChange('' as Value);
    },
    [onChange]
  );

  return (
    <Box
      sx={[
        () => ({
          '--popover-button-mr': '12px',
          '--popover-button-height': '22px',
          '--popover-button-width': variant === 'standard' ? '48px' : '60px',
          position: 'relative',
          ...(!disableSelect && {
            [`& .${inputBaseClasses.input}`]: {
              pl: 'calc(var(--popover-button-width) + var(--popover-button-mr))',
            },
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {!disableSelect && (
        <CountryListPopover
          countries={countries}
          searchCountry={searchCountry}
          countryCode={currentCountryCode}
          onClickCountry={handleClickCountry}
          onSearchCountry={handleSearchCountry}
          sx={{
            pl: variant === 'standard' ? 0 : 1.5,
            ...(variant === 'standard' && hasLabel && { mt: size === 'small' ? '16px' : '20px' }),
            ...((variant === 'filled' || variant === 'outlined') && {
              mt: size === 'small' ? '8px' : '16px',
            }),
            ...(variant === 'filled' && hasLabel && { mt: size === 'small' ? '21px' : '25px' }),
          }}
        />
      )}

      <PhoneNumberInput
        size={size}
        label={label}
        value={cleanValue}
        variant={variant}
        onChange={onChange}
        hiddenLabel={!label}
        country={currentCountryCode}
        inputComponent={CustomInput}
        placeholder={placeholder ?? 'Enter phone number'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: cleanValue && (
              <InputAdornment position="end">
                <IconButton size="small" edge="end" onClick={handleClear}>
                  <Iconify width={16} icon="mingcute:close-line" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        {...other}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

function CustomInput({ ref, ...other }: TextFieldProps) {
  return <TextField inputRef={ref} {...other} />;
}

// ----------------------------------------------------------------------

function getCountryCode(inputValue: string, countryCode?: Country): Country {
  if (inputValue) {
    try {
      const phoneNumber = parsePhoneNumber(inputValue);
      if (phoneNumber?.country) {
        return phoneNumber.country as Country;
      }
    } catch {
      // Do nothing
    }
  }

  return (countryCode || 'UZ') as Country;
}
