import React from "react";
import Providers from "./Providers";
import App from "./App";
import { render } from "@testing-library/react";

describe("Our application", () => {
  test("Renders without crashing", () => {
    expect(() =>
      render(
        <Providers>
          <App />
        </Providers>
      )
    ).not.toThrow();
  });
});
