import React from "react";
import { Flex, Heading, Text, Button, Spinner } from "@chakra-ui/react";
import { GiCardJoker } from "react-icons/gi";
import axios from "axios";
import { useQuery } from "react-query";

interface OnlyChildren {
  children: React.ReactNode;
}

interface ApiJoke {
  id: number;
  setup: string;
  punchline: string;
  type: string;
}

const fetchJoke = async (): Promise<ApiJoke> => {
  const { data } = await axios.get(
    "https://official-joke-api.appspot.com/random_joke"
  );
  return data;
};

const CardShell: React.FC<OnlyChildren> = (props) => {
  return (
    <Flex
      backgroundColor="lightblue"
      height="100vh"
      width="100%"
      alignItems="center"
      flexDirection="column"
      padding="32px"
    >
      <Flex
        minWidth={["0px", "0px", "800px", "800px"]}
        flexDirection="column"
        backgroundColor="white"
        boxShadow="3px 3px 10px grey"
        alignItems="center"
        padding="32px"
      >
        <Heading color="black" pb="16px">
          Joke Generator
        </Heading>
        {props.children}
      </Flex>
    </Flex>
  );
};

interface JokeDisplayProps {
  data: ApiJoke | undefined;
  error: unknown;
  isFetching: boolean;
  status: string;
}

export const JokeDisplayer: React.FC<JokeDisplayProps> = (props) => {
  const { status, isFetching, error, data } = props;
  if (isFetching === true) return <Spinner data-testid="spinner" size="xl" />;
  if (status === "idle")
    return <GiCardJoker data-testid="joker-card" size="200" />;
  if (error !== null)
    return <Text>Something went wrong... the sadness. 🙁</Text>;
  return (
    <>
      <Text pb="8px">{data?.setup}</Text>
      <Text>{data?.punchline}</Text>
    </>
  );
};

const JokeController = () => {
  const { data, error, refetch, isFetching, status } = useQuery(
    "joke",
    fetchJoke,
    { enabled: false }
  );
  const getJoke = React.useCallback(() => {
    refetch();
  }, [refetch]);
  return (
    <>
      <Flex flexDirection="column" alignItems="center" pb="24px">
        <JokeDisplayer
          data={data}
          error={error}
          isFetching={isFetching}
          status={status}
        />
      </Flex>
      <Button onClick={getJoke} colorScheme="teal">
        Generate Joke
      </Button>
    </>
  );
};

const App = () => (
  <CardShell>
    <JokeController />
  </CardShell>
);

export default App;
