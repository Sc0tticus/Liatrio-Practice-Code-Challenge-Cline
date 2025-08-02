import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Mock the API module
jest.mock("./services/api", () => ({
  todoApi: {
    getTodos: jest.fn().mockResolvedValue([]),
  },
  healthApi: {
    checkHealth: jest.fn().mockResolvedValue({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: 100,
    }),
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("App Component", () => {
  test("renders todo list application", () => {
    renderWithRouter(<App />);

    // Check if the main heading is present
    expect(screen.getByText(/Liatrio Todo List/i)).toBeInTheDocument();
  });

  test("renders todo list component", () => {
    renderWithRouter(<App />);

    // Check if todo list section is present
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument();
  });

  test("renders pipeline status component", () => {
    renderWithRouter(<App />);

    // Check if pipeline status section is present
    expect(screen.getByText(/Pipeline Status/i)).toBeInTheDocument();
  });
});
