import checkProxies from "./proxies/checker.js";
import scrapeProxies from "./proxies/scraper.js"

let uncheckedProxyList = await scrapeProxies();
let checkedProxyList = await checkProxies(uncheckedProxyList, 5000);
checkedProxyList.forEach((agent) => console.log(agent.proxy));

