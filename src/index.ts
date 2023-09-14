export async function main() {
	const msg = `Hello! The time is ${new Date().toString()}`;
	console.log(msg);
	return Promise.resolve(msg);
}

if (require.main === module) {
	void (async () => await main())();
}
