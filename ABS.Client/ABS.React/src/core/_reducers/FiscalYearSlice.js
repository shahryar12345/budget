import { FETCH_FISCALYEAR } from "../_actions/action-types";

const initialState = {
  isloading: false,
  isLoaded: true,
  fiscalYear: ["2020", "2019", "2018", "2017", "2021", "2022"],
  count: 1,
};

const fetchFiscalYear = (objaction) => {};

const MD_FiscalYearReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FISCALYEAR:
      const res = fetchFiscalYear("FiscalYear");
      return res;

    default:
      return state;
  }
};

export default MD_FiscalYearReducer;
