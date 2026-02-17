import { useEffect } from "react";
import { useLocation } from "wouter";

export default function FormsPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/enrollment");
  }, [setLocation]);

  return null;
}
