import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders the initial message", () => {
  render(<App />);
  expect(screen.getByText("The click will change this message !")).toBeTruthy();
});

test("clicking the button updates the message", () => {
  render(<App />);
  fireEvent.click(screen.getByText("Click me !"));
  expect(screen.getByText("clicked")).toBeTruthy();
});
