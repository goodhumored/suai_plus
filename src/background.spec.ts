import { faker } from "@faker-js/faker";
import { browserScriptingMock } from "./__test__/__mocks__/browserScripting.mock";
import { browserTabsMock } from "./__test__/__mocks__/browserTabs.mock";
import { browserWebNavMock } from "./__test__/__mocks__/browserWebNav.mock";
import * as isGuapPage from "./utilities/isGuapPage";
jest.mock("./utilities/isGuapPage");
jest.mock("./modules/background.bundle", () => undefined);

describe("background script test suit", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let background: any;
  beforeAll(() => {
    global.browser = {
      scripting: browserScriptingMock,
      tabs: browserTabsMock,
      webNavigation: browserWebNavMock
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    background = require("./background");
    jest.spyOn(isGuapPage, "default").mockResolvedValue(true);
  });
  describe("injectContent test suit", () => {
    it("should inject content on web navigation complete", async () => {
      const tabId = faker.datatype.number();
      jest.spyOn(global.browser.scripting, "executeScript");
      const injectContentOnComplete = background.injectContentOnComplete;
      injectContentOnComplete({ tabId });
      await new Promise(process.nextTick);
      expect(browser.scripting.executeScript).toHaveBeenLastCalledWith({
        target: { tabId },
        files: ["content.js"]
      });
    });
  });
  describe("refreshOnActivate test suit", () => {
    it("should send refresh message to contentjs when page is refreshed", async () => {
      const tabId = faker.datatype.number();
      jest.spyOn(browser.tabs, "sendMessage");
      const refreshOnActivate = background.refreshOnActivate;
      refreshOnActivate({ tabId });
      await new Promise(process.nextTick);
      expect(browser.tabs.sendMessage).toHaveBeenLastCalledWith(
        tabId,
        "refresh"
      );
    });
  });
});
