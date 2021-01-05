import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

interface ProviderProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProviderProps> = (props) => {
  return (
    <React.StrictMode>
      <ChakraProvider>
        {props.children}
      </ChakraProvider>
    </React.StrictMode>
  )
}

export default Providers;
