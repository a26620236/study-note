import { popErrorToast, popSuccessToast } from '@shared/utils';

const TOAST = {
  successMessage: 'Resource updated successfully.',
  errorMessage: 'Unable to update resource. Please try again later.',
};

export const popToastWithResource = (status: 'success' | 'error') => {
  if (status === 'success') {
    popSuccessToast({ description: TOAST.successMessage });
  } else {
    popErrorToast({ description: TOAST.errorMessage });
  }
};
