declare module "lucide-react" {
  import * as React from "react";
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }
  export type LucideIcon = React.FC<LucideProps>;

  export const Pause: LucideIcon;
  export const Play: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Trophy: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Home: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Volume2: LucideIcon;
  export const VolumeX: LucideIcon;
  export const Zap: LucideIcon;
  export const Snowflake: LucideIcon;
  export const Shield: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const TriangleAlert: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Sprout: LucideIcon;
}
