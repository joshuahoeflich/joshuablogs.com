import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { JokeDisplayer } from "./App";

describe("Our JokeDisplayer", () => {
  test("Displays an error when there is an error", () => {
    const { getByText } = render(
      <JokeDisplayer
        error
        data={undefined}
        status="failed"
        isFetching={false}
      />
    );
    expect(
      getByText("Something went wrong... the sadness. 🙁")
    ).toBeInTheDocument();
  });
  test("Displays loading when loading", () => {
    const { getByTestId } = render(
      <JokeDisplayer
        error={false}
        data={undefined}
        status="loading"
        isFetching={true}
      />
    );
    expect(getByTestId("spinner")).toBeInTheDocument();
  });
  test("Displays the right thing on initial mount", () => {
    const { getByTestId } = render(
      <JokeDisplayer
        error={false}
        data={undefined}
        status="idle"
        isFetching={false}
      />
    );
    expect(getByTestId("joker-card")).toBeInTheDocument();
  });
  test("Displays the correct joke", () => {
    const { getByText } = render(
      <JokeDisplayer
        error={null}
        data={{
          id: 32,
          type: "general",
          setup: "Why did the chicken cross the road?",
          punchline: "To get to the other side!",
        }}
        status="loaded"
        isFetching={false}
      />
    );
    expect(getByText("To get to the other side!")).toBeInTheDocument();
  });
});
