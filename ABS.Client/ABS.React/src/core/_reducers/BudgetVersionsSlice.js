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
  REMOVE_ALL_BUDGETVERSIONS_FILTER_GROUP,
  REMOVE_BUDGETVERSIONS_FILTER,
  REMOVE_BUDGETVERSIONS_FILTER_GROUP,
  RESET_BUDGETVERSIONS_FILTERS,
  SET_BUDGETVERSIONS_FILTER_OPTIONS,
  SET_BUDGETVERSIONS_FILTERED_FLAG,
  SET_BUDGETVERSIONS_SORT_DIRECTION,
  SET_BUDGETVERSIONS_SORT_FACTOR,
  SET_BUDGETVERSIONS_SORTED_FLAG
} from '../_actions/action-types';

import postApiResponse from '../../services/api/apiCallerPost';
import { updateObject } from './helperFunctions';

function updateSettings(objState, objaction) {
  const newObj = updateObject(objState, objaction.payload);
  //	console.log(objState, 'what is my state')

  return newObj;
}

const initialFilterOptionsState = {
  FilterOptions: {
    Entites: [],
    Departments: [],
    JobCodes: [],
    Statistics: []
  }
};

const initialFiltersState = {
  Filters: {
    Entites: [],
    Departments: [],
    JobCodes: [],
    Statistics: []
  },
  GroupsFilters: {
    Entites: [],
    Departments: [],
    JobCodes: [],
    Statistics: []
  },  
};

const initialSortState = {
  Sort: {
    Entites: {
      sortDirection: 'ascending',
      sortFactor: 'code'
    },
    Departments: {
      sortDirection: 'ascending',
      sortFactor: 'code'
    },
    JobCodes: {
      sortDirection: 'ascending',
      sortFactor: 'code'
    },
    Statistics: {
      sortDirection: 'ascending',
      sortFactor: 'code'
    }
  }
};

const initialState = {
  isLoading: null,
  isLoaded: null,
  filtered: false,
  sorted: false,
  code: null,
  description: null,
  comments: null,
  fiscalYearID: null,
  fiscalStartMonthID: null,
  budgetVersionTypeID: null,
  scenarioTypeID: null,
  UserAuthenticated: true,
  UserID: 1,
  budgetVersionsData: [],
  list: [],
  ...initialFilterOptionsState,
  ...initialFiltersState,
  ...initialSortState
};

function AddDatabase(objState, objaction) {
  const newObj = updateObject(objState, objaction.payload);
  newObj.list = "";
  newObj.actionType = "ADD";
  // console.log('BV addFunc', objState, objaction);
  //	 console.log('BV addFunc new values', newObj);

  const res = postApiResponse('BUDGETVERSIONS', newObj);
  //console.log('got this response from post',res)
  return newObj;
}
function updateDatabase(objState, objaction) {
  const newObj = updateObject(objState, objaction.payload);
  newObj.list = "";
  newObj.actionType = "UPDATE";
  console.log('BV updateFunc', objState, objaction);
  const res = postApiResponse('BUDGETVERSIONS', newObj);
  //console.log('got this response from post',res)
  return newObj;
}
function renameDatabase(objState, objaction) {
  //update creation Date with current date/time
  objState["updateddate"] = new Date();
  const newObj = updateObject(objState, objaction.payload);
  newObj.list = "";
  newObj.actionType = "RENAME";

  const obj = {
    UserAuthenticated: newObj.UserAuthenticated,
    UserID: newObj.UserID,
    actionType: newObj.actionType,
    budgetVersionTypeID: newObj.budgetVersionTypeID.itemTypeID,
    budgetVersionsData: newObj.budgetVersionID,
    budgetVersionID: newObj.budgetVersionID,
    code: newObj.code,
    comments: newObj.comments,
    description: newObj.description,
    timePeriodID: newObj.timePeriodID.timePeriodID,
  }

  const res = postApiResponse('BUDGETVERSIONS', obj);
  return newObj;
}
function deleteDatabase(objState, objaction) {
  const newObj = updateObject(objState, objaction.payload);
  newObj.list = "";
  newObj.actionType = "DELETE";
  newObj.DeleteIDs = objaction.payload;
  newObj.isLoaded = false;
  console.log(objaction.payload, 'get all IDs to delete')
  //	console.log('SSS updateFunc', objState, objaction);
  const res = postApiResponse('BUDGETVERSIONS', newObj);
  //console.log('got this response from post',res)
  return newObj;
}
function copyDatabase(objState, objaction) {

  const newObj = updateObject(objState, objaction.payload);
  newObj.list = "";
  newObj.actionType = "COPY";
  newObj.budgetVersionsData = objaction.payload.budgetVersionsID;
  newObj.isLoaded = false;
  console.log(objaction.payload, 'get ID to copy')
  //	console.log('SSS updateFunc', objState, objaction);
  const res = postApiResponse('BUDGETVERSIONS', newObj);
  //console.log('got this response from post',res)
  return newObj;
}






