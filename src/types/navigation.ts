export type RootStackParamList = {
  Home: undefined;
  CompressPhoto: { presetId?: string; presetTitle?: string } | undefined;
  ResizePhoto: undefined;
  CropPhoto: undefined;
  ImageToPdf: undefined;
  ConvertFormat: undefined;
};

export type ToolRouteName = Exclude<keyof RootStackParamList, 'Home'>;
