import { apm } from "@elastic/apm-rum";

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const captureUserInteraction = async (name) => {
	// if there is a current txn we will not start a new one
	// the idea being we might as well finsih capturing the one that already started
	if(!apm.getCurrentTransaction()) {
		const txn = apm.startTransaction(name, "user-interaction", {
			managed: true,
			canReuse: true
		});
		txn.block(true);
		await sleep(2000);
		txn.block(false);
		if(txn.blocked || txn._activeTasks.size > 0) {
			for(let x = 0; x < 10; x++) {
				await sleep(200);
				if((!txn.blocked) && (txn._activeTasks.size === 0)) {
					txn.end();
					break;
				}
			}
		}
		if(!txn.ended) txn.end();
	}
};

export default captureUserInteraction;