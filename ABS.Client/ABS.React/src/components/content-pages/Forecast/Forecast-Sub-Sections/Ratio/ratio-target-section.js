import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Checkbox,
  TooltipIcon,
} from "carbon-components-react";
import { Information16 } from "@carbon/icons-react";
import { updateForecast } from "../../../../../core/_actions/ForecastActions";
import {
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

const RatioTargetSection = ({ sectionIndex , dimensionGroupedData }) => {

  const initialLocalStates = {
    pageConfig : {
      columnWidth : 4,
      infoIconCssClass: "checkBox-info-Icon-Ratio-large"
    },
    searchedData : {
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
  const masterData = useSelector((state) => state.MasterData);
  const [localState , setLocalState] = useState(initialLocalStates);
  let timeout;
  let itemSelected = false;
  const dispatch = useDispatch();

  const handleChange = (value, controlId, rowType, subType) => {
    const UpdatedforecastSections = [...state.forecastSections];
    let updatedTarget;

    updatedTarget = JSON.parse(
      JSON.stringify(UpdatedforecastSections[sectionIndex].target[rowType])
    );
    if (subType !== undefined) {
      // change for numerator , denominator
      let updatedSubType = updatedTarget[subType]; // subType can be numerator , denominator
      updatedSubType[controlId] = value; // here controlId can be entity , department , statistic
      updatedTarget[subType] = updatedSubType;
    } else {
      updatedTarget[controlId] = value; // here controlId can be  entitiesGroup, departmentsGroup ,statisticsGroup
    }
    UpdatedforecastSections[sectionIndex].target[rowType] = JSON.parse(
      JSON.stringify(updatedTarget)
    );
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
      entity :  GetSortedEntityByGroups(masterData.Entites),
      department : GetSortedDepartmentByHierarchyGroupe(masterData.Departments),
      statistic : GetSortedStatisticsByGroups(masterData.Statistics , true),
      generalLedger : GetSortedGLAccountsByGroups(masterData.GLAccounts),
      jobCode : GetSortedJobCodeByGroups(masterData.JobCodes),
      payType :  GetSortedPayTypeByGroups(masterData.PayTypes)
    }
    let mapData = {
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
    let dimensionNames = [
      "entityNumerator",  "entityDenominator", "departmentNumerator", 
      "departmentDenominator", "statisticNumerator", "statisticDenominator", 
      "generalLedgerNumerator","generalLedgerDenominator", "jobCodeNumerator",
      "jobCodeDenominator", "payTypeNumerator","payTypeDenominator"];

    for(let i = 0 ;i < dimensionNames.length; i++)
    {
      searchedData[dimensionNames[i]] = [...mapData[dimensionNames[i]]];
      orignalData[dimensionNames[i]] = [...mapData[dimensionNames[i]]];
    }

    setLocalState({...localState  , pageConfig : updatePageConfig});
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
      <div className={"bx--row target-container"}>
        <div className={"bx--col-lg"}>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-5 source-heading"}>
              <strong>Target</strong>
            </div>
          </div>

          {/*Numerator Row*/}

          <div className={"bx--row ratio-heading"}>
            <div className={"bx--col-lg-3"}>{"Result  (numerator)"}</div>
          </div>
          <br />
          <div className={"bx--row ratio-body dimensions-containers"}>
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>                    
                    <SingleSelectModal
                      id={"entitiesDropDown-target-Numerator-" + sectionIndex}
                      data={localState.searchedData.entityNumerator}
                      gridData={dimensionGroupedData?.entityGroupedData}
                      invalid={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.numeratorentitytarget?.invalid
                      }
                      invalidText={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.numeratorentitytarget?.invalidText
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
                      isGroupedData={true} 
                      hideGroupsToggle={true}
                      hideGroups={false}
                      />           
            </div>
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <SingleSelectModal
                id={"DepartmentDropDown-target-Numerator-" + sectionIndex}
                data={localState.searchedData.departmentNumerator}
                gridData={dimensionGroupedData?.departmentGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratordepartmenttarget?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratordepartmenttarget?.invalidText
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
                isGroupedData={true} />
            </div>
            
            {/* Statistics Type Code = ST in DB*/}
            
            {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.statistics ?
          <>           
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <SingleSelectModal
                id={"statistiscsDropDown-target-Numerator-" + sectionIndex}
                data={localState.searchedData.statisticNumerator}
                gridData={dimensionGroupedData?.statisticsGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratorstatistictarget?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratorstatistictarget?.invalidText
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
                    state.forecastSections[sectionIndex]?.target?.dimensionRow
                      ?.numerator?.statistic
                )}
                light={false}
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
                isGroupedData={true} />
            </div>
          
          </>
              :null}
          
          {/* GL Account Type Code = GL in DB*/}  
          {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger ?
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              <SingleSelectModal
                id={"generalLedgerDropDown-target-Numerator-" + sectionIndex}
                data={localState.searchedData.generalLedgerNumerator}
                gridData={dimensionGroupedData?.glAccountGroupedData}
                invalid={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratorgeneralLedgertarget?.invalid
                }
                invalidText={
                  state.forecastSections[sectionIndex]?.sectionValidation
                    ?.numeratorgeneralLedgertarget?.invalidText
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
          :null}   


         {/* Staffing Type Code = SF in DB*/} 
          {state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing ? 
          <>
              <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
                <SingleSelectModal
                  id={"JobCodeDropDown-target-Numerator-" + sectionIndex}
                  data={localState.searchedData.jobCodeNumerator}
                  gridData={dimensionGroupedData?.jobCodeGroupedData} 
                  invalid={
                    state.forecastSections[sectionIndex]?.sectionValidation
                      ?.numeratorjobCodetarget?.invalid
                  }
                  invalidText={
                    state.forecastSections[sectionIndex]?.sectionValidation
                      ?.numeratorjobCodetarget?.invalidText
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
                  id={"payTypesDropDown-target-Numerator-" + sectionIndex}
                  data={localState.searchedData.payTypeNumerator}
                  gridData={dimensionGroupedData?.payTypeGroupedData}    
                  invalid={
                    state.forecastSections[sectionIndex]?.sectionValidation
                      ?.numeratorpayTypetarget?.invalid
                  }
                  invalidText={
                    state.forecastSections[sectionIndex]?.sectionValidation
                      ?.numeratorpayTypetarget?.invalidText
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

          {/*Denominator Row*/}
          <br />
          <div className={"bx--row ratio-heading"}>
            <div className={"bx--col-lg"}>Driver (denominator)</div>
          </div>
          <br />

          <div className={"bx--row ratio-body dimensions-containers"}>
            <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>             
              <div className={"bx--row"}>
                  <div className={`bx--col-lg-12`}> 
                    <SingleSelectModal
                      id={"entitiesDropDown-target-Denominator-" + sectionIndex}
                      data={localState.searchedData.entityDenominator}
                      gridData={dimensionGroupedData?.entityGroupedData}
                      invalid={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.denominatorentitytarget?.invalid
                      }
                      invalidText={
                        state.forecastSections[sectionIndex]?.sectionValidation
                          ?.denominatorentitytarget?.invalidText
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
                            ?.denominator?.entity
                      )}
                      light={false}
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
                          id={"useGroupTotal-entities-target-" + sectionIndex}
                          labelText={"Use group total"}
                          checked={
                            state.forecastSections[sectionIndex]?.target?.dimensionRow
                              ?.entitiesGroup
                          }
                          disabled={
                            !state.forecastSections[sectionIndex]?.source?.dimensionRow
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
                        id={"DepartmentDropDown-target-Denominator-" + sectionIndex}
                        data={localState.searchedData.departmentDenominator}
                        gridData={dimensionGroupedData?.departmentGroupedData}
                        invalid={
                          state.forecastSections[sectionIndex]?.sectionValidation
                            ?.denominatordepartmenttarget?.invalid
                        }
                        invalidText={
                          state.forecastSections[sectionIndex]?.sectionValidation
                            ?.denominatordepartmenttarget?.invalidText
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
                              ?.denominator?.department
                        )}
                        light={false}
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
                            id={"useGroupTotal-dept-target-" + sectionIndex}
                            labelText={"Use group total"}
                            checked={
                              state.forecastSections[sectionIndex]?.target?.dimensionRow
                                ?.departmentsGroup
                            }
                            disabled={
                              !state.forecastSections[sectionIndex]?.source?.dimensionRow
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
            
            {/* Statistics Type Code = ST in DB*/}
            {/* Show this field in only two cases , statistics from statistic OR GL from statistics */}
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
                        id={"statistiscsDropDown-target-Denominator-" + sectionIndex}
                        data={localState.searchedData.statisticDenominator}
                        gridData={dimensionGroupedData?.statisticsGroupedData}
                        invalid={
                          state.forecastSections[sectionIndex]?.sectionValidation
                            ?.denominatorstatistictarget?.invalid
                        }
                        invalidText={
                          state.forecastSections[sectionIndex]?.sectionValidation
                            ?.denominatorstatistictarget?.invalidText
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
                            state.forecastSections[sectionIndex]?.target?.dimensionRow
                              ?.denominator?.statistic
                        )}
                        light={false}
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
                            id={"useGroupTotal-statistics-target-" + sectionIndex}
                            labelText={"Use group total"}
                            checked={
                              state.forecastSections[sectionIndex]?.target?.dimensionRow
                                ?.statisticsGroup
                            }
                            disabled={
                              !state.forecastSections[sectionIndex]?.source?.dimensionRow
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
            : null
           }

           {/* GL Account Type Code = GL in DB*/}
           {(state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger
              && state.forecastSections[sectionIndex].forecastType === "ratio") ? 
          <div className={`bx--col-lg-${localState.pageConfig.columnWidth}`}>
              
              <div className={"bx--row"}>
                <div className={`bx--col-lg-12`}> 
                  <SingleSelectModal
                    id={"generalLedgerDropDown-target-Denominator-" + sectionIndex}
                    data={localState.searchedData.generalLedgerDenominator}
                    gridData={dimensionGroupedData?.glAccountGroupedData}
                    invalid={
                      state.forecastSections[sectionIndex]?.sectionValidation
                        ?.denominatorgeneralLedgertarget?.invalid
                    }
                    invalidText={
                      state.forecastSections[sectionIndex]?.sectionValidation
                        ?.denominatorgeneralLedgertarget?.invalidText
                    }
                    placeholder="GL account"
                    name="GLAccounts"
                    itemToString={(item) =>
                      item
                        ? item.glAccountCode + " " + item.glAccountName
                        : ""
                    }
                    selectedItem={masterData.GLAccounts.find(
                      (item) =>
                        item.glAccountID ===
                        state.forecastSections[sectionIndex]?.target?.dimensionRow
                          ?.denominator?.generalLedger
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
                          id={"useGroupTotal-generalLedger-target-" + sectionIndex}
                          labelText={"Use group total"}
                          checked={
                            state.forecastSections[sectionIndex]?.target?.dimensionRow
                              ?.generalLedgerGroup
                          }
                          disabled={
                            !state.forecastSections[sectionIndex]?.source?.dimensionRow
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
    :null
  );
};

export default RatioTargetSection;
