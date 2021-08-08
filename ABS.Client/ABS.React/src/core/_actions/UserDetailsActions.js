import { SAVE_USER_DETAILS } from "./action-types"


export function saveUserDetails(payload) {
    return { type: SAVE_USER_DETAILS, payload };
  }