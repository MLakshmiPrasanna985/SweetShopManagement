const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    "/node_modules/(?!uuid)" // transform uuid, allow ESM parsing
  ],
  globals: {
    'ts-jest': {
      useESM: true, // important for ESM support
    },
  },
};
