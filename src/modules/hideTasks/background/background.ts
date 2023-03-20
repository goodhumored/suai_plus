import { getIsHidingMessage } from "../content/isHiding.repository";
import { IsHidingRepository } from "./isHiding.repository";

browser.runtime.onMessage.addListener(getIsHiding);

export async function getIsHiding(
  msg: unknown,
  _: unknown,
  sendResponse: (respone: unknown) => unknown
) {
  if (msg == getIsHidingMessage) {
    sendResponse(await IsHidingRepository.getInstance().read());
  }
}
