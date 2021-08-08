import {
  FETCH_BUDGETTYPE,
  FETCH_BUDGETVERSIONTYPE,
  FETCH_FORECASTMETHODTYPE,
  FETCH_SCENARIOTYPE,
  FETCH_ITEMDATEFORMAT,
  FETCH_ITEMDECIMALPLACES,
  FETCH_ITEMMONTHS,
} from "./action-types";

const initialState = {
  fiscalStartMonth: "Jan",
  fiscalEndMonth: "Jun",
  fiscalStartMonthDateFormat: "itemsDateFormat-0",
  decimalPlaceStatistics: "itemDecimalPlaces-2",
  decimalPlacesFTE: "itemDecimalPlaces-2",
  decimalPlacesAmounts: "itemDecimalPlaces-2",
  decimalPlacesHours: "itemDecimalPlaces-2",
  decimalPlacesPercentValues: "itemDecimalPlaces-2",
  xc_Currency: false,
  xc_Commas: false,
  rd_negativeValues: "withBracket",
  count: 1,
};

const MasterDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BUDGETTYPE:
      return { ...state, count: state.count + 1 };
    case FETCH_BUDGETVERSIONTYPE:
      return { ...state, count: state.count + 1 };
    case FETCH_FORECASTMETHODTYPE:
      return { ...state, count: state.count + 1 };
    case FETCH_SCENARIOTYPE:
      return { ...state, count: state.count + 1 };
    case FETCH_ITEMDATEFORMAT:
      return { ...state, count: state.count + 1 };
    case FETCH_ITEMDECIMALPLACES:
      return { ...state, count: state.count + 1 };
    case FETCH_ITEMMONTHS:
      return { ...state, count: state.count + 1 };

    default:
      return state;
  }
};

export default MasterDataReducer;
