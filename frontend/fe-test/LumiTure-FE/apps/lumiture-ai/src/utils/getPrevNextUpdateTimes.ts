import { addDays, format, isBefore, subDays } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

type Hours =
  | `0${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `1${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `2${0 | 1 | 2 | 3}`;
type Minutes = `${0 | 1 | 2 | 3 | 4 | 5}${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;
export type Time = `${Hours}:${Minutes}`;

export const getPrevNextUpdateTimes = ({
  times,
  inputTimeZone = 'Asia/Taipei',
}: {
  times: Time[];
  inputTimeZone?: string;
}): {
  prev: string | null;
  next: string | null;
} => {
  let prev = null;
  let next = null;

  if (!Array.isArray(times)) {
    return { prev, next };
  }

  if (times.length === 0) {
    return { prev, next };
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = toZonedTime(new Date(), userTimeZone);
  const timePoints = times.map((time) => {
    const [hour, minute] = time.split(':').map(String);
    const timeString = `${format(now, 'yyyy-MM-dd')} ${hour}:${minute}:00`;
    const timeInInputTZ = fromZonedTime(timeString, inputTimeZone);
    const timeInUserTZ = toZonedTime(timeInInputTZ, userTimeZone);
    return timeInUserTZ;
  });
  timePoints.sort((a, b) => a.getTime() - b.getTime());

  for (let i = 0; i < timePoints.length; i++) {
    if (isBefore(now, timePoints[i])) {
      prev = timePoints[i - 1] || subDays(timePoints[timePoints.length - 1], 1);
      next = timePoints[i];
      break;
    }
  }

  if (!prev && !next) {
    prev = timePoints[timePoints.length - 1];
    next = addDays(timePoints[0], 1);
  }
  // prev / next 在此處永遠不為 null：
  // times 非空時 loop 必定賦值，或由上方 if (!prev && !next) fallback 強制賦值；
  // null 的情況已在函數頂部 early return 處理完畢，此處的 ternary null branch 為不可達死碼。
  /* v8 ignore start */
  return {
    prev: prev ? format(prev, 'yyyy/MM/dd HH:mm') : null,
    next: next ? format(next, 'yyyy/MM/dd HH:mm') : null,
  };
  /* v8 ignore stop */
};
