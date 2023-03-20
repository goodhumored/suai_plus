import { Component } from "react";
import { HiddenTasksRepository } from "./hiddenTasks.repository";
import React from "react";

type HideTaskCheckboxState = {
  isHidden: boolean;
};
type HideTaskCheckboxProps = {
  taskId: number;
  onchange: (taskId: number, isHidden: boolean) => unknown;
};

export default class HideTaskCheckbox extends Component<
  HideTaskCheckboxProps,
  HideTaskCheckboxState
> {
  private readonly hiddenTasksRepository: HiddenTasksRepository;

  constructor(props: HideTaskCheckbox["props"]) {
    super(props);
    this.hiddenTasksRepository = HiddenTasksRepository.getInstance();
    this.state = {
      isHidden: false
    };
  }

  async componentDidMount(): Promise<void> {
    const isHidden = await this.isHidden();
    this.setState({ isHidden });
  }

  render() {
    return (
      <input
        type="checkbox"
        onChange={(event) => {
          this.setIsHidden(!this.state.isHidden);
          this.props.onchange(this.props.taskId, event.target.checked);
        }}
        checked={this.state.isHidden}
      />
    );
  }

  private isHidden(): Promise<boolean> {
    return this.hiddenTasksRepository.isHiddenTask(this.props.taskId);
  }

  private setIsHidden(value: boolean) {
    this.setState({ isHidden: value });
    if (value) this.hiddenTasksRepository.addHiddenTask(this.props.taskId);
    else this.hiddenTasksRepository.removeHiddenTask(this.props.taskId);
  }
}
