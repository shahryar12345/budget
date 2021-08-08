import React from "react";
import { Add20, Subtract20 } from "@carbon/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { TooltipIcon } from "carbon-components-react";
import { updateForecast } from "../../../core/_actions/ForecastActions";
import {
  defaultforecastSection,
  defaultforecastSectionForRatioType,
} from "./Data/forecast-section-default-values";
import { CheckRunForecastButton } from "./ValidateForecast";

const AddSubtractButtonSet = ({ showAdd, showSubtract, index, sectionIndex }) => {
  const state = useSelector((state) => state.ForecastReducer);
  const dispatch = useDispatch();
  const NewforecastSections = JSON.parse(
    JSON.stringify(defaultforecastSection)
  );

  const handleAddSubtractClick = (e, action) => {
    const UpdatedforecastSections = [...state.forecastSections]; // Deep copy of Array

    switch (action) {
      case "add":
        if (index === -1) {
          UpdatedforecastSections.push(NewforecastSections);
        } else {
          UpdatedforecastSections.splice(index , 0, NewforecastSections);
          // Bug Fix : ABS-498 . SS
        }
        break;
      case "sub":
        UpdatedforecastSections.splice(index, 1);
        break;
      default:
        break;
    }

    // Disable All Button if thier is no step is on the screen.
    if(UpdatedforecastSections.length === 0)
    {
      let disabledButton;
      disabledButton = state.validateButton;
      disabledButton.disabled = true;
      state.validateButton = disabledButton;
      disabledButton = state.runForecastButton;
      disabledButton.disabled = true;
      state.runForecastButton = disabledButton; 
      state.forecast_model_Id = "";
      state.forecast_model_code= "";
      state.forecast_model_name= "";
      state.forecast_model_description= "";
      state.forecast_model_selected= false;
    }
    dispatch(
      updateForecast({ ...state, forecastSections: UpdatedforecastSections, selectedIndex: sectionIndex })
    );

     // Check for Enable/Disable of Run Forecast Button
     if (action === "sub")
     { // Bug Fix  : ABS-390
       CheckRunForecastButton();
      }
  };
  return (
    <div>
      {showAdd ? (
        <TooltipIcon
          direction="top"
          tooltipText="Add a forecast method below."
          align="start"
        >
          <Add20
            onClick={(e) => {
              handleAddSubtractClick(e, "add");
            }}
          ></Add20>
        </TooltipIcon>
      ) : null}
      {showSubtract ? (
        <TooltipIcon
          direction="top"
          tooltipText="Remove the forecast method below."
          align="start"
        >
          <Subtract20
            onClick={(e) => {
              handleAddSubtractClick(e, "sub");
            }}
          ></Subtract20>
        </TooltipIcon>
      ) : null}
    </div>
  );
};

export default AddSubtractButtonSet;
