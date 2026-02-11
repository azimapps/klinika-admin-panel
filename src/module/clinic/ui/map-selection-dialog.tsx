
import { useRef, useState, useCallback } from 'react';
import { YMaps, Placemark, Map as YMap, ZoomControl } from '@pbe/react-yandex-maps';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (coords: [number, number], addresses: { uz: string; ru: string; en: string }) => void;
    initialCoords?: [number, number];
}

// --- UTILS ---
const toLatin = (text: string): string => {
    if (!text) return "";
    const map: Record<string, string> = {
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'J', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'X', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'ъ': "'", 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'Ў': "O'", 'ў': "o'", 'Қ': 'Q', 'қ': 'q', 'Ғ': "G'", 'ғ': "g'", 'Ҳ': 'H', 'ҳ': 'h'
    };
    return text.split('').map(char => map[char] || char).join('');
};

export function MapSelectionDialog({ open, onClose, onSelect, initialCoords }: Props) {
    const [coords, setCoords] = useState<[number, number] | null>(initialCoords || null);
    const [loading, setLoading] = useState(false);
    const [mapState, setMapState] = useState({
        center: initialCoords || [41.2995, 69.2401],
        zoom: initialCoords ? 15 : 12,
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [options, setOptions] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const searchTimeout = useRef<any>(null);

    const onMapClick = useCallback((event: any) => {
        const newCoords = event.get('coords');
        if (newCoords) {
            setCoords(newCoords);
        }
    }, []);

    const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d < 1 ? `${(d * 1000).toFixed(0)} m` : `${d.toFixed(1)} km`;
    }, []);

    const handleSearch = useCallback(async (query: string) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }

        searchTimeout.current = setTimeout(async () => {
            setSearching(true);
            try {
                const response = await fetch(
                    `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${encodeURIComponent(query + ", Ташкент, Узбекистан")}&lang=ru_RU&results=10`
                );
                const data = await response.json();
                const members = data.response?.GeoObjectCollection?.featureMember || [];

                const results = members.map((m: any) => {
                    const obj = m.GeoObject;
                    const pos = obj.Point.pos.split(' ').map(Number);
                    const fullAddress = obj.metaDataProperty.GeocoderMetaData.text;
                    const kind = obj.metaDataProperty.GeocoderMetaData.kind;

                    const parts = fullAddress.split(', ');
                    const title = toLatin(parts[parts.length - 1]);
                    const subtitle = toLatin(parts.slice(0, -1).join(', '));

                    let icon = 'solar:map-point-bold';
                    if (kind === 'metro') icon = 'material-symbols:directions-subway';
                    if (kind === 'district') icon = 'solar:city-bold';
                    if (kind === 'street') icon = 'solar:streets-bold';
                    if (kind === 'station') icon = 'material-symbols:directions-bus';

                    return {
                        label: toLatin(fullAddress),
                        title,
                        subtitle,
                        icon,
                        coords: [pos[1], pos[0]],
                        distance: calculateDistance(
                            mapState.center[0],
                            mapState.center[1],
                            pos[1],
                            pos[0]
                        )
                    };
                });

                setOptions(results);
            } catch (error) {
                console.error('Search error:', error);
                setOptions([]);
            } finally {
                setSearching(false);
            }
        }, 400);
    }, [mapState.center, calculateDistance]);

    const handleSelectOption = useCallback(async (option: any) => {
        if (!option) return;

        setCoords(option.coords);
        setMapState({
            center: option.coords,
            zoom: 17,
        });
    }, []);

    const handleSelect = async () => {
        if (!coords) return;

        setLoading(true);
        try {
            const fetchAddress = async (lang: string) => {
                const response = await fetch(
                    `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${coords[1]},${coords[0]}&lang=${lang}`
                );
                const data = await response.json();
                return (
                    data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.metaDataProperty
                        ?.GeocoderMetaData?.text || ''
                );
            };

            const [uz, ru, en] = await Promise.all([
                fetchAddress('uz_UZ'),
                fetchAddress('ru_RU'),
                fetchAddress('en_US'),
            ]);

            onSelect(coords, { uz, ru, en });
            onClose();
        } catch (error) {
            console.error('Geocoding error:', error);
            onSelect(coords, { uz: '', ru: '', en: '' });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Joylashuvni tanlang</DialogTitle>

            <DialogContent sx={{ p: 0, height: 600, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1, width: 400 }}>
                    <Autocomplete
                        fullWidth
                        autoHighlight
                        options={options}
                        loading={searching}
                        filterOptions={(x) => x}
                        noOptionsText="Manzil topilmadi"
                        loadingText="Qidirilmoqda..."
                        getOptionLabel={(option: any) => (typeof option === 'string' ? option : option.label) || ''}
                        isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
                        onInputChange={(event, value, reason) => {
                            if (reason === 'input') {
                                setSearchQuery(value);
                                handleSearch(value);
                            }
                        }}
                        onChange={(event, newValue: any) => {
                            if (newValue) {
                                handleSelectOption(newValue);
                            }
                        }}
                        PaperComponent={(paperProps) => (
                            <Paper
                                {...paperProps}
                                sx={{
                                    mt: 1,
                                    bgcolor: 'rgba(33, 33, 33, 0.9)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'white',
                                    '& .MuiAutocomplete-option': {
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
                                    },
                                }}
                            />
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Manzilni qidiring..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(33, 33, 33, 0.9)',
                                        backdropFilter: 'blur(8px)',
                                        borderRadius: 2,
                                        color: 'white',
                                        '& fieldset': { border: 'none' },
                                        '&:hover fieldset': { border: 'none' },
                                        '&.Mui-focused fieldset': { border: 'none' },
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Iconify icon={"eva:search-fill" as any} sx={{ color: 'text.disabled', ml: 1 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchQuery && (
                                            <InputAdornment position="end">
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setOptions([]);
                                                    }}
                                                    sx={{ minWidth: 0, p: 0.5, mr: 1, color: 'text.disabled' }}
                                                >
                                                    <Iconify icon={"eva:close-fill" as any} width={16} />
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box component="li" {...props} key={option.coords.join(',')} sx={{ px: 2, py: 1.5 }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'action.selected',
                                            flexShrink: 0
                                        }}
                                    >
                                        <Iconify icon={option.icon as any} width={24} sx={{ color: 'text.secondary' }} />
                                    </Box>

                                    <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                                        <Typography variant="subtitle2" noWrap>
                                            {option.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                                            {option.subtitle}
                                        </Typography>
                                    </Stack>

                                    <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0 }}>
                                        {option.distance}
                                    </Typography>
                                </Stack>
                            </Box>
                        )}
                    />
                </Box>

                <YMaps query={{ lang: 'ru_RU' }}>
                    <YMap
                        onLoad={() => { }}
                        width="100%"
                        height="100%"
                        state={mapState}
                        onActionEnd={(event: any) => {
                            const map = event.get('target');
                            setMapState({
                                center: map.getCenter(),
                                zoom: map.getZoom(),
                            });
                        }}
                        onClick={onMapClick}
                    >
                        <ZoomControl options={{ position: { top: 16, right: 16 } }} />
                        {coords && <Placemark geometry={coords} />}
                    </YMap>
                </YMaps>
            </DialogContent>

            <DialogActions>
                <Typography variant="caption" sx={{ flexGrow: 1, ml: 2, color: 'text.secondary' }}>
                    {coords ? `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}` : 'Xaritadan nuqtani tanlang'}
                </Typography>
                <Button variant="outlined" onClick={onClose}>
                    Bekor qilish
                </Button>
                <Button variant="contained" onClick={handleSelect} disabled={!coords || loading}>
                    {loading ? 'Yuklanmoqda...' : 'Tanlash'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
