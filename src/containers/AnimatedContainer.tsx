import React from "react";
import "animate.css";
import { AnimatedContainerProps } from "../types/globalTypes";

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  isEntering,
  className = "",
  entry = "animate__fadeIn",
  exit = "animate__fadeOut",
}) => {
  return (
    <div
      className={`animate__animated ${
        isEntering ? entry : exit
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
