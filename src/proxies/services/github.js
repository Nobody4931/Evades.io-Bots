import axios from "axios";

function parseResponseData(data) {
	return data.split(/\r?\n/);
}

// TODO: This could probably be refactored, since each service uses the *exact* same scrapeProxies function
export default async function scrapeProxies() {
	let [socks4ListResponse, socks5ListResponse] = await Promise.allSettled([
		axios.get("https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks4.txt"),
		axios.get("https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt"),
	]);

	let proxyList = [];
	if (socks4ListResponse.status === "fulfilled")
		proxyList.push(...parseResponseData(socks4ListResponse.value.data).map((addr) => `socks4://${addr}`));
	if (socks5ListResponse.status === "fulfilled")
		proxyList.push(...parseResponseData(socks5ListResponse.value.data).map((addr) => `socks5://${addr}`));
	return proxyList;
}
