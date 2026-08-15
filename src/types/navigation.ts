export type RootStackParamList = {
  Home: undefined;
  CompressPhoto:
    | {
        presetId?: string;
        presetTitle?: string;
        maxFileSizeBytes?: number;
      }
    | undefined;
  CompressResult: {
    originalUri: string;
    originalBytes: number;
    resultUri: string;
    resultBytes: number;
    targetBytes: number;
    width: number;
    height: number;
    note?: string;
    tempUris?: string[];
  };
  ResizePhoto: undefined;
  ResizeResult: {
    originalUri: string;
    originalBytes: number;
    originalWidth: number;
    originalHeight: number;
    resultUri: string;
    resultBytes: number;
    width: number;
    height: number;
    targetWidth: number;
    targetHeight: number;
    mode: 'fit' | 'exact';
    note?: string;
  };
  CropPhoto: undefined;
  CropResult: {
    resultUri: string;
    resultBytes: number;
    width: number;
    height: number;
    aspectLabel: string;
    note?: string;
  };
  ImageToPdf: undefined;
  PdfResult: {
    sourceUri: string;
    sourceBytes: number;
    pdfUri: string;
    pdfBytes: number;
    pageWidth: number;
    pageHeight: number;
    pageSize: 'a4' | 'letter' | 'fit';
    note?: string;
  };
  ConvertFormat: undefined;
  ConvertResult: {
    originalUri: string;
    originalBytes: number;
    resultUri: string;
    resultBytes: number;
    width: number;
    height: number;
    format: 'jpeg' | 'png' | 'webp';
    mimeType: string;
    note?: string;
  };
  Settings: undefined;
};

export type ToolRouteName = Exclude<
  keyof RootStackParamList,
  | 'Home'
  | 'CompressResult'
  | 'ResizeResult'
  | 'CropResult'
  | 'PdfResult'
  | 'ConvertResult'
  | 'Settings'
>;
