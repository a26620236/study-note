const DISPLAY_LIMIT = 3;
const OPTIONAL_FILTER_LABELS = ['Labels', 'Tags', 'Credits'];

export function formatFilterValues(values: string[], label: string): string {
  if (values.length === 0 && OPTIONAL_FILTER_LABELS.includes(label)) {
    return '(Not Selected)';
  }

  if (values.includes('all')) {
    return `All ${label}`;
  }

  if (values.length <= DISPLAY_LIMIT) {
    return values.join(', ');
  }

  const displayedValues = values.slice(0, DISPLAY_LIMIT).join(', ');
  const remainingCount = values.length - DISPLAY_LIMIT;
  return `${displayedValues} (+${remainingCount.toLocaleString()} more)`;
}
