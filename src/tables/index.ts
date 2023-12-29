import type { Table } from '@cloudquery/plugin-sdk-javascript/schema/table';
import type { Logger } from 'winston';
import type { Spec } from '../spec.js';
import { zonesTable } from './zones.js';

export const getTables = (logger: Logger, spec: Spec): Table[] => {
	return [zonesTable(logger, spec)];
};
