'use client';

import { memo, useRef, useState, useEffect } from 'react';

import { Box, Stack, useTheme, IconButton, Typography } from '@mui/material';

import { Iconify } from '../iconify';

interface AudioPlayerProps {
  audioUrl: string;
}

export const InstagramAudioPlayer = memo(({ audioUrl }: AudioPlayerProps) => {
  console.log('render');
  const [isPlaying, setIsPlaying] = useState(false);
  const [, setProgress] = useState(0);
  const [, setCurrentTime] = useState(0);
  const [, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioProgress);
    audio.addEventListener('ended', () => setIsPlaying(false));

    // eslint-disable-next-line consistent-return
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioProgress);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!audioUrl) {
    return <Typography variant="body2">Mavjud emas</Typography>;
  }

  return (
    <Box display="flex" alignItems="center" maxWidth="400px" padding="8px 0">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <IconButton
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        sx={{
          bgcolor: theme.palette.primary.dark,
          color: '#fff',
          borderRadius: '50%',
          width: 35,
          height: 35,
          minWidth: 35,
          marginRight: 1.5,
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
          },
        }}
      >
        {isPlaying ? (
          <Iconify icon="carbon:pause" width={18} />
        ) : (
          <Iconify icon="carbon:play" width={18} style={{ marginLeft: 2 }} />
        )}
      </IconButton>

      <Stack spacing={0.5} flex={1}>
        <Box display="flex" height="16px" alignItems="center" gap="2px">
          {Array.from({ length: 20 }).map((_, i) => {
            const randomHeight = Math.random() * 0.8 + 0.2;
            const height = randomHeight * 16;
            return (
              <Box
                key={i}
                width="2px"
                height={`${height}px`}
                bgcolor={theme.palette.primary.light}
              />
            );
          })}
        </Box>
      </Stack>
    </Box>
  );
});
