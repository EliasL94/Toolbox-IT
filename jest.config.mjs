import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
};

export default createJestConfig(config);
