const HIDDEN_TASKS_STORAGE_KEY = "hiddenTasks";

export class HiddenTasksRepository {
  private _hiddenTasks?: number[];
  private static _instance?: HiddenTasksRepository;

  private constructor() {
    return;
  }

  static getInstance(): HiddenTasksRepository {
    if (!this._instance) this._instance = new HiddenTasksRepository();
    return this._instance;
  }

  async read(): Promise<number[]> {
    return (
      this._hiddenTasks ??
      (this._hiddenTasks = JSON.parse(
        localStorage.getItem(HIDDEN_TASKS_STORAGE_KEY) ?? "[]"
      ) as number[])
    );
  }
  update(hiddenTasks: number[]) {
    this._hiddenTasks = hiddenTasks;
    localStorage.setItem(HIDDEN_TASKS_STORAGE_KEY, JSON.stringify(hiddenTasks));
  }
  async addHiddenTask(taskId: number) {
    const tasks = await this.read();
    if (await this.isHiddenTask(taskId)) return;
    tasks.push(taskId);
    this.update(tasks);
  }
  async removeHiddenTask(taskId: number) {
    const tasks = await this.read();
    if (!(await this.isHiddenTask(taskId))) return;
    const index = tasks.indexOf(taskId);
    tasks.splice(index);
    this.update(tasks);
  }
  async isHiddenTask(taskId: number): Promise<boolean> {
    const tasks = await this.read();
    return tasks.includes(taskId);
  }
}
