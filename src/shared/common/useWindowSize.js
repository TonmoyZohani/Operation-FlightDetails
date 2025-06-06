import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    isMobile: window.innerWidth <= 1199,
    isTab: window.innerWidth > 700 && window.innerWidth <= 1199,
    isMedium: window.innerWidth <= 1600,
    isLarge: window.innerWidth <= 1920,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        isMobile: window.innerWidth <= 1199,
        isTab: window.innerWidth > 700 && window.innerWidth <= 1199,
        isMedium: window.innerWidth <= 1600,
        isLarge: window.innerWidth <= 1920,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
