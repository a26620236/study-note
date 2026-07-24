import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Icon, SquareChip } from '@lumiture-ui';

import type { FilterOption } from '../../types/customizedBudget';

const SelectWrapper = styled('div')<{ isOpen: boolean; isError?: boolean }>(
  ({ theme, isOpen, isError }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    outline: `${isOpen ? 2 : 1}px solid`,
    outlineOffset: `${isOpen ? -2 : -1}px`,
    outlineColor: isError ? theme.palette.error.main : theme.palette.gray.border,
    borderRadius: '5px',
    padding: theme.spacing(1, 2),
    minHeight: 36,
    backgroundColor: theme.palette.white.main,
  })
);

const ChipsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  flex: 1,
  maxHeight: 240,
  gap: theme.spacing(1),
  overflowY: 'auto',
}));

interface SelectInputProps {
  isOpen: boolean;
  selectedItems: FilterOption[];
  invalidItemIds: string[];
  placeholder: string;
  onDelete: (id: FilterOption['id']) => void;
  onReset: () => void;
  isError?: boolean;
}

const ChipsSelect = ({
  isOpen,
  selectedItems,
  invalidItemIds,
  placeholder,
  onDelete,
  onReset,
  isError = false,
}: SelectInputProps) => {
  const handleChipDelete = (id: FilterOption['id']) => onDelete(id);

  const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onReset();
  };

  return (
    <SelectWrapper isOpen={isOpen} isError={isError}>
      {/* chips */}
      <ChipsWrapper>
        {selectedItems.length === 0 ? (
          <Typography color="text.hint" sx={{ ml: 2, mt: 0.5 }}>
            {placeholder}
          </Typography>
        ) : (
          selectedItems.map((_item) => (
            <SquareChip
              key={_item.id}
              color={invalidItemIds.includes(_item.id) ? 'error' : 'primary'}
              size="ex-small"
              label={_item.name}
              onDelete={() => handleChipDelete(_item.id)}
            />
          ))
        )}
      </ChipsWrapper>
      {/* action button */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Icon
          name="cancel"
          fill={true}
          sx={{ color: 'gray.border', fontSize: 16 }}
          onClick={handleReset}
        />
        <Icon
          name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
          sx={{ color: 'text.secondary' }}
        />
      </Stack>
    </SelectWrapper>
  );
};

export default ChipsSelect;
