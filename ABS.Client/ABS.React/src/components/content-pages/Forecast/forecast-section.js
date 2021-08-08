import React, { useEffect, useState, createRef } from "react";
import AddSubtractButtonSet from "./add-subtract-button-set";
import AccordianTitle from "./accordion-title";
import { useSelector, useDispatch } from "react-redux";
import {
  Dropdown,
  Accordion,
  AccordionItem,
  Checkbox,
  TooltipIcon,
} from "carbon-components-react";
import { Information16 } from "@carbon/icons-react";
import { updateForecast } from "../../../core/_actions/ForecastActions";
import { forecastTypeStatistics, forecastTypeGLDoller, forecastTypeStaffing } from "./Data/forecast-Method-Types";
import CopyForecastMethodSection from "./copy-forecast-method-section";
import AnnualizationForecastMethodSection from "./annualization-forecast-method-section";
import RatioForecastMethodSection from "./ratio-forecast-method-section";
import StaffingAverageWageRateForecastMethodSection from "./other-forecast-methods-sections/staffing-average-wage-rate-forecast-method-section";
import StaffingPayTypeDistributionForecastMethodSection from "./other-forecast-methods-sections/staffing-pay-type-distribution-forecast-method-section";

import { CheckRunForecastButton } from "./ValidateForecast";

import { defaultforecastSection, defaultforecastSectionForRatioType } from "./Data/forecast-section-default-values";
import { scenario_type_Codes } from './Data/scenario_type_codes';


import itemsDateFormat from "../MasterData/forecastMethodType";
import { convertUTCDateToLocalDateLocalString } from "../../../helpers/date.helper";

