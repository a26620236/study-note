import Image from 'next/image';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { InstructionLink } from './InstructionLink';
import { InstructionName, type InstructionProps } from './types';

const IDENTITY = {
  OWNER: {
    name: 'Owner',
    descs: [
      "Responsible for registering the organization's account on LumiTure.ai.",
      'Each organization can only have one Owner.',
      'All other permissions are the same as Admin',
    ],
  },
  ADMIN: {
    name: 'Admin',
    descs: [
      'Can only be added by the other admin.',
      'Can manage all groups and assign user roles.',
      'Can authorize Cloud Services for LumiTure.ai and allocate resources to groups.',
    ],
  },
  MANAGER: {
    name: 'Manager',
    descs: [
      'Can manage Members within their own group, and both Managers and Members in their subgroups.',
      'Can manage resources in their own group and subgroups.',
    ],
  },
  MEMBER: {
    name: 'Member',
    descs: ['Can only view their assigned group and its member list.'],
  },
};

interface RoleItemProps {
  name: string;
  descs: string[];
}

const RoleItem = ({ name, descs }: RoleItemProps) => (
  <li>
    <Typography variant="bodyBold">{name}</Typography>
    <ul style={{ paddingLeft: 28, listStyleType: 'disc' }}>
      {descs.map((_desc) => (
        <li key={_desc}>{_desc}</li>
      ))}
    </ul>
  </li>
);

interface GroupProps {
  name: string;
  roles: RoleItemProps[];
}

const Group = ({ name, roles }: GroupProps) => (
  <Stack>
    <Typography variant="h6" sx={{ mb: -2 }}>
      {name}
    </Typography>
    <ul style={{ paddingLeft: 20, listStyleType: 'disc' }}>
      {roles.map((_role) => (
        <RoleItem key={_role.name} {..._role} />
      ))}
    </ul>
  </Stack>
);

export const OrgAndRole = ({ onInstructionChange }: InstructionProps) => (
  <Stack spacing={4}>
    <Stack>
      In LumiTure.ai, you can create multi-tier groups to efficiently manage different teams or
      departments within your organization. Additionally, authorized administrators at higher levels
      can assign roles to users, ensuring they have the appropriate access permissions for their
      responsibilities.
    </Stack>
    <Stack>
      <Typography variant="h5">Group Hierarchy Concept</Typography>
      <ul style={{ paddingLeft: 20, listStyleType: 'disc' }}>
        <li>
          Within an organization, the highest-level group is the
          <Typography variant="bodyBold" component="b">
            {/* */} Admin Group
          </Typography>
          . There is only one Admin Group, and it can contain multiple{' '}
          <Typography variant="bodyBold" component="b">
            {/* */} Tier 1 Groups
          </Typography>
          . Each Tier 1 Group can further contain multiple{' '}
          <Typography variant="bodyBold" component="b">
            {/* */} Tier 2 Groups
          </Typography>
          .
        </li>
        <li>
          The number of hierarchy levels and groups available depends on your
          <Typography
            sx={{ color: 'primary.main' }}
            component="a"
            href="https://www.lumiture.ai/pricing"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* */} pricing plan
          </Typography>
          .
          <ul style={{ paddingLeft: 20, listStyleType: 'disc' }}>
            <li>
              <Typography variant="bodyBold" component="b">
                Starter Plan:
              </Typography>
              {/* */} You can create up to 10 Tier 1 Groups but cannot add Tier 2 Groups.
            </li>
            <li>
              <Typography variant="bodyBold" component="b">
                Standard Plan and above:
              </Typography>
              {/* */} You can create unlimited Tier 1 and Tier 2 Groups.
            </li>
          </ul>
        </li>
      </ul>

      {/*
          因為目前有些情境是：CM 的人代替客戶以 Owner 身份執行創建組織的過程，
          事後客戶公司若在 lumiture 上發現組織的 owner 不是自己公司的人，
          觀感會很不好，因此先將 owner 顯示為 admin，並且隱藏各種與 owner 相關的說明
        */}
      <Image
        src="/images/instruction/org_and_role_without_owner.png"
        layout="responsive"
        alt="Group Hierarchy Concept"
        width={580}
        height={350}
        style={{ padding: '16px 20px' }}
      />
    </Stack>
    <Stack spacing={4}>
      <Typography variant="h5">Role Permissions</Typography>
      {/* Admin Group */}
      <Group name="Admin Group" roles={[IDENTITY.ADMIN]} />
      {/* User Group */}
      <Group name="User Group (Tier 1 / Tier 2)" roles={[IDENTITY.MANAGER, IDENTITY.MEMBER]} />
    </Stack>
    {onInstructionChange && (
      <InstructionLink
        name={InstructionName.AuthAndResourceAssignment}
        onClick={onInstructionChange}
      />
    )}
  </Stack>
);
