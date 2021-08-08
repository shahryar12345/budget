import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Checkbox,
  TextInput,
  TooltipIcon,
} from "carbon-components-react";
import { Information16 } from "@carbon/icons-react";
import { updateForecast } from "../../../../../core/_actions/ForecastActions";
import {
  transformBudgetVersionData,
  getBudgetVersionDataForDropDowns,
  GetSortedEntityByGroups,
  GetSortedDepartmentByHierarchyGroupe,
  GetSortedStatisticsByGroups,
  GetSortedGLAccountsByGroups,
  GetSortedJobCodeByGroups,
  GetSortedPayTypeByGroups,
} from "../../../../../helpers/DataTransform/transformData";
import { CheckRunForecastButton } from "../../ValidateForecast";
import SingleSelectModal from "../../../../shared/single-select/single-select-with-modal";
import {scenario_type_Codes} from '../../Data/scenario_type_codes'
const RatioSourceSection = ({ sectionIndex , dimensionGroupedData }) => {
  const initialLocalStates = {
    pageConfig : {
      columnWidth : 4,
      infoIconCssClass: "checkBox-info-Icon-Ratio-large"
    },
    searchedData : {
      budgetVersion:[],
      entityNumerator : [],
      entityDenominator : [],
      departmentNumerator : [],
      departmentDenominator : [],
      statisticNumerator : [],
      statisticDenominator : [],
      generalLedgerNumerator : [],
      generalLedgerDenominator : [],
      jobCodeNumerator : [],
      jobCodeDenominator : [],
      payTypeNumerator : [],
      payTypeDenominator : [],
    },
    orignalData : {
      budgetVersion:[],
      entityNumerator : [],
      entityDenominator : [],
      departmentNumerator : [],
      departmentDenominator : [],
      statisticNumerator : [],
      statisticDenominator : [],
      generalLedgerNumerator : [],
      generalLedgerDenominator : [],
      jobCodeNumerator : [],
      jobCodeDenominator : [],
      payTypeNumerator : [],
      payTypeDenominator : [],
    },
    dimnesionDetails : {
      budgetVersion : {
        name : "text",
        code : "value"
      },
      entityNumerator : {
        name : "entityName",
        code : "entityCode"
      },
      entityDenominator : {
        name : "entityName",
        code : "entityCode"
      },
      departmentNumerator : {
        name : "departmentName",
        code : "departmentCode"
      },
      departmentDenominator : {
        name : "departmentName",
        code : "departmentCode"
      },
      statisticNumerator : {
        name : "statisticsCodeName",
        code : "statisticsCode"
      },
      statisticDenominator : {
        name : "statisticsCodeName",
        code : "statisticsCode"
      },
      generalLedgerNumerator : {
        name : "glAccountName",
        code : "glAccountCode"
      },
      generalLedgerDenominator : {
        name : "glAccountName",
        code : "glAccountCode"
      },
      jobCodeNumerator : {
        name : "jobCodeName",
        code : "jobCodeCode"
      },
      jobCodeDenominator : {
        name : "jobCodeName",
        code : "jobCodeCode"
      },
      payTypeNumerator : {
        name : "payTypeName",
        code : "payTypeCode"
      },
      payTypeDenominator : {
        name : "payTypeName",
        code : "payTypeCode"
      },
    }
  };

  const state = useSelector((state) => state.ForecastReducer);
  const budgetVersionData = useSelector((state) => state.BudgetVersions.list);
  const masterData = useSelector((state) => state.MasterData);
  const [localState , setLocalState] = useState(initialLocalStates);
  let timeout;
  let itemSelected = false;
  const dispatch = useDispatch();
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

  const handleChange = (value, controlId, rowType, subType) => {
    const UpdatedforecastSections = [...state.forecastSections];
    let updatedSource;
    let updatedTarget;
    if (rowType === "dataRow") {
      updatedSource = [
        ...UpdatedforecastSections[sectionIndex].source[rowType],
      ];
      updatedSource[0][controlId] = value; // '0' because we have only 1 source in this method
      UpdatedforecastSections[sectionIndex].source[rowType] = [
        ...updatedSource,
      ];
    } else {
      // For dimensionRow
      updatedSource = JSON.parse(
        JSON.stringify(UpdatedforecastSections[sectionIndex].source[rowType])
      );
      updatedTarget = JSON.parse(
        JSON.stringify(UpdatedforecastSections[sectionIndex].target[rowType])
      );
      if (subType !== undefined) {
        // change for numerator , denominator
        let updatedSubType = updatedSource[subType]; // subType can be numerator , denominator
        updatedSubType[controlId] = value; // here controlId can be entity , department , statistic
        updatedSource[subType] = updatedSubType;

        // here Update target Value also , As per the requirment.
        updatedSubType = updatedTarget[subType];
        updatedSubType[controlId] = value;
        updatedTarget[subType] = updatedSubType;
      } else {
        updatedSource[controlId] = value; // here controlId can be  entitiesGroup, departmentsGroup ,statisticsGroup
      }
      UpdatedforecastSections[sectionIndex].source[rowType] = JSON.parse(
        JSON.stringify(updatedSource)
      );
      UpdatedforecastSections[sectionIndex].target[rowType] = JSON.parse(
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
    if(state.forecastSections[sectionIndex].forecastType !==  "ratio_staffing_hours_statistics")
    {
      updatePageConfig.columnWidth = 4 
      updatePageConfig.infoIconCssClass = "checkBox-info-Icon-Ratio-large"
    }else
    {
      updatePageConfig.columnWidth = 3 
      updatePageConfig.infoIconCssClass = "checkBox-info-Icon-Ratio" 
    }

    let fetchData = {
      budgetVersion : getBudgetVersionDataForDropDowns(budgetVersionData),
      entity :  GetSortedEntityByGroups(masterData.Entites),
      department : GetSortedDepartmentByHierarchyGroupe(masterData.Departments),
      statistic : GetSortedStatisticsByGroups(masterData.Statistics , true),
      generalLedger : GetSortedGLAccountsByGroups(masterData.GLAccounts),
      jobCode : GetSortedJobCodeByGroups(masterData.JobCodes),
      payType :  GetSortedPayTypeByGroups(masterData.PayTypes)
    }
    let mapData = {
      budgetVersion : fetchData.budgetVersion,
      entityNumerator : fetchData.entity ,
      entityDenominator : fetchData.entity ,
      departmentNumerator :  fetchData.department ,
      departmentDenominator : fetchData.department ,
      statisticNumerator  : fetchData.statistic ,
      statisticDenominator : fetchData.statistic ,
      generalLedgerNumerator : fetchData.generalLedger ,
      generalLedgerDenominator : fetchData.generalLedger ,
      jobCodeNumerator : fetchData.jobCode ,
      jobCodeDenominator : fetchData.jobCode ,
      payTypeNumerator : fetchData.payType ,
      payTypeDenominator :  fetchData.payType ,
    }
    let searchedData = localState.searchedData;
    let orignalData = localState.orignalData;
    let dimensionNames = ["budgetVersion" ,
      "entityNumerator",  "entityDenominator", "departmentNumerator", 
      "departmentDenominator", "statisticNumerator", "statisticDenominator", 
      "generalLedgerNumerator","generalLedgerDenominator", "jobCodeNumerator",
      "jobCodeDenominator", "payTypeNumerator","payTypeDenominator"];

    for(let i = 0 ;i < dimensionNames.length; i++)
    {
      searchedData[dimensionNames[i]] = [...mapData[dimensionNames[i]]];
      orignalData[dimensionNames[i]] = [...mapData[dimensionNames[i]]];
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

    state.forecastSections[sectionIndex].forecastType !== "copy" 
    && state.forecastSections[sectionIndex].forecastType !== "annualization" 
    && state.forecastSections[sectionIndex].forecastType !== "copy_staffing_hours" 
    && state.forecastSections[sectionIndex].forecastType !== "annualize_staffing_hours" 
    && state.forecastSections[sectionIndex].forecastType !== "copy_staffing_dollars" 
    && state.forecastSections[sectionIndex].forecastType !== "annualize_staffing_dollars"  ? 
    <> 
    <div>
      <div className={"bx--row"}>
        <div className={"bx--col-lg"}>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-5 source-heading"}>
              <strong>Source</strong>
            </div>
          </div>
          {/*Numerator */}
          <div className={"bx--row ratio-heading"}>
            <div className={"bx--col-lg-3"}>
              {"Historical source (numerator)"}
            </div>
          </div>

          <div className={"bx--row ratio-body"}>
            <div className={"bx--col-lg-3"}>{"Scenario type"}</div>
            <div className={"bx--col-lg-5"}>{"Budget version"}</div>
          </div>

          <div className={"bx--row ratio-body "}>
            <div className={"bx--col-lg-3"}>
              <TextInput
                id="scenarioType"
                type={"text"}
                value={state.forecast_budgetversion_scenario_type}
                disabled={true}
              />
            </div>
            {localState.orignalData.budgetVersion ? (
              <div className={"bx--col-lg-5"}>
                <SingleSelectModal
                  id={"budgetVersion-" + sectionIndex}
                  data={localState.searchedData.budgetVersion}
                  gridData={BudgetVersionDataForModalGrid}
                  name='Budget version'
                  itemToString={(item) => (item ? item.text : "")}
                  invalid={
                    state.forecastSections[sectionIndex]?.sectionValidation
                      ?.budgetversion?.invalid
                  }
                  invalidText={
                    state.forecastSections[sectionIndex]?.sectionValidation
                      ?.budgetversion?.invalidText
                  }
                  selectedItem={localState.orignalData.budgetVersion?.find(
                    (x) =>
                      x.value ===
                      state.forecastSections[sectionIndex]?.source?.dataRow[0]
                        ?.budgetversion_code
                  )}
                  onChange={(e) =>
                    handleChange(
                      e.selectedItem.value,
                      "budgetversion_code",
                      "dataRow",
                      undefined
                    )
                  }
                  onInputChange={(inputText)=> handleSearchFilter(inputText , "budgetVersion")}
                  hideGroupsToggle={true}
                  hideGroups={false}
                />
              </div>
            ) : null}
          </div>
          <br />

          {/* Numerator Row */}
          <div className={"bx--row ratio-body dimensions-containers"}>
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <SingleSelectModal
                id={"entitiesDropDown-source-Numerator-" + sectionIndex}
                data={localState.searchedData.entityNumerator}
                gridData={dimensionGroupedData?.entityGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratorentitysource?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratorentitysource?.invalidText
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
                    state.forecastSections[sectionIndex]?.source?.dimensionRow
                      ?.numerator?.entity
                )}
                onChange={(e) =>
                  handleChange(
                    e.selectedItem ? e.selectedItem.entityID : "",
                    "entity",
                    "dimensionRow",
                    "numerator"
                  )
                }
                onInputChange={(inputText)=> handleSearchFilter(inputText , "entityNumerator")}
                hideGroupsToggle={true}
                hideGroups={false}
                isGroupedData={true} />
            </div>
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <SingleSelectModal
                id={"DepartmentDropDown-source-Numerator-" + sectionIndex}
                data={localState.searchedData.departmentNumerator}
                gridData={dimensionGroupedData?.departmentGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratordepartmentsource?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratordepartmentsource?.invalidText
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
                    state.forecastSections[sectionIndex]?.source?.dimensionRow
                      ?.numerator?.department
                )}
                onChange={(e) =>
                  handleChange(
                    e.selectedItem ? e.selectedItem.departmentID : "",
                    "department",
                    "dimensionRow",
                    "numerator"
                  )
                }
                onInputChange={(inputText)=> handleSearchFilter(inputText , "departmentNumerator")}
                hideGroupsToggle={true}
                hideGroups={false}
                //titleText="Department"
                isGroupedData={true} />
            </div>
            {/* Statistics Type code = ST in DB*/}
            {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.statistics ?
            <>
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <SingleSelectModal
                id={"statistiscsDropDown-source-Numerator-" + sectionIndex}
                data={localState.searchedData.statisticNumerator}
                gridData={dimensionGroupedData?.statisticsGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratorstatisticsource?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratorstatisticsource?.invalidText
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
                selectedItem={localState.orignalData.statisticNumerator.find(
                  (item) =>
                    item.statisticsCodeID ===
                    state.forecastSections[sectionIndex]?.source?.dimensionRow
                      ?.numerator?.statistic
                )}
                onChange={(e) =>
                  handleChange(
                    e.selectedItem ? e.selectedItem.statisticsCodeID : "",
                    "statistic",
                    "dimensionRow",
                    "numerator"
                  )
                }
                onInputChange={(inputText)=> handleSearchFilter(inputText , "statisticNumerator")}
                hideGroupsToggle={true}
                hideGroups={false}
                //titleText="Statistics"
                type="default"
                isGroupedData={true} />
            </div>
            
            </> : null
            }

          {/* GL Account Type code = GL in DB*/}                  
          {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger ?             
             <>
             <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
             <SingleSelectModal
              id={"generalLedgerDropDown-source-Numerator-" + sectionIndex}
              data={localState.searchedData.generalLedgerNumerator}
              gridData={dimensionGroupedData?.glAccountGroupedData}
              invalid={
                    state.forecastSections[sectionIndex]?.sectionValidation
                      ?.numeratorgeneralLedgersource?.invalid
                  }
                  invalidText={
                    state.forecastSections[sectionIndex]?.sectionValidation
                      ?.numeratorgeneralLedgersource?.invalidText
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
                        ?.numerator?.generalLedger
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
                    "dimensionRow",
                    "numerator"
                  )
                }
                onInputChange={(inputText)=> handleSearchFilter(inputText , "generalLedgerNumerator")}
                hideGroupsToggle={true}
                hideGroups={false}
               isGroupedData={true}/>
           </div>
          </>          
            : null
          }

          {/* Staffing Type Code = SF in DB*/} 
          {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing ? 
          <>
              <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
                <SingleSelectModal
                  id={"JobCodeDropDown-source-Numerator-" + sectionIndex}
                  data={localState.searchedData.jobCodeNumerator}
                  gridData={dimensionGroupedData?.jobCodeGroupedData} 
                  invalid={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.numeratorjobCodesource?.invalid
                      }
                      invalidText={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.numeratorjobCodesource?.invalidText
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
                            ?.numerator?.jobCode
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
                        "dimensionRow",
                        "numerator"
                      )
                    }
                    onInputChange={(inputText)=> handleSearchFilter(inputText , "jobCodeNumerator")}
                    hideGroupsToggle={true}
                    hideGroups={false}
                    isGroupedData={true}/>
              </div>
          </>
          : null
          }

          {/* Staffing Type Code = SF in DB*/} 
          {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing ? 
            <>
              <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
                <SingleSelectModal
                  id={"payTypesDropDown-source-Numerator-" + sectionIndex}
                  data={localState.searchedData.payTypeNumerator}
                  gridData={dimensionGroupedData?.payTypeGroupedData}    
                  invalid={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.numeratorpayTypesource?.invalid
                      }
                      invalidText={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.numeratorpayTypesource?.invalidText
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
                            ?.numerator?.payType
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
                        "dimensionRow",
                        "numerator"
                      )
                    }
                    onInputChange={(inputText)=> handleSearchFilter(inputText , "payTypeNumerator")}
                    hideGroupsToggle={true}
                    hideGroups={false}
                    isGroupedData={true}/>
              </div>
          </>
          : null
          }
          </div>

          {/*Denominator  Row*/}
          <br />
          <div className={"bx--row ratio-heading"}>
            <div className={"bx--col-lg"}>Historical denominator</div>
          </div>
          <br /> 
          <div className={"bx--row ratio-body dimensions-containers"}>
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <div className={"bx--row"}>
              <div className={`bx--col-lg-12`}>
              <SingleSelectModal
                id={"entitiesDropDown-source-Denominator-" + sectionIndex}
                data={localState.searchedData.entityDenominator}
                gridData={dimensionGroupedData?.entityGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.denominatorentitysource?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.denominatorentitysource?.invalidText
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
                    state.forecastSections[sectionIndex]?.source?.dimensionRow
                      ?.denominator?.entity
                )}
                onChange={(e) =>
                  handleChange(
                    e.selectedItem ? e.selectedItem.entityID : "",
                    "entity",
                    "dimensionRow",
                    "denominator"
                  )
                }
                onInputChange={(inputText)=> handleSearchFilter(inputText , "entityDenominator")}
                hideGroupsToggle={true}
                hideGroups={false}
                isGroupedData={true} />
              </div>  
              <div className={`bx--col-lg-12`}>
                <div className={"bx--row"}>
                <div className={"bx--col-md-11 use-group-checkbox"}>
                      <Checkbox
                      id={"useGroupTotal-entities-source-" + sectionIndex}
                      labelText={"Use group total"}
                      checked={
                        state.forecastSections[sectionIndex]?.source?.dimensionRow
                          ?.entitiesGroup
                      }
                      onClick={(e) => {
                        handleChange(
                          e.target.checked,
                          "entitiesGroup",
                          "dimensionRow",
                          undefined
                        );
                      }}
                    />
                </div>
                  <div className={"bx--col-md-1"}>
                      <TooltipIcon
                        direction="right"
                        tooltipText="Use the total value for a selected group rather than the values for each item in the group."
                        align="start">
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
                      id={"DepartmentDropDown-source-Denominator-" + sectionIndex}
                      data={localState.searchedData.departmentDenominator}
                      gridData={dimensionGroupedData?.departmentGroupedData}
                      ariaLabel="Choose an item"                     
                      invalid={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.denominatordepartmentsource?.invalid
                      }
                      invalidText={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.denominatordepartmentsource?.invalidText
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
                          state.forecastSections[sectionIndex]?.source?.dimensionRow
                            ?.denominator?.department
                      )}
                      onChange={(e) =>
                        handleChange(
                          e.selectedItem ? e.selectedItem.departmentID : "",
                          "department",
                          "dimensionRow",
                          "denominator"
                        )
                      }
                      onInputChange={(inputText)=> handleSearchFilter(inputText , "departmentDenominator")}
                      hideGroupsToggle={true}
                      hideGroups={false}
                      isGroupedData={true} />
                    </div>
                  <div className={`bx--col-lg-12`}>
                    <div className={"bx--row"}>
                      <div className={"bx--col-md-11 use-group-checkbox"}>
                      <Checkbox
                          id={"useGroupTotal-dept-source-" + sectionIndex}
                          labelText={"Use group total"}
                          checked={
                            state.forecastSections[sectionIndex]?.source?.dimensionRow
                              ?.departmentsGroup
                          }
                          onClick={(e) => {
                            handleChange(
                              e.target.checked,
                              "departmentsGroup",
                              "dimensionRow",
                              undefined
                            );
                          }}
                        />
                      </div>
                      <div className={"bx--col-md-1"}>
                      <TooltipIcon
                        direction="right"
                        tooltipText="Use the total value for a selected group rather than the values for each item in the group."
                        align="start">
                        <Information16 className={localState.pageConfig.infoIconCssClass} />
                      </TooltipIcon>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            
            {/* Statistics Type code = ST in DB*/}
            {/* Show this field in only some cases , statistics from statistic OR GL from statistics OR Staffing hours from Statistics*/}
            {(state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.statistics
            || (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger
                && state.forecastSections[sectionIndex].forecastType === "ratioGL_Statistics")
            || (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing
              && state.forecastSections[sectionIndex].forecastType === "ratio_staffing_hours_statistics")) ?
            <>  
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
            <div className={"bx--row"}>
                  <div className={`bx--col-lg-12`}>
                    <SingleSelectModal
                      id={"statistiscsDropDown-source-Denominator-" + sectionIndex}
                      data={localState.searchedData.statisticDenominator}
                      gridData={dimensionGroupedData?.statisticsGroupedData}
                      invalid={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.denominatorstatisticsource?.invalid
                      }
                      invalidText={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.denominatorstatisticsource?.invalidText
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
                      selectedItem={localState.orignalData.statisticDenominator.find(
                        (item) =>
                          item.statisticsCodeID ===
                          state.forecastSections[sectionIndex]?.source?.dimensionRow
                            ?.denominator?.statistic
                      )}
                      onChange={(e) =>
                        handleChange(
                          e.selectedItem ? e.selectedItem.statisticsCodeID : "",
                          "statistic",
                          "dimensionRow",
                          "denominator"
                        )
                      }
                      onInputChange={(inputText)=> handleSearchFilter(inputText , "statisticDenominator")}
                      hideGroupsToggle={true}
                      hideGroups={false}
                      isGroupedData={true} />
                  </div>
                  <div className={`bx--col-lg-12`}>
                      <div className={"bx--row"}>
                        <div className={"bx--col-md-11 use-group-checkbox"}>
                          <Checkbox
                              id={"useGroupTotal-statistics-source-" + sectionIndex}
                              labelText={"Use group total"}
                              checked={
                                state.forecastSections[sectionIndex]?.source?.dimensionRow
                                  ?.statisticsGroup
                              }
                              onClick={(e) => {
                                handleChange(
                                  e.target.checked,
                                  "statisticsGroup",
                                  "dimensionRow",
                                  undefined
                                );
                              }}
                          />
                        </div>
                        <div className={"bx--col-md-1"}>
                          <TooltipIcon
                              direction="right"
                              tooltipText="Use the total value for a selected group rather than the values for each item in the group."
                              align="start">
                              <Information16 className={localState.pageConfig.infoIconCssClass} />
                          </TooltipIcon>
                        </div>
                      </div>
                  </div>
            </div>
            </div>
            </> 
            : null}

            {/* General Ledger Type code = GL in DB*/}
            {(state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger
              && state.forecastSections[sectionIndex].forecastType === "ratio") ? 
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <div className={"bx--row"}>
                  <div className={`bx--col-lg-12`}>
                    <SingleSelectModal
                      id={"generalLedgerDropDown-source-Denominator-" + sectionIndex}
                      data={localState.searchedData.generalLedgerDenominator}
                      gridData={dimensionGroupedData?.glAccountGroupedData}
                      invalid={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.denominatorgeneralLedgersource?.invalid
                        }
                        invalidText={
                          state.forecastSections[sectionIndex]?.sectionValidation
                          ?.denominatorgeneralLedgersource?.invalidText
                        }
                      placeholder="GL account"
                      name="GLAccounts"
                      itemToString={(item) =>
                        item
                          ? item.glAccountCode + " " + item.glAccountName
                          : ""
                      }
                      light={false}
                      itemToElement = {(item) =>
                        item.isGroup ? <span> <strong> {"*"} {item.glAccountCode + " " + item.glAccountName}</strong></span> 
                        : <span> {item.glAccountCode + " " + item.glAccountName}</span> 
                      }    
                      selectedItem={masterData.GLAccounts.find(
                        (item) =>
                          item.glAccountID ===
                          state.forecastSections[sectionIndex]?.source?.dimensionRow
                            ?.denominator?.generalLedger
                      )}
                      onChange={(e) =>
                        handleChange(
                          e.selectedItem ? e.selectedItem.glAccountID : "",
                          "generalLedger",
                          "dimensionRow",
                          "denominator"
                        )
                      }
                      onInputChange={(inputText)=> handleSearchFilter(inputText , "generalLedgerDenominator")}
                      hideGroupsToggle={true}
                      hideGroups={false}
                      isGroupedData={true}/>
                  </div>
                  <div className={`bx--col-lg-12`}>
                    <div className={"bx--row"}>
                        <div className={"bx--col-md-11 use-group-checkbox"}>
                        <Checkbox
                            id={"useGroupTotal-generalLedger-source-" + sectionIndex}
                            labelText={"Use group total"}
                            checked={
                              state.forecastSections[sectionIndex]?.source?.dimensionRow
                                ?.generalLedgerGroup
                            }
                            onClick={(e) => {
                              handleChange(
                                e.target.checked,
                                "generalLedgerGroup",
                                "dimensionRow",
                                undefined
                              );
                            }}
                          />
                        </div>
                        <div className={"bx--col-md-1"}>
                        <TooltipIcon
                          direction="right"
                          tooltipText="Use the total value for a selected group rather than the values for each item in the group."
                          align="start">
                          <Information16 className={localState.pageConfig.infoIconCssClass} />
                        </TooltipIcon>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
            : null}
          </div>
        </div>
      </div>
    </div>
    </>
    : null
  );
};

export default RatioSourceSection;
