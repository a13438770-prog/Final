import React, { useEffect, useState } from "react";

interface PageLoaderProps {
  isLoading: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading }) => {
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (isLoading) {
      setOpacity(1);
      setWidth(30);
      const timer1 = setTimeout(() => setWidth(60), 400);
      const timer2 = setTimeout(() => setWidth(90), 1000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setWidth(100);
      const timer = setTimeout(() => {
        setOpacity(0);
        setTimeout(() => setWidth(0), 300);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div 
      className="fixed top-0 left-0 h-1 z-[99999] bg-gradient-to-r from-[#dc2626] via-[#facc15] to-[#2563eb] shadow-sm transition-all duration-300 ease-out"
      style={{ 
        width: `${width}%`,
        opacity: opacity,
      }}
    />
  );
};

export default PageLoader;
