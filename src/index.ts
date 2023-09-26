import { createServeCommand } from '@cloudquery/plugin-sdk-javascript/plugin/serve';
import { plugin } from './plugin.js';

export function main() {
	void createServeCommand(plugin()).parse();
}

main();
