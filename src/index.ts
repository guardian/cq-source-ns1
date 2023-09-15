import { createServeCommand } from '@cloudquery/plugin-sdk-javascript/plugin/serve';
import { plugin } from './plugin.js';

export function main() {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call ,@typescript-eslint/no-unsafe-member-access -- TODO
	createServeCommand(plugin()).parse();
}

main();
