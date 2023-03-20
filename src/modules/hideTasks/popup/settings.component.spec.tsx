import { cleanup, fireEvent, render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { IsHidingRepositoryMock } from "../../../__test__/__mocks__/isHidingRepository.mock";
import HideTasksSetting from "./setting.component";
jest.mock("../background/isHiding.repository", () => ({
  IsHidingRepository: IsHidingRepositoryMock
}));

describe("HideTasksSetting test suit", () => {
  afterEach(cleanup);
  describe("Rendering", () => {
    describe("should be unchecked", () => {
      it("renders well", () => {
        jest.spyOn(IsHidingRepositoryMock, "read").mockResolvedValue(false);
        const component = renderer.create(<HideTasksSetting />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });
      it("componentDidMount should be called", () => {
        jest.spyOn(IsHidingRepositoryMock, "read").mockResolvedValue(false);
        const component = renderer.create(<HideTasksSetting />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        expect(IsHidingRepositoryMock.read).toHaveBeenCalled();
      });
    });
    it("should be checked", () => {
      jest.spyOn(IsHidingRepositoryMock, "read").mockResolvedValue(true);
      const component = renderer.create(<HideTasksSetting />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
      expect(IsHidingRepositoryMock.read).toHaveBeenCalled();
    });
  });
  describe("click", () => {
    it("checkbox should work", () => {
      const { container } = render(<HideTasksSetting />);
      const checkbox = container.querySelector(
        "input#hideTasks"
      ) as HTMLInputElement;
      fireEvent.click(checkbox!);
      expect(checkbox?.checked).toBeTruthy();
    });
    it("should send new value to repository", () => {
      jest.spyOn(IsHidingRepositoryMock, "update");
      const { container } = render(<HideTasksSetting />);
      const checkbox = container.querySelector(
        "input#hideTasks"
      ) as HTMLInputElement;
      fireEvent.click(checkbox!);
      expect(checkbox?.checked).toBeTruthy();
      expect(IsHidingRepositoryMock.update).toHaveBeenLastCalledWith(true);
      fireEvent.click(checkbox!);
      expect(checkbox?.checked).toBeFalsy();
      expect(IsHidingRepositoryMock.update).toHaveBeenLastCalledWith(false);
    });
  });
});
