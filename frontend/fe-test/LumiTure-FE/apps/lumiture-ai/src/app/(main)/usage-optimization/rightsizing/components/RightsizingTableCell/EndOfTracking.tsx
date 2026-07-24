import { useRef, useState, type MouseEvent } from 'react';

import { ClickAwayListener, Popper, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { addYears, format } from 'date-fns';

import { BasicDatePicker, Button, HStack, Icon, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import {
  EndOfTrackTypeEnum,
  EndOfTrackTypeEnumMap,
  rightsizingRecommendQueryKey,
  usePatchEndOfTrackingDate,
  type RecommendationItem,
} from '@hooks-api';

import { useRightsizingStore } from '../../hooks/useRightsizingStore';

const LABELS = {
  cancel: 'Cancel',
  apply: 'Apply',
};

interface EndOfTrackingProps {
  recId: RecommendationItem['recId'];
  endOfTracking: RecommendationItem['endTrack'];
}

export function EndOfTracking({ endOfTracking, recId }: EndOfTrackingProps) {
  const queryClient = useQueryClient();
  const { selectedStatus } = useRightsizingStore();
  const { value: endOfTrackValue, type: endOfTrackType } = endOfTracking;

  const endOfTrackingRef = useRef<string | null>(endOfTrackValue);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const patchEndOfTrackingDate = usePatchEndOfTrackingDate(recId);

  const { isPending } = patchEndOfTrackingDate;

  const defaultDate = endOfTrackValue ? new Date(endOfTrackValue) : new Date();

  const minDate = new Date();
  const maxDate = addYears(new Date(), 100);
  const isSameDate = endOfTrackingRef.current
    ? new Date(endOfTrackingRef.current).getTime() === selectedDate?.getTime()
    : false; // 避免重複點擊 apply 按鈕
  const isButtonDisabled = !selectedDate || isPending || isSameDate;

  const getDisplayDate = (
    _date: RecommendationItem['endTrack']['value'],
    _type: RecommendationItem['endTrack']['type']
  ) => {
    if (_type === EndOfTrackTypeEnum.EndOfMonth) {
      return EndOfTrackTypeEnumMap[EndOfTrackTypeEnum.EndOfMonth];
    } else if (_type === EndOfTrackTypeEnum.EndOfQuarter) {
      return EndOfTrackTypeEnumMap[EndOfTrackTypeEnum.EndOfQuarter];
    } else if (_type === EndOfTrackTypeEnum.EndOfYear) {
      return EndOfTrackTypeEnumMap[EndOfTrackTypeEnum.EndOfYear];
    } else {
      return _date ? format(new Date(_date), 'dd/MM/yyyy') : '--';
    }
  };

  const displayDate = getDisplayDate(endOfTrackValue, endOfTrackType);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
    setSelectedDate(null);
  };

  const handleApply = async () => {
    try {
      if (!selectedDate || !recId) return;
      await patchEndOfTrackingDate.mutateAsync({ endTrackDate: selectedDate });
      queryClient.invalidateQueries({ queryKey: rightsizingRecommendQueryKey(selectedStatus) });
      popSuccessToast({ description: 'End of tracking date updated successfully.' });
    } catch (error) {
      popErrorToast({
        description: 'Unable to update the date. Please try again later.',
      });
      console.error(error);
    } finally {
      handleClickAway();
    }
  };

  const handleClickPopper = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <HStack gap={2.5} alignItems="center" onClick={handleClickPopper}>
      <Typography variant="buttonRegular1">{displayDate}</Typography>
      <Icon
        name="event"
        sx={{ fontSize: 16, color: theme.palette.primary.main }}
        onClick={handleClick}
      />
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} sx={{ zIndex: theme.zIndex.datepicker }}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <VStack bgcolor="common.white">
            <BasicDatePicker
              selected={selectedDate ? new Date(selectedDate) : defaultDate}
              onChange={(date: Date | null) => {
                setSelectedDate(date);
              }}
              minDate={minDate}
              maxDate={maxDate}
              inline
              footer={
                <HStack gap={4} justifyContent="flex-end" mt={3}>
                  <Button variant="outlined" onClick={() => handleClickAway()}>
                    {LABELS.cancel}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleApply}
                    disabled={isButtonDisabled}
                    isLoading={isPending}
                  >
                    {LABELS.apply}
                  </Button>
                </HStack>
              }
            />
          </VStack>
        </ClickAwayListener>
      </Popper>
    </HStack>
  );
}
