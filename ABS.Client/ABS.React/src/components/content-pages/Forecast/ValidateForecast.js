import { updateForecast } from "../../../core/_actions/ForecastActions";
import { useSelector, useDispatch } from "react-redux";
import store from "../../../core/_store";
import { transformBudgetVersionData } from "../../../helpers/DataTransform/transformData";
import ItemsMonths from "../MasterData/itemsMonths";
import { scenario_type_Codes } from './Data/scenario_type_codes'
export const ValidateForecast = () => {

  const state = store.getState().ForecastReducer;
  const UpdatedforecastSections = [...state.forecastSections];
  let OverAllValidationFailedCount = 0;
  for (let i = 0; i < UpdatedforecastSections.length; i++) {
    if (UpdatedforecastSections[i].forecastType !== "notSelected") {
      if (UpdatedforecastSections[i].included === true) {
        if (
          UpdatedforecastSections[i].forecastType === "copy" ||
          UpdatedforecastSections[i].forecastType === "annualization" ||
          UpdatedforecastSections[i].forecastType === "copy_staffing_hours" ||
          UpdatedforecastSections[i].forecastType === "annualize_staffing_hours" ||
          UpdatedforecastSections[i].forecastType === "copy_staffing_dollars" ||
          UpdatedforecastSections[i].forecastType === "annualize_staffing_dollars" ||
          UpdatedforecastSections[i].forecastType === "staffing_average_wage_rate" ||
          UpdatedforecastSections[i].forecastType === "staffing_pay_type_distribution"
        ) {
          OverAllValidationFailedCount += validateCopyAnnualizeMethod(i);
        } else if (UpdatedforecastSections[i].forecastType === "ratio"
          || UpdatedforecastSections[i].forecastType === "ratioGL_Statistics"
          || UpdatedforecastSections[i].forecastType === "ratio_staffing_hours_statistics") {
          OverAllValidationFailedCount += validateRatioMethod(i);
        }
      }
    }
  }
  return OverAllValidationFailedCount;
};

