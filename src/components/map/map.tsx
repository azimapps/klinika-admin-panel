import type { Theme, SxProps } from '@mui/material/styles';
import type { MapRef, MapProps as ReactMapProps } from 'react-map-gl/mapbox';

import ReactMap from 'react-map-gl/mapbox';

import { styled } from '@mui/material/styles';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export type MapProps = ReactMapProps & {
  sx?: SxProps<Theme>;
  ref?: React.RefObject<MapRef | null>;
};

export function Map({ ref, sx, ...other }: MapProps) {
  return (
    <MapRoot sx={sx}>
      <ReactMap ref={ref} mapboxAccessToken={CONFIG.mapboxApiKey} {...other} />
    </MapRoot>
  );
}

// ----------------------------------------------------------------------

const MapRoot = styled('div')({
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
});
