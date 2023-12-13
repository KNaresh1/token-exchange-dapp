"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "../styles/theme";

function UIProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={customTheme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}

export default UIProvider;
