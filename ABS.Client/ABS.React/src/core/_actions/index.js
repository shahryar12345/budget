import { ADD_SYSTEMSETTINGS, UPDATE_SYSTEMSETTINGS ,LOAD_SYSTEMSETTINGS } from "./action-types";

export function updateSystemSettings(payload) {
  return { type: UPDATE_SYSTEMSETTINGS, payload }
};

export function addSystemSettings(payload) {
  return { type: ADD_SYSTEMSETTINGS, payload }
};

export function loadSystemSettings(payload) {
  return { type: LOAD_SYSTEMSETTINGS, payload }
};
