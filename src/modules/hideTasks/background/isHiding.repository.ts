import getGuapTabs from "../../../utilities/getGuapTabs";

const HIDE_TASKS_STORAGE_KEY = "isHidden";
export type isHidingUpdatedMessage = {
  topic: "is_hiding_updated";
  is_hiding: boolean;
};

export class IsHidingRepository {
  private _isHiding?: boolean;
  private static _instance?: IsHidingRepository;

  private constructor() {
    return;
  }

  static getInstance(): IsHidingRepository {
    if (!this._instance) this._instance = new IsHidingRepository();
    return this._instance;
  }

  async read(): Promise<boolean> {
    return (
      this._isHiding ??
      (this._isHiding = localStorage.getItem(HIDE_TASKS_STORAGE_KEY) == "true")
    );
  }
  async update(isHiding: boolean) {
    this._isHiding = isHiding;
    localStorage.setItem(HIDE_TASKS_STORAGE_KEY, JSON.stringify(isHiding));
    getGuapTabs().then((tabs) => {
      tabs.forEach((tab) => {
        if (tab.id)
          browser.tabs.sendMessage(tab.id, {
            topic: "is_hiding_updated",
            is_hiding: isHiding
          });
      });
    });
  }
}
