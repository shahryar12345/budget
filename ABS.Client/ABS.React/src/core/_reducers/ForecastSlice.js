import { UPDATE_FORECAST , REFRESH_FORECAST} from "../_actions/action-types";
import { defaultforecastSection } from "../../components/content-pages/Forecast/Data/forecast-section-default-values";


const initialState = {
  forecast_budgetversion_code: "", 
  forecast_budgetversion_name: "",
  forecast_budgetversion_comment : "",
  forecast_budgetversion_scenario_type_Code: "ST",
  forecast_budgetversion_scenario_type: "Statistics", // Set as Default Values, But will overrite according to the budget version , which is selected for the forcasting.
  forecast_budgetversion_scenario_type_ID: 28, // Set as Default Values, But will overrite according to the budget version , which is selected for the forcasting.
  forecast_budgetversion_timePeriod_ID: 1, // Set as Default Values, But will overrite according to the budget version , which is selected for the forcasting.
  collapseAll: false,
  forecast_model_Id : "",
  forecast_model_code: "",
  forecast_model_name: "",
  forecast_model_description: "",
  forecast_model_selected: false,
  forecastSections: [JSON.parse(JSON.stringify(defaultforecastSection))], // Deep Copy , otherwise chnage will applied to orignal file object
  forecastModelData: [], // Will populate from DB using API. Currenlty Load in forecast.js with temp data.
  validateButton: { disabled: true },
  saveForecastButton: { disabled: true },
  saveAsForecastButton: { disabled: true },
  runForecastButton: { disabled: true },
};

const forecastReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FORECAST:
      console.log(action);
      return { ...state, ...action.payload };
    case REFRESH_FORECAST:
      return { ...initialState , forecastSections: [JSON.parse(JSON.stringify(defaultforecastSection))] };
    default:
      return state;
  }
};

export default forecastReducer;
