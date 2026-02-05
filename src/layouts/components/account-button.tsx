import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { varTap, varHover, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

export type AccountButtonProps = IconButtonProps & {
  photoURL: string;
  displayName: string;
};

export function AccountButton({ photoURL, displayName, sx, ...other }: AccountButtonProps) {
  return (
    <IconButton
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Account button"
      sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Avatar src={photoURL} alt={displayName} sx={{ width: 40, height: 40 }}>
        {displayName?.charAt(0).toUpperCase()}
      </Avatar>
    </IconButton>
  );
}
