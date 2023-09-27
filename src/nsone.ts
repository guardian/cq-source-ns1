import type { Logger } from 'winston';

const apiPrefix = 'https://api.nsone.net/v1';

async function nsoneRequest<T extends object>(
	logger: Logger,
	method: string,
	url: string,
	apiKey: string,
): Promise<T> {
	const headers = {
		'X-NSONE-Key': apiKey,
	};
	const fullUrl = `${apiPrefix}${url}`;
	logger.info('Making request to NSone', method, fullUrl);

	const response = await fetch(fullUrl, { method, headers });

	if (response.ok) {
		return (await response.json()) as T;
	}

	logger.info(`Error: ${await response.text()}`);
	throw new Error('Non 200 status code returned from request');
}

export type ZoneSummary = {
	id: string;
	ttl: number;
	nx_ttl: number;
	retry: number;
	zone: string;
	refresh: number;
	expiry: number;
	dns_servers: string[];
	networks: number[];
	network_pools: string[];
	meta: Record<string, unknown>;
	hostmaster: string;
};

/**
 * Returns a list of all active DNS zones along with basic zone configuration details for each.
 *
 * @see https://ns1.com/api?docId=2184
 * @see https://jsapi.apiary.io/apis/ns1api/introduction/api-simulator-tutorial.html
 */
export function getZones(
	logger: Logger,
	apiKey: string,
): Promise<ZoneSummary[]> {
	return nsoneRequest<ZoneSummary[]>(logger, 'GET', '/zones', apiKey);
}
