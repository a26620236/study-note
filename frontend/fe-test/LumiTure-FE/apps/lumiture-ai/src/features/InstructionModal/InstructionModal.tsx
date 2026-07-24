'use client';

import { useEffect, useRef, useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

import { Icon } from '@lumiture-ui';

import { AuthAndResourceAssign } from './AuthAndResourceAssign';
import { OrgAndRole } from './OrgAndRole';
import { InstructionName } from './types';

interface InstructionModalProps {
  name: InstructionName;
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionModal = ({ name, isOpen, onClose }: InstructionModalProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [currentInstruction, setCurrentInstruction] = useState<InstructionName>(name);

  const instructionMap = {
    [InstructionName.OrgAndRole]: OrgAndRole,
    [InstructionName.AuthAndResourceAssignment]: AuthAndResourceAssign,
  };

  const CurrentInstruction = instructionMap[currentInstruction];

  const handleInstructionChange = (name: InstructionName) => {
    setCurrentInstruction(name);
  };

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.scrollTop = 0;
  }, [currentInstruction]);

  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paper': { minWidth: 700 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {currentInstruction}
        <IconButton aria-label="close" size="medium" color="default" onClick={onClose}>
          <Icon name="close" sx={{ color: 'text.secondary' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent ref={contentRef} sx={{ maxHeight: 620 }}>
        {currentInstruction in instructionMap ? (
          <CurrentInstruction onInstructionChange={handleInstructionChange} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
