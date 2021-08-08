import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, TooltipIcon, Dropdown, TextInput, MultiSelect } from "carbon-components-react";
import { Information16, Add20, Subtract20 } from "@carbon/icons-react";
import { updateForecast } from "../../../../core/_actions/ForecastActions";
import { transformBudgetVersionData, getBudgetVersionDataForDropDowns, 
GetSortedPayTypeByGroups, GetSortedEntityByGroups, GetSortedJobCodeByGroups, 
GetSortedDepartmentByHierarchyGroupe } 
from "../../../../helpers/DataTransform/transformData";
import ItemsMonthsImport from "../../MasterData/itemsMonths";
import SingleSelectModal from "../../../shared/single-select/single-select-with-modal";
import { scenario_type_Codes } from "../Data/scenario_type_codes";
import { CheckRunForecastButton } from "../ValidateForecast";
const StaffingPayTypeDistributionForecastMethodSection = ({ sectionIndex , dimensionGroupedData}) => {
 const initialLocalStates = {
  pageConfig: {
   columnWidth: 4,
   infoIconCssClass: "checkBox-info-Icon-large",
  },
  searchedData: {
   budgetVersion: [],
   entity: [],
   department: [],
   jobCode: [],
   payType: [],
   productivePayTypeData: [],
   nonProductivePayTypeData: [],
  },
  orignalData: {
   budgetVersion: [],
   entity: [],
   department: [],
   jobCode: [],
   payType: [],
   productivePayTypeData: [],
   nonProductivePayTypeData: [],
  },
  dimnesionDetails: {
   budgetVersion: {
    name: "text",
    code: "value",
   },
   entity: {
    name: "entityName",
    code: "entityCode",
   },
   department: {
    name: "departmentName",
    code: "departmentCode",
   },
   jobCode: {
    name: "jobCodeName",
    code: "jobCodeCode",
   },
   payType: {
    name: "payTypeName",
    code: "payTypeCode",
   },
   productivePayTypeData: {
    name: "payTypeName",
    code: "payTypeCode",
   },
   nonProductivePayTypeData: {
    name: "payTypeName",
    code: "payTypeCode",
   },
   
  },
 };

 const ItemMonthsUpdated = [{ id: "notSelected", value: "notSelected", text: "Choose one" }, ...ItemsMonthsImport];
 const state = useSelector((state) => state.ForecastReducer);
 const budgetVersionData = useSelector((state) => state.BudgetVersions.list);
 const masterData = useSelector((state) => state.MasterData);
 const [monthItemState, setMonthItemState] = useState({ ItemsMonths: ItemMonthsUpdated });
 const [localState, setLocalState] = useState(initialLocalStates);
 const [payTypeSelectedValueState, setPayTypeSelectedValueState] = useState({});

 const dispatch = useDispatch();
 let timeout;
 let itemSelected = false;
 const userdateformat = useSelector((state) => state.systemSettings.fiscalStartMonthDateFormat);
 let mydateFormat = useSelector((state) => state.MasterData.ItemDateFormat.find(({ itemTypeValue }) => itemTypeValue === userdateformat));
 if (typeof mydateFormat === "undefined") {
  mydateFormat = "LLLL";
 } else {
  mydateFormat = mydateFormat.itemTypeCode;
 }

 // Data Tranfromation is required becauase Data is not save in Array, in Store.
 const BudgetVersionDataForModalGrid = transformBudgetVersionData(budgetVersionData, mydateFormat);
 // Transform Data , get only field which required to populate in dropdown
 const BudgetVersionDataForDropDown = getBudgetVersionDataForDropDowns(budgetVersionData);

 const handleChange = (value, controlId, sourceIndex, rowType) => {
  const UpdatedforecastSections = [...state.forecastSections];
  let updatedSource;
  if (sourceIndex !== undefined) {
   updatedSource = [...UpdatedforecastSections[sectionIndex].source[rowType]];

   if (controlId === "budgetversion_code") {
    // get Timeperiod of budget version by using its code
    const BudgerVersionTimePeriod = BudgetVersionDataForModalGrid.find((item) => item.code === value)?.timeperiodobj;
    // Get Start and End month Id from the BV timePeroid
    const startMonthValue = masterData.ItemMonths.find((item) => item.itemTypeID === BudgerVersionTimePeriod?.fiscalStartMonthID?.itemTypeID)?.itemTypeValue;

    const endMonthValue = masterData.ItemMonths.find((item) => item.itemTypeID === BudgerVersionTimePeriod?.fiscalEndMonthID?.itemTypeID)?.itemTypeValue;

    // Here populate Fiscal Years month dropdown, set first item as the start month of the selected budget version.
    if (startMonthValue) {
     console.log("startMonthValue", startMonthValue);

     let startMonthIndex = ItemsMonthsImport.findIndex((month) => month.value === startMonthValue);
     let ItemsMonthsImportCopy = [...ItemsMonthsImport];
     console.log(startMonthIndex);
     setMonthItemState({ ...monthItemState, ItemsMonths: [{ id: "notSelected", value: "notSelected", text: "Choose one" }, ...ItemsMonthsImportCopy.splice(startMonthIndex, ItemsMonthsImportCopy.length - startMonthIndex), ...ItemsMonthsImportCopy.splice(0, startMonthIndex)] });
    } else {
     setMonthItemState({ ...monthItemState, ItemsMonths: ItemMonthsUpdated });
    }
    updatedSource[sourceIndex]["startMonth"] = startMonthValue === undefined ? "notSelected" : startMonthValue;
    updatedSource[sourceIndex]["endMonth"] = endMonthValue === undefined ? "notSelected" : endMonthValue;
   }

   updatedSource[sourceIndex][controlId] = value;
   UpdatedforecastSections[sectionIndex].source[rowType] = [...updatedSource];
  } else {
   updatedSource = JSON.parse(JSON.stringify(UpdatedforecastSections[sectionIndex].source[rowType]));
   updatedSource[controlId] = value;
   UpdatedforecastSections[sectionIndex].source[rowType] = JSON.parse(JSON.stringify(updatedSource));
  }
  dispatch(
   updateForecast({
    ...state,
    forecastSections: [...UpdatedforecastSections],
   })
  );

  // Check for Enable/Disable of Run Forecast Button
  CheckRunForecastButton();
  itemSelected = true;
 };

 const handleSearchFilter = (inputText, dimensionName) => {
  if (timeout) {
   clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
   let searcedData = localState.searchedData;
   let orignalData = localState.orignalData;
   let dimensionDetail = localState.dimnesionDetails;
   let searchedResult = [];
   if (inputText && !itemSelected) {
    searchedResult = orignalData[dimensionName].filter((data) => {
     let CodeAndName = data[dimensionDetail[dimensionName].code] + " " + data[dimensionDetail[dimensionName].name];
     return data[dimensionDetail[dimensionName].name].toLowerCase().includes(inputText.toLowerCase()) || data[dimensionDetail[dimensionName].code].toLowerCase().includes(inputText.toLowerCase()) || CodeAndName.toLowerCase().includes(inputText.toLowerCase());
    });
   } else {
    searchedResult = [...orignalData[dimensionName]];
   }
   searcedData[dimensionName] = [...searchedResult];
   setLocalState({
    ...localState,
    searchedData: searcedData,
   });
   itemSelected = false;
  }, 500);
 };

 useEffect(() => {
  let updatePageConfig = localState.pageConfig;
  if (state.forecastSections[sectionIndex].forecastType !== "copy_staffing_hours" && state.forecastSections[sectionIndex].forecastType !== "annualize_staffing_hours" && state.forecastSections[sectionIndex].forecastType !== "copy_staffing_dollars" && state.forecastSections[sectionIndex].forecastType !== "annualize_staffing_dollars") {
   updatePageConfig.columnWidth = 4;
   updatePageConfig.infoIconCssClass = "checkBox-info-Icon-large";
  } else {
   updatePageConfig.columnWidth = 3;
   updatePageConfig.infoIconCssClass = "checkBox-info-Icon";
  }

  let fetchData = {
   budgetVersion: getBudgetVersionDataForDropDowns(budgetVersionData),
   entity: GetSortedEntityByGroups(masterData.Entites),
   department: GetSortedDepartmentByHierarchyGroupe(masterData.Departments),
   jobCode: GetSortedJobCodeByGroups(masterData.JobCodes),
   payType: GetSortedPayTypeByGroups(masterData.PayTypes),
   productivePayTypeData : GetSortedPayTypeByGroups(masterData.PayTypes).filter((item) => {
    return item.isGroup === true;
   }) ,
   nonProductivePayTypeData : GetSortedPayTypeByGroups(masterData.PayTypes).filter((item) => {
    return item.isGroup === true;
   })
  };

  let searchedData = localState.searchedData;
  let orignalData = localState.orignalData;
  let dimensionNames = ["budgetVersion", "entity", "department", "jobCode", "payType" , "productivePayTypeData" , "nonProductivePayTypeData"];
  for (let i = 0; i < dimensionNames.length; i++) {
   if (dimensionNames[i] === "payType") {
    searchedData[dimensionNames[i]] = fetchData[dimensionNames[i]].map((payType) => {
     return {
      name: payType.payTypeCode + " " + payType.payTypeName,
      id: payType.payTypeID,
      isGroup: payType.isGroup,
     };
    });
   } else {
    searchedData[dimensionNames[i]] = [...fetchData[dimensionNames[i]]];
    orignalData[dimensionNames[i]] = [...fetchData[dimensionNames[i]]];
   }
  }
  setLocalState({ ...localState, pageConfig: updatePageConfig, searchedData: searchedData, orignalData: orignalData });
 }, [masterData]);

 const handleCheckBox = (e) => {
  const payTypeSelected = [];
  const obj = {};
  e.selectedItems.forEach((item) => {
   obj[item.id] = true;
  });
  setPayTypeSelectedValueState({ ...payTypeSelectedValueState, ...obj });

  Object.entries(obj).map((item) => {
   payTypeSelected.push(item[0]);
  });
  console.log("payTypeSelected", payTypeSelected);

  const UpdatedforecastSections = [...state.forecastSections];
  let updatedSource;
  updatedSource = JSON.parse(JSON.stringify(UpdatedforecastSections[sectionIndex].source["dimensionRow"]));
  updatedSource["excludedPayType"] = [...payTypeSelected];
  UpdatedforecastSections[sectionIndex].source["dimensionRow"] = JSON.parse(JSON.stringify(updatedSource));
  dispatch(
   updateForecast({
    ...state,
    forecastSections: [...UpdatedforecastSections],
   })
  );
 };

 return state.forecastSections[sectionIndex].forecastType === "staffing_pay_type_distribution" ? (
  <>
   <div className={"section-container"}>
    <div className={"bx--row"}>
     <div className={"bx--col-lg"}>
      <div className={"bx--row"}>
       <div className={"bx--col-lg-2"}>
        <strong> Pay type distribution </strong>
       </div>
       <div className={"bx--col-lg-3 average-wage-rate-info-icon"}>
        <TooltipIcon direction="top" tooltipText="Define the pay type distribution to use for staffing. Adjust row values using the staffing forecast data table
         row overflow menus. When there is no actual data table row match in the forecast data table, we use a default value from System settings. For each job code,
         productive pay types must sum to 100%" align="start">
         <Information16 />
        </TooltipIcon>
       </div>

       <div className={"bx--col-lg-2"}>
        <strong> Source months </strong>
       </div>
       <div className={"bx--col-lg-1 source-month-info-icon"}>
        <TooltipIcon direction="top" tooltipText="The selected months will be used to calculate the budget version's pay type distributions." align="start">
         <Information16 />
        </TooltipIcon>
       </div>
      </div>

      <div className={"bx--row"}>
       <div className={"bx--col-lg-5"}>{"Source budget version"}</div>
       <div className={"bx--col-lg-2"}>{"Start month"}</div>
       <div className={"bx--col-lg-2"}>{"End month"}</div>
      </div>

      {state.forecastSections[sectionIndex].source.dataRow.map((source, sourceIndex) => {
       return (
        <div className={"bx--row"}>
         {BudgetVersionDataForDropDown ? (
          <div className={"bx--col-lg-5"}>
           <SingleSelectModal
            id={"budgetVersion-" + sectionIndex + "-" + sourceIndex}
            data={localState.searchedData.budgetVersion}
            gridData={BudgetVersionDataForModalGrid}
            name="Budget version"
            invalidText={state.forecastSections[sectionIndex]?.sectionValidation?.budgetversion[sourceIndex]?.invalidText}
            invalid={state.forecastSections[sectionIndex]?.sectionValidation?.budgetversion[sourceIndex]?.invalid}
            itemToString={(item) => (item ? item.text : "")}
            selectedItem={BudgetVersionDataForDropDown?.find((x) => x.value === source?.budgetversion_code)}
            onChange={(e) => handleChange(e.selectedItem?.value, "budgetversion_code", sourceIndex, "dataRow")}
            hideGroupsToggle={true}
            onInputChange={(inputText) => handleSearchFilter(inputText, "budgetVersion")}
            hideGroups={false}
           />
          </div>
         ) : null}
         <div className={"bx--col-lg-2"}>
          <Dropdown
           id={"startMonth-" + sectionIndex + "-" + sourceIndex}
           type="text"
           items={monthItemState.ItemsMonths}
           itemToString={(item) => (item ? item.text : "")}
           invalidText={state.forecastSections[sectionIndex]?.sectionValidation?.startMonth[sourceIndex]?.invalidText}
           invalid={state.forecastSections[sectionIndex].sectionValidation?.startMonth[sourceIndex]?.invalid}
           selectedItem={monthItemState.ItemsMonths.find((x) => x.value === source?.startMonth)}
           onChange={(e) => handleChange(e.selectedItem.value, "startMonth", sourceIndex, "dataRow")}
          />
         </div>
         <div className={"bx--col-lg-2"}>
          {" "}
          <Dropdown
           id={"endMonth-" + sectionIndex + "-" + sourceIndex}
           type="text"
           items={monthItemState.ItemsMonths}
           itemToString={(item) => (item ? item.text : "")}
           invalidText={state.forecastSections[sectionIndex]?.sectionValidation?.endMonth[sourceIndex]?.invalidText}
           invalid={state.forecastSections[sectionIndex].sectionValidation?.endMonth[sourceIndex]?.invalid}
           selectedItem={monthItemState.ItemsMonths.find((x) => x.value === source?.endMonth)}
           onChange={(e) => handleChange(e.selectedItem.value, "endMonth", sourceIndex, "dataRow")}
          />
         </div>
        </div>
       );
      })}

      <br />
      <br />
      <br />

      <div className={"bx--row"}>
       <div className={"bx--col-lg-4"}>{"Entity"}</div>
       <div className={"bx--col-lg-4"}>{"Department"}</div>
       <div className={"bx--col-lg-4"}>{"Job code"}</div>
      </div>

      <div className={"bx--row"}>
       <div className={"bx--col-lg-4"}>
        <SingleSelectModal
         id={"entitiesDropDown-source-" + sectionIndex}
         data={localState.searchedData.entity}
         gridData={dimensionGroupedData?.entityGroupedData}
         invalid={state.forecastSections[sectionIndex]?.sectionValidation?.entitySource?.invalid}
         invalidText={state.forecastSections[sectionIndex]?.sectionValidation?.entitySource?.invalidText}
         name="Entity"
         itemToString={(item) => (item ? item.entityCode + " " + item.entityName : "")}
         itemToElement={(item) =>
          item.isGroup ? (
           <span>
            {" "}
            <strong>
             {" "}
             {"*"} {item.entityCode + " " + item.entityName}
            </strong>
           </span>
          ) : (
           <span> {item.entityCode + " " + item.entityName}</span>
          )
         }
         selectedItem={masterData.Entites.find((item) => item.entityID === state.forecastSections[sectionIndex]?.source?.dimensionRow?.entity)}
         onChange={(e) => handleChange(e.selectedItem ? e.selectedItem.entityID : "", "entity", undefined, "dimensionRow")}
         onInputChange={(inputText) => handleSearchFilter(inputText, "entity")}
         hideGroupsToggle={true}
         hideGroups={false}
         isGroupedData={true}
        />
       </div>
       <div className={"bx--col-lg-4"}>
        <SingleSelectModal
         id={"DepartmentDropDown-source-" + sectionIndex}
         data={localState.searchedData.department}
         gridData={dimensionGroupedData?.departmentGroupedData} 
         invalid={state.forecastSections[sectionIndex]?.sectionValidation?.departmentSource?.invalid}
         invalidText={state.forecastSections[sectionIndex]?.sectionValidation?.departmentSource?.invalidText}
         name="Department"
         itemToString={(item) => (item ? item.departmentCode + " " + item.departmentName : "")}
         itemToElement={(item) =>
          item.isGroup || item.isHierarchy ? (
           <span>
            {" "}
            <strong>
             {" "}
             {"*"} {item.departmentCode + " " + item.departmentName}
            </strong>
           </span>
          ) : (
           <span> {item.departmentCode + " " + item.departmentName}</span>
          )
         }
         selectedItem={masterData.Departments.find((item) => item.departmentID === state.forecastSections[sectionIndex]?.source?.dimensionRow?.department)}
         onChange={(e) => handleChange(e.selectedItem ? e.selectedItem.departmentID : "", "department", undefined, "dimensionRow")}
         onInputChange={(inputText) => handleSearchFilter(inputText, "department")}
         hideGroupsToggle={true}
         hideGroups={false}
         isGroupedData={true}
        />
       </div>
       <div className={"bx--col-lg-4"}>
        <SingleSelectModal
         id={"JobCodeDropDown-source-" + sectionIndex}
         data={localState.searchedData.jobCode}
         gridData={dimensionGroupedData?.jobCodeGroupedData}
         invalid={state.forecastSections[sectionIndex]?.sectionValidation?.jobCodeSource?.invalid}
         invalidText={state.forecastSections[sectionIndex]?.sectionValidation?.jobCodeSource?.invalidText}
         placeholder="Job code"
         name="jobCode"
         modalHeading="Job code"
         itemToString={(item) => (item ? item.jobCodeCode + " " + item.jobCodeName : "")}
         selectedItem={masterData.JobCodes.find((item) => item.jobCodeID === state.forecastSections[sectionIndex]?.source?.dimensionRow?.jobCode)}
         light={false}
         itemToElement={(item) =>
          item.isGroup ? (
           <span>
            {" "}
            <strong>
             {" "}
             {"*"} {item.jobCodeCode + " " + item.jobCodeName}
            </strong>
           </span>
          ) : (
           <span> {item.jobCodeCode + " " + item.jobCodeName}</span>
          )
         }
         onChange={(e) => handleChange(e.selectedItem ? e.selectedItem.jobCodeID : "", "jobCode", undefined, "dimensionRow")}
         onInputChange={(inputText) => handleSearchFilter(inputText, "jobCode")}
         hideGroupsToggle={true}
         hideGroups={false}
         isGroupedData={true}
        />
       </div>
      </div>
      <br />
      <br />
      <br />

      <div className={"bx--row"}>
       <div className={"bx--col-lg-4"}>{"Productive pay type group"}</div>
       <div className={"bx--col-lg-4"}>{"Non-productive pay type group"}</div>
       <div className={"bx--col-lg-4"}>{"Excluded pay types (optional)"}</div>
      </div>
      <div className={"bx--row"}>


       <div className={"bx--col-lg-4 "}>
          <SingleSelectModal
            id={"productivePayTypesDropDown"  + sectionIndex}
            data={localState.searchedData.productivePayTypeData}
            // Here we only need to show groups in grid, so no need to use 'dimensionGroupedData.?payTypeGroupedData'
            gridData={localState.orignalData.productivePayTypeData}
            placeholder="Pay type group"
            modalHeading="Pay type"
            name="payType"
            invalid={state.forecastSections[sectionIndex]?.sectionValidation?.productivePayTypeGroupSource?.invalid}
            invalidText={state.forecastSections[sectionIndex]?.sectionValidation?.productivePayTypeGroupSource?.invalidText}
            itemToString={(item) => (item ? item.payTypeCode + " " + item.payTypeName : "")}
            selectedItem={masterData.PayTypes.find((item) => item.payTypeID === state.forecastSections[sectionIndex]?.source?.dimensionRow?.productivePayTypeGroup)}
            light={false}
            itemToElement={(item) =>
            item.isGroup ? (
              <span>
              {" "}
              <strong>
                {" "}
                {"*"} {item.payTypeCode + " " + item.payTypeName}
              </strong>
              </span>
            ) : (
              <span> {item.payTypeCode + " " + item.payTypeName}</span>
            )
            }
            onChange={(e) => handleChange(e.selectedItem ? e.selectedItem.payTypeID : "", "productivePayTypeGroup", undefined, "dimensionRow")}
            onInputChange={(inputText) => handleSearchFilter(inputText, "productivePayTypeData")}
            hideGroupsToggle={false}
            hideGroups={false}
            isGroupedData={true}
          />

         </div>
       <div className={"bx--col-lg-4 "}>
         <SingleSelectModal
        id={"nonproductivePayTypesDropDown"  + sectionIndex}
        data={localState.searchedData.nonProductivePayTypeData}
        // Here we only need to show groups in grid, so no need to use 'dimensionGroupedData.?payTypeGroupedData'
        gridData={localState.searchedData.nonProductivePayTypeData}
        placeholder="Pay type group"
        modalHeading="Pay type"
        name="payType"
        invalid={state.forecastSections[sectionIndex]?.sectionValidation?.nonProductivePayTypeGroupSource?.invalid}
        invalidText={state.forecastSections[sectionIndex]?.sectionValidation?.nonProductivePayTypeGroupSource?.invalidText}
        itemToString={(item) => (item ? item.payTypeCode + " " + item.payTypeName : "")}
        selectedItem={masterData.PayTypes.find((item) => item.payTypeID ===  state.forecastSections[sectionIndex]?.source?.dimensionRow?.nonProductivePayTypeGroup)}
        light={false}
        itemToElement={(item) =>
         item.isGroup ? (
          <span>
           {" "}
           <strong>
            {" "}
            {"*"} {item.payTypeCode + " " + item.payTypeName}
           </strong>
          </span>
         ) : (
          <span> {item.payTypeCode + " " + item.payTypeName}</span>
         )
        }
        onChange={(e) => handleChange(e.selectedItem ? e.selectedItem.payTypeID : "", "nonProductivePayTypeGroup", undefined, "dimensionRow")}
        onInputChange={(inputText) => handleSearchFilter(inputText, "nonProductivePayTypeData")}
        hideGroupsToggle={false}
        hideGroups={false}
        isGroupedData={true}
       />
         </div>
       
       
       
       <div className={"bx--col-lg-4"}>
        <MultiSelect.Filterable
         sortItems={() => {
          return localState.searchedData.payType;
         }}
         direction="bottom"
         disabled={false}
         id="custom-datatable-views-multiselect"
         initialSelectedItems={localState.searchedData.payType.filter((item) => payTypeSelectedValueState[item.id])}
         invalidText="Invalid Selection"
         itemToString={(item) => item.name}
         itemToElement = {(item) =>
            item.isGroup ? <span> <strong> {"*"} {item.name}</strong></span> 
            : <span> {item.name}</span> 
          }   
         items={localState.searchedData.payType}
         label="Views"
         light={false}
         locale="en"
         onChange={handleCheckBox}
         open={false}
         selectionFeedback="top-after-reopen"
         title={false}
         type="default"
         placeholder="Pay Types"
        />
       </div>
      </div>
     </div>
    </div>
   </div>
  </>
 ) : null;
};
export default StaffingPayTypeDistributionForecastMethodSection;
