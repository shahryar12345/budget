import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useSelector } from "react-redux";
import {
  TooltipIcon,
  RadioButton,
  RadioButtonGroup,
  Dropdown,
  TextInput,
  Button,
} from "carbon-components-react";
import { Information16, Search16 } from "@carbon/icons-react";
import ItemsMonths from "../MasterData/itemsMonths";
import {DataMapping} from './Data/data-mapping';

const RowCalculationGrid = forwardRef(
  ({ entity, department, scenarioTypeGridSelection, timePeriod, ScenarioData , name}, ref) => {
    const initialStates = {
      isActive: false,
      selectedType: "Total",
      spreadMethod: "1",
      fyTotal: "0",
      monthsList: [],
      values: [
        { month: "Jul", values: 0 },
        { month: "Aug", values: 0 },
        { month: "Sep", values: 0 },
        { month: "Oct", values: 0 },
        { month: "Nov", values: 0 },
        { month: "Dec", values: 0 },
        { month: "Jan", values: 0 },
        { month: "Feb", values: 0 },
        { month: "Mar", values: 0 },
        { month: "Apr", values: 0 },
        { month: "May", values: 0 },
        { month: "Jun", values: 0 },
      ],
      monthlySpreads: [
        { month: "Jul", values: "1.00" },
        { month: "Aug", values: "1.00" },
        { month: "Sep", values: "1.00" },
        { month: "Oct", values: "1.00" },
        { month: "Nov", values: "1.00" },
        { month: "Dec", values: "1.00" },
        { month: "Jan", values: "1.00" },
        { month: "Feb", values: "1.00" },
        { month: "Mar", values: "1.00" },
        { month: "Apr", values: "1.00" },
        { month: "May", values: "1.00" },
        { month: "Jun", values: "1.00" },
      ],
      allocationPercentages: [
        { month: "Jul", values: "8.3333" },
        { month: "Aug", values: "8.3333" },
        { month: "Sep", values: "8.3333" },
        { month: "Oct", values: "8.3333" },
        { month: "Nov", values: "8.3333" },
        { month: "Dec", values: "8.3333" },
        { month: "Jan", values: "8.3333" },
        { month: "Feb", values: "8.3333" },
        { month: "Mar", values: "8.3333" },
        { month: "Apr", values: "8.3333" },
        { month: "May", values: "8.3333" },
        { month: "Jun", values: "8.3333" },
      ],
      includedData: {},
    };

    const spreadMethods = [
      {
        id: "notSelected",
        text: "Choose One",
        value: "notSelected",
      },
      {
        id: "1",
        text: "Proportionally",
        value: "proportionally",
      },
    ];

    const emptyFields = [
      { month: "Jul", values: "0" },
      { month: "Aug", values: "0" },
      { month: "Sep", values: "0" },
      { month: "Oct", values: "0" },
      { month: "Nov", values: "0" },
      { month: "Dec", values: "0" },
      { month: "Jan", values: "0" },
      { month: "Feb", values: "0" },
      { month: "Mar", values: "0" },
      { month: "Apr", values: "0" },
      { month: "May", values: "0" },
      { month: "Jun", values: "0" },
    ];

    const [localStates, setLocalState] = useState(initialStates);
    const masterData = useSelector((state) => state.MasterData); // global Store States

    const SetMonthFromTimePeriod = () => {
      let monthsInSequence = [];
      const timePeriodObj = masterData.TimePeriods.find(
        (item) => item.timePeriodID === timePeriod?.itemTypeID
      );

      const startMonthValue = masterData.ItemMonths.find(
        (item) =>
          item.itemTypeID === timePeriodObj?.fiscalStartMonthID?.itemTypeID
      )?.itemTypeValue;

      let startNoNumber =
        parseInt(
          startMonthValue.substring(
            startMonthValue.length - 2,
            startMonthValue.length
          )
        ) - 1;
      for (let i = 0; i < 12; i++) {
        monthsInSequence.push(ItemsMonths[startNoNumber % 12]);
        startNoNumber++;
      }
      return monthsInSequence;
    };

    useEffect(() => {
      setLocalState({ ...localStates, ScenarioData: ScenarioData });
    }, [ScenarioData]);

    useEffect(() => {
      let isActive;
      if (entity && department && scenarioTypeGridSelection) {
        isActive = true;
      } else {
        isActive = false;
      }

      let monthsInSeq = SetMonthFromTimePeriod();
      let includedData = setincludedData(); // Set data if combination have any Data.
      let updatedStates = SetValues(localStates.selectedType, includedData);

      setLocalState({
        ...localStates,
        isActive: isActive,
        ...updatedStates,
        includedData: includedData,
        monthsList: monthsInSeq,
      });
    }, [entity, department, scenarioTypeGridSelection]);

    useEffect(() => {
      let monthsInSeq = SetMonthFromTimePeriod();
      setLocalState({
        ...localStates,
        monthsList: monthsInSeq,
      });
    }, [timePeriod]);

    const SetValues = (selectedType, includedData) => {
      let updatedState = {};

      if (selectedType === "Total") {
        if (includedData !== undefined) {
          // if combinaition have Data but no Spread Method
          // set these values to empty , 0
          let result = mapMonths(includedData);
          updatedState = {
            ...updatedState,
            values: result.values,
            fyTotal: result.fyTotal,
            spreadMethod: "notSelected",
            allocationPercentages: [...emptyFields],
            monthlySpreads: [...emptyFields],
          };
        } else {
          // Row has no Data
          updatedState = {
            ...updatedState,
            values: initialStates.values,
            fyTotal: initialStates.fyTotal,
            allocationPercentages: initialStates.allocationPercentages,
            monthlySpreads: initialStates.monthlySpreads,
            spreadMethod: "1",
          };
        }
      } else if (selectedType === "Months") {
        if (includedData !== undefined) {
          let result = mapMonths(includedData);
          updatedState = {
            ...updatedState,
            values: result.values,
            fyTotal: result.fyTotal,
            allocationPercentages: [...emptyFields],
            monthlySpreads: [...emptyFields],
          };
        } else {
          updatedState = {
            ...updatedState,
            values: initialStates.values,
            fyTotal: "0",
            allocationPercentages: [...emptyFields],
            monthlySpreads: [...emptyFields],
          };
        }
      }

      return updatedState;
    };

    const mapMonths = (includedData) => {
      const Months = [
        { months: "Jul", monthsMap: "july" },
        { months: "Aug", monthsMap: "august" },
        { months: "Sep", monthsMap: "september" },
        { months: "Oct", monthsMap: "october" },
        { months: "Nov", monthsMap: "november" },
        { months: "Dec", monthsMap: "december" },
        { months: "Jan", monthsMap: "january" },
        { months: "Feb", monthsMap: "february" },
        { months: "Mar", monthsMap: "march" },
        { months: "Apr", monthsMap: "april" },
        { months: "May", monthsMap: "may" },
        { months: "Jun", monthsMap: "june" },
      ];
      const values = [...localStates.values];
      let fyTotal = 0;
      Months.map((months) => {
        let index = values.findIndex((item) => item.month === months.months);

        values[index].values = includedData[months.monthsMap];
        fyTotal = fyTotal + parseFloat(includedData[months.monthsMap]);
      });

      return { fyTotal: fyTotal, values: [...values] };
    };

    const setincludedData = () => {
     
      let includedData = ScenarioData?.find((item) => {
        return (
          item.entityid === entity?.entityID &&
          item.departmentid === department?.departmentID &&
          item[DataMapping[name].scenarioItemCompareId] === (scenarioTypeGridSelection ? scenarioTypeGridSelection[DataMapping[name].id] : null)
        );
      });
      return includedData;
    };

    const selectionHandle = (selectedValue) => {
      let updatedStates = SetValues(selectedValue, localStates.includedData);
      setLocalState({
        ...localStates,
        selectedType: selectedValue,
        ...updatedStates,
      });
    };

    const handleChange = (value, controlId, valueMonth) => {
      if (valueMonth === undefined) {
        setLocalState({ ...localStates, [controlId]: value });
      } else {
        // handle value text field
        let updated_value_index = localStates.values.findIndex(
          (item) => item.month === valueMonth
        );
        let updated_values = [...localStates.values];
        let updated_value = JSON.parse(
          JSON.stringify(updated_values[updated_value_index])
        );

        updated_value.values = value.toString();

        updated_values[updated_value_index] = JSON.parse(
          JSON.stringify(updated_value)
        );

        setLocalState({
          ...localStates,
          values: [...updated_values],
        });
      }
    };

    const handleSpreadClick = (e) => {
      let fyTotal = localStates.fyTotal;
      if (localStates.spreadMethod === "1") {
        // Proportionally
        let singleMonth = parseFloat(fyTotal / 12);
        let values = [...localStates.values];
        // Set the Calculated value
        for (let i = 0; i < 12; i++) {
          values[i].values = singleMonth.toString();
        }

        setLocalState({
          ...localStates,
          values: [...values],
          monthlySpreads: initialStates.monthlySpreads,
          allocationPercentages: initialStates.allocationPercentages,
        });
      }
    };

    const handleClearClick = (e) => {
      setLocalState({
        ...localStates,
        fyTotal: "0",
        values: [...emptyFields],
        allocationPercentages: [...emptyFields],
        monthlySpreads: [...emptyFields],
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        GetRowDataFromModal() {
          return localStates;
        },
      }),
      [localStates]
    );

    const handleCalculateClick = (e) => {
      let fyTotal = 0;
      let values = localStates.values;
      let UpdatedallocationPercentages = [...localStates.allocationPercentages];
      let UpdatedMonthlySpread = [...localStates.monthlySpreads];
      for (let i = 0; i < 12; i++) {
        // only add non-zeros
        if (
          values[i].values !== "" &&
          values[i].values !== null &&
          values[i].values !== undefined
        ) {
          fyTotal += parseFloat(values[i].values);
        }
      }
      // Calculate Monthly Spread. For now set same amount as of the Value's row
      let monthlySpreadsobj = {};
      let monthlySpreadIndex = {};
      for (let i = 0; i < 12; i++) {
        monthlySpreadIndex = localStates.monthlySpreads.findIndex(
          (item) => item.month === values[i].month
        );
        monthlySpreadsobj = JSON.parse(
          JSON.stringify(
            localStates.monthlySpreads[monthlySpreadIndex]
          )
        );
        monthlySpreadsobj.values = values[i].values;

        UpdatedMonthlySpread[monthlySpreadIndex] = JSON.parse(
          JSON.stringify(monthlySpreadsobj)
        );
      }

      // Calculate Allocation Percentages
      let allocationPercentagesobj = {};
      let allocationPercentagesIndex = {};

      for (let i = 0; i < 12; i++) {
        if (
          values[i].values !== "" &&
          values[i].values !== null &&
          values[i].values !== undefined
        ) {
          allocationPercentagesIndex = localStates.allocationPercentages.findIndex(
            (item) => item.month === values[i].month
          );
          allocationPercentagesobj = JSON.parse(
            JSON.stringify(
              localStates.allocationPercentages[allocationPercentagesIndex]
            )
          );
          allocationPercentagesobj.values =
            (parseFloat(values[i].values) / parseFloat(fyTotal)) * 100;
        }
        UpdatedallocationPercentages[allocationPercentagesIndex] = JSON.parse(
          JSON.stringify(allocationPercentagesobj)
        );
      }

      setLocalState({
        ...localStates,
        fyTotal: fyTotal.toString(),
        allocationPercentages: [...UpdatedallocationPercentages],
        monthlySpreads : [...UpdatedMonthlySpread]
      });
    };

    return (
      <div className="bx--row add-row-calculation-container">
        <div className="bx--col-lg">
          <div className="bx--row">
            <div className="bx--col-lg-2">{"Values to enter (optional)"}</div>
            <div className="bx--col-lg-1 add-row-info-icon-value-to-enter">
              <TooltipIcon
                direction="right"
                tooltipText="Enter a 'Total' value to spread the total across months or use 'Months' to enter monthly values."
                align="start"
              >
                <Information16 />
              </TooltipIcon>
            </div>
          </div>
          <div className="bx--row add-row-type">
            <div className="bx--col-lg">
              <RadioButtonGroup
                id="rd_total_months"
                valueSelected={localStates.selectedType}
              >
                <RadioButton
                  id="rd_Total"
                  value="Total"
                  labelText="Total"
                  disabled={!localStates.isActive}
                  onClick={(e) => selectionHandle("Total")}
                />
                <RadioButton
                  id="rd_Months"
                  value="Months"
                  labelText="Months"
                  disabled={!localStates.isActive}
                  onClick={(e) => selectionHandle("Months")}
                />
              </RadioButtonGroup>
            </div>
          </div>
          {localStates.isActive && (
            <>
              <div className="bx--row add-row-spread-method">
                <div className="bx--col-lg">Spread Method</div>
              </div>
              <div className="bx--row">
                <div className="bx--col-lg-3">
                  <Dropdown
                    id={"spread-methods-dropdown"}
                    items={
                      localStates.selectedType === "Total"
                        ? spreadMethods
                        : [{ id: "noMethod", text: "No spread method applied" }]
                    }
                    disabled={localStates.selectedType === "Months"}
                    itemToString={(item) => (item ? item.text : "")}
                    onChange={(e) =>
                      handleChange(e.selectedItem.id, "spreadMethod", undefined)
                    }
                    selectedItem={
                      localStates.selectedType === "Total"
                        ? spreadMethods.find(
                            (x) => x.id === localStates.spreadMethod
                          )
                        : { id: "noMethod", text: "No spread method applied" }
                    }
                  />
                </div>
                <div className="bx--col-lg-4 spread-method-selection-dropdown-icon">
                  <Search16 />
                </div>
              </div>
              <div className="bx--row add-row-FY-total">
                <div className="bx--col-lg">FY Total</div>
              </div>

              <div className="bx--row">
                <div className="bx--col-lg-2">
                  <TextInput
                    id={"total-value-txt"}
                    type={"number"}
                    value={localStates.fyTotal}
                    disabled={localStates.selectedType === "Months"}
                    onChange={(e) =>
                      handleChange(e.target.value, "fyTotal", undefined)
                    }
                  />
                </div>
                {localStates.selectedType === "Total" ? (
                  <div className="bx--col-lg-2">
                    <Button
                      id="spread_click"
                      kind="primary"
                      type="button"
                      disabled={localStates.spreadMethod === "notSelected"}
                      onClick={(e) => {
                        handleSpreadClick(e);
                      }}
                    >
                      Spread data
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="bx--row add-row-values">
                <div className="bx--col-lg-1">{"Values"}</div>
                <div className="bx--col-lg-1 add-row-info-icon-value">
                  <TooltipIcon
                    direction="right"
                    tooltipText="The spread of the FY total value to each month."
                    align="start"
                  >
                    <Information16 />
                  </TooltipIcon>
                </div>
              </div>

              <div className="bx--row">
                {localStates.monthsList.map((month) => {
                  return <div className="bx--col-lg"> {month.text} </div>;
                })}
              </div>

              <div className="bx--row">
                {localStates.monthsList.map((month) => {
                  return (
                    <div className="bx--col-lg">
                      <TextInput
                        id={"total-value-txt"}
                        type={"number"}
                        value={
                          localStates.values.find((item) => {
                            return item.month === month.text;
                          }).values
                        }
                        disabled={localStates.selectedType === "Total"}
                        onChange={(e) =>
                          handleChange(e.target.value, undefined, month.text)
                        }
                      />
                    </div>
                  );
                })}
              </div>
              {localStates.selectedType === "Months" ? (
                <div className="bx--row">
                  <div className="bx--col-lg">
                    {" "}
                    <Button
                      id="clear_click"
                      kind="secondary"
                      type="button"
                      onClick={(e) => {
                        handleClearClick(e);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      id="calculate_click"
                      kind="primary"
                      type="button"
                      onClick={(e) => {
                        handleCalculateClick(e);
                      }}
                    >
                      Calculate
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="bx--row add-row-monthly-spread">
                <div className="bx--col-lg-2">{"Monthly spread"}</div>
                <div className="bx--col-lg-1 add-row-info-icon-monthly-spread">
                  <TooltipIcon
                    direction="right"
                    tooltipText="Monthly allocation of the row's total for each month in the whole numbers or decimals. So 1.0 in every month evenly spreads the FY total."
                    align="start"
                  >
                    <Information16 />
                  </TooltipIcon>
                </div>
              </div>

              <div className="bx--row">
                {localStates.monthsList.map((month) => {
                  return <div className="bx--col-lg"> {month.text} </div>;
                })}
              </div>

              <div className="bx--row">
                {localStates.monthsList.map((month) => {
                  return (
                    <div className="bx--col-lg">
                      <TextInput
                        id={"total-value-txt"}
                        type={"number"}
                        value={
                          localStates.monthlySpreads.find((item) => {
                            return item.month === month.text;
                          }).values
                        }
                        disabled={true}
                       />
                    </div>
                  );
                })}
              </div>

              <div className="bx--row add-row-allocation-per">
                <div className="bx--col-lg-2">
                  {"Allocation percentages (%)"}
                </div>
                <div className="bx--col-lg-1 add-row-info-icon-allocation">
                  <TooltipIcon
                    direction="right"
                    tooltipText="Monthly spread of the row's total for each month in the whole numbers or decimals relative to the total. So, monthly value/row total x 100. For example, when the monthly spread is 1.0 in each of the 12 months, 1.0/12 x 100 = 8.33% for each month. Any calculation rounding differences between the orignal and new value are added to the last non-zero month."
                    align="start"
                  >
                    <Information16 />
                  </TooltipIcon>
                </div>
              </div>

              <div className="bx--row">
                {localStates.monthsList.map((month) => {
                  return (
                    <div
                      className="bx--col-lg"
                    >
                      {" "}
                      {month.text}{" "}
                    </div>
                  );
                })}
              </div>

              <div className="bx--row">
                {localStates.monthsList.map((month) => {
                  return (
                    <>
                      <div
                        className="bx--col-lg-1"
                      >
                        <TextInput
                          id={"total-value-txt"}
                          type={"number"}
                          value={
                            localStates.allocationPercentages.find((item) => {
                              return item.month === month.text;
                            }).values
                          }
                          disabled={true}
                        />
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);

export default RowCalculationGrid;
