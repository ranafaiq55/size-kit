import {
  ImageManipulator,
  SaveFormat,
  type ImageResult,
} from 'expo-image-manipulator';

import { deleteUriQuietly, getFileSizeBytes } from '../utils/files';

export type CompressToTargetInput = {
  uri: string;
  width: number;
  height: number;
  targetBytes: number;
};

export type CompressToTargetResult = {
  uri: string;
  width: number;
  height: number;
  bytes: number;
  /** Intermediate files that should be deleted after the final file is kept. */
  tempUris: string[];
  note?: string;
};

type Candidate = {
  uri: string;
  width: number;
  height: number;
  bytes: number;
};

// Below this point JPEG artifacts become much more noticeable than a modest
// reduction in dimensions. Preserve visual quality and resize instead.
const MIN_QUALITY = 0.58;
const MAX_QUALITY = 0.95;
const BINARY_STEPS = 7;
const MIN_SHORT_EDGE = 240;
const TOLERANCE = 0.03;

async function encodeVariant(
  sourceUri: string,
  quality: number,
  width: number,
  height: number,
): Promise<Candidate> {
  const context = ImageManipulator.manipulate(sourceUri);
  context.resize({ width, height });
  const rendered = await context.renderAsync();
  const saved: ImageResult = await rendered.saveAsync({
    compress: quality,
    format: SaveFormat.JPEG,
  });

  return {
    uri: saved.uri,
    width: saved.width,
    height: saved.height,
    bytes: getFileSizeBytes(saved.uri),
  };
}

function chooseBest(candidates: Candidate[], targetBytes: number): Candidate {
  const under = candidates
    .filter((c) => c.bytes > 0 && c.bytes <= targetBytes)
    .sort((a, b) => b.bytes - a.bytes);

  if (under.length > 0) {
    return under[0];
  }

  return [...candidates]
    .filter((c) => c.bytes > 0)
    .sort((a, b) => a.bytes - b.bytes)[0];
}

function withinTolerance(bytes: number, targetBytes: number): boolean {
  return Math.abs(bytes - targetBytes) <= Math.max(1024, targetBytes * TOLERANCE);
}

/**
 * On-device JPEG compression toward a byte target.
 * Searches quality first, then reduces dimensions if still too large.
 */
export async function compressToTargetSize(
  input: CompressToTargetInput,
): Promise<CompressToTargetResult> {
  const { uri, width, height, targetBytes } = input;
  const created: string[] = [];
  const remember = (candidate: Candidate) => {
    created.push(candidate.uri);
    return candidate;
  };

  const originalBytes = getFileSizeBytes(uri);
  if (originalBytes > 0 && originalBytes <= targetBytes) {
    return {
      uri,
      width,
      height,
      bytes: originalBytes,
      tempUris: [],
      note: 'Your photo was already under the target size, so its quality was preserved.',
    };
  }

  let scale = 1;
  const allCandidates: Candidate[] = [];

  for (let pass = 0; pass < 8; pass += 1) {
    const minimumScale = MIN_SHORT_EDGE / Math.min(width, height);
    const effectiveScale = Math.max(scale, minimumScale);
    const passWidth = Math.round(width * effectiveScale);
    const passHeight = Math.round(height * effectiveScale);

    // Check the quality floor first. If it is still too large, skip needless
    // low-quality encodes and reduce dimensions while preserving aspect ratio.
    const floorCandidate = remember(
      await encodeVariant(uri, MIN_QUALITY, passWidth, passHeight),
    );
    allCandidates.push(floorCandidate);

    if (floorCandidate.bytes > targetBytes) {
      if (effectiveScale <= minimumScale) {
        break;
      }
      scale *= 0.82;
      continue;
    }

    let low = MIN_QUALITY;
    let high = MAX_QUALITY;

    for (let step = 0; step < BINARY_STEPS; step += 1) {
      const quality = (low + high) / 2;
      const candidate = remember(
        await encodeVariant(uri, quality, passWidth, passHeight),
      );
      allCandidates.push(candidate);

      if (withinTolerance(candidate.bytes, targetBytes) && candidate.bytes <= targetBytes) {
        break;
      }

      if (candidate.bytes > targetBytes) {
        high = quality;
      } else {
        low = quality;
      }
    }

    // This is the largest resolution that can meet the target without crossing
    // the quality floor, so do not shrink it any further.
    break;
  }

  if (allCandidates.length === 0) {
    throw new Error('Unable to process this image on this device.');
  }

  const selected = chooseBest(allCandidates, targetBytes);
  const leftovers = created.filter((item) => item !== selected.uri);
  void Promise.all(leftovers.map((item) => deleteUriQuietly(item)));

  let note: string | undefined;
  if (selected.bytes > targetBytes) {
    note =
      'This photo could not be reduced all the way to your target while staying usable. Here is the smallest result we could make on this device.';
  } else if (!withinTolerance(selected.bytes, targetBytes)) {
    note = 'Closest usable result under your target size.';
  }

  return {
    uri: selected.uri,
    width: selected.width,
    height: selected.height,
    bytes: selected.bytes,
    tempUris: leftovers,
    note,
  };
}