const validateCopyAnnualizeMethod = (sectionIndex) => {
  let sectionInValidCount = 0;
  const state = store.getState().ForecastReducer;
  const UpdatedforecastSections = [...state.forecastSections];

  const UpdatedsectionValidation = JSON.parse(
    JSON.stringify(UpdatedforecastSections[sectionIndex].sectionValidation)
  );

  // validate Source Budget Version  , start and end month Here
  for (
    let sourceDataRowIndex = 0;
    sourceDataRowIndex <
    state.forecastSections[sectionIndex].source.dataRow.length;
    sourceDataRowIndex++
  ) {
    if (
      state.forecastSections[sectionIndex].source.dataRow[sourceDataRowIndex]
        .budgetversion_code === "notSelected"
    ) {
      UpdatedsectionValidation.budgetversion[sourceDataRowIndex] = {
        invalid: true,
        invalidText: "Required value missing",
      };
      sectionInValidCount++;
    } else {
      UpdatedsectionValidation.budgetversion[sourceDataRowIndex] = {
        invalid: false,
        invalidText: "",
      };
    }
    if (
      state?.forecastSections[sectionIndex]?.forecastType.includes('annuali') &&
      state?.forecastSections[sectionIndex]?.target?.dataRow[0]?.includeStartMonth === "notSelected"
    ) {
      UpdatedsectionValidation.targetStartMonth = {
        invalid: true,
        invalidText: "Required value missing",
      };
      sectionInValidCount++;
    } else {
      UpdatedsectionValidation.targetStartMonth = {
        invalid: false,
        invalidText: "",
      };

    }
    if (
      state?.forecastSections[sectionIndex]?.forecastType.includes('annuali') &&
      state?.forecastSections[sectionIndex]?.target?.dataRow[0]?.includeEndMonth === "notSelected"
    ) {
      UpdatedsectionValidation.targetEndMonth = {
        invalid: true,
        invalidText: "Required value missing",
      };
      sectionInValidCount++;
    } else {
      UpdatedsectionValidation.targetEndMonth = {
        invalid: false,
        invalidText: "",
      };

    }




    // start and end months Validation Here
    const monthsKey = ["startMonth", "endMonth"];
    let monthsrequired = false;
    for (
      let monthsKeyIndex = 0;
      monthsKeyIndex < monthsKey.length;
      monthsKeyIndex++
    ) {
      if (
        state.forecastSections[sectionIndex].source.dataRow[sourceDataRowIndex][
        monthsKey[monthsKeyIndex]
        ] === "notSelected"
      ) {
        UpdatedsectionValidation[monthsKey[monthsKeyIndex]][
          sourceDataRowIndex
        ] = {
          invalid: true,
          invalidText: "Required value missing",
        };
        monthsrequired = true;
        sectionInValidCount++;
      } else {
        UpdatedsectionValidation[monthsKey[monthsKeyIndex]][
          sourceDataRowIndex
        ] = {
          invalid: false,
          invalidText: "",
        };
      } // end of else
    } // end of loop

    // only run when Above required Validation is passed of Start and End Month.
    let CombinationValid = false;
    let BVMonthInSequence;
    let selectedstartMonthValue;
    let selectedstartMonthindex;
    let selectedendMonthValue;
    let selectedendMonthindex;
    if (!monthsrequired) {
      BVMonthInSequence = GetBVMonthInSequence(
        state.forecastSections[sectionIndex].source.dataRow[sourceDataRowIndex]
          .budgetversion_code
      );

      selectedstartMonthValue =
        state.forecastSections[sectionIndex].source.dataRow[sourceDataRowIndex][
        "startMonth"
        ];
      selectedstartMonthindex = BVMonthInSequence.findIndex(
        (month) => month.value === selectedstartMonthValue
      );
      selectedendMonthValue =
        state.forecastSections[sectionIndex].source.dataRow[sourceDataRowIndex][
        "endMonth"
        ];
      selectedendMonthindex = BVMonthInSequence.findIndex(
        (month) => month.value === selectedendMonthValue
      );

      // Start Month Sequence.No must be less then End Month
      if (selectedendMonthindex < selectedstartMonthindex) {
        //invalid combination of Start and End month Selection
        UpdatedsectionValidation["startMonth"][sourceDataRowIndex] = {
          invalid: true,
          invalidText: "Invalid month combination",
        };
        UpdatedsectionValidation["endMonth"][sourceDataRowIndex] = {
          invalid: true,
          invalidText: "Invalid month combination",
        };
        sectionInValidCount++;
        CombinationValid = false;
      } else {
        UpdatedsectionValidation["startMonth"][sourceDataRowIndex] = {
          invalid: false,
          invalidText: "",
        };
        UpdatedsectionValidation["endMonth"][sourceDataRowIndex] = {
          invalid: false,
          invalidText: "",
        };
        CombinationValid = true;
      }
    } // end of if (!monthsrequired)

    //validate Already month Selected only in Copy Case ,
    //Run Code only if Valid Combination validation is passed above
    if (
      CombinationValid && (
        UpdatedforecastSections[sectionIndex].forecastType === "copy"
        || UpdatedforecastSections[sectionIndex].forecastType === "copy_staffing_hours"
        || UpdatedforecastSections[sectionIndex].forecastType === "copy_staffing_dollars")
    ) {
      // Check for All previous set on Start and End month
      let CurrentCourseDataRowIndex = sourceDataRowIndex;
      // Start Checking with previous one
      for (
        let InnersourceDataRowIndex = CurrentCourseDataRowIndex - 1;
        InnersourceDataRowIndex >= 0;
        InnersourceDataRowIndex--
      ) {
        const val = state?.forecastSections[sectionIndex]?.source?.dataRow[
          InnersourceDataRowIndex
        ]?.budgetversion_code;
        if (val !== "notSelected" && val !== undefined) {
          const BVMonthInSequence = GetBVMonthInSequence(
            state.forecastSections[sectionIndex].source.dataRow[
              InnersourceDataRowIndex
            ].budgetversion_code
          );
          let startMonthValue =
            state.forecastSections[sectionIndex].source.dataRow[
            InnersourceDataRowIndex
            ]["startMonth"];
          let startMonthindex = BVMonthInSequence.findIndex(
            (month) => month.value === startMonthValue
          );
          let endMonthValue =
            state.forecastSections[sectionIndex].source.dataRow[
            InnersourceDataRowIndex
            ]["endMonth"];
          let endMonthindex = BVMonthInSequence.findIndex(
            (month) => month.value === endMonthValue
          );

          // Start month is already selected previosuly
          let startmonthFound = false;
          let endmonthFound = false;
          if (
            selectedstartMonthindex >= startMonthindex &&
            selectedstartMonthindex <= endMonthindex
          ) {
            UpdatedsectionValidation["startMonth"][CurrentCourseDataRowIndex] = {
              invalid: true,
              invalidText: "Month already used",
            };
            startmonthFound = true;
            sectionInValidCount++;
          } else {
            UpdatedsectionValidation["startMonth"][CurrentCourseDataRowIndex] = {
              invalid: false,
              invalidText: "",
            };
          }
          // End month is already selected previosuly
          if (
            selectedendMonthindex >= startMonthindex &&
            selectedendMonthindex <= endMonthindex
          ) {
            UpdatedsectionValidation["endMonth"][CurrentCourseDataRowIndex] = {
              invalid: true,
              invalidText: "Month already used",
            };
            endmonthFound = true;
            sectionInValidCount++;
          } else {
            UpdatedsectionValidation["endMonth"][CurrentCourseDataRowIndex] = {
              invalid: false,
              invalidText: "",
            };
          }

          //if Both Start and End Month Are found , Break the loop
          if (endmonthFound && startmonthFound) {
            break;
          }
        }
      } // End of For Loop
    } // End of IF
  } // End of Source Loop //for ( let sourceDataRowIndex = 0;

  // Validate Source/Target Dimension Row Here , For required.
  // Set variable on the bases of scenario Type
  let dimentionList = [];
  let dimentionGroupList = [];
  let rowType = ["Source", "Target"];
  if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.statistics) {
    dimentionList = ["entity", "department", "statistic"];
    dimentionGroupList = [
      "entitiesGroup",
      "departmentsGroup",
      "statisticsGroup",
    ];
    rowType = ["Source", "Target"];
  } else if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger) {
    dimentionList = ["entity", "department", "generalLedger"];
    dimentionGroupList = [
      "entitiesGroup",
      "departmentsGroup",
      "generalLedgerGroup",
    ];
    rowType = ["Source", "Target"];
  } else if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing
    && state.forecastSections[sectionIndex].forecastType !== "staffing_average_wage_rate"
    && state.forecastSections[sectionIndex].forecastType !== "staffing_pay_type_distribution") {
    dimentionList = ["entity", "department", "jobCode", "payType"];
    dimentionGroupList = [
      "entitiesGroup",
      "departmentsGroup",
      "jobCodeGroup",
      "payTypeGroup"
    ];
    rowType = ["Source", "Target"];
  } else if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing
    && state.forecastSections[sectionIndex].forecastType === "staffing_pay_type_distribution") {
    dimentionList = ["entity", "department", "jobCode", "productivePayTypeGroup", "nonProductivePayTypeGroup"];
    rowType = ["Source"];
  }

  for (let i = 0; i < dimentionList.length; i++) {
    // For Source Dimension
    if (
      state.forecastSections[sectionIndex][rowType[0].toLowerCase()]
        .dimensionRow[dimentionList[i]] === ""
    ) {
      UpdatedsectionValidation[dimentionList[i] + rowType[0]] = {
        invalid: true,
        invalidText: "Required value missing",
      };
      sectionInValidCount++;
    } else {
      UpdatedsectionValidation[dimentionList[i] + rowType[0]] = {
        invalid: false,
        invalidText: "",
      };
    }
    if (rowType.length === 2) {
      // For Target Dimension (Required , as well as other additional Validations)
      // Run only when we have target Row.
      if (
        state.forecastSections[sectionIndex][rowType[1].toLowerCase()]
          .dimensionRow[dimentionList[i]] === ""
      ) {
        UpdatedsectionValidation[dimentionList[i] + rowType[1]] = {
          invalid: true,
          invalidText: "Required value missing",
        };
        sectionInValidCount++;
      } else {
        // If Required Validation is passed, now comfare the Source and Target Dimensions
        if (
          state.forecastSections[sectionIndex][rowType[0].toLowerCase()]
            .dimensionRow[dimentionList[i]] !==
          state.forecastSections[sectionIndex][rowType[1].toLowerCase()]
            .dimensionRow[dimentionList[i]] &&
          state.forecastSections[sectionIndex][rowType[0].toLowerCase()]
            .dimensionRow[dimentionGroupList[i]] === false &&
          CheckDimensionIsGroup(state.forecastSections[sectionIndex][rowType[0].toLowerCase()].dimensionRow[dimentionList[i]], dimentionList[i])
        ) {
          UpdatedsectionValidation[dimentionList[i] + rowType[1]] = {
            invalid: true,
            invalidText: "Source and target must match",
          };
          sectionInValidCount++;
        } else {
          UpdatedsectionValidation[dimentionList[i] + rowType[1]] = {
            invalid: false,
            invalidText: "",
          };
        }
      }
    }

  }
  // Check Overall Section Validation here.
  if (sectionInValidCount !== 0) {
    UpdatedsectionValidation.sectionValid = false;
  } else {
    UpdatedsectionValidation.sectionValid = true;
  }
  UpdatedforecastSections[
    sectionIndex
  ].sectionValidation = UpdatedsectionValidation;

  store.dispatch(
    updateForecast({
      ...state,
      forecastSections: [...UpdatedforecastSections],
    })
  );

  return sectionInValidCount;
};

