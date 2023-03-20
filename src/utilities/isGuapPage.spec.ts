import { browserTabsMock } from "../__test__/__mocks__/browserTabs.mock";
import isGuapPage from "./isGuapPage";
import { faker } from "@faker-js/faker";

describe("isGuapPage utility test", () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.browser = { tabs: browserTabsMock as any } as any;
  });
  it("should return true", async () => {
    const tabId = faker.datatype.number();
    jest
      .spyOn(global.browser.tabs, "get")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValue({ url: "https://pro.guap.ru/inside/profile" } as any);
    expect(await isGuapPage(tabId)).toBeTruthy();
    expect(global.browser.tabs.get).toHaveBeenLastCalledWith(tabId);
  });
  it("should return false", async () => {
    const tabId = faker.datatype.number();
    jest
      .spyOn(global.browser.tabs, "get")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValue({ url: "https://google.com" } as any);
    expect(await isGuapPage(tabId)).toBeFalsy();
    expect(global.browser.tabs.get).toHaveBeenLastCalledWith(tabId);
  });
  it("should return false if url is empty", async () => {
    const tabId = faker.datatype.number();
    jest
      .spyOn(global.browser.tabs, "get")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValue({ url: null } as any);
    expect(await isGuapPage(tabId)).toBeFalsy();
    expect(global.browser.tabs.get).toHaveBeenLastCalledWith(tabId);
  });
});
