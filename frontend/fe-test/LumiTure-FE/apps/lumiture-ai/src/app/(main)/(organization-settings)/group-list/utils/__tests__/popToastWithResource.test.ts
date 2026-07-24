import { popErrorToast, popSuccessToast } from '@shared/utils';

import { popToastWithResource } from '../popToastWithResource';

// Mock @shared/utils barrel：隔離 toast 副作用，避免在測試環境中觸發實際的 toast UI
vi.mock('@shared/utils', () => ({
  popSuccessToast: vi.fn(),
  popErrorToast: vi.fn(),
}));

describe('popToastWithResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call popSuccessToast with success message when status is "success"', () => {
    popToastWithResource('success');

    expect(popSuccessToast).toHaveBeenCalledWith({
      description: 'Resource updated successfully.',
    });
    expect(popErrorToast).not.toHaveBeenCalled();
  });

  it('should call popErrorToast with error message when status is "error"', () => {
    popToastWithResource('error');

    expect(popErrorToast).toHaveBeenCalledWith({
      description: 'Unable to update resource. Please try again later.',
    });
    expect(popSuccessToast).not.toHaveBeenCalled();
  });
});
