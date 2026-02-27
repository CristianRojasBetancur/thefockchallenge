/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        // Stub CSS/SVG/image imports
        '\\.(css|less|scss|sass|svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/src/__mocks__/styleMock.ts',
        // Stub the API client so import.meta.env doesn't blow up in Jest
        '^../api/client$': '<rootDir>/src/__mocks__/client.ts',
        '^./client$': '<rootDir>/src/__mocks__/client.ts',
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                verbatimModuleSyntax: false,
                jsx: 'react-jsx',
                esModuleInterop: true,
            },
            diagnostics: false,
        }],
    },
}
