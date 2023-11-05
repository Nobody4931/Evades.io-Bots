import { SocksProxyAgent } from "socks-proxy-agent";
import scrapeGithub from "./services/github.js";
import scrapeProxyscrape from "./services/proxyscrape.js";
import scrapeProxylist from "./services/proxylist.js";
import scrapeOpenproxy from "./services/openproxy.js";

export default async function scrapeProxies() {
	let serviceLists = await Promise.allSettled([
		scrapeGithub(),
		scrapeProxyscrape(),
		scrapeProxylist(),
		scrapeOpenproxy(),
	]);

	let proxyList = new Set();
	for (let serviceResult of serviceLists) {
		if (serviceResult.status === "fulfilled") {
			for (let proxyAddr of serviceResult.value) {
				proxyList.add(proxyAddr);
			}
		}
	}

	let agentList = [];
	for (let proxyAddr of proxyList)
		agentList.push(new SocksProxyAgent(proxyAddr));
	return agentList;
}
