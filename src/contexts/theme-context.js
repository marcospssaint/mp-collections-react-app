import React from "react";

export const ThemeContext = React.createContext({
    collapsed: true,
    setCollapsed: (value) => {},
  });