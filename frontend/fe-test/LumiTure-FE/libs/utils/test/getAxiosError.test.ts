import { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getAxiosError } from '../src/getAxiosError';

function createAxiosError(responseData: unknown, status = 400): AxiosError {
  return new AxiosError('Request failed', String(status), undefined, undefined, {
    data: responseData,
    status,
    statusText: 'Bad Request',
    headers: {},
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    config: null as unknown as InternalAxiosRequestConfig,
  });
}

describe('getAxiosError', () => {
  it('should return undefined for a plain Error', () => {
    expect(getAxiosError(new Error('regular error'))).toBeUndefined();
  });

  it('should return undefined for a string', () => {
    expect(getAxiosError('string error')).toBeUndefined();
  });

  it('should return undefined for null', () => {
    expect(getAxiosError(null)).toBeUndefined();
  });

  it('should return undefined when axios error has no response', () => {
    const axiosError = new AxiosError('Network Error');
    expect(getAxiosError(axiosError)).toBeUndefined();
  });

  it('should return response.data.data for axios errors', () => {
    // Arrange
    const errorPayload = { code: 'NOT_FOUND', detail: 'Resource not found' };
    const axiosError = createAxiosError({ data: errorPayload });

    // Act
    const result = getAxiosError(axiosError);

    // Assert
    expect(result).toEqual(errorPayload);
  });

  it('should return undefined when response data has no nested data field', () => {
    const axiosError = createAxiosError({ message: 'error' });
    expect(getAxiosError(axiosError)).toBeUndefined();
  });
});
