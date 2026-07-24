import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Box, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { upperFirst } from 'lodash-es';

import { Button, Markdown, SingleSelect, SquareChip } from '@lumiture-ui';

import { useGetUserGroups, usePatchDefaultUserGroup, userGroupsQueryKey } from '@hooks-api';

export interface SelectUserRoleDialogProps {
  open: boolean;
  onClose: () => void;
  canCancel?: boolean;
  onSubmitSuccess?: () => void;
}

const LABELS = {
  title: 'Select Your Role',
  description: `Please choose the role you'd like to use for this session.<br />
We'll remember your selection and use it as the default for future logins.<br />
You can always switch roles later by clicking your profile in the Header.`,
  buttons: {
    keepCurrent: 'Keep Current Role',
    continue: 'Continue',
  },
};

const dialogStyles = {
  '& .MuiDialog-paper': {
    width: '600px',
    pt: 6,
    pb: 6,
    pl: 8,
    pr: 8,
  },
};

const headerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

const contentStyles = {
  padding: 0,
  marginTop: '40px',
  marginBottom: '64px',
};

const actionsStyles = {
  gap: 2,
  margin: '0 auto',
};

export default function SelectUserRoleDialog({
  open,
  onClose,
  canCancel = true,
  onSubmitSuccess,
}: SelectUserRoleDialogProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const { data: userGroupsData, isLoading: isUserGroupsQueryLoading } = useGetUserGroups({
    queryKey: userGroupsQueryKey,
    refetchOnWindowFocus: 'always',
  });
  const userGroups = userGroupsData?.data;
  const { mutateAsync: patchDefaultUserGroup, isPending: isPatchDefaultUserGroupPending } =
    usePatchDefaultUserGroup();

  useEffect(() => {
    if (userGroups) {
      setSelectedGroupId(userGroups.defaultGroupId || userGroups.groups[0].groupId);
    }
  }, [userGroups]);

  if (isUserGroupsQueryLoading || !userGroups) return null;

  const handleRoleChange = ({ value }: { value: string | number | null }) => {
    if (typeof value !== 'string') return;
    setSelectedGroupId(value);
  };

  const handleSubmit = async () => {
    if (!selectedGroupId) return;
    await patchDefaultUserGroup({ groupId: selectedGroupId });
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
    onClose();
  };

  const selectedGroup =
    userGroups.groups.find((group) => group.groupId === selectedGroupId) ?? userGroups.groups[0];

  const shouldDisableContinueButton =
    !!userGroups.defaultGroupId && userGroups.defaultGroupId === selectedGroupId;

  const renderRoleTag = (role: string) => (
    <SquareChip
      label={<Typography variant="caption">{upperFirst(role)}</Typography>}
      color="primary"
      variant="filled"
      size="ex-small"
    />
  );

  const options = userGroups.groups.map((group) => ({
    id: group.groupId,
    name: group.groupName,
    tags: [renderRoleTag(group.role)],
  }));

  return (
    <Dialog
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return;
        onClose();
      }}
      disableEscapeKeyDown
      open={open}
      sx={dialogStyles}
    >
      <Box sx={headerStyles}>
        <Box>
          <Image src="/images/partner_exchange.svg" alt="user role" width={75} height={75} />
        </Box>

        <Typography variant="h4">{LABELS.title}</Typography>

        <Box sx={{ marginTop: '15px', textAlign: 'center' }}>
          <Markdown
            components={{
              p: ({ children }) => (
                <Typography variant="body2" color="text.primary" sx={{ lineHeight: '24.5px' }}>
                  {children}
                </Typography>
              ),
            }}
          >
            {LABELS.description}
          </Markdown>
        </Box>
      </Box>

      {/* Content with role selector */}
      <DialogContent sx={contentStyles}>
        <SingleSelect
          enableSearch
          searchPlaceholder="Search Group Name"
          configKey="groupId"
          value={selectedGroupId}
          options={options}
          onChange={handleRoleChange}
          defaultDisplayLabel={selectedGroup.groupName}
          defaultTags={[renderRoleTag(selectedGroup.role)]}
        />
      </DialogContent>

      {/* Action buttons */}
      <DialogActions sx={actionsStyles}>
        {canCancel && (
          <Button variant="outlined" onClick={onClose}>
            {LABELS.buttons.keepCurrent}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ minWidth: 160 }}
          isLoading={isPatchDefaultUserGroupPending}
          disabled={shouldDisableContinueButton}
        >
          {LABELS.buttons.continue}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
