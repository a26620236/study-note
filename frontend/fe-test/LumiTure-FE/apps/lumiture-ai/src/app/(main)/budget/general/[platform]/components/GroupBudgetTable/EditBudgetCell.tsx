import { useState, type MouseEvent } from 'react';

import { IconButton, Tooltip } from '@mui/material';

import { DropdownButton, HStack, Icon } from '@lumiture-ui';

import type { EditingBudget } from '../../types/budgetSettings';
import { EditBudgetPanel } from '../EditBudgetPanel/EditBudgetPanel';

interface EditBudgetCellProps {
  onConfirm: (data: EditingBudget) => void;
}

const LABELS = {
  setBudgets: 'Set Budgets',
};

// 開關與 anchor 狀態完全收在 cell 內（local state），點齒輪只更新自己、不牽動父層欄位重建，
// 避免 cell remount 導致 anchorEl 被清空、Popper 跑到畫面左上角
export const EditBudgetCell = ({ onConfirm }: EditBudgetCellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);
  const handleConfirm = (data: EditingBudget) => {
    onConfirm(data);
    handleClose();
  };

  return (
    <HStack>
      <DropdownButton
        anchorEl={anchorEl}
        isOpen={isOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        sx={{ display: 'flex', alignItems: 'start' }}
        placement="bottom-end"
        button={
          <Tooltip title={LABELS.setBudgets} placement="top">
            <IconButton>
              <Icon name="settings" />
            </IconButton>
          </Tooltip>
        }
      >
        <EditBudgetPanel onConfirm={handleConfirm} />
      </DropdownButton>
    </HStack>
  );
};
