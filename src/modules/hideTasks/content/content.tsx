import { createRoot } from "react-dom/client";
import getPageName from "../../../utilities/getPageName";
import HideTaskCheckbox from "./checkbox.component";
import { HiddenTasksRepository } from "./hiddenTasks.repository";
import { isHidingUpdatedMessage } from "../background/isHiding.repository";
import React from "react";

let hiddenTasks: number[];
let hidingTasks: boolean;

export function main() {
  HiddenTasksRepository.getInstance()
    .read()
    .then((tasks) => {
      hiddenTasks = tasks;
      hideHiddenTasks();
      removeHideButtons();
      addHideButtons();
    });
}

function hideHiddenTasks() {
  hiddenTasks.forEach(hideTask);
}

function showHiddenTasks() {
  hiddenTasks.forEach(showTask);
}

function hideTask(task_id: number) {
  const taskTR = getTaskTR(task_id);
  if (taskTR) {
    taskTR.hidden = true;
  } else {
    console.warn(`task ${task_id} was not found`);
  }
}

function showTask(task_id: number) {
  const tasTR = getTaskTR(task_id);
  if (tasTR) {
    tasTR.hidden = false;
  } else {
    console.warn(`task ${task_id} was not found`);
  }
}

function getTaskTR(id: number): HTMLTableRowElement | null | undefined {
  return document.querySelector(`a[href="/inside/student/tasks/${id}"]`)
    ?.parentElement?.parentElement as HTMLTableRowElement;
}

function handleCheckboxChange(taskId: number, isHidden: boolean): void {
  if (!hidingTasks) return;
  if (isHidden) hideTask(taskId);
  else showTask(taskId);
}

function addHideButtons() {
  document
    .querySelectorAll("#inside_student_tasks_index tbody tr")
    .forEach((tr: Element) => {
      try {
        const taskId = getTaskIdFromTR(tr as HTMLTableRowElement);
        const td = tr.appendChild(document.createElement("td"));
        td.id = `hideTask-${taskId}`;
        const root = createRoot(td!);
        const checkbox = (
          <HideTaskCheckbox taskId={taskId} onchange={handleCheckboxChange} />
        );
        root.render(checkbox);
      } catch (error) {
        console.error(`error ${error}`);
      }
    });
}
function removeHideButtons() {
  document.querySelectorAll("[id^='hideTask-']").forEach((td) => {
    td.remove();
  });
}

function getTaskIdFromTR(li: HTMLTableRowElement): number {
  const taskLink = (li.querySelector("a.btn") as HTMLLinkElement).href;
  const splittedLink = taskLink.split("/");
  return parseInt(splittedLink[splittedLink.length - 1]);
}

browser.runtime.onMessage.addListener((message) => {
  console.log(`message got: ${message}`);
  if (message == "refresh") {
    console.log("refreshing");
    if (getPageName() == "tasks") {
      main();
    }
  } else if (message.topic && message.topic == "is_hiding_updated") {
    hidingTasks = (message as isHidingUpdatedMessage).is_hiding;
    if (hidingTasks) hideHiddenTasks();
    else showHiddenTasks();
  }
});

main();
