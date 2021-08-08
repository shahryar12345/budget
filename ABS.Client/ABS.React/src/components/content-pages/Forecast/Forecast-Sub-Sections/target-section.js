import React, { useState, useEffect } from "react";
import { Checkbox, Dropdown, TooltipIcon } from "carbon-components-react";
import { useSelector, useDispatch } from "react-redux";
import { Information16 } from "@carbon/icons-react";
import ItemsMonths from "../../MasterData/itemsMonths";
import { updateForecast } from "../../../../core/_actions/ForecastActions";
import { CheckRunForecastButton } from "../ValidateForecast";
import { 
  GetSortedEntityByGroups,
  GetSortedDepartmentByHierarchyGroupe,
  GetSortedStatisticsByGroups,
  GetSortedGLAccountsByGroups,
  GetSortedJobCodeByGroups,
  GetSortedPayTypeByGroups,
} from "../../../../helpers/DataTransform/transformData";
import SingleSelectModal from "../../../shared/single-select/single-select-with-modal";
import {scenario_type_Codes} from '../Data/scenario_type_codes'
import config from '../../../../helpers/DataTransform/data-transform-config';

const TargetSection = ({ sectionIndex, sectionType ,dimensionGroupedData}) => {
  const initialLocalStates = {
    pageConfig : {
      columnWidth : 4,
      infoIconCssClass: "checkBox-info-Icon-large"
    },
    searchedData : {
      entity : [],
      department : [],
      statistic : [],
      generalLedger : [],
      jobCode : [],
      payType : [],
    },
    orignalData : {
      entity : [],
      department : [],
      statistic : [],
      generalLedger : [],
      jobCode : [],
      payType : [],
    },
    dimnesionDetails : {
      entity : {
        name : "entityName",
        code : "entityCode"
      },
      department : {
        name : "departmentName",
        code : "departmentCode"
      },
      statistic : {
        name : "statisticsCodeName",
        code : "statisticsCode"
      },
      generalLedger : {
        name : "glAccountName",
        code : "glAccountCode"
      },
      jobCode : {
        name : "jobCodeName",
        code : "jobCodeCode"
      },
      payType : {
        name : "payTypeName",
        code : "payTypeCode"
      },
    }
  };

  const state = useSelector((state) => state.ForecastReducer);
  const masterData = useSelector((state) => state.MasterData);
  const [localState , setLocalState] = useState(initialLocalStates);
  let timeout;
  let itemSelected = false;

  const ItemMonthsUpdated = [
    { id: "notSelected", value: "notSelected", text: "Choose one" },
    ...ItemsMonths,
  ];

  const dispatch = useDispatch();
  // Generic function for all field which are in this component.
  const handleChange = (value, controlId, rowType) => {
    const UpdatedforecastSections = [...state.forecastSections];
    let updatedTarget;
    if (rowType === "dimensionRow") {
      updatedTarget = JSON.parse(
        JSON.stringify(UpdatedforecastSections[sectionIndex].target[rowType])
      );
      updatedTarget[controlId] = value;
      UpdatedforecastSections[sectionIndex].target[rowType] = JSON.parse(
        JSON.stringify(updatedTarget)
      );
    } else {
      updatedTarget = JSON.parse(
        JSON.stringify(UpdatedforecastSections[sectionIndex].target[rowType][0])
      );
      updatedTarget[controlId] = value;
      UpdatedforecastSections[sectionIndex].target[rowType][0] = JSON.parse(
        JSON.stringify(updatedTarget)
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
    if(state.forecastSections[sectionIndex].forecastType !==  "copy_staffing_hours" &&
       state.forecastSections[sectionIndex].forecastType !==  "annualize_staffing_hours" &&
       state.forecastSections[sectionIndex].forecastType !==  "copy_staffing_dollars" &&
       state.forecastSections[sectionIndex].forecastType !==  "annualize_staffing_dollars"
       )
    {
      updatePageConfig.columnWidth = 4 
      updatePageConfig.infoIconCssClass = "checkBox-info-Icon-large" 
    }else
    {
      updatePageConfig.columnWidth = 3 
      updatePageConfig.infoIconCssClass = "checkBox-info-Icon" 
    }

    let fetchData = {
      entity :  GetSortedEntityByGroups(masterData.Entites),
      department : GetSortedDepartmentByHierarchyGroupe(masterData.Departments),
      statistic : GetSortedStatisticsByGroups(masterData.Statistics , true),
      generalLedger : GetSortedGLAccountsByGroups(masterData.GLAccounts),
      jobCode : GetSortedJobCodeByGroups(masterData.JobCodes),
      payType :  GetSortedPayTypeByGroups(masterData.PayTypes)
    }
    let searchedData = localState.searchedData;
    let orignalData = localState.orignalData;
    let dimensionNames = ["entity" , "department" , "statistic" 
    , "generalLedger" ,  "jobCode" , "payType"];
    for(let i = 0 ;i < dimensionNames.length; i++)
    {
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
    setLocalState({...localState  , pageConfig : updatePageConfig , searchedData : searchedData , orignalData : orignalData});
  } , [masterData])

    const handleSearchFilter = (inputText , dimensionName) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        let searcedData = localState.searchedData;
        let orignalData = localState.orignalData;
        let dimensionDetail = localState.dimnesionDetails;
        let searchedResult = [];
        if(inputText && !itemSelected)
        {
          searchedResult = orignalData[dimensionName].filter((data) => {
            let CodeAndName = data[dimensionDetail[dimensionName].code] + " " + data[dimensionDetail[dimensionName].name];
            return data[dimensionDetail[dimensionName].name].toLowerCase().includes(inputText.toLowerCase()) 
            || data[dimensionDetail[dimensionName].code].toLowerCase().includes(inputText.toLowerCase()) 
            || CodeAndName.toLowerCase().includes(inputText.toLowerCase());
          })
        }else
        {
          searchedResult = [...orignalData[dimensionName]];
        }
        searcedData[dimensionName] = [...searchedResult]
        setLocalState({
          ...localState,
          searchedData : searcedData
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
    || state.forecastSections[sectionIndex].forecastType === "annualize_staffing_dollars"  ? 
    <>  
    <div className={"target-container"}>
      {/* TARGET DIMENSION ROW */}
      <div className={"bx--row "}>
        <div className={"bx--col-lg"}>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-5"}>
              <strong>
                {sectionType === "annualization" ? "Annualize " : "Copy "}{" "}
                target
              </strong>
            </div>
          </div>
          <div className={"bx--row dimensions-containers"}>
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <SingleSelectModal
                id={"entitiesDropDown-target-" + sectionIndex}
                data={localState.searchedData.entity}
                gridData={dimensionGroupedData?.entityGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.entityTarget?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.entityTarget?.invalidText
                }
                name="Entity"
                itemToString={(item) =>
                  item ? item.entityCode + " " + item.entityName : ""
                }
                itemToElement = {(item) =>
                  item.isGroup ? <span> <strong> {"*"} {item.entityCode + " " + item.entityName}</strong></span> 
                  : <span> {item.entityCode + " " + item.entityName}</span> 
                  }
                selectedItem={masterData.Entites.find(
                  (item) =>
                    item.entityID ===
                    state.forecastSections[sectionIndex]?.target?.dimensionRow
                      ?.entity
                )}
                onChange={(e) =>
                  handleChange(
                    e.selectedItem ? e.selectedItem.entityID : "",
                    "entity",
                    "dimensionRow"
                  )
                }
                onInputChange={(inputText)=> handleSearchFilter(inputText , "entity")}
                hideGroupsToggle={true}
                hideGroups={false}
                isGroupedData={true} />
            </div>
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <SingleSelectModal
                id={"DepartmentDropDown-target-" + sectionIndex}
                data={localState.searchedData.department}
                gridData={dimensionGroupedData?.departmentGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.departmentTarget?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.departmentTarget?.invalidText
                }
                name="Department"
                itemToString={(item) =>
                  item ? item.departmentCode + " " + item.departmentName : ""
                }
                itemToElement = {(item) =>
                  item.isGroup || item.isHierarchy ? <span> <strong> {"*"} {item.departmentCode + " " + item.departmentName}</strong></span> 
                  : <span> {item.departmentCode + " " + item.departmentName}</span> 
                }
                selectedItem={masterData.Departments.find(
                  (item) =>
                    item.departmentID ===
                    state.forecastSections[sectionIndex]?.target?.dimensionRow
                      ?.department
                )}
                onChange={(e) =>
                  handleChange(
                    e.selectedItem ? e.selectedItem.departmentID : "",
                    "department",
                    "dimensionRow"
                  )
                }
                onInputChange={(inputText)=> handleSearchFilter(inputText , "department")}
                hideGroupsToggle={true}
                hideGroups={false}
                isGroupedData={true} />
            </div>
           
            {/* Statistics Type = ST in DB*/}
          {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.statistics ?    
          <>
           <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <SingleSelectModal
                id={"statistiscsDropDown-target-" + sectionIndex}
                data={localState.searchedData.statistic}
                gridData={dimensionGroupedData?.statisticsGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.statisticTarget?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.statisticTarget?.invalidText
                }
                name="Statistics"
                itemToString={(item) =>
                  item
                    ? item.statisticsCode + " " + item.statisticsCodeName
                    : ""
                }
                itemToElement = {(item) =>
                  item.isGroup ? <span> <strong> {"*"} {item.statisticsCode + " " + item.statisticsCodeName}</strong></span> 
                  : <span> {item.statisticsCode + " " + item.statisticsCodeName}</span> 
                }
                selectedItem={localState?.orignalData?.statistic.find(
                  (item) =>
                    item.statisticsCodeID ===
                    state.forecastSections[sectionIndex]?.target?.dimensionRow
                      ?.statistic
                )}
                onChange={(e) =>
                  handleChange(
                    e.selectedItem ? e.selectedItem.statisticsCodeID : "",
                    "statistic",
                    "dimensionRow"
                  )
                }
                onInputChange={(inputText)=> handleSearchFilter(inputText , "statistic")}
                hideGroupsToggle={true}
                hideGroups={false}
                isGroupedData={true} />
            </div>
          </>
          : null}
          
          {/* GL Account Type = GL in DB*/}    
          {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger ?    
          <>
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <SingleSelectModal
                id={"generalLedgerDropDown-target-" + sectionIndex}
                data={localState.searchedData.generalLedger}
                gridData={dimensionGroupedData?.glAccountGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.generalLedgerTarget?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.generalLedgerTarget?.invalidText
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
                      state.forecastSections[sectionIndex]?.target?.dimensionRow
                        ?.generalLedger
                  )}               
                light={false}
                itemToElement = {(item) =>
                  item.isGroup ? <span> <strong> {"*"} {item.glAccountCode + " " + item.glAccountName}</strong></span> 
                  : <span> {item.glAccountCode + " " + item.glAccountName}</span> 
                }    
                onChange={(e) =>
                  handleChange(
                    e.selectedItem ? e.selectedItem.glAccountID : "",
                    "generalLedger",
                    "dimensionRow"
                  )
                }
                onInputChange={(inputText)=> handleSearchFilter(inputText , "generalLedger")}
                hideGroupsToggle={true}
                hideGroups={false}
                isGroupedData={true}/>
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
                      id={"JobCodeDropDown-target-" + sectionIndex}
                      data={localState.searchedData.jobCode}
                          gridData={dimensionGroupedData?.jobCodeGroupedData}
                          invalid={
                            state.forecastSections[sectionIndex]?.sectionValidation
                              ?.jobCodeTarget?.invalid
                          }
                          invalidText={
                            state.forecastSections[sectionIndex]?.sectionValidation
                              ?.jobCodeTarget?.invalidText
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
                              state.forecastSections[sectionIndex]?.target?.dimensionRow
                                ?.jobCode
                          )}
                          light={false}
                          itemToElement = {(item) =>
                            item.isGroup ? <span> <strong> {"*"} {item.jobCodeCode + " " + item.jobCodeName}</strong></span> 
                            : <span> {item.jobCodeCode + " " + item.jobCodeName}</span> 
                          }    
                          onChange={(e) =>
                            handleChange(
                              e.selectedItem ? e.selectedItem.jobCodeID : "",
                              "jobCode",
                              "dimensionRow"
                            )
                          }
                          onInputChange={(inputText)=> handleSearchFilter(inputText , "jobCode")}
                          hideGroupsToggle={true}
                          hideGroups={false}
                          isGroupedData={true}/>
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
                      id={"payTypesDropDown-target-" + sectionIndex}
                      data={localState.searchedData.payType}
                          gridData={dimensionGroupedData?.payTypeGroupedData}  
                          invalid={
                            state.forecastSections[sectionIndex]?.sectionValidation
                              ?.payTypeTarget?.invalid
                          }
                          invalidText={
                            state.forecastSections[sectionIndex]?.sectionValidation
                              ?.payTypeTarget?.invalidText
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
                              state.forecastSections[sectionIndex]?.target?.dimensionRow
                                ?.payType
                          )}
                          light={false}
                          itemToElement = {(item) =>
                            item.isGroup ? <span> <strong> {"*"} {item.payTypeCode + " " + item.payTypeName}</strong></span> 
                            : <span> {item.payTypeCode + " " + item.payTypeName}</span> 
                          }      
                          onChange={(e) =>
                            handleChange(
                              e.selectedItem ? e.selectedItem.payTypeID : "",
                              "payType",
                              "dimensionRow"
                            )
                          }
                          onInputChange={(inputText)=> handleSearchFilter(inputText , "payType")}
                          hideGroupsToggle={true}
                          hideGroups={false}
                          isGroupedData={true}/>
                    </div>
                </div>
              </div>          
            </>
          : null}

          </div>
        </div>
      </div>

      {/* TARGET DATA ROW  -- ONLY SHOW IN ANNUALIZATION SECTION TYPE*/}
      {sectionType === "annualization" ? (
        <div className={"bx--row"}>
          <div className={"bx--col-lg"}>
            <br/><br/>
            <div className={"bx--row"}>
              <div className={"bx--col-lg-5"}>
                Months to annualize in budget version
              </div>
            </div>
            <div className={"bx--row"}>
              <div className={"bx--col-lg-5"}>
                Include
              </div>
            </div>
            <div className={"bx--row"}>
              <div className={"bx--col-lg-2"}>{"Start month"}</div>
              <div className={"bx--col-lg-2"}>{"End month"}</div>
            </div>

            <div className={"bx--row"}>
              <div className={"bx--col-lg-2"}>
                <Dropdown
                  id={"monthInclude-start-month-" + sectionIndex}
                  type="text"
                  invalidText={state.forecastSections[sectionIndex]?.sectionValidation
                    ?.targetStartMonth?.invalidText}
                  invalid={state.forecastSections[sectionIndex]?.sectionValidation
                    ?.targetStartMonth?.invalid}
                  items={ItemMonthsUpdated}
                  itemToString={(item) => (item ? item.text : "")}
                  initialSelectedItem={{ text: "dummy item" }}
                  selectedItem={ItemMonthsUpdated.find(
                    (x) =>
                      x.value ===
                      state.forecastSections[sectionIndex]?.target?.dataRow[0]
                        ?.includeStartMonth
                  )}
                  onChange={(e) =>
                    handleChange(
                      e.selectedItem.value,
                      "includeStartMonth",
                      "dataRow"
                    )
                  }
                />
              </div>
              <div className={"bx--col-lg-2"}>
                <Dropdown
                  id={"monthInclude-end-month-" + sectionIndex}
                  type="text"
                  items={ItemMonthsUpdated}
                  invalidText={state.forecastSections[sectionIndex]?.sectionValidation
                    ?.targetEndMonth?.invalidText}
                  invalid={state.forecastSections[sectionIndex]?.sectionValidation
                    ?.targetEndMonth?.invalid}
                  itemToString={(item) => (item ? item.text : "")}
                  initialSelectedItem={{ text: "dummy item" }}
                  selectedItem={ItemMonthsUpdated.find(
                    (x) =>
                      x.value ===
                      state.forecastSections[sectionIndex]?.target?.dataRow[0]
                        ?.includeEndMonth
                  )}
                  onChange={(e) =>
                    handleChange(
                      e.selectedItem.value,
                      "includeEndMonth",
                      "dataRow"
                    )
                  }
                />
              </div>
              <div className={"bx--col-lg-3"}>
                <div className={"bx--row"}>
                  <div className={"bx--col-md-11"}>
                    <Checkbox
                    id={"MaintainSeasonalityCheckBox-" + sectionIndex}
                    labelText={"Maintain seasonality"}
                    checked={
                      state.forecastSections[sectionIndex]?.target?.dataRow[0]
                        ?.maintainSeasonality
                    }
                    onClick={(e) => {
                      handleChange(
                        e.target.checked,
                        "maintainSeasonality",
                        "dataRow"
                      );
                    }}
                  />
                  </div>
                  <div className={"bx--col-md-1"}>
                    <TooltipIcon
                    direction="right"
                    tooltipText="Retain monthly proportional changes over source data."
                    align="center"
                    className={"forecast-Model-Btn-icon"}
                    >
                      <Information16 className={"checkbox-maintain-season-icon"} />
                    </TooltipIcon>                    
                  </div>
                </div>
              </div>
              <div className={"bx--col-lg-1"}>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
    </>
    : null
  );
};

export default TargetSection;
