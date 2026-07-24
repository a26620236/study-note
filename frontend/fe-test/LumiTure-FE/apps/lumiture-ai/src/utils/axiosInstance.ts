import axios from 'axios';

function isServerSide(): boolean {
  return typeof window === 'undefined';
}

function getApiBaseUrl(isMock: boolean): string {
  if (isMock) {
    return 'http://localhost:3002';
  }
  if (isServerSide()) {
    return process.env.API_BASE_URL || 'http://localhost:3000';
  } else {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  }
}

interface AxiosInstanceOptions {
  isMock?: boolean;
}

export function axiosInstance({ isMock = false }: AxiosInstanceOptions = {}) {
  const instance = axios.create({
    baseURL: getApiBaseUrl(isMock),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  return instance;
}
