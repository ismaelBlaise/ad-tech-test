/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type TabType = "dashboard" | "campagnes";

interface ActiveTabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ActiveTabContext = createContext<ActiveTabContextType | undefined>(
  undefined,
);

interface ActiveTabProviderProps {
  children: ReactNode;
}

export function ActiveTabProvider({ children }: ActiveTabProviderProps) {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const saved = localStorage.getItem("activeTab");
    return (saved as TabType) || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const value: ActiveTabContextType = {
    activeTab,
    setActiveTab,
  };

  return (
    <ActiveTabContext.Provider value={value}>
      {children}
    </ActiveTabContext.Provider>
  );
}

export function useActiveTab(): ActiveTabContextType {
  const context = useContext(ActiveTabContext);

  if (context === undefined) {
    throw new Error("useActiveTab must be used within an ActiveTabProvider");
  }

  return context;
}
