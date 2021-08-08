import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useHistory } from "react-router-dom";
import {
 Button,
 Dropdown,
 TableSelectAll,
 Search,
 Pagination,
 DataTable,
 Table,
 TableBody,
 TableCell,
 TableContainer,
 TableHead,
 TableHeader,
 TableRow,
 TableToolbar,
 TableToolbarContent,
 TableToolbarSearch,
 TableSelectRow,
 TableBatchActions,
 TableBatchAction,
 DataTableSkeleton,
 InlineNotification,
 TooltipIcon,
 InlineLoading,
 RadioButtonGroup,
 RadioButton,
 DropdownSkeleton,
 TextInput,
 MultiSelect,
 Checkbox,
} from "carbon-components-react";
import {
 transformBudgetVersionData,
 getEntityGroupedData,
 getDepartmentHierarchyGroupedData,
 getStatisticsGroupedData,
 getGLAccountHierarchyGroupedData,
 getJobCodeGroupedData,
 getPayTypeGroupedData,
 getBudgetVersionDataForDropDowns,
 GetSortedEntityByGroups,
 GetSortedDepartmentByHierarchyGroupe,
 GetSortedStatisticsByGroups,
 GetSortedGLAccountsByGroups,
 GetSortedJobCodeByGroups,
 GetSortedPayTypeByGroups,
} from "../../../helpers/DataTransform/transformData";
import { Favorite16, Information20, ArrowDown16, ArrowUp16, Save16, Search16, Information16, SkipForwardOutlineSolid32 } from "@carbon/icons-react";
import gridHeader from "./report-grid-header";
import { useDispatch, useSelector } from "react-redux";
import { getReportConfigData, getReportFormInitalData, saveReportConfigService, GetReportingPageDataRows, GetReportCodes, DeleteReports } from "../../../services/reporting-service";
import ReportCopyRenameModal from "./copy-report-rename-modal";
import FullScreenModal from "../../shared/budget-versions-modal/full-screen-modal";
import RunReportModal from "./run-report-modal";
import MultiSelectBudgetVersionModal from "../../shared/multi-select/multi-select-budget-version-modal";
import MultiSelectDimensionWithModal from "../../shared/multi-select/multi-select-dimension-with-modal";
import { convertUTCDateToLocalDateLocalString } from "../../../helpers/date.helper";
import { GetBudgetVersionPageDataRows } from "../../../services/budget-version-service";
import { getApiResponseAsync } from "../../../services/api/apiCallerGet";