const ForecastSection = ({ section, index , GroupedDataState }) => {
  const state = useSelector((state) => state.ForecastReducer);
  const userSystemSettings = useSelector(
    (state) => state.systemSettings
  );
  const [forecastTypeState, setForecastTypeState] = useState({ forecastTypes: [] })
  const [componentKeyState, setComponentKeyState] = useState({
    copyKey: "I-" + index + "-100",
    annualizationKey: "I-" + index + "-200",
    ratioKey: "I-" + index + "-300",
    copy_staffing_hoursKey: "I-" + index + "-400",
    annualize_staffing_hoursKey: "I-" + index + "-500",
    ratioGL_StatisticsKey: "I-" + index + "-600",
    ratio_staffing_hours_statisticsKey: "I-" + index + "-700",
    copy_staffing_dollarsKey: "I-" + index + "-800",
    annualize_staffing_dollarsKey: "I-" + index + "-900",
    staffing_average_wage_rateKey: "I-" + index + "-1000",
    staffing_pay_type_distributionKey: "I-" + index + "-1100"

  })

  const [glAccountGroupedDatastate, SetglAccountGroupedData] = useState({ glAccountGroupedData: [] });


  const dispatch = useDispatch();

  // On Dropdown Change All section properties/fields are set with default values.
  const handleDropDown = async (e) => {
    let forecastSection = {};
    if (e.selectedItem.value === "copy"
      || e.selectedItem.value === "annualization"
      || e.selectedItem.value === "copy_staffing_hours"
      || e.selectedItem.value === "annualize_staffing_hours"
      || e.selectedItem.value === "copy_staffing_dollars"
      || e.selectedItem.value === "annualize_staffing_dollars"
      || e.selectedItem.value === "staffing_average_wage_rate"
      || e.selectedItem.value === "staffing_pay_type_distribution") {

      forecastSection = JSON.parse(JSON.stringify(defaultforecastSection));
      setComponentKeyState({ ...componentKeyState, [e.selectedItem.value + "Key"]: "I-" + index + "-" + (parseInt(componentKeyState[e.selectedItem.value + "Key"].substring(4, componentKeyState[e.selectedItem.value + "Key"].length)) + 1) })

    } else if (e.selectedItem.value === "ratio"
      || e.selectedItem.value === "ratioGL_Statistics"
      || e.selectedItem.value === "ratio_staffing_hours_statistics") {

      forecastSection = JSON.parse(JSON.stringify(defaultforecastSectionForRatioType));
      setComponentKeyState({ ...componentKeyState, [e.selectedItem.value + "Key"]: "I-" + index + "-" + (parseInt(componentKeyState[e.selectedItem.value + "Key"].substring(4, componentKeyState[e.selectedItem.value + "Key"].length)) + 1) })

    } else {
      forecastSection = JSON.parse(JSON.stringify(defaultforecastSection));
    }
    const updatedStates = state;
    forecastSection.forecastType = e.selectedItem.value;
    updatedStates.forecastSections[index] = forecastSection;


    // Enable Validate Button when atleast one method step is added.
    let disabledButton;
    let includedSections = updatedStates.forecastSections.filter(
      (section) => section.included && section.forecastType !== "notSelected"
    );
    if (includedSections.length > 0) {
      disabledButton = state.validateButton;
      disabledButton.disabled = false;
      state.validateButton = disabledButton;
    } else {
      disabledButton = state.validateButton;
      disabledButton.disabled = true;
      state.validateButton = disabledButton;
    }
    await dispatch(
      updateForecast(
        { ...state },
        { forecastSections: updatedStates.forecastSections }
      )
    );

    // Check for Enable/Disable of Run Forecast Button
    CheckRunForecastButton();
  };

  const handleCheckbox = (e) => {
    const updatedStates = state;
    updatedStates.forecastSections.forEach(state => { state.expanded = !e.target.checked });

    dispatch(updateForecast({ ...state, collapseAll: e.target.checked, forecastSections: updatedStates.forecastSections }));
  };

  useEffect(() => {
    if (state.forecast_budgetversion_scenario_type_ID) {
      let forecastTypeSelect = [];
      if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.statistics) // ST is Statistics Type code in DB , get code from a file , dont hardcode it.
      {
        forecastTypeSelect = [...forecastTypeStatistics]
      } else if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger)  // // GL is GL account Type code in DB , get code from a file , dont hardcode it.
      {
        forecastTypeSelect = [...forecastTypeGLDoller]
      } else if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing)  // // SF is staffing Type code in DB , get code from a file , dont hardcode it.
      {
        forecastTypeSelect = [...forecastTypeStaffing]
      }
      setForecastTypeState({ forecastTypes: forecastTypeSelect });
    }
  }, [state.forecast_budgetversion_scenario_type_ID]);


  const accordionItemClick = e => {
    if (index !== undefined) {
      const updatedStates = state.forecastSections;

      updatedStates[index].expanded = !updatedStates[index].expanded;

      dispatch(
        updateForecast(
          { ...state },
          { forecastSections: updatedStates.forecastSections }
        )
      );
    }

  }
  const returnLastEdit = (section, forcastMethodsHistory) => {
    if (forcastMethodsHistory?.length && section?.forecastType) {
      forcastMethodsHistory = forcastMethodsHistory.filter(data => data.formulaMethod === section.forecastType && data.datascenarioType === state.forecast_budgetversion_scenario_type_Code)
      if (forcastMethodsHistory.length) {
        forcastMethodsHistory = forcastMethodsHistory.sort((a, b) => {
          if (new Date(a.creationDate) > new Date(b.creationDate)) return -1
          return new Date(a.creationDate) < new Date(b.creationDate) ? 1 : 0
        })
        let userSelectedDateFormat = itemsDateFormat.find(data => data.value === userSystemSettings.fiscalStartMonthDateFormat);
        userSelectedDateFormat = userSelectedDateFormat !== undefined ? userSelectedDateFormat.text : 'mm/dd/yyyy';
        return `Last edited ${convertUTCDateToLocalDateLocalString(forcastMethodsHistory[0].creationDate + "", userSelectedDateFormat, true)} by 1`
      }
    }
    return ''
  }

  return (
    <div>
      <div className="bx--row forecast-add-subtract-btn-container">
        <div className="bx--col-lg-4">
          <AddSubtractButtonSet
            showAdd={true}
            showSubtract={true}
            index={index}
            sectionIndex={index}

          />
        </div>
        {index === 0 && state.forecastSections.length !== 0 ? (
          <div className="bx--offset-lg-7">
            <Checkbox
              id="forecastCollapseAllCheckbox"
              labelText="Collapse all"
              className={"forecast-collapse-all"}
              onClick={(e) => {
                handleCheckbox(e);
              }}
              checked={state.collapseAll}
            />
          </div>
        ) : null}
      </div>

      <Accordion align="end">
        <AccordionItem
          onHeadingClick={e => {
            accordionItemClick(e);
            //e.stopPropagation();
          }}
          title={
            <AccordianTitle
              index={index}
              title={
                forecastTypeState?.forecastTypes?.find((x) => x.value === section.forecastType)?.text
              }
            />
          }
          open={state.forecastSections[index].expanded}
        >
          <div className="bx--row">
            <div className="bx--col-lg-5">
              <Dropdown
                id={"forecast-method-selection-dropdown-" + index}
                className={"forecast-method-selection-dropdown"}
                items={forecastTypeState?.forecastTypes}
                itemToString={(item) => (item ? item.text : "")}
                onChange={(e) => handleDropDown(e)}
                selectedItem={forecastTypeState?.forecastTypes.find(
                  (x) => x.value === section.forecastType
                )}
              />
            </div>
            <div className="bx--col-lg-1 forecast-method-selection-dropdown-icon">
              <TooltipIcon
                className={"forecast-method-selection-dropdown-icon"}
                direction="right"
                tooltipText="Select a previously saved set of completed forecast steps." // ABS-BUG : 414
                align="center"
              >
                <Information16 />
              </TooltipIcon>
            </div>
            <div className="bx--col-lg-4 forecast-method-selection-dropdown-icon">
              <p className="bx--checkbox-label-text">{returnLastEdit(section, state.forcastMethodsHistory)}</p>
            </div>

          </div>
          {(section.forecastType === "copy"
            || section.forecastType === "copy_staffing_hours"
            || section.forecastType === "copy_staffing_dollars") ? (
              <div className="bx--row">
                <div className="bx--col">
                  <CopyForecastMethodSection  key={componentKeyState[section.forecastType + "Key"]} sectionIndex={index} dimensionGroupedData={GroupedDataState} />
                </div>
              </div>
            ) : null}
          {(section.forecastType === "annualization" || section.forecastType === "annualize_staffing_hours"
            || section.forecastType === "annualize_staffing_dollars") ? (
              <div className="bx--row">
                <div className="bx--col">
                  <AnnualizationForecastMethodSection  key={componentKeyState[section.forecastType + "Key"]} sectionIndex={index} dimensionGroupedData={GroupedDataState} />
                </div>
              </div>
            ) : null}
          {section.forecastType === "ratio"
            || section.forecastType === "ratioGL_Statistics"
            || section.forecastType === "ratio_staffing_hours_statistics" ? (
              <div className="bx--row">
                <div className="bx--col">
                  <RatioForecastMethodSection  key={componentKeyState[section.forecastType + "Key"]} sectionIndex={index} dimensionGroupedData={GroupedDataState} />
                </div>
              </div>
            ) : null}

          {section.forecastType === "staffing_average_wage_rate" ? (
            <div className="bx--row">
              <div className="bx--col">
                <StaffingAverageWageRateForecastMethodSection key={componentKeyState[section.forecastType + "Key"]} sectionIndex={index} dimensionGroupedData={GroupedDataState} />
              </div>
            </div>
          ) : null}

          {section.forecastType === "staffing_pay_type_distribution" ? (
            <div className="bx--row">
              <div className="bx--col">
                <StaffingPayTypeDistributionForecastMethodSection  key={componentKeyState[section.forecastType + "Key"]} sectionIndex={index} dimensionGroupedData={GroupedDataState} />
              </div>
            </div>
          ) : null}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ForecastSection;
