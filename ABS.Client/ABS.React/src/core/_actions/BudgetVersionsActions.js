import {
  ADD_BUDGETVERSIONS,
  CHANGE_BUDGETVERSIONS,
  COPY_BUDGETVERSIONS,
  DELETE_BUDGETVERSIONS,
  FETCH_BUDGETVERSIONS,
  RENAME_BUDGETVERSIONS,
  UPDATE_BUDGETVERSIONS,
  RESET_BUDGETVERSIONS,
  ADD_ALL_BUDGETVERSIONS_FILTERS,
  ADD_BUDGETVERSIONS_FILTER,
  ADD_BUDGETVERSIONS_FILTER_GROUP,
  REMOVE_ALL_BUDGETVERSIONS_FILTERS,
  REMOVE_BUDGETVERSIONS_FILTER,
  REMOVE_BUDGETVERSIONS_FILTER_GROUP,
  REMOVE_ALL_BUDGETVERSIONS_FILTER_GROUP,
  RESET_BUDGETVERSIONS_FILTERS,
  SET_BUDGETVERSIONS_FILTER_OPTIONS,
  SET_BUDGETVERSIONS_FILTERED_FLAG,
  SET_BUDGETVERSIONS_SORT_DIRECTION,
  SET_BUDGETVERSIONS_SORT_FACTOR,
  SET_BUDGETVERSIONS_SORTED_FLAG
} from "./action-types";
import { getApiResponseParams } from "../../services/api/apiCallerGet";

export function changeBudgetVersions(payload) {
  return { type: CHANGE_BUDGETVERSIONS, payload };
}
export function addBudgetVersions(payload) {
  return { type: ADD_BUDGETVERSIONS, payload };
}
export function deleteBudgetVersions(payload) {
  return { type: DELETE_BUDGETVERSIONS, payload };
}
export function updateBudgetVersions(payload) {
  return { type: UPDATE_BUDGETVERSIONS, payload };
}
export function renameBudgetVersions(payload) {
  return { type: RENAME_BUDGETVERSIONS, payload };
}
export function copyBudgetVersions(payload) {
  return { type: COPY_BUDGETVERSIONS, payload };
}

export function resetBudgetVersions() {
  return { type: RESET_BUDGETVERSIONS };
}

export function fetchBudgetVersions(payload) {
  return async (dispatch) => {
    const apireq = await getApiResponseParams("BUDGETVERSIONSGRID");
    dispatch({ type: FETCH_BUDGETVERSIONS, payload: apireq });
  };
}

export function addAllBudgetVersionsFilters(filterType) {
  return { type: ADD_ALL_BUDGETVERSIONS_FILTERS, filterType }
}

export function addBudgetVersionsFilter(filterType, filterId) {
  return { type: ADD_BUDGETVERSIONS_FILTER, filterType, filterId }
}

export function addBudgetVersionsFilterGroup(filterType, filterId) {
  return { type: ADD_BUDGETVERSIONS_FILTER_GROUP, filterType, filterId }
}

export function removeAllBudgetVersionsFilters(filterType) {
  return { type: REMOVE_ALL_BUDGETVERSIONS_FILTERS, filterType }
}

export function removeAllBudgetVersionsFiltersGroups(filterType) {
  return { type: REMOVE_ALL_BUDGETVERSIONS_FILTER_GROUP, filterType }
}

export function removeBudgetVersionsFilter(filterType, filterId) {
  return { type: REMOVE_BUDGETVERSIONS_FILTER, filterType, filterId }
}

export function removeBudgetVersionsFilterGroup(filterType, filterId) {
  return { type: REMOVE_BUDGETVERSIONS_FILTER_GROUP, filterType, filterId }
}

export function resetBudgetVersionsFilters() {
  return { type: RESET_BUDGETVERSIONS_FILTERS }
}

export function setBudgetVersionsFilterOptions(filterType, filterOptions) {
  return { type: SET_BUDGETVERSIONS_FILTER_OPTIONS, filterType, filterOptions }
}

export function setBudgetVersionsFilteredFlag(isFiltered) {
  return { type: SET_BUDGETVERSIONS_FILTERED_FLAG, isFiltered }
}

export function setBudgetVersionsSortDirection(sortDimension, sortDirection) {
  return { type: SET_BUDGETVERSIONS_SORT_DIRECTION, sortDimension, sortDirection }
}

export function setBudgetVersionsSortFactor(sortDimension, sortFactor) {
  return { type: SET_BUDGETVERSIONS_SORT_FACTOR, sortDimension, sortFactor }
}

export function setBudgetVersionsSortedFlag(isSorted) {
  return { type: SET_BUDGETVERSIONS_SORTED_FLAG, isSorted }
}
