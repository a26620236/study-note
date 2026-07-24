import { InstructionButton, InstructionName } from '@features';
import PeopleIcon from '@mui/icons-material/People';

import OrganizationTitle from '@components/OrganizationTitle';

import { AdminTable } from './AdminTable';

export default function AdminUsers() {
  return (
    <>
      <OrganizationTitle
        title="Admin List"
        subTitle="This page provides detailed information on all users who share admin privileges with you
              and their account activity."
        icon={<PeopleIcon />}
      />
      <InstructionButton name={InstructionName.OrgAndRole} sx={{ mb: 4 }} />
      <AdminTable />
    </>
  );
}
