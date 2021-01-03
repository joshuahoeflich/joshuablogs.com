import fs from "fs";
import { extractMetadata, PROJECT_ROOT } from "./lib";

describe("Project root", () => {
  test("Points to the right directory", () => {
    expect(fs.readdirSync(PROJECT_ROOT).includes(".gitignore")).toBe(true);
  });
});

describe("extractMetadata", () => {
  test("Returns the right title", () => {
    expect(
      extractMetadata(`---
title: thingy
description: another thingy
---
# thingy

another thingy

this is a markdown document
`)
    ).toStrictEqual({
      title: "thingy",
      description: "another thingy",
    });
  });
});
