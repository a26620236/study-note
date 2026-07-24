import { useRef, useState } from 'react';

import { format } from 'date-fns';
import { toPng } from 'html-to-image';

import { downloadFile, sleep } from '@shared/utils';

interface TakeScreenshotProps {
  wrapperElement: HTMLDivElement | null;
  fileName: string;
}

const takeScreenshot = async ({ wrapperElement, fileName }: TakeScreenshotProps) => {
  if (!wrapperElement) return;

  try {
    const dataUrl: string = await toPng(wrapperElement, {
      pixelRatio: 2,
      skipFonts: false,
    });

    downloadFile({ downloadUrl: dataUrl, filename: fileName });
  } catch (error) {
    console.error('Error taking screenshot:', error);
  }
};

interface UseScreenshotProps {
  fileName: string;
  delay?: number;
}

export const useTakeScreenshot = ({ fileName, delay = 300 }: UseScreenshotProps) => {
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);
  const screenshotRef = useRef<HTMLDivElement | null>(null);

  const handleTakeScreenshot = async () => {
    try {
      setIsScreenshotMode(true);
      await sleep(delay);
      await takeScreenshot({
        wrapperElement: screenshotRef.current,
        fileName: `${fileName}_${format(new Date(), 'ddMMyyyy')}.png`,
      });
    } catch (error) {
      console.error('Error taking screenshot:', error);
    } finally {
      setIsScreenshotMode(false);
    }
  };

  return { screenshotRef, isScreenshotMode, handleTakeScreenshot };
};
