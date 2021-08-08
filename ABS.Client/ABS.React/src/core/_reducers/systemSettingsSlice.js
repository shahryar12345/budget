import {
  FETCH_SYSTEMSETTINGS,
  UPDATE_SYSTEMSETTINGS,
  UPDATE_SYSTEMSETTINGSDB,
} from "../_actions/action-types";

import postApiResponse from "../../services/api/apiCallerPost";
import { updateObject } from "./helperFunctions";

const initialState = {
  fiscalStartMonth: "Jan",
  fiscalEndMonth: "Jun",
  fiscalStartMonthDateFormat: "itemsDateFormat-0",
  decimalPlaceStatistics: "itemDecimalPlaces-2",
  decimalPlacesFTE: "itemDecimalPlaces-2",
  decimalPlacesAmounts: "itemDecimalPlaces-2",
  decimalPlacesHours: "itemDecimalPlaces-2",
  decimalPlacesPercentValues: "itemDecimalPlaces-2",
  xc_Currency: "False",
  xc_Commas: "False",
  rd_negativeValues: "withBracket",
  list: [],
  UserID: 1,
};

function updateSettings(objState, objaction) {
  const newObj = updateObject(objState, objaction.payload);
  return newObj;
}
function updateDatabase(objState, objaction) {
  const newObj = updateObject(objState, objaction.payload);
  newObj.list = "";
  postApiResponse("SystemSettings", newObj);
  return newObj;
}

const systemSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SYSTEMSETTINGS:
      return { ...state, ...action.payload };
    case UPDATE_SYSTEMSETTINGSDB:
      return updateDatabase({ ...state }, action);
    case FETCH_SYSTEMSETTINGS:
      const updatedState = state;
      action.payload.map((item) => {
        updatedState[item.settingKey] = item.settingValue;
      });
      return {
        ...state,
        ...updatedState,
      };
    default:
      return state;
  }
};

export default systemSettingsReducer;
