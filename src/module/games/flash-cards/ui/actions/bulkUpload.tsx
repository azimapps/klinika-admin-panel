import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import {
  Grid,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { Form, RHFUpload, RHFUploadBox } from 'src/components/hook-form';

import { useSendBulkJson, useSendBulkAudio } from '../../hooks/useSendBulk';

export const BulkUpload = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { mutateAsyncJson, isPendingJson } = useSendBulkJson();
  const { mutateAsyncAudio, isPendingAudio } = useSendBulkAudio();
  const form = useForm({
    defaultValues: {
      json: null,
      audio: [],
    },
  });
  const watcher = form.watch();
  const onRemoveJson = () => {
    form.setValue('json', null);
  };
  const handleRemoveAllFiles = useCallback(() => {
    form.setValue('audio', []);
  }, [form]);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = watcher.audio && watcher.audio?.filter((file) => file !== inputFile);
      form.setValue('audio', filtered);
    },
    [form, watcher.audio]
  );

  const formSubmit = form.handleSubmit(async (values: any) => {
    const jsonFormData = new FormData();
    if (values.json) {
      jsonFormData.append('file', values.json);
    }

    const audioFormData = new FormData();
    if (values.audio && values.audio.length > 0) {
      values.audio.forEach((file: File) => {
        audioFormData.append('files', file);
      });
    }

    try {
      if (values.json) {
        await mutateAsyncJson(jsonFormData);
      }
      if (values.audio && values.audio.length > 0) {
        await mutateAsyncAudio(audioFormData);
      }
      form.reset();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Form methods={form} onSubmit={formSubmit}>
        <DialogTitle>Bulk Upload</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body1">JSON</Typography>
              <RHFUploadBox
                name="json"
                accept={{ file: ['application/json'] }}
                onDelete={onRemoveJson}
                sx={{ width: '100%', height: 56 }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body1">Audio</Typography>
              <RHFUpload
                name="audio"
                multiple
                accept={{ file: ['audio/*'] }}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                sx={{
                  h: 100,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={isPendingJson || isPendingAudio}
            variant="contained"
            type="submit"
            disabled={isPendingJson || isPendingAudio}
          >
            Upload
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
