import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {  Dropdown , NumberInput} from "carbon-components-react";
import { Information16 } from "@carbon/icons-react";
import { updateForecast } from "../../../../core/_actions/ForecastActions";

const CommonSection = ({ sectionIndex, sectionType }) => {
  const state = useSelector((state) => state.ForecastReducer);
  const dispatch = useDispatch();

  // this data is just dummy , will come from DB
  const SpreadMethods = [
    { id: 0, value: "Choose One" },
    { id: 1, value: "Spread method1" },
    { id: 2, value: "Spread method2" },
    { id: 3, value: "Spread method3" },
    { id: 4, value: "Spread method4" },
    { id: 5, value: "Spread method5" },
    { id: 6, value: "Spread method6" },
    { id: 7, value: "Spread method7" },
    { id: 8, value: "Spread method8" },
    { id: 9, value: "Spread method9" },
    { id: 10, value: "Spread method10" },
  ];

  const handleChange = (value, controlId) => {
    let updatedValue = value;
    const UpdatedforecastSections = [...state.forecastSections];
    if(controlId === "percentChange" && value === "")
    {
      updatedValue = 0;
    }
    UpdatedforecastSections[sectionIndex][controlId] =
      controlId === "percentChange" ? parseFloat(updatedValue) : updatedValue;

    dispatch(
      updateForecast({
        ...state,
        forecastSections: [...UpdatedforecastSections],
      })
    );
  };
 
  return (
    <div>
      <div className={"bx--row"}>
        <div className={"bx--col-lg"}>
          <div className={"bx--row"}>
            <div className={"bx--col-lg"}>{"Percent change (optional)"}</div>
          </div>
          <div className={"bx--row"}>
            <div className={"bx--col-lg-2"}>
              {/* Bug Fix : ABS-461 */}
              <NumberInput
                id={"percentChangeText-" + sectionIndex}
                className={"percent-change-textbox"} // Bug Fix : ABS-437
                invalidText="Number is not valid"
                max={90000}
                min={-90000}
                step={1}
                value={state.forecastSections[sectionIndex].percentChange}
                onChange={(e) => handleChange(e.imaginaryTarget.value, "percentChange")}
                />
            </div>
          </div>
          <br />

          {sectionType !== "ratio" ? (
            <div className={"bx--row"}>
              <div className={"bx--col-lg"}>{"Spread method (optional)"}</div>
            </div>
          ) : null}
          {sectionType !== "ratio" ? (
            <div className={"bx--row"}>
              <div className={"bx--col-lg-6"}>
                <Dropdown
                  id={"spreadMethod" + sectionIndex}
                  type="text"
                  items={SpreadMethods}
                  itemToString={(item) => (item ? item.value : "")}
                  disabled={true}
                  selectedItem={SpreadMethods.find(
                    (x) =>
                      x.id === state.forecastSections[sectionIndex]?.spreadMethod
                  )}
                  onChange={(e) =>
                    handleChange(e.selectedItem.id, "spreadMethod")
                  }
                />
              </div>
              <div className={"bx--col-lg-1"}>
                <Information16 className={"dropdown-info-Icon"} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CommonSection;