const validateRatioMethod = (sectionIndex) => {
  let sectionInValidCount = 0;
  const state = store.getState().ForecastReducer;
  const UpdatedforecastSections = [...state.forecastSections];
  const UpdatedsectionValidation = JSON.parse(
    JSON.stringify(UpdatedforecastSections[sectionIndex].sectionValidation)
  );
  // validate Source Budget Version Here
  if (
    state.forecastSections[sectionIndex].source.dataRow[0]
      .budgetversion_code === "notSelected"
  ) {
    UpdatedsectionValidation.budgetversion = {
      invalid: true,
      invalidText: "Required value missing",
    };
    sectionInValidCount++;
  } else {
    UpdatedsectionValidation.budgetversion = {
      invalid: false,
      invalidText: "",
    };
  }

  // Set variable on the bases of scenario Type
  let rowType = ["source", "target"];
  let rowSubType = ["numerator", "denominator"];
  let dimentionList = [];
  let dimentionGroupList = [];
  if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.statistics) {
    dimentionList = ["entity", "department", "statistic"];
    dimentionGroupList = [
      "entitiesGroup",
      "departmentsGroup",
      "statisticsGroup",
    ];
  }
  else if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger
    && state.forecastSections[sectionIndex].forecastType === "ratio") // Only Run this condition for Ratio GL from GL , For GL from Statistics , additional vadination is implement below. 
  {
    dimentionList = ["entity", "department", "generalLedger"];
    dimentionGroupList = [
      "entitiesGroup",
      "departmentsGroup",
      "generalLedgerGroup",
    ];
  } else if ((state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger
    && state.forecastSections[sectionIndex].forecastType === "ratioGL_Statistics")
    || (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing
      && state.forecastSections[sectionIndex].forecastType === "ratio_staffing_hours_statistics")) // Only validate entity , department in cases of Ratio GL from Statistice , Staffing hours from statistics. further validation of this case is implement below.
  {
    dimentionList = ["entity", "department"];
    dimentionGroupList = [
      "entitiesGroup",
      "departmentsGroup",
    ];
  }

  sectionInValidCount = sectionInValidCount + requiredFieldValidator(state, rowType, rowSubType
    , dimentionList, dimentionGroupList, sectionIndex, UpdatedsectionValidation);

  // Validate generalLedger and statistic here , for the case of Ratio of GL from statistics.
  if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger
    && state.forecastSections[sectionIndex].forecastType === "ratioGL_Statistics") {
    for (let rowTypeIndex = 0; rowTypeIndex < rowType.length; rowTypeIndex++) {

      // GL Field
      if (state.forecastSections[sectionIndex][rowType[rowTypeIndex]].dimensionRow["numerator"]["generalLedger"] === "") {
        UpdatedsectionValidation["numeratorgeneralLedger" + rowType[rowTypeIndex]] = { // rowType[0] = source , rowType[1] = target 
          invalid: true,
          invalidText: "Required value missing",
        };
        sectionInValidCount++;
      } else {
        UpdatedsectionValidation["numeratorgeneralLedger" + rowType[rowTypeIndex]] = {
          invalid: false,
          invalidText: "",
        };
      }


      // Statistics Field
      if (state.forecastSections[sectionIndex][rowType[rowTypeIndex]].dimensionRow["denominator"]["statistic"] === "") {
        UpdatedsectionValidation["denominatorstatistic" + rowType[rowTypeIndex]] = {
          invalid: true,
          invalidText: "Required value missing",
        };
        sectionInValidCount++;
      } else {
        if (state.forecastSections[sectionIndex][rowType[rowTypeIndex] === "source" ? "target" : "source"].dimensionRow["denominator"]["statistic"] !== "") {
          if ((state.forecastSections[sectionIndex][rowType[rowTypeIndex]].dimensionRow["statisticsGroup"] === false ||
            state.forecastSections[sectionIndex][rowType[rowTypeIndex] === "source" ? "target" : "source"].dimensionRow["statisticsGroup"] === false) &&
            state.forecastSections[sectionIndex][rowType[rowTypeIndex]].dimensionRow["denominator"]["statistic"] !==
            state.forecastSections[sectionIndex][rowType[rowTypeIndex] === "source" ? "target" : "source"].dimensionRow["denominator"]["statistic"]) {

            // Remove this validation for a time being to continue Erik Testing. doing this after discuss it with Erik and Bruce.
            //TODO: This code will be used in future. So please dont remove it. Its Save in 'Master'. :P

            // This code will need in future.
            UpdatedsectionValidation["denominatorstatistic"+rowType[rowTypeIndex]] = {
              invalid: true,
              invalidText: "Source and target "+(CheckDimensionIsGroup( state.forecastSections[sectionIndex]["target"].dimensionRow["denominator"]["statistic"] , "statistic") ? "group " : "") +"do not match.",
              // if Group OR isHierarchy is selected in Driver (denominator) , then show with group 
            };
            sectionInValidCount++;

          } else {
            UpdatedsectionValidation["denominatorstatistic" + rowType[rowTypeIndex]] = {
              invalid: false,
              invalidText: "",
            };
          }
        } else {
          UpdatedsectionValidation["denominatorstatistic" + rowType[rowTypeIndex]] = {
            invalid: false,
            invalidText: "",
          };
        }
      }
    } // For Loop END  
  } // IF End 

  // Further validate Case "Staffing hours based on Statistics".
  if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing
    && state.forecastSections[sectionIndex].forecastType === "ratio_staffing_hours_statistics") {
    rowType = ["source", "target"];
    rowSubType = ["numerator"];
    dimentionList = ["jobCode", "payType"];
    dimentionGroupList = [];

    sectionInValidCount += requiredFieldValidator(state, rowType, rowSubType
      , dimentionList, dimentionGroupList, sectionIndex, UpdatedsectionValidation);


    rowType = ["source", "target"];
    rowSubType = ["denominator"];
    dimentionList = ["statistic"];
    dimentionGroupList = ["statisticsGroup"];

    sectionInValidCount += requiredFieldValidator(state, rowType, rowSubType
      , dimentionList, dimentionGroupList, sectionIndex, UpdatedsectionValidation);
  }

  // Check Overall Section Validation here.
  if (sectionInValidCount !== 0) {
    UpdatedsectionValidation.sectionValid = false;
  } else {
    UpdatedsectionValidation.sectionValid = true;
  }
  UpdatedforecastSections[
    sectionIndex
  ].sectionValidation = UpdatedsectionValidation;

  store.dispatch(
    updateForecast({
      ...state,
      forecastSections: [...UpdatedforecastSections],
    })
  );

  return sectionInValidCount;
};

