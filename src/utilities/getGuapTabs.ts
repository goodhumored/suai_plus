export default function getGuapTabs() {
  return browser.tabs.query({
    active: true,
    url: "*://pro.guap.ru/*"
  });
}
