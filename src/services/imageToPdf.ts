import {
  ImageManipulator,
  SaveFormat,
} from 'expo-image-manipulator';
import * as Print from 'expo-print';

import { getFileSizeBytes } from '../utils/files';

export type PdfPageSize = 'a4' | 'letter' | 'fit';

export type ImageToPdfInput = {
  uri: string;
  width: number;
  height: number;
  pageSize: PdfPageSize;
};

export type ImageToPdfResult = {
  pdfUri: string;
  bytes: number;
  pageWidth: number;
  pageHeight: number;
  imageWidth: number;
  imageHeight: number;
  note?: string;
};

const LETTER = { width: 612, height: 792 };
const A4 = { width: 595, height: 842 };
/** Cap embedded image size to keep memory use reasonable on phones. */
const MAX_EMBED_EDGE = 2000;

function pageSizeFor(
  pageSize: PdfPageSize,
  imageWidth: number,
  imageHeight: number,
): { width: number; height: number } {
  if (pageSize === 'letter') {
    return imageWidth >= imageHeight
      ? { width: LETTER.height, height: LETTER.width }
      : { ...LETTER };
  }

  if (pageSize === 'a4') {
    return imageWidth >= imageHeight
      ? { width: A4.height, height: A4.width }
      : { ...A4 };
  }

  // Fit page to image proportions, capped for print engines.
  const maxEdge = 792;
  const scale = Math.min(1, maxEdge / Math.max(imageWidth, imageHeight));
  return {
    width: Math.max(72, Math.round(imageWidth * scale)),
    height: Math.max(72, Math.round(imageHeight * scale)),
  };
}

function buildHtml(base64Jpeg: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
    />
    <style>
      @page { margin: 0; }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
      }
    </style>
  </head>
  <body>
    <img src="data:image/jpeg;base64,${base64Jpeg}" />
  </body>
</html>`;
}

/**
 * Converts a local image into a single-page PDF on-device.
 * Images are inlined as base64 so PDF generation works on iOS as well as Android.
 */
export async function convertImageToPdf(
  input: ImageToPdfInput,
): Promise<ImageToPdfResult> {
  const context = ImageManipulator.manipulate(input.uri);
  const longest = Math.max(input.width, input.height);

  if (longest > MAX_EMBED_EDGE) {
    const scale = MAX_EMBED_EDGE / longest;
    context.resize({
      width: Math.round(input.width * scale),
      height: Math.round(input.height * scale),
    });
  }

  const rendered = await context.renderAsync();
  const saved = await rendered.saveAsync({
    compress: 0.88,
    format: SaveFormat.JPEG,
    base64: true,
  });

  if (!saved.base64) {
    throw new Error('Unable to prepare this image for PDF.');
  }

  const page = pageSizeFor(input.pageSize, saved.width, saved.height);
  const html = buildHtml(saved.base64);

  const pdf = await Print.printToFileAsync({
    html,
    width: page.width,
    height: page.height,
  });

  let note: string | undefined;
  if (longest > MAX_EMBED_EDGE) {
    note =
      'Very large photos are slightly downscaled for the PDF so this phone can finish the conversion reliably.';
  }

  return {
    pdfUri: pdf.uri,
    bytes: getFileSizeBytes(pdf.uri),
    pageWidth: page.width,
    pageHeight: page.height,
    imageWidth: saved.width,
    imageHeight: saved.height,
    note,
  };
}