const requiredFieldValidator = (state, rowType, rowSubType, dimentionList, dimentionGroupList, sectionIndex, UpdatedsectionValidation) => {
  let sectionInValidCount = 0;
  // Validate   
  for (let rowIndex = 0; rowIndex < rowType.length; rowIndex++) {
    // for rowSubType (numerator ,denominator )
    for (let rowSubIndex = 0; rowSubIndex < rowSubType.length; rowSubIndex++) {
      // for dimensions (entity , dept ,states)
      for (
        let dimensionIndex = 0;
        dimensionIndex < dimentionList.length;
        dimensionIndex++
      ) {
        if (
          state.forecastSections[sectionIndex][rowType[rowIndex]].dimensionRow[
          rowSubType[rowSubIndex]
          ][dimentionList[dimensionIndex]] === ""
        ) {
          UpdatedsectionValidation[
            rowSubType[rowSubIndex] +
            dimentionList[dimensionIndex] +
            rowType[rowIndex]
          ] = {
            invalid: true,
            invalidText: "Required value missing",
          };
          sectionInValidCount++;
        } else {
          // validate denominator combinations
          if (rowSubType[rowSubIndex] === "denominator") {
            if (
              state.forecastSections[sectionIndex][rowType[0]].dimensionRow[
              dimentionGroupList[dimensionIndex]
              ] === false ||
              state.forecastSections[sectionIndex][rowType[1]].dimensionRow[
              dimentionGroupList[dimensionIndex]
              ] === false
            ) {
              if (
                state.forecastSections[sectionIndex][rowType[0]].dimensionRow[
                rowSubType[rowSubIndex]
                ][dimentionList[dimensionIndex]] !==
                state.forecastSections[sectionIndex][rowType[1]].dimensionRow[
                rowSubType[rowSubIndex]
                ][dimentionList[dimensionIndex]]
              ) {

                // Remove this validation for a time being to continue Erik Testing. doing this after discuss it with Erik and Bruce.
                //TODO: This code will be used in future. So please dont remove it. Its Save in 'Master'. :P

                UpdatedsectionValidation[
                  rowSubType[rowSubIndex] +
                    dimentionList[dimensionIndex] +
                    rowType[0]
                ] = {
                  invalid: true,
                  invalidText: "Source and target "+(CheckDimensionIsGroup( state.forecastSections[sectionIndex][rowType[1]].dimensionRow[
                    rowSubType[rowSubIndex]
                    ][dimentionList[dimensionIndex]] , dimentionList[dimensionIndex]) ? "group " : "") +"do not match.",
                  // if Group OR isHierarchy is selected in Driver (denominator) , then show with group 
                };
                UpdatedsectionValidation[
                  rowSubType[rowSubIndex] +
                    dimentionList[dimensionIndex] +
                    rowType[1]
                ] = {
                  invalid: true,
                  invalidText: "Source and target "+(CheckDimensionIsGroup( state.forecastSections[sectionIndex][rowType[1]].dimensionRow[
                    rowSubType[rowSubIndex]
                    ][dimentionList[dimensionIndex]] , dimentionList[dimensionIndex]) ? "group " : "") +"do not match.",
                    // if Group OR isHierarchy is selected in Driver (denominator) , then show with group 
                };
                sectionInValidCount++;


              } else {
                UpdatedsectionValidation[
                  rowSubType[rowSubIndex] +
                  dimentionList[dimensionIndex] +
                  rowType[0]
                ] = {
                  invalid: false,
                  invalidText: "",
                };
                UpdatedsectionValidation[
                  rowSubType[rowSubIndex] +
                  dimentionList[dimensionIndex] +
                  rowType[1]
                ] = {
                  invalid: false,
                  invalidText: "",
                };
              }
            } else {
              UpdatedsectionValidation[
                rowSubType[rowSubIndex] +
                dimentionList[dimensionIndex] +
                rowType[0]
              ] = {
                invalid: false,
                invalidText: "",
              };
              UpdatedsectionValidation[
                rowSubType[rowSubIndex] +
                dimentionList[dimensionIndex] +
                rowType[1]
              ] = {
                invalid: false,
                invalidText: "",
              };
            }
          } else {
            UpdatedsectionValidation[
              rowSubType[rowSubIndex] +
              dimentionList[dimensionIndex] +
              rowType[rowIndex]
            ] = {
              invalid: false,
              invalidText: "",
            };
          }
        }
      }
    }
  }

  return sectionInValidCount;
}

