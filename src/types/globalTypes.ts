export interface ViewportState {
  width: number;
  height: number;
  type: "mobile" | "tablet" | "desktop";
}

export interface AnimatedContainerProps {
  children: React.ReactNode;
  isEntering: boolean;
  className?: string;
  entry?: string;
  exit?: string;
}