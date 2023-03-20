/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { browserTabsMock } from "../../../__test__/__mocks__/browserTabs.mock";
import { localStorageMock } from "../../../__test__/__mocks__/localStorage.mock";
import * as getGuapTabs from "../../../utilities/getGuapTabs";
import { HiddenTasksRepository } from "./hiddenTasks.repository";
jest.mock("../../../utilities/getGuapTabs", () => jest.fn());

const HIDDEN_TASKS_STORAGE_KEY = "hiddenTasks";

describe("hiddenTasks repository test suit", () => {
  it("hiddenTasksRepository should be singleton", () => {
    const inst1 = HiddenTasksRepository.getInstance();
    const inst2 = HiddenTasksRepository.getInstance();
    expect(inst1).toEqual(inst2);
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
      HiddenTasksRepository["_instance"] = undefined;
    });
    describe("read", () => {
      it("should read data from localStorage", async () => {
        const repo = HiddenTasksRepository.getInstance();
        const hiddenTasks = faker.helpers.uniqueArray(faker.datatype.number, 5);
        jest
          .spyOn(global.localStorage, "getItem")
          .mockReturnValue(JSON.stringify(hiddenTasks));
        expect(await repo.read()).toEqual(hiddenTasks);
        expect(global.localStorage.getItem).toHaveBeenLastCalledWith(
          HIDDEN_TASKS_STORAGE_KEY
        );
      });
      it("should read empty array if storage variable is empty", async () => {
        const repo = HiddenTasksRepository.getInstance();
        jest.spyOn(global.localStorage, "getItem").mockReturnValue(null);
        expect(await repo.read()).toStrictEqual([]);
        expect(global.localStorage.getItem).toHaveBeenLastCalledWith(
          HIDDEN_TASKS_STORAGE_KEY
        );
      });
      it("shouldn't read data from localStorage on second call", async () => {
        const repo = HiddenTasksRepository.getInstance();
        const hiddenTasks = faker.helpers.uniqueArray(faker.datatype.number, 5);
        jest
          .spyOn(global.localStorage, "getItem")
          .mockReturnValue(JSON.stringify(hiddenTasks));
        expect(global.localStorage.getItem).toHaveBeenCalledTimes(0);
        expect(await repo.read()).toEqual(hiddenTasks);
        expect(global.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(await repo.read()).toEqual(hiddenTasks);
        expect(global.localStorage.getItem).toHaveBeenCalledTimes(1);
      });
    });
    describe("update", () => {
      it("should update data in localStorage", async () => {
        const repo = HiddenTasksRepository.getInstance();
        const hiddenTasks = faker.helpers.uniqueArray(faker.datatype.number, 5);
        jest.spyOn(global.localStorage, "setItem");
        jest.spyOn(getGuapTabs, "default").mockResolvedValue([]);

        await repo.update(hiddenTasks);

        expect(global.localStorage.setItem).toHaveBeenLastCalledWith(
          HIDDEN_TASKS_STORAGE_KEY,
          JSON.stringify(hiddenTasks)
        );
        expect(await repo.read()).toEqual(hiddenTasks);
      });
    });
    describe("operations", () => {
      let hiddenTasks: number[] = [];
      const repo = HiddenTasksRepository.getInstance();
      beforeAll(() => {
        jest
          .spyOn(global.localStorage, "getItem")
          .mockImplementation(() => JSON.stringify(hiddenTasks));
        jest
          .spyOn(global.localStorage, "setItem")
          .mockImplementation((_, value: string) => {
            hiddenTasks = JSON.parse(value);
          });
      });
      describe("Add task", () => {
        it("should add hidden task", async () => {
          const taskId = faker.datatype.number();
          repo.update([]);
          await repo.addHiddenTask(taskId);
          await new Promise(process.nextTick);
          expect(await repo.read()).toEqual([taskId]);
        });
        it("should be able to add multiple hidden tasks", async () => {
          const taskIds = faker.helpers.uniqueArray(faker.datatype.number, 5);
          repo.update([]);
          taskIds.forEach((ti) => repo.addHiddenTask(ti));
          await new Promise(process.nextTick);
          expect(await repo.read()).toEqual(taskIds);
        });
        it("should return if task is already hidden", async () => {
          jest.spyOn(repo, "update");
          const taskIds = faker.helpers.uniqueArray(faker.datatype.number, 5);
          repo.update(taskIds);
          jest.spyOn(repo, "isHiddenTask").mockResolvedValueOnce(true);
          repo.addHiddenTask(taskIds[2]);
          expect(await repo.read()).toEqual(taskIds);
          expect(repo.update).toHaveBeenCalledTimes(1);
        });
      });
      describe("Remove task", () => {
        it("should remove hidden task", async () => {
          const taskIds = faker.helpers.uniqueArray(faker.datatype.number, 5);
          repo.update(taskIds);
          const taskIdToRemove = taskIds[2];
          taskIds.splice(2, 1);
          repo.removeHiddenTask(taskIdToRemove);
          expect(await repo.read()).toEqual(taskIds);
        });
        it("should return if task is not hidden", async () => {
          const taskIds = faker.helpers.uniqueArray(faker.datatype.number, 5);
          repo.update(taskIds);
          const taskIdToRemove = taskIds[2];
          jest.spyOn(repo, "isHiddenTask").mockResolvedValueOnce(false);
          repo.removeHiddenTask(taskIdToRemove);
          expect(await repo.read()).toEqual(taskIds);
        });
      });
      describe("is hidden", () => {
        it("should return true", async () => {
          const taskIds = faker.helpers.uniqueArray(faker.datatype.number, 5);
          repo.update(taskIds);
          const taskIdToRemove = taskIds[2];
          const isHidden = await repo.isHiddenTask(taskIdToRemove);
          expect(isHidden).toBeTruthy();
          await repo.removeHiddenTask(taskIdToRemove);
          expect(await repo.isHiddenTask(taskIdToRemove)).toBeFalsy();
        });
      });
    });
  });
});
