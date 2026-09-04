import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteScrollReset = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default RouteScrollReset;
