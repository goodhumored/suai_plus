/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { browserRuntimeMock } from "../../../__test__/__mocks__/browserRuntime.mock";
import { IsHidingRepository } from "./isHiding.repository";
jest.mock("../../../utilities/getGuapTabs", () => jest.fn());

const message = "is_hiding";

describe("isHiding repository test suit", () => {
  it("isHidingRepository should be singleton", () => {
    const inst1 = IsHidingRepository.getInstance();
    const inst2 = IsHidingRepository.getInstance();
    expect(inst1).toBe(inst2);
  });
  describe("operations test suit", () => {
    beforeAll(() => {
      global.browser = {
        runtime: browserRuntimeMock
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
          .spyOn(global.browser.runtime, "sendMessage")
          .mockResolvedValue(isHiding);
        expect(await repo.read()).toBe(isHiding);
        expect(global.browser.runtime.sendMessage).toHaveBeenLastCalledWith(
          message
        );
      });
      it("shouldn't read data from localStorage on second call", async () => {
        const repo = IsHidingRepository.getInstance();
        const isHiding = faker.datatype.boolean();
        jest
          .spyOn(global.browser.runtime, "sendMessage")
          .mockResolvedValue(isHiding);
        expect(global.browser.runtime.sendMessage).toHaveBeenCalledTimes(0);
        expect(await repo.read()).toBe(isHiding);
        expect(global.browser.runtime.sendMessage).toHaveBeenCalledTimes(1);
        expect(await repo.read()).toBe(isHiding);
        expect(global.browser.runtime.sendMessage).toHaveBeenCalledTimes(1);
      });
    });
  });
});
