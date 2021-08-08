import {
  ADD_SYSTEMSETTINGS,
  FETCH_SYSTEMSETTINGS,
  UPDATE_SYSTEMSETTINGS,
  UPDATE_SYSTEMSETTINGSDB,
} from "./action-types";

import { getApiResponseParams } from "../../services/api/apiCallerGet";

export function updateSystemSettings(payload) {
  return { type: UPDATE_SYSTEMSETTINGS, payload };
}
export function updateSystemSettingsDB(payload) {
  return { type: UPDATE_SYSTEMSETTINGSDB, payload };
}

export function addSystemSettings(payload) {
  return { type: ADD_SYSTEMSETTINGS, payload };
}

export function fetchSystemSettings(payload) {
  return async (dispatch) => {
    const apireq = await getApiResponseParams(payload);
    dispatch({ type: FETCH_SYSTEMSETTINGS, payload: apireq });
  };
}
