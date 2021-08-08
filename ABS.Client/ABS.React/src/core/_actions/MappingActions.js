import { UPDATE_MAPPING , REFRESH_MAPPING } from "./action-types";

export function updateMapping(payload) {
  return { type: UPDATE_MAPPING, payload };
}


export function refreshMapping(payload) {
  return { type: REFRESH_MAPPING, payload };
}
