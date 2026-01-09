import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useOnboarding = () => {
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed") === "true";
    setIsCompleted(completed);

    // Redirect to onboarding if not completed and not already there
    if (!completed && location.pathname !== "/onboarding") {
      navigate("/onboarding");
    }
  }, [location.pathname, navigate]);

  const resetOnboarding = () => {
    localStorage.removeItem("onboarding_completed");
    setIsCompleted(false);
    navigate("/onboarding");
  };

  return {
    isCompleted,
    resetOnboarding
  };
};
