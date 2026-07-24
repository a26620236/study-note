import { memo } from 'react';

import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

interface SelectAllOptionProps {
  isChecked: boolean;
  isIndeterminate: boolean;
  onClick: () => void;
}

const LABELS = {
  selectAll: 'Select All',
};

export const SelectAllOption = memo(function SelectAllOption({
  onClick,
  isChecked,
  isIndeterminate,
}: SelectAllOptionProps) {
  return (
    <ListItem onClick={onClick}>
      <Checkbox sx={{ pl: 0 }} checked={isChecked} indeterminate={isIndeterminate} />
      <Typography>{LABELS.selectAll}</Typography>
    </ListItem>
  );
});
