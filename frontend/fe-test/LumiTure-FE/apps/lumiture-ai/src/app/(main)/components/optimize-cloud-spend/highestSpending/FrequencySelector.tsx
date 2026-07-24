import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { OverviewPeriod } from '@hooks-api';

export const periodOptions = [
  { value: OverviewPeriod.MONTHLY, label: 'This Month' },
  { value: OverviewPeriod.YEARLY, label: 'This Year' },
];

interface FrequencySelectorProps {
  isScreenshotMode?: boolean;
  label: React.ReactNode;
  frequency: OverviewPeriod;
  setFrequency: (value: OverviewPeriod) => void;
  isLoading?: boolean;
  sx?: SxProps;
}

const FrequencySelector = ({
  isScreenshotMode = false,
  label,
  frequency,
  setFrequency,
  isLoading = false,
  sx,
}: FrequencySelectorProps) => {
  const isStringLabel = typeof label === 'string';
  const handleSelectPeriod = (event: SelectChangeEvent<OverviewPeriod>) => {
    setFrequency(event.target.value as OverviewPeriod);
  };

  if (isScreenshotMode) {
    return (
      <Typography color="text.hint" sx={{ ml: 'auto', fontStyle: 'italic' }}>
        Display Frequency: {periodOptions.find((_option) => _option.value === frequency)?.label}
      </Typography>
    );
  }

  return (
    <FormControl
      disabled={isLoading}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        gap: 2,
        ...sx,
      }}
    >
      {isStringLabel ? (
        <Typography component="p" variant="captionBold" color="primary.main">
          {label}
        </Typography>
      ) : (
        label
      )}
      <Select
        value={frequency}
        onChange={handleSelectPeriod}
        MenuProps={{ sx: { '& .MuiList-root': { p: 0 } } }}
        sx={{ minWidth: 130 }}
      >
        {periodOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FrequencySelector;
