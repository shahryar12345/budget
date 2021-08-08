import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  TooltipIcon,
  Checkbox,
  TextInput,
  Dropdown,
} from "carbon-components-react";
import {
  Information16,
  Add20,
  Subtract20,
} from "@carbon/icons-react";
import { updateForecast } from "../../../../core/_actions/ForecastActions";
import ItemsMonthsImport from "../../MasterData/itemsMonths";
import {
  transformBudgetVersionData,
  getBudgetVersionDataForDropDowns,
  GetSortedEntityByGroups,
  GetSortedDepartmentByHierarchyGroupe,
  GetSortedStatisticsByGroups,
  GetSortedGLAccountsByGroups,
  GetSortedJobCodeByGroups, 
  GetSortedPayTypeByGroups
} from "../../../../helpers/DataTransform/transformData";
import { CheckRunForecastButton } from "../ValidateForecast";
import SingleSelectModal from "../../../shared/single-select/single-select-with-modal";
import { scenario_type_Codes } from '../Data/scenario_type_codes'
import config from '../../../../helpers/DataTransform/data-transform-config';

const SourceSection = ({ sectionIndex, sectionType, dimensionGroupedData}) => {

  const initialLocalStates = {
    pageConfig: {
      columnWidth: 4,
      infoIconCssClass: "checkBox-info-Icon-large"
    },
    searchedData: {
      budgetVersion: [],
      entity: [],
      department: [],
      statistic: [],
      generalLedger: [],
      jobCode: [],
      payType: [],
    },
    orignalData: {
      budgetVersion: [],
      entity: [],
      department: [],
      statistic: [],
      generalLedger: [],
      jobCode: [],
      payType: [],
    },
    dimnesionDetails: {
      budgetVersion: {
        name: "text",
        code: "value"
      },
      entity: {
        name: "entityName",
        code: "entityCode"
      },
      department: {
        name: "departmentName",
        code: "departmentCode"
      },
      statistic: {
        name: "statisticsCodeName",
        code: "statisticsCode"
      },
      generalLedger: {
        name: "glAccountName",
        code: "glAccountCode"
      },
      jobCode: {
        name: "jobCodeName",
        code: "jobCodeCode"
      },
      payType: {
        name: "payTypeName",
        code: "payTypeCode"
      },
    }
  };

  const ItemMonthsUpdated = [
    { id: "notSelected", value: "notSelected", text: "Choose one" },
    ...ItemsMonthsImport,
  ];

  const state = useSelector((state) => state.ForecastReducer);
  const budgetVersionData = useSelector((state) => state.BudgetVersions.list);
  const masterData = useSelector((state) => state.MasterData);
  const [monthItemState, setMonthItemState] = useState({ ItemsMonths: ItemMonthsUpdated });
  const [localState, setLocalState] = useState(initialLocalStates);

  const dispatch = useDispatch();
  let timeout;
  let itemSelected = false;

  const userdateformat = useSelector(
    (state) => state.systemSettings.fiscalStartMonthDateFormat
  );
  let mydateFormat = useSelector((state) =>
    state.MasterData.ItemDateFormat.find(
      ({ itemTypeValue }) => itemTypeValue === userdateformat
    )
  );
  if (typeof mydateFormat === "undefined") {
    mydateFormat = "LLLL";
  } else {
    mydateFormat = mydateFormat.itemTypeCode;
  }

  // Data Tranfromation is required becauase Data is not save in Array, in Store.
  const BudgetVersionDataForModalGrid = transformBudgetVersionData(
    budgetVersionData,
    mydateFormat
  );

  const NewSource = {
    //  will Set these values to default accordingly
    budgetversion_code: "notSelected",
    startMonth: "notSelected",
    endMonth: "notSelected",
  };

  const handleAddSubtractSource = (e, action, sourceIndex) => {
    const UpdatedSource = [
      ...state.forecastSections[sectionIndex]?.source.dataRow,
    ]; // Deep copy of Array

    const UpdatedsectionValidation = JSON.parse(
      JSON.stringify(state.forecastSections[sectionIndex].sectionValidation)
    );
    const validationObj = {
      invalid: false,
      invalidText: "",
    };
    switch (action) {
      case "add":
        if (sourceIndex === -1) {
          UpdatedSource.push(JSON.parse(JSON.stringify(NewSource)));
          UpdatedsectionValidation.budgetversion.push(validationObj);
          UpdatedsectionValidation.startMonth.push(validationObj);
          UpdatedsectionValidation.endMonth.push(validationObj);
        } else {
          UpdatedSource.splice(sourceIndex, 0, JSON.parse(JSON.stringify(NewSource)));
          UpdatedsectionValidation.budgetversion.splice(
            sourceIndex,
            0,
            validationObj
          );
          UpdatedsectionValidation.startMonth.splice(
            sourceIndex,
            0,
            validationObj
          );
          UpdatedsectionValidation.endMonth.splice(
            sourceIndex,
            0,
            validationObj
          );
        }
        break;
      case "sub":
        UpdatedSource.splice(sourceIndex, 1);
        UpdatedsectionValidation.budgetversion.splice(sourceIndex, 1);
        UpdatedsectionValidation.startMonth.splice(sourceIndex, 1);
        UpdatedsectionValidation.endMonth.splice(sourceIndex, 1);

        if (UpdatedSource.length === 0) {
          UpdatedSource.push(JSON.parse(JSON.stringify(NewSource))); // Show atleast one row , all the time.
          UpdatedsectionValidation.budgetversion.push(validationObj);
          UpdatedsectionValidation.startMonth.push(validationObj);
          UpdatedsectionValidation.endMonth.push(validationObj);
        }
        break;
      default:
        break;
    }

    const UpdatedforecastSections = [...state.forecastSections];
    UpdatedforecastSections[sectionIndex].source.dataRow = [...UpdatedSource];
    UpdatedforecastSections[sectionIndex].sectionValidation = JSON.parse(
      JSON.stringify(UpdatedsectionValidation)
    );
    dispatch(
      updateForecast({
        ...state,
        forecastSections: [...UpdatedforecastSections],
      })
    );
  };

  // Generic function for all field which are in this component.
  const handleChange = (value, controlId, sourceIndex, rowType) => {
    const UpdatedforecastSections = [...state.forecastSections];
    let updatedSource;
    if (sourceIndex !== undefined) {
      updatedSource = [
        ...UpdatedforecastSections[sectionIndex].source[rowType],
      ];

      if (controlId === "budgetversion_code") {
        // get Timeperiod of budget version by using its code
        const BudgerVersionTimePeriod = BudgetVersionDataForModalGrid.find(
          (item) => item.code === value
        )?.timeperiodobj;
        // Get Start and End month Id from the BV timePeroid
        const startMonthValue = masterData.ItemMonths.find(
          (item) => item.itemTypeID === BudgerVersionTimePeriod?.fiscalStartMonthID?.itemTypeID)?.itemTypeValue;

        const endMonthValue = masterData.ItemMonths.find(
          (item) => item.itemTypeID === BudgerVersionTimePeriod?.fiscalEndMonthID?.itemTypeID)?.itemTypeValue;

        // Here populate Fiscal Years month dropdown, set first item as the start month of the selected budget version.
        if (startMonthValue) {
          console.log('startMonthValue', startMonthValue);

          let startMonthIndex = ItemsMonthsImport.findIndex((month) => month.value === startMonthValue)
          let ItemsMonthsImportCopy = [...ItemsMonthsImport];
          console.log(startMonthIndex);
          setMonthItemState({
            ...monthItemState, ItemsMonths: [{ id: "notSelected", value: "notSelected", text: "Choose one" },
            ...ItemsMonthsImportCopy.splice(startMonthIndex, ItemsMonthsImportCopy.length - startMonthIndex), ...ItemsMonthsImportCopy.splice(0, startMonthIndex)]
          });
        } else {
          setMonthItemState({ ...monthItemState, ItemsMonths: ItemMonthsUpdated });
        }
        updatedSource[sourceIndex]["startMonth"] =
          startMonthValue === undefined ? "notSelected" : startMonthValue;
        updatedSource[sourceIndex]["endMonth"] =
          endMonthValue === undefined ? "notSelected" : endMonthValue;
      }

      updatedSource[sourceIndex][controlId] = value;
      UpdatedforecastSections[sectionIndex].source[rowType] = [
        ...updatedSource,
      ];
    } else {
      updatedSource = JSON.parse(
        JSON.stringify(UpdatedforecastSections[sectionIndex].source[rowType])
      );
      updatedSource[controlId] = value;
      UpdatedforecastSections[sectionIndex].source[rowType] = JSON.parse(
        JSON.stringify(updatedSource)
      );
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

  useEffect(() => {
    let updatePageConfig = localState.pageConfig;
    if (state.forecastSections[sectionIndex].forecastType !== "copy_staffing_hours" &&
      state.forecastSections[sectionIndex].forecastType !== "annualize_staffing_hours" &&
      state.forecastSections[sectionIndex].forecastType !== "copy_staffing_dollars" &&
      state.forecastSections[sectionIndex].forecastType !== "annualize_staffing_dollars"
    ) {
      updatePageConfig.columnWidth = 4
      updatePageConfig.infoIconCssClass = "checkBox-info-Icon-large"
    } else {
      updatePageConfig.columnWidth = 3
      updatePageConfig.infoIconCssClass = "checkBox-info-Icon"
    }

    let fetchData = {
      budgetVersion: getBudgetVersionDataForDropDowns(budgetVersionData),
      entity: GetSortedEntityByGroups(masterData.Entites),
      department: GetSortedDepartmentByHierarchyGroupe(masterData.Departments),
      statistic: GetSortedStatisticsByGroups(masterData.Statistics, true),
      generalLedger: GetSortedGLAccountsByGroups(masterData.GLAccounts),
      jobCode: GetSortedJobCodeByGroups(masterData.JobCodes),
      payType: GetSortedPayTypeByGroups(masterData.PayTypes)
    }

    let searchedData = localState.searchedData;
    let orignalData = localState.orignalData;
    let dimensionNames = ["budgetVersion"
      , "entity", "department", "statistic"
      , "generalLedger", "jobCode", "payType"];
    for (let i = 0; i < dimensionNames.length; i++) {
      searchedData[dimensionNames[i]] = [...fetchData[dimensionNames[i]]];
      orignalData[dimensionNames[i]] = [...fetchData[dimensionNames[i]]];
    }

    if(config.statistic.HideMasters)
    {
      orignalData["statistic"] = orignalData["statistic"].filter((statistic) => {return statistic.isMaster === false })
      searchedData["statistic"] = orignalData["statistic"];
    }
    if(config.jobCode.HideMasters)
    {
      orignalData["jobCode"] = orignalData["jobCode"].filter((jobCode) => {return jobCode.isMaster === false })
      searchedData["jobCode"] = orignalData["jobCode"];
    }
    if(config.payType.HideMasters)
    {
      orignalData["payType"] = orignalData["payType"].filter((payType) => {return payType.isMaster === false })
      searchedData["payType"] = orignalData["payType"];
    }

    setLocalState({ ...localState, pageConfig: updatePageConfig, searchedData: searchedData, orignalData: orignalData });
  }, [masterData])


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
          return data[dimensionDetail[dimensionName].name].toLowerCase().includes(inputText.toLowerCase())
            || data[dimensionDetail[dimensionName].code].toLowerCase().includes(inputText.toLowerCase())
            || CodeAndName.toLowerCase().includes(inputText.toLowerCase());
        })
      } else {
        searchedResult = [...orignalData[dimensionName]];
      }
      searcedData[dimensionName] = [...searchedResult]
      setLocalState({
        ...localState,
        searchedData: searcedData
      });
      itemSelected = false;
    }, 500);
  }

  return (
    state.forecastSections[sectionIndex].forecastType === "copy"
      || state.forecastSections[sectionIndex].forecastType === "annualization"
      || state.forecastSections[sectionIndex].forecastType === "copy_staffing_hours"
      || state.forecastSections[sectionIndex].forecastType === "annualize_staffing_hours"
      || state.forecastSections[sectionIndex].forecastType === "copy_staffing_dollars"
      || state.forecastSections[sectionIndex].forecastType === "annualize_staffing_dollars"
      ?
      <>
        <div>
          {/* SOURCE DATA ROW  - Can be multiple*/}
          {state.forecastSections[sectionIndex].source.dataRow.map(
            (source, sourceIndex) => {
              return (
                <div className={"bx--row"}>
                  <div className={"bx--col-lg"}>
                    <div className={"bx--row"}>
                      <TooltipIcon
                        key={"AddButtonToolTip" + sourceIndex}
                        id={"AddButtonToolTip" + sourceIndex}
                        direction="top"
                        tooltipText={state.forecastSections[sectionIndex].forecastType === "copy" ? "Add a copy source below."
                          : state.forecastSections[sectionIndex].forecastType?.includes('annualiz') ? "Add a annualization source budget version below."
                            : "Add a copy source below."}
                        align="start"
                      >
                        <Add20
                          onClick={(e) => {
                            handleAddSubtractSource(e, "add", sourceIndex);
                          }}
                        ></Add20>
                      </TooltipIcon>
                      <TooltipIcon
                        key={"RemoveButtonToolTip" + sourceIndex}
                        id={"RemoveButtonToolTip" + sourceIndex}
                        direction="top"
                        tooltipText={state.forecastSections[sectionIndex].forecastType === "copy" ? "Remove the copy source below."
                          : state.forecastSections[sectionIndex].forecastType?.includes('annualiz') ? "Remove the annualization source budget version below."
                            : "Remove the copy source below."}
                        align="start"
                      >
                        <Subtract20
                          onClick={(e) => {
                            handleAddSubtractSource(e, "sub", sourceIndex);
                          }}
                        ></Subtract20>
                      </TooltipIcon>
                    </div>

                    <div className={"bx--row"}>
                      <div className={"bx--col-lg-5 source-heading"}>
                        {sourceIndex === 0 ? <strong>
                          {sectionType === "annualization" ? "Annualize " : "Copy "}{" "}
                      source
                    </strong> : null}
                      </div>
                      <div className={"bx--offset-lg-3"}>
                        Include
                  </div>
                    </div>
                    <div className={"bx--row"}>
                      <div className={"bx--col-lg-3"}>{sourceIndex === 0 ? "Scenario type" : ""}</div>
                      <div className={"bx--col-lg-5"}>{"Budget version"}</div>
                      <div className={"bx--col-lg-2"}>{"Start month"}</div>
                      <div className={"bx--col-lg-2"}>{"End month"}</div>
                    </div>

                    <div className={"bx--row"}>
                      <div className={"bx--col-lg-3"}>
                        {sourceIndex === 0 ? <TextInput
                          id="scenarioType"
                          type={"text"}
                          value={state.forecast_budgetversion_scenario_type}
                          disabled={true}
                        /> : null}
                      </div>
                      {localState.orignalData.budgetVersion ? (
                        <div className={"bx--col-lg-5"}>
                          <SingleSelectModal
                            id={"budgetVersion-" + sectionIndex + "-" + sourceIndex + '-' + source?.budgetversion_code ?? "BV"}
                            key={"budgetVersion-" + sectionIndex + "-" + sourceIndex + '-' + source?.budgetversion_code ?? "BV"}
                            data={localState.searchedData.budgetVersion}
                            gridData={BudgetVersionDataForModalGrid}
                            name='Budget version'
                            invalidText={
                              state.forecastSections[sectionIndex]?.sectionValidation
                                ?.budgetversion[sourceIndex]?.invalidText
                            }
                            invalid={
                              state.forecastSections[sectionIndex]?.sectionValidation
                                ?.budgetversion[sourceIndex]?.invalid
                            }
                            itemToString={(item) => (item ? item.text : "")}
                            selectedItem={localState.orignalData.budgetVersion?.find(
                              (x) => x.value === source?.budgetversion_code
                            )}
                            onChange={(e) =>
                              handleChange(
                                e.selectedItem?.value,
                                "budgetversion_code",
                                sourceIndex,
                                "dataRow"
                              )
                            }
                            onInputChange={(inputText) => handleSearchFilter(inputText, "budgetVersion")}
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
                          invalidText={
                            state.forecastSections[sectionIndex]?.sectionValidation
                              ?.startMonth[sourceIndex]?.invalidText
                          }
                          invalid={
                            state.forecastSections[sectionIndex].sectionValidation
                              ?.startMonth[sourceIndex]?.invalid
                          }
                          selectedItem={monthItemState.ItemsMonths.find(
                            (x) => x.value === source?.startMonth
                          )}
                          onChange={(e) =>
                            handleChange(
                              e.selectedItem.value,
                              "startMonth",
                              sourceIndex,
                              "dataRow"
                            )
                          }
                        />
                      </div>
                      <div className={"bx--col-lg-2"}>
                        {" "}
                        <Dropdown
                          id={"endMonth-" + sectionIndex + "-" + sourceIndex}
                          type="text"
                          items={monthItemState.ItemsMonths}
                          itemToString={(item) => (item ? item.text : "")}
                          invalidText={
                            state.forecastSections[sectionIndex]?.sectionValidation
                              ?.endMonth[sourceIndex]?.invalidText
                          }
                          invalid={
                            state.forecastSections[sectionIndex].sectionValidation
                              ?.endMonth[sourceIndex]?.invalid
                          }
                          selectedItem={monthItemState.ItemsMonths.find(
                            (x) => x.value === source?.endMonth
                          )}
                          onChange={(e) =>
                            handleChange(
                              e.selectedItem.value,
                              "endMonth",
                              sourceIndex,
                              "dataRow"
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}

          <div className={"bx--row"}>
            <TooltipIcon
              key={"AddButtonToolTip-End"}
              id={"AddButtonToolTip-End"}
              direction="top"
              tooltipText={state.forecastSections[sectionIndex].forecastType === "copy" ? "Add a copy source below."
                : state.forecastSections[sectionIndex].forecastType?.includes('annualiz') ? "Add a annualization source budget version below."
                  : "Add a copy source below."}
              align="start"
            >
              <Add20
                onClick={(e) => {
                  handleAddSubtractSource(e, "add", -1);
                }}
              ></Add20>
            </TooltipIcon>
          </div>

          {/* SOURCE DIMENSION ROW - single */}
          <div className={"bx--row dimensions-containers"}>
            <div className={"bx--col-lg"}>
              <div className={"bx--row"}>
                <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
                  <div className={"bx--row"}>
                    <div className={`bx--col-lg-12`}>
                      <SingleSelectModal
                        id={"entitiesDropDown-source-" + sectionIndex}
                        data={localState.searchedData.entity}
                        gridData={dimensionGroupedData?.entityGroupedData}
                        invalid={
                          state.forecastSections[sectionIndex]?.sectionValidation
                            ?.entitySource?.invalid
                        }
                        invalidText={
                          state.forecastSections[sectionIndex]?.sectionValidation
                            ?.entitySource?.invalidText
                        }
                        name="Entity"
                        itemToString={(item) =>
                          item ? item.entityCode + " " + item.entityName : ""
                        }
                        itemToElement={(item) =>
                          item.isGroup ? <span> <strong> {"*"} {item.entityCode + " " + item.entityName}</strong></span>
                            : <span> {item.entityCode + " " + item.entityName}</span>
                        }
                        selectedItem={masterData.Entites.find(
                          (item) =>
                            item.entityID ===
                            state.forecastSections[sectionIndex]?.source?.dimensionRow
                              ?.entity
                        )}
                        onChange={(e) =>
                          handleChange(
                            e.selectedItem ? e.selectedItem.entityID : "",
                            "entity",
                            undefined,
                            "dimensionRow"
                          )
                        }
                        onInputChange={(inputText) => handleSearchFilter(inputText, "entity")}
                        hideGroupsToggle={true}
                        hideGroups={false}
                        isGroupedData={true} />
                    </div>
                    <div className={`bx--col-lg-12`}>
                      <div className={"bx--row"}>
                        <div className={"bx--col-md-11 use-group-checkbox"}>
                          <Checkbox
                            id={"useGroupTotal-entities-" + sectionIndex}
                            labelText={"Use group total"}
                            checked={
                              state.forecastSections[sectionIndex]?.source?.dimensionRow
                                ?.entitiesGroup
                            }
                            onClick={(e) => {
                              handleChange(
                                e.target.checked,
                                "entitiesGroup",
                                undefined,
                                "dimensionRow"
                              );
                            }}
                          />
                        </div>
                        <div className={"bx--col-md-1"}>
                          <TooltipIcon
                            direction="right"
                            tooltipText="Use the total value for a selected group rather than the values for each item in the group."
                            align="center"
                            className={"forecast-Model-Btn-icon"}
                          >
                            <Information16 className={localState.pageConfig.infoIconCssClass} />
                          </TooltipIcon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
                  <div className={"bx--row"}>
                    <div className={`bx--col-lg-12`}>
                      <SingleSelectModal
                        id={"DepartmentDropDown-source-" + sectionIndex}
                        data={localState.searchedData.department}
                        gridData={dimensionGroupedData?.departmentGroupedData}
                        invalid={
                          state.forecastSections[sectionIndex]?.sectionValidation
                            ?.departmentSource?.invalid
                        }
                        invalidText={
                          state.forecastSections[sectionIndex]?.sectionValidation
                            ?.departmentSource?.invalidText
                        }
                        name="Department"
                        itemToString={(item) =>
                          item ? item.departmentCode + " " + item.departmentName : ""
                        }
                        itemToElement={(item) =>
                          item.isGroup || item.isHierarchy ? <span> <strong> {"*"} {item.departmentCode + " " + item.departmentName}</strong></span>
                            : <span> {item.departmentCode + " " + item.departmentName}</span>
                        }
                        selectedItem={masterData.Departments.find(
                          (item) =>
                            item.departmentID ===
                            state.forecastSections[sectionIndex]?.source?.dimensionRow
                              ?.department
                        )}
                        onChange={(e) =>
                          handleChange(
                            e.selectedItem ? e.selectedItem.departmentID : "",
                            "department",
                            undefined,
                            "dimensionRow"
                          )
                        }
                        onInputChange={(inputText) => handleSearchFilter(inputText, "department")}
                        hideGroupsToggle={true}
                        hideGroups={false}
                        isGroupedData={true} />
                    </div>
                    <div className={`bx--col-lg-12`}>
                      <div className={"bx--row"}>
                        <div className={"bx--col-md-11 use-group-checkbox"}>
                          <Checkbox
                            id={"useGroupTotal-dept-" + sectionIndex}
                            labelText={"Use group total"}
                            checked={
                              state.forecastSections[sectionIndex]?.source?.dimensionRow
                                ?.departmentsGroup
                            }
                            onClick={(e) => {
                              handleChange(
                                e.target.checked,
                                "departmentsGroup",
                                undefined,
                                "dimensionRow"
                              );
                            }}
                          />
                        </div>
                        <div className={"bx--col-md-1"}>
                          <TooltipIcon
                            direction="right"
                            tooltipText="Use the total value for a selected group rather than the values for each item in the group."
                            align="center"
                            className={"forecast-Model-Btn-icon"}
                          >
                            <Information16 className={localState.pageConfig.infoIconCssClass} />
                          </TooltipIcon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Type Code = ST in DB*/}
                {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.statistics ?
                  <>
                    <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
                      <div className={"bx--row"}>
                        <div className={`bx--col-lg-12`}>
                          <SingleSelectModal
                            id={"statistiscsDropDown-source-" + sectionIndex}
                            data={localState.searchedData.statistic}
                            gridData={dimensionGroupedData?.statisticsGroupedData}
                            invalid={
                              state.forecastSections[sectionIndex]?.sectionValidation
                                ?.statisticSource?.invalid
                            }
                            invalidText={
                              state.forecastSections[sectionIndex]?.sectionValidation
                                ?.statisticSource?.invalidText
                            }
                            name="Statistics"
                            itemToString={(item) =>
                              item
                                ? item.statisticsCode + " " + item.statisticsCodeName
                                : ""
                            }
                            itemToElement={(item) =>
                              item.isGroup ? <span> <strong> {"*"} {item.statisticsCode + " " + item.statisticsCodeName}</strong></span>
                                : <span> {item.statisticsCode + " " + item.statisticsCodeName}</span>
                            }
                            selectedItem={localState?.orignalData?.statistic.find(
                              (item) =>
                                item.statisticsCodeID ===
                                state.forecastSections[sectionIndex]?.source?.dimensionRow
                                  ?.statistic
                            )}
                            onChange={(e) =>
                              handleChange(
                                e.selectedItem ? e.selectedItem.statisticsCodeID : "",
                                "statistic",
                                undefined,
                                "dimensionRow"
                              )
                            }
                            onInputChange={(inputText) => handleSearchFilter(inputText, "statistic")}
                            hideGroupsToggle={true}
                            hideGroups={false}
                            isGroupedData={true} />
                        </div>
                        <div className={`bx--col-lg-12`}>
                          <div className={"bx--row"}>
                            <div className={"bx--col-md-11 use-group-checkbox"}>
                              <Checkbox
                                id={"useGroupTotal-statistics-" + sectionIndex}
                                labelText={"Use group total"}
                                checked={
                                  state.forecastSections[sectionIndex]?.source?.dimensionRow
                                    ?.statisticsGroup
                                }
                                onClick={(e) => {
                                  handleChange(
                                    e.target.checked,
                                    "statisticsGroup",
                                    undefined,
                                    "dimensionRow"
                                  );
                                }}
                              />
                            </div>
                            <div className={"bx--col-md-1"}>
                              <TooltipIcon
                                direction="right"
                                tooltipText="Use the total value for a selected group rather than the values for each item in the group."
                                align="center"
                                className={"forecast-Model-Btn-icon"}
                              >
                                <Information16 className={localState.pageConfig.infoIconCssClass} />
                              </TooltipIcon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                  : null}

                {/* GL Account Type Code = GL in DB*/}
                {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger ?
                  <>
                    <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
                      <div className={"bx--row"}>
                        <div className={`bx--col-lg-12`}>
                          <SingleSelectModal
                            id={"generalLedgerDropDown-source-" + sectionIndex}
                            data={localState.searchedData.generalLedger}
                            gridData={dimensionGroupedData?.glAccountGroupedData}
                            invalid={
                              state.forecastSections[sectionIndex]?.sectionValidation
                                ?.generalLedgerSource?.invalid
                            }
                            invalidText={
                              state.forecastSections[sectionIndex]?.sectionValidation
                                ?.generalLedgerSource?.invalidText
                            }
                            placeholder="GL account"
                            name="GLAccounts"
                            modalHeading="GL account"
                            itemToString={(item) =>
                              item
                                ? item.glAccountCode + " " + item.glAccountName
                                : ""
                            }
                            selectedItem={masterData.GLAccounts.find(
                              (item) =>
                                item.glAccountID ===
                                state.forecastSections[sectionIndex]?.source?.dimensionRow
                                  ?.generalLedger
                            )}
                            light={false}
                            itemToElement={(item) =>
                              item.isGroup ? <span> <strong> {"*"} {item.glAccountCode + " " + item.glAccountName}</strong></span>
                                : <span> {item.glAccountCode + " " + item.glAccountName}</span>
                            }
                            onChange={(e) =>
                              handleChange(
                                e.selectedItem ? e.selectedItem.glAccountID : "",
                                "generalLedger",
                                undefined,
                                "dimensionRow"
                              )
                            }
                            onInputChange={(inputText) => handleSearchFilter(inputText, "generalLedger")}
                            hideGroupsToggle={true}
                            hideGroups={false}
                            isGroupedData={true} />
                        </div>
                        <div className={`bx--col-lg-12`}>
                          <div className={"bx--row"}>
                            <div className={"bx--col-md-11 use-group-checkbox"}>
                              <Checkbox
                                id={"useGroupTotal-generalLedger-" + sectionIndex}
                                labelText={"Use group total"}
                                checked={
                                  state.forecastSections[sectionIndex]?.source?.dimensionRow
                                    ?.generalLedgerGroup
                                }
                                onClick={(e) => {
                                  handleChange(
                                    e.target.checked,
                                    "generalLedgerGroup",
                                    undefined,
                                    "dimensionRow"
                                  );
                                }}
                              />
                            </div>
                            <div className={"bx--col-md-1"}>
                              <TooltipIcon
                                direction="right"
                                tooltipText="Use the total value for a selected group rather than the values for each item in the group."
                                align="center"
                                className={"forecast-Model-Btn-icon"}
                              >
                                <Information16 className={localState.pageConfig.infoIconCssClass} />
                              </TooltipIcon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                  : null}

                {/* Staffing Type Code = SF in DB*/}
                {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing ?
                  <>
                    <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
                      <div className={"bx--row"}>
                        <div className={`bx--col-lg-12`}>
                          <SingleSelectModal
                            id={"JobCodeDropDown-source-" + sectionIndex}
                            data={localState.searchedData.jobCode}
                            gridData={dimensionGroupedData?.jobCodeGroupedData}
                            invalid={
                              state.forecastSections[sectionIndex]?.sectionValidation
                                ?.jobCodeSource?.invalid
                            }
                            invalidText={
                              state.forecastSections[sectionIndex]?.sectionValidation
                                ?.jobCodeSource?.invalidText
                            }
                            placeholder="Job code"
                            name="jobCode"
                            modalHeading="Job code"
                            itemToString={(item) =>
                              item
                                ? item.jobCodeCode + " " + item.jobCodeName
                                : ""
                            }
                            selectedItem={masterData.JobCodes.find(
                              (item) =>
                                item.jobCodeID ===
                                state.forecastSections[sectionIndex]?.source?.dimensionRow
                                  ?.jobCode
                            )}
                            light={false}
                            itemToElement={(item) =>
                              item.isGroup ? <span> <strong> {"*"} {item.jobCodeCode + " " + item.jobCodeName}</strong></span>
                                : <span> {item.jobCodeCode + " " + item.jobCodeName}</span>
                            }
                            onChange={(e) =>
                              handleChange(
                                e.selectedItem ? e.selectedItem.jobCodeID : "",
                                "jobCode",
                                undefined,
                                "dimensionRow"
                              )
                            }
                            onInputChange={(inputText) => handleSearchFilter(inputText, "jobCode")}
                            hideGroupsToggle={true}
                            hideGroups={false}
                            isGroupedData={true} />
                        </div>
                        <div className={`bx--col-lg-12`}>
                          <div className={"bx--row"}>
                            <div className={"bx--col-md-11 use-group-checkbox"}>
                              <Checkbox
                                id={"useGroupTotal-jobCode-" + sectionIndex}
                                labelText={"Use group total"}
                                checked={
                                  state.forecastSections[sectionIndex]?.source?.dimensionRow
                                    ?.jobCodeGroup
                                }
                                onClick={(e) => {
                                  handleChange(
                                    e.target.checked,
                                    "jobCodeGroup",
                                    undefined,
                                    "dimensionRow"
                                  );
                                }}
                              />
                            </div>
                            <div className={"bx--col-md-1"}>
                              <TooltipIcon
                                direction="right"
                                tooltipText="Use the total value for a selected group rather than the values for each item in the group."
                                align="center"
                                className={"forecast-Model-Btn-icon"}
                              >
                                <Information16 className={localState.pageConfig.infoIconCssClass} />
                              </TooltipIcon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                  : null}

                {/* Staffing Type Code = SF in DB*/}
                {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing ?
                  <>
                    <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>

                      <div className={"bx--row"}>
                        <div className={`bx--col-lg-12`}>
                          <SingleSelectModal
                            id={"payTypesDropDown-source-" + sectionIndex}
                            data={localState.searchedData.payType}
                            gridData={dimensionGroupedData?.payTypeGroupedData}
                            invalid={
                              state.forecastSections[sectionIndex]?.sectionValidation
                                ?.payTypeSource?.invalid
                            }
                            invalidText={
                              state.forecastSections[sectionIndex]?.sectionValidation
                                ?.payTypeSource?.invalidText
                            }
                            placeholder="Pay type"
                            name="payType"
                            modalHeading="Pay type"
                            itemToString={(item) =>
                              item
                                ? item.payTypeCode + " " + item.payTypeName
                                : ""
                            }
                            selectedItem={masterData.PayTypes.find(
                              (item) =>
                                item.payTypeID ===
                                state.forecastSections[sectionIndex]?.source?.dimensionRow
                                  ?.payType
                            )}
                            light={false}
                            itemToElement={(item) =>
                              item.isGroup ? <span> <strong> {"*"} {item.payTypeCode + " " + item.payTypeName}</strong></span>
                                : <span> {item.payTypeCode + " " + item.payTypeName}</span>
                            }
                            onChange={(e) =>
                              handleChange(
                                e.selectedItem ? e.selectedItem.payTypeID : "",
                                "payType",
                                undefined,
                                "dimensionRow"
                              )
                            }
                            onInputChange={(inputText) => handleSearchFilter(inputText, "payType")}
                            hideGroupsToggle={true}
                            hideGroups={false}
                            isGroupedData={true} />
                        </div>
                        <div className={`bx--col-lg-12`}>
                          <div className={"bx--row"}>
                            <div className={"bx--col-md-11 use-group-checkbox"}>
                              <Checkbox
                                id={"useGroupTotal-payType-" + sectionIndex}
                                labelText={"Use group total"}
                                checked={
                                  state.forecastSections[sectionIndex]?.source?.dimensionRow
                                    ?.payTypeGroup
                                }
                                onClick={(e) => {
                                  handleChange(
                                    e.target.checked,
                                    "payTypeGroup",
                                    undefined,
                                    "dimensionRow"
                                  );
                                }}
                              />
                            </div>
                            <div className={"bx--col-md-1"}>
                              <TooltipIcon
                                direction="right"
                                tooltipText="Use the total value for a selected group rather than the values for each item in the group."
                                align="center"
                                className={"forecast-Model-Btn-icon"}>
                                <Information16 className={localState.pageConfig.infoIconCssClass} />
                              </TooltipIcon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                  : null}

              </div>
            </div>
          </div>
        </div>
      </>
      : null

  );
};

export default SourceSection;
