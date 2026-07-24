import Image from 'next/image';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { InstructionLink } from './InstructionLink';
import { InstructionName, type InstructionProps } from './types';

export const AuthAndResourceAssign = ({ onInstructionChange }: InstructionProps) => (
  <Stack spacing={4}>
    <Stack>
      Once an admin group user authorizes a Cloud Service for LumiTure.ai, admins and managers can
      assign resources from the Cloud Service to different groups within the organization.
    </Stack>
    <Stack>
      <Typography variant="h6">Assigning Resources</Typography>
      <ul style={{ paddingLeft: 40, listStyleType: 'disc' }}>
        <li>
          Resources can be assigned to multiple groups at different levels. For example, the same
          resource can be assigned to multiple groups across different tiers.
          <ul style={{ paddingLeft: 20, listStyleType: 'disc' }}>
            <li>
              Resources must first be assigned to a Tier 1 Group before they can be allocated to a
              Tier 2 Group under it.
            </li>
            <li>
              When a Tier 1 Group assigns a resource to a Tier 2 Group, the Tier 1 Group still
              retains access to the same resource.
            </li>
          </ul>
        </li>
        <li>
          <Typography color="error">
            Note: If a resource is assigned to multiple groups, the total cost calculation across
            those groups may include duplicated spending.
          </Typography>
        </li>
      </ul>
    </Stack>
    <Stack>
      <Typography variant="h6">Managing Resources</Typography>
      <ul style={{ paddingLeft: 40, listStyleType: 'disc' }}>
        <li>
          <Typography variant="bodyBold" component="b">
            Admins {/* */}
          </Typography>
          can assign resources to Tier 1 and Tier 2 Groups.
        </li>
        <li>
          <Typography variant="bodyBold" component="b">
            Tier 1 Managers {/* */}
          </Typography>
          can view resources in their own group and assign resources to Tier 2 Groups.
        </li>
        <li>
          <Typography variant="bodyBold" component="b">
            Tier 2 Managers {/* */}
          </Typography>
          can only view the resources assigned to their own group.
        </li>
      </ul>
      <Image
        src="/images/instruction/auth_and_resource_assign.png"
        layout="responsive"
        alt="Group Hierarchy Concept"
        width={580}
        height={350}
        style={{ padding: '16px 20px' }}
      />
    </Stack>
    {onInstructionChange && (
      <InstructionLink name={InstructionName.OrgAndRole} onClick={onInstructionChange} />
    )}
  </Stack>
);
