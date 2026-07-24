import { format, formatDistanceToNow, isEqual, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function formatUtcToLocalTime(utcTime: string, formatStr = 'dd/MM/yyyy'): string {
  if (!utcTime) return '--';
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcDate = new Date(utcTime);
  const zonedDate = toZonedTime(utcDate, userTimeZone);
  return format(zonedDate, formatStr);
}

export function formatRelativeTime(utcTime: string): string {
  if (!utcTime) return '--';
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcDate = new Date(utcTime);
  const zonedDate = toZonedTime(utcDate, userTimeZone);
  return formatDistanceToNow(zonedDate, { addSuffix: true });
}

export function getFormattedDatePeriod(
  startDate: string | null,
  endDate: string | null,
  formatStr = 'dd/MM/yyyy'
): string {
  if (!startDate || !endDate) return '--';
  return `${formatUtcToLocalTime(startDate, formatStr)} ~ ${formatUtcToLocalTime(endDate, formatStr)}`;
}

export const isEqualDate = (_dayA: Date, _dayB: Date) =>
  isEqual(startOfDay(_dayA), startOfDay(_dayB));
