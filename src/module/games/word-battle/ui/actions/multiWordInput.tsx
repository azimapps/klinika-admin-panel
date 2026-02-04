import Papa from 'papaparse';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Card, Chip, Grid, TextField } from '@mui/material';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';

import type { CreateCategoryFormType } from '../../service/FormScheme';

interface Props {
  mt?: number;
}

export function DynamicFieldArray({ mt }: Props) {
  const { t } = useTranslate('word-battle');
  const { setValue, getValues, watch } = useFormContext<CreateCategoryFormType>();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const wordsValue = watch('words');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.endsWith(',')) {
      const item = value.slice(0, -1).trim();
      const currentWords = getValues('words') || [];
      if (item && !currentWords.includes(item)) {
        setValue('words', [...currentWords, item]);
      }
      setInputValue('');
    } else {
      setInputValue(value);
    }
  };

  const handleFileUpload = (event: Array<File>) => {
    const file = event?.[0];
    if (!file) return;

    setIsLoading(true);
    const words = getValues('words');

    Papa.parse<string[]>(file, {
      chunk: (result) => {
        if (!Array.isArray(result.data)) return;

        const newWords = result.data
          .flat()
          .map((word) => word.trim())
          .filter((word) => word && !words.includes(word));

        setValue('words', [...newWords, ...words]);
      },
      complete: () => {
        setIsLoading(false);
      },
      skipEmptyLines: true,
      worker: true,
    });

    event = [];
  };

  const handleDelete = (wordName: string) => {
    const arrayWords = getValues('words');
    setValue(
      'words',
      arrayWords.filter((el: string) => el !== wordName)
    );
  };
  return (
    <>
      <Grid container size={{ xs: 12 }} spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="words"
            label={t('create.words')}
            onChange={handleInputChange}
            value={inputValue}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <UploadBox
            sx={{ width: '100%', height: '100%' }}
            placeholder={
              isLoading ? <Iconify icon="custome:loading" width={30} /> : t('create.upload')
            }
            onDrop={(e) => handleFileUpload(e)}
          />
        </Grid>
      </Grid>
      {wordsValue.length > 0 && (
        <Grid size={{ xs: 12 }} mt={mt}>
          <Card variant="outlined" sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Array.from(wordsValue).map((el: string, index: number) => (
                <Chip
                  key={index}
                  variant="outlined"
                  size="small"
                  color="primary"
                  label={el}
                  onDelete={() => handleDelete(el)}
                />
              ))}
            </Box>
          </Card>
        </Grid>
      )}
    </>
  );
}
