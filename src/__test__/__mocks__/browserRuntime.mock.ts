export const browserRuntimeMock: Partial<typeof browser.runtime> = {
  onMessage: {
    addListener: jest.fn()
  } as any,
  sendMessage: jest.fn()
};
