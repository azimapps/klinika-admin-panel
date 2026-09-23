import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Box,
  Tab,
  Card,
  Tabs,
  Alert,
  Stack,
  Button,
  Switch,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import axios from 'src/lib/axios';
import { DashboardContent } from 'src/layouts/dashboard';

type Document = {
  slug: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  body_uz: string;
  body_ru: string;
  body_en: string;
  is_published: boolean;
  version: number;
  updated_at?: string;
};
const documents = [
  ['about', 'Klinika haqida'],
  ['offer', 'Ommaviy oferta'],
  ['agreement', 'Bemor shartnomasi'],
];
const empty = (slug: string): Document => ({
  slug,
  title_uz: '',
  title_ru: '',
  title_en: '',
  body_uz: '',
  body_ru: '',
  body_en: '',
  is_published: false,
  version: 0,
});

function readDraft(slug: string): Document | null {
  try {
    const raw = sessionStorage.getItem(`clinic-content-draft:${slug}`);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    const textFields = ['title_uz', 'title_ru', 'title_en', 'body_uz', 'body_ru', 'body_en'];
    return draft.slug === slug &&
      Number.isInteger(draft.version) &&
      typeof draft.is_published === 'boolean' &&
      textFields.every((field) => typeof draft[field] === 'string')
      ? draft
      : null;
  } catch {
    return null;
  }
}

function DocumentEditor({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const [draft] = useState(() => readDraft(slug));
  const [form, setForm] = useState<Document>(draft ?? empty(slug));
  const [dirty, setDirty] = useState(draft !== null);
  const [draftStorageFailed, setDraftStorageFailed] = useState(false);
  const [language, setLanguage] = useState<'uz' | 'ru' | 'en'>('uz');
  const query = useQuery<Document[]>({
    queryKey: ['content'],
    queryFn: async () => (await axios.get('/admin/content')).data,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (query.data && !dirty) setForm(query.data.find((item) => item.slug === slug) ?? empty(slug));
  }, [query.data, slug, dirty]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => {
    try {
      const key = `clinic-content-draft:${slug}`;
      if (dirty) sessionStorage.setItem(key, JSON.stringify(form));
      else sessionStorage.removeItem(key);
      setDraftStorageFailed(false);
    } catch {
      setDraftStorageFailed(true);
    }
  }, [form, dirty, slug]);
  const save = useMutation({
    mutationFn: async () => (await axios.put(`/admin/content/${slug}`, form)).data as Document,
    onSuccess: (saved) => {
      queryClient.setQueryData<Document[]>(['content'], (old) => [
        ...(old ?? []).filter((item) => item.slug !== slug),
        saved,
      ]);
      setForm(saved);
      setDirty(false);
      toast.success('Saqlandi. Mobil ilovada hujjatni oching yoki yangilang.');
    },
  });
  const change = (key: keyof Document, value: string | boolean) => {
    setForm((old) => ({ ...old, [key]: value }));
    setDirty(true);
  };
  if (query.isPending) return <CircularProgress />;
  if (query.isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => query.refetch()}>Qayta urinish</Button>}
      >
        Hujjatlarni yuklab bo‘lmadi.
      </Alert>
    );
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        {dirty && (
          <Alert severity={draftStorageFailed ? 'warning' : 'info'}>
            {draftStorageFailed
              ? 'Qoralamani brauzerda saqlab bo‘lmadi. Sahifadan chiqishdan oldin matnni nusxalab oling.'
              : 'Saqlanmagan qoralama shu brauzer oynasida saqlanadi. Mobil ilovaga chiqarish uchun Saqlash tugmasini bosing.'}
          </Alert>
        )}
        <Alert severity="info">
          Saqlangan va e’lon qilingan matn mobil ilovada ochilganda yoki yangilanganda ko‘rinadi.
          Tarjima kiritilmasa, asl o‘zbekcha matn ko‘rsatiladi.
        </Alert>
        <Tabs value={language} onChange={(_, value) => setLanguage(value)}>
          <Tab value="uz" label="O‘zbekcha (asl matn)" />
          <Tab value="ru" label="Русский" />
          <Tab value="en" label="English" />
        </Tabs>
        <TextField
          disabled={save.isPending}
          label="Sarlavha"
          value={form[`title_${language}`]}
          onChange={(e) => change(`title_${language}`, e.target.value)}
          required={language === 'uz'}
        />
        <TextField
          disabled={save.isPending}
          label="Hujjat matni"
          multiline
          minRows={14}
          maxRows={28}
          value={form[`body_${language}`]}
          onChange={(e) => change(`body_${language}`, e.target.value)}
          required={language === 'uz'}
          helperText="Oddiy matn. Xatboshi va raqamlarni saqlang."
        />
        <FormControlLabel
          control={
            <Switch
              disabled={save.isPending}
              checked={form.is_published}
              onChange={(_, value) => change('is_published', value)}
            />
          }
          label="Mobil ilovada e’lon qilish"
        />
        {save.isError && (
          <Alert severity="error">
            {(save.error as { detail?: unknown })?.detail ===
            'Document changed. Reload before saving.'
              ? 'Hujjat boshqa oynada o‘zgartirilgan. Matningizni nusxalab oling, so‘ng qoralamani bekor qilib, yangilang.'
              : 'Saqlab bo‘lmadi. Matnni tekshiring va qayta urinib ko‘ring.'}
          </Alert>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            disabled={!dirty || save.isPending || !form.title_uz.trim() || !form.body_uz.trim()}
            onClick={() => save.mutate()}
          >
            {save.isPending ? 'Saqlanmoqda…' : 'Saqlash'}
          </Button>
          {dirty && (
            <Button
              disabled={save.isPending}
              onClick={() => {
                if (window.confirm('Saqlanmagan qoralama bekor qilinsinmi?')) {
                  setDirty(false);
                  setForm(query.data?.find((item) => item.slug === slug) ?? empty(slug));
                  save.reset();
                  query.refetch();
                }
              }}
            >
              Qoralamani bekor qilish
            </Button>
          )}
          <Typography variant="body2" color="text.secondary">
            Versiya {form.version}
            {dirty ? ' · Saqlanmagan o‘zgarishlar' : ''}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}

export default function ContentPage() {
  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Typography variant="h4">Klinika va hujjatlar</Typography>
        {documents.map(([slug, title]) => (
          <Box key={slug}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {title}
            </Typography>
            <DocumentEditor slug={slug} />
          </Box>
        ))}
      </Stack>
    </DashboardContent>
  );
}
