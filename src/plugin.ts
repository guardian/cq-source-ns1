import { newPlugin } from '@cloudquery/plugin-sdk-javascript/plugin/plugin';
import type { NewClientFunction } from '@cloudquery/plugin-sdk-javascript/plugin/plugin';

// TODO read from package.json
const version = '0.0.0';
export const plugin = () => {
	const client: NewClientFunction = undefined as unknown as NewClientFunction;

	return newPlugin('NS1', version, client);
};
