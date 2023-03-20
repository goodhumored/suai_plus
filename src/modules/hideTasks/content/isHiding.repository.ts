export const getIsHidingMessage = "is_hiding";

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
      (this._isHiding = await browser.runtime.sendMessage(getIsHidingMessage))
    );
  }
}