export const CheckRunForecastButton = () => {
  // Enable Run Forecast button only when all required field have Values.
  const state = store.getState().ForecastReducer;
  const budgetVersionData = store.getState().BudgetVersions.list;

  let invalidCount = 0;
  let nonIncludedSection = 0;
  for (
    let sectionIndex = 0;
    sectionIndex < state.forecastSections.length;
    sectionIndex++
  ) {
    let section = state.forecastSections[sectionIndex];
    let rowType = [];
    let dimentionList = [];
    let rowSubType = [];

    if (section.forecastType !== "notSelected") {
      if (section.included === true) {
        if (
          section.forecastType === "copy" ||
          section.forecastType === "annualization" ||
          section.forecastType === "copy_staffing_hours" ||
          section.forecastType === "annualize_staffing_hours" ||
          section.forecastType === "copy_staffing_dollars" ||
          section.forecastType === "annualize_staffing_dollars" ||
          section.forecastType === "staffing_average_wage_rate" ||
          section.forecastType === "staffing_pay_type_distribution"
        ) {
          // BV and source start month and end month can be multiple
          for (
            let sectioSourceIndex = 0;
            sectioSourceIndex < section.source.dataRow.length;
            sectioSourceIndex++
          ) {

            if (
              section.forecastType.includes('annuali') &&
              (state.forecastSections[sectionIndex].target.dataRow[0].includeStartMonth ===
                "notSelected" ||
                state.forecastSections[sectionIndex].target.dataRow[0].includeEndMonth ===
                "notSelected")
            ) {
              invalidCount++;
            }


            if (
              section.source.dataRow[sectioSourceIndex].budgetversion_code ===
              "notSelected" ||
              section.source.dataRow[sectioSourceIndex].startMonth ===
              "notSelected" ||
              section.source.dataRow[sectioSourceIndex].endMonth ===
              "notSelected"
            ) {
              invalidCount++;
            }
            // else if (state.BVCodes.indexOf(section.source.dataRow[sectioSourceIndex].budgetversion_code) === -1)
            //   invalidCount++;
            else {
              // (state.BVCodes.indexOf(section.source.dataRow[sectioSourceIndex].budgetversion_code) === -1)
              // invalidCount++;
              let BVStillExist = false;
              for (let index in budgetVersionData) {
                if (budgetVersionData[index].code == section.source.dataRow[sectioSourceIndex].budgetversion_code) {
                  BVStillExist = true;
                  break
                }
              }
              if (!BVStillExist) invalidCount++
            }

          }

          rowType = ["Source", "Target"];
          if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.statistics) {
            dimentionList = ["entity", "department", "statistic"];
          } else if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger) {
            dimentionList = ["entity", "department", "generalLedger"];
          } else if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing
            && section.forecastType !== "staffing_average_wage_rate"
            && section.forecastType !== "staffing_pay_type_distribution") {
            dimentionList = ["entity", "department", "jobCode", "payType"];
          }
          else if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.staffing
            && section.forecastType === "staffing_pay_type_distribution") {
            dimentionList = ["entity", "department", "jobCode", "productivePayTypeGroup", "nonProductivePayTypeGroup"];
            rowType = ["Source"];
          }

          for (let i = 0; i < dimentionList.length; i++) {
            for (let j = 0; j < rowType.length; j++) {
              if (
                section[rowType[j].toLowerCase()].dimensionRow[dimentionList[i]] === ""
              ) {
                invalidCount++
              }
            }
          }

        } else if (section.forecastType === "ratio") {
          // BV and source start month and end month can be multiple
          for (
            let sectioSourceIndex = 0; sectioSourceIndex < section.source.dataRow.length; sectioSourceIndex++
          ) {
            if (
              section.source.dataRow[sectioSourceIndex].budgetversion_code === "notSelected"
            ) {
              invalidCount++;
            }
          }

          rowType = ["source", "target"];
          rowSubType = ["numerator", "denominator"];
          if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.statistics) {
            dimentionList = ["entity", "department", "statistic"];
          } else if (state.forecast_budgetversion_scenario_type_Code === scenario_type_Codes.generalLedger) {
            dimentionList = ["entity", "department", "generalLedger"];
          }

          // for rowType (source , target)
          for (let rowIndex = 0; rowIndex < rowType.length; rowIndex++) {
            // for rowSubType (numerator ,denominator )
            for (let rowSubIndex = 0; rowSubIndex < rowSubType.length; rowSubIndex++) {
              // for dimensions (entity , dept ,states)
              for (let dimensionIndex = 0; dimensionIndex < dimentionList.length; dimensionIndex++) {
                if (section[rowType[rowIndex]].dimensionRow[rowSubType[rowSubIndex]][dimentionList[dimensionIndex]] === "") {
                  invalidCount++;
                }
              } // dimensions
            } // rowSubType
          } //rowType
        } else if (section.forecastType === "ratioGL_Statistics") {

          // BV and source start month and end month can be multiple
          for (
            let sectioSourceIndex = 0; sectioSourceIndex < section.source.dataRow.length; sectioSourceIndex++
          ) {
            if (
              section.source.dataRow[sectioSourceIndex].budgetversion_code === "notSelected"
            ) {
              invalidCount++;
            }
          }


          // First Check for common field , enity and department.
          rowType = ["source", "target"];
          rowSubType = ["numerator", "denominator"];
          dimentionList = ["entity", "department"]
          // for rowType (source , target)
          for (let rowIndex = 0; rowIndex < rowType.length; rowIndex++) {
            // for rowSubType (numerator ,denominator )
            for (let rowSubIndex = 0; rowSubIndex < rowSubType.length; rowSubIndex++) {
              // for dimensions (entity , dept ,states)
              for (let dimensionIndex = 0; dimensionIndex < dimentionList.length; dimensionIndex++) {
                if (section[rowType[rowIndex]].dimensionRow[rowSubType[rowSubIndex]][dimentionList[dimensionIndex]] === "") {
                  invalidCount++;
                }
              } // dimensions
            } // rowSubType
          } //rowType

          // Now Check for GL and Statistics Field.
          for (let rowTypeIndex = 0; rowTypeIndex < rowType.length; rowTypeIndex++) {
            if (section[rowType[rowTypeIndex]].dimensionRow["numerator"]["generalLedger"] === "") {
              invalidCount++;
            }
            if (section[rowType[rowTypeIndex]].dimensionRow["denominator"]["statistic"] === "") {
              invalidCount++;
            }
          } // For loop

        } else if (section.forecastType === "ratio_staffing_hours_statistics") {
          rowType = ["source", "target"];
          rowSubType = ["numerator"];
          dimentionList = ["entity", "department", "jobCode", "payType"]
          for (let rowIndex = 0; rowIndex < rowType.length; rowIndex++) {
            // for rowSubType (numerator ,denominator )
            for (let rowSubIndex = 0; rowSubIndex < rowSubType.length; rowSubIndex++) {
              // for dimensions (entity , dept ,states)
              for (let dimensionIndex = 0; dimensionIndex < dimentionList.length; dimensionIndex++) {
                if (section[rowType[rowIndex]].dimensionRow[rowSubType[rowSubIndex]][dimentionList[dimensionIndex]] === "") {
                  invalidCount++;
                }
              } // dimensions
            } // rowSubType
          } //rowType
          rowSubType = ["denominator"];
          dimentionList = ["entity", "department", "statistic"]
          for (let rowIndex = 0; rowIndex < rowType.length; rowIndex++) {
            // for rowSubType (numerator ,denominator )
            for (let rowSubIndex = 0; rowSubIndex < rowSubType.length; rowSubIndex++) {
              // for dimensions (entity , dept ,states)
              for (let dimensionIndex = 0; dimensionIndex < dimentionList.length; dimensionIndex++) {
                if (section[rowType[rowIndex]].dimensionRow[rowSubType[rowSubIndex]][dimentionList[dimensionIndex]] === "") {
                  invalidCount++;
                }
              } // dimensions
            } // rowSubType
          } //rowType
        }
      } else {
        nonIncludedSection++;
      }
    } else {
      invalidCount++;
    }
  } // End of Outer loop

  if (nonIncludedSection === state.forecastSections.length) {
    invalidCount++;
  }
  // Now Enable Disable the Rub forecast Button.
  let disabledButton;
  disabledButton = state.runForecastButton;
  if (invalidCount > 0 || state.forecastSections.length === 0) {
    // Disabled
    disabledButton.disabled = true;
  } else {
    //enabled
    disabledButton.disabled = false;
  }
  state.runForecastButton = disabledButton;
  store.dispatch(
    updateForecast({
      ...state,
    })
  );
};

