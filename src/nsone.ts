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
		const json = (await response.json()) as unknown;
		return json as T;
	}

	logger.info(`Error ${response.status}: ${await response.text()}`);
	throw new Error('Non 200 status code returned from request');
}

export type ZoneSummary = {
	id: string;
	created_at: number;
	dns_servers: string[];
	dnssec: boolean;
	expiry: number;
	hostmaster: string;
	local_tags: string[];
	name: string;
	network_pools: string[];
	networks: number[];
	nx_ttl: number;
	primary: Record<string, unknown>;
	primary_master: string;
	refresh: number;
	retry: number;
	serial: number;
	ttl: number;
	updated_at: number;
	zone: string;
};

export type DnsRecord = {
	id: string;
	domain: string;
	link: string;
	meta: Record<string, unknown>;
	networks: number[];
	regions: Record<string, unknown>;
	short_answers: string[];
	tier: number;
	ttl: number;
	type: string;
	use_client_subnet: boolean;
	zone: string;
	zone_name: string;
};

export type ZoneSummaryWithRecords = ZoneSummary & {
	records: DnsRecord[];
};

export type DnsRecordDetail = {
	answers: Array<Record<string, unknown>>;
	created_at: number;
	domain: string;
	feeds: string[];
	filters: string[];
	meta: Record<string, unknown>;
	networks: number[];
	regions: Record<string, unknown>;
	tier: number;
	ttl: number;
	type: string;
	updated_at: number;
	use_client_subnet: boolean;
	zone: string;
	zone_name: string;
	id: string;
};

export type DnsRecordWithDetail = DnsRecord & DnsRecordDetail;

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

export async function getRecords(
	logger: Logger,
	apiKey: string,
	zoneSummary: ZoneSummary,
): Promise<DnsRecord[]> {
	const data = await nsoneRequest<ZoneSummaryWithRecords>(
		logger,
		'GET',
		`/zones/${zoneSummary.zone}`,
		apiKey,
	);

	return data.records;
}

export async function getRecordDetail(
	logger: Logger,
	apiKey: string,
	dnsRecord: DnsRecord,
): Promise<DnsRecordWithDetail> {
	const details = await nsoneRequest<DnsRecordDetail>(
		logger,
		'GET',
		`/zones/${dnsRecord.zone}/${dnsRecord.domain}/${dnsRecord.type}`,
		apiKey,
	);

	return {
		...dnsRecord,
		...details,
	};
}
