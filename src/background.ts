import isGuapPage from "./utilities/isGuapPage";
import "./modules/background.bundle";

browser.webNavigation.onCompleted.addListener(injectContentOnComplete);
browser.tabs.onActivated.addListener(refreshOnActivate);

export function injectContentOnComplete(
  details: browser.webNavigation._OnCompletedDetails
) {
  injectContent(details.tabId);
}

export function refreshOnActivate(info: browser.tabs._OnActivatedActiveInfo) {
  refreshContent(info.tabId);
}

async function injectContent(tabId: number) {
  if (await isGuapPage(tabId)) {
    console.log(`Executing script content.js in tab ${tabId}`);
    await browser.scripting.executeScript({
      target: { tabId },
      files: ["content.js"]
    });
  }
}

async function refreshContent(tabId: number) {
  if (await isGuapPage(tabId)) {
    console.log(`sending refresh message to tab ${tabId}`);
    browser.tabs.sendMessage(tabId, "refresh");
  }
}
