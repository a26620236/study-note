import { useEffect, useRef, useState } from 'react';

const BASE_WS_URL = 'ws://localhost:3002';

const getWebSocketUrl = (isMock: boolean) =>
  isMock ? BASE_WS_URL : process.env.NEXT_PUBLIC_WS_BASE_URL || BASE_WS_URL;

interface WebSocketData<ResponseData> {
  data: ResponseData | null;
}

export function useWebSocket<ResponseData>(
  url: string | null,
  isMock = false
): WebSocketData<ResponseData> {
  const [data, setData] = useState<ResponseData | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);

  const wsUrl = getWebSocketUrl(isMock);
  const wsUrlWithPath = `${wsUrl}${url}`;

  useEffect(() => {
    if (!url) return;

    shouldReconnectRef.current = true;

    const connect = () => {
      const ws = new WebSocket(wsUrlWithPath);
      wsRef.current = ws;

      ws.addEventListener('message', (event: MessageEvent<string>) => {
        try {
          // JSON.parse returns `any`; caller is responsible for the shape contract.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
          const parsed = JSON.parse(event.data) as ResponseData;
          setData(parsed);
        } catch (e) {
          console.error('WebSocket message parse error:', e);
        }
      });

      ws.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
      });

      ws.addEventListener('close', () => {
        console.info('WebSocket closed');
        if (shouldReconnectRef.current) {
          console.info('Reconnecting in 5 seconds...');
          reconnectTimerRef.current = setTimeout(() => {
            reconnectTimerRef.current = null;
            connect();
          }, 5000);
        }
      });
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      wsRef.current?.close();
    };
  }, [url, wsUrlWithPath]);

  return { data };
}
