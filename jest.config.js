module.exports = {
	verbose: true,
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	testMatch: ['<rootDir>/src/**/*.test.ts'],
};