const GetBVMonthInSequence = (budgetVersionCode) => {
  const masterData = store.getState().MasterData;
  let monthsInSequence = [];
  const BudgerVersionTimePeriod = transformBudgetVersionData(
    store.getState().BudgetVersions.list,
    "LLLL"
  ).find((item) => item.code === budgetVersionCode)?.timeperiodobj;

  // Get Start and End month Id from the BV timePeroid

  const BVstartMonthValue = masterData.ItemMonths.find(
    (item) =>
      item.itemTypeID ===
      BudgerVersionTimePeriod?.fiscalStartMonthID?.itemTypeID
  )?.itemTypeValue;

  let startNoNumber =
    parseInt(
      BVstartMonthValue?.substring(
        BVstartMonthValue?.length - 2,
        BVstartMonthValue?.length
      )
    ) - 1;
  for (let i = 0; i < 12; i++) {
    monthsInSequence.push(ItemsMonths[startNoNumber % 12]);
    startNoNumber++;
  }

  return monthsInSequence;
};

const CheckDimensionIsGroup = (dimensionId, dimensionType) => {
  const state = store.getState().MasterData;
  let result;
  if (dimensionType === "entity") {
    result = state.Entites.find((item) => (item.entityID === dimensionId) && (item.isGroup === true || item.isHierarchy === true ));
    return result && true;
  } else if (dimensionType === "department") {
    result = state.Departments.find((item) => (item.departmentID === dimensionId) && (item.isGroup === true || item.isHierarchy === true ));
    return result && true;
  } else if (dimensionType === "statistic") {
    result = state.Statistics.find((item) => item.statisticsCodeID === dimensionId && (item.isGroup === true || item.isHierarchy === true ));
    return result && true;
  } else if (dimensionType === "jobCode") {
    result = state.JobCodes.find((item) => item.jobCodeID === dimensionId && (item.isGroup === true || item.isHierarchy === true ));
    return result && true;
  } else if (dimensionType === "payType") {
    result = state.PayTypes.find((item) => item.payTypeID === dimensionId && (item.isGroup === true || item.isHierarchy === true ));
    return result && true;
  } else if (dimensionType === "generalLedger") {
    result = state.GLAccounts.find((item) => item.glAccountID === dimensionId && (item.isGroup === true || item.isHierarchy === true ));
    return result && true;
  }
}