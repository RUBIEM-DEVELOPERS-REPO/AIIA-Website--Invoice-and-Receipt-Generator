import { createContext, useContext, useState, ReactNode } from "react";

type PlanDetails = {
  name: string;
  billing: "yearly";
  amount: string;
} | null;

type MembershipContextType = {
  selectedPlan: PlanDetails;
  setSelectedPlan: (plan: PlanDetails) => void;
};

const MembershipContext = createContext<MembershipContextType>({
  selectedPlan: null,
  setSelectedPlan: () => {},
});

export function MembershipProvider({ children }: { children: ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails>(null);

  return (
    <MembershipContext.Provider 
      value={{ 
        selectedPlan, 
        setSelectedPlan
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error("useMembership must be used within a MembershipProvider");
  }
  return context;
}