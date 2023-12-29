import type { Writable } from 'stream';
import { Bool, Int64, Utf8 } from '@cloudquery/plugin-sdk-javascript/arrow';
import { createColumn } from '@cloudquery/plugin-sdk-javascript/schema/column';
import { pathResolver } from '@cloudquery/plugin-sdk-javascript/schema/resolvers';
import { createTable } from '@cloudquery/plugin-sdk-javascript/schema/table';
import type {
	Table,
	TableResolver,
} from '@cloudquery/plugin-sdk-javascript/schema/table';
import { JSONType } from '@cloudquery/plugin-sdk-javascript/types/json';
import type { Logger } from 'winston';
import { getZones } from '../nsone.js';
import type { Spec } from '../spec.js';

export const zonesTable = (logger: Logger, spec: Spec): Table => {
	const resolver: TableResolver = async (
		_clientMeta: unknown,
		_parent: unknown,
		stream: Writable,
	) => {
		const data = await getZones(logger, spec.apiKey);

		data.forEach((zone) => {
			stream.write(zone);
		});
		return;
	};

	return createTable({
		name: 'ns1_zones',
		description:
			'Active DNS zones along with basic zone configuration details for each.',
		columns: [
			createColumn({
				name: 'id',
				type: new Utf8(),
				resolver: pathResolver('id'),
			}),
			createColumn({
				name: 'created_at',
				type: new Int64(),
				resolver: pathResolver('created_at'),
			}),
			createColumn({
				name: 'dnssec',
				type: new Bool(),
				resolver: pathResolver('dnssec'),
			}),
			createColumn({
				name: 'expiry',
				type: new Int64(),
				resolver: pathResolver('expiry'),
			}),
			createColumn({
				name: 'hostmaster',
				type: new Utf8(),
				resolver: pathResolver('hostmaster'),
			}),
			createColumn({
				name: 'local_tags',
				type: new JSONType(),
				resolver: pathResolver('local_tags'),
			}),
			createColumn({
				name: 'name',
				type: new Utf8(),
				resolver: pathResolver('name'),
			}),
			createColumn({
				name: 'network_pools',
				type: new JSONType(),
				resolver: pathResolver('network_pools'),
			}),
			createColumn({
				name: 'networks',
				type: new JSONType(),
				resolver: pathResolver('networks'),
			}),
			createColumn({
				name: 'nx_ttl',
				type: new Int64(),
				resolver: pathResolver('nx_ttl'),
			}),
			createColumn({
				name: 'primary',
				type: new JSONType(),
				resolver: pathResolver('primary'),
			}),
			createColumn({
				name: 'primary_master',
				type: new Utf8(),
				resolver: pathResolver('primary_master'),
			}),
			createColumn({
				name: 'refresh',
				type: new Int64(),
				resolver: pathResolver('refresh'),
			}),
			createColumn({
				name: 'retry',
				type: new Int64(),
				resolver: pathResolver('retry'),
			}),
			createColumn({
				name: 'serial',
				type: new Int64(),
				resolver: pathResolver('serial'),
			}),
			createColumn({
				name: 'ttl',
				type: new Int64(),
				resolver: pathResolver('ttl'),
			}),
			createColumn({
				name: 'updated_at',
				type: new Int64(),
				resolver: pathResolver('updated_at'),
			}),
			createColumn({
				name: 'zone',
				type: new Utf8(),
				resolver: pathResolver('zone'),
			}),
		],
		resolver,
	});
};
