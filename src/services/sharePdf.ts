import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export type SharePdfResult =
  | { status: 'shared' }
  | { status: 'unavailable' }
  | { status: 'error' };

/**
 * Shares a PDF from a predictable cache filename. Some Android share targets
 * reject temporary print files whose URI or MIME metadata is ambiguous.
 */
export async function sharePdf(pdfUri: string): Promise<SharePdfResult> {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      return { status: 'unavailable' };
    }

    // expo-print returns a valid cache URI, but Expo Go can report `exists`
    // incorrectly for that URI. Try creating a friendly filename; if the copy
    // is not supported, share the original print URI directly.
    let shareUri = pdfUri;
    try {
      const source = new File(pdfUri);
      const shareFile = new File(
        Paths.cache,
        `SizeKit-${Date.now()}.pdf`,
      );
      await source.copy(shareFile);
      shareUri = shareFile.uri;
    } catch {
      shareUri = pdfUri;
    }

    await Sharing.shareAsync(shareUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share SizeKit PDF',
      ...(Platform.OS === 'ios' ? { UTI: 'com.adobe.pdf' } : {}),
    });

    return { status: 'shared' };
  } catch {
    return { status: 'error' };
  }
}
