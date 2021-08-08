import { UPDATE_FORECAST , REFRESH_FORECAST } from "./action-types";

export function updateForecast(payload) {
  return { type: UPDATE_FORECAST, payload };
}


export function refreshForecast(payload) {
  return { type: REFRESH_FORECAST, payload };
}
