import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

import { settingIcons } from './icons';
import { useSettingsContext } from '../context/use-settings-context';

// ----------------------------------------------------------------------

export function ThemeToggleButton() {
    const settings = useSettingsContext();
    const { mode, setMode } = useColorScheme();

    const handleToggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        settings.setState({ colorScheme: newMode });
    };

    return (
        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={handleToggleTheme}>
                {mode === 'light' ? (
                    <SvgIcon>{settingIcons.moon}</SvgIcon>
                ) : (
                    <SvgIcon>{settingIcons.sun}</SvgIcon>
                )}
            </IconButton>
        </Tooltip>
    );
}