const ReportForm = ({ location, match }) => {
 const breadCrumb = [{ text: "Reports", link: "/Reports" }];
 const [xheader, setHeader] = useState("Add report");
 const masterData = useSelector((state) => state.MasterData);
 const initialStates = {
  code: "",
  name: "",
  description: "",
  formErrors: {
   codeInvalid: false,
   codeInvalidText: "",
   nameInvalid: false,
   nameInvalidText: "",
   descriptionInvalid: false,
   descriptionInvalidText: "",
  },
  formSubmitted: false,
  scenarioType: "",
  scenarioTypeSelectedItem: null,
  isEditForm: match?.params?.id ? true : false,
  showNotification: false,
  notificationType: "success",
  notificationTitle: "",
  jsonConfig: null,
  updateDateTime: "",
  showSaveAsModal: false,
  datatableKey: "1",
 };

 const history = useHistory();
 const [state, setState] = useState(initialStates);
 const [reportsCodeState, setReportsCodeState] = useState([]);
 // use to populate the dropdowns/Multiselect on form
 const [dropdownDataState, setDropdownDataState] = useState({
  scenarioTypes: [],
  budgetversionsList: [],
  reportMeasuresList: [],
  reportPeriodList: [],
 });
 const [reportDisplayOption, setReportDisplayOption] = useState([]);
 const [dimensionDropdownDataState, setDimensionDropdownDataState] = useState({
  entity: [],
  department: [],
  statistic: [],
 });

 const [formKeys, setformKeys] = useState({
  budgetversionDropdownkey: 1,
  entityDropdownKey: 1,
  departmentDropdownKey: 1,
  statisticsDropdownKey: 1,
  periodDropdownKey: 1,
  measureDropdownKey: 1,
 });
 // Use to populate the grids on form
 const [girdsDataState, setGirdsDataState] = useState({
  budgetversionsList: [],
 });

 const [entityGroupedData, setEntityGroupedData] = useState({
  data: [],
 });
 const [departmentGroupedData, setDepartmentGroupedData] = useState({
  data: [],
 });
 const [statisticGroupedData, setStatisticGroupedData] = useState({
  data: [],
 });

 const [dropdownSelectedData, setDropdownSelectedData] = useState({
  budgetVersionsSelected: [],
  entitySelected: [],
  departmentSelected: [],
  statisticSelected: [],
  periodSelected: [],
  measureSelected: [],
 });

 const [displayradioButtonsSeletionState, setDisplayradioButtonsSeletionState] = useState({
  budgetversion: "1",
  measure: "1",
  period: "1",
  entity: "1",
  department: "1",
  statistic: "1",
 });

 const commonRowOrderObj = [
  { name: "Entity", checked: false, show: true },
  { name: "Department", checked: false, show: true },
 ];
 const [rowOrderStats, setRowOrderStats] = useState({
  ST: [...commonRowOrderObj, { name: "Statistic", checked: false, show: true }],
  GT: [],
  SF: [],
 });

 // States use for save as
 const [saveAsModalReportState, setSaveAsModalReportState] = useState({
  code: "",
  name: "",
  description: "",
 });

 const userdateformat = useSelector((state) => state.systemSettings.fiscalStartMonthDateFormat);
 const dateformat = useSelector((state) => state.MasterData.ItemDateFormat);
 const UserID = useSelector((state) => state.BudgetVersions.UserID);

 useEffect(() => {
  if (masterData.Entites.length) {
   getApiResponseAsync("ENTITYRELATIONSHIPS").then((entityrelationData) => {
    getEntityGroupedData(masterData.Entites, entityrelationData).then((response) => {
     setEntityGroupedData({ ...entityGroupedData, data: response });
    });
   });
  }
 }, [masterData.Entites]);
 useEffect(() => {
  if (masterData.Statistics.length) {
   getApiResponseAsync("STATISTICSRELATIONSHIPS").then((statisticsrelationData) => {
    // Add 'True' to include the mapped statistics in the final result set to show in the grid data.
    getStatisticsGroupedData(masterData.Statistics, statisticsrelationData, false).then((response) => {
     setStatisticGroupedData({ ...statisticGroupedData, data: response });
    });
   });
  }
 }, [masterData.Statistics]);

 useEffect(() => {
  if (masterData.Departments.length) {
   getApiResponseAsync("DEPARTMENTSRELATIONSHIPS").then((departmentrelationData) => {
    getDepartmentHierarchyGroupedData(masterData.Departments, departmentrelationData).then((response) => {
     setDepartmentGroupedData({ ...departmentGroupedData, data: response });
    });
   });
  }
 }, [masterData.Departments]);

 var mydateFormat = dateformat.find(({ itemTypeValue }) => itemTypeValue === userdateformat);
 if (typeof mydateFormat === "undefined") {
  mydateFormat = "LLLL";
 } else {
  mydateFormat = mydateFormat.itemTypeCode;
 }

 const handleChange = (e, stateName) => {
  if (stateName === "code") {
   if (
    reportsCodeState.find((item) => {
     return item.toLowerCase() === e.target.value.toLowerCase();
    })
   ) {
    let updatedFormErrors = { ...state.formErrors };
    updatedFormErrors.codeInvalidText = "Code already in use. Enter different code";
    updatedFormErrors.codeInvalid = true;
    setState({ ...state, [stateName]: e.target.value, formErrors: updatedFormErrors });
    return;
   }
  }
  let updatedStates = { ...state, [stateName]: e.target.value };
  ValidateForm(updatedStates);
 };

 useEffect(() => {
  getReportFormInitalData().then(([scenarioTypesData, budgetversionsData, displayOptionData, reportMeasureData, reportPeriodData, AllReportCodes]) => {
   let mappedBugdetVersionData = [...budgetversionsData.data].map((item) => {
    return { id: item.budgetVersionsID, name: item.code };
   });
   let mappedMeasureData = reportMeasureData.data.map((item) => {
    return { id: item.itemTypeID, name: item.itemTypeDisplayName, code: item.itemTypeCode, value: item.itemTypeValue };
   });
   let mappedPeriodData = reportPeriodData.data.map((item) => {
    return { id: item.itemTypeID, name: item.itemTypeDisplayName, code: item.itemTypeCode, value: item.itemTypeValue };
   });
   setDropdownDataState({
    ...dropdownDataState,
    scenarioTypes: scenarioTypesData.data,
    budgetversionsList: mappedBugdetVersionData,
    reportMeasuresList: mappedMeasureData,
    reportPeriodList: mappedPeriodData,
   });
   setReportDisplayOption(displayOptionData.data);
   setGirdsDataState({ budgetversionsList: GetBudgetVersionPageDataRows(budgetversionsData.data, mydateFormat, "") });
   setReportsCodeState(AllReportCodes.data);
   if (state.isEditForm) {
    getReportConfigData(match?.params?.id).then((reponse) => {
     setState({
      ...state,
      code: reponse.data.code,
      name: reponse.data.name,
      description: reponse.data.description,
      scenarioTypeSelectedItem: scenarioTypesData.data?.find((item) => {
       return item.itemTypeID === reponse.data.scenarioType.itemTypeID;
      }),
      jsonConfig: JSON.parse(reponse.data.jsonConfig),
      updateDateTime: convertUTCDateToLocalDateLocalString(reponse.data.updatedDate + "", mydateFormat, true),
     });
     setHeader(reponse.data.code + " : " + reponse.data.name);
    });
   }
  });
 }, []);

 const mapDropdownSelectionFromConfig = (dropdownDataList, idsArray) => {
  return [
   ...dropdownDataList.filter((item) => {
    return idsArray.find((id) => item.id.toString() === id);
   }),
  ];
 };

 useEffect(() => {
  setGirdsDataState({ budgetversionsList: GetBudgetVersionPageDataRows(dropdownDataState.budgetversionsList, mydateFormat, "") });
 }, [dropdownDataState.budgetversionsList]);

 useEffect(() => {
  let fetchData = {
   entity: dimensionDropdownDataState.entity.length
    ? dimensionDropdownDataState.entity
    : masterData.Entites.length
    ? [
       { id: "all", name: "Select all items (no groups)", code: "", isGroup: false, isHierarchy: false },
       ...GetSortedEntityByGroups(masterData.Entites).map((item) => {
        return { id: item.entityID, name: item.entityName, code: item.entityCode, isGroup: item.isGroup, isHierarchy: item.isHierarchy };
       }),
      ]
    : [],
   department: dimensionDropdownDataState.department.length
    ? dimensionDropdownDataState.department
    : masterData.Departments.length
    ? [
       { id: "all", name: "Select all items (no groups)", code: "", isGroup: false, isHierarchy: false },
       ...GetSortedDepartmentByHierarchyGroupe(masterData.Departments).map((item) => {
        return { id: item.departmentID, name: item.departmentName, code: item.departmentCode, isGroup: item.isGroup, isHierarchy: item.isHierarchy };
       }),
      ]
    : [],
   statistic: dimensionDropdownDataState.statistic.length
    ? dimensionDropdownDataState.statistic
    : masterData.Statistics.length
    ? [
       { id: "all", name: "Select all items (no groups)", code: "", isGroup: false, isHierarchy: false },
       ...GetSortedStatisticsByGroups(masterData.Statistics, false).map((item) => {
        return { id: item.statisticsCodeID, name: item.statisticsCodeName, code: item.statisticsCode, isGroup: item.isGroup, isHierarchy: item.isHierarchy };
       }),
      ]
    : [],
   // generalLedger: GetSortedGLAccountsByGroups(masterData.GLAccounts),
   // jobCode: GetSortedJobCodeByGroups(masterData.JobCodes),
   // payType: GetSortedPayTypeByGroups(masterData.PayTypes),
  };

  setDimensionDropdownDataState({ entity: fetchData.entity, department: fetchData.department, statistic: fetchData.statistic });

  // Map the selecteditem in case of Open and Edit.
  if (state.isEditForm && state.jsonConfig) {
   // Only run this code if we have not map selection, dont run it every time.
   // Key are updated to show the initial selected values in a multiselects
   let selectedBudgetVersion = dropdownSelectedData.budgetVersionsSelected;
   let budgetversionKey = formKeys.budgetversionDropdownkey;
   let budgetversionRadio = displayradioButtonsSeletionState.budgetversion;

   let selectedEntity = dropdownSelectedData.entitySelected;
   let entityKey = formKeys.entityDropdownKey;
   let entityRadio = displayradioButtonsSeletionState.entity;

   let selectedDepartment = dropdownSelectedData.departmentSelected;
   let departmentKey = formKeys.departmentDropdownKey;
   let departmentRadio = displayradioButtonsSeletionState.department;

   let selectedStatistic = dropdownSelectedData.statisticSelected;
   let statisticsKey = formKeys.statisticsDropdownKey;
   let statisticRadio = displayradioButtonsSeletionState.statistic;

   let selectedMeasure = dropdownSelectedData.measureSelected;
   let measureKey = formKeys.measureDropdownKey;
   let measureRadio = displayradioButtonsSeletionState.measure;

   let selectedPeriod = dropdownSelectedData.periodSelected;
   let periodKey = formKeys.periodDropdownKey;
   let periodRadio = displayradioButtonsSeletionState.period;

   let jsonConfigObj;
   if (dropdownDataState.budgetversionsList.length && !dropdownSelectedData.budgetVersionsSelected.length) {
    jsonConfigObj = state.jsonConfig?.budgetVersionID;
    selectedBudgetVersion = mapDropdownSelectionFromConfig(dropdownDataState.budgetversionsList, jsonConfigObj.configOptionDetail);
    budgetversionKey++;
    budgetversionRadio = jsonConfigObj.display.display.toString();
   }
   if (fetchData.entity.length && !dropdownSelectedData.entitySelected.length) {
    jsonConfigObj = state.jsonConfig.entity;
    selectedEntity = mapDropdownSelectionFromConfig(fetchData.entity, jsonConfigObj.configOptionDetail);
    entityKey++;
    entityRadio = jsonConfigObj.display.display.toString();
   }
   if (fetchData.department.length && !dropdownSelectedData.departmentSelected.length) {
    jsonConfigObj = state.jsonConfig.department;
    selectedDepartment = mapDropdownSelectionFromConfig(fetchData.department, jsonConfigObj.configOptionDetail);
    departmentKey++;
    departmentRadio = jsonConfigObj.display.display.toString();
   }
   if (fetchData.statistic.length && !dropdownSelectedData.statisticSelected.length) {
    jsonConfigObj = state.jsonConfig.statistics;
    selectedStatistic = mapDropdownSelectionFromConfig(fetchData.statistic, jsonConfigObj.configOptionDetail);
    statisticsKey++;
    statisticRadio = jsonConfigObj.display.display.toString();
   }

   if (dropdownDataState.reportPeriodList.length && !dropdownSelectedData.periodSelected.length) {
    jsonConfigObj = state.jsonConfig.periods;
    let keys = ["monthsFYTotal", "currentMonth", "currentFYTD", "quartersFYTotal", "currentQuarter", "currentQuarterFYTD", "fyTotal"];
    let keyCOdes = {
     monthsFYTotal: "Months and FY total",
     currentMonth: "Current month",
     currentFYTD: "Current FYTD",
     quartersFYTotal: "Quarters and FY total",
     currentQuarter: "Current quarter",
     currentQuarterFYTD: "Current quarter FYTD",
     fyTotal: "FY total",
    };
    let includedCode = [];
    keys.forEach((key) => {
     if (jsonConfigObj.periodTYpes[0][key] === true) {
      includedCode.push(keyCOdes[key]);
     }
    });
    selectedPeriod = dropdownDataState.reportPeriodList.filter((item) => {
     return includedCode.includes(item.code);
    });
    periodKey++;
    periodRadio = jsonConfigObj.display.display.toString();
   }

   if (dropdownDataState.reportMeasuresList.length && !dropdownSelectedData.measureSelected.length) {
    jsonConfigObj = state.jsonConfig.measureList;
    let keys = ["amount", "volumerate"];

    keys.forEach((key) => {
     if (jsonConfigObj.measureTypes[0][key] === true) {
      selectedMeasure.push(dropdownDataState.reportMeasuresList.find((item) => item.code.toLowerCase() === key.toLowerCase()));
     }
    });
    measureRadio = jsonConfigObj.display.display.toString();
   }

   setDropdownSelectedData({ ...dropdownSelectedData, budgetVersionsSelected: selectedBudgetVersion, entitySelected: selectedEntity, departmentSelected: selectedDepartment, statisticSelected: selectedStatistic, periodSelected: selectedPeriod, measureSelected: selectedMeasure });
   setformKeys({ ...formKeys, budgetversionDropdownkey: budgetversionKey, entityDropdownKey: entityKey, departmentDropdownKey: departmentKey, statisticsDropdownKey: statisticsKey, periodDropdownKey: periodKey, measureDropdownKey: measureKey });
   setDisplayradioButtonsSeletionState({ ...displayradioButtonsSeletionState, budgetversion: budgetversionRadio, entity: entityRadio, department: departmentRadio, statistic: statisticRadio, period: periodRadio, measure: measureRadio });
  }
 }, [masterData.Statistics, masterData.Departments, masterData.Entites, state.jsonConfig, dropdownDataState.budgetversionsList, dropdownDataState.reportPeriodList, dropdownDataState.reportMeasuresList]);

 const handledropdown = (selectedItem, id) => {
  const updatedState = { ...state, isSomethingChange: true };
  updatedState[id] = selectedItem;
  setState({
   ...state,
   ...updatedState,
  });
 };

 const handleCancel = (e) => {
  e.preventDefault();

  // TODO
  // // check need to show modal aur not..
  // 	if (!btnsValidation('saveAndClose')) {
  // 		toggleIsUnsaveModalOpen(true)
  // 	} else {
  // 		cancelForm();
  // 	}
  history.push({
   pathname: "/Reports/",
  });
 };

 const handleMultiselect = async (selectedItems, selectionStateName, radioSelectionStateName) => {
  let updatedisplayradioButtonsSeletionState = { ...displayradioButtonsSeletionState };
  if (selectedItems.length > 1 && displayradioButtonsSeletionState[radioSelectionStateName] === "1") {
   updatedisplayradioButtonsSeletionState[radioSelectionStateName] = "2"; // 2 = row , 1 = report header
  } else if (selectedItems.length < 2 && displayradioButtonsSeletionState[radioSelectionStateName] === "") {
   updatedisplayradioButtonsSeletionState[radioSelectionStateName] = "1";
  }

  // if All is selection, then select 'ROW' by default
  if (
   selectedItems.find((item) => {
    return item.id === "all";
   })
  ) {
   updatedisplayradioButtonsSeletionState[radioSelectionStateName] = "2";
  }
  // Select All by default in dimension on BV selection
  // Add set default display selection to row for all dimensions
  let itemFound;
  let updateddropdownSelectedData = { ...dropdownSelectedData };
  if (selectedItems.length >= 1 && selectionStateName === "budgetVersionsSelected") {
   itemFound = dimensionDropdownDataState.entity.find((item) => {
    return item.id === "all";
   });
   updateddropdownSelectedData.entitySelected = itemFound ? [itemFound] : [];
   updatedisplayradioButtonsSeletionState["entity"] = "2";

   itemFound = dimensionDropdownDataState.department.find((item) => {
    return item.id === "all";
   });
   updateddropdownSelectedData.departmentSelected = itemFound ? [itemFound] : [];
   updatedisplayradioButtonsSeletionState["department"] = "2";

   itemFound = dimensionDropdownDataState.statistic.find((item) => {
    return item.id === "all";
   });
   updateddropdownSelectedData.statisticSelected = itemFound ? [itemFound] : [];
   updatedisplayradioButtonsSeletionState["statistic"] = "2";

   updateddropdownSelectedData.periodSelected = [
    dropdownDataState.reportPeriodList.find((item) => {
     return item.code === "Months and FY total";
    }),
   ];
   updateddropdownSelectedData.measureSelected = [
    dropdownDataState.reportMeasuresList.find((item) => {
     return item.code === "Amount";
    }),
   ];
  }

  setDropdownSelectedData({
   ...updateddropdownSelectedData,
   [selectionStateName]: selectedItems,
  });
  setDisplayradioButtonsSeletionState({ ...displayradioButtonsSeletionState, ...updatedisplayradioButtonsSeletionState });
 };

 const handleRadio = (e, stateName) => {
  setDisplayradioButtonsSeletionState({ ...displayradioButtonsSeletionState, [stateName]: e.target.value });
 };

 const ValidateForm = (updatedState = state) => {
  const formErrors = initialStates.formErrors;
  let isValid = true;
  if (!updatedState.code && updatedState.formSubmitted) {
   isValid = false;
   formErrors.codeInvalidText = "Code is required";
   formErrors.codeInvalid = true;
  } else if (
   !state.isEditForm &&
   reportsCodeState.find((item) => {
    return item.toLowerCase() === updatedState.code.toLowerCase();
   })
  ) {
   isValid = false;
   formErrors.codeInvalidText = "Code already in use. Enter different code";
   formErrors.codeInvalid = true;
  }
  if (!updatedState.name && updatedState.formSubmitted) {
   isValid = false;
   formErrors.nameInvalidText = "Name is required";
   formErrors.nameInvalid = true;
  }
  setState({ ...updatedState, formErrors });
  return isValid;
 };

 const btnValidation = () => {
  let disabled = true;
  if (
   state.scenarioTypeSelectedItem?.itemTypeCode === "ST" &&
   dropdownSelectedData.budgetVersionsSelected.length &&
   dropdownSelectedData.entitySelected.length &&
   dropdownSelectedData.departmentSelected.length &&
   dropdownSelectedData.statisticSelected.length &&
   dropdownSelectedData.periodSelected.length &&
   dropdownSelectedData.measureSelected.length &&
   state.code &&
   state.name
  ) {
   disabled = false;
  }
  return disabled;
 };

 const handleRowOrderCheckbox = (name) => {
  let updatdRowOrderState = rowOrderStats[state.scenarioTypeSelectedItem?.itemTypeCode];
  let objectindex = updatdRowOrderState.findIndex((row) => {
   return row.name === name;
  });
  if (objectindex !== -1) {
   updatdRowOrderState[objectindex].checked = !updatdRowOrderState[objectindex].checked;
  }

  setRowOrderStats({ ...rowOrderStats, [rowOrderStats[state.scenarioTypeSelectedItem?.itemTypeCode]]: updatdRowOrderState });
 };

 const checkMeasurePeriodSelection = (selectionCode, selectionKeyName) => {
  return dropdownSelectedData[selectionKeyName].find((item) => item.code.toLowerCase() === selectionCode.toLowerCase()) ? true : false;
 };

 const getSelectedIds = (selectedKeyName) => {
  // toString is used becasue to selection may include 'all' along with other ids
  return [
   ...dropdownSelectedData[selectedKeyName].map((item) => {
    return item.id.toString();
   }),
  ];
 };
 const getReportJsonConfig = () => {
  let jsonConfig = {
   reportingDimensionsID: 0,
   scenarioType: state.scenarioTypeSelectedItem?.itemTypeCode,
   budgetVersionID: {
    configOptionDetail: getSelectedIds("budgetVersionsSelected"),
    display: {
     display: displayradioButtonsSeletionState.budgetversion,
     rowOrder: true,
     colOrder: true,
     rowOrderSeq: 0,
     colOrderSeq: 0,
    },
   },
   entity: {
    configOptionDetail: getSelectedIds("entitySelected"),
    display: {
     display: displayradioButtonsSeletionState.entity,
     rowOrder: true,
     colOrder: true,
     rowOrderSeq: 0,
     colOrderSeq: 0,
    },
   },
   department: {
    configOptionDetail: getSelectedIds("departmentSelected"),
    display: {
     display: displayradioButtonsSeletionState.department,
     rowOrder: true,
     colOrder: true,
     rowOrderSeq: 0,
     colOrderSeq: 0,
    },
   },
   statistics: {
    configOptionDetail: getSelectedIds("statisticSelected"),
    display: {
     display: displayradioButtonsSeletionState.statistic,
     rowOrder: true,
     colOrder: true,
     rowOrderSeq: 0,
     colOrderSeq: 0,
    },
   },
   glAccounts: {
    configOptionDetail: [0],
    display: {
     display: 0,
     rowOrder: true,
     colOrder: true,
     rowOrderSeq: 0,
     colOrderSeq: 0,
    },
   },
   jobCodes: {
    configOptionDetail: [0],
    display: {
     display: 0,
     rowOrder: true,
     colOrder: true,
     rowOrderSeq: 0,
     colOrderSeq: 0,
    },
   },
   payTypes: {
    configOptionDetail: [0],
    display: {
     display: 0,
     rowOrder: true,
     colOrder: true,
     rowOrderSeq: 0,
     colOrderSeq: 0,
    },
   },
   measureList: {
    measureTypes: [
     {
      amount: checkMeasurePeriodSelection("amount", "measureSelected"),
      volumerate: checkMeasurePeriodSelection("volumerate", "measureSelected"),
      display: {
       display: displayradioButtonsSeletionState.measure,
       rowOrder: true,
       colOrder: true,
       rowOrderSeq: 0,
       colOrderSeq: 0,
      },
     },
    ],
    display: {
     display: displayradioButtonsSeletionState.measure,
     rowOrder: true,
     colOrder: true,
     rowOrderSeq: 0,
     colOrderSeq: 0,
    },
   },
   periods: {
    periodTYpes: [
     {
      monthsFYTotal: checkMeasurePeriodSelection("Months and FY total", "periodSelected"),
      currentMonth: checkMeasurePeriodSelection("Current month", "periodSelected"),
      currentFYTD: checkMeasurePeriodSelection("Current FYTD", "periodSelected"),
      quartersFYTotal: checkMeasurePeriodSelection("Quarters and FY total", "periodSelected"),
      currentQuarter: checkMeasurePeriodSelection("Current quarter", "periodSelected"),
      currentQuarterFYTD: checkMeasurePeriodSelection("Current quarter FYTD", "periodSelected"),
      fyTotal: checkMeasurePeriodSelection("FY total", "periodSelected"),
      month: {
       monthLists: ["Jan", "Feb"],
       startMonth: "Jan",
       endMonth: "Dec",
       includeStartMonth: true,
       includeEndMonth: true,
       orderByDescending: true,
      },
      quarter: {
       quarterList: ["string"],
       startQuarter: "string",
       endQuarter: "string",
       orderByDescending: true,
      },
     },
    ],
    display: {
     display: displayradioButtonsSeletionState.period,
     rowOrder: true,
     colOrder: true,
     rowOrderSeq: 0,
     colOrderSeq: 0,
    },
   },
  };

  return JSON.stringify(jsonConfig);
 };

 const handleSubmit = async (e, actionType) => {
  const updatedState = { ...state, formSubmitted: true, showNotification: false };
  const isValid = ValidateForm(updatedState);
  if (isValid) {
   var reportConfig = {
    code: state.code,
    value: state.code,
    description: state.description,
    comments: state.name,
    name: state.name,
    reportProcessingStatus: "",
    reportDetails: "",
    reportData: "",
    relatedPath: "",
    reportPath: "",
    jsonConfig: getReportJsonConfig(),
    userProfileID: 1,
    reportStatus: "PROCESSING",
    scenarioType: state.scenarioTypeSelectedItem?.itemTypeCode,
    actionType: state.isEditForm ? "UPDATE" : "ADD",
   };
   let updatedStates;
   switch (actionType) {
    case "Save":
     updatedStates = await saveReportConfig(reportConfig);
     break;
    case "SaveAs":
     setSaveAsModalReportState({
      ...reportConfig,
      reportId: undefined,
      actionType: state.isEditForm ? "ADD" : "ADD",
     });
     setState({
      ...state,
      showSaveAsModal: true,
     });
     break;
    case "SaveAndClose":
     await saveReportConfig(reportConfig, true);
     break;
    default:
     break;
   }
   return updatedStates;
  } else {
   return null;
  }
 };

 const saveReportConfig = async (reportConfig, closeForm = false) => {
  // if user is creating a new budget, SaveBudgetVersion, else if editing an existing budget, UpdateBudgetVersion
  const response = await saveReportConfigService(reportConfig);
  const reportConfigID = reportConfig.actionType === "UPDATE" ? match.params.id : response.payload;
  const responseMessage = reportConfig.actionType === "UPDATE" ? "Report updated." : "Report saved.";
  if (!response.success) {
   setState({ ...state, notificationType: "error", notificationTitle: responseMessage });
   return;
  }

  if (closeForm) {
   history.push({
    pathname: "/Reports",
    state: { notification: responseMessage },
   });
  } else {
   // if we aren't closing the form, update the header
   // and update the page state to show the success notification
   setHeader(state.code + " : " + state.description);
   var currentdate = new Date();
   let month = currentdate.getUTCMonth() + 1 >= 10 ? currentdate.getUTCMonth() + 1 : "0" + (currentdate.getUTCMonth() + 1);
   var datetime = currentdate.getUTCFullYear() + "-" + month + "-" + currentdate.getUTCDate() + "T" + currentdate.getUTCHours() + ":" + currentdate.getUTCMinutes() + ":" + currentdate.getUTCSeconds() + "." + currentdate.getUTCMilliseconds();

   const updatedStates = {
    ...state,
    id: reportConfigID, //Set currenlty Saved Budgetversion id in state , to use it while redirecting to the forecast page.
    formSubmitted: false,
    showNotification: true,
    notificationType: "success",
    notificationTitle: responseMessage,
    isEditForm: true,
    isSomethingChange: false,
    updateDateTime: convertUTCDateToLocalDateLocalString(datetime + "", mydateFormat, true),
   };
   setReportsCodeState([...reportsCodeState, state.code]);
   setState({ ...updatedStates });
   history.push({
    pathname: `/Report/${reportConfigID}`,
   });

   return null;
  }
 };

 const closeSaveASModal = () => {
  setState({ ...state, showSaveAsModal: false });
 };

 return (
  <>
   <PageHeader id={"report-form-header-key"} key={"report-form-header-key"} heading={xheader} icon={<Favorite16 />} breadCrumb={breadCrumb} notification={location?.state?.notification} notificationKind={location?.state?.notificationKind} />

   <div className="bx--row form-row">
    <div className="bx--col-lg-3">
     <TextInput
      id="add_edit_report_code"
      type="text"
      labelText="Code"
      onChange={(e) => handleChange(e, "code")}
      //invalid={state.isEditForm ? false : state.formErrors.codeError != "" ? true : false}
      invalid={state.isEditForm ? false : state.formErrors.codeInvalid}
      invalidText={state.formErrors.codeInvalidText}
      value={state.code}
      disabled={state.isEditForm}
      maxLength={15}
     />
    </div>
    <div className="bx--col-lg-5">
     <TextInput
      id="add_edit_report_name"
      type="text"
      labelText="Name"
      onChange={(e) => handleChange(e, "name")}
      //invalid={state.formErrors.descriptionError != "" ? true : false}
      //invalidText={state.formErrors.descriptionError}
      value={state.name}
      maxLength={40}
     />
    </div>
   </div>
   <div className="bx--row form-row">
    <div className="bx--col-lg-8">
     <TextInput id="add_edit_report_comment" type="text" labelText="Description (optional)" onChange={(e) => handleChange(e, "description")} value={state.description} maxLength={80} />
    </div>
   </div>
   <div className="bx--row form-row">
    <div className="bx--col-lg-3">
     {dropdownDataState.scenarioTypes?.length ? (
      <Dropdown
       id="scenarioTypeId"
       type="default"
       ariaLabel={"ScenarioType"}
       items={dropdownDataState.scenarioTypes.map((data) => ({ ...data, itemTypeValueCapitalize: data.itemTypeValue.charAt(0).toUpperCase() + data.itemTypeValue.slice(1).toLowerCase() }))}
       itemToString={(item) => (item ? item.itemTypeValueCapitalize : "")}
       value={(item) => (item ? item.itemTypeId : "")}
       titleText="Scenario type"
       label="Choose one"
       onChange={(e) => handledropdown(e.selectedItem, "scenarioTypeSelectedItem")}
       selectedItem={state?.scenarioTypeSelectedItem ? { ...state.scenarioTypeSelectedItem, itemTypeValueCapitalize: state?.scenarioTypeSelectedItem?.itemTypeValue.charAt(0).toUpperCase() + state?.scenarioTypeSelectedItem?.itemTypeValue.slice(1).toLowerCase() } : state.scenarioTypeSelectedItem}
      />
     ) : (
      <DropdownSkeleton />
     )}
    </div>

    <div className="bx--col-lg-4 report-multiselect" style={{ maxWidth: "400px" }}>
     {/* <span>Budget version</span> */}
     <MultiSelectBudgetVersionModal
      key={formKeys.budgetversionDropdownkey}
      id={"report-multiselect-budget-version"}
      name={"Budget version"}
      gridData={girdsDataState.budgetversionsList}
      multiselectData={dropdownDataState.budgetversionsList}
      invalidText="Invalid Selection"
      itemToString={(item) => (item ? item.name : "")}
      placeholder={"Choose"}
      onChange={(e) => handleMultiselect(e.selectedItems, "budgetVersionsSelected", "budgetversion")}
      initialSelectedItems={dropdownDataState.budgetversionsList.filter((item) => {
       return dropdownSelectedData.budgetVersionsSelected.find((selectedItem) => selectedItem.id === item.id);
      })}
     />
    </div>
    <div className={"bx--col-lg-1 report-bv-search-icon-tooltip-container"}>
     <div className="report-bv-search-icon">
      <TooltipIcon tooltipText={"Some Text"} direction={"top"}>
       <Information16 />
      </TooltipIcon>
     </div>
    </div>
    <div className="bx--col-lg-3">
     <span>Display</span>
     <RadioButtonGroup id="rdg_report_BudegetVersion_display" className={"report-radio-button-group"} name={"budgetVersion-radioButton-group"} orientation="vertical" valueSelected={displayradioButtonsSeletionState.budgetversion}>
      {reportDisplayOption.map((radioButton) => {
       return (
        <RadioButton
         id={"rd_BV" + radioButton.itemTypeValue}
         key={"rd_BV" + radioButton.itemTypeValue}
         value={radioButton.itemTypeValue}
         disabled={radioButton.itemTypeValue == 1 ? (dropdownSelectedData?.budgetVersionsSelected?.length > 1 ? true : false) : false}
         labelText={
          <>
           <span style={{ marginRight: "10px" }}> {radioButton.itemTypeDisplayName} </span>
           {radioButton.itemTypeValue == 1 ? (
            <TooltipIcon align="start" tooltipText={"Filters the entire report on this item. Shows the item in the report header."} direction={"top"}>
             <Information16 />
            </TooltipIcon>
           ) : null}
          </>
         }
         onClick={(e) => {
          handleRadio(e, "budgetversion");
         }}
        />
       );
      })}
     </RadioButtonGroup>
    </div>
   </div>

   <ReportCopyRenameModal closeCopyRenameModalWithNotification={saveReportConfig} modalType={"saveAs"} selectedReportValues={saveAsModalReportState} isOpen={state.showSaveAsModal} closeCopyRenameModal={closeSaveASModal} allReportsCodes={reportsCodeState} />

   {state.scenarioTypeSelectedItem?.itemTypeCode === "ST" && dropdownSelectedData.budgetVersionsSelected.length ? (
    <>
     <div className="bx--row form-row">
      <div className="bx--col-lg report-multiselect">
       {/* <span> Entity</span> */}

       <MultiSelectDimensionWithModal
        key={formKeys.entityDropdownKey}
        id={"report-multiselect-entities"}
        name={"Entity"}
        gridData={entityGroupedData.data}
        multiselectData={dimensionDropdownDataState.entity}
        individualMembersGridData={masterData.Entites}
        invalidText="Invalid Selection"
        itemToString={(item) =>
         item ? (
          item.isGroup || item.isHierarchy ? (
           <>
            <strong> {"*" + item.code + " " + item.name}</strong>
           </>
          ) : (
           item.code + " " + item.name
          )
         ) : (
          ""
         )
        }
        placeholder={"Entity"}
        onChange={(e) => handleMultiselect(e.selectedItems, "entitySelected", "entity")}
        selectionFeedback="top-after-reopen"
        handleRadioSelection={(e) => {
         handleRadio(e, "entity");
        }}
        radioSelectedValue={displayradioButtonsSeletionState.entity}
        initialSelectedItems={dimensionDropdownDataState.entity.filter((item) => {
         return dropdownSelectedData.entitySelected.find((selectedItem) => selectedItem.id === item.id);
        })}
        reportDisplayOption={reportDisplayOption}
        isGroupedData={true}
       />
      </div>

      <div className="bx--col-lg report-multiselect">
       {/* <span> Department</span> */}
       {/* <TooltipIcon tooltipText={"In the dropdown, select a group (does not select the members in the group) or select group members."} direction={"top"}>
        <Information16 />
       </TooltipIcon> */}
       <MultiSelectDimensionWithModal
        key={formKeys.departmentDropdownKey}
        id={"report-multiselect-departments"}
        name={"Department"}
        gridData={departmentGroupedData.data}
        multiselectData={dimensionDropdownDataState.department}
        individualMembersGridData={masterData.Departments}
        invalidText="Invalid Selection"
        itemToString={(item) =>
         item ? (
          item.isGroup || item.isHierarchy ? (
           <>
            <strong> {"*" + item.code + " " + item.name}</strong>
           </>
          ) : (
           item.code + " " + item.name
          )
         ) : (
          ""
         )
        }
        placeholder={"Department"}
        onChange={(e) => handleMultiselect(e.selectedItems, "departmentSelected", "department")}
        selectionFeedback="top-after-reopen"
        handleRadioSelection={(e) => {
         handleRadio(e, "department");
        }}
        radioSelectedValue={displayradioButtonsSeletionState.department}
        initialSelectedItems={dimensionDropdownDataState.department.filter((item) => {
         return dropdownSelectedData.departmentSelected.find((selectedItem) => selectedItem.id === item.id);
        })}
        reportDisplayOption={reportDisplayOption}
        isGroupedData={true}
       />
      </div>
      <div className="bx--col-lg report-multiselect">
       {/* <span> Statistic</span> */}
       {/* <TooltipIcon tooltipText={"In the dropdown, select a group (does not select the members in the group) or select group members."} direction={"top"}>
        <Information16 />
       </TooltipIcon> */}
       <MultiSelectDimensionWithModal
        key={formKeys.statisticsDropdownKey}
        id={"report-multiselect-statistic"}
        name={"Statistics"}
        gridData={statisticGroupedData.data}
        multiselectData={dimensionDropdownDataState.statistic}
        individualMembersGridData={masterData.Statistics}
        invalidText="Invalid Selection"
        itemToString={(item) =>
         item ? (
          item.isGroup || item.isHierarchy ? (
           <>
            <strong> {"*" + item.code + " " + item.name}</strong>
           </>
          ) : (
           item.code + " " + item.name
          )
         ) : (
          ""
         )
        }
        placeholder={"Statistic"}
        onChange={(e) => handleMultiselect(e.selectedItems, "statisticSelected", "statistic")}
        selectionFeedback="top-after-reopen"
        handleRadioSelection={(e) => {
         handleRadio(e, "statistic");
        }}
        radioSelectedValue={displayradioButtonsSeletionState.statistic}
        initialSelectedItems={dimensionDropdownDataState.statistic.filter((item) => {
         return dropdownSelectedData.statisticSelected.find((selectedItem) => selectedItem.id === item.id);
        })}
        reportDisplayOption={reportDisplayOption}
        isGroupedData={true}
       />
      </div>
     </div>

     <div className={"bx--row"}>
      <div className="bx--col-lg-3 report-multiselect" style={{ maxWidth: "294.52px" }}>
       {/* <span>Period</span> */}
       <MultiSelect
        sortItems={() => {
         return dropdownDataState.reportPeriodList;
        }}
        id={"report-period-multiselect"}
        key={formKeys.periodDropdownKey}
        items={dropdownDataState.reportPeriodList}
        invalidText="Invalid Selection"
        itemToString={(item) => (item ? item.code : "")}
        placeholder={"Period"}
        onChange={(e) => handleMultiselect(e.selectedItems, "periodSelected", "period")}
        selectionFeedback="top-after-reopen"
        //items={props.multiselectData}
        //invalid={props?.invalid}
        direction="bottom"
        initialSelectedItems={dropdownSelectedData.periodSelected}
        label={"Period"}
        labelText={"Period"}
        titleText={"Period"}
        light={false}
        locale="en"
        title={false}
        type="default"
        ariaLabel={"Period"}
        aira-label={"Period"}
       />
      </div>
      <div className="bx--col-lg-2 report-period-column">
       <span>Display</span>
       <RadioButtonGroup id="rdg_report_period_display" className={"report-radio-button-group"} name={"period-radiobutton-group"} orientation="vertical" valueSelected={displayradioButtonsSeletionState.period}>
        {reportDisplayOption.map((radioButton) => {
         return (
          <RadioButton
           id={"rd_period" + radioButton.itemTypeValue}
           key={"rd_period" + radioButton.itemTypeValue}
           value={radioButton.itemTypeValue}
           disabled={radioButton.itemTypeValue == 1 ? (dropdownSelectedData?.periodSelected?.length > 1 ? true : false) : false}
           labelText={
            <>
             <span style={{ marginRight: "10px" }}> {radioButton.itemTypeDisplayName} </span>
             {radioButton.itemTypeValue == 1 ? (
              <TooltipIcon align="start" tooltipText={"Filters the entire report on this item. Shows the item in the report header."} direction={"top"}>
               <Information16 />
              </TooltipIcon>
             ) : null}
            </>
           }
           onClick={(e) => {
            handleRadio(e, "period");
           }}
          />
         );
        })}
       </RadioButtonGroup>
      </div>

      <div className="bx--col-lg-3 report-multiselect" style={{ maxWidth: "294.52px" }}>
       {/* <span>Measure</span> */}
       <MultiSelect
        sortItems={() => {
         return dropdownDataState.reportMeasuresList;
        }}
        id={"report-measure-multiselect"}
        key={formKeys.measureDropdownKey}
        items={dropdownDataState.reportMeasuresList}
        invalidText="Invalid Selection"
        itemToString={(item) => (item ? item.code : "")}
        placeholder={"Measure"}
        onChange={(e) => handleMultiselect(e.selectedItems, "measureSelected", "measure")}
        initialSelectedItems={dropdownSelectedData.measureSelected}
        selectionFeedback="top-after-reopen"
        //items={props.multiselectData}
        //invalid={props?.invalid}
        direction="bottom"
        //initialSelectedItems={[]}
        label={"Measure"}
        labelText={"Measure"}
        titleText={"Measure"}
        light={false}
        locale="en"
        title={false}
        type="default"
        selectedItems={[]}
        ariaLabel={"Measure"}
        aria-label={"Measure"}
       />
      </div>
      <div className="bx--col-lg-2 report-measure-column">
       <span>Display</span>
       <RadioButtonGroup id="rdg_report_measure_display" className={"report-radio-button-group"} name={"measure-radiobutton-group"} orientation="vertical" valueSelected={displayradioButtonsSeletionState.measure}>
        {reportDisplayOption.map((radioButton) => {
         return (
          <RadioButton
           id={"rd_measure" + radioButton.itemTypeValue}
           key={"rd_measure" + radioButton.itemTypeValue}
           value={radioButton.itemTypeValue}
           disabled={radioButton.itemTypeValue == 1 ? (dropdownSelectedData?.measureSelected?.length > 1 ? true : false) : false}
           labelText={
            <>
             <span style={{ marginRight: "10px" }}> {radioButton.itemTypeDisplayName} </span>
             {radioButton.itemTypeValue == 1 ? (
              <TooltipIcon align="start" tooltipText={"Filters the entire report on this item. Shows the item in the report header."} direction={"top"}>
               <Information16 />
              </TooltipIcon>
             ) : null}
            </>
           }
           onClick={(e) => {
            handleRadio(e, "measure");
           }}
          />
         );
        })}
       </RadioButtonGroup>
      </div>
     </div>

     <div className={"bx--row"}>
      <div className="bx--col-lg-2">
       <div className={"bx--row"} style={{ paddingBottom: "0px" }}>
        <div className="bx--col-lg" style={{ float: "top" }}>
         <div className={"report-row-order-icon"}>
          <ArrowDown16 key={"arrowDownKey"} />
         </div>
         <div className={"report-row-order-icon"}>
          <ArrowUp16 key={"arrowUpKey"} />
         </div>
        </div>
       </div>

       <div className={"bx--row"} style={{ marginTop: "-6px" }}>
        <div className="bx--col-lg">
         <DataTable
          key={state.datatableKey}
          rows={[]}
          headers={[]}
          render={({ rows, headers, getHeaderProps, defaultProps, getRowProps, getTableProps, getSelectionProps, selectedRows, getBatchActionProps, OverflowMenuProps }) => (
           <TableContainer key={"rowOrderTableContainer"} className="" style={{ minWidth: "0px" }}>
            {
             <>
              <Table key={state.datatableKey + "RowOrderTable"} id={state.datatableKey + "RowOrderTable"} className="budget-version-table" size="compact" {...getTableProps}>
               <TableHead key={state.datatableKey + "head"}>
                <TableRow key={"rowOrderHeaderRowKey"}>
                 <TableHeader key={state.datatableKey + "RowOrderHeader"} id={state.datatableKey + "RowOrderHeader"}>
                  {"Row order"}
                 </TableHeader>
                </TableRow>
               </TableHead>
               <TableBody key={state.datatableKey + "body"}>
                {rowOrderStats[state.scenarioTypeSelectedItem?.itemTypeCode].map((row) =>
                 row.show ? (
                  <>
                   <TableRow
                    id={row.name + "row"}
                    key={row.name + "row"}
                    onClick={(e) => {
                     handleRowOrderCheckbox(row.name);
                    }}
                   >
                    <TableCell id={row.name + "CellKey"} key={row.name + "CellKey"}>
                     <Checkbox
                      id={row.name + "checkbox"}
                      key={row.name + "checkbox"}
                      labelText={row.name}
                      value={row.name}
                      checked={row.checked}
                      onClick={(e) => {
                       console.log(e);
                      }}
                     ></Checkbox>
                    </TableCell>
                   </TableRow>
                  </>
                 ) : null
                )}
               </TableBody>
              </Table>
             </>
            }
           </TableContainer>
          )}
         />
        </div>
       </div>
      </div>
     </div>

     <div className={"bx--row action-row"}>
      <div className="bx--col-lg-2 report-preview-button-container">
       <Button id="btnPreviewReport" className="bx--btn--tertiary" type="submit">
        Preview layout
       </Button>
      </div>
      <div className="bx--col-lg-3 ">
       <Dropdown
        id="report-format-dropdown"
        type="default"
        items={[
         { id: 1, name: "Item 1" },
         { id: 2, name: "Item 2" },
        ]}
        itemToString={(item) => (item ? item.name : "")}
        value={(item) => (item ? item.id : "")}
        titleText="Run report"
        label="Choose a format option"
        ariaLabel={"Run report"}
        //onChange={(e) => handledropdown(e.selectedItem, "scenarioTypeSelectedItem")}
        //selectedItem={state?.scenarioTypeSelectedItem ? { ...state.scenarioTypeSelectedItem, itemTypeValueCapitalize: state?.scenarioTypeSelectedItem?.itemTypeValue.charAt(0).toUpperCase() + state?.scenarioTypeSelectedItem?.itemTypeValue.slice(1).toLowerCase() } : state.scenarioTypeSelectedItem}
        //selectedItem={[]}
       />
      </div>
      <div className="bx--col-lg-1 run-report-dropdown-infoIcon-container">
       <TooltipIcon tooltipText={"Some Text"} direction={"top"}>
        <Information16 />
       </TooltipIcon>
      </div>
      <div className="bx--col-lg-5" style={{ paddingTop: "38px" }}>
       <span>{state.isEditForm ? state.updateDateTime : ""}</span>
      </div>
     </div>
    </>
   ) : null}

   <div className="bx--row action-row">
    <div className="bx--col-md-8">{state.showNotification ? <InlineNotification title={state.notificationTitle} kind={state.notificationType} lowContrast="true" notificationType="inline" className="add-budgetversion-notification" iconDescription="Close Notification" /> : ""}</div>
    <div className="bx--col-md-8">
     <Button id="btnCancel" className="bx--btn--secondary" type="submit" onClick={handleCancel}>
      Cancel
     </Button>
     <Button
      id="btnSave"
      className="bx--btn--tertiary without-left-border"
      renderIcon={Save16}
      type="submit"
      onClick={(e) => handleSubmit(e, "Save")}
      //disabled={state.calculationStatus === "Calculating" || state.calculationStatus === "Forecasting" || btnsValidation("save")}
      disabled={btnValidation()}
     >
      Save
     </Button>
     <Button
      id="btnSaveAs"
      className="bx--btn--tertiary without-left-border"
      type="submit"
      onClick={(e) => handleSubmit(e, "SaveAs")}
      //disabled={state.calculationStatus === "Calculating" || state.calculationStatus === "Forecasting" || btnsValidation("saveAs")}
      disabled={btnValidation()}
     >
      Save as
     </Button>
     <Button
      id="btnSaveNClose"
      className="bx--btn--primary without-left-border"
      type="submit"
      onClick={(e) => handleSubmit(e, "SaveAndClose")}
      //disabled={state.calculationStatus === "Calculating" || state.calculationStatus === "Forecasting" || btnsValidation("saveAndClose")}
      disabled={btnValidation()}
     >
      Save and close
     </Button>
    </div>
   </div>
  </>
 );
};

export default ReportForm;
