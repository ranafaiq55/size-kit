import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type RequirementPreset = {
  id: string;
  name: string;
  category: string;
  width?: number;
  height?: number;
  maxFileSizeBytes?: number;
  allowedFormats?: string[];
  description?: string;
  icon: ComponentProps<typeof Ionicons>['name'];
};

/**
 * Structured presets for Home. Values are common practical targets,
 * not verified official government requirements.
 */
export const REQUIREMENT_PRESETS: RequirementPreset[] = [
  {
    id: 'cnic',
    name: 'CNIC',
    category: 'Pakistan',
    maxFileSizeBytes: 50 * 1024,
    description: 'Common ID photo size limit (verify with the portal you use).',
    icon: 'id-card-outline',
  },
  {
    id: 'visa',
    name: 'Visa',
    category: 'Travel',
    maxFileSizeBytes: 200 * 1024,
    width: 600,
    height: 600,
    description: 'Common visa photo size limit (verify with the embassy portal).',
    icon: 'airplane-outline',
  },
  {
    id: 'job',
    name: 'Job Application',
    category: 'Career',
    maxFileSizeBytes: 100 * 1024,
    description: 'Common job-portal photo limit.',
    icon: 'briefcase-outline',
  },
  {
    id: 'university',
    name: 'University',
    category: 'Education',
    maxFileSizeBytes: 200 * 1024,
    description: 'Common admissions portal photo limit.',
    icon: 'school-outline',
  },
];

export function getPresetById(id: string): RequirementPreset | undefined {
  return REQUIREMENT_PRESETS.find((preset) => preset.id === id);
}
