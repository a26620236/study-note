'use client';

import type { ReactNode } from 'react';

import { Typography, useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { InputLabel, VStack } from '@lumiture-ui';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';
import { VirtualMachineNumberInputField } from './VirtualMachineNumberInputField';
import { VirtualMachineSwitchField } from './VirtualMachineSwitchField';

const LABELS = {
  virtualMachine: {
    title: 'Virtual Machine',
    description:
      'Recommendations will be triggered by any criteria you enable below. Note that empty fields will not be used.',
    renderPastDays: (daysInput: ReactNode) => (
      <>Detect the following rules during past {daysInput} day(s).</>
    ),
    cpuUtilization: {
      title: 'CPU Utilization',
      renderCPUUtilization: (cpuAverageInput: ReactNode, cpuPeakInput: ReactNode) => (
        <>
          When the CPU usage rate is under {cpuAverageInput}, or the peak is under {cpuPeakInput}
        </>
      ),
    },
    memoryUtilization: {
      title: 'Memory Utilization',
      renderMemoryUtilization: (memoryAverageInput: ReactNode, memoryPeakInput: ReactNode) => (
        <>
          When the memory usage rate is under {memoryAverageInput}, or the peak is under
          {memoryPeakInput}
        </>
      ),
    },
    networkIOPS: {
      label: 'Network IOPS',
      placeholder: 'Please enter a whole number greater than 0',
    },
    diskIOPS: {
      label: 'Disk IOPS',
      placeholder: 'Please enter a whole number greater than 0',
    },
  },
};

export function RightsizingVirtualMachineSection() {
  const { watch } = useFormContext<RightsizingSettingsFormData>();
  const theme = useTheme();
  const networkIOPSEnable = watch('criteria.virtualMachine.networkIOPS.enable');
  const diskIOPSEnable = watch('criteria.virtualMachine.diskIOPS.enable');

  return (
    <VStack sx={{ gap: 2 }}>
      <Typography variant="h6">{LABELS.virtualMachine.title}</Typography>
      <Typography
        variant="body1"
        color="text.primary"
        component="div"
        sx={{ alignItems: 'baseline', gap: 2, display: 'flex' }}
      >
        {LABELS.virtualMachine.renderPastDays(
          <VirtualMachineNumberInputField fieldName="criteria.virtualMachine.duration" />
        )}
      </Typography>

      {/* CPU Utilization */}
      <VStack
        sx={{
          gap: 2,
          width: '100%',
          backgroundColor: theme.palette.primary.light10,
          borderRadius: '8px',
          padding: 4,
        }}
      >
        <VStack>
          <InputLabel
            label={
              <Typography variant="bodyBold" color="text.secondary">
                {LABELS.virtualMachine.cpuUtilization.title}
              </Typography>
            }
            required
          />
          <Typography
            variant="body1"
            color="text.primary"
            component="div"
            sx={{ alignItems: 'baseline', gap: 2, display: 'flex' }}
          >
            {LABELS.virtualMachine.cpuUtilization.renderCPUUtilization(
              <VirtualMachineNumberInputField
                withPercentEndAdornment
                fieldName="criteria.virtualMachine.CPUUtilization.max"
              />,
              <VirtualMachineNumberInputField
                withPercentEndAdornment
                fieldName="criteria.virtualMachine.CPUUtilization.avg"
              />
            )}
          </Typography>
        </VStack>

        {/* Memory Utilization */}
        <VStack>
          <InputLabel
            label={
              <Typography variant="bodyBold" color="text.secondary">
                {LABELS.virtualMachine.memoryUtilization.title}
              </Typography>
            }
            required
          />
          <Typography
            variant="body1"
            color="text.primary"
            component="div"
            sx={{ alignItems: 'baseline', gap: 2, display: 'flex' }}
          >
            {LABELS.virtualMachine.memoryUtilization.renderMemoryUtilization(
              <VirtualMachineNumberInputField
                withPercentEndAdornment
                fieldName="criteria.virtualMachine.memoryUtilization.max"
              />,
              <VirtualMachineNumberInputField
                withPercentEndAdornment
                fieldName="criteria.virtualMachine.memoryUtilization.avg"
              />
            )}
          </Typography>
        </VStack>
      </VStack>

      <VStack sx={{ gap: 1, padding: '8px 16px 0' }}>
        <Typography variant="body1" color="text.secondary">
          {LABELS.virtualMachine.description}
        </Typography>

        <VStack sx={{ gap: 2, width: 'fit-content' }}>
          {/* Network IOPS */}
          <Typography
            variant="body1"
            color="text.primary"
            component="div"
            sx={{ alignItems: 'center', gap: 2, display: 'flex', justifyContent: 'space-between' }}
          >
            <VirtualMachineSwitchField
              fieldName="criteria.virtualMachine.networkIOPS.enable"
              label={LABELS.virtualMachine.networkIOPS.label}
            />
            <VirtualMachineNumberInputField
              fieldName="criteria.virtualMachine.networkIOPS.value"
              width={360}
              placeholder={LABELS.virtualMachine.networkIOPS.placeholder}
              disabled={!networkIOPSEnable}
            />
          </Typography>

          {/* Disk IOPS */}
          <Typography
            variant="body1"
            color="text.primary"
            component="div"
            sx={{ alignItems: 'center', gap: 2, display: 'flex', justifyContent: 'space-between' }}
          >
            <VirtualMachineSwitchField
              fieldName="criteria.virtualMachine.diskIOPS.enable"
              label={LABELS.virtualMachine.diskIOPS.label}
            />
            <VirtualMachineNumberInputField
              fieldName="criteria.virtualMachine.diskIOPS.value"
              width={360}
              placeholder={LABELS.virtualMachine.diskIOPS.placeholder}
              disabled={!diskIOPSEnable}
            />
          </Typography>
        </VStack>
      </VStack>
    </VStack>
  );
}
