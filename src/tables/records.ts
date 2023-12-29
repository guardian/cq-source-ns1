import type { Writable } from 'stream';
import { Bool, Int64, Utf8 } from '@cloudquery/plugin-sdk-javascript/arrow';
import { createColumn } from '@cloudquery/plugin-sdk-javascript/schema/column';
import { pathResolver } from '@cloudquery/plugin-sdk-javascript/schema/resolvers';
import type {
	Table,
	TableResolver,
} from '@cloudquery/plugin-sdk-javascript/schema/table';
import { createTable } from '@cloudquery/plugin-sdk-javascript/schema/table';
import { JSONType } from '@cloudquery/plugin-sdk-javascript/types/json';
import type { Logger } from 'winston';
import { getRecordDetail, getRecords, getZones } from '../nsone.js';
import type { Spec } from '../spec.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const recordsTable = (logger: Logger, spec: Spec): Table => {
	const resolver: TableResolver = async (
		_clientMeta: unknown,
		_parent: unknown,
		stream: Writable,
	) => {
		const zones = await getZones(logger, spec.apiKey);

		for (const zone of zones) {
			const dnsRecords = await getRecords(logger, spec.apiKey, zone);

			for (const dnsRecord of dnsRecords) {
				const recordDetail = await getRecordDetail(
					logger,
					spec.apiKey,
					dnsRecord,
				);

				stream.write(recordDetail);

				// Attempt to avoid rate limiting from the NS1 API
				const sleepDuration = 100;
				logger.info(`Sleeping for ${sleepDuration}ms`);
				await sleep(sleepDuration);
			}
		}

		return;
	};

	return createTable({
		name: 'ns1_records',
		description: 'DNS records per zone',
		columns: [
			createColumn({
				name: 'id',
				type: new Utf8(),
				resolver: pathResolver('id'),
			}),
			createColumn({
				name: 'domain',
				type: new Utf8(),
				resolver: pathResolver('domain'),
			}),
			createColumn({
				name: 'link',
				type: new Utf8(),
				resolver: pathResolver('link'),
			}),
			createColumn({
				name: 'meta',
				type: new JSONType(),
				resolver: pathResolver('meta'),
			}),
			createColumn({
				name: 'networks',
				type: new JSONType(),
				resolver: pathResolver('networks'),
			}),
			createColumn({
				name: 'regions',
				type: new JSONType(),
				resolver: pathResolver('regions'),
			}),
			createColumn({
				name: 'short_answers',
				type: new JSONType(),
				resolver: pathResolver('short_answers'),
			}),
			createColumn({
				name: 'tier',
				type: new Int64(),
				resolver: pathResolver('tier'),
			}),
			createColumn({
				name: 'ttl',
				type: new Int64(),
				resolver: pathResolver('ttl'),
			}),
			createColumn({
				name: 'type',
				type: new Utf8(),
				resolver: pathResolver('type'),
			}),
			createColumn({
				name: 'use_client_subnet',
				type: new Bool(),
				resolver: pathResolver('use_client_subnet'),
			}),
			createColumn({
				name: 'zone',
				type: new Utf8(),
				resolver: pathResolver('zone'),
			}),
			createColumn({
				name: 'zone_name',
				type: new Utf8(),
				resolver: pathResolver('zone_name'),
			}),
			createColumn({
				name: 'created_at',
				type: new Int64(),
				resolver: pathResolver('created_at'),
			}),
			createColumn({
				name: 'updated_at',
				type: new Int64(),
				resolver: pathResolver('updated_at'),
			}),
			createColumn({
				name: 'answers',
				type: new JSONType(),
				resolver: pathResolver('answers'),
			}),
			createColumn({
				name: 'feeds',
				type: new JSONType(),
				resolver: pathResolver('feeds'),
			}),
			createColumn({
				name: 'filters',
				type: new JSONType(),
				resolver: pathResolver('filters'),
			}),
		],
		resolver,
	});
};
