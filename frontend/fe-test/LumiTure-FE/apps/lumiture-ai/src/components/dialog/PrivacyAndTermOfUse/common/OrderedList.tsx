import { List } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

interface OrderedListProps {
  children: React.ReactNode;
  listStyleType?: string;
  sx?: SxProps;
  itemStyle?: SxProps;
}

const OrderedList = ({
  children,
  listStyleType = 'lower-alpha',
  sx,
  itemStyle,
}: OrderedListProps) => {
  const itemStyles = { '& li:not(:last-child)': { mb: 2, ...itemStyle } };
  const listStyles: SxProps = { pb: 0, pl: 6, listStyleType, ...sx, ...itemStyles };
  return (
    <List sx={listStyles} component="ol">
      {children}
    </List>
  );
};

export default OrderedList;
