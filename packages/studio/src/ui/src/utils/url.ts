declare const process: any;

export function getBackendUrl(path: string): string {
  const baseUrl = !import.meta.env.DEV ? `` : `http://localhost:7874`;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function getWebSocketUrl(path: string): string {
  const baseUrl = !import.meta.env.DEV
    ? `ws://${window.location.host}`
    : `ws://localhost:7874`;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
