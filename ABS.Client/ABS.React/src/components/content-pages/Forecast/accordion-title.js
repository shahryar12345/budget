import React from "react";
import { TooltipIcon, Checkbox } from "carbon-components-react";
import {
  Draggable16,
  ArrowUp16,
  ArrowDown16,
  InformationFilled20,
} from "@carbon/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { updateForecast } from "../../../core/_actions/ForecastActions";
import { swapArray } from "../../../helpers/array.helper";
import "./style.scss";
import { CheckRunForecastButton } from "./ValidateForecast";
const AccordianTitle = ({ index, title }) => {
  const state = useSelector((state) => state.ForecastReducer);
  const dispatch = useDispatch();

  const handleCheckBox = (e) => {
    const updatedStates = state;
    updatedStates.forecastSections[index].included = e.target.checked;
    dispatch(updateForecast({ ...state }, { forecastSections: updatedStates }));
    CheckRunForecastButton();
  };

  const handleMoveIconClick = (e, action) => {
    let updatedStates = state;
    switch (action) {
      case "up":
        updatedStates.forecastSections = swapArray(
          updatedStates.forecastSections,
          index,
          index - 1
        );
        break;
      case "down":
        updatedStates.forecastSections = swapArray(
          updatedStates.forecastSections,
          index,
          index + 1
        );
        break;
      default:
        break;
    }
    dispatch(
      updateForecast(
        { ...state },
        { forecastSections: [...updatedStates.forecastSections] }
      )
    );

    // stop the event since we do not want to trigger an AccordianItem expand/collapse event
    e.stopPropagation();
  };

  return (
    <div className="bx--row">
      {!state.forecastSections[index].sectionValidation.sectionValid ? (
        <div className="bx--col-lg-1 validation-heading-icon">
          <InformationFilled20 />
        </div>
      ) : null}
      {!state.forecastSections[index].sectionValidation.sectionValid ? (
        <div className="bx--col-lg-2 validation-heading">
          <strong>Required values missing</strong>
        </div>
      ) : null}

      <div className="bx--col-lg-4 forecast-method-heading">
        <div className="bx--row">
          <div className="bx--col-sm-1" style={{maxWidth:"2%"}}>
            <TooltipIcon direction="top" tooltipText="Drag It." align="start">
              <Draggable16 className={"title-icon"} />
            </TooltipIcon>
          </div>
          <div className={`bx--col-sm-1  ${index !== 0 ? "" : " title-icon-disabled"}`} style={{maxWidth:"2%" , paddingLeft:"0.5rem"}}>             
                  <TooltipIcon direction="top" tooltipText="Move forecast method up." align="start" >
                    <ArrowUp16
                      className={"title-icon"}
                      onClick={(e) => {
                        index !== 0 ?  handleMoveIconClick(e, "up"):
                        e.stopPropagation()
                      }}
                    />
                  </TooltipIcon>
          </div>
          <div className={`bx--col-sm-1 ${index + 1 !== state.forecastSections.length ? "" : " title-icon-disabled"}`}
            style={{maxWidth:"2%" , paddingLeft:"0.5rem"}}>
                <TooltipIcon direction="top" tooltipText="Move forecast method down." align="start">
                  <ArrowDown16
                    className={"title-icon"}
                    onClick={(e) => {
                      index + 1 !== state.forecastSections.length ? handleMoveIconClick(e, "down") : 
                      e.stopPropagation()
                    }}
                  />
                </TooltipIcon>
          </div>

          <div className="bx--col-sm-5" style={{paddingLeft:"10px"}}>
            <strong>
          {" "}
          {index + 1 + " "}
          {title === "Choose One" ? "" : title}
        </strong>
            </div>
      </div>
      </div>     
      {
        //typeof state.forecastSections[index].included !== "undefined"
        title !== "Choose One" ? (
          <div
            className={
              !state.forecastSections[index].sectionValidation.sectionValid
                ? "bx--offset-lg-4 include-when-run-heading"
                : "bx--offset-lg-6"
            }
          >
            <Checkbox
              id={"includedCheckBox-" + index}
              labelText={"Include when run forecast. "}
              checked={state.forecastSections[index].included}
              onClick={(e) => {
                handleCheckBox(e);
              }}
            />
          </div>
        ) : null
      }
    </div>
  );
};

export default AccordianTitle;
