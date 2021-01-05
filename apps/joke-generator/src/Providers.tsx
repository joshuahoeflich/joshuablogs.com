import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@fontsource/roboto-slab";
import "@fontsource/roboto";

interface ProviderProps {
  children: React.ReactNode;
}

const theme = extendTheme({
  fonts: {
    body: "roboto",
    heading: "Roboto Slab",
  },
  components: {
    Heading: {
      baseStyle: {
        letterSpacing: "wide",
      },
    },
  },
});

const ThemeProvider: React.FC<ProviderProps> = ({ children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

const queryClient = new QueryClient();

const ReactQueryProvider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const Providers: React.FC<ProviderProps> = (props) => {
  return (
    <React.StrictMode>
      <ReactQueryProvider>
        <ThemeProvider>{props.children}</ThemeProvider>
      </ReactQueryProvider>
    </React.StrictMode>
  );
};

export default Providers;
