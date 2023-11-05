import axios from "axios";

function parseResponseData(data) {
	let proxyList = [];
	for (let proxyData of data.LISTA)
		proxyList.push(`${proxyData.IP}:${proxyData.PORT}`);
	return proxyList;
}

export default async function scrapeProxies() {
	let [socks4ListResponse, socks5ListResponse] = await Promise.allSettled([
		axios.get("https://www.proxy-list.download/api/v2/get?l=en&t=socks4"),
		axios.get("https://www.proxy-list.download/api/v2/get?l=en&t=socks5"),
	]);

	let proxyList = [];
	if (socks4ListResponse.status === "fulfilled")
		proxyList.push(...parseResponseData(socks4ListResponse.value.data).map((addr) => `socks4://${addr}`));
	if (socks5ListResponse.status === "fulfilled")
		proxyList.push(...parseResponseData(socks5ListResponse.value.data).map((addr) => `socks5://${addr}`));
	return proxyList;
}
