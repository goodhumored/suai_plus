/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { browserTabsMock } from "../../../__test__/__mocks__/browserTabs.mock";
import { localStorageMock } from "../../../__test__/__mocks__/localStorage.mock";
import * as getGuapTabs from "../../../utilities/getGuapTabs";
import { IsHidingRepository } from "./isHiding.repository";
jest.mock("../../../utilities/getGuapTabs", () => jest.fn());

const HIDE_TASKS_STORAGE_KEY = "isHidden";

describe("isHiding repository test suit", () => {
  it("isHidingRepository should be singleton", () => {
    const inst1 = IsHidingRepository.getInstance();
    const inst2 = IsHidingRepository.getInstance();
    expect(inst1).toBe(inst2);
  });
  describe("operations test suit", () => {
    beforeAll(() => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock
      });
      global.browser = {
        tabs: browserTabsMock
      } as any;
    });
    beforeEach(() => {
      IsHidingRepository["_instance"] = undefined;
    });
    describe("read", () => {
      it("should read data from localStorage", async () => {
        const repo = IsHidingRepository.getInstance();
        const isHiding = faker.datatype.boolean();
        jest
          .spyOn(global.localStorage, "getItem")
          .mockReturnValue(isHiding.toString());
        expect(await repo.read()).toBe(isHiding);
        expect(global.localStorage.getItem).toHaveBeenLastCalledWith(
          HIDE_TASKS_STORAGE_KEY
        );
      });
      it("shouldn't read data from localStorage on second call", async () => {
        const repo = IsHidingRepository.getInstance();
        const isHiding = faker.datatype.boolean();
        jest
          .spyOn(global.localStorage, "getItem")
          .mockReturnValue(isHiding.toString());
        expect(global.localStorage.getItem).toHaveBeenCalledTimes(0);
        expect(await repo.read()).toBe(isHiding);
        expect(global.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(await repo.read()).toBe(isHiding);
        expect(global.localStorage.getItem).toHaveBeenCalledTimes(1);
      });
    });
    describe("update", () => {
      it("should update data in localStorage", async () => {
        const repo = IsHidingRepository.getInstance();
        const isHiding = faker.datatype.boolean();
        jest.spyOn(global.localStorage, "setItem");
        jest.spyOn(getGuapTabs, "default").mockResolvedValue([]);

        await repo.update(isHiding);

        expect(global.localStorage.setItem).toHaveBeenLastCalledWith(
          HIDE_TASKS_STORAGE_KEY,
          isHiding.toString()
        );
        expect(await repo.read()).toBe(isHiding);
      });
      it("should send updated data to tabs", async () => {
        const repo = IsHidingRepository.getInstance();
        const isHiding = faker.datatype.boolean();
        const tabs = faker.helpers.uniqueArray(
          () => ({ id: faker.datatype.number() }),
          5
        );
        jest.spyOn(getGuapTabs, "default").mockResolvedValue(tabs as any);

        await repo.update(isHiding);
        expect(global.browser.tabs.sendMessage).toHaveBeenCalledTimes(
          tabs.length
        );
        tabs.forEach((tab, i) => {
          expect(global.browser.tabs.sendMessage).toHaveBeenNthCalledWith(
            i + 1,
            tab.id,
            {
              topic: "is_hiding_updated",
              is_hiding: isHiding
            }
          );
        });
      });
    });
  });
});
