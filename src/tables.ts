import type { Table } from '@cloudquery/plugin-sdk-javascript/schema/table';
import type { Logger } from 'winston';
import type { Spec } from './spec.js';

export const getTables = async (
	logger: Logger,
	spec: Spec,
): Promise<Table[]> => {
	// TOD add tables
	return Promise.resolve([]);
};
