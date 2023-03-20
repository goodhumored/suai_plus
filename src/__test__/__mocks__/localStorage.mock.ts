export const localStorageMock: Partial<Storage> = {
  getItem: jest.fn(),
  setItem: jest.fn()
};
