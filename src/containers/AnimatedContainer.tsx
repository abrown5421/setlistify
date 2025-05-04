import React, { useEffect, useState } from "react";
import "animate.css";
import { AnimatedContainerProps } from "../types/globalTypes";

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  isEntering,
  className = "",
  entry = "animate__fadeIn",
  exit = "animate__fadeOut",
}) => {
  const [shouldRender, setShouldRender] = useState(isEntering);

  useEffect(() => {
    if (isEntering) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isEntering]);

  if (!shouldRender) return null;

  return (
    <div
      className={`animate__faster animate__animated ${
        isEntering ? entry : exit
      } ${className} animated-page`.trim()}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
