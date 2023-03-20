import { faker } from "@faker-js/faker";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { browserRuntimeMock } from "../../../__test__/__mocks__/browserRuntime.mock";
import { IsHidingRepositoryMock } from "../../../__test__/__mocks__/isHidingRepository.mock";
jest.mock("./isHiding.repository", () => ({
  IsHidingRepository: IsHidingRepositoryMock
}));

describe("hideTasks background script test suit", () => {
  let background: any;
  beforeAll(() => {
    global.browser = {
      runtime: browserRuntimeMock
    } as any;
    background = require("./background");
  });
  it("should send response on 'is_hiding' message", async () => {
    const result = faker.datatype.boolean();
    const sendResponse = jest.fn();
    jest.spyOn(IsHidingRepositoryMock, "read").mockResolvedValue(result);
    await background.getIsHiding("is_hiding", null, sendResponse);
    expect(sendResponse).toHaveBeenLastCalledWith(result);
    expect(IsHidingRepositoryMock.read).toHaveBeenCalled();
  });
  it("shouldn't answer on message", async () => {
    const result = faker.datatype.boolean();
    const sendResponse = jest.fn();
    jest.spyOn(IsHidingRepositoryMock, "read").mockResolvedValue(result);
    await background.getIsHiding(faker.datatype.string(), null, sendResponse);
    expect(sendResponse).not.toHaveBeenCalled();
    expect(IsHidingRepositoryMock.read).not.toHaveBeenCalled();
  });
});
