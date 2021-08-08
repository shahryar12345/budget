import { UPDATE_MAPPING, REFRESH_MAPPING } from "../_actions/action-types";

const initialState = {
    mappingType : "notSelected",
    entity : "",
    changedData : [],
};

const mappingReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MAPPING:
      console.log(action);
      return { ...state, ...action.payload };
    case REFRESH_MAPPING:
      return { ...initialState };
    default:
      return state;
  }
};

export default mappingReducer;
