import { createContext, useContext, useMemo, useState } from "react";

const SidebarContext = createContext(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const value = useMemo(
    () => ({
      mobileOpen,
      setMobileOpen,
      toggle: () => setMobileOpen((v) => !v),
    }),
    [mobileOpen]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
