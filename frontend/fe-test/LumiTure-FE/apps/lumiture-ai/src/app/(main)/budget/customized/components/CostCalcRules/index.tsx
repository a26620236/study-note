import type { ReactNode } from 'react';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button, DropdownButton, Icon } from '@lumiture-ui';

import {
  availablePlatforms,
  FORM_ID,
  RULE_LIMIT,
} from '@app/(main)/budget/customized/components/constants';
import BudgetRules from '@app/(main)/budget/customized/components/CostCalcRules/BudgetRules';
import {
  EmptyRule,
  LoadingRule,
} from '@app/(main)/budget/customized/components/CostCalcRules/RuleStatus';
import type { CustomBudgetForm, Rule } from '@app/(main)/budget/customized/components/types';
import { PLATFORM_CONFIG } from '@constants';
import { useGetPlatformResourceEmptyStatusMap } from '@hooks';

const DEFAULT_RULE: Rule = {
  platform: availablePlatforms[0],
  groups: null,
  services: null,
  projects: null,
};

interface CostCalcRulesWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  onAdd: (platform: Rule['platform']) => void;
  isRuleLimitReached: boolean;
}

const CostCalcRulesWrapper = ({
  children,
  isLoading = false,
  onAdd,
  isRuleLimitReached,
}: CostCalcRulesWrapperProps) => {
  const {
    formState: { errors },
  } = useFormContext<CustomBudgetForm>();

  const errorMsg = errors[FORM_ID.RULES]?.message;

  const { platformResourceEmptyStatusMap } = useGetPlatformResourceEmptyStatusMap();

  const handleAddRule = (platform: Rule['platform']) => {
    onAdd(platform);
  };

  const platformOptions = availablePlatforms
    .filter((platform) => !platformResourceEmptyStatusMap[platform])
    .map((platform) => ({
      label: PLATFORM_CONFIG[platform].label,
      value: PLATFORM_CONFIG[platform].value,
      onClick: handleAddRule,
    }));

  return (
    <Paper>
      <Stack spacing={4}>
        <Typography variant="h5">
          Budget Scope{' '}
          <Typography variant="h5" color="error" component="span">
            *
          </Typography>
        </Typography>
        <Typography color="text.secondary">
          Costs matching <b>ANY</b> of the rules will be included in the scope. Within each rule,{' '}
          <b>ALL </b>
          conditions must be satisfied.
          <br />
          You can set up to {RULE_LIMIT} conditions. The system will automatically remove any
          duplicate resources that are selected.
          <br />
          Please note that if the selected conditions result in an empty set, no alert will be
          triggered.
        </Typography>
        {children}
        <Stack direction="row" alignItems="center" gap={4}>
          <DropdownButton
            button={
              <Tooltip
                title={isRuleLimitReached && 'You have reached the limit.'}
                placement="bottom-start"
              >
                <span>
                  <Button
                    startIcon={<Icon name="add" />}
                    variant="outlined"
                    color="primary"
                    disabled={isRuleLimitReached || isLoading}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Rule
                  </Button>
                </span>
              </Tooltip>
            }
            placement="bottom-start"
            list={platformOptions}
          />

          {errorMsg && (
            <Typography variant="caption" color="error">
              {errorMsg}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

interface CostCalcRulesProps {
  isLoading?: boolean;
}

const CostCalcRules = ({ isLoading = false }: CostCalcRulesProps) => {
  const { control, watch } = useFormContext<CustomBudgetForm>();

  const {
    append: appendRule,
    fields: rules,
    remove: removeRule,
  } = useFieldArray({
    control,
    name: FORM_ID.RULES,
  });

  const isRuleLimitReached = rules.length >= RULE_LIMIT;

  const handleDeleteRule = (index: number) => {
    removeRule(index);
  };

  const handleAddRule = (platform: Rule['platform']) => {
    appendRule({ ...DEFAULT_RULE, platform });
  };

  const handleCopyRule = (index: number) => {
    if (isRuleLimitReached) return;
    const currentRule = watch(`${FORM_ID.RULES}.${index}`);
    appendRule(currentRule);
  };

  let content: ReactNode =
    rules.length === 0 ? (
      <EmptyRule />
    ) : (
      rules.map((rule, index) => (
        <BudgetRules
          key={rule.id}
          ruleIndex={index}
          onDelete={() => handleDeleteRule(index)}
          onCopy={() => handleCopyRule(index)}
        />
      ))
    );

  if (isLoading) {
    content = <LoadingRule />;
  }

  return (
    <CostCalcRulesWrapper
      isLoading={isLoading}
      onAdd={handleAddRule}
      isRuleLimitReached={isRuleLimitReached}
    >
      {content}
    </CostCalcRulesWrapper>
  );
};

export default CostCalcRules;
