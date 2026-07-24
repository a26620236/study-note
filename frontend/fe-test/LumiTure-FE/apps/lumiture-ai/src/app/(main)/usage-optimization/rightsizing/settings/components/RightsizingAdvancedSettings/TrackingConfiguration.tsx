import type { ReactNode } from 'react';

import { Typography } from '@mui/material';
import { addYears } from 'date-fns';
import { Controller, useFormContext } from 'react-hook-form';

import {
  BasicDatePicker,
  DatePickerCustomInput,
  HStack,
  NumberInput,
  SingleSelect,
  VStack,
} from '@lumiture-ui';

import { EndOfTrackTypeEnum, EndOfTrackTypeEnumMap } from '@hooks-api';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';

const LABELS = {
  title: 'Tracking Configuration',
  dismissalPeriod: {
    title: 'Dismissal Period',
    days: 'day(s)',
    tooltipText: `This option allows you to set your default dismissal period in days. After you dismiss a recommendation, it will be hidden for this amount of time.
        Please note that all existing recommendations are automatically updated with your new settings, except for those with a manually-set "End of tracking" date.`,
  },
  endOfTracking: {
    title: 'End Of Tracking',
    renderEndDate: (datePickerInput: ReactNode) => <>Ends on {datePickerInput}</>,
    options: EndOfTrackTypeEnumMap,
  },
};

export function TrackingConfiguration() {
  const { control, watch, trigger } = useFormContext<RightsizingSettingsFormData>();

  const endOfTrackType = watch('advance.endOfTrack.type');
  const isEndOfTrackCustomized = endOfTrackType === EndOfTrackTypeEnum.Customized;
  const endOfTrackingOptions = Object.values(EndOfTrackTypeEnum).map((type) => ({
    id: type,
    name: LABELS.endOfTracking.options[type],
  }));

  return (
    <VStack sx={{ gap: 4, width: '100%' }}>
      <Typography variant="h6" color="text.secondary">
        {LABELS.title}
      </Typography>
      <HStack sx={{ gap: 4, alignItems: 'start', flexWrap: 'nowrap' }}>
        <HStack sx={{ gap: 2, flex: 1 }}>
          <Controller
            name="advance.dismissalPeriod"
            control={control}
            render={({ field, fieldState }) => (
              <NumberInput
                {...field}
                id={field.name}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  trigger('advance.dismissalPeriod');
                }}
                label={LABELS.dismissalPeriod.title}
                tooltipText={LABELS.dismissalPeriod.tooltipText}
                allowFloat={false}
                required
                sx={{ flex: 1 }}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Typography variant="body1" sx={{ mt: '30px' }}>
            {LABELS.dismissalPeriod.days}
          </Typography>
        </HStack>
        <HStack sx={{ flex: 1, gap: 2, alignItems: 'end', flexWrap: 'nowrap' }}>
          <Controller
            name="advance.endOfTrack.type"
            control={control}
            render={({ field }) => (
              <SingleSelect
                label={LABELS.endOfTracking.title}
                ref={field.ref}
                configKey={field.name}
                value={field.value}
                onChange={({ value }) => {
                  field.onChange(value);
                }}
                options={endOfTrackingOptions}
                required
                sx={{ flex: 1 }}
              />
            )}
          />
          {isEndOfTrackCustomized && (
            <Typography
              variant="body1"
              color="text.primary"
              component="div"
              sx={{
                flex: 1,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'nowrap',
                whiteSpace: 'nowrap',
              }}
            >
              {LABELS.endOfTracking.renderEndDate(
                <Controller
                  name="advance.endOfTrack.value"
                  control={control}
                  render={({ field }) => (
                    <BasicDatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => {
                        if (!date) return;
                        field.onChange(date);
                      }}
                      customInput={<DatePickerCustomInput />}
                      minDate={new Date()}
                      maxDate={addYears(new Date(), 10)}
                      shouldCloseOnSelect={false}
                      popperPlacement="top-end"
                      sx={{ flex: 1 }}
                    />
                  )}
                />
              )}
            </Typography>
          )}
        </HStack>
      </HStack>
    </VStack>
  );
}
