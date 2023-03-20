export const HiddenTasksRepositoryMock = {
  read: jest.fn(),
  update: jest.fn(),
  addHiddenTask: jest.fn(),
  removeHiddenTask: jest.fn(),
  isHiddenTask: jest.fn(),
  getInstance: () => HiddenTasksRepositoryMock
};
