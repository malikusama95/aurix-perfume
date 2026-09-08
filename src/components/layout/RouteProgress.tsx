import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const RouteProgress = () => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-muted overflow-hidden">
      <div className="h-full bg-primary animate-[progress_0.3s_ease-out_forwards]" />
    </div>
  );
};

export default RouteProgress;
