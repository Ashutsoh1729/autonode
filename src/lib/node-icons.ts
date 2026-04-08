import {
  GlobeIcon,
  MousePointerIcon,
  Clock,
  BrainIcon,
  Mail,
  Repeat,
  FileText,
  LucideIcon,
} from "lucide-react";

export const nodeIcons = {
  INITIAL: MousePointerIcon,
  MANUAL_TRIGGER: MousePointerIcon,
  CRON_TRIGGER: Clock,
  HTTP_REQUEST: GlobeIcon,
  AI: BrainIcon,
  EMAIL: Mail,
  LOOP: Repeat,
  NOTION: FileText,
  CODE_BLOCK: FileText,
} as const;

export type NodeIconKey = keyof typeof nodeIcons;

export const getNodeIcon = (key: NodeIconKey): LucideIcon => {
  return nodeIcons[key] || FileText;
};
