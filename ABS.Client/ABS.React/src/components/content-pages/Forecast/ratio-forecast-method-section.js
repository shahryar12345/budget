import React from "react";
import { Checkbox } from "carbon-components-react";
import { useSelector, useDispatch } from "react-redux";
import RatioSourceSection from "./Forecast-Sub-Sections/Ratio/ratio-source-section";
import RatioTargetSection from "./Forecast-Sub-Sections/Ratio/ratio-target-section";
import CommonSection from "./Forecast-Sub-Sections/common-section";
import { updateForecast } from "../../../core/_actions/ForecastActions";

const RatioForecastMethodSection = ({ sectionIndex ,dimensionGroupedData }) => {
  const state = useSelector((state) => state.ForecastReducer);
  const dispatch = useDispatch();
  const handleChange = (value) => {
    const UpdatedforecastSections = [...state.forecastSections];
    UpdatedforecastSections[sectionIndex].automaticallyUpdate = value;
    dispatch(
      updateForecast({
        ...state,
        forecastSections: [...UpdatedforecastSections],
      })
    );
  };
  return (
    <div className={"section-container"}>
      <div className={"bx--row"}>
        <Checkbox
          id={"AutoUpdateCheckBox-" + sectionIndex}
          labelText={
            'Automatically update values connected by formula (e.g., When "Number  of admissions" changes, update "Patient days")'
          }
          checked={state.forecastSections[sectionIndex].automaticallyUpdate}
          onClick={(e) => {
            handleChange(e.target.checked);
          }}
        />
      </div>

      <RatioSourceSection  sectionIndex={sectionIndex} dimensionGroupedData={dimensionGroupedData}/>

      <RatioTargetSection  sectionIndex={sectionIndex} dimensionGroupedData={dimensionGroupedData}/>

      <CommonSection
        sectionIndex={sectionIndex}
        sectionType={"ratio"}
      ></CommonSection>
    </div>
  );
};

export default RatioForecastMethodSection;
