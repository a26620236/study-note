import { Typography } from '@mui/material';

interface LimitedListProps {
  items: string[];
}

// LimitedList - 限制顯示數量的列表元件
export default function LimitedList({ items }: LimitedListProps) {
  const MAX_DISPLAY = 5;
  const displayItems = items.slice(0, MAX_DISPLAY);
  const extraCount = items.length - MAX_DISPLAY;

  if (items.length === 1) {
    return <Typography variant="body1">{items[0]}</Typography>;
  }

  return (
    <>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {displayItems.map((item, idx) => (
          <li key={item + idx} style={{ whiteSpace: 'pre-line' }}>
            {item}
          </li>
        ))}
      </ul>
      {extraCount > 0 && <span>{`...+${extraCount} more, view full list in detail page.`}</span>}
    </>
  );
}
