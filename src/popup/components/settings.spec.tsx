import renderer from "react-test-renderer";
import Settings from "./settings";
import React from "react";

it("renders well", () => {
  const component = renderer.create(<Settings />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot("settings");
});
