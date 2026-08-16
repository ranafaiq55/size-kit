import { requireOptionalNativeModule } from 'expo-modules-core';

export type SaveImageResult =
  | { status: 'saved' }
  | { status: 'permission_denied' }
  | { status: 'unavailable' }
  | { status: 'error' };

/**
 * expo-media-library's native module is missing in Expo Go, and importing the
 * package throws in that case. Probe for the native module first so the app can
 * fall back to sharing instead of surfacing a native error.
 */
export function isGallerySaveAvailable(): boolean {
  return requireOptionalNativeModule('ExpoMediaLibraryNext') != null;
}

/** Saves an image to the device gallery. Works in development and production builds. */
export async function saveImageToGallery(uri: string): Promise<SaveImageResult> {
  if (!isGallerySaveAvailable()) {
    return { status: 'unavailable' };
  }

  try {
    const MediaLibrary = await import('expo-media-library');
    const permission = await MediaLibrary.requestPermissionsAsync();

    if (!permission.granted) {
      return { status: 'permission_denied' };
    }

    await MediaLibrary.Asset.create(uri);
    return { status: 'saved' };
  } catch {
    return { status: 'error' };
  }
}
