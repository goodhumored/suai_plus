import { Component } from "react";
import { IsHidingRepository } from "../background/isHiding.repository";

export default class HideTasksSetting extends Component {
  state = {
    isHiding: false
  };
  private readonly isHidingRepository = IsHidingRepository.getInstance();

  componentDidMount() {
    console.log("componentDidMount");
    this.isHidingRepository.read().then((v) => this.setIsHiding(v));
  }

  render() {
    return (
      <div>
        <input
          type="checkbox"
          id="hideTasks"
          onChange={() => {
            this.setIsHiding(!this.state.isHiding);
          }}
          checked={this.state.isHiding}
        />
        <label htmlFor="hideTasks">Скрывать отмеченные задачи</label>
      </div>
    );
  }

  private setIsHiding(value: boolean) {
    console.log(`Setting isHiding to ${JSON.stringify(value)}`);
    this.setState({ isHiding: value });
    this.isHidingRepository.update(value);
  }
}
