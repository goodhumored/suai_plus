export const browserScriptingMock: Partial<typeof browser.scripting> = {
  executeScript: jest.fn()
};
