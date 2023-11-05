import axios from "axios";

export function checkProxy(agent, timeout) {
	return new Promise((resolve) => {
		axios.get("https://api.ipify.org?format=json", {
			httpAgent: agent,
			httpsAgent: agent,
			signal: AbortSignal.timeout(timeout),
		})
			.then(() => resolve(true))
			.catch(() => resolve(false));
	});
}

export default async function checkProxies(agentList, timeout) {
	let checkWrapper = async (agent) => await checkProxy(agent, timeout) ? agent : null;
	let checkResults = await Promise.allSettled(agentList.map((agent) => checkWrapper(agent)));
	return checkResults
		.filter((result) => result.status === "fulfilled" && result.value)
		.map((result) => result.value);
}
