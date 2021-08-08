import { 
  ADD_STRUCTURETABLES, 
  UPDATE_STRUCTURETABLES,
  FETCH_STRUCTURETABLES,
  FETCH_FTE_DIVISORS
} from "./action-types";
import { getApiResponseParams } from "../../services/api/apiCallerGet";

export function updateStructureTable(payload) {
  console.log('inside action - updateStructureTable')
  console.log(payload)
  
  return { type: UPDATE_STRUCTURETABLES, payload }
};

export function addStructureTable(payload) {
  console.log('inside action - addStructureTable')
  console.log(payload)
  
  return { type: ADD_STRUCTURETABLES, payload }
};

export function fetchStructureTable(payload) {
  console.log('inside action - fetchStructureTable')
  console.log(payload)
  
  return { type: FETCH_STRUCTURETABLES, payload }
};

export function fetchFteDivisors() {
  return async (dispatch) => {
    const apireq = await getApiResponseParams("FTEDATA");
    dispatch({ type: FETCH_FTE_DIVISORS, payload: apireq });
  };
}
