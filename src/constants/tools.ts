import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

import type { ToolRouteName } from '../types/navigation';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type ToolDefinition = {
  id: string;
  title: string;
  subtitle: string;
  route: ToolRouteName;
  icon: IconName;
};

export type RequirementPreset = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
};

export const PRIMARY_TOOL: ToolDefinition = {
  id: 'compress',
  title: 'Compress Photo',
  subtitle: 'Get the exact file size you need.',
  route: 'CompressPhoto',
  icon: 'resize-outline',
};

export const SECONDARY_TOOLS: ToolDefinition[] = [
  {
    id: 'resize',
    title: 'Resize Photo',
    subtitle: 'Exact dimensions',
    route: 'ResizePhoto',
    icon: 'expand-outline',
  },
  {
    id: 'crop',
    title: 'Crop Photo',
    subtitle: 'Frame it right',
    route: 'CropPhoto',
    icon: 'crop-outline',
  },
  {
    id: 'pdf',
    title: 'Image to PDF',
    subtitle: 'Ready to submit',
    route: 'ImageToPdf',
    icon: 'document-text-outline',
  },
  {
    id: 'convert',
    title: 'Convert Format',
    subtitle: 'JPG, PNG, WebP',
    route: 'ConvertFormat',
    icon: 'swap-horizontal-outline',
  },
];

export const POPULAR_REQUIREMENTS: RequirementPreset[] = [
  {
    id: 'cnic',
    title: 'CNIC',
    subtitle: 'ID photo specs',
    icon: 'id-card-outline',
  },
  {
    id: 'visa',
    title: 'Visa',
    subtitle: 'Passport photo',
    icon: 'airplane-outline',
  },
  {
    id: 'job',
    title: 'Job Application',
    subtitle: 'Common size limits',
    icon: 'briefcase-outline',
  },
  {
    id: 'university',
    title: 'University',
    subtitle: 'Admission photos',
    icon: 'school-outline',
  },
];
