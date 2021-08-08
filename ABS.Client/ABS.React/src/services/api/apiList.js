// All services live on the same host and therefore use the same host name
// GATEWAY_PORT and PROCESSING_PORT are passed at the host environment variable level to Docker

// DO NOT HARDCODE PORTS OR HOSTS IN THIS FILE EVER
//var url = `http://${window.location.hostname}:${window._env_.GATEWAY_PORT}`;
//var url = `http://${window.location.hostname}:${window._env_.GATEWAY_PORT}`;
//var url_processing = `http://${window.location.hostname}:${window._env_.PROCESSING_PORT}`;
var url = "http://localhost:2020";
//var url_processing = "http://localhost:20203";
//var url = "http://ash-aff-absops:20223"
var url_processing = "http://localhost:51830";
//var url = "http://ash-aff-absops:2020";
//var url_processing = "http://ash-aff-absops:2020";

//var abc = "http://ash-aff-absops:2020"
//var url = "http://ash-aff-absops:2020"


//var url = "http://localhost:2020";


// var url = "http://ash-aff-absops:20220";
// var url = "http://ash-aff-absops:20220";

// var url_processing = "http://ash-aff-absops:20240";

// var abc = "http://ash-aff-absops:2020";

export default function getURL(urlName) {
  switch (urlName) {
    case "Authentication":
      return url + "/IdentityServer";
    case "SystemSettings":
      return url + "/api/systemsettings";
    case "SystemSettingsbyUser":
      return url + "/api/SystemSettings/SystemSettingsbyUser";
    case "SystemSettingsbyUserID":
      return url + "/api/SystemSettings/SystemSettingsbyUser?UserID=";
    case "ApiTest":
      return "https://jsonplaceholder.typicode.com/users";
    case "ApiTestPost":
      return "https://jsonplaceholder.typicode.com/posts";
    case "ItemTypes":
      return url + "/api/ItemTypes";
    case "ITEMMONTHS":
      return url + "/api/ItemTypes/GetMonths";
    case "ITEMDATEFORMAT":
      return url + "/api/ItemTypes/GetDateFormats";
    case "ITEMDECIMALPLACES":
      return url + "/api/ItemTypes/GetDecimalPlaces";
    case "SCENARIOTYPE":
      return url + "/api/ItemTypes/GetScenariotype";
    case "BUDGETVERSIONTYPE":
      return url + "/api/ItemTypes/GetBudgetVersionType";
    case "BUDGETTYPE":
      return url + "/api/ItemTypes/GetBudgetType";
    case "FORECASTMETHODTYPE":
      return url + "/api/ItemTypes/GetForecastMethodType";
    case "FISCALYEAR":
      return url + "/api/ItemTypes/GetFiscalYear";
    case "STATISTICSDATA":
      return url + "/api/ItemTypes/GetStatisticsData";
    case "GENERALLEDGERDATA":
      return url + "/api/ItemTypes/GetGeneralLedgerData";
    case "DATASCENARIOS":
      return url + "/api/DataScenarios";
    case "STAFFINGDATA":
      return url + "/api/ItemTypes/GetStaffingData";
    case "BUDGETVERSIONS":
      return url + "/api/BudgetVersions";
    case "GETBUDGETVERSIONPAGE":
      return url + "/api/BudgetVersions/GetBudgetVersionPage";
    case "BUDGETVERSIONSGRID":
      return url + "/api/BudgetVersions/GetBudgetVersion";
    case "BUDGETVERSIONCODES":
      return url + "/api/BudgetVersions/GetBudgetVersionCodes";
    case "FORECASTSAVE":
      return url_processing + "/processing/Forecast";
    case "GETFORECASTMODEL":
      return url + "/api/ForecastModels";
    case "SAVEFORECASTMODEL":
      return url + "/api/ForecastModels";
    case "UPDATEFORECASTMODEL":
      return url + "/api/ForecastModels";
    case "DELETEFORECASTMODEL":
      return url + "/api/ForecastModels";
    case "ENTITIES":
      return url + "/api/Entities";
    case "DEPARTMENTS":
      return url + "/api/Departments";
    case "STATISTICS":
      return url + "/api/StatisticsCodes";
    case "TIMEPERIODS":
      return url + "/api/TimePeriods";
    case "STATICALDATA":
      return url + "/api/StatisticalData";
    case "BUDGETVERSIONSTATS":
      return url + "/api/BudgetVersionStatistics";
    case "BUDGETVERSIONGL":
      return url + "/api/BudgetVersionGLAccounts";
    case "BUDGETVERSIONSTAFF":
      return url + "/api/BudgetVersionStaffing";
    // Remove 'TIMEPERIODS' , becuase its a duplicate case.
    case "DIMENSIONRELATIONSHIPS":
      return url + "/api/Relationships";
    case "GLACCOUNTS":
      return url + "/api/GLAccounts";
    case "STAFFINGSCENARIODATA":
      return url + "/api/StaffingData";
    case "STATISTICSMAPPINNGS":
      return url + "/api/StatisticMappings";
    case "GETENTITYSTATISTICSMAPPINNGS":
      return url + "/api/StatisticMappings/GetEntityMappings";
    case "INFLATION":
      return url + '/api/Inflation';
    case "PAYTYPES":
      return url + '/api/PayTypes';
    case "JOBCODES":
      return url + '/api/JobCodes';
    case "RAISES":
      return url + "/api/StaffingWageAdjustment";
    case "GLACCOUNTMAPPINGS":
      return url + "/api/StaffingGLMappings";
    case "FTEDATA":
      return url + "/api/FullTimeEquivalent";
    case "PAYTYPEDISTRIBUTIONS":
      return url + "/api/PayTypeDistributions";
    case "CALCULATE":
      return url_processing + "/processing/Forecast/StaffingGLMapping"; 
    case "STAFFINGDATATYPE":
      return url + "/api/ItemTypes/GetStaffingDataType";
    case "FORCASTHISTORY":
      return url + '/api/ForecastHistory';
    case "SIGNIN":
      // return 'http://ash-aff-absops:20200/api/LDAPLogin/SignIn'
      return url + '/api/Authentication/SignIn'
    case "ALLBACKGROUNDJOBS":
      return url + '/api/BackgroundJobs';
    case 'USERS':
      return url + '/api/IdentityUserProfiles';
    case "ASSIGNENTITIES":
      return url + '/api/IdentityAppRoleDataEntities';
    case "ROLES":
      return url + '/api/IdentityAppRoles';
    // case "ROLES":
    //   return '/api/IdentityAppRoles';
    case "GETMENUITEMS":
      return url + '/api/Authentication/GetMenuItems';
    case "CREATEROLES":
      return url + '/api/Authentication/UpdateRoleSetupDetails'
    case "GETROLESDETAILS":
      return url + '/api/Authentication/RoleSetupDetails'
    case "GETROLESWITHMENIITEMS":
      return url + '/api/IdentityAppRoles/GetRoleSpecificScreenswithoutActions'
    case "DEPARTMENTSRELATIONSHIPS":
      return url + '/api/Relationships/GETALLDEPARTMENTRELATIONS';
    case "GLACCOUNTSRELATIONSHIPS":
      return url + '/api/Relationships/GETALLGLACCOUNTRELATIONS';
    case "ENTITYRELATIONSHIPS":
      return url + '/api/Relationships/GETALLENTITYRELATIONS';
    case "STATISTICSRELATIONSHIPS":
      return url + '/api/Relationships/GETALLSTATISTICSCODERELATIONS';
    case "JOBCODERELATIONSHIPS":
      return url + '/api/Relationships/GETALLJOBCODERELATIONS';
    case "PAYTYPESRELATIONSHIPS":
      return url + '/api/Relationships/GETALLPAYTYPERELATIONS';
    case "CREATE/UPDATE-USERS":
      return url + '/api/Authentication/UpdateUserDetails';
    case "USERDETAILS":
      return url + '/api/Authentication/UserDetails';
    case "SAVEACTUALBUDGETVERSIONDATA":
      return url + '/api/BudgetVersions/UpdateActualBudgetVersion';
    case "GETREPORTINGLIST":
      return url + '/api/ReportingDimensions/GetReportingDimensionsPage';
    case "GETUSERDETAILS":
      return url + '/api/Authentication/GetUserAuthorization'
    case "GETREPORTSCODES":
      return url + "/api/ReportingDimensions/GetReportsCodes"
    case "DELETEREPORTS":
      return url + "/api/ReportingDimensions/DeleteReportingDimensions"
    case "COPYREPORT":
      return url + "/api/ReportingDimensions/CopyReportingDimensions"
    case "RENAMEREPORT":
      return url + "/api/ReportingDimensions/RenameReportingDimensions"
    case "GETREPORTCONFIG":
      return url + "/api/ReportingDimensions"
    case "GETREPORTDISPLAYOPTION":
      return url + "/api/ItemTypes/GetReportDisplayOptions"
    case "GETREPORTMEASURES":
      return url + "/api/ItemTypes/GetReportMeasures"
    case "GETREPORTPERIOD":
      return url + "/api/ItemTypes/GetReportPeriods"
    case "SAVEREPORTCONFIG":
      return url + "/api/ReportingDimensions"
    case "GETSUBACCOUNTS":
      return url + "/api/SubAccountsDimensions/GetSubAccountbyRowID"
    case "CREATESUBACCOUNTS":
      return url + "/api/SubAccountsDimensions/SubAccountDetails"
    case "UPDATESUBACCOUNTS":
      return url + "/api/SubAccountsDimensions"
    case "RUNREPORT":
      return url_processing + "/processing/Reports/GenerateReport"; 
    case "DOWNLOADREPORT":
      return url_processing + "/processing/Reports/DownloadReport"; 
    default:
      break;
  }
}