import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Application() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/enrollment");
  }, [setLocation]);

  return null;
}
