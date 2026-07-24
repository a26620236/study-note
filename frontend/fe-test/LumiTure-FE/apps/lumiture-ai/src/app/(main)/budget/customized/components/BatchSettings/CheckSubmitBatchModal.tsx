import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFormContext } from 'react-hook-form';

import { Button } from '@lumiture-ui';

import { FORM_ID } from '@app/(main)/budget/customized/components/constants';
import type { CustomBudgetBatchForm } from '@app/(main)/budget/customized/components/types';

interface CheckSubmitBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CheckSubmitBatchModal = ({ isOpen, onClose, onConfirm }: CheckSubmitBatchModalProps) => {
  const { watch } = useFormContext<CustomBudgetBatchForm>();

  const groups = watch(`${FORM_ID.ALERT}.values`);
  const prefix = watch(FORM_ID.NAME);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      <DialogTitle>Batch Create {groups?.length} Budget(s)</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            border: '1px solid',
            borderColor: 'gray.border',
            borderRadius: '4px',
            p: 2,
            overflowY: 'auto',
            maxHeight: 540,
          }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
          {groups?.map((_group) => (
            <Typography key={_group.id} color="primary.main">
              {prefix}_{_group.name}
            </Typography>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm and Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckSubmitBatchModal;
