import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, TooltipIcon, Dropdown } from "carbon-components-react";
import { Information16, Add20, Subtract20 } from "@carbon/icons-react";
import { updateForecast } from "../../../../core/_actions/ForecastActions";
import { transformBudgetVersionData, getBudgetVersionDataForDropDowns } from "../../../../helpers/DataTransform/transformData";
import ItemsMonthsImport from "../../MasterData/itemsMonths";
import SingleSelectModal from "../../../shared/single-select/single-select-with-modal";
import { scenario_type_Codes } from "../Data/scenario_type_codes";
import { CheckRunForecastButton } from "../ValidateForecast";

const StaffingAverageWageRateForecastMethodSection = ({ sectionIndex }) => {
 const initialLocalStates = {
  pageConfig: {
   columnWidth: 4,
   infoIconCssClass: "checkBox-info-Icon-large",
  },
 };

 const ItemMonthsUpdated = [{ id: "notSelected", value: "notSelected", text: "Choose one" }, ...ItemsMonthsImport];

 const state = useSelector((state) => state.ForecastReducer);
 const budgetVersionData = useSelector((state) => state.BudgetVersions.list);
 const masterData = useSelector((state) => state.MasterData);
 const [monthItemState, setMonthItemState] = useState({ ItemsMonths: ItemMonthsUpdated });
 const dispatch = useDispatch();

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
 };

 return state.forecastSections[sectionIndex].forecastType === "staffing_average_wage_rate" ? (
  <>
   <div className={"section-container"}>
    <div className={"bx--row"}>
     <div className={"bx--col-lg"}>
      <div className={"bx--row"}>
       <div className={"bx--col-lg-2"}>
        <strong> Average wage rates </strong>
       </div>
       <div className={"bx--col-lg-3 average-wage-rate-info-icon"}>
        <TooltipIcon direction="top" tooltipText="Define the average wage rate to use for staffing." align="start">
         <Information16 />
        </TooltipIcon>
       </div>

       <div className={"bx--col-lg-2"}>
        <strong> Source months </strong>
       </div>
       <div className={"bx--col-lg-1 source-month-info-icon"}>
        <TooltipIcon direction="top" tooltipText="The selected actual months will be used to calculate the budget version's staffing average wage rate." align="start">
         <Information16 />
        </TooltipIcon>
       </div>
      </div>
      
      <div className={"bx--row"}>
       <div className={"bx--col-lg-5"}>{"Source actual budget version"}</div>
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
            data={BudgetVersionDataForDropDown}
            gridData={BudgetVersionDataForModalGrid}
            name="Budget version"
            invalidText={state.forecastSections[sectionIndex]?.sectionValidation?.budgetversion[sourceIndex]?.invalidText}
            invalid={state.forecastSections[sectionIndex]?.sectionValidation?.budgetversion[sourceIndex]?.invalid}
            itemToString={(item) => (item ? item.text : "")}
            selectedItem={BudgetVersionDataForDropDown?.find((x) => x.value === source?.budgetversion_code)}
            onChange={(e) => handleChange(e.selectedItem?.value, "budgetversion_code", sourceIndex, "dataRow")}
            hideGroupsToggle={true}
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
     </div>
    </div>
   </div>
  </>
 ) : null;
};
export default StaffingAverageWageRateForecastMethodSection;
