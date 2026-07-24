import { toast, type ToastT } from 'sonner';

const defaultDuration = 5000;

type ToastType = 'info' | 'success' | 'warning' | 'error';

type ToastOptions = Omit<ToastT, 'id'>;

const popToast = (type: ToastType, { ...options }: ToastOptions) => {
  toast[type]('', {
    ...options,
    duration: defaultDuration,
  });
};

export const popInfoToast = (options: ToastOptions) => popToast('info', options);
export const popSuccessToast = (options: ToastOptions) => popToast('success', options);
export const popWarningToast = (options: ToastOptions) => popToast('warning', options);
export const popErrorToast = (options: ToastOptions) => popToast('error', options);
