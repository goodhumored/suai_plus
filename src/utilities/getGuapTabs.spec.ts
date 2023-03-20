import { browserTabsMock } from "../__test__/__mocks__/browserTabs.mock";
import getGuapTabs from "./getGuapTabs";

describe("getGuapTabs test suit", () => {
  beforeAll(() => {
    global.browser = { tabs: browserTabsMock } as any;
  });
  it("should run correct", async () => {
    jest.spyOn(browser.tabs, "query");
    await getGuapTabs();
    expect(browser.tabs.query).toHaveBeenLastCalledWith({
      active: true,
      url: "*://pro.guap.ru/*"
    });
  });
});
