import {
  FETCH_BUDGETTYPE,
  FETCH_BUDGETVERSIONTYPE,
  FETCH_FORECASTMETHODTYPE,
  FETCH_SCENARIOTYPE,
  FETCH_ITEMDATEFORMAT,
  FETCH_ITEMDECIMALPLACES,
  FETCH_ITEMMONTHS,
  FETCH_FISCALYEAR,
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

} from "../_actions/action-types";

const initialState = {
  isLoading: true,
  isLoaded: true,

  BudgetType: [],

  BudgetVersionsType: [],

  ForecastMethodType: [],

  ScenarioType: [],

  FiscalYear: [],

  ItemDateFormat: [
    {
      "itemTypeID": 3,
      "itemTypeKeyword": "DATEFORMATS",
      "itemTypeCode": "mm/dd/yyyy",
      "itemTypeValue": "itemsDateFormat-0",
      "itemDataType": "DateTime",
      "itemDisplayName": "mm/dd/yyyy"
    },
    {
      "itemTypeID": 4,
      "itemTypeKeyword": "DATEFORMATS",
      "itemTypeCode": "yyyy-mm-dd",
      "itemTypeValue": "itemsDateFormat-1",
      "itemDataType": "DateTime",
      "itemDisplayName": "yyyy-mm-dd"
    },
    {
      "itemTypeID": 5,
      "itemTypeKeyword": "DATEFORMATS",
      "itemTypeCode": "mm/dd/yy",
      "itemTypeValue": "itemsDateFormat-2",
      "itemDataType": "DateTime",
      "itemDisplayName": "mm/dd/yy"
    },
    {
      "itemTypeID": 6,
      "itemTypeKeyword": "DATEFORMATS",
      "itemTypeCode": "dd-mmm-yy",
      "itemTypeValue": "itemsDateFormat-3",
      "itemDataType": "DateTime",
      "itemDisplayName": "dd-Jan-yy"
    },
    {
      "itemTypeID": 7,
      "itemTypeKeyword": "DATEFORMATS",
      "itemTypeCode": "MMMM dd, yyyy",
      "itemTypeValue": "itemsDateFormat-4",
      "itemDataType": "DateTime",
      "itemDisplayName": "January dd, yyyy"
    },
    {
      "itemTypeID": 8,
      "itemTypeKeyword": "DATEFORMATS",
      "itemTypeCode": "dd-mmm-yyyy",
      "itemTypeValue": "itemsDateFormat-5",
      "itemDataType": "DateTime",
      "itemDisplayName": "dd-Jan-yyyy"
    }
  ],

  ItemDecimalPlaces: [],

  ItemMonths: [],

  lastupdated: "",

  count: 1,

  Entites: [],
  Departments: [],
  Statistics: [],
  TimePeriods: [],
  DimensionRelationships: [],
  GLAccounts: [],
  PayTypes: [],
  JobCodes: [],
  PayTypeDistributions: [],
  StaffingDataType: [],
  AllDimensionRelationships: {
    Departments: [],
    GLAccounts: []
  }
};

const MasterDataReducer = (state = initialState, action) => {
  //  console.log('SS reducer', state, action);

  switch (action.type) {
    case FETCH_BUDGETTYPE:
      // return {...state, BudgetType: [ ...state.BudgetType, fetchMasterData('BUDGETTYPE') ] } //   {...state , BudgetType: fetchMasterData('BUDGETTYPE',state) };
      return {
        ...state,
        BudgetType: state.BudgetType.concat(action.payload),
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_BUDGETVERSIONTYPE:
      return {
        ...state,
        BudgetVersionsType: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_FORECASTMETHODTYPE:
      return {
        ...state,
        ForecastMethodType: state.ForecastMethodType.concat(action.payload),
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_SCENARIOTYPE:
      return {
        ...state,
        //ScenarioType: state.ScenarioType.concat(action.payload),
        ScenarioType: action.payload,
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_ITEMDATEFORMAT:
      return {
        ...state,
        // ItemDateFormat: state.ItemDateFormat.concat(action.payload),
        ItemDateFormat: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_ITEMDECIMALPLACES:
      return {
        ...state,
        ItemDecimalPlaces: state.ItemDecimalPlaces.concat(action.payload),
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };

    case FETCH_FISCALYEAR:
      return {
        ...state,
        FiscalYear: state.FiscalYear.concat(action.payload),
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };

    case FETCH_ITEMMONTHS:
      //	console.log('action',action.payload)
      return {
        ...state,
        ItemMonths: state.ItemMonths.concat(action.payload),
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_ENTITIES:
      return {
        ...state,
        Entites: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };

    case FETCH_DEPARTMENTS:
      return {
        ...state,
        Departments: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_STATISTICS:
      return {
        ...state,
        Statistics: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_TIMEPERIODS:
      return {
        ...state,
        TimePeriods: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_DIMENSION_RELATIONSHIPS:
      return {
        ...state,
        DimensionRelationships: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_GLACCOUNTS:
      return {
        ...state,
        GLAccounts: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_PAYTYPES:
      return {
        ...state,
        PayTypes: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_JOBCODES:
      return {
        ...state,
        JobCodes: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_PAYTYPEDISTRIBUTIONS:
      return {
        ...state,
        PayTypeDistributions: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_STAFFINGDATATYPE:
      return {
        ...state,
        StaffingDataType: [...action.payload],
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_DEPARTMENT_RELATIONSHIPS:
      return {
        ...state,
        AllDimensionRelationships: { ...state.AllDimensionRelationships, Departments: [...action.payload] },
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case FETCH_GLACCOUNTS_RELATIONSHIPS:
      return {
        ...state,
        AllDimensionRelationships: { ...state.AllDimensionRelationships, GLAccounts: [...action.payload] },
        isLoaded: true,
        isLoading: false,
        lastupdated: new Date().toISOString(),
      };
    case REMOVE_MASTER_DATA:
      return {
        ...state,
        isLoading: true
      }
    default:
      return state;
  }
};

export default MasterDataReducer;
