export interface AnimatedContainerProps {
    children: React.ReactNode;
    isEntering: boolean;
    className?: string;
    entry?: string;
    exit?: string;
  }