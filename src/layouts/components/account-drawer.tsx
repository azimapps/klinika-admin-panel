import dayjs from 'dayjs';
import { useBoolean } from 'minimal-shared/hooks';

import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';

import { useAuthContext } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export function AccountDrawer() {
  const { user } = useAuthContext();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%' }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: 'primary.main' } },
      }}
    >
      <Avatar
        src="https://pic.rutubelist.ru/user/1f/78/1f7803505691eb33b8c53a0b0dca1cf4.jpg"
        alt={user?.username}
        sx={{ width: 1, height: 1 }}
      >
        {user?.username?.charAt(0).toUpperCase()}
      </Avatar>
    </AnimateBorder>
  );

  const renderList = () => (
    <Stack
      sx={[
        (theme) => ({
          py: 3,
          px: 2.5,
          borderTop: `dashed 1px ${theme.vars.palette.divider}`,
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          '& li': { p: 0 },
        }),
      ]}
    >
      <Box
        p={1}
        sx={{
          display: 'flex',
          typography: 'body2',
          alignItems: 'center',
          color: 'text.secondary',
          '& svg': { width: 24, height: 24 },
        }}
      >
        <Iconify icon="solar:phone-bold" />
        <Typography ml={2}>{user?.phone}</Typography>
      </Box>
      <Box
        p={1}
        sx={{
          display: 'flex',
          typography: 'body2',
          alignItems: 'center',
          color: 'text.secondary',
          '& svg': { width: 24, height: 24 },
        }}
      >
        <Iconify icon="solar:shield-check-bold" />
        <Typography ml={2}>{user?.authProvider}</Typography>
      </Box>
      <Box
        p={1}
        sx={{
          display: 'flex',
          typography: 'body2',
          alignItems: 'center',
          color: 'text.secondary',
          '& svg': { width: 24, height: 24 },
        }}
      >
        <Iconify icon="solar:clock-circle-bold" />
        <Typography ml={2}>{dayjs(user?.lastSeen).format('MMM D, h:mm A')}</Typography>
      </Box>
      <Box
        p={1}
        sx={{
          display: 'flex',
          typography: 'body2',
          alignItems: 'center',
          color: 'text.secondary',
          '& svg': { width: 24, height: 24 },
        }}
      >
        <Iconify icon="solar:verified-check-bold" />
        <Typography ml={2}>{user?.status}</Typography>
      </Box>
    </Stack>
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL="https://pic.rutubelist.ru/user/1f/78/1f7803505691eb33b8c53a0b0dca1cf4.jpg"
        displayName={user?.username}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: 'absolute',
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {renderAvatar()}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {user?.username}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {user?.email}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 3,
              gap: 1,
              flexWrap: 'wrap',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {Array.from(user?.roles, (el: string) => (
              <Label>{el}</Label>
            ))}
          </Box>

          {renderList()}
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}
