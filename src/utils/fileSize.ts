/** Common upload size targets in bytes. */
export const TARGET_SIZE_PRESETS = [
  { id: '20kb', label: '20 KB', bytes: 20 * 1024 },
  { id: '50kb', label: '50 KB', bytes: 50 * 1024 },
  { id: '100kb', label: '100 KB', bytes: 100 * 1024 },
  { id: '200kb', label: '200 KB', bytes: 200 * 1024 },
  { id: '500kb', label: '500 KB', bytes: 500 * 1024 },
  { id: '1mb', label: '1 MB', bytes: 1024 * 1024 },
] as const;

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '—';
  }

  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }

  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  }

  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(2) : mb.toFixed(1)} MB`;
}

export function parseCustomSizeToBytes(input: string): number | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*(kb|mb|b)?$/);
  if (!match) {
    return null;
  }

  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  const unit = match[2] ?? 'kb';
  if (unit === 'b') {
    return Math.round(value);
  }
  if (unit === 'mb') {
    return Math.round(value * 1024 * 1024);
  }
  return Math.round(value * 1024);
}
