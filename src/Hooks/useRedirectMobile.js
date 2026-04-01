import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "./useIsMobile";

export function useRedirectMobile(to) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMobile && location.pathname !== to) {
      navigate(to, { replace: true });
    }
  }, [isMobile, location.pathname, to, navigate]);
}