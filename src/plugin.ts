import {
	newPlugin,
	newUnimplementedDestination,
} from '@cloudquery/plugin-sdk-javascript/plugin/plugin';
import type {
	Client,
	NewClientFunction,
	Plugin,
	SyncOptions,
	TableOptions,
} from '@cloudquery/plugin-sdk-javascript/plugin/plugin';
import { sync } from '@cloudquery/plugin-sdk-javascript/scheduler';
import {
	filterTables,
	type Table,
} from '@cloudquery/plugin-sdk-javascript/schema/table';
import { parseSpec } from './spec.js';
import type { Spec } from './spec.js';
import { getTables } from './tables.js';

type NS1Client = {
	id: () => string;
};

// TODO read from package.json
const version = '0.0.0';
export const plugin = () => {
	const pluginClient = {
		...newUnimplementedDestination(),
		plugin: null as unknown as Plugin,
		spec: null as unknown as Spec,
		client: null as unknown as NS1Client | null,
		allTables: null as unknown as Table[],
		close: () => Promise.resolve(),
		tables: ({ tables, skipTables, skipDependentTables }: TableOptions) => {
			const { allTables } = pluginClient;
			const filtered = filterTables(
				allTables,
				tables,
				skipTables,
				skipDependentTables,
			);
			return Promise.resolve(filtered);
		},
		sync: (options: SyncOptions) => {
			const {
				client,
				allTables,
				plugin,
				spec: { concurrency },
			} = pluginClient;
			if (client === null) {
				return Promise.reject(new Error('Client not initialized'));
			}

			const logger = plugin.getLogger();

			const {
				stream,
				tables,
				skipTables,
				skipDependentTables,
				deterministicCQId,
			} = options;

			const filtered = filterTables(
				allTables,
				tables,
				skipTables,
				skipDependentTables,
			);

			return sync({
				logger,
				client,
				stream,
				tables: filtered,
				deterministicCQId,
				concurrency,
			});
		},
	};

	const newClient: NewClientFunction = (
		logger,
		spec,
		{ noConnection },
	): Promise<Client> => {
		pluginClient.spec = parseSpec(spec);
		pluginClient.client = { id: () => 'ns1' };

		if (noConnection) {
			pluginClient.allTables = [];
			return Promise.resolve(pluginClient);
		}

		pluginClient.allTables = getTables(logger, pluginClient.spec);
		return Promise.resolve(pluginClient);
	};

	pluginClient.plugin = newPlugin('NS1', version, newClient);

	return pluginClient.plugin;
};
