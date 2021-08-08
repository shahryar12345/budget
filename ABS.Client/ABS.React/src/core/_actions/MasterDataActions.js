import {
  FETCH_BUDGETTYPE,
  FETCH_BUDGETVERSIONTYPE,
  FETCH_FISCALYEAR,
  FETCH_FORECASTMETHODTYPE,
  FETCH_ITEMDATEFORMAT,
  FETCH_ITEMDECIMALPLACES,
  FETCH_ITEMMONTHS,
  FETCH_SCENARIOTYPE,
  FETCH_ENTITIES,
  FETCH_DEPARTMENTS,
  FETCH_STATISTICS,
  FETCH_TIMEPERIODS,
  FETCH_DIMENSION_RELATIONSHIPS,
  FETCH_GLACCOUNTS,
  FETCH_PAYTYPES,
  FETCH_JOBCODES,
  FETCH_PAYTYPEDISTRIBUTIONS,
  FETCH_STAFFINGDATATYPE,
  FETCH_DEPARTMENT_RELATIONSHIPS,
  FETCH_GLACCOUNTS_RELATIONSHIPS,
  REMOVE_MASTER_DATA
} from "./action-types";

import { getApiResponseAsync } from "../../services/api/apiCallerGet";
import { makeApiRequest } from "../../services/api";
import getURL from "../../services/api/apiList";

export function fetchBudgetTypes(payload) {
  return async (dispatch) => {
    //	console.log(payload,'abc payload')
    const apireq = await getApiResponseAsync("BUDGETTYPE");
    //console.log('getting data',apireq)
    dispatch({ type: FETCH_BUDGETTYPE, payload: apireq });
  };
}

export function fetchBudgetVersionTypes(payload) {
  return async (dispatch) => {
    //	console.log(payload,'abc payload')
    const apireq = await getApiResponseAsync("BUDGETVERSIONTYPE");
    //console.log('getting data',apireq)
    dispatch({ type: FETCH_BUDGETVERSIONTYPE, payload: apireq });
  };
}

export function fetchForecastMethodType(payload) {
  return async (dispatch) => {
    //	console.log(payload,'abc payload')
    const apireq = await getApiResponseAsync("FORECASTMETHODTYPE");
    //console.log('getting data',apireq)
    dispatch({ type: FETCH_FORECASTMETHODTYPE, payload: apireq });
  };
}

export function fetchScenarioType(payload) {
  return async (dispatch) => {
    //	console.log(payload,'abc payload')
    const apireq = await getApiResponseAsync("SCENARIOTYPE");
    //console.log('getting data',apireq)
    dispatch({ type: FETCH_SCENARIOTYPE, payload: apireq });
  };
}

export function fetchItemDateFormat(payload) {
  return async (dispatch) => {
    //	console.log(payload,'abc payload')
    const apireq = await getApiResponseAsync("ITEMDATEFORMAT");
    //console.log('getting data',apireq)
    dispatch({ type: FETCH_ITEMDATEFORMAT, payload: apireq });
  };
}

export function fetchItemDecimalPlaces(payload) {
  return async (dispatch) => {
    //	console.log(payload,'abc payload')
    const apireq = await getApiResponseAsync("ITEMDECIMALPLACES");
    //console.log('getting data',apireq)
    dispatch({ type: FETCH_ITEMDECIMALPLACES, payload: apireq });
  };
}

export function fetchItemMonths(payload) {
  return async (dispatch) => {
    //	console.log(payload,'abc payload')
    const apireq = await getApiResponseAsync("ITEMMONTHS");
    //console.log('getting data',apireq)
    dispatch({ type: FETCH_ITEMMONTHS, payload: apireq });
  };
}

export function fetchFiscalyear(payload) {
  return async (dispatch) => {
    //	console.log(payload,'abc payload')
    const apireq = await getApiResponseAsync("FISCALYEAR");
    //console.log('getting data',apireq)
    dispatch({ type: FETCH_FISCALYEAR, payload: apireq });
  };
}

