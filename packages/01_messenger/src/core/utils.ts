import fs from 'fs';
export function ensureDirectoryExistence(dirname: string) {
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
}
