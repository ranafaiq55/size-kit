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
  CropPhoto: undefined;
  ImageToPdf: undefined;
  ConvertFormat: undefined;
  Settings: undefined;
};

export type ToolRouteName = Exclude<
  keyof RootStackParamList,
  'Home' | 'CompressResult' | 'Settings'
>;
