import Stack from '@mui/material/Stack';

interface TabPanelProps {
  children: React.ReactNode;
  tabKey: string;
  value: string;
}

export const TabPanel = ({ children, value, tabKey }: TabPanelProps) => {
  const isSelect = value === tabKey;
  return (
    <Stack
      role="tabpanel"
      id={`=tabpanel-${tabKey}`}
      sx={{
        display: value === tabKey ? 'flex' : 'none',
        flex: 1,
      }}
      aria-labelledby={`tab-${tabKey}`}
    >
      {isSelect && children}
    </Stack>
  );
};
