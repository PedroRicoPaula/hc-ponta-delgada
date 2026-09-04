
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          aria-label="Voltar ao topo"
          className="fixed bottom-4 left-4 z-50 h-8 w-8 bg-primary hover:bg-primary/90 text-black hover:scale-125 transition-transform duration-200"
        >
          ↑
        </Button>
      )}
    </>
  );
};
