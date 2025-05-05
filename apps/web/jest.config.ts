import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',       // ← primeiro, mais específico
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@tanstack|@testing-library|react)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};

export default config;
