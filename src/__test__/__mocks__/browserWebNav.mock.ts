export const browserWebNavMock: Partial<typeof browser.webNavigation> = {
  onCompleted: {
    addListener: jest.fn()
  } as any
};
