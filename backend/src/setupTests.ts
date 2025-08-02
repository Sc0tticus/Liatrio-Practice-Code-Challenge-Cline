// Setup file for Jest tests
import { initializeDatabase, closeDatabase } from "./database/database";

// Global test setup
beforeAll(async () => {
  // Initialize test database
  await initializeDatabase();
});

// Global test teardown
afterAll(async () => {
  // Close database connection
  await closeDatabase();
});

// Setup for each test
beforeEach(() => {
  // Reset any mocks or test state
  jest.clearAllMocks();
});
