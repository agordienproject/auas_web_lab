import { Client } from 'basic-ftp';

const FTP_HOST = process.env.FTP_HOST || '';
const FTP_PORT = process.env.FTP_PORT ? parseInt(process.env.FTP_PORT, 10) : 21;
const FTP_USER = process.env.FTP_USER || '';
const FTP_PASSWORD = process.env.FTP_PASSWORD || '';
const FTP_SECURE = (process.env.FTP_SECURE || 'false').toLowerCase() === 'true';

export async function withFtpClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: FTP_HOST,
      port: FTP_PORT,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: FTP_SECURE,
    });
    return await fn(client);
  } finally {
    client.close();
  }
}

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

export function isImage(name: string) {
  const lower = name.toLowerCase();
  return IMAGE_EXTS.some(ext => lower.endsWith(ext));
}

function extractFtpPath(folderPath: string) {
  try {
    // Node's URL can parse ftp scheme; take only the pathname
    const u = new URL(folderPath);
    if (u.protocol.startsWith('ftp')) {
      return decodeURIComponent(u.pathname).replace(/^\/+/, '');
    }
  } catch {}
  // Fallback: strip ftp://, host and leading slash
  const raw = folderPath.replace(/^ftp:\/\//i, '').replace(/^[^/]+\//, '').replace(/^\/+/, '');
  if (raw.includes('..')) throw new Error('Invalid folder path');
  return raw;
}

export async function listImageFiles(folderPath: string) {
  return await withFtpClient(async (client) => {
    console.log("Extracting FTP path from folderPath:", folderPath);
    const path = extractFtpPath(folderPath);
    const list = await client.list(path);
    return list
      .filter(item => item.isFile && isImage(item.name))
      .map(item => ({ name: item.name, size: item.size }));
  });
}

export async function getImageStream(folderPath: string, fileName: string, writable: NodeJS.WritableStream) {
  return await withFtpClient(async (client) => {
    const base = extractFtpPath(folderPath);
    const full = base.endsWith('/') ? `${base}${fileName}` : `${base}/${fileName}`;
    await client.downloadTo(writable as any, full);
  });
}
