export async function main() {
	const msg = `Hello! The time is ${new Date().toString()}`;
	console.log(msg);
	return Promise.resolve(msg);
}

await main();
