"use client";
import { createContext, useCallback, useMemo, useState } from "react";

interface StateContextProps {
  open: boolean;
  handleSetOpen: (value?: boolean) => void;
  theme: boolean;
  handleSetTheme: VoidFunction;
  isMobile: boolean;
  handleSetIsMobile: VoidFunction;
  // workData: any[];
  // handleSetWorkData: (value: any[]) => void;
}

const StateContext = createContext<StateContextProps | null>(null);

const StateContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // const [workData, setWorkData] = useState<any[]>([]);

  const handleSetOpen = useCallback((value?: boolean) => setOpen(prev => (typeof value === "boolean" ? value : !prev)), []);
  const handleSetTheme = useCallback(() => setTheme((prev) => !prev), []);
  const handleSetIsMobile = useCallback(() => setIsMobile((prev) => !prev), []);
  // const handleSetWorkData = useCallback((value: any[]) => {
  //   if (Array.isArray(value)) setWorkData(value);
  // }, []);

  const contextValue = useMemo<StateContextProps>(
    () => ({
      open, handleSetOpen, theme, handleSetTheme, isMobile, handleSetIsMobile, //workData, handleSetWorkData
    }),
    [
      open, handleSetOpen, theme, handleSetTheme, isMobile, handleSetIsMobile, //workData, handleSetWorkData
    ]
  );

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export { StateContextProvider, StateContext };
