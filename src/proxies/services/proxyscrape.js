import axios from "axios";

function parseResponseData(data) {
	return data.split(/\r?\n/);
}

export default async function scrapeProxies() {
	let [socks4ListResponse, socks5ListResponse] = await Promise.allSettled([
		axios.get("https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks4&timeout=10000&country=all"),
		axios.get("https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks5&timeout=10000&country=all"),
	]);

	let proxyList = [];
	if (socks4ListResponse.status === "fulfilled")
		proxyList.push(...parseResponseData(socks4ListResponse.value.data).map((addr) => `socks4://${addr}`));
	if (socks5ListResponse.status === "fulfilled")
		proxyList.push(...parseResponseData(socks5ListResponse.value.data).map((addr) => `socks5://${addr}`));
	return proxyList;
}
