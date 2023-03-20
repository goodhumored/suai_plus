import { cleanup, fireEvent, render } from "@testing-library/react";
import renderer from "react-test-renderer";
import React from "react";
import { faker } from "@faker-js/faker";
import { HiddenTasksRepositoryMock } from "../../../__test__/__mocks__/hiddenTasksRepository.mock";
jest.mock("./hiddenTasks.repository", () => ({
  HiddenTasksRepository: HiddenTasksRepositoryMock
}));

import HideTaskCheckbox from "./checkbox.component";

describe("HideTaskCheckbox test suit", () => {
  afterEach(cleanup);
  describe("Rendering", () => {
    describe("should be unchecked", () => {
      it("renders well", () => {
        jest
          .spyOn(HiddenTasksRepositoryMock, "isHiddenTask")
          .mockResolvedValue(false);
        const component = renderer.create(
          <HideTaskCheckbox
            onchange={jest.fn()}
            taskId={faker.datatype.number()}
          />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });
      it("componentDidMount should be called", () => {
        jest
          .spyOn(HiddenTasksRepositoryMock, "isHiddenTask")
          .mockResolvedValue(false);
        const component = renderer.create(
          <HideTaskCheckbox
            onchange={jest.fn()}
            taskId={faker.datatype.number()}
          />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        expect(HiddenTasksRepositoryMock.isHiddenTask).toHaveBeenCalled();
      });
    });
    it("should be checked", () => {
      jest
        .spyOn(HiddenTasksRepositoryMock, "isHiddenTask")
        .mockResolvedValue(true);
      const component = renderer.create(
        <HideTaskCheckbox
          onchange={jest.fn()}
          taskId={faker.datatype.number()}
        />
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
      expect(HiddenTasksRepositoryMock.isHiddenTask).toHaveBeenCalled();
    });
  });
  describe("click", () => {
    it("checkbox should work", () => {
      const { container } = render(
        <HideTaskCheckbox
          onchange={jest.fn()}
          taskId={faker.datatype.number()}
        />
      );
      const checkbox = container.querySelector("input") as HTMLInputElement;
      fireEvent.click(checkbox!);
      expect(checkbox?.checked).toBeTruthy();
    });
    it("should send new value to repository", () => {
      const taskId = faker.datatype.number();
      jest.spyOn(HiddenTasksRepositoryMock, "update");
      const { container } = render(
        <HideTaskCheckbox onchange={jest.fn()} taskId={taskId} />
      );
      const checkbox = container.querySelector("input") as HTMLInputElement;
      fireEvent.click(checkbox!);
      expect(checkbox?.checked).toBeTruthy();
      expect(HiddenTasksRepositoryMock.addHiddenTask).toHaveBeenLastCalledWith(
        taskId
      );
      fireEvent.click(checkbox!);
      expect(checkbox?.checked).toBeFalsy();
      expect(
        HiddenTasksRepositoryMock.removeHiddenTask
      ).toHaveBeenLastCalledWith(taskId);
    });
  });
});
