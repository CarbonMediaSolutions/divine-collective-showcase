import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Wait for the new route's DOM to mount, then scroll to the anchor
      const id = hash.replace("#", "");
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return true;
        }
        return false;
      };
      if (!tryScroll()) {
        // Retry shortly in case the target hasn't rendered yet
        const t = setTimeout(tryScroll, 100);
        return () => clearTimeout(t);
      }
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

export default ScrollToTop;