export function fetchEntities(payload) {
  return async (dispatch) => {
    // const apireq = await getApiResponseAsync("ENTITIES");
    const response = await makeApiRequest('get', getURL("ENTITIES"), { params: { userId: payload } });
    const data = await response.data;
    dispatch({ type: FETCH_ENTITIES, payload: data });
  };
}

export function fetchDepartments(payload) {
  return async (dispatch) => {
    // const apireq = await getApiResponseAsync("DEPARTMENTS");
    const response = await makeApiRequest('get', getURL("DEPARTMENTS"), { params: { userId: payload } });
    const data = await response.data;
    dispatch({ type: FETCH_DEPARTMENTS, payload: data });
  };
}

export function fetchStatistics(payload) {
  return async (dispatch) => {
    // const apireq = await getApiResponseAsync("STATISTICS");
    const response = await makeApiRequest('get', getURL("STATISTICS"), { params: { userId: payload } });
    const data = await response.data;
    dispatch({ type: FETCH_STATISTICS, payload: data });
  };
}

export function fetchTimePeriods(payload) {
  return async (dispatch) => {
    const apireq = await getApiResponseAsync("TIMEPERIODS");

    dispatch({ type: FETCH_TIMEPERIODS, payload: apireq });
  };
}


export function fetchDimensionRelationships(payload) {
  return async (dispatch) => {
    const apireq = await getApiResponseAsync("DIMENSIONRELATIONSHIPS");

    dispatch({ type: FETCH_DIMENSION_RELATIONSHIPS, payload: apireq });
  };
}

export function fetchDepartmentsRelationships(payload) {
  return async (dispatch) => {
    //const apireq = await getApiResponseAsync("DEPARTMENTSRELATIONSHIPS");

    //dispatch({ type: FETCH_DEPARTMENT_RELATIONSHIPS, payload: apireq });
  };
}

export function fetchGLAccountsRelationships(payload) {
  return async (dispatch) => {
    //const apireq = await getApiResponseAsync("GLACCOUNTSRELATIONSHIPS");

    //dispatch({ type: FETCH_GLACCOUNTS_RELATIONSHIPS, payload: apireq });
  };
}


export function fetchGLAccounts(payload) {
  return async (dispatch) => {
    // const apireq = await getApiResponseAsync("GLACCOUNTS");
    const response = await makeApiRequest('get', getURL("GLACCOUNTS"), { params: { userId: payload } });
    const data = await response.data;

    dispatch({ type: FETCH_GLACCOUNTS, payload: data });
  };
}

export function fetchPayTypes(payload) {
  return async (dispatch) => {
    // const apireq = await getApiResponseAsync("PAYTYPES");
    const response = await makeApiRequest('get', getURL("PAYTYPES"), { params: { userId: payload } });
    const data = await response.data;

    dispatch({ type: FETCH_PAYTYPES, payload: data });
  };
}

export function fetchJobCodes(payload) {
  return async (dispatch) => {
    // const apireq = await getApiResponseAsync("JOBCODES");
    const response = await makeApiRequest('get', getURL("JOBCODES"), { params: { userId: payload } });
    const data = await response.data;

    dispatch({ type: FETCH_JOBCODES, payload: data });
  };
}

export function fetchPayTypeDistributions(payload) {
  return async (dispatch) => {
    const apireq = await getApiResponseAsync("PAYTYPEDISTRIBUTIONS");

    dispatch({ type: FETCH_PAYTYPEDISTRIBUTIONS, payload: apireq });
  };
}


export function fetchStaffingDataType(payload) {
  return async (dispatch) => {
    const apireq = await getApiResponseAsync("STAFFINGDATATYPE");
    dispatch({ type: FETCH_STAFFINGDATATYPE, payload: apireq });
  };
}

export function removeMasterData(payload) {
  return { type: REMOVE_MASTER_DATA, payload };
}

