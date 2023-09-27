export type Spec = {
	concurrency: number;
	apiKey: string;
};

export const parseSpec = (spec: string): Spec => {
	const parsed = JSON.parse(spec) as Partial<Spec>;
	const { concurrency = 10_000, apiKey } = parsed;

	if (apiKey === undefined) {
		throw new Error('API key not specified.');
	}

	return { concurrency, apiKey };
};
