import React from 'react';
import { Flex, Heading, Button } from '@chakra-ui/react';
import { FaQuestionCircle } from 'react-icons/fa'

function App() {
  return (
    <Flex backgroundColor="lightblue" height='100vh' width="100%" alignItems="center" flexDirection="column" padding="32px">
      <Heading color="black" pb="16px">Joke Generator</Heading>
      <Flex pb="24px">
        <FaQuestionCircle color="black" size="100" />
      </Flex>
      <Button colorScheme="teal">Generate Joke</Button>
    </Flex>
  );
}

export default App;
