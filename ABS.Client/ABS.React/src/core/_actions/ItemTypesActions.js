import { ADD_ITEMTYPES, UPDATE_ITEMTYPES ,FETCH_ITEMTYPES ,UPDATE_ITEMTYPESDB} from "./action-types";

export function updateItemTypes(payload) {
  
  return { type: UPDATE_ITEMTYPES, payload }
};
export function updateItemTypesDB(payload) {
 
  
  return { type: UPDATE_ITEMTYPESDB, payload }
};
export function addItemTypes(payload) {
  
  return { type: ADD_ITEMTYPES, payload }
};

export function fetchItemTypes(payload) {
  
  return { type: FETCH_ITEMTYPES, payload }
};