function BudgetVersionReducer(state = initialState, action) {
  // console.log(' budget version reducer' , state, action);
  switch (action.type) {
    case ADD_BUDGETVERSIONS:
      return AddDatabase({ ...state }, action);

    case DELETE_BUDGETVERSIONS:
      //return { ...state, count: state.count - 1 };
      return deleteDatabase({ ...state }, action);
    case UPDATE_BUDGETVERSIONS:
      return updateDatabase({ ...state }, action);
    case CHANGE_BUDGETVERSIONS:
      return updateSettings({ ...state }, action);

    case RENAME_BUDGETVERSIONS:
      return renameDatabase({ ...state }, action);
    case COPY_BUDGETVERSIONS:
      return copyDatabase({ ...state }, action);
    case FETCH_BUDGETVERSIONS:
      //return { ...state, count: state.count - 1 };
      // return updateSettings ({...state}, action);;
      return {
        ...state,
        list: updateSettings({ ...state.list }, action),
        isLoaded: true,
        isLoading: false
      };
    case RESET_BUDGETVERSIONS:
      return {
        ...state,
        isLoaded: false
      }
    case ADD_ALL_BUDGETVERSIONS_FILTERS:
      return {
        ...state,
        Filters: {
          ...state.Filters,
          [action.filterType]: [
            ...state.FilterOptions[action.filterType].map(filter => filter.id)
          ]
        }
      };
    case ADD_BUDGETVERSIONS_FILTER:
      return {
        ...state,
        Filters: {
          ...state.Filters,
          [action.filterType]: [
            ...state.Filters[action.filterType].filter(filterId => filterId !== action.filterId),
            action.filterId
          ]
        }
      };
    case ADD_BUDGETVERSIONS_FILTER_GROUP:
      return {
        ...state,
        GroupsFilters: {
          ...state.GroupsFilters,
          [action.filterType]: [
            ...state.GroupsFilters[action.filterType].filter(filterId => filterId.actualID !== action.filterId.actualID),
            action.filterId
          ]
        }
      };
    case REMOVE_ALL_BUDGETVERSIONS_FILTERS:
      return {
        ...state,
        Filters: {
          ...state.Filters,
          [action.filterType]: []
        }
      };
    case REMOVE_ALL_BUDGETVERSIONS_FILTER_GROUP:
      return {
        ...state,
        GroupsFilters: {
          ...state.GroupsFilters,
          [action.filterType]: []
          }
      };
    case REMOVE_BUDGETVERSIONS_FILTER:
      return {
        ...state,
        Filters: {
          ...state.Filters,
          [action.filterType]: [
            ...state.Filters[action.filterType].filter(filterId => filterId !== action.filterId)
          ]
        }
      };
    case REMOVE_BUDGETVERSIONS_FILTER_GROUP:
      return {
        ...state,
        GroupsFilters: {
          ...state.GroupsFilters,
          [action.filterType]: [
            ...state.GroupsFilters[action.filterType].filter(filterId => filterId.actualID !== action.filterId.actualID)
          ]
        }
      };
    case SET_BUDGETVERSIONS_FILTERED_FLAG:
      return {
        ...state,
        filtered: action.isFiltered
      };
    case SET_BUDGETVERSIONS_FILTER_OPTIONS:
      return {
        ...state,
        FilterOptions: {
          ...state.FilterOptions,
          [action.filterType]: [
            ...action.filterOptions
          ]
        }
      };
    case SET_BUDGETVERSIONS_SORT_DIRECTION:
      return {
        ...state,
        Sort: {
          ...state.Sort,
          [action.sortDimension]: {
            ...state.Sort[action.sortDimension],
            sortDirection: action.sortDirection
          }
        }
      };
    case SET_BUDGETVERSIONS_SORT_FACTOR:
      return {
        ...state,
        Sort: {
          ...state.Sort,
          [action.sortDimension]: {
            ...state.Sort[action.sortDimension],
            sortFactor: action.sortFactor
          }
        }
      };
    case SET_BUDGETVERSIONS_SORTED_FLAG:
      return {
        ...state,
        sorted: action.isSorted
      };
    case RESET_BUDGETVERSIONS_FILTERS:
      return {
        ...state,
        ...initialFiltersState,
        filtered: false,
        sorted: false
      };
    default:
      return state;
  }
}

export default BudgetVersionReducer;
