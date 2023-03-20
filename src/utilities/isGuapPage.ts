export default async function isGuapPage(tabId: number): Promise<boolean> {
  const tab = await browser.tabs.get(tabId);
  const isGuapPage =
    /^https?:\/\/pro.guap.ru\/inside\/([a-z]+)(\/(:?[a-z]+)\/.*?)?$/.test(
      tab.url ?? ""
    );
  console.log(
    `tab ${tabId} with url ${tab.url} is ${isGuapPage ? "" : "not "}guap page`
  );
  return isGuapPage;
}
