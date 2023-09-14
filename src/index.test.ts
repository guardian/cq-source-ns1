import { main } from './index';

describe('The lambda', () => {
	it('should return a greeting', async () => {
		const response = await main();
		expect(response).toContain('Hello! The time is');
	});
});
