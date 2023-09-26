import type { Writable } from 'stream';
import { Utf8 } from '@cloudquery/plugin-sdk-javascript/arrow';
import { createColumn } from '@cloudquery/plugin-sdk-javascript/schema/column';
import { pathResolver } from '@cloudquery/plugin-sdk-javascript/schema/resolvers';
import { createTable } from '@cloudquery/plugin-sdk-javascript/schema/table';
import type {
	Table,
	TableResolver,
} from '@cloudquery/plugin-sdk-javascript/schema/table';
import type { Logger } from 'winston';
import type { Spec } from './spec.js';

export const getTables = async (
	logger: Logger,
	spec: Spec,
): Promise<Table[]> => {
	const resolver: TableResolver = async (
		clientMeta: unknown,
		parent: unknown,
		stream: Writable,
	) => {
		await new Promise((_) => setTimeout(_, 500));

		const data = new Array(10).fill(undefined);
		data.forEach((_, index) => {
			stream.write({ id: [index], name: [`hello ${index}`] });
		});
		return;
	};

	const table = createTable({
		name: 'test',
		columns: [
			createColumn({
				name: 'id',
				type: new Utf8(),
				resolver: pathResolver('id'),
			}),
			createColumn({
				name: 'name',
				type: new Utf8(),
				resolver: pathResolver('name'),
			}),
		],
		description: 'testing',
		resolver,
	});

	return Promise.resolve([table]);
};
