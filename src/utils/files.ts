import { File } from 'expo-file-system';

export function getFileSizeBytes(uri: string): number {
  try {
    const file = new File(uri);
    return file.size ?? 0;
  } catch {
    return 0;
  }
}

export async function deleteUriQuietly(uri: string | undefined | null): Promise<void> {
  if (!uri) {
    return;
  }

  try {
    const file = new File(uri);
    if (file.exists) {
      file.delete();
    }
  } catch {
    // Best-effort cleanup; never crash the app over temp files.
  }
}

export async function deleteUrisQuietly(uris: string[]): Promise<void> {
  await Promise.all(uris.map((uri) => deleteUriQuietly(uri)));
}
