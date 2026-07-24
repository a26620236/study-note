import { Markdown, SingleSelect, type SingleSelectChangeEvent } from '@lumiture-ui';

import { CrossCloudValue } from '@constants';
import { FOCUSCredit, FOCUSCreditMap } from '@hooks-api';

import { GCP_FOCUS_TOOLTIP } from '../../constants/focusTooltip';
import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

export const LABELS = {
  label: 'Credits',
} as const;

const creditOptions = [
  { id: FOCUSCredit.On, name: FOCUSCreditMap[FOCUSCredit.On] },
  { id: FOCUSCredit.Off, name: FOCUSCreditMap[FOCUSCredit.Off] },
] as const;

export function FOCUSCreditFilter() {
  const { [CrossCloudValue.FOCUS]: focusAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { credits } = focusAllFilters;

  const handleChange = ({ value }: SingleSelectChangeEvent<FOCUSCredit>) => {
    if (value === null) return;
    handleSetFilter(CrossCloudValue.FOCUS, { credits: [value] });
  };

  return (
    <SingleSelect
      dataTestId="focus-credit-filter"
      configKey="Credits"
      label={LABELS.label}
      labelTooltipText={<Markdown>{GCP_FOCUS_TOOLTIP}</Markdown>}
      options={creditOptions}
      value={credits[0]}
      onChange={handleChange}
    />
  );
}
